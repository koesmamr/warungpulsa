#!/bin/bash
# ==============================================================================
# Script Autoinstall Warung Pulsa untuk VPS Ubuntu 24.04 / 22.04 LTS
# ==============================================================================
set -e

# Pastikan dijalankan sebagai root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Script ini harus dijalankan sebagai user root!"
  exit 1
fi

echo "=================================================================="
echo "    🚀 MEMULAI AUTOINSTALL WARUNG PULSA (UBUNTU 24.04 LTS)"
echo "=================================================================="

# 1. Update paket Ubuntu & instal dependensi dasar
echo "==> [1/7] Mengupdate sistem dan menginstal paket dasar..."
export DEBIAN_FRONTEND=noninteractive
apt update && apt upgrade -y
apt install -y curl git ufw nginx certbot python3-certbot-nginx build-essential sqlite3

# 2. Instal Node.js 22 LTS dari NodeSource
echo "==> [2/7] Memeriksa & menginstal Node.js 22 LTS..."
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt install -y nodejs
fi

echo "   Node.js: $(node -v)"
echo "   NPM: $(npm -v)"

# 3. Instal PM2 Process Manager secara global
echo "==> [3/7] Menginstal PM2..."
npm install -g pm2

# 4. Clone / Sinkronisasi Repository Warung Pulsa
APP_DIR="/var/www/warungpulsa"
echo "==> [4/7] Menyiapkan direktori aplikasi di $APP_DIR..."
mkdir -p /var/www
if [ -d "$APP_DIR/.git" ]; then
    echo "   Direktori $APP_DIR sudah ada, memperbarui dari repository..."
    cd "$APP_DIR"
    git reset --hard
    git pull origin main
else
    rm -rf "$APP_DIR"
    git clone https://github.com/koesmamr/warungpulsa.git "$APP_DIR"
    cd "$APP_DIR"
fi

# 5. Instal dependensi NPM
echo "==> [5/7] Menginstal dependensi NPM..."
cd "$APP_DIR"
npm install --production

# 6. Setup file .env lengkap dengan konfigurasi API
echo "==> [6/7] Menyiapkan file konfigurasi .env..."
if [ ! -f "$APP_DIR/.env" ]; then
    echo "IyBLb25maWd1cmFzaSBTZXJ2ZXIKUE9SVD0zMDAwCk5PREVfRU5WPXByb2R1Y3Rpb24KQVBQX05BTUU9V2FydW5nIFB1bHNhCkRPTUFJTl9OQU1FPXdhcnVuZ3B1bHNhLmNvbQoKIyBBZG1pbgpBRE1JTl9FTUFJTD1zeWFtc3VsMTg3ODJAZ21haWwuY29tCkJBQ0tVUF9QQVNTV09SRD1TdXJ1YW42NDZAU3VydWFuCgojIEdvb2dsZSBPQXV0aCBTaWduLUluIChDbGllbnQgSUQpCkdPT0dMRV9DTElFTlRfSUQ9NDA0NjE5Nzc1MjE2LW9tamY2Y243ajgya2RubWV2MjBycjl2cDExaHI3ZmthLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tCgojIEtNU1AgUFBPQiAvIFB1bHNhIEFQSQpLTVNQX0FQSV9LRVk9NDY1ZWFmNGEtMTc4Yy00ZThiLTk2ZDctODMxZjI1NjhhOWRmCgojIEF1dG9Hb1BheSAoU2hvcGVlUGF5ICYgR29QYXkgUVJJUykKQVVUT0dPUEFZX0FQSV9LRVk9YWdwXzFiYWU2NDdkMGMwYzI1MzA3NzU3YzFhNjBhZmE3YjA2MjU2YzkwZGJlZmI0NjUwZjNmN2U0M2EwM2Q1YzJhN2QKU0hPUEVFUEFZX1FSSVNfU1RBVElDPTAwMDIwMTAxMDIxMTI2NjEwMDE2SUQuQ08uU0hPUEVFLldXVzAxMTg5MzYwMDkxODAwMjMxOTQ1NDYwMjA4MjMxOTQ1NDYwMzAzVU1JNTE0NDAwMTRJRC5DTy5RUklTLldXVzAyMTVJRDEwMjY1MzI5NDkyMzEwMzAzVU1JNTIwNDU3MjI1MzAzMzYwNTgwMklENTkxMXR1YmFuIHN0b3JlNjAwNVRVQkFONjEwNTYyMzU1NjIwNzA3MDNBMDE2MzA0MjE3NwpHT1BBWV9RUklTX1NUQVRJQz0wMDAyMDEwMTAyMTEyNjYxMDAxNENPTS5HTy1KRUsuV1dXMDExODkzNjAwOTE0Mzc1NDkyOTc4NDAyMTBHNzU0OTI5Nzg0MDMwM1VNSTUxNDQwMDE0SUQuQ08uUVJJUy5XV1cwMjE1SUQxMDI0MzI0MzA3MTQ4MDMwM1VNSTUyMDQ1MDQ1NTMwMzM2MDU4MDJJRDU5MTNTcnAgQ29tIFR1YmFuNjAwNVRVQkFONjEwNTYyMzU1NjIwNzA3MDNBMDE2MzA0MUZFMAoKIyBUcmlQYXkgUGF5bWVudCBHYXRld2F5ClRSSVBBWV9NRVJDSEFOVF9DT0RFPVQ0MDI4MQpUUklQQVlfQVBJX0tFWT1CMFJTM0Z0STl0TXJmaDF3STdlWmpzcnVCb1VseWJZMTh0RVhTRW8yClRSSVBBWV9QUklWQVRFX0tFWT1HcW9HSi04NkptSC1rbnpNZy1abXU2bi1YWmFZUgoKIyBWaW9sZXQgUGF5bWVudCBHYXRld2F5ClZJT0xFVF9BUElfS0VZPXV1TjlZTWdJRzhVZkJMdUJLR29IczltTndnT3JBOUZ5ClZJT0xFVF9TRUNSRVRfS0VZPVFBNU15UlZwSDRycldSdnRrclI3S1Z2alFtWUl6VDM5OEYzYU02QjNoeVI1ZHpPRnZ3MXkKCiMgVGVsZWdyYW0gQm90IE5vdGlmaWNhdGlvbgpURUxFR1JBTV9CT1RfVE9LRU49ODA0NTI4MjcyNjpBQUUyVXVGMHRwTGx4TjFyVlJKb0pMUDZ2Q1VRTERaMGN4OApURUxFR1JBTV9DSEFOTkVMX0lEPUBzcnBjb21ncm91cApURUxFR1JBTV9BRE1JTl9JRD01NjY2NTM2OTQ3ClRFTEVHUkFNX0dST1VQX1RIUkVBRF9JRD0xNjA4MwoKIyBHb29nbGUgQUkgKEdlbWluaSkgJiBEZWVwU2VlawpHRU1JTklfQVBJX0tFWT1BSXphU3lBNDBNakJ6amZyejVVU3hia3NWNjFNLUI2YU1jM05QXzAKREVFUFNFRUtfQVBJX0tFWT1zay0zMmI3NzFiMGY0N2U0YTExYjExYmZmYWNiNTZkYzBkNAoKIyBFbWFpbCBOb3RpZmljYXRpb24gdmlhIEdvb2dsZSBBcHBzIFNjcmlwdCAoR0FTKQpHQVNfV0VCX0FQUF9VUkw9aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J6bDltVFZpQ2h6MTAtZlJuZEd5SF9MTzNzQTZZMy1zOF9JREt5U1FuYUV0VUViUHh5ZW1wSXVfOEx1VnJCX3lKM1IvZXhlYwpHQVNfU0VDUkVUX1RPS0VOPVJhaGFzaWFWUE50dWJhbjEyMyEKCiMgQ2VuZHJhd2FzaWggJiBWUFMgU3luYyBBUEkKQ0VORFJBV0FTSUhfQVBJX0tFWT1DRU4tOEI4OTRGMzMtNUVCOS00NEYzLUI5ODYtNTZEOTE5NzQyQjcxClZQU19BUElfS0VZPTQ2NWVhZjRhLTE3OGMtNGU4Yi05NmQ3LTgzMWYyNTY4YTlkZgpWUFNfSVA9NDcuMjQ1LjgxLjIzNQoKIyBDbG91ZGZsYXJlIEROUyBBUEkgKE9wc2lvbmFsIGppa2Egc3ViZG9tYWluIGxpY2Vuc2UgbWFzaWggZGlwYWthaSkKQ0ZfRU1BSUw9c3lhbXN1bDE4NzgyQGdtYWlsLmNvbQpDRl9HTE9CQUxfS0VZPWY2MmUxNTUzNTkwODVlYTMwYjMzOGQyNzViNDI5NWViYTQzODQKQ0ZfQVBJX1RPS0VOPWY2MmUxNTUzNTkwODVlYTMwYjMzOGQyNzViNDI5NWViYTQzODQKQ0ZfWk9ORV9JRD1lYTM4Mjk5YjUzMzg1MzZjMTA0MGVkYmFjOGQ5ZDQ5ZQo=" | base64 -d > "$APP_DIR/.env"
    echo "   File .env berhasil dibuat."
else
    echo "   File .env sudah ada, mempertahankan konfigurasi yang ada."
fi

# 7. Konfigurasi Nginx Reverse Proxy
echo "==> [7/7] Mengonfigurasi Nginx Reverse Proxy (Port 80 -> Port 3000)..."
cat > /etc/nginx/sites-available/warungpulsa << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

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
EOF

# Aktifkan site Nginx dan restart
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/warungpulsa /etc/nginx/sites-enabled/warungpulsa
nginx -t && systemctl restart nginx

# 8. Jalankan aplikasi via PM2
echo "==> Menjalankan Warung Pulsa via PM2..."
cd "$APP_DIR"
pm2 delete warungpulsa 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root || true

# Izinkan firewall port 80 & 443
ufw allow 'Nginx Full' 2>/dev/null || true
ufw allow 22/tcp 2>/dev/null || true

# Ambil IP VPS Publik
SERVER_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || echo "IP_VPS_ANDA")

echo ""
echo "=================================================================="
echo "  🎉 AUTOINSTALL WARUNG PULSA BERHASIL SELESAI!"
echo "=================================================================="
echo "Web Warung Pulsa Anda sekarang sudah AKTIF dan dapat diakses:"
echo "👉 http://${SERVER_IP}"
echo ""
echo "📌 Lokasi instalasi: /var/www/warungpulsa"
echo "📌 Status PM2: ketik 'pm2 status' atau 'pm2 logs warungpulsa'"
echo "📌 Edit Konfigurasi API (.env): nano /var/www/warungpulsa/.env"
echo "📌 Setelah mengedit .env, terapkan dengan: pm2 restart warungpulsa"
echo ""
echo "🔐 Pasang SSL HTTPS (Let's Encrypt) saat domain sudah diarahkan:"
echo "   certbot --nginx -d domain-anda.com -d www.domain-anda.com"
echo "=================================================================="
