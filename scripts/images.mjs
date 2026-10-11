// Optimises the photos listed in src/gallery.mjs into public/images/ (AVIF + WebP at several widths,
// plus one JPEG fallback) and writes src/images/manifest.json with their dimensions.
// Also derives the logo mark (dark / light) and the favicon from src/images/original/.
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { photos } from '../src/gallery.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'src/images/original');
const OUT = path.join(root, 'public/images');
const WIDTHS = [480, 960, 1600, 2400];
const FALLBACK = 960;
const force = process.argv.includes('--force');

const exists = (p) => access(p).then(() => true, () => false);
await mkdir(OUT, { recursive: true });

const manifest = {};
for (const p of photos) {
  const input = path.join(SRC, p.file);
  const base = sharp(input).rotate();
  const { width, height } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const widths = WIDTHS.filter((w) => w <= width);
  manifest[p.slug] = { width, height, widths, fallback: FALLBACK };

  const jobs = [];
  for (const w of widths) {
    for (const [ext, opts] of [['avif', { quality: 52, effort: 4 }], ['webp', { quality: 76 }]]) {
      const out = path.join(OUT, `${p.slug}-${w}.${ext}`);
      if (force || !(await exists(out))) jobs.push(base.clone().resize({ width: w })[ext](opts).toFile(out));
    }
  }
  const jpg = path.join(OUT, `${p.slug}-${FALLBACK}.jpg`);
  if (force || !(await exists(jpg))) jobs.push(base.clone().resize({ width: FALLBACK }).jpeg({ quality: 78, mozjpeg: true }).toFile(jpg));
  await Promise.all(jobs);
  console.log(`${p.slug}  ${width}x${height}  [${widths.join(', ')}]${jobs.length ? '' : '  (cached)'}`);
}

// Open Graph image (1200x630 JPEG) from the first photo.
await sharp(path.join(SRC, photos[0].file)).rotate().resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, 'og-image.jpg'));

// Logo: keep only the mountain mark (the wordmark is set as live text) and recolour it through its alpha channel.
const logo = sharp(path.join(SRC, 'logoWithName.png'));
const { data, info } = await logo.clone().ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
const rowHasInk = (y) => { for (let x = 0; x < info.width; x++) if (data[y * info.width + x] > 16) return true; return false; };
let top = 0; while (!rowHasInk(top)) top++;
let bottom = top; while (bottom < info.height && rowHasInk(bottom)) bottom++; // first empty row = gap above the wordmark
const cropped = await sharp(path.join(SRC, 'logoWithName.png')).extract({ left: 0, top, width: info.width, height: bottom - top }).png().toBuffer();
const mark = await sharp(cropped).trim().png().toBuffer();
const alpha = await sharp(mark).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
for (const [name, color] of [['logo-mark-dark', '#23412F'], ['logo-mark-light', '#FFFFFF']]) {
  // Two steps: sharp applies resize before joinChannel within a single pipeline.
  const full = await sharp({ create: { width: alpha.info.width, height: alpha.info.height, channels: 3, background: color } })
    .joinChannel(alpha.data, { raw: alpha.info })
    .png()
    .toBuffer();
  await sharp(full).resize({ height: 96 }).png().toFile(path.join(OUT, `${name}.png`));
}
manifest['logo-mark'] = { width: Math.round((alpha.info.width / alpha.info.height) * 96), height: 96 };
await sharp(path.join(SRC, 'favicon.png')).png().toFile(path.join(OUT, 'favicon.png'));

await writeFile(path.join(root, 'src/images/manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${photos.length} photos → public/images/`);
