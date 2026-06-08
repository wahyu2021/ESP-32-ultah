import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const DEVICE_KEY = 'device_secret_token';

// Warna untuk output console
const c = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

console.log(`${c.cyan}=== Memulai ESP32 Virtual Simulator ===${c.reset}\n`);

/**
 * Simulasi mengambil data (Polling) dari Backend
 */
async function pollData() {
  try {
    const response = await fetch(`${API_BASE_URL}/device/poll`, {
      method: 'GET',
      headers: {
        'X-API-KEY': DEVICE_KEY,
      },
    });

    const data = await response.json();

    if (data.has_update) {
      console.log(`${c.green}[POLL] 📥 Pesan BARU diterima! (Tipe: ${data.type})${c.reset}`);
      
      if (data.type === 'text') {
        console.log(`       Isi: "${data.payload.text}"`);
      } else if (data.type === 'image') {
        console.log(`       Resolusi: ${data.payload.width}x${data.payload.height}`);
        console.log(`       Buffer Hitam (Potongan): [${data.payload.hex_black.slice(0, 5).join(', ')} ... ]`);
        console.log(`       Buffer Merah (Potongan): [${data.payload.hex_red.slice(0, 5).join(', ')} ... ]`);
      }
      console.log(`       Waktu Server: ${data.payload.timestamp}\n`);
    } else {
      console.log(`${c.yellow}[POLL] 📭 Tidak ada pesan baru. Tidur lagi...${c.reset}`);
    }
  } catch (error) {
    console.log(`${c.red}[ERROR] Gagal melakukan polling. Pastikan backend (npm run dev) sudah menyala!${c.reset}`);
  }
}

/**
 * Simulasi mengirim status telemetri ke Backend
 */
async function sendTelemetry() {
  // Bikin data palsu yang fluktuatif
  const mockTelemetry = {
    battery_voltage: (Math.random() * (4.2 - 3.5) + 3.5).toFixed(2), // 3.5v - 4.2v
    battery_percentage: Math.floor(Math.random() * 100),
    power_mode: Math.random() > 0.8 ? 'usb' : 'battery',
    rssi: -Math.floor(Math.random() * (90 - 40) + 40) // -40dBm to -90dBm
  };

  try {
    const response = await fetch(`${API_BASE_URL}/device/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': DEVICE_KEY,
      },
      body: JSON.stringify(mockTelemetry),
    });

    if (response.ok) {
        console.log(`${c.magenta}[TELEMETRI] 📡 Laporan terkirim! (Baterai: ${mockTelemetry.battery_percentage}%, Sinyal: ${mockTelemetry.rssi}dBm)${c.reset}`);
    }
  } catch (error) {
    // Abaikan error agar console tidak kotor jika server mati
  }
}

// Jalankan fungsi secara berkala
setInterval(pollData, 5000); // Polling setiap 5 detik
setInterval(sendTelemetry, 15000); // Kirim telemetri setiap 15 detik

// Eksekusi pertama kali secara instan
pollData();
sendTelemetry();
