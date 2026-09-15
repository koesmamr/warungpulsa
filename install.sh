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
    echo "IyBLb25maWd1cmFzaSBTZXJ2ZXIKUE9SVD0zMDAwCk5PREVfRU5WPXByb2R1Y3Rpb24KQVBQX05BTUU9V2FydW5nIFB1bHNhCkRPTUFJTl9OQU1FPXdhcnVuZ3B1bHNhLndlYi5pZAoKIyBBZG1pbgpBRE1JTl9FTUFJTD1zeWFtc3VsMTg3ODJAZ21haWwuY29tCkJBQ0tVUF9QQVNTV09SRD1TdXJ1YW42NDZAU3VydWFuCgojIEdvb2dsZSBPQXV0aCBTaWduLUluIChDbGllbnQgSUQgJiBTZWNyZXQpCkdPT0dMRV9DTElFTlRfSUQ9NzI3ODE3NTk3Nzg1LW91Yjg1a2J2dnNsNjQwdjdxNGNhazY2MXZuNWp0N2toLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tCkdPT0dMRV9DTElFTlRfU0VDUkVUPUdPQ1NQWC1KMk5XX21rcjJGQ1VsM0VOUHhGS1JHcGdMN2ZoCgojIEtNU1AgUFBPQiAvIFB1bHNhIEFQSQpLTVNQX0FQSV9LRVk9NDY1ZWFmNGEtMTc4Yy00ZThiLTk2ZDctODMxZjI1NjhhOWRmCgojIEF1dG9Hb1BheSAoU2hvcGVlUGF5ICYgR29QYXkgUVJJUykKQVVUT0dPUEFZX0FQSV9LRVk9YWdwXzFiYWU2NDdkMGMwYzI1MzA3NzU3YzFhNjBhZmE3YjA2MjU2YzkwZGJlZmI0NjUwZjNmN2U0M2EwM2Q1YzJhN2QKU0hPUEVFUEFZX1FSSVNfU1RBVElDPTAwMDIwMTAxMDIxMTI2NjEwMDE2SUQuQ08uU0hPUEVFLldXVzAxMTg5MzYwMDkxODAwMjA1MTY3MzMwMjA4MjA1MTY3MzMwMzAzVU1JNTE0NDAwMTRJRC5DTy5RUklTLldXVzAyMTVJRDEwMjIxNzc5Nzk1NTkwMzAzVU1JNTIwNDUzOTk1MzAzMzYwNTgwMklENTkxMmtvbnRlciBwdWxzYTYwMDlHT1JPTlRBTE82MTA1OTYxMjE2MjA3MDcwM0EwMTYzMDRDNjBDCkdPUEFZX1FSSVNfU1RBVElDPTAwMDIwMTAxMDIxMTI2NjEwMDE0Q09NLkdPLUpFSy5XV1cwMTE4OTM2MDA5MTQzMjE4MjgyODg5MDIxMEcyMTgyODI4ODkwMzAzVU1JNTE0NDAwMTRJRC5DTy5RUklTLldXVzAyMTVJRDEwMjY1OTMwNTg4MDcwMzAzVU1JNTIwNDQ4MTQ1MzAzMzYwNTgwMklENTkyMmtvbnRlciBwdWxzYSwgU0lQQVRBTkE2MDA5R09ST05UQUxPNjEwNTk2MTIxNjIxNDA3MDNBMDExMTAzNjIxNjMwNEU5MDYKCiMgVHJpUGF5IFBheW1lbnQgR2F0ZXdheQpUUklQQVlfTUVSQ0hBTlRfQ09ERT1UNDAyODEKVFJJUEFZX0FQSV9LRVk9QjBSUzNGdEk5dE1yZmgxd0k3ZVpqc3J1Qm9VbHliWTE4dEVYU0VvMgpUUklQQVlfUFJJVkFURV9LRVk9R3FvR0otODZKbUgta256TWctWm11Nm4tWFphWVIKCiMgVmlvbGV0IFBheW1lbnQgR2F0ZXdheQpWSU9MRVRfQVBJX0tFWT11dU45WU1nSUc4VWZCTHVCS0dvSHM5bU53Z09yQTlGeQpWSU9MRVRfU0VDUkVUX0tFWT1RQTVNeVJWcEg0cnJXUnZ0a3JSN0tWdmpRbVlJelQzOThGM2FNNkIzaHlSNWR6T0Z2dzF5CgojIFRlbGVncmFtIEJvdCBOb3RpZmljYXRpb24KVEVMRUdSQU1fQk9UX1RPS0VOPTgwNDUyODI3MjY6QUFFMlV1RjB0cExseE4xclZSSm9KTFA2dkNVUUxEWjBjeDgKVEVMRUdSQU1fQ0hBTk5FTF9JRD1Ac3JwY29tZ3JvdXAKVEVMRUdSQU1fQURNSU5fSUQ9NTY2NjUzNjk0NwpURUxFR1JBTV9HUk9VUF9USFJFQURfSUQ9MTYwODMKCiMgR29vZ2xlIEFJIChHZW1pbmkpICYgRGVlcFNlZWsKR0VNSU5JX0FQSV9LRVk9QUl6YVN5QTQwTWpCempmcno1VVN4YmtzVjYxTS1CNmFNYzNOUF8wCkRFRVBTRUVLX0FQSV9LRVk9c2stMzJiNzcxYjBmNDdlNGExMWIxMWJmZmFjYjU2ZGMwZDQKCiMgRW1haWwgTm90aWZpY2F0aW9uIHZpYSBHb29nbGUgQXBwcyBTY3JpcHQgKEdBUykKR0FTX1dFQl9BUFBfVVJMPWh0dHBzOi8vc2NyaXB0Lmdvb2dsZS5jb20vbWFjcm9zL3MvQUtmeWNiemw5bVRWaUNoejEwLWZSbmRHeUhfTE8zc0E2WTMtczhfSURLeVNRbmFFdFVFYlB4eWVtcEl1XzhMdVZyQl95SjNSL2V4ZWMKR0FTX1NFQ1JFVF9UT0tFTj1SYWhhc2lhVlBOdHViYW4xMjMhCgojIENlbmRyYXdhc2loICYgVlBTIFN5bmMgQVBJCkNFTkRSQVdBU0lIX0FQSV9LRVk9Q0VOLThCODk0RjMzLTVFQjktNDRGMy1COTg2LTU2RDkxOTc0MkI3MQpWUFNfQVBJX0tFWT00NjVlYWY0YS0xNzhjLTRlOGItOTZkNy04MzFmMjU2OGE5ZGYKVlBTX0lQPTQ3LjI0NS44MS4yMzUKCiMgQ2xvdWRmbGFyZSBETlMgQVBJIChPcHNpb25hbCBqaWthIHN1YmRvbWFpbiBsaWNlbnNlIG1hc2loIGRpcGFrYWkpCkNGX0VNQUlMPXN5YW1zdWwxODc4MkBnbWFpbC5jb20KQ0ZfR0xPQkFMX0tFWT1mNjJlMTU1MzU5MDg1ZWEzMGIzMzhkMjc1YjQyOTVlYmE0Mzg0CkNGX0FQSV9UT0tFTj1mNjJlMTU1MzU5MDg1ZWEzMGIzMzhkMjc1YjQyOTVlYmE0Mzg0CkNGX1pPTkVfSUQ9ZWEzODI5OWI1MzM4NTM2YzEwNDBlZGJhYzhkOWQ0OWUK" | base64 -d > "$APP_DIR/.env"


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
