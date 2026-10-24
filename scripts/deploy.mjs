/* deploy.mjs — publish to awalimgroup.com (Hostinger) over SSH.
   pack → upload → checksum → back up what it replaces → extract → crawl the live site.
   Needs the `awalim-hostinger` host in ~/.ssh/config (key-based, no password).
   Files already in public_html that the package doesn't contain are left alone. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = process.env.DEPLOY_HOST || "awalim-hostinger";
const WEBROOT = "domains/awalimgroup.com/public_html";
const LIVE = "https://awalimgroup.com";
const quiet = (s) => s.split("\n").filter((l) => !/post-quantum|store now|openssh\.com\/pq/.test(l)).join("\n").trim();
const run = (cmd, args, opts = {}) => quiet(execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], ...opts }));
const ssh = (script) => run("ssh", ["-o", "BatchMode=yes", HOST, script]);

console.log("1/5 pack");
execFileSync("node", ["scripts/pack.mjs"], { cwd: ROOT, stdio: "inherit" });
const zip = readdirSync(join(ROOT, "dist")).filter((f) => f.endsWith(".zip"))
  .map((f) => join(ROOT, "dist", f)).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
const sum = createHash("sha256").update(readFileSync(zip)).digest("hex");

console.log(`2/5 upload ${zip.split("/").pop()}`);
run("scp", ["-q", zip, `${HOST}:deploy-upload.zip`]);
const remoteSum = ssh("sha256sum deploy-upload.zip").split(/\s+/)[0];
if (remoteSum !== sum) { console.error(`✖ checksum mismatch: local ${sum} remote ${remoteSum}`); process.exit(1); }
console.log("   ✔ checksum matches");

console.log("3/5 back up the files this release replaces");
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
ssh(`set -e; mkdir -p deploy-backups; cd ${WEBROOT}; unzip -Z1 ~/deploy-upload.zip | while read f; do [ -f "$f" ] && echo "$f"; done > ~/deploy-backups/list-${stamp}.txt; ` +
    `if [ -s ~/deploy-backups/list-${stamp}.txt ]; then tar -czf ~/deploy-backups/site-${stamp}.tgz -T ~/deploy-backups/list-${stamp}.txt; fi; ` +
    `ls -1t ~/deploy-backups/site-*.tgz 2>/dev/null | tail -n +6 | xargs -r rm -f`);
console.log(`   ✔ ~/deploy-backups/site-${stamp}.tgz (last 5 kept)`);

console.log("4/5 extract");
ssh(`set -e; cd ${WEBROOT}; unzip -o -q ~/deploy-upload.zip -d .; rm -f ~/deploy-upload.zip`);

console.log(`5/5 crawl ${LIVE}`);
try {
  console.log(run("node", ["scripts/crawl-all.mjs", LIVE], { timeout: 600000 }));
} catch (e) {
  console.error(quiet(String(e.stdout || "")) || e.message);
  console.error(`✖ live crawl failed — previous files: ssh ${HOST} 'cd ${WEBROOT} && tar -xzf ~/deploy-backups/site-${stamp}.tgz'`);
  process.exit(1);
}
console.log(`✔ deployed ${LIVE}`);
