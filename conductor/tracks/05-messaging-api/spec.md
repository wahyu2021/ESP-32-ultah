# Specification: Messaging API

## Goals
1. Implementasi endpoint `POST /api/v1/messages/text`.
2. Implementasi endpoint `POST /api/v1/messages/image`.
3. Menggunakan middleware `requireApiKey`.

## Requirements
- **Text Endpoint:** 
  - Validasi payload dengan `textMessageSchema`.
  - Simpan ke database melalui `messageRepository`.
- **Image Endpoint:**
  - Terima file via `multer` (disimpan sementara di RAM/memory buffer).
  - Proses file dengan `processImageToBWR`.
  - Simpan stringified JSON dari array Hex ke database.
