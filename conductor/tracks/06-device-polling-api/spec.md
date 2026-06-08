# Specification: Device Polling API

## Goals
1. Mengimplementasikan `GET /api/v1/device/poll`.
2. Melindungi endpoint dengan `requireDeviceKey` khusus ESP32.
3. Mengembalikan payload sesuai format PRD dan mengubah status pesan di database.

## Requirements
- Jika tidak ada pesan baru (`status = pending`), kembalikan `{ "has_update": false }`.
- Jika ada pesan:
  - Kembalikan format JSON yang spesifik untuk `text` atau `image` (dengan lebar, tinggi, dan array hex yang di-parse).
  - Ubah status pesan tersebut dari `pending` menjadi `delivered` setelah dikirim.
