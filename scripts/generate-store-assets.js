const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function createPng(width, height, pixelFn) {
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLength;
    rawData[offset] = 0; // Filter none

    for (let x = 0; x < width; x++) {
      const pixelOffset = offset + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);

      rawData[pixelOffset] = Math.max(0, Math.min(255, Math.round(r)));
      rawData[pixelOffset + 1] = Math.max(0, Math.min(255, Math.round(g)));
      rawData[pixelOffset + 2] = Math.max(0, Math.min(255, Math.round(b)));
      rawData[pixelOffset + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 1. App Icon Generator (Square with rounded brand gradient & joystick / play glyph)
function iconPixel(x, y, w, h) {
  const cx = x / w - 0.5;
  const cy = y / h - 0.5;
  const dist = Math.hypot(cx, cy);

  // Deep vibrant purple gradient background (#7856E8 to #5A35D6)
  const t = (x + y) / (w + h);
  let r = 120 - t * 30;
  let g = 86 - t * 32;
  let b = 232 - t * 20;

  // Center white game emblem (gamepad shape)
  const emblemDist = Math.hypot(cx, cy);
  const inControllerBody = Math.abs(cx) < 0.28 && Math.abs(cy) < 0.16;
  const inLeftPod = Math.hypot(cx + 0.2, cy) < 0.15;
  const inRightPod = Math.hypot(cx - 0.2, cy) < 0.15;

  if (inControllerBody || inLeftPod || inRightPod) {
    // D-pad or buttons
    const inDpadH = Math.abs(cx + 0.18) < 0.08 && Math.abs(cy) < 0.025;
    const inDpadV = Math.abs(cx + 0.18) < 0.025 && Math.abs(cy) < 0.08;
    const inBtn1 = Math.hypot(cx - 0.18, cy - 0.04) < 0.035;
    const inBtn2 = Math.hypot(cx - 0.24, cy + 0.02) < 0.035;
    const inBtn3 = Math.hypot(cx - 0.12, cy + 0.02) < 0.035;

    if (inDpadH || inDpadV) {
      return [120, 86, 232, 255]; // purple cut
    }
    if (inBtn1) return [255, 119, 119, 255]; // Coral button
    if (inBtn2) return [255, 214, 107, 255]; // Yellow button
    if (inBtn3) return [98, 203, 177, 255]; // Mint button

    // Controller white gloss
    return [255, 255, 255, 255];
  }

  // Corner subtle shading
  if (dist > 0.45) {
    r = r * 0.9;
    g = g * 0.9;
    b = b * 0.9;
  }

  return [r, g, b, 255];
}

// 2. Google Play Feature Graphic (1024x500)
function featureGraphicPixel(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Rich atmospheric gradient: Dark Indigo to Vibrant Purple
  let r = 28 + nx * 50;
  let g = 24 + nx * 20;
  let b = 58 + nx * 80;

  // Left ambient glow (#7856E8)
  const dLeft = Math.hypot(nx - 0.35, ny - 0.5);
  if (dLeft < 0.45) {
    const factor = (1 - dLeft / 0.45);
    r += factor * 80;
    g += factor * 50;
    b += factor * 140;
  }

  // Right ambient glow (#FF7777 coral)
  const dRight = Math.hypot(nx - 0.8, ny - 0.5);
  if (dRight < 0.4) {
    const factor = (1 - dRight / 0.4);
    r += factor * 90;
    g += factor * 40;
    b += factor * 30;
  }

  // Center Badge (JoyNook Emblem at nx: 0.35, ny: 0.5)
  const iconW = 180;
  const iconH = 180;
  const ix = x - 280;
  const iy = y - 250;
  if (Math.abs(ix) < iconW / 2 && Math.abs(iy) < iconH / 2) {
    const ip = iconPixel(ix + iconW / 2, iy + iconH / 2, iconW, iconH);
    return ip;
  }

  return [r, g, b, 255];
}

const storeAssetsDir = path.join(__dirname, '..', 'public', 'store-assets');
if (!fs.existsSync(storeAssetsDir)) {
  fs.mkdirSync(storeAssetsDir, { recursive: true });
}

// 1. Google Play Icon 512x512
console.log('Generating Google Play Icon (512x512)...');
const playIconBuf = createPng(512, 512, iconPixel);
fs.writeFileSync(path.join(storeAssetsDir, 'google-play-icon-512x512.png'), playIconBuf);

// Also copy to public/icons/icon-512.png and icon-192.png
fs.writeFileSync(path.join(__dirname, '..', 'public', 'icons', 'icon-512.png'), playIconBuf);

// 2. Google Play Feature Graphic 1024x500
console.log('Generating Google Play Feature Graphic (1024x500)...');
const featureBuf = createPng(1024, 500, featureGraphicPixel);
fs.writeFileSync(path.join(storeAssetsDir, 'google-play-feature-graphic-1024x500.png'), featureBuf);

// 3. iOS App Store Icon 1024x1024
console.log('Generating iOS App Store Icon (1024x1024)...');
const iosIconBuf = createPng(1024, 1024, iconPixel);
fs.writeFileSync(path.join(storeAssetsDir, 'app-store-icon-1024x1024.png'), iosIconBuf);

// Copy to iOS project
const iosAppIconPath = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png');
if (fs.existsSync(path.dirname(iosAppIconPath))) {
  fs.writeFileSync(iosAppIconPath, iosIconBuf);
  console.log('Updated iOS AppIcon-512@2x.png');
}

// Copy to Android project mipmap folders
const androidRes = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const mipmapDirs = [
  'mipmap-hdpi',
  'mipmap-mdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi',
];

for (const dir of mipmapDirs) {
  const targetDir = path.join(androidRes, dir);
  if (fs.existsSync(targetDir)) {
    fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), playIconBuf);
    fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), playIconBuf);
  }
}
console.log('Updated Android launcher icons in all mipmap densities.');

console.log('Done! All store assets generated successfully.');
