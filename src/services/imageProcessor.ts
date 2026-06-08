import sharp from 'sharp';

const E_PAPER_WIDTH = 250;
const E_PAPER_HEIGHT = 122;

export interface BWRProcessedImage {
  width: number;
  height: number;
  hex_black: string[];
  hex_red: string[];
}

/**
 * Mendapatkan warna terdekat berdasarkan jarak Euclidean RGB.
 * Palet: Hitam (0), Putih (1), Merah (2).
 */
const getNearestColor = (r: number, g: number, b: number) => {
  const distBlack = r * r + g * g + b * b;
  const distWhite = (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2;
  const distRed = (255 - r) ** 2 + g * g + b * b; // Merah = [255, 0, 0]

  let min = distBlack;
  let color = 0; // 0: Hitam
  let pr = 0, pg = 0, pb = 0;

  if (distWhite < min) {
    min = distWhite;
    color = 1; // 1: Putih
    pr = 255; pg = 255; pb = 255;
  }
  if (distRed < min) {
    color = 2; // 2: Merah
    pr = 255; pg = 0; pb = 0;
  }

  return { color, pr, pg, pb };
};

/**
 * Memproses gambar menjadi format array hex E-Paper (BWR).
 * Menggunakan algoritma Floyd-Steinberg Dithering.
 * 
 * @param imageBuffer Input raw image buffer (JPEG/PNG dll)
 * @returns Object berisi dimensi dan 2 array hex (hitam & merah)
 */
export const processImageToBWR = async (imageBuffer: Buffer): Promise<BWRProcessedImage> => {
  // 1. Resize & Crop ke 250x122, ubah ke sRGB tanpa alpha channel (3 bytes per pixel)
  const { data, info } = await sharp(imageBuffer)
    .resize(E_PAPER_WIDTH, E_PAPER_HEIGHT, { fit: 'cover', position: 'center' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  
  // Float32Array digunakan agar bisa menyimpan nilai negatif/overflow saat error diffusion
  const pixels = new Float32Array(data);
  const resultColors = new Uint8Array(width * height);

  // 2. Floyd-Steinberg Dithering
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      const oldR = pixels[i] || 0;
      const oldG = pixels[i + 1] || 0;
      const oldB = pixels[i + 2] || 0;

      const { color, pr, pg, pb } = getNearestColor(oldR, oldG, oldB);
      resultColors[y * width + x] = color;

      const errR = oldR - pr;
      const errG = oldG - pg;
      const errB = oldB - pb;

      // Error Diffusion (Floyd-Steinberg)
      if (x + 1 < width) {
        pixels[i + 3] = (pixels[i + 3] || 0) + errR * 7 / 16;
        pixels[i + 4] = (pixels[i + 4] || 0) + errG * 7 / 16;
        pixels[i + 5] = (pixels[i + 5] || 0) + errB * 7 / 16;
      }
      if (x - 1 >= 0 && y + 1 < height) {
        const idx = ((y + 1) * width + (x - 1)) * 3;
        pixels[idx] = (pixels[idx] || 0) + errR * 3 / 16;
        pixels[idx + 1] = (pixels[idx + 1] || 0) + errG * 3 / 16;
        pixels[idx + 2] = (pixels[idx + 2] || 0) + errB * 3 / 16;
      }
      if (y + 1 < height) {
        const idx = ((y + 1) * width + x) * 3;
        pixels[idx] = (pixels[idx] || 0) + errR * 5 / 16;
        pixels[idx + 1] = (pixels[idx + 1] || 0) + errG * 5 / 16;
        pixels[idx + 2] = (pixels[idx + 2] || 0) + errB * 5 / 16;
      }
      if (x + 1 < width && y + 1 < height) {
        const idx = ((y + 1) * width + (x + 1)) * 3;
        pixels[idx] = (pixels[idx] || 0) + errR * 1 / 16;
        pixels[idx + 1] = (pixels[idx + 1] || 0) + errG * 1 / 16;
        pixels[idx + 2] = (pixels[idx + 2] || 0) + errB * 1 / 16;
      }
    }
  }

  // 3. Bit Packing ke format biner ESP32 (E-Paper)
  const bytesPerRow = Math.ceil(width / 8);
  const bufferBlack = Buffer.alloc(bytesPerRow * height, 0xFF); // Default: Putih (1)
  const bufferRed = Buffer.alloc(bytesPerRow * height, 0x00);   // Default: Non-merah (0)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = resultColors[y * width + x] || 0;
      const byteIndex = y * bytesPerRow + Math.floor(x / 8);
      // MSB First: Piksel paling kiri ada di bit ke-7
      const bitIndex = 7 - (x % 8); 

      if (color === 0) {
        // Hitam -> bit 0
        const currentByte = bufferBlack[byteIndex] || 0xFF;
        bufferBlack[byteIndex] = currentByte & ~(1 << bitIndex);
      } else if (color === 2) {
        // Merah -> buffer black jadi putih (1, tidak diubah), buffer merah jadi (1)
        const currentByte = bufferRed[byteIndex] || 0x00;
        bufferRed[byteIndex] = currentByte | (1 << bitIndex);
      }
    }
  }

  // 4. Format ke Hex Array Strings ("0xFF", "0x00")
  const formatToHex = (buf: Buffer) => 
    Array.from(buf).map(b => '0x' + b.toString(16).padStart(2, '0').toUpperCase());

  return {
    width,
    height,
    hex_black: formatToHex(bufferBlack),
    hex_red: formatToHex(bufferRed)
  };
};
