# 🏪 Warung Pulsa (Ubuntu VPS Ready)

Platform layanan isi ulang pulsa, paket data (XL, Axis, Telkomsel, Tri, Indosat), PPOB, voucher game, dan layanan digital otomatis 24 jam berbasis **Node.js** dan **SQLite** lokal.

---

## ⚡ Metode Cepat: Autoinstall 1 Perintah (Rekomendasi)

Untuk menginstal **Warung Pulsa** di VPS Ubuntu 24.04 / 22.04 LTS, cukup login sebagai user **`root`** via SSH dan jalankan **1 baris perintah** berikut:

```bash
curl -sSL https://raw.githubusercontent.com/koesmamr/warungpulsa/main/install.sh | bash
```

### 🤖 Apa yang Dilakukan Script Ini Secara Otomatis?
1. **Update Sistem**: Memperbarui paket Ubuntu dan memasang dependensi (Git, Nginx, Certbot, SQLite, build tools).
2. **Install Node.js 22 LTS & PM2**: Memasang runtime Node.js v22 dan PM2 Process Manager secara global.
3. **Download Repository**: Meng-clone repository `koesmamr/warungpulsa` ke direktori `/var/www/warungpulsa`.
4. **Install Dependensi NPM**: Memasang package `@hono/node-server`, `dotenv`, dll.
5. **Setup Konfigurasi `.env`**: Mengisi file `.env` lengkap dengan API Keys (KMSP, Tripay, AutoGoPay QRIS, Telegram Bot, dll).
6. **Konfigurasi Nginx Reverse Proxy**: Mengatur Nginx agar port 80 langsung me-forward request ke aplikasi Node.js (port 3000).
7. **Jalankan Aplikasi via PM2**: Aplikasi langsung hidup, tersimpan, dan otomatis menyala kembali jika VPS di-reboot.

---

## 🔐 Pasang SSL HTTPS (Let's Encrypt)

Setelah autoinstall selesai dan DNS domain baru Anda (A Record) sudah mengarah ke IP VPS, jalankan perintah berikut untuk mengaktifkan HTTPS gratis:

```bash
certbot --nginx -d domain-anda.com -d www.domain-anda.com
```

*Certbot akan secara otomatis memperbarui konfigurasi Nginx dan mengatur perpanjangan SSL otomatis berkala.*

---

## 🔑 Konfigurasi Google Sign-In (OAuth)

Agar fitur **Login dengan Google** berfungsi di domain baru Anda:
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Masuk ke menu **APIs & Services** -> **Credentials**.
3. Pilih Client ID OAuth 2.0 web Anda.
4. Pada kolom **Authorized JavaScript origins**, tambahkan:
   - `https://domain-anda.com`
   - `https://www.domain-anda.com`
5. Simpan perubahan.

---

## 🛠️ Perintah Pemeliharaan Server

Semua operasi aplikasi dapat dipantau dan dikelola dengan mudah melalui perintah berikut di terminal VPS:

| Kebutuhan | Perintah di Terminal VPS |
| :--- | :--- |
| **Cek Status Server** | `pm2 status` |
| **Lihat Log Realtime** | `pm2 logs warungpulsa` |
| **Restart Aplikasi** | `pm2 restart warungpulsa` |
| **Stop Aplikasi** | `pm2 stop warungpulsa` |
| **Edit Konfigurasi API** | `nano /var/www/warungpulsa/.env` *(lalu jalankan `pm2 restart warungpulsa`)* |
| **Restart Web Server Nginx**| `systemctl restart nginx` |
| **Backup Database Manual** | `cp /var/www/warungpulsa/data/warungpulsa.db /root/backup-$(date +%F).db` |

---

## 💻 Menjalankan di Komputer Lokal (Development)

Jika Anda ingin menguji atau memodifikasi kode di komputer lokal:

```bash
# 1. Clone repository
git clone https://github.com/koesmamr/warungpulsa.git
cd warungpulsa

# 2. Install dependensi
npm install

# 3. Buat file .env dari template
cp .env.example .env

# 4. Jalankan server lokal
npm start
# atau dengan mode dev (auto-reload):
npm run dev
```
Akses web lokal melalui browser: [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktur Direktori Proyek

```text
warungpulsa/
├── data/
│   └── warungpulsa.db       # Database SQLite lokal (otomatis terbuat saat aplikasi berjalan)
├── .env                     # Konfigurasi variabel environment & API keys
├── .env.example             # Template variabel environment
├── .gitignore               # Daftar pengecualian Git
├── app.js                   # Inti aplikasi web, router API, dan antarmuka Warung Pulsa
├── build-app.js             # Skrip generator builder
├── db.js                    # Adapter SQLite D1-Compatible (WAL mode berkecepatan tinggi)
├── ecosystem.config.js      # Konfigurasi PM2 Process Manager
├── install.sh               # Skrip autoinstall sekali jalan untuk Ubuntu VPS
├── package.json             # Manifest dependensi project
├── schema.sql               # Skema tabel database fresh install
├── server.js                # Entry point server HTTP Node.js
└── README.md                # Dokumentasi & panduan instalasi
```

---

## 🔒 Keamanan & Data
- **Database Lokal**: Menggunakan SQLite dengan mode WAL (*Write-Ahead Logging*) untuk performa baca/tulis tinggi dan integritas data terbaik.
- **Isolasi Kredensial**: File `.env` diproteksi oleh `.gitignore` sehingga data rahasia tidak terekspos secara publik.
