const fs = require('fs');
const path = require('path');

// BACA REFERENSI DARI FOLDER 15 (HANYA DIBACA, TIDAK DIUBAH SAMA SEKALI)
const srcPath = path.resolve(__dirname, '../15 srpcomstorewebsaja/worker.js');
console.log('Membaca file referensi dari:', srcPath);
let code = fs.readFileSync(srcPath, 'utf8');

// 1. Ubah format ekspor Cloudflare Worker ke Node.js CommonJS
code = code.replace(/export\s*\{\s*worker_default\s+as\s+default\s*\};?/g, 'module.exports = worker_default;');

// 2. Rebranding teks ke Warung Pulsa
code = code.replace(/VPN Tuban Store/g, 'Warung Pulsa');
code = code.replace(/VPN Tuban/g, 'Warung Pulsa');
code = code.replace(/srpcom store/gi, 'Warung Pulsa');
code = code.replace(/SRPCOM CONVERTER/g, 'WARUNG PULSA CONVERTER');
code = code.replace(/SRPCOM OTP XL/g, 'WARUNG PULSA OTP XL');
code = code.replace(/Backup_TubanStore_/g, 'Backup_WarungPulsa_');
code = code.replace(/#vpntubanbackup/g, '#warungpulsabackup');
code = code.replace(/admin@tuban\.store/g, 'admin@warungpulsa.com');
code = code.replace(/https:\/\/tuban\.store\//g, '/');
code = code.replace(/tuban\.store/g, 'warungpulsa.com');
code = code.replace(/\`tuban\$\{Math\.floor/g, '\`wp\${Math.floor');

// 3. Buat GOOGLE_CLIENT_ID dinamis dari environment
code = code.replace(
  /var GOOGLE_CLIENT_ID = \"[^\"]+\";/,
  'var GOOGLE_CLIENT_ID = (typeof process !== "undefined" && process.env && process.env.GOOGLE_CLIENT_ID) || "404619775216-omjf6cn7j82kdnmev20rr9vp11hr7fka.apps.googleusercontent.com";'
);

// 4. Buat LOGO_URL dinamis dari environment
code = code.replace(
  /var LOGO_URL = \"[^\"]+\";/,
  'var LOGO_URL = (typeof process !== "undefined" && process.env && process.env.LOGO_URL) || "/logo.png";'
);

// Simpan HANYA ke folder 37 warungpulsa
const destPath = path.resolve(__dirname, 'app.js');
fs.writeFileSync(destPath, code, 'utf8');
console.log('Berhasil membuat app.js di folder 37 warungpulsa! Ukuran file:', code.length, 'bytes.');
