/**
 * Toko Gorontalo / PPOB Route Handlers & UI Renderer
 */

const service = require('./tokogorontalo.js');

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag]));
}

function isFailureStatus(statusStr) {
  if (!statusStr) return false;
  const s = String(statusStr).toLowerCase().trim();
  return ['failed', 'gagal', 'error', 'batal', 'rejected', 'declined', 'refund', 'cancel'].includes(s) ||
         s.includes('gagal') || s.includes('dibatalkan') || s.includes('ditolak');
}

function isSuccessStatus(statusStr) {
  if (!statusStr) return false;
  const s = String(statusStr).toLowerCase().trim();
  return ['success', 'sukses', 'berhasil'].includes(s) || s.includes('sukses') || s.includes('berhasil');
}

/**
 * Eksekusi Auto-Refund Instan
 * Mengembalikan saldo ke akun pengguna seketika tanpa menunggu proses manual admin,
 * mencatat mutasi saldo akun, mengirim notifikasi Inbox, serta logging Telegram.
 */
async function executeAutoRefund(rawDb, order, failureReason, source = 'webhook', sendTelegramLog = null, appSettings = null) {
  if (!order || !order.reqid || !order.email) return { refunded: false, reason: 'invalid_order' };

  // Ambil transaksi paling terkini dari database
  const current = rawDb.prepare('SELECT * FROM ppob_transactions WHERE reqid = ?').get(order.reqid);
  if (!current) return { refunded: false, reason: 'order_not_found' };

  // Pastikan tidak pernah di-refund ganda (Idempotency)
  if (current.is_refunded === 1 || current.status === 'refunded') {
    console.log(`[Auto-Refund] Order ${order.reqid} sudah pernah di-refund sebelumnya.`);
    return { refunded: false, reason: 'already_refunded' };
  }

  // Jika statusnya success, tidak boleh di-refund
  if (isSuccessStatus(current.status)) {
    console.warn(`[Auto-Refund] Order ${order.reqid} berstatus success, refund dibatalkan.`);
    return { refunded: false, reason: 'order_was_success' };
  }

  const refundAmount = Number(current.selling_price) || 0;
  if (refundAmount <= 0) {
    return { refunded: false, reason: 'zero_amount' };
  }

  const nowWIB = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB';
  const cleanReason = String(failureReason || current.info || 'Transaksi ditolak oleh sistem provider').trim();

  // Eksekusi atomic refund
  const runRefundTransaction = () => {
    // 1. Tandai ppob_transactions sebagai refunded & failed
    const updateResult = rawDb.prepare(`
      UPDATE ppob_transactions
      SET status = 'failed',
          is_refunded = 1,
          info = CASE WHEN info IS NULL OR info = '' THEN ? ELSE info END,
          updated_at = CURRENT_TIMESTAMP
      WHERE reqid = ? AND (is_refunded = 0 OR is_refunded IS NULL)
    `).run(cleanReason, order.reqid);

    if (updateResult.changes === 0) {
      return false; // Race condition caught
    }

    // 2. Kembalikan saldo pengguna seketika itu juga (100% Instan)
    rawDb.prepare('UPDATE users SET balance = balance + ? WHERE email = ?').run(refundAmount, current.email);

    // 3. Catat ke mutasi transaksi akun (tipe 'IN')
    rawDb.prepare(`
      INSERT INTO transactions (email, type, amount, description, balance, created_at)
      VALUES (?, 'IN', ?, ?, (SELECT balance FROM users WHERE email = ?), ?)
    `).run(
      current.email,
      refundAmount,
      `Auto-Refund PPOB Gagal: ${current.product_name} (${current.customer_no}) - Ref: ${order.reqid}`,
      current.email,
      nowWIB
    );

    // 4. Kirim notifikasi instan ke Inbox pengguna
    const titleMsg = `⚠️ Refund Saldo: Pembelian ${current.product_name} Gagal`;
    const bodyMsg = `
      <div style="font-family: inherit; line-height: 1.6;">
        <p style="margin-bottom: 8px;">Pesanan produk digital Anda tidak berhasil diproses oleh server provider dan <b style="color: #16a34a;">saldo telah otomatis dikembalikan (Refund) 100% secara instan</b> ke akun Anda tanpa perlu menunggu konfirmasi admin.</p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; margin: 12px 0; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><b>Ref ID:</b> <span style="font-family: monospace;">${order.reqid}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><b>Produk:</b> <span>${escapeHtml(current.product_name)}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><b>Tujuan:</b> <span style="font-family: monospace;">${escapeHtml(current.customer_no)}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #dc2626;"><b>Keterangan:</b> <span>${escapeHtml(cleanReason)}</span></div>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 6px; color: #16a34a; font-weight: bold; font-size: 14px;">
            <span>Saldo Dikembalikan:</span>
            <span style="font-family: monospace;">+ Rp ${refundAmount.toLocaleString('id-ID')}</span>
          </div>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 6px;">Saldo akun Anda telah bertambah seketika dan dapat langsung digunakan kembali untuk transaksi berikutnya.</p>
      </div>
    `;

    rawDb.prepare(`
      INSERT INTO inbox (email, title, message, date, read)
      VALUES (?, ?, ?, ?, 0)
    `).run(current.email, titleMsg, bodyMsg, nowWIB);

    return true;
  };

  let wasRefunded = false;
  if (typeof rawDb.transaction === 'function') {
    wasRefunded = rawDb.transaction(runRefundTransaction)();
  } else {
    rawDb.exec('BEGIN TRANSACTION;');
    try {
      wasRefunded = runRefundTransaction();
      rawDb.exec('COMMIT;');
    } catch (e) {
      rawDb.exec('ROLLBACK;');
      throw e;
    }
  }

  if (wasRefunded) {
    console.log(`[Auto-Refund SUCCESS] Ref: ${order.reqid} -> Rp ${refundAmount} refunded to ${current.email} via ${source}`);

    // Kirim Telegram Log untuk audit admin
    if (sendTelegramLog) {
      try {
        await sendTelegramLog(
          '💸 AUTO-REFUND INSTAN BERHASIL',
          `Order PPOB Gagal dari Provider!\n\n` +
          `Ref: <code>${order.reqid}</code>\n` +
          `User: <b>${current.email}</b>\n` +
          `Produk: <b>${current.product_name}</b>\n` +
          `Tujuan: <code>${current.customer_no}</code>\n` +
          `Alasan: <i>${cleanReason}</i>\n` +
          `Saldo Dikembalikan: <b>Rp ${refundAmount.toLocaleString('id-ID')}</b> (100% Instan)\n` +
          `Sumber: <code>${source.toUpperCase()}</code>`,
          appSettings
        );
      } catch (tgErr) {
        console.warn('[Auto-Refund Telegram Error]:', tgErr.message);
      }
    }
    return { refunded: true, amount: refundAmount };
  }

  return { refunded: false, reason: 'duplicate_or_rolled_back' };
}

async function handleTokoGorontaloRoutes(url, request, env, currentUser, appSettings, sendTelegramLog) {
  const path = url.pathname;
  const method = request.method;
  const rawDb = env.DB.rawDb || (require('../db.js').rawDb);

  try {
    rawDb.exec('ALTER TABLE ppob_transactions ADD COLUMN is_refunded INTEGER DEFAULT 0;');
  } catch (e) {}

  // ================================================================
  // 1. WEBHOOK / CALLBACK HANDLER DARI TOKO GORONTALO
  // ================================================================
  if (path === '/api/webhook/tokogorontalo' && method === 'POST') {
    try {
      const payload = await request.json();
      console.log('[Webhook TokoGorontalo] Received payload:', JSON.stringify(payload));

      const { reqid, status, kode, tujuan, harga, saldo, info, detail } = payload;
      if (!reqid) {
        return jsonResponse({ status: 'ignored', message: 'No reqid provided' });
      }

      // Cari transaksi di database
      const existing = rawDb.prepare('SELECT * FROM ppob_transactions WHERE reqid = ?').get(reqid);
      if (!existing) {
        console.warn(`[Webhook TokoGorontalo] Order not found for reqid: ${reqid}`);
        return jsonResponse({ status: 'ok', message: 'Order not found, logged' });
      }

      const normalizedStatus = String(status || '').toLowerCase().trim();
      let sn = existing.sn || '';
      if (detail) {
        const parsed = service.parseDetail(detail);
        if (parsed.sn) sn = parsed.sn;
      }

      // Update data transaksi dari webhook
      rawDb.prepare(`
        UPDATE ppob_transactions
        SET status = CASE 
              WHEN status = 'failed' THEN 'failed'
              WHEN ? IN ('success', 'sukses', 'berhasil') THEN 'success'
              WHEN ? IN ('failed', 'gagal', 'error', 'batal', 'rejected', 'declined', 'refund', 'cancel') THEN 'failed'
              ELSE COALESCE(NULLIF(?, ''), status)
            END,
            sn = COALESCE(NULLIF(?, ''), sn),
            info = COALESCE(NULLIF(?, ''), info),
            detail = COALESCE(NULLIF(?, ''), detail),
            raw_response = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE reqid = ?
      `).run(
        normalizedStatus,
        normalizedStatus,
        normalizedStatus,
        sn,
        info || '',
        detail || '',
        JSON.stringify(payload),
        reqid
      );

      // 1. Handle SUCCESS
      if (isSuccessStatus(normalizedStatus) && !isSuccessStatus(existing.status)) {
        const titleMsg = `Pembelian ${existing.product_name} Berhasil!`;
        const bodyMsg = `Nomor Tujuan: <b>${existing.customer_no}</b><br>SN / Token: <b style="color: #0284c7; font-size: 15px;">${sn || '-'}</b><br>Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`;
        
        rawDb.prepare(`
          INSERT INTO inbox (email, title, message, date, read)
          VALUES (?, ?, ?, ?, 0)
        `).run(existing.email, titleMsg, bodyMsg, new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB');

        if (sendTelegramLog) {
          await sendTelegramLog(
            '⚡ PPOB TRANSAKSI BERHASIL',
            `Produk: <b>${existing.product_name}</b>\nTujuan: <code>${existing.customer_no}</code>\nSN: <code>${sn}</code>\nUser: ${existing.email}\nRef: ${reqid}`,
            appSettings
          );
        }
      }

      // 2. Handle FAILED -> Auto-Refund Instan Seketika itu Juga Tanpa Menunggu Admin
      if (isFailureStatus(normalizedStatus) || isFailureStatus(info) || isFailureStatus(detail)) {
        const failureReason = info || detail || 'Ditolak / Gagal dari server provider';
        await executeAutoRefund(rawDb, existing, failureReason, 'webhook', sendTelegramLog, appSettings);
      }

      return jsonResponse({ status: 'ok', received: true });
    } catch (e) {
      console.error('[Webhook TokoGorontalo Error]:', e.message);
      return jsonResponse({ status: 'error', message: e.message }, 500);
    }
  }

  // ================================================================
  // 2. PUBLIC / CUSTOMER PPOB API
  // ================================================================
  if (path === '/api/ppob/categories' && method === 'GET') {
    const categories = [
      { id: 'pulsa', name: 'Pulsa Reguler', icon: 'smartphone', desc: 'Isi pulsa instan semua operator' },
      { id: 'data', name: 'Paket Data', icon: 'wifi', desc: 'Kuota & internet murah' },
      { id: 'pln', name: 'Token PLN', icon: 'zap', desc: 'Listrik prabayar 24/7' },
      { id: 'ewallet', name: 'Top Up E-Wallet', icon: 'wallet', desc: 'DANA, GoPay, OVO, ShopeePay' },
      { id: 'game', name: 'Voucher Game', icon: 'gamepad', desc: 'ML, FF, PUBG, Roblox dll' }
    ];
    return jsonResponse({ success: true, categories });
  }

  if (path === '/api/ppob/detect-operator' && method === 'GET') {
    const phone = url.searchParams.get('phone') || '';
    const brand = service.detectOperator(phone);
    return jsonResponse({ success: true, phone, brand });
  }

  if (path === '/api/ppob/products' && method === 'GET') {
    let category = url.searchParams.get('category') || '';
    let brand = url.searchParams.get('brand') || '';
    const phone = url.searchParams.get('phone') || '';

    if (!brand && phone) {
      const detected = service.detectOperator(phone);
      if (detected) brand = detected;
    }

    let sql = 'SELECT id, product_code, product_name, description, product_type, category, brand, cost_price, selling_price FROM ppob_products WHERE is_active = 1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (brand) {
      sql += ' AND brand = ?';
      params.push(brand.toUpperCase());
    }

    sql += ' ORDER BY selling_price ASC LIMIT 250';

    try {
      const products = rawDb.prepare(sql).all(...params);
      return jsonResponse({ success: true, count: products.length, brand, category, products });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }

  if (path === '/api/ppob/order' && method === 'POST') {
    if (!currentUser) {
      return jsonResponse({ success: false, message: 'Silakan login terlebih dahulu untuk melakukan transaksi.' }, 401);
    }

    try {
      const { product_code, customer_no } = await request.json();
      if (!product_code || !customer_no) {
        return jsonResponse({ success: false, message: 'Kode produk dan nomor tujuan wajib diisi.' }, 400);
      }

      // Ambil produk
      const product = rawDb.prepare('SELECT * FROM ppob_products WHERE product_code = ? AND is_active = 1').get(product_code);
      if (!product) {
        return jsonResponse({ success: false, message: 'Produk tidak ditemukan atau sedang tidak aktif.' }, 404);
      }

      // Proteksi Anti Double-Click / Idempotency (30 Detik)
      // Mencegah saldo terpotong ganda jika user menekan tombol berulang kali saat koneksi lambat
      const recentTx = rawDb.prepare(`
        SELECT reqid, product_code, customer_no, created_at,
          CAST((strftime('%s', 'now') - strftime('%s', created_at)) AS INTEGER) as elapsed_sec
        FROM ppob_transactions
        WHERE email = ?
        ORDER BY id DESC
        LIMIT 1
      `).get(currentUser.email);

      if (recentTx && recentTx.elapsed_sec !== null && recentTx.elapsed_sec < 30) {
        const remaining = Math.max(1, 30 - Math.max(0, recentTx.elapsed_sec));
        return jsonResponse({
          success: false,
          locked: true,
          remaining_seconds: remaining,
          message: `Proteksi Anti Double-Click: Anda baru saja mengirim pesanan. Mohon tunggu ${remaining} detik sebelum transaksi baru untuk mencegah saldo terpotong ganda.`
        }, 429);
      }

      // Ambil data user terkini
      const user = rawDb.prepare('SELECT balance FROM users WHERE email = ?').get(currentUser.email);
      const userBalance = Number(user.balance) || 0;
      const price = Number(product.selling_price) || 0;

      if (userBalance < price) {
        return jsonResponse({
          success: false,
          message: `Saldo Anda (Rp ${userBalance.toLocaleString('id-ID')}) tidak mencukupi untuk membeli produk seharga Rp ${price.toLocaleString('id-ID')}. Silakan Top Up saldo terlebih dahulu.`
        });
      }

      // Generate REQID unik
      const reqid = `WP${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Potong saldo user
      rawDb.prepare('UPDATE users SET balance = balance - ? WHERE email = ?').run(price, currentUser.email);
      
      // Catat mutasi saldo
      rawDb.prepare(`
        INSERT INTO transactions (email, type, amount, description, balance, created_at)
        VALUES (?, 'OUT', ?, ?, (SELECT balance FROM users WHERE email = ?), ?)
      `).run(
        currentUser.email,
        price,
        `Pembelian ${product.product_name} ke ${customer_no} (Ref: ${reqid})`,
        currentUser.email,
        new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'
      );

      // Simpan transaksi awal dengan status pending
      rawDb.prepare(`
        INSERT INTO ppob_transactions (
          reqid, email, product_code, product_name, customer_no, cost_price, selling_price, status, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `).run(
        reqid,
        currentUser.email,
        product.product_code,
        product.product_name,
        customer_no,
        product.cost_price,
        price
      );

      // URL Callback webhook
      const webhookUrl = `${url.origin}/api/webhook/tokogorontalo`;

      // Eksekusi API Toko Gorontalo
      const isEwallet = product.category === 'ewallet';
      const isOpen = product.product_type === 'open';
      const jenistrx = (isEwallet || isOpen) ? 2 : 1;
      const apiResult = await service.createTransaction({
        reqid,
        kodeproduk: product.product_code,
        tujuan: customer_no,
        jenistrx,
        nominaltrx: isOpen ? product.cost_price : undefined,
        urlcallback: webhookUrl
      });

      console.log(`[PPOB Order Result] reqid: ${reqid} ->`, JSON.stringify(apiResult));

      let finalStatus = 'pending';
      let sn = '';
      let infoMsg = apiResult.info || 'Transaksi sedang diproses oleh sistem provider.';

      if (isSuccessStatus(apiResult.status)) {
        finalStatus = 'success';
        if (apiResult.detail) {
          const parsed = service.parseDetail(apiResult.detail);
          sn = parsed.sn;
        }
      } else if (isFailureStatus(apiResult.status)) {
        finalStatus = 'failed';
        await executeAutoRefund(
          rawDb,
          {
            reqid,
            email: currentUser.email,
            selling_price: price,
            product_name: product.product_name,
            customer_no
          },
          infoMsg,
          'immediate_order_api',
          sendTelegramLog,
          appSettings
        );
      }

      // Update transaksi di DB
      rawDb.prepare(`
        UPDATE ppob_transactions
        SET status = CASE WHEN is_refunded = 1 THEN 'failed' ELSE ? END,
            sn = COALESCE(NULLIF(?, ''), sn),
            info = COALESCE(NULLIF(?, ''), info),
            detail = COALESCE(NULLIF(?, ''), detail),
            raw_response = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE reqid = ?
      `).run(
        finalStatus,
        sn,
        infoMsg,
        apiResult.detail || '',
        JSON.stringify(apiResult),
        reqid
      );

      // Kirim Telegram Log
      if (sendTelegramLog) {
        await sendTelegramLog(
          '🛒 ORDER PPOB BARU',
          `Produk: <b>${product.product_name}</b>\nTujuan: <code>${customer_no}</code>\nHarga: Rp ${price.toLocaleString('id-ID')}\nStatus: ${finalStatus.toUpperCase()}\nRef: ${reqid}\nUser: ${currentUser.email}`,
          appSettings
        );
      }

      return jsonResponse({
        success: true,
        reqid,
        status: finalStatus,
        product_name: product.product_name,
        customer_no,
        price,
        sn,
        message: infoMsg
      });

    } catch (e) {
      console.error('[PPOB Order Error]:', e);
      return jsonResponse({ success: false, message: 'Gagal memproses pesanan: ' + e.message }, 500);
    }
  }

  if (path === '/api/ppob/order-status' && method === 'GET') {
    const reqid = url.searchParams.get('reqid') || '';
    if (!reqid) return jsonResponse({ success: false, message: 'Parameter reqid wajib diisi' }, 400);

    const order = rawDb.prepare('SELECT * FROM ppob_transactions WHERE reqid = ?').get(reqid);
    if (!order) return jsonResponse({ success: false, message: 'Pesanan tidak ditemukan' }, 404);

    // Jika masih pending, coba cek status ke Toko Gorontalo secara live
    if (order.status === 'pending') {
      try {
        const liveStatus = await service.checkStatusToday({ reqid: order.reqid, tujuan: order.customer_no });
        if (liveStatus && liveStatus.status) {
          const newStatus = String(liveStatus.status).toLowerCase();
          let sn = order.sn;
          if (liveStatus.detail) {
            const parsed = service.parseDetail(liveStatus.detail);
            if (parsed.sn) sn = parsed.sn;
          }

          rawDb.prepare(`
            UPDATE ppob_transactions
            SET status = CASE WHEN is_refunded = 1 THEN 'failed' ELSE ? END,
                sn = COALESCE(NULLIF(?, ''), sn),
                info = COALESCE(NULLIF(?, ''), info),
                detail = COALESCE(NULLIF(?, ''), detail),
                updated_at = CURRENT_TIMESTAMP
            WHERE reqid = ?
          `).run(newStatus, sn, liveStatus.info || order.info, liveStatus.detail || order.detail, reqid);

          order.status = newStatus;
          order.sn = sn;
          order.info = liveStatus.info || order.info;

          // Auto-refund instan jika provider melaporkan status gagal saat live check
          if (isFailureStatus(newStatus) || isFailureStatus(liveStatus.info)) {
            await executeAutoRefund(rawDb, order, liveStatus.info || 'Gagal dari server provider', 'live_check', sendTelegramLog, appSettings);
            order.status = 'failed';
          }
        }
      } catch (err) {
        console.warn('[PPOB Live Check Error]:', err.message);
      }
    }

    return jsonResponse({ success: true, order });
  }

  // ================================================================
  // 3. ADMIN API ENDPOINTS (HANYA ADMINISTRATOR)
  // ================================================================
  if (path.startsWith('/api/admin/tokogorontalo/')) {
    if (!currentUser || currentUser.email !== env.ADMIN_EMAIL) {
      return jsonResponse({ success: false, message: 'Unauthorized. Hanya Administrator yang dapat mengakses menu ini.' }, 401);
    }

    // A. Info Akun & Saldo Host
    if (path === '/api/admin/tokogorontalo/info' && method === 'GET') {
      const balanceInfo = await service.getBalance();
      const productCount = rawDb.prepare('SELECT COUNT(*) as count FROM ppob_products').get().count;
      const activeCount = rawDb.prepare('SELECT COUNT(*) as count FROM ppob_products WHERE is_active = 1').get().count;
      const orderCount = rawDb.prepare('SELECT COUNT(*) as count FROM ppob_transactions').get().count;
      
      return jsonResponse({
        success: true,
        balance: balanceInfo,
        productCount,
        activeCount,
        orderCount,
        config: {
          userid: service.userid,
          baseUrl: service.baseUrl
        }
      });
    }

    // B. Sinkronisasi Katalog Produk
    if (path === '/api/admin/tokogorontalo/sync' && method === 'POST') {
      try {
        let markup = 750;
        try {
          const body = await request.json();
          if (body.markup !== undefined) markup = Number(body.markup);
        } catch {}

        const result = await service.syncProducts(rawDb, markup);
        return jsonResponse({
          success: true,
          count: result.count,
          total: result.total,
          message: `Berhasil mensinkronkan ${result.count} produk dari Toko Gorontalo (Markup: +Rp ${markup.toLocaleString('id-ID')}).`
        });
      } catch (e) {
        return jsonResponse({ success: false, message: 'Gagal sinkronisasi produk: ' + e.message }, 500);
      }
    }

    // C. Daftar Produk PPOB (Tabel Admin dengan Pencarian & Pagination)
    if (path === '/api/admin/tokogorontalo/products' && method === 'GET') {
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
      const limit = Math.max(10, Math.min(100, parseInt(url.searchParams.get('limit') || '30')));
      const offset = (page - 1) * limit;
      const search = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category') || '';
      const brand = url.searchParams.get('brand') || '';

      let sql = 'SELECT * FROM ppob_products WHERE 1=1';
      let countSql = 'SELECT COUNT(*) as total FROM ppob_products WHERE 1=1';
      const params = [];
      const countParams = [];

      if (search) {
        sql += ' AND (product_code LIKE ? OR product_name LIKE ? OR provider_name LIKE ?)';
        countSql += ' AND (product_code LIKE ? OR product_name LIKE ? OR provider_name LIKE ?)';
        const q = `%${search}%`;
        params.push(q, q, q);
        countParams.push(q, q, q);
      }
      if (category) {
        sql += ' AND category = ?';
        countSql += ' AND category = ?';
        params.push(category);
        countParams.push(category);
      }
      if (brand) {
        sql += ' AND brand = ?';
        countSql += ' AND brand = ?';
        params.push(brand);
        countParams.push(brand);
      }

      sql += ' ORDER BY id ASC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const total = rawDb.prepare(countSql).get(...countParams).total;
      const products = rawDb.prepare(sql).all(...params);

      return jsonResponse({
        success: true,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        products
      });
    }

    // D. Update Produk Satuan (Harga / Status Aktif)
    if (path === '/api/admin/tokogorontalo/update-product' && method === 'POST') {
      const { product_code, selling_price, markup_value, is_active } = await request.json();
      if (!product_code) return jsonResponse({ success: false, message: 'Kode produk wajib ada' }, 400);

      rawDb.prepare(`
        UPDATE ppob_products
        SET selling_price = COALESCE(?, selling_price),
            markup_value = COALESCE(?, markup_value),
            is_active = COALESCE(?, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE product_code = ?
      `).run(selling_price, markup_value, is_active, product_code);

      return jsonResponse({ success: true, message: `Produk ${product_code} berhasil diperbarui.` });
    }

    // E. Bulk Markup Per Kategori / Global
    if (path === '/api/admin/tokogorontalo/bulk-markup' && method === 'POST') {
      const { category, brand, markup_value } = await request.json();
      const markup = Math.max(0, parseInt(markup_value) || 0);

      let sql = 'UPDATE ppob_products SET markup_value = ?, selling_price = cost_price + ?, updated_at = CURRENT_TIMESTAMP WHERE 1=1';
      const params = [markup, markup];

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }
      if (brand) {
        sql += ' AND brand = ?';
        params.push(brand);
      }

      const info = rawDb.prepare(sql).run(...params);
      return jsonResponse({
        success: true,
        changes: info.changes,
        message: `Berhasil memperbarui markup +Rp ${markup.toLocaleString('id-ID')} pada ${info.changes} produk.`
      });
    }

    // F. Riwayat Transaksi PPOB Admin
    if (path === '/api/admin/tokogorontalo/orders' && method === 'GET') {
      const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50'));
      const orders = rawDb.prepare(`
        SELECT * FROM ppob_transactions ORDER BY id DESC LIMIT ?
      `).all(limit);
      return jsonResponse({ success: true, orders });
    }

    // G. Cek Status Manual Pesanan dari Admin
    if (path === '/api/admin/tokogorontalo/orders/check' && method === 'POST') {
      const { reqid, customer_no } = await request.json();
      const live = await service.checkStatusToday({ reqid, tujuan: customer_no });
      
      if (live && live.status) {
        const newStatus = String(live.status).toLowerCase();
        let sn = '';
        if (live.detail) {
          const parsed = service.parseDetail(live.detail);
          sn = parsed.sn;
        }

        rawDb.prepare(`
          UPDATE ppob_transactions
          SET status = CASE WHEN is_refunded = 1 THEN 'failed' ELSE ? END,
              sn = COALESCE(NULLIF(?, ''), sn),
              info = COALESCE(NULLIF(?, ''), info),
              detail = COALESCE(NULLIF(?, ''), detail),
              updated_at = CURRENT_TIMESTAMP
          WHERE reqid = ?
        `).run(newStatus, sn, live.info || '', live.detail || '', reqid);

        // Auto-refund instan jika provider mengembalikan status gagal saat admin memeriksa
        if (isFailureStatus(newStatus) || isFailureStatus(live.info)) {
          const order = rawDb.prepare('SELECT * FROM ppob_transactions WHERE reqid = ?').get(reqid);
          if (order) {
            await executeAutoRefund(rawDb, order, live.info || 'Gagal dari server provider', 'admin_check', sendTelegramLog, appSettings);
          }
        }
      }

      return jsonResponse({ success: true, live });
    }

    // H. Manual Refund Pesanan dari Admin jika diperlukan
    if (path === '/api/admin/tokogorontalo/orders/refund' && method === 'POST') {
      const { reqid, reason } = await request.json();
      if (!reqid) return jsonResponse({ success: false, message: 'reqid wajib diisi' }, 400);

      const order = rawDb.prepare('SELECT * FROM ppob_transactions WHERE reqid = ?').get(reqid);
      if (!order) return jsonResponse({ success: false, message: 'Pesanan tidak ditemukan' }, 404);

      const result = await executeAutoRefund(rawDb, order, reason || 'Refund manual oleh Administrator', 'admin_manual', sendTelegramLog, appSettings);
      if (result.refunded) {
        return jsonResponse({ success: true, message: `Berhasil mengembalikan saldo Rp ${result.amount.toLocaleString('id-ID')} ke akun ${order.email}` });
      } else {
        return jsonResponse({ success: false, message: `Refund tidak dapat diproses: ${result.reason}` }, 400);
      }
    }

    // H. Buat Tiket Deposit Saldo Host
    if (path === '/api/admin/tokogorontalo/tiket-deposit' && method === 'POST') {
      const { nominal, bank } = await request.json();
      if (!nominal || !bank) {
        return jsonResponse({ success: false, message: 'Nominal dan Bank wajib diisi' }, 400);
      }
      const ticket = await service.createDepositTicket({ nominal, bank });
      return jsonResponse({ success: true, ticket });
    }

    // I. Cek IP Public Server VPS (Untuk didaftarkan ke Whitelist Toko Gorontalo)
    if (path === '/api/admin/tokogorontalo/server-ip' && method === 'GET') {
      let ipv4 = '116.212.74.104';
      let ipv6 = '2001:df7:5300:23::68';
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(4000) });
        const ipData = await ipRes.json();
        if (ipData && ipData.ip) ipv4 = ipData.ip;
      } catch (e) {}
      return jsonResponse({ success: true, ip: ipv4, ipv4, ipv6 });
    }
  }

  return null; // Teruskan jika bukan route Toko Gorontalo
}

/**
 * Render Konten Halaman Beli Pulsa & PPOB
 */
function renderPPOBContent(currentUser, appSettings, env) {
  const userBalance = currentUser ? Number(currentUser.balance) || 0 : 0;
  
  return `
  <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-8 md:p-12 mb-8 shadow-xl">
          <div class="relative z-10 max-w-2xl">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-sky-100 backdrop-blur-md mb-4 border border-white/20">
                  <svg class="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"></path></svg>
                  Layanan 24 Jam Otomatis
              </span>
              <h1 class="text-3xl md:text-5xl font-black tracking-tight mb-3">Isi Pulsa, Data & Token PLN</h1>
              <p class="text-sky-100 text-sm md:text-base leading-relaxed mb-6">
                  Nikmati transaksi digital serba instan dengan harga termurah. Saldo langsung masuk dalam hitungan detik dengan Serial Number (SN) resmi.
              </p>
              ${currentUser ? `
              <div class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                  <span class="text-xs text-sky-200">Saldo Akun Anda:</span>
                  <span class="text-lg font-black text-white font-mono">Rp ${userBalance.toLocaleString('id-ID')}</span>
                  <a href="/" class="ml-2 text-xs bg-white text-sky-700 font-bold px-3 py-1 rounded-xl hover:bg-sky-50 transition shadow-xs">+ Top Up</a>
              </div>
              ` : `
              <a href="/login" class="inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-6 py-3 rounded-2xl hover:bg-sky-50 transition shadow-lg text-sm">
                  Masuk untuk Bertransaksi &rarr;
              </a>
              `}
          </div>
          <!-- Decorative circle -->
          <div class="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      <!-- Kategori Tab Selector -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <button onclick="selectCategory('pulsa')" id="cat-btn-pulsa" class="cat-btn active flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition font-bold text-center gap-2 shadow-xs cursor-pointer">
              <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <span class="text-sm">Pulsa Reguler</span>
          </button>
          <button onclick="selectCategory('data')" id="cat-btn-data" class="cat-btn flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition font-bold text-center gap-2 shadow-xs cursor-pointer">
              <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
              </div>
              <span class="text-sm">Paket Data</span>
          </button>
          <button onclick="selectCategory('pln')" id="cat-btn-pln" class="cat-btn flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition font-bold text-center gap-2 shadow-xs cursor-pointer">
              <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <span class="text-sm">Token PLN</span>
          </button>
          <button onclick="selectCategory('ewallet')" id="cat-btn-ewallet" class="cat-btn flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition font-bold text-center gap-2 shadow-xs cursor-pointer">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
              <span class="text-sm">E-Wallet</span>
          </button>
          <button onclick="selectCategory('game')" id="cat-btn-game" class="cat-btn flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition font-bold text-center gap-2 shadow-xs cursor-pointer col-span-2 sm:col-span-1">
              <div class="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
              </div>
              <span class="text-sm">Voucher Game</span>
          </button>
      </div>

      <!-- Main Interaction Form -->
      <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm mb-8">
          <!-- Input Nomor HP / ID Pelanggan -->
          <div class="mb-6">
              <label id="input-label" class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nomor Handphone Tujuan
              </label>
              <div class="relative">
                  <input type="tel" id="customerNoInput" oninput="handlePhoneInput(this.value)" placeholder="Contoh: 081234567890"
                         class="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-4 pr-36 text-lg font-mono font-bold text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-none transition">
                  <!-- Operator Badge Detected -->
                  <div id="operatorBadge" class="absolute right-3 top-1/2 -translate-y-1/2 hidden items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                      <span id="operatorLogo" class="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                      <span id="operatorName" class="text-xs font-black text-slate-800 uppercase tracking-wider">TELKOMSEL</span>
                  </div>
              </div>
              <p id="helperText" class="text-xs text-slate-400 mt-2">Ketik 4 digit nomor HP untuk otomatis mendeteksi operator (Telkomsel, Indosat, XL, Axis, Tri, Smartfren, By.U).</p>
          </div>

          <!-- Brand / Provider Pills (untuk E-Wallet atau Game) -->
          <div id="brandSelectorContainer" class="hidden mb-6">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Layanan</label>
              <div id="brandPills" class="flex flex-wrap gap-2"></div>
          </div>

          <!-- Products Grid -->
          <div>
              <!-- Anti Double-Click / Idempotency 30s Lock Banner -->
              <div id="trxLockNotice" class="hidden mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300 text-amber-900 shadow-sm flex items-center justify-between">
                  <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                          ⏳
                      </div>
                      <div>
                          <div class="font-extrabold text-sm text-amber-950 flex items-center gap-2">
                              <span>Proteksi Anti Double-Click Aktif</span>
                              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 uppercase">30 Detik</span>
                          </div>
                          <p class="text-xs text-amber-800 mt-0.5">Tombol transaksi dikunci sementara untuk mencegah saldo terpotong ganda saat koneksi internet lambat.</p>
                      </div>
                  </div>
                  <div class="text-right shrink-0 pl-3">
                      <span class="text-[11px] font-bold text-amber-700 block uppercase tracking-wider">Terkunci</span>
                      <span id="trxLockTimerBadge" class="text-2xl font-black font-mono text-amber-900">30s</span>
                  </div>
              </div>

              <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wider" id="productListTitle">Pilihan Produk</h3>
                  <span id="productCountBadge" class="text-xs text-slate-400 font-medium">0 produk tersedia</span>
              </div>

              <!-- Loading Skeleton -->
              <div id="productsLoading" class="hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div class="p-5 rounded-2xl border border-slate-200 animate-pulse bg-slate-50 h-28"></div>
                  <div class="p-5 rounded-2xl border border-slate-200 animate-pulse bg-slate-50 h-28"></div>
                  <div class="p-5 rounded-2xl border border-slate-200 animate-pulse bg-slate-50 h-28"></div>
              </div>

              <!-- Empty State -->
              <div id="productsEmpty" class="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                  <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <p class="text-slate-600 font-bold text-sm mb-1">Silakan masukkan nomor tujuan di atas</p>
                  <p class="text-slate-400 text-xs">Daftar denominasi dan harga akan otomatis tampil.</p>
              </div>

              <!-- Real Products Grid -->
              <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"></div>
          </div>
      </div>
  </div>

  <style>
      .cat-btn.active {
          border-color: #0284c7 !important;
          background-color: #f0f9ff !important;
          color: #0369a1 !important;
      }
      .cat-btn:not(.active) {
          border-color: #e2e8f0;
          background-color: #ffffff;
          color: #64748b;
      }
      .cat-btn:not(.active):hover {
          border-color: #cbd5e1;
          background-color: #f8fafc;
      }
  </style>

  <script>
      let currentCategory = 'pulsa';
      let currentBrand = '';
      let detectedBrand = '';
      let cachedProducts = [];

      const BRAND_NAMES = {
          'TELKOMSEL': 'Telkomsel',
          'INDOSAT': 'Indosat IM3',
          'XL': 'XL Axiata',
          'AXIS': 'Axis',
          'TRI': 'Tri (3)',
          'SMARTFREN': 'Smartfren',
          'BYU': 'By.U',
          'PLN': 'Token PLN',
          'DANA': 'DANA',
          'GOPAY': 'GoPay',
          'OVO': 'OVO',
          'SHOPEEPAY': 'ShopeePay',
          'GAME': 'Game'
      };

      function selectCategory(cat) {
          currentCategory = cat;
          document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
          const btn = document.getElementById('cat-btn-' + cat);
          if (btn) btn.classList.add('active');

          const input = document.getElementById('customerNoInput');
          const label = document.getElementById('input-label');
          const helper = document.getElementById('helperText');
          const brandContainer = document.getElementById('brandSelectorContainer');

          if (cat === 'pln') {
              label.innerText = 'Nomor Meter / ID Pelanggan PLN';
              input.placeholder = 'Contoh: 14510906234 (11-12 digit)';
              helper.innerText = 'Masukkan 11-12 digit ID Pelanggan atau Nomor Meter PLN.';
              brandContainer.classList.add('hidden');
              currentBrand = 'PLN';
              fetchProducts();
          } else if (cat === 'ewallet') {
              label.innerText = 'Nomor Akun E-Wallet';
              input.placeholder = 'Contoh: 081234567890';
              helper.innerText = 'Pilih e-wallet dan masukkan nomor HP yang terdaftar.';
              brandContainer.classList.remove('hidden');
              renderBrandPills(['DANA', 'GOPAY', 'OVO', 'SHOPEEPAY']);
              currentBrand = 'DANA';
              fetchProducts();
          } else if (cat === 'game') {
              label.innerText = 'User ID Akun Game';
              input.placeholder = 'Masukkan User ID (Contoh: 12345678)';
              helper.innerText = 'Pilih game lalu masukkan User ID & Server ID.';
              brandContainer.classList.remove('hidden');
              renderBrandPills(['GAME']);
              currentBrand = 'GAME';
              fetchProducts();
          } else {
              label.innerText = 'Nomor Handphone Tujuan';
              input.placeholder = 'Contoh: 081234567890';
              helper.innerText = 'Ketik 4 digit nomor HP untuk otomatis mendeteksi operator.';
              brandContainer.classList.add('hidden');
              handlePhoneInput(input.value);
          }
      }

      function renderBrandPills(brands) {
          const container = document.getElementById('brandPills');
          container.innerHTML = brands.map((b, idx) => \`
              <button onclick="setBrand('\${b}')" id="pill-\${b}" class="brand-pill \${idx === 0 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer">
                  \${BRAND_NAMES[b] || b}
              </button>
          \`).join('');
      }

      function setBrand(brand) {
          currentBrand = brand;
          document.querySelectorAll('.brand-pill').forEach(btn => {
              btn.classList.remove('bg-sky-600', 'text-white');
              btn.classList.add('bg-slate-100', 'text-slate-700');
          });
          const activeBtn = document.getElementById('pill-' + brand);
          if (activeBtn) {
              activeBtn.classList.remove('bg-slate-100', 'text-slate-700');
              activeBtn.classList.add('bg-sky-600', 'text-white');
          }
          fetchProducts();
      }

      async function handlePhoneInput(val) {
          const clean = val.replace(/\\D/g, '');
          const badge = document.getElementById('operatorBadge');
          const nameSpan = document.getElementById('operatorName');

          if (currentCategory === 'pln' || currentCategory === 'ewallet' || currentCategory === 'game') {
              badge.classList.add('hidden');
              return;
          }

          if (clean.length >= 4) {
              try {
                  const res = await fetch('/api/ppob/detect-operator?phone=' + clean);
                  const data = await res.json();
                  if (data.success && data.brand) {
                      detectedBrand = data.brand;
                      currentBrand = data.brand;
                      nameSpan.innerText = BRAND_NAMES[data.brand] || data.brand;
                      badge.classList.remove('hidden');
                      badge.classList.add('flex');
                      fetchProducts();
                      return;
                  }
              } catch(e) {}
          }

          badge.classList.add('hidden');
          if (clean.length < 4) {
              currentBrand = '';
              document.getElementById('productsGrid').innerHTML = '';
              document.getElementById('productsEmpty').classList.remove('hidden');
              document.getElementById('productCountBadge').innerText = '0 produk';
          }
      }

      async function fetchProducts() {
          const loading = document.getElementById('productsLoading');
          const grid = document.getElementById('productsGrid');
          const empty = document.getElementById('productsEmpty');
          const countBadge = document.getElementById('productCountBadge');

          loading.classList.remove('hidden');
          grid.innerHTML = '';
          empty.classList.add('hidden');

          try {
              let url = '/api/ppob/products?category=' + currentCategory;
              if (currentBrand) url += '&brand=' + currentBrand;

              const res = await fetch(url);
              const data = await res.json();
              loading.classList.add('hidden');

              if (data.success && data.products && data.products.length > 0) {
                  cachedProducts = data.products;
                  countBadge.innerText = data.products.length + ' produk tersedia';
                  renderProductCards(data.products);
              } else {
                  empty.classList.remove('hidden');
                  countBadge.innerText = '0 produk';
              }
          } catch(e) {
              loading.classList.add('hidden');
              empty.classList.remove('hidden');
          }
      }

      const TRX_LOCK_STORAGE_KEY = 'wp_trx_lock_until';
      let trxLockInterval = null;

      function getTrxLockUntil() {
          try {
              return parseInt(localStorage.getItem(TRX_LOCK_STORAGE_KEY) || '0', 10);
          } catch(e) {
              return 0;
          }
      }

      function isTrxLocked() {
          return getTrxRemainingSeconds() > 0;
      }

      function getTrxRemainingSeconds() {
          const lockUntil = getTrxLockUntil();
          const now = Date.now();
          if (lockUntil > now) {
              return Math.ceil((lockUntil - now) / 1000);
          }
          return 0;
      }

      function setTrxLock(seconds = 30) {
          try {
              const expireAt = Date.now() + (seconds * 1000);
              localStorage.setItem(TRX_LOCK_STORAGE_KEY, String(expireAt));
          } catch(e) {}
          startTrxLockCountdown();
      }

      function clearTrxLock() {
          try {
              localStorage.removeItem(TRX_LOCK_STORAGE_KEY);
          } catch(e) {}
          if (trxLockInterval) {
              clearInterval(trxLockInterval);
              trxLockInterval = null;
          }
          const notice = document.getElementById('trxLockNotice');
          if (notice) notice.classList.add('hidden');
          updateAllButtonsLockState(0);
      }

      function startTrxLockCountdown() {
          if (trxLockInterval) clearInterval(trxLockInterval);

          const tick = () => {
              const remaining = getTrxRemainingSeconds();
              const notice = document.getElementById('trxLockNotice');
              const badge = document.getElementById('trxLockTimerBadge');

              if (remaining <= 0) {
                  clearTrxLock();
                  return;
              }

              if (notice) notice.classList.remove('hidden');
              if (badge) badge.innerText = remaining + 's';
              updateAllButtonsLockState(remaining);
          };

          tick();
          trxLockInterval = setInterval(tick, 1000);
      }

      function updateAllButtonsLockState(remaining = 0) {
          const isLocked = remaining > 0;
          document.querySelectorAll('.btn-buy-product').forEach(btn => {
              if (isLocked) {
                  btn.disabled = true;
                  btn.classList.remove('bg-sky-600', 'hover:bg-sky-500', 'cursor-pointer');
                  btn.classList.add('bg-slate-300', 'text-slate-600', 'cursor-not-allowed');
                  btn.innerText = '⏳ Tunggu (' + remaining + 's)';
              } else {
                  btn.disabled = false;
                  btn.classList.add('bg-sky-600', 'hover:bg-sky-500', 'cursor-pointer');
                  btn.classList.remove('bg-slate-300', 'text-slate-600', 'cursor-not-allowed');
                  btn.innerText = 'Beli';
              }
          });
      }

      function renderProductCards(products) {
          const grid = document.getElementById('productsGrid');
          const remaining = getTrxRemainingSeconds();
          const isLocked = remaining > 0;

          grid.innerHTML = products.map(p => \`
              <div onclick="handleCardClick('\${p.product_code}')" class="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-sky-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group">
                  <div>
                      <div class="flex items-start justify-between gap-2 mb-2">
                          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              \${p.brand}
                          </span>
                          <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Instan 24 Jam
                          </span>
                      </div>
                      <h4 class="font-extrabold text-slate-900 text-base mb-1 group-hover:text-sky-600 transition">
                          \${escapeHtmlClient(p.product_name)}
                      </h4>
                      <p class="text-xs text-slate-400 line-clamp-2 mb-4">
                          \${escapeHtmlClient(p.description || p.product_name)}
                      </p>
                  </div>
                  <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div class="text-lg font-black text-sky-600 font-mono">
                          Rp \${Number(p.selling_price).toLocaleString('id-ID')}
                      </div>
                      <button type="button" class="btn-buy-product \${isLocked ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'} font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs" \${isLocked ? 'disabled' : ''}>
                          \${isLocked ? '⏳ Tunggu (' + remaining + 's)' : 'Beli'}
                      </button>
                  </div>
              </div>
          \`).join('');
      }

      function handleCardClick(productCode) {
          if (isTrxLocked()) {
              const rem = getTrxRemainingSeconds();
              swalDark.fire({
                  title: 'Tombol Transaksi Dikunci',
                  html: \`Tombol transaksi dikunci selama <b>\${rem} detik</b> untuk mencegah saldo terpotong ganda saat koneksi lambat.<br><br><span class="text-xs text-slate-500">Silakan tunggu hitungan mundur selesai.</span>\`,
                  icon: 'warning',
                  timer: 3500,
                  timerProgressBar: true
              });
              return;
          }
          confirmOrder(productCode);
      }

      async function confirmOrder(productCode) {
          if (isTrxLocked()) {
              const rem = getTrxRemainingSeconds();
              swalDark.fire({
                  title: 'Tombol Transaksi Dikunci',
                  html: \`Tombol transaksi sedang dikunci selama <b>\${rem} detik</b> untuk proteksi saldo ganda.\`,
                  icon: 'warning',
                  timer: 3000,
                  timerProgressBar: true
              });
              return;
          }

          const product = cachedProducts.find(p => p.product_code === productCode);
          if (!product) return;

          const customerNo = document.getElementById('customerNoInput').value.trim();
          if (!customerNo) {
              swalDark.fire('Perhatian', 'Silakan masukkan nomor tujuan terlebih dahulu!', 'warning');
              document.getElementById('customerNoInput').focus();
              return;
          }

          const result = await swalDark.fire({
              title: 'Konfirmasi Pembelian',
              html: \`
                  <div class="text-left space-y-3 p-2 text-sm">
                      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <p class="text-xs text-slate-500 font-medium">Produk</p>
                          <p class="font-bold text-slate-900 text-base">\${product.product_name}</p>
                      </div>
                      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <p class="text-xs text-slate-500 font-medium">Nomor Tujuan</p>
                          <p class="font-bold text-sky-600 font-mono text-base">\${customerNo}</p>
                      </div>
                      <div class="flex justify-between items-center bg-sky-50 p-3 rounded-xl border border-sky-200">
                          <span class="text-sm font-bold text-sky-900">Total Harga</span>
                          <span class="text-lg font-black text-sky-700 font-mono">Rp \${Number(product.selling_price).toLocaleString('id-ID')}</span>
                      </div>
                      <p class="text-xs text-slate-500 italic">*Pembayaran akan langsung memotong saldo akun Warung Pulsa Anda.</p>
                  </div>
              \`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Bayar Sekarang',
              cancelButtonText: 'Batal',
              confirmButtonColor: '#0284c7',
              showLoaderOnConfirm: true,
              preConfirm: () => {
                  const confirmBtn = Swal.getConfirmButton();
                  if (confirmBtn) {
                      confirmBtn.disabled = true;
                      confirmBtn.innerText = 'Memproses...';
                  }
                  return true;
              }
          });

          if (result.isConfirmed) {
              executeOrder(product.product_code, customerNo);
          }
      }

      async function executeOrder(productCode, customerNo) {
          // Kunci tombol transaksi selama 30 detik setelah diklik
          setTrxLock(30);

          document.getElementById('loadingOverlay').classList.remove('hidden');

          try {
              const res = await fetch('/api/ppob/order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ product_code: productCode, customer_no: customerNo })
              });
              const data = await res.json();
              document.getElementById('loadingOverlay').classList.add('hidden');

              if (res.status === 429 && data.locked) {
                  setTrxLock(data.remaining_seconds || 30);
                  swalDark.fire('Proteksi Anti Double-Click', data.message, 'warning');
                  return;
              }

              if (data.success) {
                  const isSuccess = data.status === 'success';
                  const isFailed = data.status === 'failed';
                  const snText = data.sn ? \`<div class="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mt-3 text-center"><p class="text-xs text-emerald-600 font-medium mb-1">Serial Number (SN) / Token:</p><p class="font-mono font-black text-emerald-800 text-base select-all">\${data.sn}</p></div>\` : '';

                  let modalTitle = 'Pesanan Diproses!';
                  let modalIcon = 'info';
                  let statusColorClass = 'text-sky-600';
                  let statusDesc = 'Pesanan Anda telah diterima oleh sistem.';

                  if (isSuccess) {
                      modalTitle = 'Transaksi Berhasil!';
                      modalIcon = 'success';
                      statusColorClass = 'text-emerald-600';
                      statusDesc = 'Pesanan berhasil diproses oleh provider!';
                  } else if (isFailed) {
                      modalTitle = 'Transaksi Gagal / Ditolak';
                      modalIcon = 'error';
                      statusColorClass = 'text-rose-600';
                      statusDesc = 'Transaksi ditolak oleh server provider dan <b class="text-emerald-600">saldo Anda telah otomatis dikembalikan (Refund)</b>.';
                  }

                  await swalDark.fire({
                      title: modalTitle,
                      html: \`
                          <div class="text-left space-y-3 text-sm">
                              <p class="text-xs text-slate-600 leading-relaxed">\${statusDesc}</p>
                              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 font-medium">
                                  <div class="flex justify-between"><b>Ref ID:</b> <span class="font-mono">\${data.reqid}</span></div>
                                  <div class="flex justify-between"><b>Produk:</b> <span>\${escapeHtmlClient(data.product_name)}</span></div>
                                  <div class="flex justify-between"><b>Tujuan:</b> <span class="font-mono">\${escapeHtmlClient(data.customer_no)}</span></div>
                                  <div class="flex justify-between items-center pt-1 border-t border-slate-200">
                                      <b>Status:</b>
                                      <span class="font-bold uppercase px-2 py-0.5 rounded text-[11px] \${isSuccess ? 'bg-emerald-100 text-emerald-700' : (isFailed ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700')}">\${data.status}</span>
                                  </div>
                                  \${data.message ? \`
                                  <div class="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
                                      <b>Pesan Provider:</b> \${escapeHtmlClient(data.message)}
                                      \${data.message.includes('device anda tidak terdaftar') ? '<br><span class="text-[11px] text-slate-600 mt-1 block"><b>Solusi:</b> Daftarkan IP Server VPS Anda ke Admin / CS Toko Gorontalo agar di-whitelist.</span>' : ''}
                                  </div>
                                  \` : ''}
                              </div>
                              \${snText}
                              <p class="text-[11px] text-slate-400 italic mt-2">Detail bukti mutasi dan transaksi juga telah dicatat di Kotak Masuk (Inbox) Anda.</p>
                          </div>
                      \`,
                      icon: modalIcon,
                      confirmButtonText: 'Tutup'
                  });
                  window.location.reload();
              } else {
                  if (!data.locked) {
                      clearTrxLock();
                  }
                  swalDark.fire('Gagal', data.message || 'Transaksi gagal diproses', 'error');
              }
          } catch(e) {
              document.getElementById('loadingOverlay').classList.add('hidden');
              swalDark.fire('Error', 'Terjadi kesalahan jaringan: ' + e.message, 'error');
          }
      }

      // Initial run
      window.addEventListener('DOMContentLoaded', () => {
          if (isTrxLocked()) {
              startTrxLockCountdown();
          }
          selectCategory('pulsa');
      });
  </script>
  `;
}

/**
 * Render Modal Admin Panel Toko Gorontalo
 */
function renderTokoGorontaloAdminModal() {
  return `
  <!-- MODAL TOKO GORONTALO / PPOB ADMIN -->
  <div id="tokoGorontaloModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs hidden z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-3xl border border-slate-200 w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
              <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div>
                      <h3 class="text-xl font-black text-slate-900 tracking-tight">Integrasi Toko Gorontalo (PPOB)</h3>
                      <p class="text-xs text-slate-500">Kelola Saldo Host, Sinkronisasi Produk & Margin Keuntungan</p>
                  </div>
              </div>
              <button onclick="closeTokoGorontaloModal()" class="text-slate-400 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
              <!-- Grid Kartu Info & Saldo Host -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Saldo Host -->
                  <div class="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/60 to-white">
                      <div class="flex items-center justify-between mb-2">
                          <span class="text-xs font-bold text-indigo-700 uppercase tracking-wider">Saldo Host Toko Gorontalo</span>
                          <button onclick="refreshTokoGorontaloInfo()" title="Cek Saldo Terkini" class="text-indigo-600 hover:text-indigo-800 p-1">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                          </button>
                      </div>
                      <p id="tgSaldoDisplay" class="text-2xl font-black text-slate-900 font-mono tracking-tight">Memuat...</p>
                      <p id="tgMemberName" class="text-xs text-slate-500 mt-1">Level-3 APARAT (178082835085)</p>
                  </div>

                  <!-- Total Produk di Database -->
                  <div class="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50/60 to-white">
                      <span class="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">Produk Tersinkron</span>
                      <p id="tgProductCount" class="text-2xl font-black text-slate-900 font-mono tracking-tight">Memuat...</p>
                      <p class="text-xs text-slate-500 mt-1">Siap dijual ke pelanggan</p>
                  </div>

                  <!-- Total Transaksi PPOB -->
                  <div class="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/60 to-white">
                      <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Total Transaksi</span>
                      <p id="tgOrderCount" class="text-2xl font-black text-slate-900 font-mono tracking-tight">Memuat...</p>
                      <p class="text-xs text-slate-500 mt-1">Pesanan pulsa, token & e-wallet</p>
                  </div>
              </div>

              <!-- Pendaftaran IP Whitelist H2H Notice -->
              <div class="p-5 rounded-2xl border border-amber-200 bg-amber-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div class="space-y-1">
                      <div class="flex items-center gap-2">
                          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-black">!</span>
                          <h4 class="font-extrabold text-slate-900 text-sm">Pendaftaran IP Server VPS (H2H Toko Gorontalo)</h4>
                      </div>
                      <p class="text-xs text-slate-600 leading-relaxed">
                          Toko Gorontalo mewajibkan <b>IP Server VPS</b> terdaftar di akun Member Anda. Jika belum terdaftar, API mengembalikan error: <code class="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono text-[11px]">"device anda tidak terdaftar"</code>.
                      </p>
                      <p class="text-xs text-slate-700 font-medium pt-0.5">
                          IP Server VPS Anda: <b id="tgServerIpDisplay" class="font-mono text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs">Mendeteksi...</b>
                      </p>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                      <button onclick="copyTgIpRegistrationFormat()" class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-xs">
                          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          Salin Format Chat
                      </button>
                      <a id="tgWaLink" href="https://wa.me/62815240260221" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center gap-2 shadow-sm cursor-pointer">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                          Chat CS Toko Gorontalo
                      </a>
                  </div>
              </div>

              <!-- Action Bar: Sync & Markup -->
              <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                      <h4 class="font-extrabold text-slate-900 text-sm mb-1">Sinkronisasi Katalog & Harga Modal</h4>
                      <p class="text-xs text-slate-500">Tarik daftar harga terbaru (1.143 produk) dari Toko Gorontalo & tentukan markup keuntungan.</p>
                  </div>
                  <div class="flex items-center gap-3 w-full md:w-auto">
                      <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
                          <span class="text-xs font-bold text-slate-500">Markup Rp</span>
                          <input type="number" id="tgSyncMarkupInput" value="750" class="w-20 font-bold font-mono text-sm text-slate-800 focus:outline-none">
                      </div>
                      <button onclick="runTokoGorontaloSync()" id="tgSyncBtn" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                          Sinkronkan Sekarang
                      </button>
                  </div>
              </div>

              <!-- Filter & Search Produk -->
              <div class="flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div class="flex gap-2 w-full md:w-auto flex-wrap">
                      <select id="tgFilterCategory" onchange="loadAdminProducts(1)" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
                          <option value="">Semua Kategori</option>
                          <option value="pulsa">Pulsa Reguler</option>
                          <option value="data">Paket Data</option>
                          <option value="pln">Token PLN</option>
                          <option value="ewallet">E-Wallet</option>
                          <option value="game">Voucher Game</option>
                      </select>
                      <select id="tgFilterBrand" onchange="loadAdminProducts(1)" class="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
                          <option value="">Semua Operator / Brand</option>
                          <option value="TELKOMSEL">Telkomsel</option>
                          <option value="INDOSAT">Indosat</option>
                          <option value="XL">XL</option>
                          <option value="AXIS">Axis</option>
                          <option value="TRI">Tri</option>
                          <option value="SMARTFREN">Smartfren</option>
                          <option value="BYU">By.U</option>
                          <option value="PLN">PLN</option>
                          <option value="DANA">DANA</option>
                          <option value="GOPAY">GoPay</option>
                          <option value="OVO">OVO</option>
                          <option value="SHOPEEPAY">ShopeePay</option>
                      </select>
                  </div>
                  <div class="w-full md:w-64">
                      <input type="text" id="tgSearchInput" onkeyup="if(event.key==='Enter') loadAdminProducts(1)" placeholder="Cari nama / kode produk..."
                             class="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500">
                  </div>
              </div>

              <!-- Tabel Produk PPOB -->
              <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <div class="overflow-x-auto max-h-96 custom-scrollbar">
                      <table class="w-full text-left border-collapse text-xs">
                          <thead>
                              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                                  <th class="p-3">Kode</th>
                                  <th class="p-3">Nama Produk</th>
                                  <th class="p-3">Kategori</th>
                                  <th class="p-3">Brand</th>
                                  <th class="p-3">Modal Host</th>
                                  <th class="p-3">Markup</th>
                                  <th class="p-3">Harga Jual</th>
                                  <th class="p-3">Status</th>
                                  <th class="p-3 text-center">Aksi</th>
                              </tr>
                          </thead>
                          <tbody id="tgProductsTableBody" class="divide-y divide-slate-100">
                              <tr><td colspan="9" class="p-6 text-center text-slate-400">Memuat data produk...</td></tr>
                          </tbody>
                      </table>
                  </div>
                  <!-- Pagination -->
                  <div class="p-3 border-t border-slate-200 flex justify-between items-center text-xs bg-slate-50">
                      <span id="tgPaginationInfo" class="text-slate-500 font-medium">Halaman 1 dari 1</span>
                      <div class="flex gap-2">
                          <button onclick="changeAdminProductsPage(-1)" id="tgPrevBtn" class="bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 disabled:opacity-50">Sebelumnya</button>
                          <button onclick="changeAdminProductsPage(1)" id="tgNextBtn" class="bg-white px-3 py-1 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 disabled:opacity-50">Selanjutnya</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>

  <script>
      let tgCurrentPage = 1;
      let tgTotalPages = 1;

      function openTokoGorontaloModal() {
          document.getElementById('tokoGorontaloModal').classList.remove('hidden');
          refreshTokoGorontaloInfo();
          loadAdminProducts(1);
      }

      function closeTokoGorontaloModal() {
          document.getElementById('tokoGorontaloModal').classList.add('hidden');
      }

      let tgDetectedIpv4 = '116.212.74.104';
      let tgDetectedIpv6 = '2001:df7:5300:23::68';

      async function loadTgServerIp() {
          try {
              const res = await fetch('/api/admin/tokogorontalo/server-ip');
              const data = await res.json();
              const displayEl = document.getElementById('tgServerIpDisplay');
              const waLinkEl = document.getElementById('tgWaLink');

              if (data.success) {
                  if (data.ipv4) tgDetectedIpv4 = data.ipv4;
                  if (data.ipv6) tgDetectedIpv6 = data.ipv6;
                  if (displayEl) displayEl.innerText = tgDetectedIpv4 + ' (IPv4) | ' + tgDetectedIpv6 + ' (IPv6)';
                  if (waLinkEl) {
                      const tgLines = [
                          'Halo Admin Toko Gorontalo, tolong daftarkan IP server VPS saya untuk transaksi H2H akun Member ID: 178082835085:',
                          '- IPv4: ' + tgDetectedIpv4,
                          '- IPv6: ' + tgDetectedIpv6,
                          'Terima kasih!'
                      ];
                      const msg = encodeURIComponent(tgLines.join(String.fromCharCode(10)));
                      waLinkEl.href = 'https://wa.me/62815240260221?text=' + msg;
                  }
              }
          } catch(e) {
              console.error('Failed to load server IP:', e);
          }
      }

      function copyTgIpRegistrationFormat() {
          const tgLines = [
              'Halo Admin Toko Gorontalo, tolong daftarkan IP server VPS saya untuk transaksi H2H akun Member ID: 178082835085:',
              '- IPv4: ' + tgDetectedIpv4,
              '- IPv6: ' + tgDetectedIpv6,
              'Terima kasih!'
          ];
          const text = tgLines.join(String.fromCharCode(10));
          if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(() => {
                  swalDark.fire({
                      icon: 'success',
                      title: 'Format Chat Tersalin!',
                      text: 'Silakan kirimkan ke Admin WhatsApp Toko Gorontalo (0815240260221).',
                      timer: 3000,
                      showConfirmButton: false
                  });
              }).catch(() => {
                  prompt('Salin pesan format pendaftaran IP di bawah ini:', text);
              });
          } else {
              prompt('Salin pesan format pendaftaran IP di bawah ini:', text);
          }
      }

      async function refreshTokoGorontaloInfo() {
          loadTgServerIp();
          try {
              const res = await fetch('/api/admin/tokogorontalo/info');
              const data = await res.json();
              if (data.success) {
                  document.getElementById('tgSaldoDisplay').innerText = 'Rp ' + Number(data.balance.saldo).toLocaleString('id-ID');
                  document.getElementById('tgMemberName').innerText = (data.balance.namamember || 'Member') + ' (' + data.balance.kodemember + ')';
                  document.getElementById('tgProductCount').innerText = data.productCount + ' Produk';
                  document.getElementById('tgOrderCount').innerText = data.orderCount + ' Transaksi';
              }
          } catch(e) {
              console.error('Info error:', e);
          }
      }

      async function runTokoGorontaloSync() {
          const btn = document.getElementById('tgSyncBtn');
          const markupInput = document.getElementById('tgSyncMarkupInput');
          const markup = parseInt(markupInput.value) || 750;

          btn.disabled = true;
          btn.innerHTML = '<span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Menyinkronkan...';

          try {
              const res = await fetch('/api/admin/tokogorontalo/sync', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ markup })
              });
              const data = await res.json();
              btn.disabled = false;
              btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Sinkronkan Sekarang';

              if (data.success) {
                  swalDark.fire('Sukses', data.message, 'success');
                  refreshTokoGorontaloInfo();
                  loadAdminProducts(1);
              } else {
                  swalDark.fire('Gagal', data.message, 'error');
              }
          } catch(e) {
              btn.disabled = false;
              btn.innerText = 'Sinkronkan Sekarang';
              swalDark.fire('Error', 'Kesalahan jaringan: ' + e.message, 'error');
          }
      }

      async function loadAdminProducts(page = 1) {
          tgCurrentPage = page;
          const search = document.getElementById('tgSearchInput').value.trim();
          const category = document.getElementById('tgFilterCategory').value;
          const brand = document.getElementById('tgFilterBrand').value;
          const tbody = document.getElementById('tgProductsTableBody');

          tbody.innerHTML = '<tr><td colspan="9" class="p-6 text-center text-slate-400">Memuat data produk...</td></tr>';

          try {
              let url = '/api/admin/tokogorontalo/products?page=' + page + '&limit=30';
              if (search) url += '&search=' + encodeURIComponent(search);
              if (category) url += '&category=' + encodeURIComponent(category);
              if (brand) url += '&brand=' + encodeURIComponent(brand);

              const res = await fetch(url);
              const data = await res.json();

              if (data.success) {
                  tgTotalPages = data.totalPages || 1;
                  document.getElementById('tgPaginationInfo').innerText = 'Halaman ' + data.page + ' dari ' + tgTotalPages + ' (Total ' + data.total + ' produk)';
                  document.getElementById('tgPrevBtn').disabled = data.page <= 1;
                  document.getElementById('tgNextBtn').disabled = data.page >= tgTotalPages;

                  if (data.products.length === 0) {
                      tbody.innerHTML = '<tr><td colspan="9" class="p-6 text-center text-slate-400">Tidak ada produk ditemukan.</td></tr>';
                      return;
                  }

                  tbody.innerHTML = data.products.map(p => \`
                      <tr class="hover:bg-slate-50 transition">
                          <td class="p-3 font-mono font-bold text-sky-600">\${p.product_code}</td>
                          <td class="p-3 font-medium text-slate-900">\${escapeHtmlClient(p.product_name)}</td>
                          <td class="p-3 uppercase text-[10px] font-bold text-slate-500">\${p.category}</td>
                          <td class="p-3 uppercase text-[10px] font-bold text-indigo-600">\${p.brand}</td>
                          <td class="p-3 font-mono text-slate-600">Rp \${Number(p.cost_price).toLocaleString('id-ID')}</td>
                          <td class="p-3 font-mono text-emerald-600">+Rp \${Number(p.markup_value).toLocaleString('id-ID')}</td>
                          <td class="p-3 font-mono font-bold text-slate-900">Rp \${Number(p.selling_price).toLocaleString('id-ID')}</td>
                          <td class="p-3">
                              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
                                  \${p.is_active ? 'AKTIF' : 'NONAKTIF'}
                              </span>
                          </td>
                          <td class="p-3 text-center">
                              <button onclick="editProductModal('\${p.product_code}', \${p.selling_price}, \${p.is_active})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-xs transition">
                                  Edit
                              </button>
                          </td>
                      </tr>
                  \`).join('');
              }
          } catch(e) {
              tbody.innerHTML = '<tr><td colspan="9" class="p-6 text-center text-rose-500">Gagal memuat produk.</td></tr>';
          }
      }

      function changeAdminProductsPage(delta) {
          const target = tgCurrentPage + delta;
          if (target >= 1 && target <= tgTotalPages) {
              loadAdminProducts(target);
          }
      }

      async function editProductModal(code, currentPrice, currentActive) {
          const { value: formValues } = await swalDark.fire({
              title: 'Edit Produk ' + code,
              html: \`
                  <div class="text-left space-y-3 p-2 text-xs">
                      <div>
                          <label class="font-bold text-slate-700 block mb-1">Harga Jual (Rp)</label>
                          <input type="number" id="swalEditPrice" value="\${currentPrice}" class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono font-bold text-sm">
                      </div>
                      <div>
                          <label class="font-bold text-slate-700 block mb-1">Status Produk</label>
                          <select id="swalEditActive" class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-xs">
                              <option value="1" \${currentActive ? 'selected' : ''}>AKTIF (Bisa Dibeli)</option>
                              <option value="0" \${!currentActive ? 'selected' : ''}>NONAKTIF (Disembunyikan)</option>
                          </select>
                      </div>
                  </div>
              \`,
              showCancelButton: true,
              confirmButtonText: 'Simpan',
              cancelButtonText: 'Batal',
              preConfirm: () => {
                  return {
                      price: document.getElementById('swalEditPrice').value,
                      active: document.getElementById('swalEditActive').value
                  };
              }
          });

          if (formValues) {
              try {
                  const res = await fetch('/api/admin/tokogorontalo/update-product', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          product_code: code,
                          selling_price: parseInt(formValues.price),
                          is_active: parseInt(formValues.active)
                      })
                  });
                  const data = await res.json();
                  if (data.success) {
                      swalDark.fire('Sukses', data.message, 'success');
                      loadAdminProducts(tgCurrentPage);
                  } else {
                      swalDark.fire('Gagal', data.message, 'error');
                  }
              } catch(e) {
                  swalDark.fire('Error', e.message, 'error');
              }
          }
      }
  </script>
  `;
}

module.exports = {
  handleTokoGorontaloRoutes,
  renderPPOBContent,
  renderTokoGorontaloAdminModal
};
