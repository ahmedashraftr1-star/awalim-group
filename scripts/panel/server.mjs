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

/* Run one of the project's own scripts and report what it said. Same shape as
   build(): never throws, always resolves, so a failing check reports a failure
   rather than taking the request down with it. */
const run = (args) => new Promise((res) => {
  execFile(process.execPath, args.map((a) => join(ROOT, a)), { cwd: ROOT, timeout: 300000 }, (err, stdout, stderr) =>
    res({ ok: !err, out: (stdout || "").trim(), err: (stderr || String(err || "")).trim().slice(0, 900) }));
});

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

  /* ── verify ───────────────────────────────────────────────────────────────
     A panel that changes a site and cannot say whether the site still holds up
     is a text editor with extra steps. This runs the project's OWN checks — the
     same six `npm test` runs — and returns what they found.

     This is the capability the comparison turned on. Measured today: the
     sibling platform's admin is 57 pages and 49 routes, none of which had ever
     been swept; the first sweep found 3 WCAG violations, 13 console errors and
     four undersized navigation targets repeated across every route. Size was
     never the difference. Knowing is.

     Kept OUT of the save path deliberately. The rollback on a failed build must
     stay fast, and a full audit takes minutes; a save that hangs for three
     minutes is a save the owner learns to avoid. Verification is a button. */
  if (path === "/api/verify" && req.method === "POST") {
    const checks = [
      { id: "merge",    label: "دمج المحتوى",        cmd: ["scripts/merge-test.mjs"] },
      { id: "headers",  label: "ترويسات الأمان",     cmd: ["scripts/headers-test.mjs"] },
      { id: "contrast", label: "التباين اللوني",     cmd: ["scripts/contrast.mjs"] },
      { id: "links",    label: "الروابط الداخلية",   cmd: ["scripts/check-links.mjs"] },
    ];
    const out = [];
    for (const c of checks) {
      const t0 = Date.now();
      const r = await run(c.cmd);
      out.push({ ...c, cmd: undefined, ok: r.ok, ms: Date.now() - t0,
                 detail: (r.ok ? r.out : r.err).split("\n").filter(Boolean).slice(-3).join(" · ").slice(0, 300) });
    }
    return json(res, 200, { checks: out, allOk: out.every((c) => c.ok) });
  }

  /* ── what is still unfinished ─────────────────────────────────────────────
     Computed from the content, never a list somebody maintains by hand — a
     hand-kept list is wrong the first time anyone edits around it. Reports the
     three things this site keeps promising and has not filled: a public number
     with no confirmation, a proof slot standing empty, and a case with no
     architecture to draw. */
  if (path === "/api/unfinished") {
    const read = (rel) => { try { return JSON.parse(readFileSync(join(CONTENT, rel), "utf8")); } catch { return null; } };
    const items = [];
    const site = read("site.json");
    for (const [k, v] of Object.entries(site?.stats ?? {})) {
      if (v && typeof v === "object" && v.confirmed !== true)
        items.push({ kind: "stat", file: "site.json", key: k,
                     label: `الرقم «${v.label ?? k}» = ${v.value ?? "—"} غير مؤكَّد` });
    }
    const cases = read("cases.json");
    for (const c of cases?.cases ?? []) {
      if (!c.flow && !c.architecture)
        items.push({ kind: "case", file: "cases.json", key: c.slug ?? c.id ?? c.title,
                     label: `الحالة «${c.title ?? c.slug}» بلا معماريّة — مخطّط التدفّق لا يُرسم` });
    }
    const press = read("press.json");
    if (!(press?.assets?.logos ?? []).length)
      items.push({ kind: "proof", file: "press.json", key: "assets.logos", label: "لا شعارات عملاء — خانة الإثبات فارغة" });
    if (!(press?.testimonials ?? []).length)
      items.push({ kind: "proof", file: "press.json", key: "testimonials", label: "لا شهادات — خانة الإثبات فارغة" });
    return json(res, 200, { items, count: items.length });
  }

  /* ── history ──────────────────────────────────────────────────────────────
     Every save already keeps a timestamped copy. Backups nobody can reach are
     not backups, so they are listed and restorable — and a restore goes through
     the same build-and-roll-back path as any other write, because a restore
     that breaks the site is not a rescue. */
  /* Restoring is the other half. A list of versions nobody can go back to is a
     receipt, not a safety net — and the restore takes the SAME path as any
     other write: back up what is there now (so undoing an undo is possible),
     write, build, and roll back if the build fails. A restore that breaks the
     site is not a rescue. */
  if (path.startsWith("/api/restore/") && req.method === "POST") {
    let name;
    try { name = decodeURIComponent(path.slice("/api/restore/".length)); }
    catch { return json(res, 400, { error: "malformed path" }); }
    /* The backup filename is "<rel with / as __>.<ISO stamp>.json" — so the
       target is everything BEFORE the stamp, not the first dot-segment.
       Splitting on the first dot turned "site.json.<stamp>.json" into "site",
       which safePath then rejected for having no .json, and every restore
       failed with a message about the version not belonging to an editable
       file. Caught by trying a restore rather than reasoning about one. */
    const m = /^(.+)\.(\d{4}-\d{2}-\d{2}T[\dZ-]+)\.json$/.exec(name);
    if (!m || name.includes("..")) return json(res, 400, { error: "bad version name" });
    const src = join(BACKUPS, name);
    if (!existsSync(src)) return json(res, 404, { error: "no such version" });
    const rel = m[1].replace("__", "/");
    const p = safePath(rel);
    if (!p || !existsSync(p)) return json(res, 404, { error: "that version does not belong to an editable file" });

    let restored;
    try { restored = scrub(JSON.parse(readFileSync(src, "utf8"))); }
    catch (e) { return json(res, 422, { error: "that saved version is not valid JSON — nothing was written", detail: String(e.message) }); }

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const undo = join(BACKUPS, `${rel.replace("/", "__")}.${stamp}.json`);
    copyFileSync(p, undo);
    writeFileSync(p, JSON.stringify(restored, null, 2) + "\n", "utf8");
    const b = await build();
    if (!b.ok) {
      copyFileSync(undo, p);
      await build();
      return json(res, 422, { error: "that version no longer builds — nothing was changed", detail: b.err });
    }
    return json(res, 200, { ok: true, rel, built: b.out, undo: undo.replace(ROOT + "/", "") });
  }

  if (path.startsWith("/api/history/")) {
    let rel;
    try { rel = decodeURIComponent(path.slice("/api/history/".length)); }
    catch { return json(res, 400, { error: "malformed path" }); }
    if (!safePath(rel)) return json(res, 404, { error: "not found" });
    if (!existsSync(BACKUPS)) return json(res, 200, { versions: [] });
    const prefix = rel.replace("/", "__") + ".";
    const versions = readdirSync(BACKUPS).filter((f) => f.startsWith(prefix))
      .map((f) => ({ file: f, when: f.slice(prefix.length).replace(/\.json$/, "").replace(/-/g, ":").replace("T", " ").slice(0, 19) }))
      .sort((a, b) => b.file.localeCompare(a.file)).slice(0, 25);
    return json(res, 200, { versions });
  }


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
