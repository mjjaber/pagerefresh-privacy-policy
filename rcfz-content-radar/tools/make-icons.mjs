/* Generates every PWA icon from code — no design tools, no binary assets to
 * hand-edit. Run from the app directory:
 *
 *     node tools/make-icons.mjs
 *
 * Writes PNGs into ./icons. Pure Node: the PNG encoder below uses only zlib.
 */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'icons');

/* ------------------------------------------------------------ PNG ------- */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Encode an RGBA Uint8Array (w*h*4) as a PNG buffer. */
function encodePNG(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 6;    // colour type: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0;    // filter: none
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride)
      .copy(raw, y * (stride + 1) + 1);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------------------------------------------------------- drawing ----- */

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mix = (a, b, t) => a + (b - a) * t;

/** Signed distance to a rounded rectangle centred on (cx, cy). */
function sdRoundRect(x, y, cx, cy, halfW, halfH, r) {
  const qx = Math.abs(x - cx) - (halfW - r);
  const qy = Math.abs(y - cy) - (halfH - r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return outside + Math.min(Math.max(qx, qy), 0) - r;
}

/** Even-odd point-in-polygon test. */
function insidePolygon(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i, i += 1) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* A swept delta jet, in unit coordinates relative to the icon centre. */
const JET = [
  [0, -0.44], [0.085, -0.16], [0.42, 0.21], [0.42, 0.30], [0.10, 0.13],
  [0.155, 0.40], [0.30, 0.50], [0.30, 0.55], [0, 0.44],
  [-0.30, 0.55], [-0.30, 0.50], [-0.155, 0.40], [-0.10, 0.13],
  [-0.42, 0.30], [-0.42, 0.21], [-0.085, -0.16],
];

/**
 * Render one icon.
 * @param {number} size      output pixel size
 * @param {boolean} maskable full-bleed background + smaller glyph (Android mask)
 */
function renderIcon(size, maskable) {
  const SS = 4;                       // supersampling factor
  const W = size * SS;
  const acc = new Float32Array(size * size * 4);

  const cx = W / 2;
  const cy = W / 2;
  // Maskable icons must survive a circular crop: keep art inside the 80% zone.
  const glyphScale = maskable ? 0.56 : 0.72;
  const plateHalf = maskable ? W / 2 : W * 0.5;
  const plateRadius = maskable ? 0 : W * 0.225;

  const ringOuter = W * glyphScale * 0.50;
  const ringMid = W * glyphScale * 0.375;
  const ringWidth = W * 0.012;

  for (let sy = 0; sy < W; sy += 1) {
    for (let sx = 0; sx < W; sx += 1) {
      const px = sx + 0.5;
      const py = sy + 0.5;

      // --- background plate -------------------------------------------
      const plate = sdRoundRect(px, py, cx, cy, plateHalf, plateHalf, plateRadius);
      if (plate > 0) continue;                     // transparent outside the plate

      const t = clamp01((py / W) * 0.85 + (px / W) * 0.15);
      let r = mix(0.055, 0.021, t);
      let g = mix(0.078, 0.033, t);
      let b = mix(0.106, 0.047, t);

      // cyan glow from the top, ember glow from the bottom right
      const dTop = Math.hypot(px - cx, py + W * 0.12) / W;
      const glowTop = clamp01(1 - dTop / 0.85) ** 2 * 0.30;
      r += 0.10 * glowTop; g += 0.62 * glowTop; b += 0.85 * glowTop;

      const dBot = Math.hypot(px - W * 0.86, py - W * 1.02) / W;
      const glowBot = clamp01(1 - dBot / 0.75) ** 2 * 0.26;
      r += 1.00 * glowBot; g += 0.32 * glowBot; b += 0.10 * glowBot;

      // --- radar rings -------------------------------------------------
      const dist = Math.hypot(px - cx, py - cy);
      for (const [radius, alpha] of [[ringOuter, 0.55], [ringMid, 0.30]]) {
        const edge = Math.abs(dist - radius) - ringWidth;
        const a = clamp01(-edge / (SS * 1.4)) * alpha;
        if (a > 0) { r = mix(r, 0.216, a); g = mix(g, 0.851, a); b = mix(b, 1.0, a); }
      }

      // --- sweep wedge -------------------------------------------------
      let ang = Math.atan2(py - cy, px - cx) * (180 / Math.PI);   // -180..180
      if (ang < -90) ang += 360;                                  // continuous -90..270
      if (dist < ringOuter + ringWidth && ang >= -95 && ang <= 15) {
        const falloff = 1 - (ang + 95) / 110;
        const a = clamp01(falloff) ** 1.6 * 0.30 * clamp01(dist / ringOuter);
        r = mix(r, 0.216, a); g = mix(g, 0.851, a); b = mix(b, 1.0, a);
      }

      // --- jet glyph ---------------------------------------------------
      const gx = (px - cx) / (W * glyphScale);
      const gy = (py - cy) / (W * glyphScale);
      if (insidePolygon(gx, gy, JET)) {
        const shade = clamp01(0.5 + gy * 0.9);
        r = mix(1.0, 0.86, shade);
        g = mix(0.55, 0.32, shade);
        b = mix(0.30, 0.12, shade);
      }

      // accumulate into the downsampled buffer
      const ox = (sx / SS) | 0;
      const oy = (sy / SS) | 0;
      const i = (oy * size + ox) * 4;
      acc[i] += r; acc[i + 1] += g; acc[i + 2] += b; acc[i + 3] += 1;
    }
  }

  const samples = SS * SS;
  const out = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    const a = acc[i * 4 + 3] / samples;
    if (a <= 0) continue;
    // Un-premultiply so the antialiased corners keep their colour.
    out[i * 4] = Math.round(clamp01(acc[i * 4] / (a * samples)) * 255);
    out[i * 4 + 1] = Math.round(clamp01(acc[i * 4 + 1] / (a * samples)) * 255);
    out[i * 4 + 2] = Math.round(clamp01(acc[i * 4 + 2] / (a * samples)) * 255);
    out[i * 4 + 3] = Math.round(a * 255);
  }

  return encodePNG(size, size, out);
}

/* ------------------------------------------------------------ main ------ */

mkdirSync(OUT_DIR, { recursive: true });

const TARGETS = [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['icon-maskable-192.png', 192, true],
  ['icon-maskable-512.png', 512, true],
  ['apple-touch-icon.png', 180, true],
  ['favicon.png', 64, false],
];

for (const [name, size, maskable] of TARGETS) {
  const png = renderIcon(size, maskable);
  writeFileSync(join(OUT_DIR, name), png);
  console.log(`wrote icons/${name} (${size}×${size}, ${(png.length / 1024).toFixed(1)} KB)`);
}
