#!/usr/bin/env bash
# ==============================================================================
# Script Autoinstall Warung Pulsa untuk VPS Ubuntu 24.04 / 22.04 LTS
# ==============================================================================
set -e

# Pastikan dijalankan sebagai root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Script ini harus dijalankan sebagai user root!"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a
export PATH=$PATH:/usr/local/bin:/usr/bin:~/.npm-global/bin

if [ -f /etc/needrestart/needrestart.conf ]; then
    sed -i 's/#$nrconf{restart} = .*/$nrconf{restart} = "a";/g' /etc/needrestart/needrestart.conf 2>/dev/null || true
fi

wait_for_apt() {
    local max_wait=40
    local waited=0
    if command -v fuser >/dev/null 2>&1; then
        while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || fuser /var/lib/apt/lists/lock >/dev/null 2>&1 || fuser /var/lib/dpkg/lock >/dev/null 2>&1; do
            echo "   ⏳ Menunggu proses paket sistem selesai... (${waited}s)"
            sleep 3
            waited=$((waited + 3))
            if [ $waited -ge $max_wait ]; then
                killall -9 apt-get apt unattended-upgrade-shutdown dpkg 2>/dev/null || true
                rm -f /var/lib/dpkg/lock-frontend /var/lib/dpkg/lock /var/lib/apt/lists/lock /var/cache/apt/archives/lock
                dpkg --configure -a 2>/dev/null || true
                break
            fi
        done
    fi
}

echo "=================================================================="
echo "    🚀 MEMULAI AUTOINSTALL WARUNG PULSA (UBUNTU 24.04 / 22.04 LTS)"
echo "=================================================================="

# 0. Prioritaskan IPv4 di tingkat OS (Mencegah kendala Happy Eyeballs & Provider H2H)
echo "==> [1/7] Mengonfigurasi prioritas IPv4 murni..."
if [ -f /etc/gai.conf ]; then
    sed -i 's/#precedence ::ffff:0:0\/96  100/precedence ::ffff:0:0\/96  100/g' /etc/gai.conf
    grep -q "precedence ::ffff:0:0/96  100" /etc/gai.conf || echo "precedence ::ffff:0:0/96  100" >> /etc/gai.conf
else
    echo "precedence ::ffff:0:0/96  100" > /etc/gai.conf
fi

# Hentikan apache2 jika ada agar port 80 bersih
systemctl stop apache2 2>/dev/null || true
systemctl disable apache2 2>/dev/null || true
killall -9 apache2 httpd 2>/dev/null || true

# 1. Update paket Ubuntu & instal dependensi dasar
echo "==> [2/7] Mengupdate sistem dan menginstal paket dasar..."
wait_for_apt
dpkg --configure -a >/dev/null 2>&1 || true
apt-get update -y
apt-get install -y curl git ufw nginx certbot python3-certbot-nginx build-essential sqlite3 ca-certificates gnupg >/dev/null 2>&1 || {
    dpkg --configure -a >/dev/null 2>&1 || true
    apt-get install -f -y >/dev/null 2>&1 || true
    apt-get install -y curl git ufw nginx certbot python3-certbot-nginx build-essential sqlite3 ca-certificates gnupg
}

# 2. Instal Node.js 22 LTS dari NodeSource (HANYA package nodejs, tanpa debian npm yang memicu konflik)
echo "==> [3/7] Memeriksa & menginstal Node.js 22 LTS..."
NODE_VER=$(node -v 2>/dev/null || echo "none")
if [[ "$NODE_VER" != v22* && "$NODE_VER" != v20* && "$NODE_VER" != v24* ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - || true
    wait_for_apt
    dpkg --configure -a >/dev/null 2>&1 || true
    apt-get install -y nodejs
fi

echo "   Node.js: $(node -v)"
echo "   NPM: $(npm -v)"

# 3. Instal PM2 Process Manager secara global
echo "==> [4/7] Menginstal PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2 || npm install -g pm2 --force
    hash -r 2>/dev/null || true
fi
for p in /usr/local/bin/pm2 /usr/bin/pm2 $(which pm2 2>/dev/null); do
    if [ -f "$p" ]; then
        ln -sf "$p" /usr/bin/pm2 2>/dev/null || true
        ln -sf "$p" /usr/local/bin/pm2 2>/dev/null || true
        break
    fi
done

# 4. Clone / Sinkronisasi Repository Warung Pulsa
APP_DIR="/var/www/warungpulsa"
echo "==> [5/7] Menyiapkan direktori aplikasi di $APP_DIR..."
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
echo "==> [6/7] Menginstal dependensi NPM..."
cd "$APP_DIR"
npm install --production

# 6. Setup file .env lengkap dengan konfigurasi API terbaru
mkdir -p "$APP_DIR/data"

if [ ! -f "$APP_DIR/.env" ]; then
    echo "IyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KIyBLT05GSUdVUkFTSSBTRVJWRVIgJiBTSVNURU0gV0FSVU5HIFBVTFNBCiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ClBPUlQ9MzAwMApOT0RFX0VOVj1wcm9kdWN0aW9uCkFQUF9OQU1FPVdhcnVuZyBQdWxzYQpET01BSU5fTkFNRT13YXJ1bmdwdWxzYS53ZWIuaWQKCiMgQWt1biBBZG1pbmlzdHJhdG9yCkFETUlOX0VNQUlMPXN5YW1zdWwxODc4MkBnbWFpbC5jb20KQkFDS1VQX1BBU1NXT1JEPVN1cnVhbjY0NkBTdXJ1YW4KCiMgR29vZ2xlIE9BdXRoIFNpZ24tSW4gKENsaWVudCBJRCAmIFNlY3JldCkKR09PR0xFX0NMSUVOVF9JRD03Mjc4MTc1OTc3ODUtb3ViODVrYnZ2c2w2NDB2N3E0Y2FrNjYxdm41anQ3a2guYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20KR09PR0xFX0NMSUVOVF9TRUNSRVQ9R09DU1BYLUoyTldfbWtyMkZDVWwzRU5QeEZLUkdwZ0w3ZmgKCiMgVG9rbyBHb3JvbnRhbG8gSDJIIFBQT0IgQ2xpZW50IChQdWxzYSwgUGFrZXQgRGF0YSwgVG9rZW4gUExOLCBFLVdhbGxldCwgR2FtZSkKVE9LT0dPUk9OVEFMT19CQVNFX1VSTD1odHRwczovL2FwcC50dXBvLm15LmlkClRPS09HT1JPTlRBTE9fVVNFUklEPTE3ODA4MjgzNTA4NQpUT0tPR09ST05UQUxPX1BJTj02NTA1MDIKVE9LT0dPUk9OVEFMT19QQVNTPTM1MDk4MDE5CgojIEF1dG9Hb1BheSAoU2hvcGVlUGF5ICYgR29QYXkgUVJJUyBPdG9tYXRpcykKQVVUT0dPUEFZX0FQSV9LRVk9YWdwXzFiYWU2NDdkMGMwYzI1MzA3NzU3YzFhNjBhZmE3YjA2MjU2YzkwZGJlZmI0NjUwZjNmN2U0M2EwM2Q1YzJhN2QKU0hPUEVFUEFZX1FSSVNfU1RBVElDPTAwMDIwMTAxMDIxMTI2NjEwMDE2SUQuQ08uU0hPUEVFLldXVzAxMTg5MzYwMDkxODAwMjA1MTY3MzMwMjA4MjA1MTY3MzMwMzAzVU1JNTE0NDAwMTRJRC5DTy5RUklTLldXVzAyMTVJRDEwMjIxNzc5Nzk1NTkwMzAzVU1JNTIwNDUzOTk1MzAzMzYwNTgwMklENTkxMmtvbnRlciBwdWxzYTYwMDlHT1JPTlRBTE82MTA1OTYxMjE2MjA3MDcwM0EwMTYzMDRDNjBDCkdPUEFZX1FSSVNfU1RBVElDPTAwMDIwMTAxMDIxMTI2NjEwMDE0Q09NLkdPLUpFSy5XV1cwMTE4OTM2MDA5MTQzMjE4MjgyODg5MDIxMEcyMTgyODI4ODkwMzAzVU1JNTE0NDAwMTRJRC5DTy5RUklTLldXVzAyMTVJRDEwMjY1OTMwNTg4MDcwMzAzVU1JNTIwNDQ4MTQ1MzAzMzYwNTgwMklENTkyMmtvbnRlciBwdWxzYSwgU0lQQVRBTkE2MDA5R09ST05UQUxPNjEwNTk2MTIxNjIxNDA3MDNBMDExMTAzNjIxNjMwNEU5MDYKCiMgVGVsZWdyYW0gQm90IE5vdGlmaWNhdGlvbgpURUxFR1JBTV9CT1RfVE9LRU49ODU3MjEyMjA1MzpBQUZNaXhhZGViTDVyNFRubzRDUVhDR3duVE9ReUUKVEVMRUdSQU1fQ0hBTk5FTF9JRD0tMTAwNTAxMTg2NjUwMwpURUxFR1JBTV9BRE1JTl9JRD01NjY2NTM2OTQ3ClRFTEVHUkFNX0dST1VQX1RIUkVBRF9JRD0xCgojIEdvb2dsZSBBSSAoR2VtaW5pKSAmIERlZXBTZWVrCkdFTUlOSV9BUElfS0VZPUFJemFTeUE0ME1qQnpqZnJ6NVVTeGJrc1Y2MU0tQjZhTWMzTlBfMApERUVQU0VFS19BUElfS0VZPXNrLTMyYjc3MWIwZjQ3ZTRhMTFiMTFiZmZhY2I1NmRjMGQ0CgojIEVtYWlsIE5vdGlmaWNhdGlvbiB2aWEgR29vZ2xlIEFwcHMgU2NyaXB0IChHQVMpCkdBU19XRUJfQVBQX1VSTD1odHRwczovL3NjcmlwdC5nb29nbGUuY29tL21hY3Jvcy9zL0FLZnljYnpubXpOWTBld1ZBbXNxejVOSC11bEhiX1l5STlKTm1Od3dDSUxPV1NEVGF3RG45dEVYU3lfbDNiM1Z3MmdISHdJSi1nL2V4ZWMKR0FTX1NFQ1JFVF9UT0tFTj1SYWhhc2lhVlBOdHViYW4xMjMhCgojIFBheW1lbnQgR2F0ZXdheSBUYW1iYWhhbiAoVHJpUGF5ICYgVmlvbGV0KQpUUklQQVlfTUVSQ0hBTlRfQ09ERT1UNDAyODEKVFJJUEFZX0FQSV9LRVk9QjBSUzNGdEk5dE1yZmgxd0k3ZVpqc3J1Qm9VbHliWTE4dEVYU0VvMgpUUklQQVlfUFJJVkFURV9LRVk9R3FvR0otODZKbUgta256TWctWm11Nm4tWFphWVIKVklPTEVUX0FQSV9LRVk9dXVOOVlNZ0lHOFVmQkx1QktHb0hzOW1Od2dPckE5RnkKVklPTEVUX1NFQ1JFVF9LRVk9UUE1TXlSVnBINHJyV1J2dGtyUjdLVnZqUW1ZSXpUMzk4RjNhTTZCM2h5UjVkek9GdncxeQ==" | base64 -d > "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
    echo "   File .env berhasil dibuat dengan konfigurasi sistem terbaru."
else
    echo "   File .env sudah ada, mempertahankan konfigurasi yang ada."
fi

# 7. Konfigurasi Nginx Reverse Proxy
echo "==> [7/7] Mengonfigurasi Nginx Reverse Proxy (Port 80 & 8080 -> Port 3000)..."
cat > /etc/nginx/sites-available/warungpulsa << 'EOF'
server {
    listen 80 default_server;
    listen 8080;
    server_name aqilapulsa.com www.aqilapulsa.com warungpulsa.web.id www.warungpulsa.web.id _;

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
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
ln -sf /etc/nginx/sites-available/warungpulsa /etc/nginx/sites-enabled/warungpulsa
nginx -t && systemctl restart nginx

# 8. Jalankan aplikasi via PM2
echo "==> Menjalankan Warung Pulsa via PM2..."
cd "$APP_DIR"
pm2 delete warungpulsa 2>/dev/null || true
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
else
    pm2 start server.js --name "warungpulsa"
fi
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# Izinkan firewall port
ufw allow 'Nginx Full' 2>/dev/null || true
ufw allow 22/tcp 2>/dev/null || true
ufw allow 8080/tcp 2>/dev/null || true

# Ambil IP VPS Publik murni IPv4
SERVER_IP=$(curl -4 -s --max-time 4 ifconfig.me 2>/dev/null || curl -4 -s --max-time 4 icanhazip.com 2>/dev/null || curl -4 -s --max-time 4 api.ipify.org 2>/dev/null || echo "IP_VPS_ANDA")

echo ""
echo "=================================================================="
echo "  🎉 AUTOINSTALL WARUNG PULSA BERHASIL SELESAI!"
echo "=================================================================="
echo "Web Warung Pulsa Anda sekarang sudah AKTIF dan dapat diakses:"
echo "👉 Akses Web         : http://${SERVER_IP} atau http://${SERVER_IP}:8080"
echo "👉 Domain Resmi      : https://aqilapulsa.com (atau https://warungpulsa.web.id)"
echo ""
echo "📌 Lokasi instalasi   : /var/www/warungpulsa"
echo "📌 Status PM2         : ketik 'pm2 status' atau 'pm2 logs warungpulsa'"
echo "📌 Edit Konfigurasi   : nano /var/www/warungpulsa/.env"
echo "📌 Terapkan Edit      : pm2 restart warungpulsa"
echo "📌 Sinkronisasi Produk: Buka menu Admin di /admin#tokogorontalo lalu klik 'Sinkronkan Katalog Produk'"
echo ""
echo "⚡ WHITELIST IP TOKO GORONTALO (H2H):"
echo "   Kirimkan format berikut ke CS Toko Gorontalo (0815240260221):"
echo "   ----------------------------------------------------------------------"
echo "   Halo Admin Toko Gorontalo, tolong daftarkan IP server VPS saya untuk"
echo "   transaksi H2H akun Member ID: 178082835085 (Level-3 APARAT):"
echo "   - IP VPS (IPv4): ${SERVER_IP}"
echo "   Terima kasih!"
echo "   ----------------------------------------------------------------------"
echo ""
echo "🔐 Pasang SSL HTTPS (Let's Encrypt) saat domain sudah diarahkan:"
echo "   certbot --nginx -d aqilapulsa.com -d www.aqilapulsa.com"
echo "=================================================================="
