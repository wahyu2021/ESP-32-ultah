# Implementation Plan: Project Foundation

- [ ] `npm init -y` dan instalasi core dependencies (`express`, `dotenv`, `cors`, `helmet`, `morgan`, `winston`).
- [ ] Instalasi dev dependencies (`eslint`, `prettier`, `nodemon`).
- [ ] Konfigurasi `.eslintrc.json` dan `.prettierrc`.
- [ ] Buat struktur folder lengkap di `src/`.
- [ ] Buat `src/config/index.js` untuk manajemen variabel lingkungan.
- [ ] Buat `src/utils/responseHandler.js` untuk format API seragam.
- [ ] Buat `src/middlewares/errorHandler.js` untuk menangkap semua error.
- [ ] Implementasi `src/app.js` dan `src/server.js` (Separation of Concerns).
