# Specification: Auth & Security

## Goals
1. Implementasi API Key Middleware.
2. Validasi payload request menggunakan **Joi** atau **Zod**.
3. Proteksi header menggunakan **Helmet**.

## Requirements
- Middleware harus membedakan antara `secret_token_key` (untuk WA Bot) dan `device_secret_token` (untuk ESP32) jika diperlukan di masa depan.
