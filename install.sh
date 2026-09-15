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
if [ -d "$APP_DIR/.git" ]; then
    echo "   Direktori $APP_DIR sudah ada, memperbarui dari repository..."
    cd "$APP_DIR"
    git reset --hard
    git pull origin main
else
    mkdir -p /var/www
    rm -rf "$APP_DIR"
    git clone https://github.com/koesmamr/warungpulsa.git "$APP_DIR"
    cd "$APP_DIR"
fi

# 5. Instal dependensi NPM
echo "==> [5/7] Menginstal dependensi NPM..."
cd "$APP_DIR"
npm install --production

# 6. Pastikan file .env ada
if [ ! -f "$APP_DIR/.env" ]; then
    echo "==> [6/7] Membuat file .env default dari .env.example..."
    if [ -f "$APP_DIR/.env.example" ]; then
        cp "$APP_DIR/.env.example" "$APP_DIR/.env"
    fi
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
