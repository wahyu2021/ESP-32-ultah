# Specification: Project Foundation

## Goals
1. Inisialisasi proyek Node.js dengan struktur folder yang scalable.
2. Setup **ESLint & Prettier** untuk menjaga konsistensi gaya kode.
3. Setup **Global Error Handler** dan **Response Formatter** standar.
4. Implementasi **Logger (Winston/Morgan)**.

## Requirements
- Node.js 18+ (LTS).
- Folder Structure:
  - `src/config`: Konfigurasi env, database.
  - `src/middlewares`: Auth, error handling, logging.
  - `src/routes`: Definisi rute API.
  - `src/controllers`: Logika kontrol rute.
  - `src/services`: Logika bisnis (Image processing, DB logic).
  - `src/utils`: Helper functions.
  - `src/models`: Database models.
