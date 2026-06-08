# Specification: Dockerization

## Goals
1. Pembuatan `Dockerfile` dengan *Multi-Stage Build* untuk optimasi ukuran *image*.
2. Pembuatan `docker-compose.yml` untuk pengaturan env dan volume.
3. Pembuatan `.dockerignore`.

## Requirements
- **Volume:** Data SQLite (`dev.db`) dan folder `logs` harus menggunakan volume eksternal agar data tidak terhapus saat *container* di-_rebuild_.
- **Prisma:** Harus menjalankan `prisma generate` dan `prisma migrate deploy` di dalam *container* secara otomatis.
