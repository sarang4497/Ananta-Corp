// Build a labelled contact sheet from a list of images (QA helper).
// usage: node scripts/contact-sheet.mjs out.jpg tileW tileH cols img1 img2 ...
import sharp from 'sharp';
import path from 'node:path';
const [out, tw, th, cols, ...files] = process.argv.slice(2);
const W = +tw, H = +th, C = +cols, LAB = 18;
const rows = Math.ceil(files.length / C);
const tiles = await Promise.all(files.map(async (f, i) => {
  const img = await sharp(f).resize(W, H, {fit: 'contain', background: '#ffffff'}).toBuffer();
  const name = path.basename(f).slice(0, Math.floor(W / 6.5)).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const label = Buffer.from(`<svg width="${W}" height="${LAB}"><rect width="100%" height="100%" fill="#111"/><text x="4" y="13" font-size="11" fill="#fff" font-family="Arial">${name}</text></svg>`);
  return [{input: img, left: (i % C) * W, top: Math.floor(i / C) * (H + LAB)}, {input: label, left: (i % C) * W, top: Math.floor(i / C) * (H + LAB) + H}];
}));
await sharp({create: {width: W * C, height: rows * (H + LAB), channels: 3, background: '#ddd'}}).composite(tiles.flat()).jpeg({quality: 80}).toFile(out);
console.log(out);
