require('dotenv').config();
const { serve } = require('@hono/node-server');
const { db } = require('./db.js');
const appWorker = require('./app.js');

const port = parseInt(process.env.PORT || '3000', 10);

// Satukan environment variables dari .env dengan DB dan binding pendukung
const env = {
  ...process.env,
  DB: db,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'syamsul18782@gmail.com',
  BACKUP_PASSWORD: process.env.BACKUP_PASSWORD || 'Suruan646@Suruan',
  GAS_WEB_APP_URL: process.env.GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbznmzNY0ewVAmsqz5NH-ulHb_YyI9JNmNwwCILOWSDTawDn9tEXSy_l3b3Vw2gHHwIJ-g/exec',
  GAS_SECRET_TOKEN: process.env.GAS_SECRET_TOKEN || 'RahasiaVPNtuban123!',
  AI: {
    run: async (model, opts) => {
      console.warn('[AI] Cloudflare Workers AI tidak aktif di VPS. Mengalihkan ke Gemini API.');
      return { response: 'Layanan AI dialihkan ke Google Gemini.' };
    }
  },
  BACKUP_BUCKET: null
};

console.log('-------------------------------------------------');
console.log('Memulai Server Warung Pulsa...');
console.log('Database terhubung: SQLite (warungpulsa.db)');
console.log('Admin Email:', env.ADMIN_EMAIL);
console.log('-------------------------------------------------');

const server = serve({
  fetch: (request) => {
    // Context mock untuk async waitUntil di Node.js
    const ctx = {
      waitUntil: (promise) => {
        Promise.resolve(promise).catch((err) => {
          console.error('[Background Task Error]:', err.message);
        });
      }
    };
    return appWorker.fetch(request, env, ctx);
  },
  port: port
}, (info) => {
  console.log('=================================================');
  console.log(`🚀 WARUNG PULSA SERVER BERHASIL AKTIF!`);
  console.log(`🌐 Akses Web: http://localhost:${info.port}`);
  console.log(`🕒 Waktu Server: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`);
  console.log('=================================================');
});

// Penanganan graceful shutdown
process.on('SIGINT', () => {
  console.log('\nMenghentikan server Warung Pulsa...');
  server.close(() => {
    console.log('Server berhasil dinonaktifkan.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nMenerima SIGTERM, menghentikan server...');
  server.close(() => {
    process.exit(0);
  });
});
