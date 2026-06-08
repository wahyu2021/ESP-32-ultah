# Project Instructions: IoT Smart Frame Ecosystem

Dokumen ini berisi panduan dasar, arsitektur, dan konvensi proyek untuk memastikan pengembangan yang konsisten.

## 1. Arsitektur Umum
- **Backend:** Node.js dengan framework Express.js.
- **API:** RESTful API dengan versi (`/api/v1/...`).
- **Database:** SQLite (untuk pengembangan/minimalis) atau PostgreSQL, menggunakan Sequelize/Prisma sebagai ORM.
- **Image Processing:** Menggunakan library `Sharp` untuk manipulasi citra digital (Resizing, Dithering, BWR conversion).

## 2. Konvensi Kode
- **Bahasa:** Nama variabel, fungsi, dan komentar dalam bahasa Inggris.
- **Gaya Penulisan:** CamelCase untuk variabel/fungsi, PascalCase untuk Class/Model.
- **Struktur Modular:** Pisahkan logika routing, controller, service (image processing), dan model database.

## 3. Workflow Pengembangan
- **Perencanaan:** Selalu gunakan `conductor` untuk melacak progress via tracks.
- **Dokumentasi:** Setiap endpoint baru harus dicatat dalam PRD atau file API spesifik jika ada perubahan.
- **Testing:** Gunakan Postman atau skrip testing sederhana untuk memvalidasi endpoint `image` (terutama output Hex Array).

## 4. Keamanan
- Header `X-API-KEY` bersifat wajib untuk semua endpoint non-publik.
- Jangan pernah melakukan commit file `.env` yang berisi secret key.

## 5. Git & Atomic Commits
- **Atomic Commits:** Lakukan commit untuk setiap perubahan kecil yang mandiri (misal: "Add error handler middleware", bukan "Fix everything").
- **Commit Messages:** Gunakan Bahasa Indonesia yang jelas. Format: `[Tipe]: Deskripsi singkat` (Tipe: `feat`, `fix`, `refactor`, `docs`, `chore`).
- **Workflow:** Setiap kali menyelesaikan satu item dalam Implementation Plan di Conductor, lakukan commit agar progress tercatat dengan rapi di history Git.
