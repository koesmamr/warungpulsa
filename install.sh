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
apt-get update -y
apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
apt-get install -y curl git ufw nginx certbot python3-certbot-nginx build-essential sqlite3

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

# 6. Setup file .env lengkap dengan konfigurasi API terbaru
echo "==> [6/7] Menyiapkan file konfigurasi .env..."
mkdir -p "$APP_DIR/data"

if [ ! -f "$APP_DIR/.env" ]; then
    echo "IyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KIyBLT05GSUdVUkFTSSBTRVJWRVIgJiBTSVNURU0gV0FSVU5HIFBVTFNBCiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ClBPUlQ9MzAwMApOT0RFX0VOVj1wcm9kdWN0aW9uCkFQUF9OQU1FPVdhcnVuZyBQdWxzYQpET01BSU5fTkFNRT13YXJ1bmdwdWxzYS53ZWIuaWQKCiMgQWt1biBBZG1pbmlzdHJhdG9yCkFETUlOX0VNQUlMPXN5YW1zdWwxODc4MkBnbWFpbC5jb20KQkFDS1VQX1BBU1NXT1JEPVN1cnVhbjY0NkBTdXJ1YW4KCiMgR29vZ2xlIE9BdXRoIFNpZ24tSW4gKENsaWVudCBJRCAmIFNlY3JldCkKR09PR0xFX0NMSUVOVF9JRD03Mjc4MTc1OTc3ODUtb3ViODVrYnZ2c2w2NDB2N3E0Y2FrNjYxdm41anQ3a2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20KR09PR0xFX0NMSUVOVF9TRUNSRVQ9R09DU1BYLUoyTldfbWtyMkZDVWwzRU5QeEZLUkdwZ0w3ZmgKCiMgVG9rbyBHb3JvbnRhbG8gSDJIIFBQT0IgQ2xpZW50IChQdWxzYSwgUGFrZXQgRGF0YSwgVG9rZW4gUExOLCBFLVdhbGxldCwgR2FtZSkKVE9LT0dPUk9OVEFMT19CQVNFX1VSTD1odHRwczovL2FwcC50dXBvLm15LmlkClRPS09HT1JPTlRBTE9fVVNFUklEPTE3ODA4MjgzNTA4NQpUT0tPR09ST05UQUxPX1BJTj02NTA1MDIKVE9LT0dPUk9OVEFMT19QQVNTPTM1MDk4MDE5CgojIEF1dG9Hb1BheSAoU2hvcGVlUGF5ICYgR29QYXkgUVJJUyBPdG9tYXRpcykKQVVUT0dPUEFZX0FQSV9LRVk9YWdwXzFiYWU2NDdkMGMwYzI1MzA3NzU3YzFhNjBhZmE3YjA2MjU2YzkwZGJlZmI0NjUwZjNmN2U0M2EwM2Q1YzJhN2QKU0hPUEVFUEFZX1FSSVNfU1RBVElDPTAwMDIwMTAxMDIxMTI2NjEwMDE2SUQuQ08uU0hPUEVFLldXVzAxMTg5MzYwMDkxODAwMjA1MTY3MzMwMjA4MjA1MTY3MzMwMzAzVU1JNTE0NDAwMTRJRC5DTy5RUklTLldXVzAyMTVJRDEwMjIxNzc5Nzk1NTkwMzAzVU1JNTIwNDUzOTk1MzAzMzYwNTgwMklENTkxMmtvbnRlciBwdWxzYTYwMDlHT1JPTlRBTE82MTA1OTYxMjE2MjA3MDcwM0EwMTYzMDRDNjBDCkdPUEFZX1FSSVNfU1RBVElDPTAwMDIwMTAxMDIxMTI2NjEwMDE0Q09NLkdPLUpFSy5XV1cwMTE4OTM2MDA5MTQzMjE4MjgyODg5MDIxMEcyMTgyODI4ODkwMzAzVU1JNTE0NDAwMTRJRC5DTy5RUklTLldXVzAyMTVJRDEwMjY1OTMwNTg4MDcwMzAzVU1JNTIwNDQ4MTQ1MzAzMzYwNTgwMklENTkyMmtvbnRlciBwdWxzYSwgU0lQQVRBTkE2MDA5R09ST05UQUxPNjEwNTk2MTIxNjIxNDA3MDNBMDExMTAzNjIxNjMwNEU5MDYKCiMgVGVsZWdyYW0gQm90IE5vdGlmaWNhdGlvbgpURUxFR1JBTV9CT1RfVE9LRU49ODU3MjEyMjA1MzpBQUZNaXhhZGViTDVyNFRubzRDUVhDR3duVE9ReUUKVEVMRUdSQU1fQ0hBTk5FTF9JRD0tMTAwNTAxMTg2NjUwMwpURUxFR1JBTV9BRE1JTl9JRD01NjY2NTM2OTQ3ClRFTEVHUkFNX0dST1VQX1RIUkVBRF9JRD0xCgojIEdvb2dsZSBBSSAoR2VtaW5pKSAmIERlZXBTZWVrCkdFTUlOSV9BUElfS0VZPUFJemFTeUE0ME1qQnpqZnJ6NVVTeGJrc1Y2MU0tQjZhTWMzTlBfMApERUVQU0VFS19BUElfS0VZPXNrLTMyYjc3MWIwZjQ3ZTRhMTFiMTFiZmZhY2I1NmRjMGQ0CgojIEVtYWlsIE5vdGlmaWNhdGlvbiB2aWEgR29vZ2xlIEFwcHMgU2NyaXB0IChHQVMpCkdBU19XRUJfQVBQX1VSTD1odHRwczovL3NjcmlwdC5nb29nbGUuY29tL21hY3Jvcy9zL0FLZnljYnpsOW1UVmlDaHoxMC1mUm5kR3lIX0xPM3NBNlkzLXM4X0lES3lTUW5hRXRVRWJQeHllbXBJdV84THVWckJfeUozUi9leGVjCkdBU19TRUNSRVRfVE9LRU49UmFoYXNpYVZQTnR1YmFuMTIzIQoKIyBQYXltZW50IEdhdGV3YXkgVGFtYmFoYW4gKFRyaVBheSAmIFZpb2xldCkKVFJJUEFZX01FUkNIQU5UX0NPREU9VDQwMjgxClRSSVBBWV9BUElfS0VZPUIwUlMzRnRJOXRNcmZoMXdJN2VaanNydUJvVWx5YlkxOHRFWFNFbzIKVFJJUEFZX1BSSVZBVEVfS0VZPUdxb0dKLTg2Sm1ILWtuek1nLVptdTZuLVhaYVlSClZJT0xFVF9BUElfS0VZPXV1TjlZTWdJRzhVZkJMdUJLR29IczltTndnT3JBOUZ5ClZJT0xFVF9TRUNSRVRfS0VZPVFBNU15UlZwSDRycldSdnRrclI3S1Z2alFtWUl6VDM5OEYzYU02QjNoeVI1ZHpPRnZ3MXk=" | base64 -d > "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
    echo "   File .env berhasil dibuat dengan konfigurasi sistem terbaru."
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

        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
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
pm2 startup systemd -u root --hp /root 2>/dev/null || env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root || true

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
echo "📌 Sinkronisasi Produk PPOB: Buka menu Admin di /admin#tokogorontalo lalu klik 'Sinkronkan Katalog Produk'"
echo "📌 Whitelist IP Server VPS: Daftarkan IP VPS (${SERVER_IP}) ke Admin / CS Toko Gorontalo agar transaksi H2H aktif"
echo ""
echo "🔐 Pasang SSL HTTPS (Let's Encrypt) saat domain sudah diarahkan:"
echo "   certbot --nginx -d domain-anda.com -d www.domain-anda.com"
echo "=================================================================="
