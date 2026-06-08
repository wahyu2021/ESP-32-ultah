# Specification: Image Processing Service

## Goals
1. Mengolah gambar input (JPEG/PNG) menjadi resolusi statis `250x122` lanskap.
2. Mengkonversi warna menjadi ruang warna spesifik (Black, White, Red).
3. Menerapkan algoritma Floyd-Steinberg Dithering untuk melembutkan gradasi.
4. Mengembalikan 2 buah Hex Array (Buffer): `buffer_black` dan `buffer_red`.

## Requirements
- **Library:** `sharp` untuk decoding dan ekstraksi piksel mentah.
- **Logika Dithering:**
  - Palet warna: Hitam `[0,0,0]`, Putih `[255,255,255]`, Merah `[255,0,0]`.
  - Error diffusion dilakukan secara manual pada array piksel 1D.
- **Bit Packing:**
  - `buffer_black`: Bit 0 = hitam, 1 = putih.
  - `buffer_red`: Bit 1 = merah, 0 = bukan merah.
  - Per baris akan di-_pad_ ke kelipatan byte. Lebar 250px membutuhkan `ceil(250/8) = 32` bytes per baris.
