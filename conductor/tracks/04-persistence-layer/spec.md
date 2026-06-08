# Specification: Persistence Layer

## Goals
1. Setup Prisma ORM dengan SQLite.
2. Definisi skema tabel `messages`.
3. Buat Repositori untuk memisahkan logika database dari controller.

## Requirements
- **Model Message:** Harus menampung tipe, konten teks, konten gambar (sebagai stringified JSON array panjang), dan status antrean.
- **Logika Mutasi:** Jika ada pesan baru masuk (teks/gambar), maka pesan lama yang berstatus `pending` HARUS diubah menjadi `superseded` sebelum menyimpan pesan baru.
