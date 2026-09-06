/* ─────────────────────────────────────────────────────────────
   لوحة تحكّم عوالِم — the local admin system.

   The site is built from JSON, so administering it means editing JSON. This
   serves an editor over that, and it is deliberately NOT part of the site:
   scripts/ is in .vercelignore, so nothing here is ever deployed, and the
   server binds to 127.0.0.1 rather than 0.0.0.0.

   That bind stops the NETWORK. It does not stop the BROWSER. Any page the owner
   visits while this runs can send requests to 127.0.0.1, and a first draft of
   this file assumed otherwise — "no login because there is no exposure to
   protect", which was wrong and was measured to be wrong. With a forged Host a
   request returned 200; with a foreign Origin a write was accepted and
   processed, and stopped only because the payload happened to break the build.
   DNS rebinding makes that reachable in practice: the attacker's domain
   re-resolves to 127.0.0.1, the browser then treats the page as same-origin,
   and CORS preflight — which is the only thing standing in the way today — no
   longer applies.

   So every request is checked for being genuinely local before it is routed:
   the Host must be a loopback authority we recognise, any Origin must be one
   too, and Sec-Fetch-Site must not say the request came from another site. That
   last one matters for the simple-request POST that carries no preflight at
   all.

   The rule the whole thing is built around: the panel cannot break the site.
   Every save is validated as JSON, the previous file is kept, the site is
   rebuilt, and if the build fails the previous file is put back and the error
   is reported. A save that breaks the build is not a save.
   ───────────────────────────────────────────────────────────── */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CONTENT = join(ROOT, "src", "content");
const BACKUPS = join(ROOT, ".panel-backups");
const PORT = Number(process.argv[2] || 8890);

const listContent = () => {
  const files = [];
  for (const f of readdirSync(CONTENT)) if (f.endsWith(".json") && !GENERATED.has(f)) files.push(f);
  const en = join(CONTENT, "en");
  if (existsSync(en)) for (const f of readdirSync(en)) if (f.endsWith(".json")) files.push("en/" + f);
  return files.sort();
};

/* Generated, not authored — the build writes these and nobody edits them.
   signing.json is the important one: it carries the public key and signature
   that /verify checks, and the build only re-signs when the stats fingerprint
   CHANGES. So a signing.json whose payload matches the current numbers is kept
   exactly as found, public key included — which means anyone able to write this
   file could substitute their own keypair and have /verify pass against it.
   Hiding it from the file listing was not enough; it has to be unreachable. */
const GENERATED = new Set(["signing.json"]);

const safePath = (rel) => {
  /* only ever inside src/content, only ever .json */
  if (!/^(en\/)?[a-z0-9-]+\.json$/i.test(rel)) return null;
  /* lower-cased because macOS and Windows filesystems are case-insensitive:
     SIGNING.JSON opens the same bytes as signing.json, and a case-sensitive
     denylist against a case-insensitive filesystem is not a denylist */
  if (GENERATED.has(rel.replace(/^en\//i, "").toLowerCase())) return null;
  const p = join(CONTENT, rel);
  return p.startsWith(CONTENT) ? p : null;
};

/* A content file is data the build interpolates, never a place to put keys that
   change how objects behave. __proto__ and friends are stripped before anything
   is written — the merge in the build walks these objects deeply, and a content
   file is exactly the wrong thing to have to trust. */
const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const scrub = (v) => {
  if (Array.isArray(v)) return v.map(scrub);
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) if (!FORBIDDEN_KEYS.has(k)) out[k] = scrub(val);
    return out;
  }
  return v;
};
const hasForbidden = (raw) => /"(__proto__|constructor|prototype)"\s*:/.test(raw);

const build = () => new Promise((res) => {
  execFile(process.execPath, [join(ROOT, "build.mjs")], { cwd: ROOT, timeout: 120000 }, (err, stdout, stderr) =>
    res({ ok: !err, out: (stdout || "").trim().split("\n").slice(-3).join("\n"), err: (stderr || String(err || "")).trim().slice(0, 900) }));
});

const json = (res, code, body) => {
  res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
};

const LOCAL_HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`, `[::1]:${PORT}`]);
const isLocal = (req) => {
  /* a forged Host is the precondition for DNS rebinding — refuse anything we
     did not name ourselves */
  if (!LOCAL_HOSTS.has(req.headers.host || "")) return false;
  const origin = req.headers.origin;
  if (origin) { try { if (!LOCAL_HOSTS.has(new URL(origin).host)) return false; } catch { return false; } }
  /* a cross-site POST with a simple content-type gets no preflight, so CORS
     never sees it; the browser still tells us where it came from */
  const site = req.headers["sec-fetch-site"];
  return !site || site === "same-origin" || site === "none";
};

/* One malformed request must never end the session. decodeURIComponent throws a
   URIError on a lone "%", and an uncaught throw in a request handler takes the
   whole process with it — a request that costs an attacker nothing and costs
   the owner their admin tool. Every request is wrapped, and the handler that
   follows is free to be direct. */
const server = createServer((req, res) => {
  handle(req, res).catch((e) => {
    console.warn("request failed:", String(e && e.message).slice(0, 140));
    if (!res.headersSent) { res.writeHead(400, { "content-type": "text/plain" }); res.end("bad request"); }
    else res.end();
  });
});

const handle = async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const path = url.pathname;

  if (!isLocal(req)) {
    console.warn(`refused a non-local request · host=${req.headers.host} origin=${req.headers.origin || "-"} site=${req.headers["sec-fetch-site"] || "-"}`);
    res.writeHead(403, { "content-type": "text/plain" });
    return res.end("not local");
  }

  if (path === "/" || path === "/index.html") {
    const html = readFileSync(join(HERE, "index.html"), "utf8");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    return res.end(html);
  }

  if (path === "/api/files") return json(res, 200, { files: listContent() });

  if (path.startsWith("/api/file/")) {
    let rel;
    try { rel = decodeURIComponent(path.slice("/api/file/".length)); }
    catch { return json(res, 400, { error: "malformed path" }); }
    const p = safePath(rel);
    if (!p || !existsSync(p)) return json(res, 404, { error: "not found" });

    if (req.method === "GET") return json(res, 200, { rel, text: readFileSync(p, "utf8") });

    if (req.method === "PUT") {
      let body = "";
      for await (const chunk of req) { body += chunk; if (body.length > 4e6) return json(res, 413, { error: "too large" }); }
      let raw, parsed;
      try { raw = JSON.parse(body).text; parsed = scrub(JSON.parse(raw)); }
      catch (e) { return json(res, 400, { error: "not valid JSON — nothing was written", detail: String(e.message) }); }
      if (hasForbidden(raw)) return json(res, 400, { error: "that file contains a key that changes how objects behave (__proto__, constructor, prototype) — nothing was written" });

      /* keep the old one before touching anything */
      if (!existsSync(BACKUPS)) mkdirSync(BACKUPS, { recursive: true });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backup = join(BACKUPS, `${rel.replace("/", "__")}.${stamp}.json`);
      copyFileSync(p, backup);

      writeFileSync(p, JSON.stringify(parsed, null, 2) + "\n", "utf8");
      const b = await build();
      if (!b.ok) {
        copyFileSync(backup, p);          /* a save that breaks the build is not a save */
        await build();
        return json(res, 422, { error: "the build failed — your change was rolled back", detail: b.err });
      }
      return json(res, 200, { ok: true, built: b.out, backup: backup.replace(ROOT + "/", "") });
    }
  }

  if (path === "/api/build" && req.method === "POST") return json(res, 200, await build());

  res.writeHead(404, { "content-type": "text/plain" });
  res.end("not found");
};

server.on("clientError", (err, socket) => {
  if (socket.writable) socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

/* localhost only — this is an administration tool, not a service */
server.listen(PORT, "127.0.0.1", () => {
  console.log(`لوحة تحكّم عوالِم → http://127.0.0.1:${PORT}`);
  console.log(`editing ${listContent().length} content files · backups in .panel-backups/`);
  console.log("bound to 127.0.0.1 only · never deployed (scripts/ is in .vercelignore)");
});
