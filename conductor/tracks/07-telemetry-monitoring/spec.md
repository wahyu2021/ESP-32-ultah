# Specification: Telemetry Monitoring

## Goals
1. Implementasi endpoint `POST /api/v1/device/status`.
2. Validasi payload telemetri (Baterai, Mode Power, RSSI).
3. Setup Winston Logger untuk mencatat telemetri ke file terpisah.

## Requirements
- Endpoint dilindungi oleh `requireDeviceKey`.
- Data telemetri hanya di-log (tidak disimpan di SQLite untuk menghemat I/O, kecuali diperlukan di masa depan).
- Response memberikan konfirmasi berhasil kepada ESP32.
