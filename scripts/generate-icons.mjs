/**
 * 아이콘/이미지 자동 생성기 (의존성 없음 · Node 내장 zlib만 사용)
 * -------------------------------------------------------------
 * 실행:  node scripts/generate-icons.mjs
 *
 * 생성물:
 *   app/favicon.ico          (16·32·48px, 탭 아이콘 폴백)
 *   app/apple-icon.png       (180px, iOS 홈 화면)
 *   app/opengraph-image.png  (1200×630, SNS 공유 카드)
 *   public/icon-192.png      (PWA/안드로이드)
 *   public/icon-512.png      (PWA/안드로이드)
 *
 * 브랜드 색을 바꾸려면 아래 BRAND 상수만 수정 후 다시 실행하면 된다.
 * (globals.css 의 --brand / --accent 와 값을 맞출 것)
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── 브랜드 색 (globals.css 와 일치) ──
const BRAND = { c1: [0x4f, 0x46, 0xe5], c2: [0x0e, 0xa5, 0xa3] }; // indigo → teal

// ─────────────────────────────────────────────────────────────
// 유틸: CRC32 (PNG 청크용)
// ─────────────────────────────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ─────────────────────────────────────────────────────────────
// PNG 인코더 (RGBA 8bit)
// ─────────────────────────────────────────────────────────────
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // 10,11,12 = 0 (compression/filter/interlace)
  // raw scanlines with filter byte 0
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ─────────────────────────────────────────────────────────────
// ICO 컨테이너 (PNG 임베드)
// ─────────────────────────────────────────────────────────────
function encodeICO(images) {
  const count = images.length;
  const header = Buffer.alloc(6 + count * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  const bodies = [];
  images.forEach((img, i) => {
    const e = 6 + i * 16;
    header[e] = img.size >= 256 ? 0 : img.size;
    header[e + 1] = img.size >= 256 ? 0 : img.size;
    header[e + 2] = 0; // palette
    header[e + 3] = 0;
    header.writeUInt16LE(1, e + 4); // planes
    header.writeUInt16LE(32, e + 6); // bpp
    header.writeUInt32LE(img.png.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += img.png.length;
    bodies.push(img.png);
  });
  return Buffer.concat([header, ...bodies]);
}

// ─────────────────────────────────────────────────────────────
// 렌더 헬퍼: 라운드 사각형 SDF (음수면 내부)
// ─────────────────────────────────────────────────────────────
function rrDist(px, py, x, y, w, h, r) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const qx = Math.abs(px - cx) - (w / 2 - r);
  const qy = Math.abs(py - cy) - (h / 2 - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}
function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}
function over(dst, src, a) {
  // src(rgb) 를 dst(rgba) 위에 alpha a 로 합성
  const inv = 1 - a;
  dst[0] = Math.round(src[0] * a + dst[0] * inv);
  dst[1] = Math.round(src[1] * a + dst[1] * inv);
  dst[2] = Math.round(src[2] * a + dst[2] * inv);
  dst[3] = Math.round(255 * a + dst[3] * inv);
}

// 32-그리드 좌표에서 아이콘 한 점 샘플 → [r,g,b,a(0..1)]
function sampleIcon(u, v) {
  const px = [0, 0, 0, 0];
  // 배경 라운드 사각형 (rx=7)
  if (rrDist(u, v, 0, 0, 32, 32, 7) < 0) {
    const t = (u + v) / 64;
    const c = lerp(BRAND.c1, BRAND.c2, t);
    px[0] = c[0];
    px[1] = c[1];
    px[2] = c[2];
    px[3] = 255;
  } else {
    return [0, 0, 0, 0];
  }
  // 흰색 요소들
  const white = [255, 255, 255];
  const els = [
    [8, 6, 16, 5, 1.6, 0.95], // 디스플레이
    [8, 15, 5, 5, 1.4, 1], // 버튼
    [19, 15, 5, 5, 1.4, 1],
    [8, 22, 5, 5, 1.4, 1],
    [19, 22, 5, 5, 1.4, 0.75],
  ];
  for (const [x, y, w, h, r, a] of els) {
    if (rrDist(u, v, x, y, w, h, r) < 0) over(px, white, a);
  }
  return [px[0], px[1], px[2], px[3] / 255];
}

// 아이콘을 size×size PNG 로 (4x 슈퍼샘플 AA)
function renderIconPNG(size) {
  const S = 4;
  const rgba = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const u = ((x + (sx + 0.5) / S) / size) * 32;
          const v = ((y + (sy + 0.5) / S) / size) * 32;
          const p = sampleIcon(u, v);
          r += p[0] * p[3];
          g += p[1] * p[3];
          b += p[2] * p[3];
          a += p[3];
        }
      }
      const n = S * S;
      const idx = (y * size + x) * 4;
      const alpha = a / n;
      rgba[idx] = alpha > 0 ? Math.round(r / a) : 0;
      rgba[idx + 1] = alpha > 0 ? Math.round(g / a) : 0;
      rgba[idx + 2] = alpha > 0 ? Math.round(b / a) : 0;
      rgba[idx + 3] = Math.round(alpha * 255);
    }
  }
  return encodePNG(size, size, rgba);
}

// ─────────────────────────────────────────────────────────────
// OG 이미지 (1200×630) — 그라디언트 배경 + 중앙 로고 + 점 격자
// ─────────────────────────────────────────────────────────────
function renderOG() {
  const W = 1200, H = 630;
  const rgba = Buffer.alloc(W * H * 4);
  const logo = 300; // 로고 표시 크기(px)
  const lx = (W - logo) / 2;
  const ly = (H - logo) / 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // 배경 그라디언트 (대각)
      const t = (x / W) * 0.6 + (y / H) * 0.4;
      const bg = lerp(BRAND.c1, BRAND.c2, t);
      const px = [bg[0], bg[1], bg[2], 255];
      // 은은한 점 격자
      if (x % 48 < 3 && y % 48 < 3) over(px, [255, 255, 255], 0.06);
      // 중앙 로고
      if (x >= lx && x < lx + logo && y >= ly && y < ly + logo) {
        // 로고 뒤 부드러운 흰 원반
        const cx = W / 2, cy = H / 2;
        const d = Math.hypot(x - cx, y - cy);
        if (d < logo * 0.62) {
          const a = Math.max(0, 0.12 * (1 - d / (logo * 0.62)));
          over(px, [255, 255, 255], a);
        }
        const u = ((x - lx) / logo) * 32;
        const v = ((y - ly) / logo) * 32;
        const p = sampleIcon(u, v);
        if (p[3] > 0) over(px, [p[0], p[1], p[2]], p[3]);
      }
      const idx = (y * W + x) * 4;
      rgba[idx] = px[0];
      rgba[idx + 1] = px[1];
      rgba[idx + 2] = px[2];
      rgba[idx + 3] = 255;
    }
  }
  return encodePNG(W, H, rgba);
}

// ─────────────────────────────────────────────────────────────
// 출력
// ─────────────────────────────────────────────────────────────
function out(rel, buf) {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, buf);
  console.log(`  ✓ ${rel}  (${buf.length.toLocaleString()} bytes)`);
}

console.log("아이콘 생성 중…");
const ico = encodeICO([16, 32, 48].map((s) => ({ size: s, png: renderIconPNG(s) })));
out("app/favicon.ico", ico);
out("app/apple-icon.png", renderIconPNG(180));
out("app/opengraph-image.png", renderOG());
out("public/icon-192.png", renderIconPNG(192));
out("public/icon-512.png", renderIconPNG(512));
console.log("완료.");
