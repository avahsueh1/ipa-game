import fs from "node:fs/promises";
import { sounds } from "../src/data.ts";
const names = sounds.map((sound) => sound.name);
const aliases = {
  "Voiced bilabial nasal": "Bilabial nasal",
  "Voiced alveolar nasal": "Alveolar nasal",
};
const titles = names.map((n) => `File:${aliases[n] || n}.ogg`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function request(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const r = await fetch(url);
    if (r.ok) return r;
    if (r.status !== 429 && r.status !== 503)
      throw Error(`${r.status}: ${url}`);
    const delay = Math.max(Number(r.headers.get("retry-after")) || 60, 60);
    console.log(
      `Source requested a ${delay}s pause; preserving the import and waiting.`,
    );
    await sleep(delay * 1000);
  }
  throw Error(`Rate limit: ${url}`);
}
const url = new URL("https://commons.wikimedia.org/w/api.php");
url.search = new URLSearchParams({
  action: "query",
  format: "json",
  prop: "imageinfo|revisions",
  iiprop: "url|extmetadata|user",
  rvprop: "content",
  rvslots: "main",
  titles: titles.join("|"),
});
let body;
try {
  body = JSON.parse(
    await fs.readFile("artifacts/audio-source-metadata.json", "utf8"),
  );
} catch {
  body = await (await request(url)).json();
}
await fs.mkdir("artifacts", { recursive: true });
await fs.writeFile(
  "artifacts/audio-source-metadata.json",
  JSON.stringify(body, null, 2),
);
const pages = Object.values(body.query.pages);
const credits = [],
  errors = [];
const plain = (s) =>
  (s || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"');
for (let i = 0; i < names.length; i++) {
  try {
    const page = pages.find((p) => p.title === titles[i]);
    const info = page?.imageinfo?.[0];
    if (!info) throw Error(`Missing ${titles[i]}`);
    const meta = info.extmetadata,
      wiki = page.revisions?.[0]?.slots?.main?.["*"] || "";
    let author = plain(meta.Artist?.value);
    if (!author) {
      const authorLine = wiki.match(
        /(?:[Aa]uthor\s*=|[Rr]ecorded by|[Cc]reated by)([^\n]+)/,
      )?.[1];
      author = authorLine
        ? plain(authorLine)
            .replace(
              /\[\[(?:[Uu]ser:)?([^|\]]+)\|?([^\]]*)\]\]/g,
              (_, a, b) => b || a,
            )
            .trim()
        : "";
    }
    if (!author && /Peter Isotalo/i.test(wiki)) author = "Peter Isotalo";
    if (!author)
      author = `Wikimedia Commons contributor ${info.user} (see source for attribution)`;
    const audioUrl = new URL(info.url);
    audioUrl.search = "";
    const path = `public/audio/sound-${i}.ogg`;
    try {
      await fs.access(path);
    } catch {
      await sleep(10000);
      const audio = await request(audioUrl);
      await fs.writeFile(path, Buffer.from(await audio.arrayBuffer()));
    }
    credits.push({
      id: `sound-${i}`,
      name: names[i],
      source: info.descriptionurl,
      author,
      license: plain(meta.LicenseShortName?.value),
      licenseUrl: meta.LicenseUrl?.value || "",
      url: String(audioUrl),
    });
    console.log(`Ready ${i + 1}/${names.length}: ${names[i]}`);
  } catch (error) {
    errors.push(String(error));
    console.error(error);
  }
}
await fs.writeFile(
  "src/audio-credits.json",
  JSON.stringify(credits, null, 2) + "\n",
);
if (errors.length) process.exitCode = 1;
