import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "../public/icons");

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" fill="#C4622D"/>
  <text
    x="256"
    y="348"
    text-anchor="middle"
    fill="#FAFAF7"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="300"
    font-weight="700"
  >B</text>
</svg>
`.trim();

async function writePng(size, filename) {
  const outputPath = path.join(iconsDir, filename);
  await sharp(Buffer.from(iconSvg)).resize(size, size).png().toFile(outputPath);
}

await mkdir(iconsDir, { recursive: true });
await writePng(192, "icon-192.png");
await writePng(512, "icon-512.png");
await writePng(180, "apple-touch-icon.png");
await writeFile(path.join(iconsDir, "icon.svg"), `${iconSvg}\n`, "utf8");
