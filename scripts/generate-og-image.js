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

function generateOgImage(width, height) {
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  // Background: Deep purple (#1A1733) to vibrant purple (#2D1E5E) gradient
  for (let y = 0; y < height; y++) {
    const offset = y * scanlineLength;
    rawData[offset] = 0; // Filter none

    for (let x = 0; x < width; x++) {
      const pixelOffset = offset + 1 + x * 4;
      const t = (x + y * 1.2) / (width + height);

      let r = Math.round(26 + t * 40);
      let g = Math.round(23 + t * 25);
      let b = Math.round(51 + t * 80);
      let a = 255;

      // Glow circle around center-left
      const dist1 = Math.hypot(x - 320, y - 315);
      if (dist1 < 220) {
        const glow = (1 - dist1 / 220);
        r = Math.round(r + glow * 100);
        g = Math.round(g + glow * 60);
        b = Math.round(b + glow * 160);
      }

      // Controller badge in center-left (x: 220 to 420, y: 215 to 415)
      const cx = (x - 320) / 100;
      const cy = (y - 315) / 100;
      const inIconBox = Math.abs(cx) < 1.0 && Math.abs(cy) < 1.0;
      if (inIconBox) {
        r = Math.round(120 + cx * 30);
        g = Math.round(86 + cy * 30);
        b = 232;
      }

      rawData[pixelOffset] = Math.min(255, r);
      rawData[pixelOffset + 1] = Math.min(255, g);
      rawData[pixelOffset + 2] = Math.min(255, b);
      rawData[pixelOffset + 3] = a;
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

const outPath = path.join(__dirname, '..', 'public', 'og-image.png');
const ogPng = generateOgImage(1200, 630);
fs.writeFileSync(outPath, ogPng);
console.log('Generated public/og-image.png (1200x630)');
