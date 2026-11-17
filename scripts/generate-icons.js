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

function generatePng(size) {
  // Create RGBA image buffer: height scanlines, each having 1 filter byte (0) + width * 4 bytes
  const scanlineLength = 1 + size * 4;
  const rawData = Buffer.alloc(scanlineLength * size);

  // Gradient colors: Purple (#7856E8 = 120, 86, 232) to Coral (#FF7777 = 255, 119, 119)
  for (let y = 0; y < size; y++) {
    const offset = y * scanlineLength;
    rawData[offset] = 0; // Filter: None

    for (let x = 0; x < size; x++) {
      const pixelOffset = offset + 1 + x * 4;

      // Distance from center for rounded squircle
      const nx = (x / size) * 2 - 1;
      const ny = (y / size) * 2 - 1;
      const distSquircle = Math.pow(Math.abs(nx), 3.5) + Math.pow(Math.abs(ny), 3.5);

      if (distSquircle > 0.95) {
        // Transparent outside squircle
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Linear gradient across diagonal
      const t = (x + y) / (size * 2);
      let r = Math.round(120 + t * (255 - 120));
      let g = Math.round(86 + t * (119 - 86));
      let b = Math.round(232 + t * (119 - 232));
      let a = 255;

      // Draw stylized Gamepad icon in center
      const cx = x / size;
      const cy = y / size;

      // Controller main body
      const inBody = (
        (cx > 0.22 && cx < 0.78 && cy > 0.38 && cy < 0.68) ||
        (Math.hypot(cx - 0.32, cy - 0.58) < 0.18) ||
        (Math.hypot(cx - 0.68, cy - 0.58) < 0.18)
      ) && !(cx > 0.44 && cx < 0.56 && cy > 0.58 && cy < 0.72);

      if (inBody) {
        // Off-white controller body
        r = 250;
        g = 249;
        b = 255;

        // D-Pad on left
        const inDpadH = cx > 0.26 && cx < 0.40 && cy > 0.48 && cy < 0.56;
        const inDpadV = cx > 0.30 && cx < 0.36 && cy > 0.42 && cy < 0.62;
        if (inDpadH || inDpadV) {
          r = 120;
          g = 86;
          b = 232;
        }

        // Action Buttons on right
        if (Math.hypot(cx - 0.68, cy - 0.46) < 0.035) { // Coral top button
          r = 255; g = 119; b = 119;
        } else if (Math.hypot(cx - 0.74, cy - 0.52) < 0.035) { // Yellow right button
          r = 255; g = 214; b = 107;
        } else if (Math.hypot(cx - 0.68, cy - 0.58) < 0.035) { // Mint bottom button
          r = 78; g = 204; b = 163;
        } else if (Math.hypot(cx - 0.62, cy - 0.52) < 0.035) { // Sky left button
          r = 91; g = 192; b = 235;
        }

        // Center jewel
        if (Math.hypot(cx - 0.50, cy - 0.50) < 0.03) {
          r = 152; g = 122; b = 238;
        }
      }

      // Sparkle star on top-right
      const inSparkle = Math.hypot(cx - 0.80, cy - 0.22) < 0.04;
      if (inSparkle) {
        r = 255; g = 214; b = 107;
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // width
  ihdrData.writeUInt32BE(size, 4); // height
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type 6: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 192x192
const p192 = generatePng(192);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), p192);
console.log('Generated icon-192.png');

// 512x512
const p512 = generatePng(512);
fs.writeFileSync(path.join(outDir, 'icon-512.png'), p512);
console.log('Generated icon-512.png');

// apple-touch-icon
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), p192);
console.log('Generated apple-touch-icon.png');
