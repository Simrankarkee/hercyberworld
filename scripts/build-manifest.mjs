// Scans content/learn, content/defend and content/connect and writes content/manifest.json.
// Runs automatically on GitHub (see .github/workflows/deploy.yml). Run locally with: node scripts/build-manifest.mjs
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const IMG = /\.(png|jpe?g|webp|gif)$/i;

function parseFM(text) {
  const m = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/.exec(text);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i < 1) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, "");
    if (v === "true") v = true; else if (v === "false") v = false;
    meta[k] = v;
  }
  return { meta, body: text.slice(m[0].length) };
}
function countExercises(body) {
  const m = /^##\s+Exercises\s*$([\s\S]*?)(?=^---\s*$|(?![\s\S]))/m.exec(body);
  if (!m) return 0;
  return m[1].split(/\r?\n/).filter((l) => /^(\*\*)?\d+\.|^\*\*\d+\./.test(l.trim())).length;
}
const numSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

function scan(section, file) {
  const dir = join(ROOT, "content", section);
  if (!existsSync(dir)) return [];
  const out = [];
  for (const slug of readdirSync(dir).sort(numSort)) {
    if (slug.startsWith("_") || slug.startsWith(".")) continue;
    const folder = join(dir, slug);
    if (!statSync(folder).isDirectory()) continue;
    const mdPath = join(folder, file);
    if (!existsSync(mdPath)) { console.warn(`skip ${section}/${slug}: no ${file}`); continue; }
    const { meta, body } = parseFM(readFileSync(mdPath, "utf8"));
    if (meta.draft === true) continue;
    const files = readdirSync(folder).sort(numSort);
    const cover = files.find((f) => /^cover\./i.test(f) && IMG.test(f)) || null;
    const item = { slug, title: meta.title || slug, summary: meta.summary || "", date: meta.date || "", tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? String(meta.tags).split(",").map((s) => s.trim()) : []) };
    if (section === "connect") {
      Object.assign(item, { board: meta.board || "community", pinned: meta.pinned === true, author: meta.author || "" });
    } else {
      const images = files.filter((f) => IMG.test(f) && f !== cover);
      const type = meta.type === "slides" || meta.type === "blog" ? meta.type : (images.length ? "slides" : "blog");
      const textSlides = type === "slides" ? body.split(/\n\s*---\s*\n/).map((s) => s.trim()).filter(Boolean).length : 0;
      Object.assign(item, {
        type, level: meta.level || "", cover,
        images: type === "slides" ? images : [],
        textSlides,
        pdf: files.find((f) => /\.pdf$/i.test(f)) || null,
        minutes: Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200)),
        starter: meta.starter === true,
        exercises: countExercises(body),
        author: meta.author || ""
      });
      if (section === "learn") item.path = meta.path || "fundamentals";
      else item.topic = meta.topic || "phishing";
    }
    out.push(item);
  }
  return out;
}

const manifest = {
  generated: new Date().toISOString(),
  learn: scan("learn", "lesson.md"),
  defend: scan("defend", "lesson.md"),
  connect: scan("connect", "topic.md")
};
writeFileSync(join(ROOT, "content", "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`manifest: ${manifest.learn.length} learn, ${manifest.defend.length} defend, ${manifest.connect.length} connect`);
