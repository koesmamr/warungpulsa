# 🏪 Warung Pulsa - Server Node.js (VPS Ubuntu Ready)

Platform layanan isi pulsa, paket data (XL, Axis, Telkomsel, Tri, Indosat), PPOB, voucher game, dan layanan digital otomatis 24 jam.

Proyek ini telah di-rebuild dari versi Cloudflare Worker menjadi aplikasi mandiri berbasis **Node.js** dengan database lokal **SQLite** yang siap dideploy di **VPS Ubuntu** menggunakan **Nginx** dan **PM2**.

---

## 📁 Struktur Direktori

```text
37 warungpulsa/
├── data/
│   └── warungpulsa.db       # Database SQLite lokal (otomatis terbuat)
├── .env                     # File konfigurasi sensitif (API keys, bot token, dll)
├── .env.example             # Template konfigurasi environment
├── .gitignore               # Daftar file yang dikecualikan dari Git
├── app.js                   # Inti aplikasi web & API router (rebranded ke Warung Pulsa)
├── build-app.js             # Skrip generator/builder app.js
├── db.js                    # Adapter SQLite D1-Compatible (better-sqlite3 / node:sqlite)
├── ecosystem.config.js      # Konfigurasi PM2 Process Manager untuk VPS
├── package.json             # Manifest dependensi Node.js
├── schema.sql               # Skema tabel database fresh
├── server.js                # Entrypoint server HTTP Node.js
└── README.md                # Panduan instalasi dan deployment VPS
```

---

## 💻 Menjalankan di Komputer Lokal (Development)

1. Pastikan **Node.js (v20+ atau v22+)** sudah terpasang.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Salin konfigurasi environment (jika belum ada file `.env`):
   ```bash
   cp .env.example .env
   ```
   *Sesuaikan konfigurasi API Key dan Admin Email di dalam file `.env`.*
4. Jalankan server:
   ```bash
   npm start
   # atau untuk auto-reload saat koding:
   npm run dev
   ```
5. Buka browser di: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Panduan Lengkap Deployment ke VPS Ubuntu

Berikut adalah panduan langkah demi langkah untuk meng-hosting **Warung Pulsa** di VPS Ubuntu baru Anda:

### Langkah 1: Login ke VPS Ubuntu
Buka terminal dan login menggunakan SSH:
```bash
ssh root@IP_VPS_ANDA
```

---

### Langkah 2: Update Sistem & Install Node.js, Git, dan Nginx
Jalankan perintah berikut:
```bash
# Update repository Ubuntu
apt update && apt upgrade -y

# Install dependensi dasar
apt install -y curl git ufw nginx

# Install Node.js LTS (v22) dari NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Verifikasi versi
node -v
npm -v
```

---

### Langkah 3: Install PM2 (Process Manager)
PM2 berfungsi agar server Node.js tetap berjalan 24 jam nonstop dan otomatis menyala kembali jika server reboot:
```bash
npm install -g pm2
```

---

### Langkah 4: Upload / Copy File Project ke VPS
Buat direktori di `/var/www/warungpulsa`:
```bash
mkdir -p /var/www/warungpulsa
```

Anda dapat mengupload file-file dari folder `37 warungpulsa` ke VPS menggunakan **SCP**, **Git**, atau **FileZilla / SFTP**:
- Jika menggunakan SCP dari komputer lokal:
  ```bash
  scp -r "c:\Users\comsr\OneDrive\Documents\Antigravity\37 warungpulsa\*" root@IP_VPS_ANDA:/var/www/warungpulsa/
  ```

---

### Langkah 5: Install Dependensi & Konfigurasi .env di VPS
Masuk ke folder proyek di VPS:
```bash
cd /var/www/warungpulsa

# Install packages
npm install --production

# Buat dan sesuaikan file .env
cp .env.example .env
nano .env
```
> **Catatan Penting pada `.env`:**
> - `PORT=3000`
> - `DOMAIN_NAME=domain-anda.com` (ganti dengan domain baru Anda)
> - `ADMIN_EMAIL=email_admin_anda@gmail.com`
> - Pastikan API Key KMSP, Tripay, AutoGoPay, dan Telegram Bot terisi dengan benar.
> - Simpan perubahan nano dengan menekan `CTRL+O`, `ENTER`, lalu `CTRL+X`.

---

### Langkah 6: Jalankan Aplikasi Menggunakan PM2
Di dalam direktori `/var/www/warungpulsa`, jalankan:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```
*(Ikuti petunjuk baris perintah yang ditampilkan oleh `pm2 startup` jika diminta)*

Untuk memantau status server:
```bash
pm2 status
pm2 logs warungpulsa
```

---

### Langkah 7: Konfigurasi Nginx Reverse Proxy
Buat file konfigurasi Nginx untuk domain baru Anda:
```bash
nano /etc/nginx/sites-available/warungpulsa
```

Isi dengan konfigurasi berikut (ganti `domain-baru-anda.com` dengan nama domain Anda):
```nginx
server {
    listen 80;
    server_name domain-baru-anda.com www.domain-baru-anda.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
ln -s /etc/nginx/sites-available/warungpulsa /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### Langkah 8: Pasang SSL Gratis (HTTPS) via Let's Encrypt
Pastikan DNS domain Anda (A Record) sudah mengarah ke IP VPS Anda, lalu jalankan:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d domain-baru-anda.com -d www.domain-baru-anda.com
```
Certbot akan secara otomatis mengonfigurasi sertifikat SSL HTTPS dan memperbarui konfigurasi Nginx.

---

### Langkah 9: Konfigurasi Google Sign-In (OAuth)
Agar tombol **Login dengan Google** berfungsi di domain baru:
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Masuk ke menu **APIs & Services** -> **Credentials**.
3. Edit OAuth 2.0 Client ID web Anda.
4. Pada bagian **Authorized JavaScript origins**, tambahkan:
   - `https://domain-baru-anda.com`
   - `https://www.domain-baru-anda.com`
5. Simpan perubahan.

---

## 🛠️ Perintah Berguna untuk Pemeliharaan

| Perintah | Deskripsi |
| :--- | :--- |
| `pm2 restart warungpulsa` | Restart aplikasi setelah mengubah file kode / `.env` |
| `pm2 logs warungpulsa` | Melihat log aktivitas server secara realtime |
| `pm2 stop warungpulsa` | Menghentikan sementara aplikasi |
| `systemctl restart nginx` | Restart web server Nginx |
| `cp /var/www/warungpulsa/data/warungpulsa.db /root/backup-db.db` | Backup database SQLite secara manual |

---

## 🔒 Keamanan & Backup
- File database disimpan di `data/warungpulsa.db`.
- Database menggunakan format SQLite dengan mode WAL (*Write-Ahead Logging*) untuk kecepatan baca/tulis tinggi dan integritas data terjamin.
- Semua kredensial tersimpan rapi di file `.env` dan tidak akan ter-upload ke repositori publik.
