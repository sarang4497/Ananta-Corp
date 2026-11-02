// Turn a tall full-page screenshot into a side-by-side column sheet for review.
// usage: node scripts/tall-sheet.mjs in.png out.jpg cols [scale]
import sharp from 'sharp';
const [inp, out, colsArg, scaleArg] = process.argv.slice(2);
const cols = +colsArg, scale = +(scaleArg ?? 0.5);
const meta = await sharp(inp).metadata();
const W = Math.round(meta.width * scale), H = Math.round(meta.height * scale);
const img = await sharp(inp).resize(W, H).toBuffer();
const sliceH = Math.ceil(H / cols);
const parts = [];
for (let i = 0; i < cols; i++) {
  const top = i * sliceH, h = Math.min(sliceH, H - top);
  if (h <= 0) break;
  parts.push({input: await sharp(img).extract({left: 0, top, width: W, height: h}).toBuffer(), left: i * (W + 8), top: 0});
}
await sharp({create: {width: cols * (W + 8), height: sliceH, channels: 3, background: '#f0f'}}).composite(parts).jpeg({quality: 72}).toFile(out);
console.log(out, cols * (W + 8), sliceH);
