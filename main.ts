// Entry point for the bring-the-humans-03 ad.
// The ad itself is the rendered video file ad-v10.mp4, already posted on TikTok.
// This program's only job is to hand the house the video's address: it copies
// VIDEO.json from this repo into the output directory the grader reads.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "VIDEO.json");
const dest = join(outDir, "VIDEO.json");

if (!existsSync(src)) {
  console.error(`VIDEO.json not found next to main.ts (${src})`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);

// Read the copy back and check it really names a TikTok video before we
// claim success: a silent bad copy would score zero with no error.
const parsed = JSON.parse(readFileSync(dest, "utf8")) as { url?: unknown };
if (typeof parsed.url !== "string" || !parsed.url.startsWith("https://www.tiktok.com/")) {
  console.error(`copied VIDEO.json has no TikTok url: ${JSON.stringify(parsed)}`);
  process.exit(1);
}
console.log(`wrote ${dest} -> ${parsed.url}`);
