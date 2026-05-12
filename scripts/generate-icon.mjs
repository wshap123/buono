import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#C4622D"/>
  <text
    x="256"
    y="268"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#FAF3E8"
    font-family="Georgia, 'Palatino Linotype', 'Book Antiqua', serif"
    font-size="104"
    font-style="italic"
    font-weight="600"
  >Buono</text>
</svg>
`.trim();

async function writePng(size, filename) {
  const outputPath = path.join(publicDir, filename);

  await sharp(Buffer.from(iconSvg))
    .resize(size, size)
    .removeAlpha()
    .png()
    .toFile(outputPath);
}

await writePng(192, "icon-192.png");
await writePng(512, "icon-512.png");
