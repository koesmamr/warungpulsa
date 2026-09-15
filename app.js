var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22((target, value) => __defProp222(target, "name", { value, configurable: true }), "__name");
var cachedAppSettings = null;
var cachedAppSettingsTime = 0;
var CACHE_TTL = 3e5;
function isSuperAdmin(userOrEmail, env) {
  if (!userOrEmail) return false;
  const email = (typeof userOrEmail === "string" ? userOrEmail : (userOrEmail.email || "")).toLowerCase().trim();
  const configuredAdmin = ((env && env.ADMIN_EMAIL) || (typeof process !== "undefined" && process.env && process.env.ADMIN_EMAIL) || "syamsul18782@gmail.com").toLowerCase().trim();
  return email === configuredAdmin || email === "syamsul18782@gmail.com";
}
async function getAppSettings(env) {
  const now = Date.now();
  if (cachedAppSettings && now - cachedAppSettingsTime < CACHE_TTL) {
    return cachedAppSettings;
  }
  const defaultSettings = {
    price_per_day: 233,
    kmsp_markup: 3e3,
    telegram_bot_token: (env && env.TELEGRAM_BOT_TOKEN) || "8045282726:AAE2UuF0tpLlxN1rVRJoJLP6vCUQLDZ0cx8",
    telegram_channel_id: (env && env.TELEGRAM_CHANNEL_ID) || "@srpcomgroup",
    telegram_admin_id: (env && env.TELEGRAM_ADMIN_ID) || "5666536947",
    telegram_group_thread_id: (env && env.TELEGRAM_GROUP_THREAD_ID) || "16083",
    auto_backup_frequency: 24,
    maintenance_mode: false,
    payment_tripay: false,
    payment_violet: false,
    payment_qris_manual: false,
    payment_shopeepay: true,
    payment_gopay: true,
    autogopay_api_key: (env && env.AUTOGOPAY_API_KEY) || "agp_1bae647d0c0c25307757c1a60afa7b06256c90dbefb4650f3f7e43a03d5c2a7d",
    shopeepay_qris_static: (env && env.SHOPEEPAY_QRIS_STATIC) || "00020101021126610016ID.CO.SHOPEE.WWW01189360091800205167330208205167330303UMI51440014ID.CO.QRIS.WWW0215ID10221779795590303UMI5204539953033605802ID5912konter pulsa6009GORONTALO61059612162070703A016304C60C",
    gopay_qris_static: (env && env.GOPAY_QRIS_STATIC) || "00020101021126610014COM.GO-JEK.WWW01189360091432182828890210G2182828890303UMI51440014ID.CO.QRIS.WWW0215ID10265930588070303UMI5204481453033605802ID5922konter pulsa, SIPATANA6009GORONTALO61059612162140703A0111036216304E906",
    cendrawasih_api_key: (env && env.CENDRAWASIH_API_KEY) || "CEN-8B894F33-5EB9-44F3-B986-56D919742B71",
    servers: [{ id: "srv1", name: "Server SG Premium 1", host: "http://103.x.x.x", key: "API_KEY_ANDA_DISINI" }]
  };
  try {
    const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'app'").first("value");
    if (row) {
      const parsed = JSON.parse(row);
      cachedAppSettings = Object.assign({}, defaultSettings, parsed);
      for (const k of Object.keys(defaultSettings)) {
        if (cachedAppSettings[k] === "" || cachedAppSettings[k] === undefined || cachedAppSettings[k] === null) {
          cachedAppSettings[k] = defaultSettings[k];
        }
      }
            cachedAppSettings.payment_tripay = false;
      cachedAppSettings.payment_violet = false;
      cachedAppSettingsTime = now;
      return cachedAppSettings;
    }
  } catch (e) {
    console.error("Failed to fetch settings from DB:", e);
  }
  if (cachedAppSettings) return cachedAppSettings;
  return defaultSettings;
}
__name(getAppSettings, "getAppSettings");
__name2(getAppSettings, "getAppSettings");
__name22(getAppSettings, "getAppSettings");
__name222(getAppSettings, "getAppSettings");
function setCachedAppSettings(settings) {
  cachedAppSettings = settings;
  cachedAppSettingsTime = Date.now();
}
__name(setCachedAppSettings, "setCachedAppSettings");
__name2(setCachedAppSettings, "setCachedAppSettings");
__name22(setCachedAppSettings, "setCachedAppSettings");
__name222(setCachedAppSettings, "setCachedAppSettings");
function getWIBTime() {
  return (/* @__PURE__ */ new Date()).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) + " WIB";
}
__name(getWIBTime, "getWIBTime");
__name2(getWIBTime, "getWIBTime");
__name22(getWIBTime, "getWIBTime");
__name222(getWIBTime, "getWIBTime");
function getWIBDateOnly() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(/* @__PURE__ */ new Date());
  const d = parts.find((p) => p.type === "day").value;
  const m = parts.find((p) => p.type === "month").value;
  const y = parts.find((p) => p.type === "year").value;
  return `${d}/${m}/${y}`;
}
__name(getWIBDateOnly, "getWIBDateOnly");
__name2(getWIBDateOnly, "getWIBDateOnly");
__name22(getWIBDateOnly, "getWIBDateOnly");
__name222(getWIBDateOnly, "getWIBDateOnly");
function parseWIBDateString(wibStr) {
  if (!wibStr) return 0;
  let cleanStr = String(wibStr).replace(" WIB", "").trim().replace(/\./g, ":").replace(/-/g, "/");
  const match = cleanStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{1,2}):(\d{1,2})/);
  if (match) {
    return Date.UTC(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]), parseInt(match[4]) - 7, parseInt(match[5]), parseInt(match[6]));
  }
  return 0;
}
__name(parseWIBDateString, "parseWIBDateString");
__name2(parseWIBDateString, "parseWIBDateString");
__name22(parseWIBDateString, "parseWIBDateString");
__name222(parseWIBDateString, "parseWIBDateString");
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, (tag) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[tag]);
}
__name(escapeHTML, "escapeHTML");
__name2(escapeHTML, "escapeHTML");
__name22(escapeHTML, "escapeHTML");
__name222(escapeHTML, "escapeHTML");
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");
__name2(jsonResponse, "jsonResponse");
__name22(jsonResponse, "jsonResponse");
__name222(jsonResponse, "jsonResponse");
async function sendTelegramLog(statusHeader, bodyMsg, appSettings) {
  const botToken = appSettings.telegram_bot_token;
  const chatId = appSettings.telegram_channel_id;
  if (!botToken || !chatId) return;
  const finalMessage = `<b>${statusHeader}</b>

${bodyMsg}

\u{1F552} ${getWIBTime()}`;
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: finalMessage, parse_mode: "HTML" })
    });
  } catch (e) {
    console.error("TG Error", e);
  }
}
__name(sendTelegramLog, "sendTelegramLog");
__name2(sendTelegramLog, "sendTelegramLog");
__name22(sendTelegramLog, "sendTelegramLog");
__name222(sendTelegramLog, "sendTelegramLog");
async function generateTriPaySignature(privateKey, merchantCode, merchantRef, amount) {
  const data = merchantCode + merchantRef + amount;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(privateKey.trim());
  const msgData = encoder.encode(data);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, msgData);
  return Array.from(new Uint8Array(signatureBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateTriPaySignature, "generateTriPaySignature");
__name2(generateTriPaySignature, "generateTriPaySignature");
__name22(generateTriPaySignature, "generateTriPaySignature");
__name222(generateTriPaySignature, "generateTriPaySignature");
async function verifyWebhookSignature(privateKey, rawBody, incomingSignature) {
  if (!privateKey || privateKey.trim() === "") return false;
  if (!incomingSignature) return false;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(privateKey.trim());
  const msgData = encoder.encode(rawBody);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, msgData);
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return incomingSignature === expectedSignature;
}
__name(verifyWebhookSignature, "verifyWebhookSignature");
__name2(verifyWebhookSignature, "verifyWebhookSignature");
__name22(verifyWebhookSignature, "verifyWebhookSignature");
__name222(verifyWebhookSignature, "verifyWebhookSignature");
function buildEmailTemplate(title, bodyContent) {
  const logoUrl = (typeof env !== "undefined" && env && env.DOMAIN_NAME) ? ("https://" + env.DOMAIN_NAME + "/logo.png") : "https://warungpulsa.web.id/logo.png";
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
            .wrapper { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
            .header { background-color: #1e3a8a; padding: 30px 40px; text-align: left; display: flex; align-items: center; }
            .header img { width: 48px; height: 48px; border-radius: 50%; vertical-align: middle; border: 2px solid rgba(255,255,255,0.2); }
            .header h1 { color: #ffffff; margin: 0 0 0 15px; font-size: 24px; font-weight: 800; display: inline-block; vertical-align: middle; letter-spacing: -0.5px; }
            .content { padding: 40px; color: #374151; line-height: 1.6; font-size: 15px; }
            .content h2 { color: #111827; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; }
            .content p { margin-bottom: 16px; }
            .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-top: 10px; margin-bottom: 10px; text-align: center; }
            .config-box { background-color: #111827; color: #10b981; padding: 20px; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 13px; overflow-x: auto; white-space: pre-wrap; margin-top: 20px; margin-bottom: 20px; border: 1px solid #374151; }
            .footer { background-color: #f9fafb; padding: 25px 40px; text-align: center; color: #6b7280; font-size: 13px; border-top: 1px solid #e5e7eb; }
            .footer p { margin: 5px 0; }
            .info-table { border-collapse: collapse; margin: 20px 0; width: 100%; }
            .info-table td { padding: 10px; border-bottom: 1px solid #f3f4f6; }
            .info-table td:first-child { font-weight: 600; color: #4b5563; width: 40%; }
            .info-table td:last-child { color: #111827; font-weight: 500; }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="header">
                <img src="${logoUrl}" alt="Logo Warung Pulsa">
                <h1>Warung Pulsa</h1>
            </div>
            <div class="content">
                <h2>${title}</h2>
                ${bodyContent}
            </div>
            <div class="footer">
                <p>Hak Cipta &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Warung Pulsa. Hak cipta dilindungi undang-undang.</p>
                <p>Email ini dikirimkan otomatis oleh sistem kami. Mohon tidak membalas ke alamat email ini.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
__name(buildEmailTemplate, "buildEmailTemplate");
__name2(buildEmailTemplate, "buildEmailTemplate");
__name22(buildEmailTemplate, "buildEmailTemplate");
__name222(buildEmailTemplate, "buildEmailTemplate");
async function sendEmailViaGAS(toEmail, subject, htmlMessage, env) {
  const webAppUrl = env.GAS_WEB_APP_URL;
  const secretToken = env.GAS_SECRET_TOKEN;
  if (!webAppUrl || !secretToken) return;
  try {
    await fetch(webAppUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_token: secretToken,
        to: toEmail,
        subject,
        htmlMessage
      })
    });
  } catch (e) {
    console.error("Gagal mengirim email GAS:", e);
  }
}
__name(sendEmailViaGAS, "sendEmailViaGAS");
__name2(sendEmailViaGAS, "sendEmailViaGAS");
__name22(sendEmailViaGAS, "sendEmailViaGAS");
__name222(sendEmailViaGAS, "sendEmailViaGAS");
async function catatMutasi(env, email, type, amount, description) {
  const now = getWIBTime();
  try {
    const user = await env.DB.prepare("SELECT balance FROM users WHERE email = ?").bind(email).first();
    const currentBalance = user ? user.balance : 0;
    await env.DB.prepare("INSERT INTO transactions (email, type, amount, description, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(email, type, amount, description, currentBalance, now).run();
  } catch (e) {
    console.error("Gagal mencatat mutasi:", e);
  }
}
__name(catatMutasi, "catatMutasi");
__name2(catatMutasi, "catatMutasi");
__name22(catatMutasi, "catatMutasi");
__name222(catatMutasi, "catatMutasi");
async function generateBackupData(env) {
  const { results: users } = await env.DB.prepare("SELECT * FROM users").all();
  const { results: vpns } = await env.DB.prepare("SELECT * FROM vpns").all();
  const { results: inbox } = await env.DB.prepare("SELECT * FROM inbox").all();
  const { results: invoices } = await env.DB.prepare("SELECT * FROM invoices").all();
  const { results: settings } = await env.DB.prepare("SELECT * FROM settings").all();
  const { results: transactions } = await env.DB.prepare("SELECT * FROM transactions").all();
  const { results: tickets } = await env.DB.prepare("SELECT * FROM tickets").all();
  const { results: ticketReplies } = await env.DB.prepare("SELECT * FROM ticket_replies").all();
  const { results: aiUsage } = await env.DB.prepare("SELECT * FROM ai_usage").all();
  let licenses = [];
  try {
    const { results } = await env.DB.prepare("SELECT * FROM licenses").all();
    licenses = results;
  } catch (e) {
  }
  return {
    users,
    vpns,
    inbox,
    invoices,
    settings,
    licenses,
    transactions,
    tickets,
    ticket_replies: ticketReplies,
    ai_usage: aiUsage
  };
}
__name(generateBackupData, "generateBackupData");
__name2(generateBackupData, "generateBackupData");
__name22(generateBackupData, "generateBackupData");
__name222(generateBackupData, "generateBackupData");
async function saveBackupToR2(env, backupJsonObj, wibTime) {
  if (!env.BACKUP_BUCKET) {
    console.warn("R2 BACKUP_BUCKET binding tidak dikonfigurasi.");
    return false;
  }
  try {
    const cleanTime = wibTime.replace(/[\s:]/g, "_").replace(/[\/\s:,]/g, "_");
    const fileName = `Backup_WarungPulsa_${cleanTime}.json`;
    const backupString = JSON.stringify(backupJsonObj, null, 2);
    await env.BACKUP_BUCKET.put(fileName, backupString, {
      httpMetadata: { contentType: "application/json" }
    });
    console.log(`Backup berhasil diunggah ke R2: ${fileName}`);
    const listResult = await env.BACKUP_BUCKET.list();
    if (listResult && listResult.objects) {
      const sortedObjects = listResult.objects.sort((a, b) => new Date(a.uploaded) - new Date(b.uploaded));
      if (sortedObjects.length > 10) {
        const toDelete = sortedObjects.slice(0, sortedObjects.length - 10);
        for (const obj of toDelete) {
          await env.BACKUP_BUCKET.delete(obj.key);
          console.log(`Menghapus backup lama di R2: ${obj.key}`);
        }
      }
    }
    return true;
  } catch (e) {
    console.error("Gagal menyimpan backup ke R2:", e);
    return false;
  }
}
__name(saveBackupToR2, "saveBackupToR2");
__name2(saveBackupToR2, "saveBackupToR2");
__name22(saveBackupToR2, "saveBackupToR2");
__name222(saveBackupToR2, "saveBackupToR2");
var KMSP = {
  async _request(subdomain, params) {
    const url = new URL(`https://${subdomain}.kmsp-store.com/v1`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== void 0 && params[key] !== null && params[key] !== "") {
        url.searchParams.append(key, params[key]);
      }
    });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35e3);
    try {
      const req = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      clearTimeout(timeoutId);
      const text = await req.text();
      let res;
      try {
        res = JSON.parse(text);
      } catch (err) {
        return { success: false, message: "Respon KMSP bukan JSON (Kemungkinan Server KMSP Error/Maintenace): " + text.substring(0, 80), raw: text };
      }
      if (res.status === true || res.statusCode === 200) {
        return { success: res.status, data: res.data, message: res.message, raw: res };
      } else {
        return { success: false, message: res.message || "Gagal memproses ke server pusat KMSP", raw: res };
      }
    } catch (e) {
      clearTimeout(timeoutId);
      return { success: false, message: e.name === "AbortError" ? "Koneksi ke KMSP Timeout (>30s)" : e.message };
    }
  },
  async getPackageList(apiKey) {
    return this._request("golang-openapi-packagelist-xltembakservice", { api_key: apiKey });
  },
  async beliPaketNoOtp(apiKey, packageCode, phone, paymentMethod, priceOrFee) {
    return this._request("golang-openapi-packagepurchase-xltembakservice", { api_key: apiKey, package_code: packageCode, phone, payment_method: paymentMethod, price_or_fee: priceOrFee });
  },
  async beliPaketOtp(apiKey, packageCode, phone, accessToken, paymentMethod, ewalletNumber, priceOrFee) {
    return this._request("golang-openapi-packagepurchase-xltembakservice", { api_key: apiKey, package_code: packageCode, phone, access_token: accessToken, payment_method: paymentMethod, ewallet_number: ewalletNumber, price_or_fee: priceOrFee });
  },
  async requestOtp(apiKey, phone) {
    return this._request("golang-openapi-reqotp-xltembakservice", { api_key: apiKey, phone, method: "OTP" });
  },
  async loginOtp(apiKey, phone, authId, otp) {
    return this._request("golang-openapi-login-xltembakservice", { api_key: apiKey, phone, method: "OTP", auth_id: authId, otp });
  },
  async getAccessTokenList(apiKey, msisdn = "") {
    return this._request("golang-openapi-accesstokenlist-xltembakservice", { api_key: apiKey, msisdn });
  },
  async extendSession(apiKey, phone, authIdToken) {
    return this._request("golang-openapi-login-xltembakservice", { api_key: apiKey, phone, method: "LOGIN_BY_ACCESS_TOKEN", auth_id: authIdToken });
  },
  async cekPulsaMasaAktif(apiKey, accessToken) {
    return this._request("golang-openapi-subscriberinfo-xltembakservice", { api_key: apiKey, access_token: accessToken });
  },
  async cekPaketAktif(apiKey, accessToken) {
    return this._request("golang-openapi-quotadetails-xltembakservice", { api_key: apiKey, access_token: accessToken });
  },
  async cekLokasi(apiKey, accessToken) {
    return this._request("golang-openapi-subscriberlocation-xltembakservice", { api_key: apiKey, access_token: accessToken });
  }
};
async function handleKMSPRoutes(url, request, env, currentUser, appSettings, sendTelegramLog2) {
  const getWIBTime2 = /* @__PURE__ */ __name222(() => (/* @__PURE__ */ new Date()).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB", "getWIBTime");
  const kmspMarkup = appSettings && appSettings.kmsp_markup !== void 0 ? parseInt(appSettings.kmsp_markup) : 3e3;
  if (url.pathname === "/api/kmsp/services" && request.method === "GET") {
    if (!currentUser) return new Response("Unauthorized", { status: 401 });
    if (!env.KMSP_API_KEY) return new Response(JSON.stringify({ success: false, message: "Admin belum menyetel API KEY KMSP!" }), { status: 500 });
    const servicesRes = await KMSP.getPackageList(env.KMSP_API_KEY);
    let visibilityMap = {};
    try {
      const visStr = await env.DB.prepare("SELECT value FROM settings WHERE key = 'pkg_visibility'").first("value");
      if (visStr) visibilityMap = JSON.parse(visStr);
    } catch (e) {
    }
    if (servicesRes.success && Array.isArray(servicesRes.data)) {
      servicesRes.data = servicesRes.data.filter((pkg) => visibilityMap[pkg.package_code] !== false).map((pkg) => {
        if (pkg.available_payment_methods) {
          pkg.available_payment_methods = pkg.available_payment_methods.filter(
            (m) => !["QRIS", "OVO", "SHOPEEPAY"].includes(m.payment_method.toUpperCase())
          );
        }
        return {
          ...pkg,
          id: pkg.package_code,
          name: pkg.package_name,
          price: (Number(pkg.package_harga_int) || 0) + kmspMarkup
        };
      });
    }
    return new Response(JSON.stringify(servicesRes), { headers: { "Content-Type": "application/json" } });
  }
  if (url.pathname === "/api/xl/smart-verify" && request.method === "POST") {
    if (!currentUser) return new Response("Unauthorized", { status: 401 });
    try {
      const { phone } = await request.json();
      const tokenListRes = await KMSP.getAccessTokenList(env.KMSP_API_KEY, phone);
      if (tokenListRes.success && tokenListRes.data && tokenListRes.data.length > 0) {
        const activeTokenObj = tokenListRes.data.find((t) => String(t.msisdn).includes(phone) || String(phone).includes(String(t.msisdn)));
        if (activeTokenObj) {
          const authIdToken = `${activeTokenObj.session_id}:${activeTokenObj.token}`;
          const extendRes = await KMSP.extendSession(env.KMSP_API_KEY, phone, authIdToken);
          if (extendRes.success && extendRes.data && extendRes.data.access_token) {
            return new Response(JSON.stringify({ success: true, needs_otp: false, access_token: extendRes.data.access_token }), { headers: { "Content-Type": "application/json" } });
          }
        }
      }
      const otpRes = await KMSP.requestOtp(env.KMSP_API_KEY, phone);
      return new Response(JSON.stringify({ success: otpRes.success, needs_otp: true, auth_id: otpRes.data?.auth_id, message: otpRes.message }), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
    }
  }
  if (url.pathname === "/api/xl/login-otp" && request.method === "POST") {
    if (!currentUser) return new Response("Unauthorized", { status: 401 });
    try {
      const { phone, authId, otp } = await request.json();
      const result = await KMSP.loginOtp(env.KMSP_API_KEY, phone, authId, otp);
      return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
    }
  }
  if (url.pathname === "/api/xl/check-balance" && request.method === "POST") {
    if (!currentUser) return new Response("Unauthorized", { status: 401 });
    try {
      const { accessToken } = await request.json();
      const [infoResult, quotaResult, locationResult] = await Promise.all([
        KMSP.cekPulsaMasaAktif(env.KMSP_API_KEY, accessToken),
        KMSP.cekPaketAktif(env.KMSP_API_KEY, accessToken),
        KMSP.cekLokasi(env.KMSP_API_KEY, accessToken)
      ]);
      if (infoResult.success) {
        return new Response(JSON.stringify({
          success: true,
          info: infoResult.data,
          quota: quotaResult.success ? quotaResult.data : [],
          location: locationResult.success ? locationResult.data : null
        }), { headers: { "Content-Type": "application/json" } });
      } else {
        return new Response(JSON.stringify(infoResult), { headers: { "Content-Type": "application/json" } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
    }
  }
  if (url.pathname === "/api/buy-xl" && request.method === "POST") {
    if (!currentUser) return new Response("Unauthorized", { status: 401 });
    try {
      const { phone, serviceId, accessToken, paymentMethod = "BALANCE" } = await request.json();
      const forbiddenMethods = ["QRIS", "OVO", "SHOPEEPAY"];
      if (forbiddenMethods.includes(paymentMethod.toUpperCase())) {
        throw new Error("Metode pembayaran ini tidak didukung.");
      }
      const servicesRes = await KMSP.getPackageList(env.KMSP_API_KEY);
      if (!servicesRes.success) throw new Error("Gagal verifikasi produk.");
      const targetService = servicesRes.data.find((s) => String(s.package_code) === String(serviceId));
      if (!targetService) throw new Error("Paket tidak ditemukan.");
      const pkgName = targetService.package_name;
      const isEwalletPkg = pkgName.includes("[Method E-Wallet]");
      const isPulsaPkg = pkgName.includes("[Method Pulsa]");
      if (isEwalletPkg && !["DANA", "GOPAY"].includes(paymentMethod.toUpperCase())) {
        throw new Error("Paket [Method E-Wallet] hanya bisa dibayar via DANA atau GOPAY untuk saat ini.");
      }
      const modalPrice = Number(targetService.package_harga_int) || 0;
      let deductionAmount;
      if (isPulsaPkg) {
        deductionAmount = kmspMarkup;
      } else if (paymentMethod === "BALANCE") {
        deductionAmount = modalPrice + kmspMarkup;
      } else {
        deductionAmount = kmspMarkup;
      }
      const deductBalance = await env.DB.prepare("UPDATE users SET balance = balance - ? WHERE email = ? AND balance >= ?").bind(deductionAmount, currentUser.email, deductionAmount).run();
      if (deductBalance.meta.changes === 0) {
        return new Response(JSON.stringify({ success: false, message: `Saldo Web tidak cukup. Butuh Rp ${deductionAmount.toLocaleString("id-ID")} untuk transaksi ini.` }), { status: 400 });
      }
      let descMutasi = isPulsaPkg ? `Biaya Admin Paket XL ${phone} (${pkgName})` : `Pembelian Paket XL ${phone} (${pkgName})`;
      await catatMutasi(env, currentUser.email, "OUT", deductionAmount, descMutasi);
      let orderResult;
      try {
        if (targetService.no_need_login === true) {
          orderResult = await KMSP.beliPaketNoOtp(env.KMSP_API_KEY, serviceId, phone, paymentMethod, modalPrice);
        } else {
          orderResult = await KMSP.beliPaketOtp(env.KMSP_API_KEY, serviceId, phone, accessToken, paymentMethod, "", modalPrice);
        }
      } catch (apiErr) {
        await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(deductionAmount, currentUser.email).run();
        await catatMutasi(env, currentUser.email, "IN", deductionAmount, `Refund Gagal XL ${phone} (${pkgName})`);
        return new Response(JSON.stringify({ success: false, message: `Gagal memproses ke server KMSP (Exception): ${apiErr.message}` }), { status: 500 });
      }
      if (orderResult.success) {
        const now = getWIBTime2();
        const refKMSP = orderResult.data?.trx_id || orderResult.data?.sn || "PROSES";
        let payButtonHtml = "";
        let statusHeader = "[SUKSES] Pembelian Paket XL";
        let detailTagihan = `Harga: Rp ${(modalPrice + kmspMarkup).toLocaleString("id-ID")}`;
        if (isPulsaPkg) {
          detailTagihan = `Biaya Admin: Rp ${kmspMarkup.toLocaleString("id-ID")} (Sudah Dipotong)<br>Pembayaran Paket: <b>Otomatis Potong Pulsa XL Langsung</b>`;
        } else if (paymentMethod !== "BALANCE" && orderResult.data?.deeplink_data?.deeplink_url) {
          const payUrl = orderResult.data.deeplink_data.deeplink_url;
          statusHeader = `[PENDING] Bayar XL via ${paymentMethod}`;
          detailTagihan = `Biaya Admin: Rp ${kmspMarkup.toLocaleString("id-ID")} (Sudah Dipotong)<br>Sisa Bayar Modal: <b>Rp ${modalPrice.toLocaleString("id-ID")}</b>`;
          payButtonHtml = `
                        <br><br>
                        <div style="text-align: center;">
                            <a href="${payUrl}" target="_blank" style="display: inline-block; background-color: #22c55e; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #16a34a;">
                                \u{1F4F1} LANJUTKAN PEMBAYARAN ${paymentMethod.toUpperCase()}
                            </a>
                        </div>
                        <p style="font-size: 10px; color: #6b7280; text-align: center; margin-top: 8px;">*Link ini tetap aktif jika Anda ingin membayar nanti.</p>
                    `;
        }
        const bodyMsg = `
                    Pesanan paket data XL Anda untuk nomor <b>${phone}</b> berhasil dikirim.<br><br>
                    <b>Paket:</b> ${pkgName}<br>
                    ${detailTagihan}<br>
                    Ref: ${refKMSP}
                    ${payButtonHtml}
                `;
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(currentUser.email, statusHeader, bodyMsg, now).run();
        await env.DB.prepare("UPDATE users SET phone = ? WHERE email = ? AND (phone IS NULL OR phone = '' OR phone != ?)").bind(phone, currentUser.email, phone).run();
        if (sendTelegramLog2) {
          const tgLogBody = `User: ${currentUser.email}
Nomor XL: ${phone}
Paket: ${pkgName}
Metode: ${paymentMethod}

Ref/SN: ${refKMSP}`;
          await sendTelegramLog2(`\u{1F6D2} ${statusHeader}`, tgLogBody, appSettings);
        }
        return new Response(JSON.stringify({
          success: true,
          is_pending_payment: paymentMethod !== "BALANCE",
          payment_data: orderResult.data,
          deducted_amount: deductionAmount
        }), { headers: { "Content-Type": "application/json" } });
      } else {
        await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(deductionAmount, currentUser.email).run();
        await catatMutasi(env, currentUser.email, "IN", deductionAmount, `Refund Gagal XL ${phone} (${pkgName})`);
        return new Response(JSON.stringify({ success: false, message: `Ditolak Server: ${orderResult.message}` }), { status: 400 });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500 });
    }
  }
  return null;
}
__name(handleKMSPRoutes, "handleKMSPRoutes");
__name2(handleKMSPRoutes, "handleKMSPRoutes");
__name22(handleKMSPRoutes, "handleKMSPRoutes");
__name222(handleKMSPRoutes, "handleKMSPRoutes");
async function renderAdminDashboard(env, currentUser, appSettings) {
  const kmspMarkup = appSettings.kmsp_markup !== void 0 ? appSettings.kmsp_markup : 3e3;
  const backupFreq = appSettings.auto_backup_frequency !== void 0 ? appSettings.auto_backup_frequency : 24;
  const licPrice = appSettings.script_price_per_day || 500;
  const isQrisManualOn = appSettings.payment_qris_manual === true;
  const isShopeePayOn = appSettings.payment_shopeepay !== false;
  const isGoPayOn = appSettings.payment_gopay !== false;
  return `
    <style>
        /* Fix SweetAlert2 Select Options visibility in Dark Theme */
        .swal2-select {
            background-color: #111827 !important;
            color: #f3f4f6 !important;
            border: 1px solid #4b5563 !important;
        }
        .swal2-select option {
            background-color: #1f2937 !important;
            color: #f3f4f6 !important;
        }

        /* Scoped overrides to optimize space, paddings, and borders across the Admin panel */
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        #adminPanelContainer, .fixed.inset-0 {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }

        /* Mesh Gradient Background Accents */
        #adminPanelContainer {
            position: relative;
        }
        #adminPanelContainer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 5%;
            width: 450px;
            height: 450px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
            filter: blur(80px);
            z-index: 0;
            pointer-events: none;
        }
        #adminPanelContainer::after {
            content: '';
            position: absolute;
            bottom: 10%;
            right: 5%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(249, 115, 22, 0.06) 0%, transparent 70%);
            filter: blur(90px);
            z-index: 0;
            pointer-events: none;
        }
        
        /* 1. Thinner & Modern Border Styles */
        #adminPanelContainer .border, 
        #adminPanelContainer .border-gray-700, 
        #adminPanelContainer .border-gray-800, 
        #adminPanelContainer .border-slate-700, 
        #adminPanelContainer .border-slate-800,
        .fixed.inset-0 .border,
        .fixed.inset-0 .border-gray-700,
        .fixed.inset-0 .border-gray-800,
        .fixed.inset-0 .border-slate-700,
        .fixed.inset-0 .border-slate-800 {
            border-color: rgba(255, 255, 255, 0.08) !important;
            border-width: 1px !important;
        }
        
        /* Card Glassmorphism & Hover Effects */
        #adminPanelContainer .bg-gray-800 {
            background: rgba(30, 41, 59, 0.45) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.06) !important;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5) !important;
        }
        #adminPanelContainer .bg-gray-800:hover {
            transform: translateY(-2px);
            border-color: rgba(99, 102, 241, 0.25) !important;
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px 0 rgba(99, 102, 241, 0.05) !important;
            background: rgba(30, 41, 59, 0.55) !important;
        }

        /* Modal Glassmorphism */
        .fixed.inset-0 .bg-gray-900,
        .fixed.inset-0 .bg-gray-950 {
            background: rgba(15, 23, 42, 0.85) !important;
            backdrop-filter: blur(24px) !important;
            -webkit-backdrop-filter: blur(24px) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        
        /* Subtle Neon Accents for Modals */
        #liveExplorerModal > div {
            border: 1px solid rgba(6, 182, 212, 0.3) !important;
        }
        #monitorModal > div {
            border: 1px solid rgba(99, 102, 241, 0.3) !important;
        }
        #globalTransactionsModal > div {
            border: 1px solid rgba(249, 115, 22, 0.3) !important;
        }
        #mutasiUserModal > div {
            border: 1px solid rgba(34, 197, 94, 0.3) !important;
        }
        #pkgManagerModal > div {
            border: 1px solid rgba(168, 85, 247, 0.3) !important;
        }
        #ticketListModal > div, #chatTicketModal > div, #ticketManagerModal > div {
            border: 1px solid rgba(20, 184, 166, 0.3) !important;
        }
        
        /* 2. Premium Table Cell Paddings & Font Sizes */
        #adminPanelContainer table th, 
        #adminPanelContainer table td,
        .fixed.inset-0 table th,
        .fixed.inset-0 table td {
            padding: 12px 16px !important;
            font-size: 13.5px !important;
        }
        
        /* Table headers styling */
        #adminPanelContainer table th,
        .fixed.inset-0 table th {
            font-size: 11.5px !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            color: #9ca3af !important;
            background-color: rgba(17, 24, 39, 0.95) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        
        /* Specific metadata and smaller text sizing in tables */
        #adminPanelContainer table td.text-xs,
        .fixed.inset-0 table td.text-xs,
        #adminPanelContainer table td .text-xs,
        .fixed.inset-0 table td .text-xs {
            font-size: 12px !important;
        }
        
        /* Enhanced visibility for metadata in dark mode */
        #adminPanelContainer table td.text-gray-500,
        .fixed.inset-0 table td.text-gray-500 {
            color: #9ca3af !important;
        }

        #adminPanelContainer table tbody tr,
        .fixed.inset-0 table tbody tr {
            transition: background-color 0.2s ease !important;
        }
        #adminPanelContainer table tbody tr:hover,
        .fixed.inset-0 table tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.02) !important;
        }
        
        /* Email/Description table wraps */
        #adminPanelContainer td.whitespace-normal,
        .fixed.inset-0 td.whitespace-normal {
            font-size: 13px !important;
            line-height: 1.4 !important;
        }
        
        /* Buttons inside table cells */
        #adminPanelContainer table td button,
        .fixed.inset-0 table td button {
            font-size: 11px !important;
            padding: 6px 10px !important;
            border-radius: 6px !important;
        }
        
        /* 3. Modern, Crisp Typography for Code/Pre output log */
        pre, code {
            font-size: 12px !important;
            line-height: 1.5 !important;
            letter-spacing: -0.01em !important;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
            font-feature-settings: "tnum" 1 !important;
        }
        
        /* 4. Elegant Card and Modal Spacing */
        #adminPanelContainer .p-6, 
        #adminPanelContainer .p-8,
        .fixed.inset-0 .p-6,
        .fixed.inset-0 .p-8 {
            padding: 1.25rem !important;
        }
        @media (min-width: 768px) {
            #adminPanelContainer .p-6, 
            #adminPanelContainer .p-8,
            .fixed.inset-0 .p-6,
            .fixed.inset-0 .p-8 {
                padding: 1.75rem !important;
            }
        }
        
        #adminPanelContainer .p-5,
        .fixed.inset-0 .p-5 {
            padding: 1rem !important;
        }
        
        #adminPanelContainer .mb-6, 
        #adminPanelContainer .mb-8,
        .fixed.inset-0 .mb-6,
        .fixed.inset-0 .mb-8 {
            margin-bottom: 1.25rem !important;
        }
        
        #adminPanelContainer .rounded-3xl,
        .fixed.inset-0 .rounded-3xl {
            border-radius: 20px !important;
        }
        #adminPanelContainer .rounded-2xl,
        .fixed.inset-0 .rounded-2xl {
            border-radius: 14px !important;
        }
        
        #adminPanelContainer .gap-6,
        .fixed.inset-0 .gap-6 {
            gap: 1.25rem !important;
        }
        #adminPanelContainer .gap-4,
        .fixed.inset-0 .gap-4 {
            gap: 1rem !important;
        }
        
        /* 5. Clean minimalist scrollbars */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(31, 41, 55, 0.3) !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(75, 85, 99, 0.6) !important;
            border-radius: 3px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.8) !important;
        }
        
        /* 6. Form Fields Premium Styling & Focus Rings */
        #adminPanelContainer select, 
        #adminPanelContainer input[type="text"], 
        #adminPanelContainer input[type="number"], 
        #adminPanelContainer textarea,
        .fixed.inset-0 select, 
        .fixed.inset-0 input[type="text"], 
        .fixed.inset-0 input[type="number"], 
        .fixed.inset-0 textarea {
            padding: 10px 14px !important;
            font-size: 13.5px !important;
            border-radius: 8px !important;
            border-color: rgba(75, 85, 99, 0.5) !important;
            background-color: rgba(15, 23, 42, 0.6) !important;
            color: #ffffff !important;
            transition: all 0.2s ease !important;
        }
        #adminPanelContainer select:focus, 
        #adminPanelContainer input[type="text"]:focus, 
        #adminPanelContainer input[type="number"]:focus, 
        #adminPanelContainer textarea:focus,
        .fixed.inset-0 select:focus, 
        .fixed.inset-0 input[type="text"]:focus, 
        .fixed.inset-0 input[type="number"]:focus, 
        .fixed.inset-0 textarea:focus {
            border-color: rgba(99, 102, 241, 0.8) !important;
            background-color: rgba(15, 23, 42, 0.8) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
            outline: none !important;
        }
    </style>
    <div id="adminPanelContainer" class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 class="text-3xl font-black text-white mb-8 tracking-tight">Panel Kontrol Admin</h1>
        
        <!-- Action Control Bar -->
        <div class="flex flex-wrap gap-4 mb-8 border-b border-gray-800 pb-8">
            <button onclick="openSettingsModal()" class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Konfigurasi Sistem
            </button>
            <button onclick="openBroadcastModal()" class="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                Broadcast
            </button>
            <button onclick="openLicenseManagerModal()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                Manajemen Lisensi
            </button>
            <button onclick="openGlobalUuidModal()" class="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                Global UUID
            </button>
            <button onclick="openGlobalDeleteModal()" class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Global Delete
            </button>
            <button onclick="openMonitorModal()" class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Monitoring Server
            </button>
            <button onclick="openLiveExplorerModal()" class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                Live Server Explorer
            </button>
            <button onclick="openPkgManagerModal()" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                Filter Produk XL
            </button>
            <button onclick="openTicketManagerModal()" class="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3 relative">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Manajemen Tiket
                <span id="ticketBadge" class="absolute -top-2 -right-2 bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full hidden animate-pulse">0</span>
            </button>
            <button onclick="openGlobalTransactionsModal()" class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                Global Transaksi
            </button>
            <button onclick="openStatsDashboardModal()" class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Dashboard Statistik
            </button>
        </div>

        <!-- Manajemen & Pencarian VPN Global -->
        <div id="vpnManagement" class="bg-gray-800 rounded-3xl border border-sky-600/30 shadow-2xl mt-8 overflow-hidden">
            <button onclick="toggleSection('sectionVpn', 'iconVpn')" class="w-full flex justify-between items-center p-6 md:p-8 bg-gray-800 hover:bg-gray-700 transition">
                <h2 class="text-base font-bold text-white flex items-center gap-2">\u{1F50D} Manajemen & Pencarian VPN</h2>
                <svg id="iconVpn" class="w-6 h-6 text-gray-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="sectionVpn" class="hidden p-6 md:p-8 pt-0">
                <div class="flex flex-col md:flex-row gap-4 mb-6 mt-4">
                    <input type="text" id="searchVpnKeyword" placeholder="Cari berdasarkan Email User atau Username VPN..." class="bg-gray-900 border border-gray-600 rounded-xl p-4 text-white flex-grow focus:ring-2 focus:ring-sky-500 outline-none font-mono text-sm">
                    <button onclick="searchVPN()" id="btnSearchVpn" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shrink-0">Cari VPN</button>
                </div>
                
                <div class="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900">
                    <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                        <thead class="bg-gray-950 text-gray-400 border-b border-gray-700">
                            <tr>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Email / Pemilik</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Username VPN</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Protokol & Server</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Expired</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Aksi & Eksekusi</th>
                            </tr>
                        </thead>
                        <tbody id="vpnTableBody" class="divide-y divide-gray-800">
                            <tr><td colspan="5" class="p-8 text-center text-gray-500">Ketik kata kunci lalu klik Cari untuk memunculkan data VPN.</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Manajemen Pengguna (Dengan Pagination) -->
        <div class="bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl mt-10 overflow-hidden">
            <button onclick="toggleSection('sectionUser', 'iconUser')" class="w-full flex justify-between items-center p-6 md:p-8 bg-gray-800 hover:bg-gray-700 transition">
                <h2 class="text-base font-bold text-white" id="userTotalHeader">\u{1F465} Manajemen Pengguna (Menghitung...)</h2>
                <svg id="iconUser" class="w-6 h-6 text-gray-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="sectionUser" class="hidden p-6 md:p-8 pt-0">
                <div class="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 mt-4 gap-4">
                    <input type="text" id="searchUser" placeholder="Cari email atau nama..." class="bg-gray-900 border border-gray-600 rounded-xl p-3 text-white w-full md:w-72 focus:ring-2 focus:ring-sky-500 outline-none" onkeyup="filterUsers()">
                </div>
                <div class="overflow-x-auto rounded-xl border border-gray-700">
                    <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                        <thead class="bg-gray-900 text-gray-400 border-b border-gray-700">
                            <tr>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Email</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Nama</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Saldo</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Status</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="userTableBody" class="divide-y divide-gray-800">
                            <tr><td colspan="5" class="p-8 text-center text-cyan-400 animate-pulse">Memuat data pengguna...</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <span id="userPageInfo" class="text-sm text-gray-400 font-mono">Halaman 1 dari 1</span>
                    <div class="flex gap-2">
                        <button onclick="changeUserPage(-1)" id="btnPrevUser" class="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl transition shadow disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
                        <button onclick="changeUserPage(1)" id="btnNextUser" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-xl transition shadow disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Backup & Restore -->
        <div class="bg-gray-800 rounded-3xl border border-sky-500/30 shadow-2xl mt-10 mb-8 overflow-hidden">
            <button onclick="toggleSection('sectionBackup', 'iconBackup')" class="w-full flex justify-between items-center p-6 md:p-8 bg-gray-800 hover:bg-gray-700 transition">
                <h2 class="text-base font-bold text-white">\u{1F4BE} Backup & Restore Database</h2>
                <svg id="iconBackup" class="w-6 h-6 text-gray-400 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="sectionBackup" class="hidden p-6 md:p-8 pt-0">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div class="bg-gray-900 p-6 rounded-2xl border border-gray-700 flex flex-col justify-between">
                        <div>
                            <h3 class="font-bold text-cyan-400 mb-2 text-lg">Export Data (Backup)</h3>
                            <p class="text-sm text-gray-400 mb-6 leading-relaxed">Unduh seluruh data ke format JSON, atau kirim file backup beserta laporan statistik lengkap ke Telegram.</p>
                        </div>
                        <div class="space-y-3 mt-auto">
                            <button onclick="downloadBackup()" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition shadow-lg text-sm md:text-base">\u2B07\uFE0F Download Backup.json</button>
                            <button onclick="backupToTelegram()" id="btnBackupTg" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl transition shadow-lg text-sm md:text-base flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                                Backup Sekarang ke Telegram
                            </button>
                        </div>
                    </div>
                    <div class="bg-gray-900 p-6 rounded-2xl border border-gray-700">
                        <h3 class="font-bold text-cyan-400 mb-2 text-lg">Import Data (Restore)</h3>
                        <p class="text-sm text-gray-400 mb-6 leading-relaxed">Kembalikan data dari JSON. <strong class="text-sky-400">BAHAYA:</strong> Menghapus & menimpa data yang ada saat ini!</p>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <input type="file" id="restoreFile" accept=".json" class="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition cursor-pointer bg-gray-950 rounded-xl p-1.5 border border-gray-800">
                            <button onclick="restoreBackup()" id="btnRestore" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 py-2.5 rounded-xl transition text-sm shadow-lg shrink-0">Upload</button>
                        </div>
                    </div>
                    <div class="bg-gray-900 p-6 rounded-2xl border border-gray-700 flex flex-col justify-between md:col-span-2">
                        <div>
                            <h3 class="font-bold text-teal-400 mb-2 text-lg">\u{1F6E0}\uFE0F Inisialisasi & Optimasi Database</h3>
                            <p class="text-sm text-gray-400 leading-relaxed mb-4">Membangun ulang struktur tabel, menambahkan kolom baru, serta mengoptimalkan skema database D1 secara manual. Lakukan ini saat pertama kali setup atau setelah melakukan pembaruan skrip untuk menjamin kecocokan database.</p>
                        </div>
                        <div class="mt-auto">
                            <button onclick="initDatabaseSchema()" id="btnInitDb" class="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition shadow-lg text-sm md:text-base">\u2699\uFE0F Jalankan Inisialisasi Database</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Dashboard Statistik -->
    <div id="statsDashboardModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-4 md:p-6 rounded-[2rem] w-full max-w-6xl max-h-[96vh] flex flex-col border border-indigo-500/30 shadow-2xl shadow-indigo-950/20">
            <div class="flex justify-between items-center mb-3 border-b border-gray-800 pb-2.5">
                <div class="flex items-center gap-2">
                    <span class="text-indigo-400 text-lg">\u{1F4CA}</span>
                    <h3 class="text-lg md:text-xl font-black text-white tracking-tight">Dashboard & Statistik Penjualan</h3>
                </div>
                <div class="flex items-center gap-3">
                    <select id="statsMonthFilter" onchange="loadStatsDashboard(this.value)" class="bg-gray-950 border border-gray-850 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500 font-bold">
                        <!-- Akan diisi otomatis via JS -->
                    </select>
                    <button onclick="closeStatsDashboardModal()" class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
            </div>

            <div class="overflow-y-auto custom-scrollbar flex-grow pr-2.5 space-y-6">
                <!-- Grid Metrik Utama -->
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                    <!-- Card 1: Total Users -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Pengguna</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statTotalUsers" class="text-xl md:text-2xl font-black text-white font-mono">-</span>
                            <span class="text-[10px] text-gray-400">User</span>
                        </div>
                    </div>
                    <!-- Card 2: Liabilitas Saldo -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Liabilitas Saldo</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statTotalBalance" class="text-lg md:text-xl font-black text-green-400 font-mono">-</span>
                        </div>
                    </div>
                    <!-- Card 3: Topup Otomatis (ShopeePay) -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider" id="labelTripayIncome">Top-up ShopeePay (Bulan Ini)</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statTripayIncome" class="text-lg md:text-xl font-black text-indigo-400 font-mono">-</span>
                        </div>
                    </div>
                    <!-- Card 3b: Topup Otomatis (GoPay) -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider" id="labelVioletIncome">Top-up GoPay (Bulan Ini)</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statVioletIncome" class="text-lg md:text-xl font-black text-indigo-400 font-mono">-</span>
                        </div>
                    </div>
                    <!-- Card 4: Topup Manual (Admin) -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider" id="labelManualIncome">Top-up Manual (Bulan Ini)</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statManualIncome" class="text-lg md:text-xl font-black text-indigo-400 font-mono">-</span>
                        </div>
                    </div>
                    <!-- Card 5: Pembuatan VPN -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider" id="labelVpnCreated">Pembuatan VPN (Bulan Ini)</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statVpnCreated" class="text-xl md:text-2xl font-black text-white font-mono">-</span>
                            <span class="text-[10px] text-gray-400">Akun</span>
                        </div>
                    </div>
                    <!-- Card 5b: Perpanjangan VPN -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider" id="labelVpnRenewed">Perpanjangan VPN (Bulan Ini)</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statVpnRenewed" class="text-xl md:text-2xl font-black text-white font-mono">-</span>
                            <span class="text-[10px] text-gray-400">Akun</span>
                        </div>
                    </div>
                    <!-- Card 6: Pembelian Paket XL -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider" id="labelXlTransactions">XL KMSP (Bulan Ini)</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statXlTransactions" class="text-xl md:text-2xl font-black text-white font-mono">-</span>
                            <span class="text-[10px] text-gray-400">Trx</span>
                        </div>
                    </div>
                    <!-- Card 7: Pembelian Lisensi -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-gray-850 flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
                        <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pendapatan Lisensi</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statLicenseIncome" class="text-lg md:text-xl font-black text-yellow-400 font-mono">-</span>
                        </div>
                    </div>
                    <!-- Card 8: Estimasi Profit Bersih -->
                    <div class="bg-gray-950 p-4 rounded-2xl border border-indigo-500/30 flex flex-col justify-between bg-indigo-950/10 hover:border-indigo-500/50 transition-all duration-300">
                        <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider" id="labelNetProfit">Estimasi Net Profit (Bulan Ini)</span>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span id="statNetProfit" class="text-lg md:text-xl font-black text-green-400 font-mono">-</span>
                        </div>
                    </div>
                </div>

                <!-- Grafik Batang/Garis Transaksi Harian -->
                <div class="bg-gray-950 p-4 rounded-[1.5rem] border border-gray-850">
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Tren Transaksi Harian
                    </h4>
                    <div class="w-full relative h-48 md:h-64">
                        <canvas id="statsDailyChart"></canvas>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Tabel Performa Server VPN -->
                    <div class="bg-gray-950 rounded-[1.5rem] border border-gray-850 overflow-hidden flex flex-col">
                        <div class="p-4 border-b border-gray-850 bg-gray-900/30">
                            <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <span id="labelServerTable">\u{1F5A5}\uFE0F Rincian Server VPN (Bulan Ini)</span>
                            </h4>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar max-h-48">
                            <table class="w-full text-left text-xs text-gray-300 whitespace-nowrap">
                                <thead class="bg-gray-950 text-gray-500 border-b border-gray-850 sticky top-0">
                                    <tr>
                                        <th class="p-3 font-bold uppercase text-[10px]">Nama Server</th>
                                        <th class="p-3 font-bold uppercase text-[10px] text-center">Pembuatan</th>
                                        <th class="p-3 font-bold uppercase text-[10px] text-center">Perpanjangan</th>
                                    </tr>
                                </thead>
                                <tbody id="statsServerTableBody" class="divide-y divide-gray-900/50">
                                    <tr><td colspan="3" class="p-6 text-center text-gray-600">Belum ada data.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tabel Paket XL Terpopuler -->
                    <div class="bg-gray-950 rounded-[1.5rem] border border-gray-850 overflow-hidden flex flex-col">
                        <div class="p-4 border-b border-gray-850 bg-gray-900/30">
                            <h4 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <span id="labelXlTable">\u{1F6D2} Produk XL Terpopuler (Bulan Ini)</span>
                            </h4>
                        </div>
                        <div class="overflow-x-auto custom-scrollbar max-h-48">
                            <table class="w-full text-left text-xs text-gray-300 whitespace-nowrap">
                                <thead class="bg-gray-950 text-gray-500 border-b border-gray-850 sticky top-0">
                                    <tr>
                                        <th class="p-3 font-bold uppercase text-[10px]">Nama Paket</th>
                                        <th class="p-3 font-bold uppercase text-[10px] text-center">Terjual</th>
                                        <th class="p-3 font-bold uppercase text-[10px] text-right">Rupiah (Modal+Markup)</th>
                                    </tr>
                                </thead>
                                <tbody id="statsXlTableBody" class="divide-y divide-gray-900/50">
                                    <tr><td colspan="3" class="p-6 text-center text-gray-600">Belum ada data.</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Konfigurasi -->
    <div id="settingsModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-sky-600/30 shadow-2xl">
            <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">\u2699\uFE0F Konfigurasi Sistem</h3>
                <button onclick="closeSettingsModal()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <div class="overflow-y-auto custom-scrollbar pr-3 flex-grow">
                <form id="settingsForm" class="space-y-5">
                    
                    <div class="bg-gray-950 p-4 rounded-xl border border-gray-800 mb-4">
                        <h4 class="text-sm font-bold text-white mb-3">Metode Top Up Saldo & Fitur</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">QRIS Manual (Admin Cek)</label>
                                <select id="setQrisManualActive" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none font-bold">
                                    <option value="false" ${!isQrisManualOn ? "selected" : ""}>\u{1F534} OFF - Mati</option>
                                    <option value="true" ${isQrisManualOn ? "selected" : ""}>\u{1F7E2} ON - Aktif</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">ShopeePay (AutoGoPay)</label>
                                <select id="setShopeePayActive" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none font-bold">
                                    <option value="true" ${isShopeePayOn ? "selected" : ""}>\u{1F7E2} ON - Aktif</option>
                                    <option value="false" ${!isShopeePayOn ? "selected" : ""}>\u{1F534} OFF - Mati</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">GoPay (AutoGoPay)</label>
                                <select id="setGoPayActive" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none font-bold">
                                    <option value="true" ${isGoPayOn ? "selected" : ""}>\u{1F7E2} ON - Aktif</option>
                                    <option value="false" ${!isGoPayOn ? "selected" : ""}>\u{1F534} OFF - Mati</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Asisten AI Chat</label>
                                <select id="setAiActive" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none font-bold">
                                    <option value="true" ${appSettings.ai_chat_active !== false ? "selected" : ""}>\u{1F7E2} ON - Aktif</option>
                                    <option value="false" ${appSettings.ai_chat_active === false ? "selected" : ""}>\u{1F534} OFF - Mati</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Provider AI</label>
                                <select id="setAiProvider" class="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none font-bold">
                                    <option value="cloudflare" ${appSettings.ai_provider === "cloudflare" || !appSettings.ai_provider && appSettings.ai_provider !== "deepseek" && appSettings.ai_provider !== "gemini" ? "selected" : ""}>\u2601\uFE0F Cloudflare (Llama-3)</option>
                                    <option value="deepseek" ${appSettings.ai_provider === "deepseek" ? "selected" : ""}>\u{1F40B} Deepseek-v4-flash</option>
                                    <option value="gemini" ${appSettings.ai_provider === "gemini" ? "selected" : ""}>\u264A Gemini (Gemini-Flash)</option>
                                </select>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-gray-800 space-y-3">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">AutoGoPay API Key (Opsional / Override)</label>
                                <input type="text" id="setAgpApiKey" value="${appSettings.autogopay_api_key || ""}" placeholder="agp_1bae647d0c0c25307757c1a60afa7b06..." class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none">
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">ShopeePay QRIS Static</label>
                                    <input type="text" id="setShopeeQrisStatic" value="${appSettings.shopeepay_qris_static || ""}" placeholder="00020101021126610016ID.CO.SHOPEE..." class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">GoPay QRIS Static</label>
                                    <input type="text" id="setGopayQrisStatic" value="${appSettings.gopay_qris_static || ""}" placeholder="00020101021126610014COM.GO-JEK..." class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white text-xs font-mono focus:ring-2 focus:ring-sky-500 outline-none">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Harga VPN (Rp/Hari)</label>
                            <input type="number" id="setPrice" value="${appSettings.price_per_day}" required class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-white font-bold text-lg focus:ring-2 focus:ring-sky-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Harga Lisensi Script (Rp)</label>
                            <input type="number" id="setLicPrice" value="${licPrice}" required class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-green-400 font-bold text-lg focus:ring-2 focus:ring-green-500 outline-none" title="Harga per hari untuk Lisensi Autoscript">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Markup XL KMSP (Rp)</label>
                            <input type="number" id="setMarkup" value="${kmspMarkup}" required class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-yellow-400 font-bold text-lg focus:ring-2 focus:ring-yellow-500 outline-none" title="Penambahan harga otomatis untuk Paket XL">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Telegram Bot Token</label>
                            <input type="text" id="setTgToken" value="${appSettings.telegram_bot_token || ""}" placeholder="123456:ABC-DEF..." class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Telegram Channel ID</label>
                            <input type="text" id="setTgChatId" value="${appSettings.telegram_channel_id || ""}" placeholder="@srpcomlogcf" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Frekuensi Auto Backup (Jam)</label>
                            <select id="setBackupFreq" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:ring-2 focus:ring-green-500 outline-none font-bold">
                                <option value="12" ${backupFreq === 12 ? "selected" : ""}>Tiap 12 Jam (2x Sehari)</option>
                                <option value="24" ${backupFreq === 24 ? "selected" : ""}>Tiap 24 Jam (1x Sehari - Rekomendasi)</option>
                                <option value="0" ${backupFreq === 0 ? "selected" : ""}>\u274C Matikan Auto Backup</option>
                            </select>
                        </div>
                        <div class="col-span-2 md:col-span-1">
                            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Mode Maintenance</label>
                            <select id="setMaintenance" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none font-bold">
                                <option value="false" ${!appSettings.maintenance_mode ? "selected" : ""}>\u{1F7E2} OFF - Normal</option>
                                <option value="true" ${appSettings.maintenance_mode ? "selected" : ""}>\u{1F534} ON - Maintenance</option>
                            </select>
                        </div>
                    </div>
                    <div class="border-t border-gray-800 pt-5 mt-4">
                        <label class="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">Daftar Server API</label>
                        <div id="serverListContainer" class="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 mb-3">
                            <!-- Server items rendered dynamically via JS -->
                        </div>
                        <button type="button" onclick="addServerUI()" class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center gap-1.5 active:scale-[0.98]">
                            \u2795 Tambah Server Baru
                        </button>
                        <textarea id="setServers" class="hidden">${JSON.stringify(appSettings.servers || [])}</textarea>
                    </div>
                    <button type="submit" id="btnSaveSettings" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg mt-4">Simpan Konfigurasi</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal List Lisensi -->
    <div id="licenseManagerModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-4 md:p-5 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col border border-emerald-500/30 shadow-2xl shadow-emerald-950/20">
            <div class="flex justify-between items-center mb-3.5 border-b border-gray-800 pb-2.5">
                <h3 class="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">\u{1F4DC} Manajemen Lisensi Script</h3>
                <button onclick="closeLicenseManagerModal()" class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div class="flex flex-col md:flex-row gap-3 mb-3">
               <input type="text" id="searchLicenseAdmin" placeholder="Cari IP, Email User, atau Nama VPS..." class="bg-gray-950 border border-gray-700 rounded-lg p-2 text-white flex-grow focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-xs" onkeyup="filterAdminLicenses()">
            </div>
            <div class="overflow-y-auto custom-scrollbar pr-2.5 flex-grow border border-gray-800 rounded-xl bg-gray-950">
                <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-900 text-gray-400 border-b border-gray-800 sticky top-0 z-10">
                        <tr>
                            <th class="p-2 font-bold uppercase tracking-wider text-xs">Email User</th>
                            <th class="p-2 font-bold uppercase tracking-wider text-xs">IP Address</th>
                            <th class="p-2 font-bold uppercase tracking-wider text-xs">Nama VPS</th>
                            <th class="p-2 font-bold uppercase tracking-wider text-xs text-center">Status</th>
                            <th class="p-2 font-bold uppercase tracking-wider text-xs text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="licenseManagerBody" class="divide-y divide-gray-800">
                        <tr><td colspan="5" class="p-8 text-center text-gray-500">Memuat data lisensi...</td></tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination Controls for Admin Licenses -->
            <div id="licenseAdminPagination" class="flex items-center justify-between gap-4 mt-3 bg-gray-950 p-2.5 border border-gray-800 rounded-xl relative z-10 hidden">
                <button onclick="prevAdminLicensePage()" id="btnPrevAdminLicense" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Sebelum
                </button>
                <span id="adminLicensePageInfo" class="text-xs text-gray-400 font-medium">Halaman 1 dari 1</span>
                <button onclick="nextAdminLicensePage()" id="btnNextAdminLicense" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">
                    Berikut <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Broadcast -->
    <div id="broadcastModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-2xl border border-gray-700 shadow-2xl">
            <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">\u{1F4E2} Kirim Pesan Inbox</h3>
                <button onclick="closeBroadcastModal()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <form id="adminForm" class="space-y-5">
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Target Penerima</label>
                    <select id="targetType" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none" onchange="document.getElementById('emailInputContainer').classList.toggle('hidden', this.value==='all')">
                        <option value="all">Kirim Broadcast (Semua User)</option>
                        <option value="specific">Kirim Spesifik (1 User)</option>
                    </select>
                </div>
                <div id="emailInputContainer" class="hidden">
                    <input type="email" id="targetEmail" placeholder="Alamat Email Tujuan" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Judul & Isi Pesan</label>
                    <input type="text" id="msgTitle" required placeholder="Judul Pesan" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white mb-4 focus:ring-2 focus:ring-yellow-500 outline-none">
                    <textarea id="msgBody" required rows="5" placeholder="Ketik isi pesan di sini (Bisa format HTML)..." class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white custom-scrollbar focus:ring-2 focus:ring-yellow-500 outline-none"></textarea>
                </div>
                <button type="submit" id="btnSendMsg" class="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg mt-4">Kirim Pesan Sekarang</button>
            </form>
        </div>
    </div>

    <!-- Modal Global Ganti UUID -->
    <div id="globalUuidModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-2xl border border-pink-500/30 shadow-2xl">
            <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">\u{1F511} Global Ganti UUID</h3>
                <button onclick="closeGlobalUuidModal()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <form id="globalUuidForm" class="space-y-5">
                <p class="text-sm text-gray-400 leading-relaxed mb-4">Fitur ini memungkinkan Admin mengganti UUID secara langsung di VPS (berlaku untuk semua akun XRAY yang ada di host), dengan menginputkan UUID lama dan UUID baru.</p>
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Pilih Server VPS</label>
                    <select id="guServer" required class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none">
                        ${(appSettings.servers || []).map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">UUID Lama</label>
                    <input type="text" id="guOldUuid" required placeholder="Contoh: 123e4567-e89b-12d3-a456-426614174000" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none font-mono text-sm">
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">UUID Baru</label>
                    <input type="text" id="guNewUuid" placeholder="Biarkan kosong untuk generate UUID Acak..." class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none font-mono text-sm">
                    <p class="text-xs text-gray-500 mt-2">*Kosongkan jika ingin sistem membuatkan UUID Acak.</p>
                </div>
                <button type="submit" id="btnSubmitGu" class="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg mt-4">Eksekusi Ganti UUID</button>
            </form>
        </div>
    </div>
    
    <!-- Modal Global Delete -->
    <div id="globalDeleteModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-2xl border border-sky-500/30 shadow-2xl">
            <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">\u{1F5D1}\uFE0F Global Delete Akun VPN</h3>
                <button onclick="closeGlobalDeleteModal()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <form id="globalDeleteForm" class="space-y-5">
                <p class="text-sm text-gray-400 leading-relaxed mb-4">Fitur ini akan menghapus akun (username) secara paksa dari VPS (melalui seluruh protokol utama) dan menghapusnya dari database lokal jika ditemukan.</p>
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Pilih Server VPS</label>
                    <select id="gdServer" required class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-sky-500 outline-none">
                        ${(appSettings.servers || []).map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Username / Akun</label>
                    <input type="text" id="gdUsername" required placeholder="Contoh: tuban123" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-sky-500 outline-none font-mono text-sm">
                </div>
                <button type="submit" id="btnSubmitGd" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg mt-4">Eksekusi Delete</button>
            </form>
        </div>
    </div>

    <!-- Modal Monitoring Server -->
    <div id="monitorModal" class="fixed inset-0 bg-black/85 hidden z-50 flex items-center justify-center p-3 md:p-4 backdrop-blur-md">
        <div class="bg-gray-950 p-4 md:p-5 rounded-2xl w-full max-w-4xl h-[85vh] md:h-[80vh] flex flex-col border border-sky-600/15 shadow-2xl shadow-red-950/20">
            <!-- Header Ringkas -->
            <div class="flex justify-between items-start border-b border-gray-900 pb-2.5 shrink-0">
                <div>
                    <div class="flex items-center gap-2">
                        <h3 class="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                            <span class="text-cyan-400">\u{1F4CA}</span> Monitoring Server (Live)
                        </h3>
                        <span class="bg-sky-950/40 text-cyan-400 border border-red-800/40 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">STATUS PING</span>
                    </div>
                    <p class="text-[10px] text-cyan-300/80 mt-0.5 leading-tight">Pengecekan latency dan status konektivitas realtime untuk semua server VPS yang terhubung.</p>
                </div>
                <button onclick="closeMonitorModal()" class="text-gray-400 hover:text-white text-xl leading-none transition-colors p-1">&times;</button>
            </div>
            
            <!-- Konten Tunggal: Status Semua Server VPS -->
            <div class="flex-grow bg-gray-900/10 rounded-xl border border-gray-900/60 p-4 flex flex-col min-h-0 overflow-hidden mt-4 text-left">
                <div class="flex items-center justify-between border-b border-gray-800 pb-2.5 mb-3 shrink-0">
                    <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                        \u{1F310} Status Semua Server VPS
                    </h4>
                    <button onclick="pingAllServers()" class="bg-sky-700 hover:bg-sky-600 active:scale-[0.98] text-white text-[10px] px-3 py-1.5 rounded-lg font-bold transition shadow-sm flex items-center gap-1">
                        \u{1F504} Cek Ulang
                    </button>
                </div>
                <div class="flex-grow overflow-y-auto custom-scrollbar min-h-0">
                    <table class="w-full text-left text-xs whitespace-nowrap">
                        <thead class="bg-gray-950 text-gray-400 border-b border-gray-800 sticky top-0 z-10">
                            <tr>
                                <th class="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Nama Server</th>
                                <th class="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-center">Status</th>
                                <th class="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px] text-right">Latency / Info</th>
                            </tr>
                        </thead>
                        <tbody id="vpsStatusListBody" class="divide-y divide-gray-800/60">
                            ${(appSettings.servers || []).map((s) => `
                                <tr id="vps-row-${s.id}">
                                    <td class="py-3 px-3">
                                        <div class="font-bold text-gray-200">${s.name}</div>
                                        <div class="text-[9px] font-mono text-gray-500">${s.host.replace(/^https?:\/\//, "")}</div>
                                    </td>
                                    <td class="py-3 px-3 text-center">
                                        <span class="vps-status-badge px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse">Memeriksa...</span>
                                    </td>
                                    <td class="py-3 px-3 text-right font-mono text-[10px] text-gray-300 vps-status-info">-</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Live Server Explorer -->
    <div id="liveExplorerModal" class="fixed inset-0 bg-black/85 hidden z-50 flex items-center justify-center p-3 md:p-4 backdrop-blur-md">
        <div class="bg-gray-950 p-4 md:p-5 rounded-2xl w-full max-w-[96vw] h-[96vh] md:h-[98vh] flex flex-col border border-cyan-500/15 shadow-2xl shadow-cyan-950/20">
            <!-- Header Ringkas -->
            <div class="flex justify-between items-start border-b border-gray-900 pb-1.5 shrink-0">
                <div>
                    <div class="flex items-center gap-2">
                        <h3 class="text-base md:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                            <span class="text-cyan-400 animate-pulse">\u{1F310}</span> Live Server Explorer
                        </h3>
                        <span class="bg-cyan-950/40 text-cyan-400 border border-cyan-900/40 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">REAL-TIME VPS</span>
                    </div>
                    <p class="text-[10px] text-cyan-300/80 mt-0.5 leading-tight">Menarik data dari VPS target untuk melacak <b>Akun Gaib</b> (dibuat manual via terminal VPS & tidak tercatat di Database Web).</p>
                </div>
                <button onclick="closeLiveExplorerModal()" class="text-gray-400 hover:text-white text-xl leading-none transition-colors p-1">&times;</button>
            </div>
            
            <div class="flex-grow flex flex-col min-h-0 mt-2 space-y-2.5">
                <!-- Toolbar Kontrol Horizontal -->
                <div class="bg-gray-900/30 p-2 rounded-xl border border-gray-900/60 flex flex-wrap items-center gap-4 shrink-0 shadow-sm">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-extrabold text-cyan-500 uppercase tracking-wider flex items-center gap-1">\u{1F310} VPS:</span>
                        <select id="leServer" class="bg-gray-950 border border-gray-800 rounded-lg py-1.5 px-3 text-[11px] text-white focus:ring-1 focus:ring-cyan-500 outline-none font-bold cursor-pointer hover:border-gray-700 transition">
                            <option value="all">\u{1F310} Cari di Semua VPS</option>
                            ${(appSettings.servers || []).map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-extrabold text-cyan-500 uppercase tracking-wider flex items-center gap-1">\u26A1 PROTOKOL:</span>
                        <select id="leProtocol" class="bg-gray-950 border border-gray-800 rounded-lg py-1.5 px-3 text-[11px] text-white focus:ring-1 focus:ring-cyan-500 outline-none font-bold cursor-pointer hover:border-gray-700 transition">
                            <option value="all">\u26A1 Semua Protokol</option>
                            <option value="vmess">VMESS</option>
                            <option value="vless">VLESS</option>
                            <option value="trojan">TROJAN</option>
                            <option value="ssh">SSH & OVPN</option>
                            <option value="l2tp">L2TP IPsec</option>
                        </select>
                    </div>
                    
                    <div class="h-5 w-[1px] bg-gray-800/80 hidden md:block"></div>
                    
                    <div class="flex items-center gap-2 flex-grow md:flex-grow-0">
                        <span class="text-[10px] font-extrabold text-cyan-500 uppercase tracking-wider flex items-center gap-1">\u{1F50D} CARI LIVE:</span>
                        <div class="flex items-center gap-1.5 flex-grow">
                            <input type="text" id="leGlobalSearchQuery" placeholder="Ketik nama akun..." class="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-[11px] text-white focus:ring-1 focus:ring-cyan-500 outline-none font-semibold w-full md:w-56 h-8 hover:border-gray-700 transition" onkeydown="if(event.key === 'Enter') startLiveGlobalSearch()">
                            <button onclick="startLiveGlobalSearch()" id="btnGlobalSearch" class="bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold px-3 py-1.5 rounded-lg text-xs transition duration-150 shadow-sm flex items-center justify-center gap-1 h-8 shrink-0">
                                \u{1F50D} Cari Akun
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Grid Output Split Screen Maximized -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow min-h-0">
                    <!-- Panel Kiri: List Akun -->
                    <div class="bg-gray-900/20 rounded-xl border border-gray-900/80 flex flex-col h-full min-h-0 overflow-hidden shadow-sm">
                        <div class="bg-gray-900/60 px-3 py-2 border-b border-gray-900 flex items-center justify-between shrink-0">
                            <h4 class="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                <span class="text-cyan-400">1.</span> Daftar Akun VPS Live
                            </h4>
                            <button onclick="fetchLiveList()" id="btnFetchList" class="bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold px-3 py-1 rounded-lg text-xs transition duration-150 shadow-sm flex items-center gap-1.5 h-7">
                                \u{1F504} Tarik Data (Live)
                            </button>
                        </div>
                        <div class="bg-gray-950 p-2.5 flex-grow overflow-y-auto custom-scrollbar shadow-inner min-h-0 flex flex-col">
                            <pre id="leListResult" class="text-slate-400 font-mono text-[10px] leading-relaxed select-text whitespace-pre-wrap flex-grow min-h-0">Menunggu instruksi tarik data...</pre>
                        </div>
                    </div>
 
                    <!-- Panel Kanan: Cek Detail & Kontrol -->
                    <div class="bg-gray-900/20 rounded-xl border border-gray-900/80 flex flex-col h-full min-h-0 overflow-hidden shadow-sm">
                        <div class="bg-gray-900/60 px-3 py-2 border-b border-gray-900 flex items-center justify-between shrink-0">
                            <h4 class="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                <span class="text-cyan-400">2.</span> Detail & Kontrol Akun
                            </h4>
                        </div>
                        <div class="bg-gray-950 p-3 flex-grow overflow-y-auto custom-scrollbar shadow-inner min-h-0 flex flex-col space-y-3">
                            <!-- Form Action Kontrol (Gagah & Profesional) -->
                            <div class="bg-gray-900/40 p-3 rounded-xl border border-gray-900/80 shrink-0 space-y-2.5 shadow-sm">
                                <div class="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                    \u2699\uFE0F Kontrol Akun Target
                                </div>
                                <div class="flex gap-2">
                                    <input type="text" id="leUsername" placeholder="Ketik Username Akun Target..." class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none font-mono hover:border-gray-700 transition h-9">
                                    <button onclick="fetchLiveDetail()" id="btnFetchDetail" class="bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold px-4 rounded-lg text-xs transition duration-150 shadow-sm shrink-0 flex items-center justify-center gap-1 h-9">
                                        \u{1F50D} Cek Detail
                                    </button>
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <button onclick="renewLiveAccount()" id="btnRenewLive" class="bg-green-600 hover:bg-green-500 active:scale-[0.98] text-white font-bold px-3 py-2 rounded-lg text-xs transition duration-150 shadow-sm flex items-center justify-center gap-1 h-9">
                                        \u{1F504} Perpanjang
                                    </button>
                                    <button onclick="deleteLiveAccount()" id="btnDeleteLive" class="bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white font-bold px-3 py-2 rounded-lg text-xs transition duration-150 shadow-sm flex items-center justify-center gap-1 h-9">
                                        \u{1F5D1}\uFE0F Hapus Akun
                                    </button>
                                </div>
                            </div>

                            <!-- Detail Box -->
                            <div class="flex-grow min-h-0 flex flex-col relative">
                                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 shrink-0">
                                    \u{1F4DC} Output Konfigurasi / Detail VPS:
                                </div>
                                <div class="bg-gray-950 p-2.5 rounded-lg border border-gray-900 flex-grow overflow-y-auto custom-scrollbar min-h-[120px] flex flex-col">
                                    <pre id="leDetailResult" class="text-slate-400 font-mono text-[10px] leading-relaxed select-all whitespace-pre-wrap flex-grow min-h-0">Menunggu instruksi...</pre>
                                </div>
                            </div>
                            
                            <!-- Hubungkan ke User Web Panel -->
                            <div id="leLinkUserPanel" class="p-3 bg-gray-900/50 border border-gray-900 rounded-xl space-y-2 hidden shrink-0 shadow-sm">
                                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">\u{1F517} Hubungkan ke User Website</div>
                                <div class="flex gap-2">
                                    <input id="linkUserEmail" type="email" placeholder="Email User Website (cth: yanto@gmail.com)" class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none hover:border-gray-700 transition h-9">
                                    <button id="btnLinkLiveUser" onclick="linkLiveAccountToUser()" class="bg-cyan-700 hover:bg-cyan-600 text-white text-[11px] px-4 rounded-lg font-bold transition shadow shrink-0 h-9">Hubungkan</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Filter Produk XL (KMSP) -->
    <div id="pkgManagerModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-4 md:p-5 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col border border-purple-500/30 shadow-2xl">
            <div class="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                <h3 class="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">\u{1F4E6} Filter Produk XL (KMSP)</h3>
                <button onclick="closePkgManagerModal()" class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <p class="text-xs text-gray-400 leading-tight mb-2.5">Gunakan fitur ini untuk mengatur paket XL mana yang <b>tampil (Melek)</b> atau <b>disembunyikan (Merem)</b> pada halaman Pembelian Paket Data User.</p>
            <div class="flex flex-col md:flex-row gap-3 mb-3">
               <input type="text" id="searchPkgAdmin" placeholder="Cari berdasarkan nama atau ID paket..." class="bg-gray-950 border border-gray-700 rounded-lg p-2 text-white flex-grow focus:ring-2 focus:ring-purple-500 outline-none font-mono text-xs" onkeyup="filterPkgAdmin()">
            </div>
            <div class="overflow-y-auto custom-scrollbar pr-3 flex-grow border border-gray-800 rounded-xl bg-gray-950">
                <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-900 text-gray-400 border-b border-gray-800 sticky top-0 z-10">
                        <tr>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs w-16 text-center">Tampil</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">ID Paket</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Nama Paket</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Harga Asli</th>
                        </tr>
                    </thead>
                    <tbody id="pkgManagerBody" class="divide-y divide-gray-800">
                        <tr><td colspan="4" class="p-8 text-center text-gray-500">Memuat data produk...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal List Tiket Bantuan -->
    <div id="ticketManagerModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-4 md:p-5 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col border border-teal-500/30 shadow-2xl">
            <div class="flex justify-between items-center mb-3.5 border-b border-gray-800 pb-2.5">
                <h3 class="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">\u{1F3AB} Manajemen Tiket Bantuan</h3>
                <button onclick="closeTicketManagerModal()" class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div class="flex flex-col md:flex-row gap-3 mb-3">
               <select id="filterTicketStatus" class="bg-gray-950 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-teal-500 outline-none font-bold text-xs" onchange="loadAdminTickets()">
                   <option value="ALL">Semua Status Tiket</option>
                   <option value="OPEN">\u{1F534} OPEN (Butuh Balasan)</option>
                   <option value="PENDING">\u{1F7E1} PENDING (Menunggu User)</option>
                   <option value="CLOSED">\u26AB CLOSED (Selesai)</option>
               </select>
               <input type="text" id="searchTicketAdmin" placeholder="Cari ID tiket atau email..." class="bg-gray-950 border border-gray-700 rounded-lg p-2 text-white flex-grow focus:ring-2 focus:ring-teal-500 outline-none font-mono text-xs" onkeyup="debounceLoadAdminTickets()">
            </div>
            <div class="overflow-y-auto custom-scrollbar pr-3 flex-grow border border-gray-800 rounded-xl bg-gray-950">
                <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-900 text-gray-400 border-b border-gray-800 sticky top-0 z-10">
                        <tr>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">ID Tiket</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Email User</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Kategori & Judul</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-center">Status</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="ticketManagerBody" class="divide-y divide-gray-800">
                        <tr><td colspan="5" class="p-8 text-center text-gray-500">Memuat data tiket...</td></tr>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination Bar for Admin Tickets -->
            <div class="mt-4 p-4 bg-gray-950 border border-gray-800 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                <button id="btnPrevAdminTicket" onclick="loadAdminTickets(currentAdminTicketPage - 1)" class="bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Sebelum
                </button>
                <span id="adminTicketPageInfo" class="text-xs text-gray-400 font-medium">Halaman 1 dari 1</span>
                <button id="btnNextAdminTicket" onclick="loadAdminTickets(currentAdminTicketPage + 1)" class="bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    Berikut <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Modal View Chat Tiket -->
    <div id="ticketViewModal" class="fixed inset-0 bg-black/90 hidden z-[60] flex items-center justify-center p-4 backdrop-blur-md">
        <div class="bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col border border-gray-700 shadow-2xl">
            <div class="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950 rounded-t-3xl">
                <div>
                    <h3 class="text-xl font-bold text-white flex items-center gap-2" id="ticketViewTitle">#TCK-XXXXX</h3>
                    <p class="text-xs text-gray-400 mt-1" id="ticketViewSubtitle">Kategori - Email User</p>
                </div>
                <div class="flex items-center gap-3">
                    <span id="ticketViewStatus" class="px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider">STATUS</span>
                    <button onclick="closeTicketViewModal()" class="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-xl transition">&times;</button>
                </div>
            </div>
            
            <div id="ticketChatContainer" class="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-[#0b1120] bg-opacity-50">
                <!-- Chat bubbles rendered here -->
            </div>
            
            <div class="p-4 border-t border-gray-800 bg-gray-950 rounded-b-3xl">
                <div id="ticketReplyArea" class="flex gap-3">
                    <input type="hidden" id="replyTicketId" value="">
                    <textarea id="replyTicketMessage" rows="2" placeholder="Ketik balasan Anda di sini..." class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-teal-500 outline-none custom-scrollbar text-sm resize-none"></textarea>
                    <div class="flex flex-col gap-2 shrink-0">
                        <button onclick="sendTicketReplyAdmin()" id="btnSendReply" class="bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow flex-grow">Kirim Balasan</button>
                        <button onclick="closeTicketAdmin()" id="btnCloseTicketAdmin" class="bg-gray-700 hover:bg-sky-600 text-gray-300 hover:text-white text-xs font-bold px-5 py-2 rounded-xl transition border border-gray-600 hover:border-sky-500">Tutup Tiket</button>
                    </div>
                </div>
                <div id="ticketClosedArea" class="hidden text-center p-3">
                    <p class="text-sm text-gray-500 font-bold">\u{1F512} Tiket ini telah ditutup dan tidak dapat dibalas kembali.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Inbox User -->
    <div id="inboxModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-700 shadow-2xl">
            <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <h3 class="text-2xl font-bold text-white tracking-tight" id="inboxModalTitle">Inbox User</h3>
                <button onclick="closeInboxModal()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </div>
            <div id="inboxModalContent" class="overflow-y-auto space-y-4 custom-scrollbar pr-3 flex-grow">
                <p class="text-gray-500 text-center py-10 font-medium">Memuat pesan...</p>
            </div>
        </div>
    </div>

    <!-- Modal Riwayat Mutasi User -->
    <div id="mutasiUserModal" class="fixed inset-0 bg-black/80 hidden z-[60] flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-4 md:p-5 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col border border-green-500/30 shadow-2xl">
            <div class="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                <h3 class="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2" id="mutasiUserModalTitle">\u{1F4B3} Histori Saldo: </h3>
                <button onclick="closeUserMutasiModal()" class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div class="overflow-y-auto custom-scrollbar flex-grow border border-gray-800 rounded-xl bg-gray-950">
                <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-900 text-gray-400 border-b border-gray-800 sticky top-0 z-10">
                        <tr>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Tanggal</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Deskripsi</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-right">Nominal</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-right">Sisa Saldo</th>
                        </tr>
                    </thead>
                    <tbody id="mutasiUserTableBody" class="divide-y divide-gray-800">
                        <tr><td colspan="4" class="p-8 text-center text-gray-500">Memuat data...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Riwayat Transaksi Global -->
    <div id="globalTransactionsModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-3 md:p-4 backdrop-blur-sm">
        <div class="bg-gray-900 p-4 md:p-5 rounded-2xl w-full max-w-7xl max-h-[96vh] flex flex-col border border-orange-500/30 shadow-2xl shadow-orange-950/20">
            <div class="flex justify-between items-center mb-3 border-b border-gray-800 pb-2">
                <h3 class="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    Riwayat Transaksi Global
                </h3>
                <button onclick="closeGlobalTransactionsModal()" class="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div class="flex flex-col md:flex-row gap-3 mb-3">
               <input type="text" id="searchGlobalTransactions" placeholder="Cari email atau deskripsi..." class="bg-gray-950 border border-gray-700 rounded-lg p-2 text-white flex-grow focus:ring-2 focus:ring-orange-500 outline-none font-mono text-xs" onkeyup="filterGlobalTransactions()">
            </div>
            <div class="overflow-y-auto custom-scrollbar flex-grow border border-gray-800 rounded-xl bg-gray-950">
                <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-900 text-gray-400 border-b border-gray-800 sticky top-0 z-10">
                        <tr>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Tanggal</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Email User</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Deskripsi</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-right">Nominal</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-right">Sisa Saldo</th>
                        </tr>
                    </thead>
                    <tbody id="globalTransactionsTableBody" class="divide-y divide-gray-800">
                        <tr><td colspan="5" class="p-8 text-center text-gray-500">Memuat data transaksi...</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <span id="globalTransactionsPageInfo" class="text-sm text-gray-400 font-mono">Halaman 1 dari 1</span>
                <div class="flex gap-2">
                    <button onclick="changeGlobalTransactionsPage(-1)" id="btnPrevGlobalTransactions" class="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl transition shadow disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
                    <button onclick="changeGlobalTransactionsPage(1)" id="btnNextGlobalTransactions" class="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl transition shadow disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Serialisasi Server Aktif untuk Global Search
        const leActiveServers = ${JSON.stringify(appSettings.servers || [])};

        // --- SISTEM MANAJEMEN SERVER INTERAKTIF ---
        function getServersFromUI() {
            const container = document.getElementById('serverListContainer');
            if (!container) return [];
            const items = container.getElementsByClassName('server-item');
            const servers = [];
            for (let i = 0; i < items.length; i++) {
                const id = items[i].querySelector('.server-id').value.trim();
                const name = items[i].querySelector('.server-name').value.trim();
                const host = items[i].querySelector('.server-host').value.trim();
                const key = items[i].querySelector('.server-key').value.trim();
                servers.push({ id, name, host, key });
            }
            return servers;
        }

        function renderServerList(servers) {
            const container = document.getElementById('serverListContainer');
            if (!container) return;
            container.innerHTML = '';
            
            if (!servers || servers.length === 0) {
                container.innerHTML = '<div class="text-gray-500 text-center py-4 text-xs font-semibold">Belum ada server. Tambahkan server baru menggunakan tombol di bawah.</div>';
                return;
            }
            
            servers.forEach((server, index) => {
                const itemHtml = \`
                    <div class="server-item bg-gray-950 p-4 rounded-xl border border-gray-800 flex flex-col gap-3 relative hover:border-sky-600/20 transition">
                        <div class="flex justify-between items-center border-b border-gray-900 pb-2">
                            <span class="text-xs font-black text-cyan-400">Server #\${index + 1}</span>
                            <button type="button" onclick="removeServerUI(\${index})" class="text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center gap-1 bg-sky-950/20 hover:bg-sky-950/40 px-2.5 py-1 rounded-md border border-sky-500/10 transition">
                                \u{1F5D1}\uFE0F Hapus
                            </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ID Server (Unik)</label>
                                <input type="text" class="server-id bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white text-xs w-full focus:ring-1 focus:ring-sky-500 outline-none font-mono" value="\${escapeHtmlClient(server.id || '')}" placeholder="Contoh: srv1" required>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Server</label>
                                <input type="text" class="server-name bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white text-xs w-full focus:ring-1 focus:ring-sky-500 outline-none font-bold" value="\${escapeHtmlClient(server.name || '')}" placeholder="Contoh: ID1 at" required>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Host / API URL</label>
                                <input type="text" class="server-host bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white text-xs w-full focus:ring-1 focus:ring-sky-500 outline-none font-mono" value="\${escapeHtmlClient(server.host || '')}" placeholder="Contoh: http://at.srpcom.cloud" required>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">API Key / Secret</label>
                                <input type="text" class="server-key bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-white text-xs w-full focus:ring-1 focus:ring-sky-500 outline-none font-mono" value="\${escapeHtmlClient(server.key || '')}" placeholder="Masukkan API Key...">
                            </div>
                        </div>
                    </div>
                \`;
                container.insertAdjacentHTML('beforeend', itemHtml);
            });
        }

        window.addServerUI = function() {
            const servers = getServersFromUI();
            servers.push({ id: '', name: '', host: '', key: '' });
            renderServerList(servers);
        };

        window.removeServerUI = function(index) {
            const servers = getServersFromUI();
            servers.splice(index, 1);
            renderServerList(servers);
        };

        // Util Escape Client Side
        function escapeHtmlClient(str) {
            if (!str) return '';
            return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
        }

        // Kontrol Modal
        function openSettingsModal() { 
            document.getElementById('settingsModal').classList.remove('hidden'); 
            try {
                const servers = JSON.parse(document.getElementById('setServers').value || '[]');
                renderServerList(servers);
            } catch (e) {
                renderServerList(leActiveServers);
            }
        }
        function closeSettingsModal() { document.getElementById('settingsModal').classList.add('hidden'); }
        function openBroadcastModal() { document.getElementById('broadcastModal').classList.remove('hidden'); }
        function closeBroadcastModal() { document.getElementById('broadcastModal').classList.add('hidden'); }
        function openGlobalUuidModal() { document.getElementById('globalUuidModal').classList.remove('hidden'); }
        function closeGlobalUuidModal() { document.getElementById('globalUuidModal').classList.add('hidden'); }
        function openGlobalDeleteModal() { document.getElementById('globalDeleteModal').classList.remove('hidden'); }
        function closeGlobalDeleteModal() { document.getElementById('globalDeleteModal').classList.add('hidden'); }
        function openMonitorModal() { 
            document.getElementById('monitorModal').classList.remove('hidden'); 
            pingAllServers();
        }
        function closeMonitorModal() { document.getElementById('monitorModal').classList.add('hidden'); }

        async function pingAllServers() {
            const rows = document.querySelectorAll('#vpsStatusListBody tr');
            rows.forEach(row => {
                const badge = row.querySelector('.vps-status-badge');
                const infoCell = row.querySelector('.vps-status-info');
                if (badge) {
                    badge.className = 'vps-status-badge px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse';
                    badge.innerText = 'Memeriksa...';
                }
                if (infoCell) {
                    infoCell.innerText = 'Connecting...';
                }
            });

            const promises = Array.from(rows).map(async row => {
                const serverId = row.id.replace('vps-row-', '');
                const badge = row.querySelector('.vps-status-badge');
                const infoCell = row.querySelector('.vps-status-info');
                
                const startTime = Date.now();
                try {
                    const res = await fetch('/api/admin/ping-server', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ serverId })
                    });
                    const latency = Date.now() - startTime;
                    const data = await res.json();
                    
                    if (data.success && data.status === 'ONLINE') {
                        if (badge) {
                            badge.className = 'vps-status-badge px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/30';
                            badge.innerText = 'ONLINE (UP)';
                        }
                        if (infoCell) {
                            infoCell.innerText = latency + ' ms';
                        }
                    } else {
                        if (badge) {
                            badge.className = 'vps-status-badge px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-sky-500/20 text-cyan-400 border border-sky-500/30';
                            badge.innerText = 'OFFLINE (DOWN)';
                        }
                        if (infoCell) {
                            infoCell.innerText = data.message || 'Error';
                        }
                    }
                } catch (e) {
                    if (badge) {
                        badge.className = 'vps-status-badge px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-sky-500/20 text-cyan-400 border border-sky-500/30';
                        badge.innerText = 'OFFLINE (DOWN)';
                    }
                    if (infoCell) {
                        infoCell.innerText = 'Failed';
                    }
                }
            });
            await Promise.all(promises);
        }
        function openLiveExplorerModal() { document.getElementById('liveExplorerModal').classList.remove('hidden'); }
        function closeLiveExplorerModal() { document.getElementById('liveExplorerModal').classList.add('hidden'); }
        function closeInboxModal() { document.getElementById('inboxModal').classList.add('hidden'); }
        function closeUserMutasiModal() { document.getElementById('mutasiUserModal').classList.add('hidden'); }
        function openGlobalTransactionsModal() { document.getElementById('globalTransactionsModal').classList.remove('hidden'); loadGlobalTransactions(1); }
        function closeGlobalTransactionsModal() { document.getElementById('globalTransactionsModal').classList.add('hidden'); }

        // --- DASHBOARD STATISTIK ---
        let statsChartInstance = null;

        function loadChartJsLibrary(callback) {
            if (typeof Chart !== 'undefined') {
                callback();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = callback;
            document.head.appendChild(script);
        }

        window.openStatsDashboardModal = function() {
            document.getElementById('statsDashboardModal').classList.remove('hidden');
            populateStatsMonthFilter();
            document.getElementById('statsMonthFilter').value = 'today';
            loadChartJsLibrary(() => {
                loadStatsDashboard('today');
            });
        }

        window.closeStatsDashboardModal = function() {
            document.getElementById('statsDashboardModal').classList.add('hidden');
        }

        function populateStatsMonthFilter() {
            const select = document.getElementById('statsMonthFilter');
            if (select.children.length > 0) return; // Sudah terpopulasi
            
            const months = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            
            const today = new Date();
            let html = '<option value="today" selected>Hari Ini</option>' +
                       '<option value="this_week">Minggu Ini</option>' +
                       '<option value="this_month">Bulan Ini</option>';
            for (let i = 0; i < 12; i++) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthVal = String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
                const label = months[d.getMonth()] + ' ' + d.getFullYear();
                html += '<option value="' + monthVal + '">' + label + '</option>';
            }
            select.innerHTML = html;
        }

        window.loadStatsDashboard = async function(monthYear) {
            const loaderIds = ['statTotalUsers', 'statTotalBalance', 'statTripayIncome', 'statVioletIncome', 'statManualIncome', 'statVpnCreated', 'statVpnRenewed', 'statXlTransactions', 'statLicenseIncome', 'statNetProfit'];
            loaderIds.forEach(id => document.getElementById(id).innerText = '...');
            
            const serverTbody = document.getElementById('statsServerTableBody');
            const xlTbody = document.getElementById('statsXlTableBody');
            serverTbody.innerHTML = '<tr><td colspan="3" class="p-6 text-center text-indigo-400 animate-pulse">Memuat rincian server...</td></tr>';
            xlTbody.innerHTML = '<tr><td colspan="3" class="p-6 text-center text-indigo-400 animate-pulse">Memuat rincian produk...</td></tr>';

            const filterSelect = document.getElementById('statsMonthFilter');
            const selectedLabel = filterSelect.options[filterSelect.selectedIndex]?.text || 'Hari Ini';
            
            document.getElementById('labelTripayIncome').innerText = 'Top-up ShopeePay (' + selectedLabel + ')';
            document.getElementById('labelVioletIncome').innerText = 'Top-up GoPay (' + selectedLabel + ')';
            document.getElementById('labelManualIncome').innerText = 'Top-up Manual (' + selectedLabel + ')';
            document.getElementById('labelVpnCreated').innerText = 'Pembuatan VPN (' + selectedLabel + ')';
            document.getElementById('labelVpnRenewed').innerText = 'Perpanjangan VPN (' + selectedLabel + ')';
            document.getElementById('labelXlTransactions').innerText = 'XL KMSP (' + selectedLabel + ')';
            document.getElementById('labelNetProfit').innerText = 'Estimasi Net Profit (' + selectedLabel + ')';
            document.getElementById('labelServerTable').innerHTML = '\u{1F5A5}\uFE0F Rincian Server VPN (' + selectedLabel + ')';
            document.getElementById('labelXlTable').innerHTML = '\u{1F6D2} Produk XL Terpopuler (' + selectedLabel + ')';

            try {
                const res = await fetch('/api/admin/dashboard-stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ month_year: monthYear })
                });
                const response = await res.json();
                if (!response.success) {
                    throw new Error(response.message || 'Gagal memuat statistik.');
                }
                
                const stats = response.data;

                document.getElementById('statTotalUsers').innerText = stats.total_users.toLocaleString('id-ID');
                document.getElementById('statTotalBalance').innerText = 'Rp ' + stats.total_balance.toLocaleString('id-ID');
                document.getElementById('statTripayIncome').innerText = 'Rp ' + stats.tripay_income.toLocaleString('id-ID');
                document.getElementById('statVioletIncome').innerText = 'Rp ' + stats.violet_income.toLocaleString('id-ID');
                document.getElementById('statManualIncome').innerText = 'Rp ' + stats.manual_income.toLocaleString('id-ID');
                document.getElementById('statVpnCreated').innerText = stats.vpn_created.toLocaleString('id-ID');
                document.getElementById('statVpnRenewed').innerText = stats.vpn_renewed.toLocaleString('id-ID');
                document.getElementById('statXlTransactions').innerText = stats.xl_transactions.toLocaleString('id-ID');
                document.getElementById('statLicenseIncome').innerText = 'Rp ' + stats.license_income.toLocaleString('id-ID');
                document.getElementById('statNetProfit').innerText = 'Rp ' + stats.net_profit.toLocaleString('id-ID');

                if (stats.servers && stats.servers.length > 0) {
                    serverTbody.innerHTML = stats.servers.map(srv => 
                        '<tr class="hover:bg-gray-800/20 transition">' +
                            '<td class="p-3 font-medium text-white">' + escapeHtmlClient(srv.name) + '</td>' +
                            '<td class="p-3 font-mono font-bold text-center text-indigo-400">' + srv.created.toLocaleString('id-ID') + '</td>' +
                            '<td class="p-3 font-mono font-bold text-center text-yellow-500">' + srv.renewed.toLocaleString('id-ID') + '</td>' +
                        '</tr>'
                    ).join('');
                } else {
                    serverTbody.innerHTML = '<tr><td colspan="3" class="p-6 text-center text-gray-500 font-bold">Tidak ada aktivitas VPN.</td></tr>';
                }

                if (stats.xl_popular && stats.xl_popular.length > 0) {
                    xlTbody.innerHTML = stats.xl_popular.map(xl => 
                        '<tr class="hover:bg-gray-800/20 transition">' +
                            '<td class="p-3 font-medium text-white whitespace-normal max-w-xs">' + escapeHtmlClient(xl.package_name) + '</td>' +
                            '<td class="p-3 font-mono font-bold text-center text-indigo-400">' + xl.count.toLocaleString('id-ID') + '</td>' +
                            '<td class="p-3 font-mono font-bold text-right text-green-400">Rp ' + xl.revenue.toLocaleString('id-ID') + '</td>' +
                        '</tr>'
                    ).join('');
                } else {
                    xlTbody.innerHTML = '<tr><td colspan="3" class="p-6 text-center text-gray-500 font-bold">Tidak ada pembelian paket XL.</td></tr>';
                }

                renderStatsDailyChart(stats.daily_chart);

            } catch (e) {
                console.error("Dashboard Stats Error:", e);
                loaderIds.forEach(id => document.getElementById(id).innerText = 'Error');
                serverTbody.innerHTML = '<tr><td colspan="3" class="p-6 text-center text-sky-400">Error memuat data.</td></tr>';
                xlTbody.innerHTML = '<tr><td colspan="3" class="p-6 text-center text-sky-400">Error memuat data.</td></tr>';
            }
        }

        function renderStatsDailyChart(chartData) {
            const ctx = document.getElementById('statsDailyChart').getContext('2d');
            
            if (statsChartInstance) {
                statsChartInstance.destroy();
            }

            statsChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: 'Top Up',
                            data: chartData.topup,
                            borderColor: '#818cf8',
                            backgroundColor: 'rgba(129, 140, 248, 0.05)',
                            fill: true,
                            tension: 0.3,
                            borderWidth: 2,
                            pointBackgroundColor: '#818cf8',
                            pointRadius: 3
                        },
                        {
                            label: 'Belanja Saldo',
                            data: chartData.spending,
                            borderColor: '#f87171',
                            backgroundColor: 'rgba(248, 113, 113, 0.05)',
                            fill: true,
                            tension: 0.3,
                            borderWidth: 2,
                            pointBackgroundColor: '#f87171',
                            pointRadius: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#9ca3af',
                                font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#6b7280', font: { size: 9, family: 'Plus Jakarta Sans' } }
                        },
                        y: {
                            grid: { color: 'rgba(255,255,255,0.03)' },
                            ticks: { 
                                color: '#6b7280', 
                                font: { size: 9, family: 'Plus Jakarta Sans' },
                                callback: function(value) {
                                    return 'Rp ' + (value >= 1000 ? (value/1000) + 'k' : value);
                                }
                            }
                        }
                    }
                }
            });
        }
        function openPkgManagerModal() { document.getElementById('pkgManagerModal').classList.remove('hidden'); loadPkgManager(); }
        function closePkgManagerModal() { document.getElementById('pkgManagerModal').classList.add('hidden'); }

        function openTicketManagerModal() { document.getElementById('ticketManagerModal').classList.remove('hidden'); loadAdminTickets(); }
        function closeTicketManagerModal() { document.getElementById('ticketManagerModal').classList.add('hidden'); }
        function closeTicketViewModal() { document.getElementById('ticketViewModal').classList.add('hidden'); loadAdminTickets(); }

        // MANAJEMEN LISENSI
        function openLicenseManagerModal() { document.getElementById('licenseManagerModal').classList.remove('hidden'); loadAdminLicenses(); }
        function closeLicenseManagerModal() { document.getElementById('licenseManagerModal').classList.add('hidden'); }

        // Fungsi Toggle untuk Accordion Section
        function toggleSection(sectionId, iconId) {
            const sec = document.getElementById(sectionId);
            const icon = document.getElementById(iconId);
            if (sec.classList.contains('hidden')) {
                sec.classList.remove('hidden');
                icon.classList.add('rotate-180');
            } else {
                sec.classList.add('hidden');
                icon.classList.remove('rotate-180');
            }
        }

        // ==========================================
        // FITUR GLOBAL TRANSAKSI (MUTASI GLOBAL)
        // ==========================================
        let currentGlobalTrxPage = 1;
        const globalTrxPerPage = 50;
        let searchGlobalTrxTimeout;

        async function loadGlobalTransactions(page = 1) {
            currentGlobalTrxPage = page;
            const searchKeyword = document.getElementById('searchGlobalTransactions').value.trim();
            const tbody = document.getElementById('globalTransactionsTableBody');
            const pageInfo = document.getElementById('globalTransactionsPageInfo');
            const btnPrev = document.getElementById('btnPrevGlobalTransactions');
            const btnNext = document.getElementById('btnNextGlobalTransactions');

            tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-orange-400 animate-pulse">Memuat riwayat transaksi global...</td></tr>';
            
            try {
                const res = await fetch('/api/admin/global-transactions', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page, limit: globalTrxPerPage, search: searchKeyword })
                });
                const data = await res.json();

                if (data.success) {
                    if (data.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500">Tidak ada riwayat transaksi ditemukan.</td></tr>';
                    } else {
                        tbody.innerHTML = data.data.map(trx => {
                            const isMasuk = trx.type === 'IN';
                            const nominalClass = isMasuk ? 'text-green-400' : 'text-cyan-400';
                            const sign = isMasuk ? '+' : '-';
                            
                            let sisaSaldoText = '-';
                            if (trx.balance !== undefined && trx.balance !== null) {
                                sisaSaldoText = 'Rp ' + trx.balance.toLocaleString('id-ID');
                            }
                            
                            const dateParts = trx.created_at ? trx.created_at.split(', ') : ['', ''];
                            const dateHtml = dateParts[1] ? \`\${dateParts[0]}<br>\${dateParts[1]}\` : (trx.created_at || '-');
                            
                            return \`
                            <tr class="hover:bg-gray-800/50 transition border-b border-gray-800 last:border-0">
                                <td class="p-4 font-mono text-xs text-gray-500">\${dateHtml}</td>
                                <td class="p-4 font-mono text-xs text-cyan-400">\${escapeHtmlClient(trx.email)}</td>
                                <td class="p-4 text-white font-medium max-w-xs truncate whitespace-normal leading-snug text-[11px]" style="font-family: 'Arial Narrow', Arial, sans-serif;">\${escapeHtmlClient(trx.description)}</td>
                                <td class="p-4 font-mono font-bold text-right \${nominalClass}">\${sign} Rp \${trx.amount.toLocaleString('id-ID')}</td>
                                <td class="p-4 font-mono font-bold text-right text-gray-300">\${sisaSaldoText}</td>
                            </tr>\`;
                        }).join('');
                    }

                    pageInfo.innerText = \`Halaman \${data.page} dari \${data.totalPages || 1}\`;
                    btnPrev.disabled = data.page <= 1;
                    btnNext.disabled = data.page >= data.totalPages;
                } else {
                    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Gagal mengambil data.</td></tr>';
                }
            } catch (e) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Koneksi Error.</td></tr>';
            }
        }

        function changeGlobalTransactionsPage(direction) {
            loadGlobalTransactions(currentGlobalTrxPage + direction);
        }

        function filterGlobalTransactions() {
            clearTimeout(searchGlobalTrxTimeout);
            searchGlobalTrxTimeout = setTimeout(() => {
                loadGlobalTransactions(1);
            }, 500);
        }

        // ===============================================
        let currentAdminTicketPage = 1;
        const adminTicketsPerPage = 15;
        let searchAdminTicketTimeout;

        function debounceLoadAdminTickets() {
            clearTimeout(searchAdminTicketTimeout);
            searchAdminTicketTimeout = setTimeout(() => { loadAdminTickets(1); }, 500);
        }

        async function loadAdminTickets(page = 1) {
            currentAdminTicketPage = page;
            const tbody = document.getElementById('ticketManagerBody');
            const statusFilter = document.getElementById('filterTicketStatus').value;
            const searchKeyword = document.getElementById('searchTicketAdmin').value.trim();
            const pageInfo = document.getElementById('adminTicketPageInfo');
            const btnPrev = document.getElementById('btnPrevAdminTicket');
            const btnNext = document.getElementById('btnNextAdminTicket');
            
            tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-teal-400 animate-pulse">Mengambil data tiket...</td></tr>';
            
            try {
                const res = await fetch('/api/admin/tickets', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: statusFilter, search: searchKeyword, page, limit: adminTicketsPerPage })
                });
                const data = await res.json();

                if (data.success) {
                    if (data.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500">Tidak ada tiket ditemukan.</td></tr>';
                    } else {
                        tbody.innerHTML = data.data.map(t => {
                            let statusBadge = '';
                            if (t.status === 'OPEN') statusBadge = '<span class="bg-sky-500/20 text-cyan-400 border border-sky-500/30 text-[10px] px-2.5 py-1 rounded uppercase font-bold">OPEN</span>';
                            else if (t.status === 'PENDING') statusBadge = '<span class="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] px-2.5 py-1 rounded uppercase font-bold">PENDING</span>';
                            else statusBadge = '<span class="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] px-2.5 py-1 rounded uppercase font-bold">CLOSED</span>';

                            return \`
                            <tr class="hover:bg-gray-800/50 transition">
                                <td class="p-4 font-mono text-xs text-cyan-400">\${t.id}</td>
                                <td class="p-4 text-sm text-gray-300">\${t.email}</td>
                                <td class="p-4">
                                    <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">\${t.category}</span>
                                    <span class="text-sm font-medium text-white max-w-[200px] truncate block">\${escapeHtmlClient(t.subject)}</span>
                                </td>
                                <td class="p-4 text-center">\${statusBadge}</td>
                                <td class="p-4 text-center">
                                    <button onclick="viewAdminTicket('\${t.id}')" class="bg-teal-600 hover:bg-teal-500 text-white text-[11px] px-3 py-1.5 rounded-lg uppercase font-bold transition shadow">Lihat / Balas</button>
                                </td>
                            </tr>
                            \`;
                        }).join('');
                    }

                    pageInfo.innerText = "Halaman " + data.page + " dari " + (data.totalPages || 1) + " (Total " + data.total + ")";
                    btnPrev.disabled = data.page <= 1;
                    btnNext.disabled = data.page >= data.totalPages;

                    // Update Badge globally
                    const badge = document.getElementById('ticketBadge');
                    if (data.openCount > 0) {
                        badge.innerText = data.openCount;
                        badge.classList.remove('hidden');
                    } else {
                        badge.classList.add('hidden');
                    }
                } else {
                    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Gagal memuat data tiket.</td></tr>';
                }
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Koneksi Error.</td></tr>';
            }
        }

        function changeAdminTicketPage(direction) {
            loadAdminTickets(currentAdminTicketPage + direction);
        }

        async function viewAdminTicket(id) {
            document.getElementById('ticketViewModal').classList.remove('hidden');
            const chatContainer = document.getElementById('ticketChatContainer');
            chatContainer.innerHTML = '<p class="text-center text-teal-400 mt-10 animate-pulse">Memuat ruang percakapan...</p>';
            
            document.getElementById('replyTicketId').value = id;
            document.getElementById('replyTicketMessage').value = '';

            try {
                const res = await fetch('/api/admin/ticket/view', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketId: id })
                });
                const data = await res.json();

                if (data.success) {
                    const t = data.ticket;
                    document.getElementById('ticketViewTitle').innerText = t.id;
                    document.getElementById('ticketViewSubtitle').innerText = t.category + ' | ' + t.email;
                    
                    const statusEl = document.getElementById('ticketViewStatus');
                    if (t.status === 'OPEN') { statusEl.className = 'px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider bg-sky-500/20 text-cyan-400 border border-sky-500/30'; statusEl.innerText = 'OPEN'; }
                    else if (t.status === 'PENDING') { statusEl.className = 'px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'; statusEl.innerText = 'PENDING'; }
                    else { statusEl.className = 'px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider bg-gray-500/20 text-gray-400 border border-gray-500/30'; statusEl.innerText = 'CLOSED'; }

                    if (t.status === 'CLOSED') {
                        document.getElementById('ticketReplyArea').classList.add('hidden');
                        document.getElementById('ticketClosedArea').classList.remove('hidden');
                    } else {
                        document.getElementById('ticketReplyArea').classList.remove('hidden');
                        document.getElementById('ticketClosedArea').classList.add('hidden');
                    }

                    if (data.replies.length === 0) {
                        chatContainer.innerHTML = '<p class="text-center text-gray-500 mt-10">Belum ada percakapan.</p>';
                    } else {
                        chatContainer.innerHTML = data.replies.map(r => {
                            const isUser = r.sender_type === 'user';
                            const bubbleClass = isUser 
                                ? 'bg-gray-800 text-gray-200 rounded-r-2xl rounded-tl-2xl mr-auto border border-gray-700' 
                                : 'bg-teal-600 text-white rounded-l-2xl rounded-tr-2xl ml-auto shadow-md';
                            
                            const senderLabel = isUser ? '<span class="text-[10px] font-bold text-gray-400 mb-1 block uppercase">Klien (User)</span>' : '<span class="text-[10px] font-bold text-teal-200 mb-1 block text-right uppercase">Anda (Admin)</span>';

                            return '<div class="max-w-[85%] md:max-w-[75%] ' + (isUser ? 'mr-auto' : 'ml-auto') + '">' + senderLabel + '<div class="px-4 py-2.5 text-sm whitespace-pre-wrap break-words leading-normal ' + bubbleClass + '">' + escapeHtmlClient(r.message) + '</div><span class="text-[10px] text-gray-500 block mt-1 ' + (isUser ? 'text-left' : 'text-right font-mono') + '">' + r.created_at + '</span></div>';
                        }).join('');
                        
                        setTimeout(() => { chatContainer.scrollTop = chatContainer.scrollHeight; }, 100);
                    }
                } else {
                    chatContainer.innerHTML = '<p class="text-center text-sky-400 mt-10">Gagal memuat detail tiket.</p>';
                }
            } catch(e) {
                chatContainer.innerHTML = '<p class="text-center text-sky-400 mt-10">Koneksi Error.</p>';
            }
        }

        async function sendTicketReplyAdmin() {
            const ticketId = document.getElementById('replyTicketId').value;
            const message = document.getElementById('replyTicketMessage').value.trim();
            if (!message) return;

            const btn = document.getElementById('btnSendReply');
            btn.disabled = true; btn.innerText = 'Mengirim...';

            try {
                const res = await fetch('/api/admin/ticket/reply', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketId, message })
                });
                const data = await res.json();
                if (data.success) {
                    viewAdminTicket(ticketId); // Reload chat
                } else {
                    swalDark.fire('Gagal', data.message || 'Gagal mengirim balasan.', 'error');
                }
            } catch (e) {
                swalDark.fire('Error', 'Kesalahan koneksi.', 'error');
            }
            btn.disabled = false; btn.innerText = 'Kirim Balasan';
        }

        async function closeTicketAdmin() {
            const ticketId = document.getElementById('replyTicketId').value;
            const conf = await swalDark.fire({ title: 'Tutup Tiket?', text: 'Tiket akan ditandai Selesai dan tidak bisa dibalas lagi.', icon: 'warning', showCancelButton: true });
            if (!conf.isConfirmed) return;

            const btn = document.getElementById('btnCloseTicketAdmin');
            btn.disabled = true;

            try {
                const res = await fetch('/api/admin/ticket/action', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketId, action: 'CLOSE' })
                });
                if ((await res.json()).success) {
                    viewAdminTicket(ticketId);
                }
            } catch(e) { swalDark.fire('Error', 'Gagal menutup tiket', 'error'); }
            btn.disabled = false;
        }


        let allAdminLicenses = [];
        let filteredAdminLicenses = [];
        let currentAdminLicensePage = 1;
        const adminLicenseLimit = 10;

        async function loadAdminLicenses() {
            const tbody = document.getElementById('licenseManagerBody');
            tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-emerald-400 animate-pulse">Mengambil data lisensi...</td></tr>';
            try {
                const res = await fetch('/api/admin/licenses');
                const data = await res.json();
                if (data.success) {
                    allAdminLicenses = data.data;
                    filteredAdminLicenses = [...allAdminLicenses];
                    currentAdminLicensePage = 1;
                    renderAdminLicenses();
                } else {
                    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Gagal memuat data.</td></tr>';
                }
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Koneksi Error.</td></tr>';
            }
        }

        function renderAdminLicenses() {
            const tbody = document.getElementById('licenseManagerBody');
            const licenses = filteredAdminLicenses;
            
            if (licenses.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500">Tidak ada lisensi terdaftar.</td></tr>';
                document.getElementById('licenseAdminPagination').classList.add('hidden');
                return;
            }

            const totalPages = Math.ceil(licenses.length / adminLicenseLimit);
            if (currentAdminLicensePage > totalPages) currentAdminLicensePage = totalPages;
            if (currentAdminLicensePage < 1) currentAdminLicensePage = 1;

            const startIndex = (currentAdminLicensePage - 1) * adminLicenseLimit;
            const endIndex = startIndex + adminLicenseLimit;
            const pageLicenses = licenses.slice(startIndex, endIndex);

            tbody.innerHTML = pageLicenses.map(lic => {
                const isExpired = lic.expires_at < Date.now();
                const expDate = new Date(lic.expires_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB';
                const statusBadge = isExpired 
                    ? '<span class="bg-sky-500/20 text-cyan-400 border border-sky-500/30 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Expired</span>'
                    : '<span class="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Aktif</span>';
                return \`
                <tr class="hover:bg-gray-800/50 transition border-b border-gray-850 last:border-0">
                    <td class="p-1.5 text-[11px] font-mono text-gray-400">\${lic.email}</td>
                    <td class="p-1.5 text-xs font-bold text-cyan-400 font-mono">\${escapeHtmlClient(lic.ip_address)}</td>
                    <td class="p-1.5 text-xs text-gray-300 truncate max-w-[200px]">
                        \${escapeHtmlClient(lic.vps_name)}
                        \${lic.subdomain ? \`<br><span class="text-[9px] text-yellow-400 font-mono font-bold">\${escapeHtmlClient(lic.subdomain)}</span>\` : ''}
                    </td>
                    <td class="p-1.5 text-center">
                        \${statusBadge}
                        <br><span class="text-[9px] text-gray-500 font-mono mt-0.5 block">\${expDate}</span>
                    </td>
                    <td class="p-1.5 text-center">
                        <button onclick="globalDeleteLicense('\${lic.id}', '\${lic.ip_address}')" class="bg-sky-600 hover:bg-sky-500 text-white text-[9px] px-2.5 py-1 rounded-lg uppercase font-bold transition shadow">Hapus Global</button>
                    </td>
                </tr>
                \`;
            }).join('');

            // Update Pagination UI
            document.getElementById('licenseAdminPagination').classList.remove('hidden');
            document.getElementById('adminLicensePageInfo').innerText = 'Halaman ' + currentAdminLicensePage + ' dari ' + totalPages + ' (Total ' + licenses.length + ' IP)';
            
            const btnPrev = document.getElementById('btnPrevAdminLicense');
            const btnNext = document.getElementById('btnNextAdminLicense');
            
            if (currentAdminLicensePage <= 1) {
                btnPrev.disabled = true;
                btnPrev.classList.add('opacity-50', 'pointer-events-none');
            } else {
                btnPrev.disabled = false;
                btnPrev.classList.remove('opacity-50', 'pointer-events-none');
            }

            if (currentAdminLicensePage >= totalPages) {
                btnNext.disabled = true;
                btnNext.classList.add('opacity-50', 'pointer-events-none');
            } else {
                btnNext.disabled = false;
                btnNext.classList.remove('opacity-50', 'pointer-events-none');
            }
        }

        window.prevAdminLicensePage = function() {
            if (currentAdminLicensePage > 1) {
                currentAdminLicensePage--;
                renderAdminLicenses();
            }
        }

        window.nextAdminLicensePage = function() {
            const totalPages = Math.ceil(filteredAdminLicenses.length / adminLicenseLimit);
            if (currentAdminLicensePage < totalPages) {
                currentAdminLicensePage++;
                renderAdminLicenses();
            }
        }

        function filterAdminLicenses() {
            const keyword = document.getElementById('searchLicenseAdmin').value.toLowerCase().trim();
            filteredAdminLicenses = allAdminLicenses.filter(l => l.ip_address.toLowerCase().includes(keyword) || l.email.toLowerCase().includes(keyword) || l.vps_name.toLowerCase().includes(keyword));
            currentAdminLicensePage = 1;
            renderAdminLicenses();
        }

        async function globalDeleteLicense(id, ip) {
            const conf = await swalDark.fire({
                title: 'Hapus Lisensi Global?',
                text: 'IP ' + ip + ' akan dihapus paksa dari database. Tidak dapat di-undo.',
                icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus!'
            });
            if(!conf.isConfirmed) return;

            swalDark.fire({title: 'Menghapus...', didOpen: () => Swal.showLoading()});
            try {
                const res = await fetch('/api/license/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                if((await res.json()).success) { 
                    await swalDark.fire('Dihapus', 'Lisensi IP berhasil dihapus secara global.', 'success'); 
                    loadAdminLicenses(); 
                }
                else { swalDark.fire('Gagal', 'Sistem error.', 'error'); }
            } catch(e) { swalDark.fire('Error', 'Koneksi bermasalah', 'error'); }
        }


        // ==========================================
        // FILTER PRODUK XL (KMSP)
        // ==========================================
        let allAdminPkgs = [];
        async function loadPkgManager() {
            const tbody = document.getElementById('pkgManagerBody');
            tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-purple-400 animate-pulse">Mengambil data dari Server KMSP...</td></tr>';
            try {
                const res = await fetch('/api/admin/kmsp-packages');
                const data = await res.json();
                if (data.success) {
                    allAdminPkgs = data.data;
                    renderAdminPkgs(allAdminPkgs);
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-sky-400">Gagal: ' + (data.message || 'Error mengambil data KMSP') + '</td></tr>';
                }
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-sky-400">Koneksi API Error.</td></tr>';
            }
        }

        function renderAdminPkgs(pkgs) {
            const tbody = document.getElementById('pkgManagerBody');
            if (pkgs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-500">Tidak ada paket yang sesuai kriteria.</td></tr>';
                return;
            }
            tbody.innerHTML = pkgs.map(p => {
                const isMelek = p.visible;
                const eyeIcon = isMelek 
                    ? \`<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>\` 
                    : \`<svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>\`;
                
                const btnClass = isMelek ? 'bg-green-500/20 hover:bg-green-500/40 border-green-500/30' : 'bg-sky-500/20 hover:bg-sky-500/40 border-sky-500/30';
                
                return \`
                <tr class="hover:bg-gray-800/50 transition">
                    <td class="p-3 text-center">
                        <button onclick="togglePkgVisibility('\${p.id}', \${!isMelek})" class="p-2 rounded-lg border transition shadow-sm \${btnClass}" title="\${isMelek ? 'Sembunyikan dari User' : 'Tampilkan ke User'}">
                            \${eyeIcon}
                        </button>
                    </td>
                    <td class="p-3 font-mono text-xs text-gray-400">\${p.id}</td>
                    <td class="p-3 text-sm font-medium \${isMelek ? 'text-white' : 'text-gray-500 line-through'} max-w-xs truncate whitespace-normal leading-tight">\${escapeHtmlClient(p.name)}</td>
                    <td class="p-3 text-sm text-yellow-400 font-mono">Rp \${p.price.toLocaleString('id-ID')}</td>
                </tr>
                \`;
            }).join('');
        }

        function filterPkgAdmin() {
            const keyword = document.getElementById('searchPkgAdmin').value.toLowerCase();
            const filtered = allAdminPkgs.filter(p => p.name.toLowerCase().includes(keyword) || p.id.toLowerCase().includes(keyword));
            renderAdminPkgs(filtered);
        }

        async function togglePkgVisibility(pkgId, makeVisible) {
            try {
                const res = await fetch('/api/admin/toggle-pkg', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pkgId, visible: makeVisible })
                });
                const data = await res.json();
                if (data.success) {
                    const idx = allAdminPkgs.findIndex(p => p.id === pkgId);
                    if (idx !== -1) {
                        allAdminPkgs[idx].visible = makeVisible;
                        filterPkgAdmin();
                    }
                } else {
                    swalDark.fire('Error', 'Gagal update status paket di database.', 'error');
                }
            } catch(e) {
                swalDark.fire('Error', 'Koneksi error.', 'error');
            }
        }


        // ==========================================
        // FITUR PAGINATION MANAJEMEN PENGGUNA
        // ==========================================
        let currentUserPage = 1;
        const usersPerPage = 50;
        let searchUserTimeout;

        async function loadUsers(page = 1) {
            currentUserPage = page;
            const searchKeyword = document.getElementById('searchUser').value.trim();
            const tbody = document.getElementById('userTableBody');
            const pageInfo = document.getElementById('userPageInfo');
            const btnPrev = document.getElementById('btnPrevUser');
            const btnNext = document.getElementById('btnNextUser');
            const headerTotal = document.getElementById('userTotalHeader');

            tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-cyan-400 animate-pulse">Memuat data pengguna...</td></tr>';
            
            try {
                const res = await fetch('/api/admin/users-list', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ page, limit: usersPerPage, search: searchKeyword })
                });
                const data = await res.json();

                if (data.success) {
                    headerTotal.innerText = \`\u{1F465} Manajemen Pengguna (\${data.total} User)\`;
                    if (data.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500">Tidak ada pengguna ditemukan.</td></tr>';
                    } else {
                        tbody.innerHTML = data.data.map(u => \`
                            <tr class="border-b border-gray-700/50 hover:bg-gray-800/50 transition user-row">
                                <td class="p-4 font-mono text-xs text-gray-400">\${u.email}</td>
                                <td class="p-4 font-medium text-white">\${escapeHtmlClient(u.name)}</td>
                                <td class="p-4 text-green-400 font-mono font-bold cursor-pointer hover:underline hover:text-green-300 transition-colors" onclick="viewUserMutasi('\${u.email}')" title="Klik untuk lihat 10 riwayat mutasi terakhir">Rp \${u.balance.toLocaleString('id-ID')}</td>
                                <td class="p-4">
                                    \${u.is_blocked === 1 
                                        ? '<span class="bg-sky-500/20 text-cyan-400 border border-sky-500/30 text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">Banned</span>' 
                                        : '<span class="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">Aktif</span>'}
                                </td>
                                <td class="p-4 flex gap-2">
                                    <button onclick="actionUser('\${u.email}', 'add_balance')" class="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow">\xB1 Saldo</button>
                                    <button onclick="actionUser('\${u.email}', 'toggle_block')" class="bg-\${u.is_blocked === 1 ? 'green' : 'red'}-600 hover:bg-\${u.is_blocked === 1 ? 'green' : 'red'}-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow">\${u.is_blocked === 1 ? 'Unblock' : 'Block'}</button>
                                    <button onclick="viewInbox('\${u.email}')" class="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition border border-gray-600 shadow">Inbox</button>
                                    <button onclick="searchVPN('\${u.email}')" class="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow">Lihat VPN</button>
                                </td>
                            </tr>
                        \`).join('');
                    }

                    pageInfo.innerText = \`Halaman \${data.page} dari \${data.totalPages || 1}\`;
                    btnPrev.disabled = data.page <= 1;
                    btnNext.disabled = data.page >= data.totalPages;
                } else {
                    tbody.innerHTML = \`<tr><td colspan="5" class="p-8 text-center text-sky-400">Gagal mengambil data.</td></tr>\`;
                }
            } catch (e) {
                tbody.innerHTML = \`<tr><td colspan="5" class="p-8 text-center text-sky-400">Koneksi Error.</td></tr>\`;
            }
        }

        function changeUserPage(direction) {
            loadUsers(currentUserPage + direction);
        }

        function filterUsers() {
            clearTimeout(searchUserTimeout);
            searchUserTimeout = setTimeout(() => {
                loadUsers(1);
            }, 500); // 500ms debounce menghindari spam fetch API ke database
        }

        // Panggil fungsi awal memuat tabel
        loadUsers(1);


        // Fitur Settings
        document.getElementById('settingsForm').addEventListener('submit', async(e) => {
            e.preventDefault();
            
            // Sync interactive UI to hidden input and parse servers array
            let servers = [];
            try {
                servers = getServersFromUI();
                const ids = servers.map(s => s.id);
                if (ids.some(id => !id)) {
                    swalDark.fire('Error', 'ID Server tidak boleh kosong!', 'error');
                    return;
                }
                if (new Set(ids).size !== ids.length) {
                    swalDark.fire('Error', 'ID Server harus unik (tidak boleh ada duplikat)!', 'error');
                    return;
                }
                document.getElementById('setServers').value = JSON.stringify(servers);
            } catch (err) {
                swalDark.fire('Error', 'Gagal memproses daftar server!', 'error');
                return;
            }

            const btn = document.getElementById('btnSaveSettings');
            btn.disabled = true; btn.innerText = 'Menyimpan...';
            try {
                const payload = {
                    payment_tripay: false,
                    payment_violet: false,
                    payment_qris_manual: document.getElementById('setQrisManualActive').value === 'true',
                    payment_shopeepay: document.getElementById('setShopeePayActive') ? document.getElementById('setShopeePayActive').value === 'true' : true,
                    payment_gopay: document.getElementById('setGoPayActive') ? document.getElementById('setGoPayActive').value === 'true' : true,
                    autogopay_api_key: document.getElementById('setAgpApiKey') ? document.getElementById('setAgpApiKey').value.trim() : '',
                    shopeepay_qris_static: document.getElementById('setShopeeQrisStatic') ? document.getElementById('setShopeeQrisStatic').value.trim() : '',
                    gopay_qris_static: document.getElementById('setGopayQrisStatic') ? document.getElementById('setGopayQrisStatic').value.trim() : '',
                    ai_chat_active: document.getElementById('setAiActive').value === 'true',
                    ai_provider: document.getElementById('setAiProvider').value,
                    price_per_day: parseInt(document.getElementById('setPrice').value),
                    script_price_per_day: parseInt(document.getElementById('setLicPrice').value),
                    kmsp_markup: parseInt(document.getElementById('setMarkup').value),
                    telegram_bot_token: document.getElementById('setTgToken').value,
                    telegram_channel_id: document.getElementById('setTgChatId').value,
                    auto_backup_frequency: parseInt(document.getElementById('setBackupFreq').value),
                    maintenance_mode: document.getElementById('setMaintenance').value === 'true',
                    servers: servers
                };
                
                const res = await fetch('/api/admin/settings', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
                if((await res.json()).success) { 
                    await swalDark.fire('Berhasil', 'Konfigurasi Sistem diupdate!', 'success'); 
                    window.location.reload(); 
                }
            } catch(e) { swalDark.fire('Error', 'Terjadi kesalahan saat menyimpan konfigurasi!', 'error'); }
            btn.disabled = false; btn.innerText = 'Simpan Konfigurasi';
        });

        // Fitur Broadcast Inbox
        document.getElementById('adminForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btnSendMsg');
            btn.innerText = 'Mengirim...'; btn.disabled = true;
            try {
                const payload = { targetType: document.getElementById('targetType').value, targetEmail: document.getElementById('targetEmail').value, title: document.getElementById('msgTitle').value, message: document.getElementById('msgBody').value };
                const res = await fetch('/api/admin/send-message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if((await res.json()).success) { 
                    swalDark.fire('Sukses', 'Pesan masuk ke inbox user dan Channel Telegram!', 'success'); 
                    document.getElementById('adminForm').reset();
                    closeBroadcastModal();
                }
            } catch(err) { swalDark.fire('Error', 'Kesalahan sistem', 'error'); }
            btn.innerText = 'Kirim Pesan Sekarang'; btn.disabled = false;
        });

        // Fitur Global Ganti UUID
        document.getElementById('globalUuidForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btnSubmitGu');
            const serverId = document.getElementById('guServer').value;
            const oldUuid = document.getElementById('guOldUuid').value.trim();
            let newUuid = document.getElementById('guNewUuid').value.trim();
            
            if (!newUuid) {
                newUuid = crypto.randomUUID();
            }

            btn.innerText = 'Mengeksekusi...'; btn.disabled = true;
            try {
                const payload = { serverId, oldUuid, newUuid };
                const res = await fetch('/api/admin/global-change-uuid', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const data = await res.json();
                
                if (data.success) { 
                    await swalDark.fire({
                        title: 'Sukses Ganti UUID',
                        html: \`<p class="mb-3 text-sm text-gray-300">Proses ganti UUID untuk akun di VPS berhasil dieksekusi.</p><div class="bg-gray-950 p-4 rounded-xl overflow-x-auto text-left border border-gray-800 shadow-inner"><pre class="text-green-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text">\${data.resultText}</pre></div>\`,
                        icon: 'success',
                        width: '600px'
                    });
                    document.getElementById('globalUuidForm').reset();
                    closeGlobalUuidModal();
                } else {
                    swalDark.fire('Server API Error', data.message, 'error');
                }
            } catch(err) { 
                swalDark.fire('Error', 'Kesalahan sistem saat menghubungi backend.', 'error'); 
            }
            btn.innerText = 'Eksekusi Ganti UUID'; btn.disabled = false;
        });
        
        // Fitur Global Delete VPN
        document.getElementById('globalDeleteForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btnSubmitGd');
            const serverId = document.getElementById('gdServer').value;
            const username = document.getElementById('gdUsername').value.trim();
            
            const conf = await swalDark.fire({ title: 'Yakin Hapus Global?', text: 'Akun ' + username + ' akan dihapus dari VPS dan Database secara permanen.', icon: 'warning', showCancelButton: true });
            if (!conf.isConfirmed) return;

            btn.innerText = 'Mengeksekusi...'; btn.disabled = true;
            try {
                const payload = { serverId, username };
                const res = await fetch('/api/admin/global-delete-vpn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const data = await res.json();
                
                if (data.success) { 
                    await swalDark.fire({
                        title: 'Eksekusi Selesai',
                        html: \`<p class="mb-3 text-sm text-gray-300">Proses hapus akun berhasil dieksekusi di background VPS dan Database.</p><div class="bg-gray-950 p-4 rounded-xl overflow-x-auto text-left border border-gray-800 shadow-inner"><pre class="text-green-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text">\${data.resultText}</pre></div>\`,
                        icon: 'success',
                        width: '600px'
                    });
                    document.getElementById('globalDeleteForm').reset();
                    closeGlobalDeleteModal();
                    // Coba perbarui pencarian tabel VPN jika kata kunci sama
                    const currentSearch = document.getElementById('searchVpnKeyword').value.trim();
                    if (currentSearch) searchVPN(currentSearch);
                } else {
                    swalDark.fire('Error', data.message, 'error');
                }
            } catch(err) { 
                swalDark.fire('Error', 'Kesalahan sistem saat menghubungi backend.', 'error'); 
            }
            btn.innerText = 'Eksekusi Delete'; btn.disabled = false;
        });

        // Fitur Live Server Explorer
        // Fungsi asinkron untuk detail akun yang bisa dipanggil dari link dynamic HTML
        async function checkAccountDetail(username, protocol) {
            document.getElementById('leUsername').value = username;
            if (protocol) {
                document.getElementById('leProtocol').value = protocol.toLowerCase();
            }
            await fetchLiveDetail();
        }

        async function fetchLiveList() {
            const btn = document.getElementById('btnFetchList');
            const resultBox = document.getElementById('leListResult');
            const serverId = document.getElementById('leServer').value;
            const protocol = document.getElementById('leProtocol').value;

            const oldText = btn.innerHTML;
            btn.innerHTML = '\u26A1 Menarik Data...'; btn.disabled = true;
            
            // Build tasks
            const serversToScan = serverId === 'all' 
                ? leActiveServers 
                : leActiveServers.filter(s => s.id === serverId);
            const protocolsToScan = protocol === 'all' 
                ? ['vmess', 'vless', 'trojan', 'ssh', 'l2tp'] 
                : [protocol];
                
            const tasks = [];
            for (const s of serversToScan) {
                for (const p of protocolsToScan) {
                    tasks.push({ server: s, protocol: p });
                }
            }
            
            if (tasks.length === 0) {
                resultBox.innerHTML = '<span class="text-cyan-400 font-semibold">Error: Tidak ada server atau protokol yang terpilih.</span>';
                btn.innerHTML = oldText; btn.disabled = false;
                return;
            }

            resultBox.innerHTML = \`
                <div class="space-y-2.5 flex-grow flex flex-col min-h-0 text-slate-300">
                    <div class="bg-gray-900/40 p-2 rounded-xl border border-gray-900 text-[10px] space-y-1.5 shrink-0">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-cyan-400 flex items-center gap-1.5">
                                <span class="relative flex h-1.5 w-1.5">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                                </span>
                                SCANNING VPS REAL-TIME
                            </span>
                            <span id="leListProgressText" class="font-mono text-[9px] text-gray-400">Menghubungi VPS... 0/\${tasks.length} (0%)</span>
                        </div>
                        <div class="w-full bg-gray-950 rounded-full h-1 overflow-hidden border border-gray-900/60">
                            <div id="leListProgressBar" class="bg-cyan-500 h-full w-0 transition-all duration-300"></div>
                        </div>
                    </div>
                    
                    <div class="border border-gray-900 rounded-xl bg-gray-950 overflow-hidden flex flex-col flex-grow min-h-0">
                        <div class="bg-gray-900/30 px-3 py-1.5 border-b border-gray-900/80 flex justify-between items-center text-[10px] text-gray-400 shrink-0 font-bold">
                            <span>DAFTAR AKUN VPS LIVE</span>
                            <span id="leListTotalMatch" class="text-cyan-400">Menemukan: 0 akun</span>
                        </div>
                        <div class="overflow-y-auto flex-grow custom-scrollbar min-h-0">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-gray-900/60 text-gray-300 border-b border-gray-900/65 sticky top-0 z-10 backdrop-blur-sm">
                                    <tr>
                                        <th class="py-2 px-3 text-[10px] font-bold uppercase tracking-wider">Server</th>
                                        <th class="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-center">Proto</th>
                                        <th class="py-2 px-3 text-[10px] font-bold uppercase tracking-wider">Username</th>
                                        <th class="py-2 px-3 text-[10px] font-bold uppercase tracking-wider">Masa Aktif</th>
                                        <th class="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="leListResultsBody" class="divide-y divide-gray-900/40 text-[11px]">
                                    <tr id="leListPlaceholderRow">
                                        <td colspan="5" class="py-8 px-3 text-center text-gray-500 text-xs animate-pulse">
                                            Scanning server... Mohon tunggu.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            \`;
            
            const progressText = document.getElementById('leListProgressText');
            const progressBar = document.getElementById('leListProgressBar');
            const resultsBody = document.getElementById('leListResultsBody');
            const totalMatchText = document.getElementById('leListTotalMatch');
            
            let completed = 0;
            let allAccounts = [];
            
            async function scanOne(task) {
                const { server, protocol } = task;
                try {
                    const res = await fetch('/api/admin/live-explorer/list', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ serverId: server.id, protocol })
                    });
                    if (!res.ok) throw new Error();
                    const data = await res.json();
                    if (data.success) {
                        const parsed = parseAccountsFromHtml(data.resultText, server.id, server.name, protocol);
                        if (parsed.length > 0) {
                            allAccounts = allAccounts.concat(parsed);
                        } else if (data.resultText.trim() && !data.resultText.includes('class=')) {
                            allAccounts.push({
                                username: 'Raw Output (Click to view)',
                                expiry: '-',
                                serverId: server.id,
                                serverName: server.name,
                                protocol: protocol,
                                isRaw: true,
                                rawText: data.resultText
                            });
                        }
                    }
                } catch(e) {} finally {
                    completed++;
                    const percent = Math.round((completed / tasks.length) * 100);
                    progressBar.style.width = percent + '%';
                    progressText.innerText = \`Scanning: \${completed}/\${tasks.length} (\${percent}%)\`;
                }
            }
            
            await Promise.all(tasks.map(t => scanOne(t)));
            
            const placeholder = document.getElementById('leListPlaceholderRow');
            if (placeholder) placeholder.remove();
            
            if (allAccounts.length === 0) {
                resultsBody.innerHTML = \`
                    <tr>
                        <td colspan="5" class="py-8 px-3 text-center text-gray-500">
                            Tidak ada akun ditemukan di server target.
                        </td>
                    </tr>
                \`;
                totalMatchText.innerText = 'Menemukan: 0 akun';
            } else {
                totalMatchText.innerText = \`Menemukan: \${allAccounts.length} akun\`;
                allAccounts.sort((a, b) => a.username.localeCompare(b.username));
                
                allAccounts.forEach(acc => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-gray-900/30 border-b border-gray-900/20 transition last:border-0';
                    
                    let userDisplay = '';
                    if (acc.isRaw) {
                        userDisplay = \`<span onclick="showRawOutput('\${escapeHtmlClient(acc.rawText)}')" class="text-yellow-500 hover:underline cursor-pointer font-mono font-semibold">\${escapeHtmlClient(acc.username)}</span>\`;
                    } else {
                        userDisplay = \`<span onclick="checkAccountDetailGlobal('\${escapeHtmlClient(acc.username)}', '\${acc.protocol}', '\${acc.serverId}')" class="text-cyan-400 hover:text-cyan-300 font-mono font-semibold cursor-pointer hover:underline select-all">\${escapeHtmlClient(acc.username)}</span>\`;
                    }
                    
                    let expiryBadgeClass = 'text-gray-400';
                    const expLower = acc.expiry.toLowerCase();
                    if (expLower.includes('aktif') || expLower.includes('days') || expLower.includes('hari') || expLower.includes('lifetime')) {
                        expiryBadgeClass = 'text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold';
                    } else if (expLower.includes('expired') || expLower.includes('mati') || expLower.includes('telah habis')) {
                        expiryBadgeClass = 'text-cyan-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold';
                    }
                    
                    tr.innerHTML = \`
                        <td class="py-2 px-3 font-semibold text-slate-300 max-w-[120px] truncate">\${escapeHtmlClient(acc.serverName)}</td>
                        <td class="py-2 px-3 text-center">
                            <span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border \${getProtocolBadgeStyle(acc.protocol)}">\${acc.protocol}</span>
                        </td>
                        <td class="py-2 px-3">\${userDisplay}</td>
                        <td class="py-2 px-3 font-mono text-[10px]"><span class="\${expiryBadgeClass}">\${escapeHtmlClient(acc.expiry)}</span></td>
                        <td class="py-2 px-3 text-center">
                            <div class="inline-flex gap-1.5">
                                <button onclick="checkAccountDetailGlobal('\${escapeHtmlClient(acc.username)}', '\${acc.protocol}', '\${acc.serverId}')" class="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 p-1 rounded transition text-[10px] flex items-center justify-center w-6 h-6 border border-cyan-500/10" title="Cek Detail">\u{1F50D}</button>
                                <button onclick="renewAccountDirect('\${escapeHtmlClient(acc.username)}', '\${acc.protocol}', '\${acc.serverId}')" class="bg-green-600/20 hover:bg-green-600/40 text-green-400 p-1 rounded transition text-[10px] flex items-center justify-center w-6 h-6 border border-green-500/10" title="Perpanjang">\u{1F504}</button>
                                <button onclick="deleteAccountDirect('\${escapeHtmlClient(acc.username)}', '\${acc.protocol}', '\${acc.serverId}')" class="bg-sky-600/20 hover:bg-sky-600/40 text-cyan-400 p-1 rounded transition text-[10px] flex items-center justify-center w-6 h-6 border border-sky-500/10" title="Hapus">\u{1F5D1}\uFE0F</button>
                            </div>
                        </td>
                    \`;
                    resultsBody.appendChild(tr);
                });
            }
            
            btn.innerHTML = oldText; btn.disabled = false;
        }

        async function fetchLiveDetail() {
            const btn = document.getElementById('btnFetchDetail');
            const resultBox = document.getElementById('leDetailResult');
            const serverId = document.getElementById('leServer').value;
            const protocol = document.getElementById('leProtocol').value;
            const username = document.getElementById('leUsername').value.trim();

            if (!username) return swalDark.fire('Perhatian', 'Kolom Username tidak boleh kosong!', 'warning');
            
            if (serverId === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu VPS spesifik terlebih dahulu untuk melihat detail config!', 'warning');
            }
            if (protocol === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu Protokol spesifik terlebih dahulu untuk melihat detail config!', 'warning');
            }

            btn.innerText = 'Cek...'; btn.disabled = true;
            resultBox.innerHTML = '<span class="text-yellow-400 animate-pulse">Menghubungi VPS...</span>';

            try {
                const res = await fetch('/api/admin/live-explorer/detail', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ serverId, protocol, username })
                });
                const data = await res.json();
                if (data.success) {
                    if (data.resultText.trim().startsWith('<') || data.resultText.includes('class=')) {
                        resultBox.innerHTML = data.resultText;
                    } else {
                        resultBox.innerHTML = '<pre class="text-green-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">' + escapeHtmlClient(data.resultText) + '</pre>';
                    }
                    document.getElementById('leLinkUserPanel').classList.remove('hidden');
                } else {
                    resultBox.innerHTML = '<span class="text-cyan-400">Error: ' + escapeHtmlClient(data.message) + '</span>';
                    document.getElementById('leLinkUserPanel').classList.add('hidden');
                }
            } catch(e) {
                resultBox.innerHTML = '<span class="text-cyan-400">Koneksi Error.</span>';
                document.getElementById('leLinkUserPanel').classList.add('hidden');
            }
            btn.innerText = 'Cek Detail'; btn.disabled = false;
        }

        async function linkLiveAccountToUser() {
            const serverId = document.getElementById('leServer').value;
            const protocol = document.getElementById('leProtocol').value;
            const username = document.getElementById('leUsername').value.trim();
            const email = document.getElementById('linkUserEmail').value.trim();

            if (!username) return swalDark.fire('Perhatian', 'Username VPN tidak ditemukan!', 'warning');
            if (!email) return swalDark.fire('Perhatian', 'Kolom Email User tidak boleh kosong!', 'warning');
            
            if (serverId === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu VPS spesifik terlebih dahulu!', 'warning');
            }
            if (protocol === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu Protokol spesifik terlebih dahulu!', 'warning');
            }

            const btn = document.getElementById('btnLinkLiveUser');
            const oldText = btn.innerText;
            btn.innerText = 'Menghubungkan...'; btn.disabled = true;

            try {
                const res = await fetch('/api/admin/live-explorer/link-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ serverId, protocol, username, email })
                });
                const data = await res.json();
                if (data.success) {
                    await swalDark.fire('Berhasil', data.message || 'Akun berhasil dihubungkan ke user website!', 'success');
                    document.getElementById('linkUserEmail').value = '';
                } else {
                    await swalDark.fire('Gagal', data.message || 'Terjadi kesalahan.', 'error');
                }
            } catch(e) {
                await swalDark.fire('Gagal', 'Terjadi kesalahan koneksi.', 'error');
            } finally {
                btn.innerText = oldText; btn.disabled = false;
            }
        }

        async function deleteLiveAccount() {
            const serverId = document.getElementById('leServer').value;
            const serverSelect = document.getElementById('leServer');
            const serverName = serverSelect.options[serverSelect.selectedIndex].text;
            const protocol = document.getElementById('leProtocol').value;
            const username = document.getElementById('leUsername').value.trim();

            if (!username) {
                return swalDark.fire('Perhatian', 'Kolom Username tidak boleh kosong!', 'warning');
            }
            
            if (serverId === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu VPS spesifik terlebih dahulu!', 'warning');
            }
            if (protocol === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu Protokol spesifik terlebih dahulu!', 'warning');
            }

            const confirmResult = await swalDark.fire({
                title: 'Hapus Akun?',
                text: \`Apakah Anda yakin ingin menghapus akun "\${username}" di server "\${serverName}" (\${protocol.toUpperCase()}) secara permanen dari database dan VPS?\`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#ef4444'
            });

            if (!confirmResult.isConfirmed) return;

            const btn = document.getElementById('btnDeleteLive');
            const oldText = btn.innerText;
            btn.innerText = 'Menghapus...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/admin/live-explorer/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ serverId, protocol, username })
                });
                const data = await res.json();
                if (data.success) {
                    await swalDark.fire('Berhasil', 'Akun "' + username + '" berhasil dihapus.', 'success');
                    document.getElementById('leUsername').value = '';
                    document.getElementById('leDetailResult').innerHTML = 'Menunggu instruksi...';
                    document.getElementById('leLinkUserPanel').classList.add('hidden');
                    await fetchLiveList();
                } else {
                    await swalDark.fire('Gagal', data.message || 'Terjadi kesalahan saat menghapus.', 'error');
                }
            } catch (e) {
                await swalDark.fire('Error', 'Koneksi ke API Server gagal.', 'error');
            } finally {
                btn.innerText = oldText;
                btn.disabled = false;
            }
        }

        async function renewLiveAccount() {
            const serverId = document.getElementById('leServer').value;
            const serverSelect = document.getElementById('leServer');
            const serverName = serverSelect.options[serverSelect.selectedIndex].text;
            const protocol = document.getElementById('leProtocol').value;
            const username = document.getElementById('leUsername').value.trim();

            if (!username) {
                return swalDark.fire('Perhatian', 'Kolom Username tidak boleh kosong!', 'warning');
            }
            
            if (serverId === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu VPS spesifik terlebih dahulu!', 'warning');
            }
            if (protocol === 'all') {
                return swalDark.fire('Perhatian', 'Pilih salah satu Protokol spesifik terlebih dahulu!', 'warning');
            }

            const { value: days } = await swalDark.fire({
                title: 'Perpanjang Akun Live',
                text: \`Masukkan jumlah hari tambahan untuk akun "\${username}" di server "\${serverName}" (\${protocol.toUpperCase()}):\`,
                input: 'number',
                inputPlaceholder: 'Jumlah Hari (contoh: 30)',
                inputValue: '30',
                showCancelButton: true,
                confirmButtonText: 'Perpanjang Sekarang',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#22c55e',
                inputValidator: (value) => {
                    if (!value || isNaN(parseInt(value)) || parseInt(value) <= 0) {
                        return 'Masukkan jumlah hari yang valid (minimal 1 hari)!';
                    }
                }
            });

            if (!days) return;

            const btn = document.getElementById('btnRenewLive');
            const oldText = btn.innerText;
            btn.innerText = 'Memproses...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/admin/live-explorer/renew', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ serverId, protocol, username, duration: parseInt(days) })
                });
                const data = await res.json();
                if (data.success) {
                    await swalDark.fire('Berhasil', \`Akun "\${username}" berhasil diperpanjang sebanyak \${days} Hari.<br><br><pre class="text-green-400 font-mono text-[10px] whitespace-pre-wrap text-left bg-gray-950 p-2 rounded">\${data.resultText || ''}</pre>\`, 'success');
                    await fetchLiveDetail();
                } else {
                    await swalDark.fire('Gagal', data.message || 'Terjadi kesalahan saat memperpanjang.', 'error');
                }
            } catch (e) {
                await swalDark.fire('Error', 'Koneksi ke API Server gagal.', 'error');
            } finally {
                btn.innerText = oldText;
                btn.disabled = false;
            }
        }

        async function checkAccountDetailGlobal(username, protocol, serverId) {
            if (serverId) {
                document.getElementById('leServer').value = serverId;
            }
            if (protocol) {
                document.getElementById('leProtocol').value = protocol.toLowerCase();
            }
            document.getElementById('leUsername').value = username;
            await fetchLiveDetail();
        }

        function parseAccountsFromHtml(htmlText, serverId, serverName, protocol) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const spans = doc.querySelectorAll('span[onclick^="checkAccountDetail"]');
            const accounts = [];
            
            spans.forEach(span => {
                const username = span.textContent.trim();
                const card = span.closest('.rounded-xl') || span.parentElement;
                const expSpan = card ? card.querySelector('.font-mono') : null;
                const expText = expSpan ? expSpan.textContent.trim() : 'Lifetime';
                
                let actualProtocol = protocol;
                const onclickAttr = span.getAttribute('onclick') || '';
                const protoMatch = onclickAttr.match(/checkAccountDetail([^,]+,s*'([^']+)')/);
                if (protoMatch && protoMatch[1]) {
                    actualProtocol = protoMatch[1].toLowerCase();
                }
                
                accounts.push({
                    username,
                    expiry: expText,
                    serverId,
                    serverName,
                    protocol: actualProtocol
                });
            });
            
            return accounts;
        }

        async function renewAccountDirect(username, protocol, serverId) {
            document.getElementById('leServer').value = serverId;
            document.getElementById('leProtocol').value = protocol;
            document.getElementById('leUsername').value = username;
            await renewLiveAccount();
        }

        async function deleteAccountDirect(username, protocol, serverId) {
            document.getElementById('leServer').value = serverId;
            document.getElementById('leProtocol').value = protocol;
            document.getElementById('leUsername').value = username;
            await deleteLiveAccount();
        }

        function showRawOutput(text) {
            swalDark.fire({
                title: 'Raw Output VPS',
                html: \`<pre class="text-slate-300 font-mono text-[10px] leading-tight select-text text-left whitespace-pre-wrap bg-gray-950 p-2.5 rounded border border-gray-900/80 max-h-[60vh] overflow-y-auto custom-scrollbar">\${escapeHtmlClient(text)}</pre>\`,
                width: '600px',
                confirmButtonColor: '#06b6d4',
                confirmButtonText: 'Tutup'
            });
        }

        async function startLiveGlobalSearch() {
            const query = document.getElementById('leGlobalSearchQuery').value.trim();
            if (!query) {
                return swalDark.fire('Perhatian', 'Masukkan kata kunci pencarian terlebih dahulu!', 'warning');
            }

            const btn = document.getElementById('btnGlobalSearch');
            const resultBox = document.getElementById('leListResult');
            
            const oldBtnText = btn.innerHTML;
            btn.innerHTML = '\u26A1 Mencari...';
            btn.disabled = true;

            resultBox.innerHTML = \`
                <div class="space-y-2 select-text text-slate-300">
                    <div class="bg-gray-900/40 p-2 rounded border border-gray-800/80 text-[10px] space-y-1.5 shrink-0">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-cyan-400 flex items-center gap-1.5">
                                <span class="relative flex h-1.5 w-1.5">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                                </span>
                                SCANNING VPS REAL-TIME
                            </span>
                            <span id="leSearchProgressText" class="font-mono text-[9px] text-gray-400">Menghubungi VPS... 0%</span>
                        </div>
                        <div class="w-full bg-gray-950 rounded-full h-1 overflow-hidden border border-gray-900/60">
                            <div id="leSearchProgressBar" class="bg-cyan-500 h-full w-0 transition-all duration-300"></div>
                        </div>
                        <div id="leSearchProgressLogs" class="max-h-[70px] overflow-y-auto text-[9.5px] font-mono text-gray-500 leading-tight space-y-0.5 custom-scrollbar border-t border-gray-900/30 pt-1.5">
                            <div class="text-cyan-500/80">Memulai pencarian kata kunci "\${escapeHtmlClient(query)}"...</div>
                        </div>
                    </div>

                    <!-- Hasil Pencarian -->
                    <div class="border border-gray-900/60 rounded bg-gray-950 overflow-hidden flex flex-col flex-grow min-h-0">
                        <div class="bg-gray-900/30 px-2 py-1 border-b border-gray-900/60 flex justify-between items-center text-[10px] text-gray-400 shrink-0 font-bold">
                            <span>HASIL PENCARIAN GLOBAL</span>
                            <span id="leSearchTotalMatch" class="text-cyan-400">Menemukan: 0 akun</span>
                        </div>
                        <div class="overflow-y-auto max-h-[50vh] custom-scrollbar">
                            <table class="w-full text-left border-collapse">
                                <thead class="bg-gray-900/60 text-gray-300 border-b border-gray-800/80 sticky top-0 z-10 backdrop-blur-sm">
                                    <tr>
                                        <th class="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider w-1/4">Server</th>
                                        <th class="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider w-24 text-center">Protocol</th>
                                        <th class="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider">Username</th>
                                        <th class="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider w-1/3">Masa Aktif</th>
                                    </tr>
                                </thead>
                                <tbody id="leGlobalSearchResultsBody" class="divide-y divide-gray-900/50 text-[13px]">
                                    <tr id="leSearchPlaceholderRow">
                                        <td colspan="4" class="py-12 px-4 text-center text-gray-400 text-xs animate-pulse">
                                            <i class="fas fa-spinner fa-spin mr-2"></i>Scanning server... Mohon tunggu.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            \`;

            const progressText = document.getElementById('leSearchProgressText');
            const progressBar = document.getElementById('leSearchProgressBar');
            const progressLogs = document.getElementById('leSearchProgressLogs');
            const resultsBody = document.getElementById('leGlobalSearchResultsBody');
            const totalMatchText = document.getElementById('leSearchTotalMatch');

            function addLog(message, type = 'info') {
                const div = document.createElement('div');
                if (type === 'success') div.className = 'text-green-400';
                else if (type === 'error') div.className = 'text-cyan-400';
                else if (type === 'warn') div.className = 'text-yellow-500';
                else div.className = 'text-gray-400';
                
                div.innerHTML = \`[\${new Date().toLocaleTimeString('id-ID')}] \${message}\`;
                progressLogs.appendChild(div);
                progressLogs.scrollTop = progressLogs.scrollHeight;
            }

            const servers = typeof leActiveServers !== 'undefined' ? leActiveServers : [];
            const protocols = ['vmess', 'vless', 'trojan', 'ssh', 'l2tp'];
            
            if (servers.length === 0) {
                addLog('Error: Tidak ada server yang terkonfigurasi.', 'error');
                resultsBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-cyan-400">Tidak ada server terkonfigurasi.</td></tr>';
                btn.innerHTML = oldBtnText;
                btn.disabled = false;
                return;
            }

            const tasks = [];
            for (const s of servers) {
                for (const p of protocols) {
                    tasks.push({ server: s, protocol: p });
                }
            }

            let completedTasks = 0;
            let totalMatched = 0;

            const totalTasks = tasks.length;
            progressText.innerText = \`Menghubungi VPS... 0/\${totalTasks} (0%)\`;

            async function executeTask(task) {
                const { server, protocol } = task;
                const taskLabel = \`\${server.name} [\${protocol.toUpperCase()}]\`;
                
                try {
                    const res = await fetch('/api/admin/live-explorer/list', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ serverId: server.id, protocol })
                    });
                    
                    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
                    
                    const data = await res.json();
                    if (data.success) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data.resultText, 'text/html');
                        const spans = doc.querySelectorAll('span[onclick^="checkAccountDetail"]');
                        
                        let matchInTask = 0;
                        spans.forEach(span => {
                            const username = span.textContent.trim();
                            if (username.toLowerCase().includes(query.toLowerCase())) {
                                const card = span.closest('.rounded-xl');
                                const expSpan = card ? card.querySelector('.font-mono') : null;
                                const expText = expSpan ? expSpan.textContent.trim() : 'Lifetime';
                                const badgeClass = expSpan ? expSpan.className : '';
                                
                                const placeholder = document.getElementById('leSearchPlaceholderRow');
                                if (placeholder) placeholder.remove();
                                
                                const tr = document.createElement('tr');
                                tr.className = 'hover:bg-gray-900/30 border-b border-gray-900/20 transition last:border-0';
                                
                                // Ganti text-[11px] pada badgeClass asal dengan text-[12px] agar lebih besar dan jelas
                                let finalBadgeClass = badgeClass.replace('text-[11px]', 'text-[12px]');
                                if (!finalBadgeClass.includes('text-')) {
                                    finalBadgeClass += ' text-[12px]';
                                }
                                
                                tr.innerHTML = \`
                                    <td class="py-3.5 px-4 font-semibold text-slate-200 max-w-[150px] truncate">\${escapeHtmlClient(server.name)}</td>
                                    <td class="py-3.5 px-4 text-center">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border \${getProtocolBadgeStyle(protocol)}">\${protocol}</span>
                                    </td>
                                    <td class="py-3.5 px-4">
                                        <span onclick="checkAccountDetailGlobal('\${escapeHtmlClient(username)}', '\${protocol}', '\${server.id}')" 
                                              class="text-cyan-400 hover:text-cyan-300 font-mono font-semibold cursor-pointer transition hover:underline select-all">\${escapeHtmlClient(username)}</span>
                                    </td>
                                    <td class="py-3.5 px-4 font-mono">
                                        <span class="\${finalBadgeClass}">\${escapeHtmlClient(expText)}</span>
                                    </td>
                                \`;
                                resultsBody.appendChild(tr);
                                matchInTask++;
                                totalMatched++;
                            }
                        });
                        
                        if (matchInTask > 0) {
                            addLog(\`\u2705 \${taskLabel}: Ditemukan \${matchInTask} akun\`, 'success');
                            totalMatchText.innerText = \`Menemukan: \${totalMatched} akun\`;
                        } else {
                            addLog(\`\u2022 \${taskLabel}: Selesai (Tidak ada kecocokan)\`, 'info');
                        }
                    } else {
                        addLog(\`\u26A0\uFE0F \${taskLabel}: \${data.message || 'Gagal menarik data'}\`, 'warn');
                    }
                } catch (err) {
                    addLog(\`\u274C \${taskLabel} Error: \${err.message}\`, 'error');
                } finally {
                    completedTasks++;
                    const percent = Math.round((completedTasks / totalTasks) * 100);
                    progressText.innerText = \`Scanning: \${completedTasks}/\${totalTasks} (\${percent}%)\`;
                    progressBar.style.width = \`\${percent}%\`;
                }
            }

            const concurrencyLimit = 5;
            const pool = [];
            
            for (let i = 0; i < tasks.length; i++) {
                if (pool.length >= concurrencyLimit) {
                    await Promise.race(pool);
                }
                const p = executeTask(tasks[i]).then(() => {
                    pool.splice(pool.indexOf(p), 1);
                });
                pool.push(p);
            }
            await Promise.all(pool);

            addLog(\`\u{1F389} Pemindaian selesai! Total menemukan \${totalMatched} akun.\`, 'success');
            btn.innerHTML = oldBtnText;
            btn.disabled = false;

            if (totalMatched === 0) {
                resultsBody.innerHTML = \`
                    <tr>
                        <td colspan="4" class="p-8 text-center text-gray-500 text-[10px]">
                            \u274C Tidak ditemukan akun dengan kata kunci "\${escapeHtmlClient(query)}" di semua VPS.
                        </td>
                    </tr>
                \`;
            }
        }

        function getProtocolBadgeStyle(protocol) {
            switch(protocol) {
                case 'vmess': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                case 'vless': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
                case 'trojan': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
                case 'ssh': return 'bg-green-500/10 text-green-400 border-green-500/20';
                case 'l2tp': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            }
        }

        async function actionUser(email, action) {
            let value = 0;
            let keterangan = '';
            if (action === 'add_balance') {
                const { value: formValues } = await swalDark.fire({
                    title: 'Update Saldo',
                    html: \`
                        <div class="text-left space-y-4 mt-2">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">Nominal (Gunakan minus untuk kurangi)</label>
                                <input id="swal-input1" type="number" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none font-mono" placeholder="0">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1 uppercase">Keterangan (Opsional)</label>
                                <input id="swal-input2" type="text" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none text-sm" placeholder="Contoh: Bonus event, koreksi mutasi...">
                            </div>
                        </div>
                    \`,
                    focusConfirm: false,
                    showCancelButton: true,
                    preConfirm: () => {
                        return {
                            nominal: document.getElementById('swal-input1').value,
                            ket: document.getElementById('swal-input2').value
                        }
                    }
                });
                if (!formValues) return;
                value = parseInt(formValues.nominal);
                keterangan = formValues.ket ? formValues.ket.trim() : '';
                
                if (isNaN(value) || value === 0) return swalDark.fire('Error', 'Nominal tidak valid!', 'error');
            } else if (action === 'toggle_block') {
                const conf = await swalDark.fire({ title: 'Konfirmasi', text: 'Ubah status blokir untuk ' + email + '?', icon: 'warning', showCancelButton: true });
                if (!conf.isConfirmed) return;
            }
            try {
                const res = await fetch('/api/admin/user-action', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, action, value, keterangan }) });
                if ((await res.json()).success) {
                    await swalDark.fire('Berhasil', 'Aksi pada pengguna sukses dilakukan.', 'success');
                    // Render ulang table tanpa harus refresh full page
                    loadUsers(currentUserPage);
                }
            } catch(e) { swalDark.fire('Error', 'Sistem error', 'error'); }
        }

        async function viewInbox(email) {
            document.getElementById('inboxModal').classList.remove('hidden');
            document.getElementById('inboxModalTitle').innerText = 'Inbox: ' + email;
            document.getElementById('inboxModalContent').innerHTML = '<p class="text-gray-500 text-center py-10 font-medium">Memuat pesan...</p>';
            try {
                const res = await fetch('/api/admin/user-inbox', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                const data = await res.json();
                if (data.success) {
                    if (data.inbox.length === 0) {
                        document.getElementById('inboxModalContent').innerHTML = '<p class="text-gray-500 text-center py-10 font-medium">Inbox kosong.</p>';
                    } else {
                        document.getElementById('inboxModalContent').innerHTML = data.inbox.map(msg => \`
                            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700">
                                <div class="flex justify-between items-start mb-3 border-b border-gray-700 pb-3">
                                    <h4 class="text-cyan-400 font-bold text-base">\${msg.title}</h4>
                                    <span class="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded">\${msg.date}</span>
                                </div>
                                <div class="text-gray-300 text-sm leading-relaxed">\${msg.message}</div>
                            </div>
                        \`).join('');
                    }
                }
            } catch(e) { document.getElementById('inboxModalContent').innerHTML = '<p class="text-cyan-400 text-center py-10">Gagal memuat inbox.</p>'; }
        }

        async function viewUserMutasi(email) {
            document.getElementById('mutasiUserModal').classList.remove('hidden');
            document.getElementById('mutasiUserModalTitle').innerText = '\u{1F4B3} Histori Saldo: ' + email;
            const tbody = document.getElementById('mutasiUserTableBody');
            tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-green-400 animate-pulse">Memuat riwayat transaksi...</td></tr>';
            
            try {
                const res = await fetch('/api/admin/user-transactions', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ email }) 
                });
                const data = await res.json();
                
                if (data.success) {
                    if (data.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-500">Belum ada riwayat transaksi.</td></tr>';
                    } else {
                        tbody.innerHTML = data.data.map(trx => {
                            const isMasuk = trx.type === 'IN';
                            const nominalClass = isMasuk ? 'text-green-400' : 'text-cyan-400';
                            const sign = isMasuk ? '+' : '-';
                            
                            let sisaSaldoText = '-';
                            if (trx.balance !== undefined && trx.balance !== null) {
                                sisaSaldoText = 'Rp ' + trx.balance.toLocaleString('id-ID');
                            }
                            
                            const dateParts = trx.created_at ? trx.created_at.split(', ') : ['', ''];
                            const dateHtml = dateParts[1] ? \`\${dateParts[0]}<br>\${dateParts[1]}\` : (trx.created_at || '-');
                            
                            return \`
                            <tr class="hover:bg-gray-800/50 transition border-b border-gray-800 last:border-0">
                                <td class="p-4 font-mono text-xs text-gray-500">\${dateHtml}</td>
                                <td class="p-4 text-white font-medium max-w-xs truncate whitespace-normal leading-snug text-[11px]" style="font-family: 'Arial Narrow', Arial, sans-serif;">\${escapeHtmlClient(trx.description)}</td>
                                <td class="p-4 font-mono font-bold text-right \${nominalClass}">\${sign} Rp \${trx.amount.toLocaleString('id-ID')}</td>
                                <td class="p-4 font-mono font-bold text-right text-gray-300">\${sisaSaldoText}</td>
                            </tr>\`;
                        }).join('');
                    }
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-sky-400">Gagal memuat histori.</td></tr>';
                }
            } catch (e) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-sky-400">Error koneksi internet.</td></tr>';
            }
        }

        // ==========================================
        // PENCARIAN & MANAJEMEN VPN
        // ==========================================
        async function searchVPN(forceKeyword = null) {
            const inputEl = document.getElementById('searchVpnKeyword');
            if (forceKeyword) {
                inputEl.value = forceKeyword;
                document.getElementById('vpnManagement').scrollIntoView({ behavior: 'smooth' });
                // Membuka otomatis form pencarian jika sedang tertutup (hidden)
                document.getElementById('sectionVpn').classList.remove('hidden');
                document.getElementById('iconVpn').classList.add('rotate-180');
            }
            
            const keyword = inputEl.value.trim();
            const btn = document.getElementById('btnSearchVpn');
            const tbody = document.getElementById('vpnTableBody');
            
            if (!keyword) return swalDark.fire('Perhatian', 'Ketikkan email atau username VPN untuk mencari.', 'warning');

            btn.innerText = 'Mencari...'; btn.disabled = true;
            tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-cyan-400 animate-pulse">Sedang mencari data...</td></tr>';

            try {
                const res = await fetch('/api/admin/vpn-search', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ keyword }) });
                const data = await res.json();
                
                if (data.success) {
                    if (data.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-500">Tidak ada data VPN yang cocok dengan pencarian.</td></tr>';
                    } else {
                        tbody.innerHTML = data.data.map(v => {
                            // Validasi Protokol untuk memunculkan atau menyembunyikan Tombol Ganti UUID
                            const isXray = v.protocol.toLowerCase().includes('trojan') || v.protocol.toLowerCase().includes('vmess') || v.protocol.toLowerCase().includes('vless');
                            const btnChangeUuid = isXray ? \`<button onclick="actionVPN('\${v.id}', 'change_uuid')" class="bg-pink-700 hover:bg-pink-600 text-white text-[10px] px-2.5 py-1.5 rounded uppercase font-bold transition shadow" title="Ganti UUID (Acak/Kustom)">Ganti UUID</button>\` : '';

                            return \`
                                <tr class="border-b border-gray-800 hover:bg-gray-800/50 transition">
                                    <td class="p-4 text-xs font-mono text-gray-400">\${v.email}</td>
                                    <td class="p-4 font-bold text-cyan-400 font-mono">\${v.username}</td>
                                    <td class="p-4 text-xs"><span class="block text-gray-300 font-bold">\${v.protocol}</span><span class="text-gray-500">\${v.server}</span></td>
                                    <td class="p-4 text-xs font-mono text-yellow-400">\${v.exp}</td>
                                    <td class="p-4 flex gap-2 flex-wrap">
                                        <button onclick="actionVPN('\${v.id}', 'detail')" class="bg-gray-700 hover:bg-gray-600 text-white text-[10px] px-2.5 py-1.5 rounded uppercase font-bold transition shadow">Detail</button>
                                        <button onclick="actionVPN('\${v.id}', 'renew')" class="bg-sky-700 hover:bg-sky-600 text-white text-[10px] px-2.5 py-1.5 rounded uppercase font-bold transition shadow">Perpanjang</button>
                                        \${btnChangeUuid}
                                        <button onclick="actionVPN('\${v.id}', 'lock')" class="bg-yellow-700 hover:bg-yellow-600 text-white text-[10px] px-2.5 py-1.5 rounded uppercase font-bold transition shadow">Lock</button>
                                        <button onclick="actionVPN('\${v.id}', 'unlock')" class="bg-green-700 hover:bg-green-600 text-white text-[10px] px-2.5 py-1.5 rounded uppercase font-bold transition shadow">Unlock</button>
                                        <button onclick="actionVPN('\${v.id}', 'delete')" class="bg-sky-700 hover:bg-sky-600 text-white text-[10px] px-2.5 py-1.5 rounded uppercase font-bold transition shadow">Hapus</button>
                                    </td>
                                </tr>
                            \`;
                        }).join('');
                    }
                } else {
                    tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Gagal mengambil data.</td></tr>';
                }
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-sky-400">Koneksi Error.</td></tr>';
            }
            btn.innerText = 'Cari VPN'; btn.disabled = false;
        }

        async function actionVPN(vpnId, actionType) {
            let confirmText = '';
            let extraData = null;

            if (actionType === 'delete') confirmText = "Anda yakin ingin MENGHAPUS VPN ini dari Server VPS dan Database? Aksi ini permanen!";
            else if (actionType === 'lock') confirmText = "Lock/Suspend akun ini di VPS?";
            else if (actionType === 'unlock') confirmText = "Unlock/Unsuspend akun ini di VPS?";
            
            if (actionType === 'renew') {
                const { value: days, isDismissed } = await swalDark.fire({
                    title: 'Perpanjang VPN',
                    input: 'number',
                    inputLabel: 'Masukkan jumlah hari perpanjangan:',
                    inputValue: '30',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        if (!value || isNaN(value) || parseInt(value) <= 0) return 'Masukkan jumlah hari yang valid!';
                    }
                });
                if (isDismissed) return;
                extraData = parseInt(days);
            } else if (actionType === 'change_uuid') {
                const { value: customUuid, isDismissed } = await swalDark.fire({
                    title: 'Ganti UUID Akun',
                    input: 'text',
                    inputLabel: 'Masukkan UUID Baru (KOSONGKAN untuk Acak Otomatis):',
                    inputPlaceholder: 'Contoh: 123e4567-e89b-12d3-a456-426614174000',
                    showCancelButton: true
                });
                if (isDismissed) return;
                extraData = customUuid ? customUuid.trim() : 'random';
            } else if (actionType !== 'detail') {
                const conf = await swalDark.fire({ title: 'Konfirmasi Eksekusi', text: confirmText, icon: 'warning', showCancelButton: true });
                if (!conf.isConfirmed) return;
            }

            swalDark.fire({ title: 'Memproses ke VPS...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            try {
                const res = await fetch('/api/admin/vpn-action', {
                    method: 'POST', headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ vpnId, action: actionType, extraData })
                });
                const data = await res.json();
                
                if (data.success) {
                    if (actionType === 'detail') {
                        swalDark.fire({
                            title: 'Detail Config VPS',
                            html: \`<div class="bg-gray-950 p-4 rounded-xl overflow-x-auto text-left border border-gray-800 shadow-inner"><pre class="text-green-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text">\${data.resultText}</pre></div>\`,
                            width: '600px'
                        });
                    } else if (actionType === 'change_uuid') {
                        await swalDark.fire({
                            title: 'UUID Berhasil Diganti!',
                            html: \`Config baru telah dikirim ke Inbox User.\\n\\n<div class="bg-gray-950 p-4 rounded-xl mt-3 overflow-x-auto text-left border border-gray-800 shadow-inner"><pre class="text-green-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text">\${data.resultText}</pre></div>\`,
                            icon: 'success',
                            width: '600px'
                        });
                    } else {
                        await swalDark.fire('Berhasil!', \`Aksi \${actionType.toUpperCase()} sukses dieksekusi.\\n\\nRespons:\\n\${data.resultText}\`, 'success');
                        
                        if (actionType === 'delete' || actionType === 'renew') {
                            searchVPN(document.getElementById('searchVpnKeyword').value);
                        }
                    }
                } else {
                    swalDark.fire('Server API Error', data.message, 'error');
                }
            } catch(e) {
                swalDark.fire('Koneksi Error', 'Gagal menyambung ke server.', 'error');
            }
        }

        // Backup & Restore
        function downloadBackup() { window.location.href = '/api/admin/backup'; }
        
        async function backupToTelegram() {
            const btn = document.getElementById('btnBackupTg');
            btn.innerText = 'Mengirim...'; btn.disabled = true;
            try {
                const res = await fetch('/api/admin/backup-telegram', { method: 'POST' });
                const data = await res.json();
                if(data.success) {
                    swalDark.fire('Berhasil', 'Backup dan laporan statistik sukses dikirim ke Telegram!', 'success');
                } else {
                    swalDark.fire('Gagal', data.message || 'Gagal mengirim backup.', 'error');
                }
            } catch(e) {
                swalDark.fire('Error', 'Kesalahan koneksi internet.', 'error');
            }
            btn.innerHTML = \`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> Backup Sekarang ke Telegram\`;
            btn.disabled = false;
        }

        async function initDatabaseSchema() {
            const conf = await swalDark.fire({
                title: "Inisialisasi Database?",
                text: "Sistem akan membangun ulang struktur tabel, kolom baru, serta mengoptimalkan skema database D1 Anda. Lanjutkan?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#0d9488",
                cancelButtonColor: "#ef4444",
                confirmButtonText: "Ya, Jalankan!",
                cancelButtonText: "Batal"
            });
            if (!conf.isConfirmed) return;

            const btn = document.getElementById("btnInitDb");
            const originalText = btn.innerHTML;
            btn.innerText = "Memproses..."; btn.disabled = true;

            try {
                const res = await fetch("/api/admin/db-init", { method: "POST" });
                const data = await res.json();
                if (data.success) {
                    await swalDark.fire("Berhasil", data.message || "Skema database berhasil diinisialisasi!", "success");
                } else {
                    await swalDark.fire("Gagal", data.message || "Gagal inisialisasi database.", "error");
                }
            } catch (e) {
                await swalDark.fire("Error", "Terjadi kesalahan koneksi internet.", "error");
            }
            btn.innerHTML = originalText;
            btn.disabled = false;
        }

        async function restoreBackup() {
            const fileInput = document.getElementById('restoreFile');
            if (fileInput.files.length === 0) return swalDark.fire('Perhatian', 'Silakan pilih file Backup JSON.', 'warning');
            
            const conf = await swalDark.fire({ title: 'BAHAYA!', text: 'Mengembalikan database akan MENGHAPUS SELURUH DATA yang ada saat ini. Anda yakin 100%?', icon: 'error', showCancelButton: true });
            if (!conf.isConfirmed) return;

            const btn = document.getElementById('btnRestore');
            btn.innerText = 'Proses...'; btn.disabled = true;
            try {
                const fileReader = new FileReader();
                fileReader.onload = async function(e) {
                    try {
                        const jsonData = JSON.parse(e.target.result);
                        const res = await fetch('/api/admin/restore', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonData) });
                        if ((await res.json()).success) { await swalDark.fire('Berhasil', 'Database berhasil di-restore!', 'success'); window.location.reload(); }
                    } catch (err) { swalDark.fire('Error', 'File JSON tidak valid.', 'error'); }
                    btn.innerText = 'Upload'; btn.disabled = false;
                };
                fileReader.readAsText(fileInput.files[0]);
            } catch (e) { swalDark.fire('Error', 'Gagal membaca file.', 'error'); btn.innerText = 'Upload'; btn.disabled = false; }
        }
    <\/script>
    `;
}
__name(renderAdminDashboard, "renderAdminDashboard");
__name2(renderAdminDashboard, "renderAdminDashboard");
__name22(renderAdminDashboard, "renderAdminDashboard");
__name222(renderAdminDashboard, "renderAdminDashboard");
async function handleAdminRoutes(url, request, env, currentUser, appSettings, sendTelegramLog2) {
  if (!url.pathname.startsWith("/api/admin/")) {
    return null;
  }
  if (!currentUser || !isSuperAdmin(currentUser, env)) {
    return jsonResponse({ success: false, message: "Unauthorized" }, 401);
  }
  const now = getWIBTime();
  if (url.pathname === "/api/admin/dashboard-stats" && request.method === "POST") {
    try {
      const { month_year } = await request.json();
      const tzDate = new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
      const formatDate = /* @__PURE__ */ __name222((date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }, "formatDate");
      const todayStr = formatDate(tzDate);
      let sqlCondTrx = "";
      let sqlCondVpn = "";
      let sqlCondTrxParams = [];
      let sqlCondVpnParams = [];
      if (month_year === "today") {
        sqlCondTrx = "substr(created_at, 7, 4) || '-' || substr(created_at, 4, 2) || '-' || substr(created_at, 1, 2) = ?";
        sqlCondVpn = "substr(date, 7, 4) || '-' || substr(date, 4, 2) || '-' || substr(date, 1, 2) = ?";
        sqlCondTrxParams.push(todayStr);
        sqlCondVpnParams.push(todayStr);
      } else if (month_year === "this_week") {
        const dayOfWeek = tzDate.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(tzDate);
        monday.setDate(tzDate.getDate() + diffToMonday);
        const mondayStr = formatDate(monday);
        sqlCondTrx = "substr(created_at, 7, 4) || '-' || substr(created_at, 4, 2) || '-' || substr(created_at, 1, 2) BETWEEN ? AND ?";
        sqlCondVpn = "substr(date, 7, 4) || '-' || substr(date, 4, 2) || '-' || substr(date, 1, 2) BETWEEN ? AND ?";
        sqlCondTrxParams.push(mondayStr, todayStr);
        sqlCondVpnParams.push(mondayStr, todayStr);
      } else {
        let targetMonthYear = month_year;
        if (month_year === "this_month") {
          targetMonthYear = `${String(tzDate.getMonth() + 1).padStart(2, "0")}/${tzDate.getFullYear()}`;
        }
        sqlCondTrx = "substr(created_at, 4, 7) = ?";
        sqlCondVpn = "substr(date, 4, 7) = ?";
        sqlCondTrxParams.push(targetMonthYear);
        sqlCondVpnParams.push(targetMonthYear);
      }
      const userStats = await env.DB.prepare("SELECT COUNT(*) as total_users, SUM(balance) as total_balance FROM users").first();
      const totalUsers = userStats ? userStats.total_users : 0;
      const totalBalance = userStats ? userStats.total_balance || 0 : 0;
      const tripayIncomeRow = await env.DB.prepare(
        `SELECT SUM(amount) as total FROM transactions WHERE type = 'IN' AND (description LIKE 'Top Up Saldo via ShopeePay%' OR description LIKE 'Top Up Saldo via TriPay%') AND ${sqlCondTrx}`
      ).bind(...sqlCondTrxParams).first();
      const tripayIncome = tripayIncomeRow ? tripayIncomeRow.total || 0 : 0;
      const violetIncomeRow = await env.DB.prepare(
        `SELECT SUM(amount) as total FROM transactions WHERE type = 'IN' AND (description LIKE 'Top Up Saldo via GoPay%' OR description LIKE 'Top Up Saldo via Violet%') AND ${sqlCondTrx}`
      ).bind(...sqlCondTrxParams).first();
      const violetIncome = violetIncomeRow ? violetIncomeRow.total || 0 : 0;
      const manualIncomeRow = await env.DB.prepare(
        `SELECT SUM(amount) as total FROM transactions WHERE type = 'IN' AND description = 'Penambahan Saldo oleh Admin' AND ${sqlCondTrx}`
      ).bind(...sqlCondTrxParams).first();
      const manualIncome = manualIncomeRow ? manualIncomeRow.total || 0 : 0;
      const vpnCreatedRow = await env.DB.prepare(
        `SELECT COUNT(*) as total FROM vpns WHERE ${sqlCondVpn}`
      ).bind(...sqlCondVpnParams).first();
      const vpnCreated = vpnCreatedRow ? vpnCreatedRow.total || 0 : 0;
      const vpnRenewedRow = await env.DB.prepare(
        `SELECT COUNT(*) as total FROM transactions WHERE type = 'OUT' AND description LIKE 'Perpanjang VPN%' AND ${sqlCondTrx}`
      ).bind(...sqlCondTrxParams).first();
      const vpnRenewed = vpnRenewedRow ? vpnRenewedRow.total || 0 : 0;
      const xlTrxRow = await env.DB.prepare(
        `SELECT COUNT(*) as total FROM transactions WHERE type = 'OUT' AND (description LIKE 'Pembelian Paket XL%' OR description LIKE 'Biaya Admin Paket XL%') AND ${sqlCondTrx}`
      ).bind(...sqlCondTrxParams).first();
      const xlTransactions = xlTrxRow ? xlTrxRow.total || 0 : 0;
      const licenseIncomeRow = await env.DB.prepare(
        `SELECT SUM(amount) as total FROM transactions WHERE type = 'OUT' AND (description LIKE 'Beli Lisensi%' OR description LIKE 'Perpanjang Lisensi%') AND ${sqlCondTrx}`
      ).bind(...sqlCondTrxParams).first();
      const licenseIncome = licenseIncomeRow ? licenseIncomeRow.total || 0 : 0;
      const vpnRevenueRow = await env.DB.prepare(
        `SELECT SUM(amount) as total FROM transactions WHERE type = 'OUT' AND (description LIKE 'Pembuatan VPN Baru%' OR description LIKE 'Perpanjang VPN%') AND ${sqlCondTrx}`
      ).bind(...sqlCondTrxParams).first();
      const vpnRevenue = vpnRevenueRow ? vpnRevenueRow.total || 0 : 0;
      const kmspMarkup = appSettings && appSettings.kmsp_markup !== void 0 ? parseInt(appSettings.kmsp_markup) : 3e3;
      const xlProfit = xlTransactions * kmspMarkup;
      const netProfit = vpnRevenue + xlProfit + licenseIncome;
      const createdPerServer = await env.DB.prepare(
        `SELECT server, COUNT(*) as count FROM vpns WHERE ${sqlCondVpn} GROUP BY server`
      ).bind(...sqlCondVpnParams).all();
      const renewedPerServer = await env.DB.prepare(`
                SELECT v.server, COUNT(*) as count 
                FROM transactions t
                JOIN vpns v ON t.description LIKE 'Perpanjang VPN (' || v.username || ')%'
                WHERE t.type = 'OUT' AND t.description LIKE 'Perpanjang VPN%' AND ${sqlCondTrx}
                GROUP BY v.server
            `).bind(...sqlCondTrxParams).all();
      const serversMap = {};
      const configuredServers = appSettings.servers || [];
      configuredServers.forEach((srv) => {
        serversMap[srv.name] = { name: srv.name, created: 0, renewed: 0 };
      });
      if (createdPerServer.results) {
        createdPerServer.results.forEach((row) => {
          if (!serversMap[row.server]) {
            serversMap[row.server] = { name: row.server, created: 0, renewed: 0 };
          }
          serversMap[row.server].created = row.count;
        });
      }
      if (renewedPerServer.results) {
        renewedPerServer.results.forEach((row) => {
          if (!serversMap[row.server]) {
            serversMap[row.server] = { name: row.server, created: 0, renewed: 0 };
          }
          serversMap[row.server].renewed = row.count;
        });
      }
      const serversList = Object.values(serversMap);
      const xlPopularRes = await env.DB.prepare(`
                SELECT description, COUNT(*) as count, SUM(amount) as revenue 
                FROM transactions 
                WHERE type = 'OUT' AND (description LIKE 'Pembelian Paket XL%' OR description LIKE 'Biaya Admin Paket XL%') AND ${sqlCondTrx}
                GROUP BY description
                ORDER BY count DESC
                LIMIT 15
            `).bind(...sqlCondTrxParams).all();
      const xlPopular = (xlPopularRes.results || []).map((row) => {
        let packageName = row.description;
        const match = row.description.match(/Paket XL \(([^)]+)\)/);
        if (match) {
          packageName = match[1];
        }
        return {
          package_name: packageName,
          count: row.count,
          revenue: row.revenue
        };
      });
      let labels = [];
      let topupData = [];
      let spendingData = [];
      if (month_year === "today") {
        labels = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00");
        topupData = Array(24).fill(0);
        spendingData = Array(24).fill(0);
        const allTrx = await env.DB.prepare(
          `SELECT type, amount, created_at FROM transactions WHERE ${sqlCondTrx}`
        ).bind(...sqlCondTrxParams).all();
        if (allTrx.results) {
          allTrx.results.forEach((trx) => {
            const match = trx.created_at.match(/, (\d{2}):/);
            if (match) {
              const hour = parseInt(match[1], 10);
              if (hour >= 0 && hour <= 23) {
                if (trx.type === "IN") {
                  topupData[hour] += trx.amount;
                } else if (trx.type === "OUT") {
                  spendingData[hour] += trx.amount;
                }
              }
            }
          });
        }
      } else if (month_year === "this_week") {
        const daysName = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
        const dayOfWeek = tzDate.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(tzDate);
        monday.setDate(tzDate.getDate() + diffToMonday);
        topupData = Array(7).fill(0);
        spendingData = Array(7).fill(0);
        const datesOfWeek = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          const dayStr = String(d.getDate()).padStart(2, "0");
          const monthStr = String(d.getMonth() + 1).padStart(2, "0");
          const formattedDate = `${dayStr}/${monthStr}`;
          datesOfWeek.push(formattedDate);
          labels.push(`${daysName[i]} (${formattedDate})`);
        }
        const allTrx = await env.DB.prepare(
          `SELECT type, amount, created_at FROM transactions WHERE ${sqlCondTrx}`
        ).bind(...sqlCondTrxParams).all();
        if (allTrx.results) {
          allTrx.results.forEach((trx) => {
            const ddMm = trx.created_at.substring(0, 5);
            const idx = datesOfWeek.indexOf(ddMm);
            if (idx !== -1) {
              if (trx.type === "IN") {
                topupData[idx] += trx.amount;
              } else if (trx.type === "OUT") {
                spendingData[idx] += trx.amount;
              }
            }
          });
        }
      } else {
        let targetMonthYear = month_year;
        if (month_year === "this_month") {
          targetMonthYear = `${String(tzDate.getMonth() + 1).padStart(2, "0")}/${tzDate.getFullYear()}`;
        }
        const [targetMonth, targetYear] = targetMonthYear.split("/");
        const daysInMonth = new Date(parseInt(targetYear), parseInt(targetMonth), 0).getDate();
        labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
        topupData = Array(daysInMonth).fill(0);
        spendingData = Array(daysInMonth).fill(0);
        const allTrx = await env.DB.prepare(
          `SELECT type, amount, created_at FROM transactions WHERE ${sqlCondTrx}`
        ).bind(...sqlCondTrxParams).all();
        if (allTrx.results) {
          allTrx.results.forEach((trx) => {
            const datePart = trx.created_at.split(",")[0];
            const day = parseInt(datePart.split("/")[0], 10);
            if (day >= 1 && day <= daysInMonth) {
              if (trx.type === "IN") {
                topupData[day - 1] += trx.amount;
              } else if (trx.type === "OUT") {
                spendingData[day - 1] += trx.amount;
              }
            }
          });
        }
      }
      return jsonResponse({
        success: true,
        data: {
          total_users: totalUsers,
          total_balance: totalBalance,
          tripay_income: tripayIncome,
          violet_income: violetIncome,
          manual_income: manualIncome,
          vpn_created: vpnCreated,
          vpn_renewed: vpnRenewed,
          xl_transactions: xlTransactions,
          license_income: licenseIncome,
          net_profit: netProfit,
          servers: serversList,
          xl_popular: xlPopular,
          daily_chart: {
            labels,
            topup: topupData,
            spending: spendingData
          }
        }
      });
    } catch (e) {
      return jsonResponse({ success: false, message: "Gagal mengambil statistik: " + e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/db-init" && request.method === "POST") {
    try {
      await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    email TEXT, 
                    type TEXT, 
                    amount INTEGER, 
                    description TEXT, 
                    balance INTEGER DEFAULT 0,
                    created_at TEXT
                )
            `).run();
      try {
        await env.DB.prepare("ALTER TABLE transactions ADD COLUMN balance INTEGER DEFAULT 0").run();
      } catch (e) {
      }
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS ai_usage (email TEXT PRIMARY KEY, count INTEGER, slot TEXT)`).run();
      try {
        await env.DB.prepare("ALTER TABLE users ADD COLUMN picture TEXT").run();
      } catch (e) {
      }
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, email TEXT, subject TEXT, category TEXT, status TEXT, created_at TEXT, updated_at TEXT)`).run();
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS ticket_replies (id INTEGER PRIMARY KEY AUTOINCREMENT, ticket_id TEXT, sender_type TEXT, message TEXT, created_at TEXT)`).run();
      return jsonResponse({ success: true, message: "Inisialisasi dan migrasi database D1 berhasil dilakukan!" });
    } catch (e) {
      return jsonResponse({ success: false, message: "Gagal inisialisasi database: " + e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/tickets" && request.method === "POST") {
    try {
      const { status, search, page = 1, limit = 15 } = await request.json();
      const offset = (page - 1) * limit;
      let query = "SELECT * FROM tickets WHERE 1=1";
      let countQuery = "SELECT COUNT(*) as total FROM tickets WHERE 1=1";
      let params = [];
      if (status && status !== "ALL") {
        query += " AND status = ?";
        countQuery += " AND status = ?";
        params.push(status);
      }
      if (search) {
        query += " AND (id LIKE ? OR email LIKE ?)";
        countQuery += " AND (id LIKE ? OR email LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }
      const totalRow = await env.DB.prepare(countQuery).bind(...params).first();
      const total = totalRow ? totalRow.total : 0;
      const totalPages = Math.ceil(total / limit) || 1;
      query += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
      const { results } = await env.DB.prepare(query).bind(...params, limit, offset).all();
      const openCountRow = await env.DB.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'OPEN'").first();
      const openCount = openCountRow ? openCountRow.count : 0;
      return jsonResponse({
        success: true,
        data: results || [],
        page,
        totalPages,
        total,
        openCount
      });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/ticket/view" && request.method === "POST") {
    try {
      const { ticketId } = await request.json();
      const ticket = await env.DB.prepare("SELECT * FROM tickets WHERE id = ?").bind(ticketId).first();
      if (!ticket) throw new Error("Tiket tidak ditemukan.");
      const { results: replies } = await env.DB.prepare("SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY id ASC").bind(ticketId).all();
      return jsonResponse({ success: true, ticket, replies: replies || [] });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/ticket/reply" && request.method === "POST") {
    try {
      const { ticketId, message } = await request.json();
      const ticket = await env.DB.prepare("SELECT email FROM tickets WHERE id = ?").bind(ticketId).first();
      if (!ticket) throw new Error("Tiket tidak ditemukan.");
      await env.DB.prepare("INSERT INTO ticket_replies (ticket_id, sender_type, message, created_at) VALUES (?, 'admin', ?, ?)").bind(ticketId, message, now).run();
      await env.DB.prepare("UPDATE tickets SET status = 'PENDING', updated_at = ? WHERE id = ?").bind(now, ticketId).run();
      const subject = `Balasan Tiket Bantuan: ${ticketId}`;
      const emailHtml = `<p>Halo,</p><p>Admin telah memberikan balasan untuk tiket bantuan Anda (<b>${ticketId}</b>).</p>
                               <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #dc2626; margin: 15px 0; color: #374151;">
                                   ${escapeHTML(message).replace(/\\n/g, "<br>")}
                               </div>
                               <p>Silakan login ke Warung Pulsa dan buka menu <b>Pusat Bantuan (Tiket)</b> untuk melanjutkan percakapan.</p>`;
      sendEmailViaGAS(ticket.email, subject, buildEmailTemplate("Tiket Anda Dibalas", emailHtml), env).catch(() => {
      });
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/ticket/action" && request.method === "POST") {
    try {
      const { ticketId, action } = await request.json();
      if (action === "CLOSE") {
        await env.DB.prepare("UPDATE tickets SET status = 'CLOSED', updated_at = ? WHERE id = ?").bind(now, ticketId).run();
      }
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/kmsp-packages" && request.method === "GET") {
    try {
      if (!env.KMSP_API_KEY) throw new Error("API KEY KMSP belum disetel!");
      const servicesRes = await KMSP.getPackageList(env.KMSP_API_KEY);
      let visibilityMap = {};
      try {
        const visStr = await env.DB.prepare("SELECT value FROM settings WHERE key = 'pkg_visibility'").first("value");
        if (visStr) visibilityMap = JSON.parse(visStr);
      } catch (e) {
      }
      if (servicesRes.success && Array.isArray(servicesRes.data)) {
        const data = servicesRes.data.map((pkg) => ({
          id: pkg.package_code,
          name: pkg.package_name,
          price: Number(pkg.package_harga_int) || 0,
          visible: visibilityMap[pkg.package_code] !== false
          // Secara Default True/Melek
        }));
        return jsonResponse({ success: true, data });
      }
      return jsonResponse(servicesRes);
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/toggle-pkg" && request.method === "POST") {
    try {
      const { pkgId, visible } = await request.json();
      let visibilityMap = {};
      try {
        const existing = await env.DB.prepare("SELECT value FROM settings WHERE key = 'pkg_visibility'").first("value");
        if (existing) visibilityMap = JSON.parse(existing);
      } catch (e) {
      }
      visibilityMap[pkgId] = visible;
      const checkExist = await env.DB.prepare("SELECT key FROM settings WHERE key = 'pkg_visibility'").first();
      if (checkExist) {
        await env.DB.prepare("UPDATE settings SET value = ? WHERE key = 'pkg_visibility'").bind(JSON.stringify(visibilityMap)).run();
      } else {
        await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('pkg_visibility', ?)").bind(JSON.stringify(visibilityMap)).run();
      }
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/save-pkg-desc" && request.method === "POST") {
    try {
      const { pkgId, description } = await request.json();
      const existing = await env.DB.prepare("SELECT value FROM settings WHERE key = 'pkg_desc'").first();
      let descMap = {};
      if (existing && existing.value) {
        try {
          descMap = JSON.parse(existing.value);
        } catch (e) {
        }
      }
      descMap[pkgId] = description;
      const checkExist = await env.DB.prepare("SELECT key FROM settings WHERE key = 'pkg_desc'").first();
      if (checkExist) {
        await env.DB.prepare("UPDATE settings SET value = ? WHERE key = 'pkg_desc'").bind(JSON.stringify(descMap)).run();
      } else {
        await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('pkg_desc', ?)").bind(JSON.stringify(descMap)).run();
      }
      if (sendTelegramLog2) {
        await sendTelegramLog2(`\u{1F4DD} ADMIN EDIT DESKRIPSI PAKET`, `Admin telah memperbarui penjelasan untuk paket KMSP (ID: ${pkgId}).`, appSettings);
      }
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/users-list" && request.method === "POST") {
    try {
      const { page = 1, limit = 50, search = "" } = await request.json();
      const offset = (page - 1) * limit;
      let query = "SELECT * FROM users";
      let countQuery = "SELECT COUNT(*) as total FROM users";
      let bindParams = [];
      if (search) {
        query += " WHERE email LIKE ? OR name LIKE ?";
        countQuery += " WHERE email LIKE ? OR name LIKE ?";
        bindParams = [`%${search}%`, `%${search}%`];
      }
      query += " ORDER BY rowid DESC LIMIT ? OFFSET ?";
      const { results: users } = await env.DB.prepare(query).bind(...bindParams, limit, offset).all();
      const totalRes = await env.DB.prepare(countQuery).bind(...bindParams).first();
      const total = totalRes ? totalRes.total : 0;
      return jsonResponse({ success: true, data: users || [], total, page, totalPages: Math.ceil(total / limit) });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/user-transactions" && request.method === "POST") {
    try {
      const { email } = await request.json();
      const { results } = await env.DB.prepare("SELECT * FROM transactions WHERE email = ? ORDER BY id DESC LIMIT 10").bind(email).all();
      return jsonResponse({ success: true, data: results || [] });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/global-transactions" && request.method === "POST") {
    try {
      const { page = 1, limit = 50, search = "" } = await request.json();
      const offset = (page - 1) * limit;
      let query = "SELECT * FROM transactions WHERE amount > 0";
      let countQuery = "SELECT COUNT(*) as total FROM transactions WHERE amount > 0";
      let bindParams = [];
      if (search) {
        query += " AND (email LIKE ? OR description LIKE ?)";
        countQuery += " AND (email LIKE ? OR description LIKE ?)";
        bindParams.push(`%${search}%`, `%${search}%`);
      }
      query += " ORDER BY id DESC LIMIT ? OFFSET ?";
      const { results: transactions } = await env.DB.prepare(query).bind(...bindParams, limit, offset).all();
      const totalRes = await env.DB.prepare(countQuery).bind(...bindParams).first();
      const total = totalRes ? totalRes.total : 0;
      return jsonResponse({
        success: true,
        data: transactions || [],
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/user-action" && request.method === "POST") {
    try {
      const { email, action, value, keterangan } = await request.json();
      if (action === "add_balance") {
        await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(value, email).run();
        const mutasiType = value > 0 ? "IN" : "OUT";
        let mutasiDesc = value > 0 ? "Penambahan Saldo oleh Admin" : "Pengurangan Saldo oleh Admin";
        if (keterangan) mutasiDesc += ` (${keterangan})`;
        await catatMutasi(env, email, mutasiType, Math.abs(value), mutasiDesc);
        const isAddition = value > 0;
        const absValue = Math.abs(value).toLocaleString("id-ID");
        const actionText = isAddition ? "Penambahan" : "Pengurangan";
        const actionVerb = isAddition ? "ditambahkan" : "dikurangi";
        const colorClass = isAddition ? "text-green-400" : "text-cyan-400";
        const userTitle = `[SALDO] ${actionText} Saldo`;
        const userMsg = `Saldo Anda telah ${actionVerb} sebesar <b class="${colorClass}">Rp ${absValue}</b> oleh sistem Admin.${keterangan ? "<br><br>Keterangan: <i>" + escapeHTML(keterangan) + "</i>" : ""}`;
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(email, userTitle, userMsg, now).run();
        const adminTitle = `[ADMIN SALDO] ${actionText} untuk ${email}`;
        const adminMsg = `Anda berhasil melakukan ${actionText.toLowerCase()} saldo sebesar <b class="${colorClass}">Rp ${absValue}</b> pada akun pengguna <b>${email}</b>.${keterangan ? "<br><br>Keterangan: <i>" + escapeHTML(keterangan) + "</i>" : ""}`;
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(currentUser.email, adminTitle, adminMsg, now).run();
        if (sendTelegramLog2) {
          await sendTelegramLog2(`\u{1F4B3} ADMIN UPDATE SALDO`, `Admin melakukan ${actionText.toLowerCase()} saldo.
Email Target: ${email}
Nominal: Rp ${absValue.toLocaleString("id-ID")}${keterangan ? "\nKeterangan: " + keterangan : ""}`, appSettings);
        }
      } else if (action === "toggle_block") {
        const user = await env.DB.prepare("SELECT is_blocked FROM users WHERE email = ?").bind(email).first();
        if (user) await env.DB.prepare("UPDATE users SET is_blocked = ? WHERE email = ?").bind(user.is_blocked === 1 ? 0 : 1, email).run();
        if (sendTelegramLog2) {
          await sendTelegramLog2(`\u{1F6E1}\uFE0F ADMIN UBAH STATUS BLOKIR`, `Status blokir diubah untuk akun:
Email: ${email}
Status: ${user.is_blocked === 1 ? "Aktif Kembali" : "Diblokir"}`, appSettings);
        }
      }
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/settings" && request.method === "POST") {
    try {
      const { payment_tripay, payment_violet, payment_qris_manual, payment_shopeepay, payment_gopay, autogopay_api_key, shopeepay_qris_static, gopay_qris_static, ai_chat_active, ai_provider, price_per_day, script_price_per_day, kmsp_markup, telegram_bot_token, telegram_channel_id, auto_backup_frequency, maintenance_mode, servers } = await request.json();
      const settingStr = JSON.stringify({ payment_tripay, payment_violet, payment_qris_manual, payment_shopeepay, payment_gopay, autogopay_api_key, shopeepay_qris_static, gopay_qris_static, ai_chat_active, ai_provider, price_per_day, script_price_per_day, kmsp_markup, telegram_bot_token, telegram_channel_id, auto_backup_frequency, maintenance_mode, servers });
      const existing = await env.DB.prepare("SELECT key FROM settings WHERE key = 'app'").first();
      if (existing) await env.DB.prepare("UPDATE settings SET value = ? WHERE key = 'app'").bind(settingStr).run();
      else await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('app', ?)").bind(settingStr).run();
      setCachedAppSettings(JSON.parse(settingStr));
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/send-message" && request.method === "POST") {
    try {
      const { targetType, targetEmail, title, message } = await request.json();
      if (targetType === "all") {
        const { results: users } = await env.DB.prepare("SELECT email FROM users").all();
        for (const u of users) await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(u.email, title, message, now).run();
      } else {
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(targetEmail, title, message, now).run();
      }
      if (sendTelegramLog2) {
        await sendTelegramLog2(`\u{1F4E2} ADMIN BROADCAST PESAN`, `Target: ${targetType === "all" ? "Semua User" : targetEmail}
Judul: ${title}

Pesan:
${message}`, appSettings);
      }
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/user-inbox" && request.method === "POST") {
    try {
      const { email } = await request.json();
      const { results: inbox } = await env.DB.prepare("SELECT * FROM inbox WHERE email = ? ORDER BY id DESC").bind(email).all();
      return jsonResponse({ success: true, inbox: inbox || [] });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/vpn-search" && request.method === "POST") {
    try {
      const { keyword } = await request.json();
      const { results } = await env.DB.prepare("SELECT * FROM vpns WHERE username LIKE ? OR email LIKE ? ORDER BY id DESC LIMIT 50").bind(`%${keyword}%`, `%${keyword}%`).all();
      return jsonResponse({ success: true, data: results || [] });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/global-change-uuid" && request.method === "POST") {
    try {
      const { serverId, oldUuid, newUuid } = await request.json();
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server konfigurasi VPS tidak ditemukan.");
      const endpoint = `/srpcom/change-uuid`;
      const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
        body: JSON.stringify({ uuidold: oldUuid, uuidnew: newUuid })
      };
      const vpsReq = await fetch(targetServer.host + endpoint, fetchOptions);
      if (!vpsReq.ok) throw new Error(`Server VPS menolak request dengan HTTP Status: ${vpsReq.status}`);
      const vpsRes = await vpsReq.json();
      const resultText = vpsRes.detail?.stdout || vpsRes.stdout || "Aksi berhasil (VPS tidak merespons output text)";
      if (sendTelegramLog2) {
        await sendTelegramLog2(`\u{1F511} ADMIN GLOBAL GANTI UUID`, `Admin mengeksekusi fitur Global Ganti UUID.
Server: ${targetServer.name}
UUID Lama: ${oldUuid}
UUID Baru: ${newUuid}

Respons VPS:
${resultText}`, appSettings);
      }
      return jsonResponse({ success: true, resultText });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/global-delete-vpn" && request.method === "POST") {
    try {
      const { serverId, username } = await request.json();
      if (!username) throw new Error("Username tidak boleh kosong.");
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server konfigurasi VPS tidak ditemukan.");
      const dbRes = await env.DB.prepare("DELETE FROM vpns WHERE username = ? AND server = ?").bind(username, targetServer.name).run();
      const dbMsg = dbRes.meta.changes > 0 ? `Dihapus dari Database Lokal (${dbRes.meta.changes} record).` : "Tidak ditemukan di Database Lokal.";
      const endpoints = [
        "/srpcom/del-ssh",
        "/srpcom/del-vmessws",
        "/srpcom/del-vlessws",
        "/srpcom/del-trojanws",
        "/srpcom/del-l2tp"
      ];
      let vpsResults = [];
      const fetchPromises = endpoints.map((ep) => {
        return fetch(targetServer.host + ep, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
          body: JSON.stringify({ user: username })
        }).then(async (res) => {
          const data = await res.json();
          return `[${ep}] ${data.detail?.stdout || data.stdout || "Success"}`;
        }).catch((err) => `[${ep}] Error/No Response`);
      });
      const settledResults = await Promise.allSettled(fetchPromises);
      settledResults.forEach((res) => {
        if (res.status === "fulfilled") vpsResults.push(res.value);
        else vpsResults.push(res.reason);
      });
      const resultText = `Status Database Lokal:
${dbMsg}

Respon Eksekusi Server VPS:
` + vpsResults.join("\n");
      if (sendTelegramLog2) {
        await sendTelegramLog2(`\u{1F5D1}\uFE0F ADMIN GLOBAL DELETE VPN`, `Admin mengeksekusi fitur Global Delete VPN.
Server: ${targetServer.name}
Username Target: ${username}

Log Eksekusi:
${resultText}`, appSettings);
      }
      return jsonResponse({ success: true, resultText });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/ping-server" && request.method === "POST") {
    try {
      const { serverId } = await request.json();
      if (!serverId) throw new Error("Parameter serverId tidak lengkap.");
      const targetServer = appSettings.servers.find((s) => String(s.id) === String(serverId));
      if (!targetServer) throw new Error("Server tidak ditemukan di konfigurasi.");
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4e3);
      try {
        const response = await fetch(targetServer.host + "/srpcom/cek-xray", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": targetServer.key
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          return jsonResponse({ success: true, status: "ONLINE" });
        } else {
          return jsonResponse({ success: true, status: "OFFLINE", message: `HTTP status: ${response.status}` });
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        let errMsg = fetchError.message || "Error";
        if (fetchError.name === "AbortError") {
          errMsg = "Timeout (4s)";
        }
        return jsonResponse({ success: true, status: "OFFLINE", message: errMsg });
      }
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/monitor-server" && request.method === "POST") {
    try {
      const { serverId, protocol } = await request.json();
      if (!serverId || !protocol) throw new Error("Parameter tidak lengkap.");
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server konfigurasi VPS tidak ditemukan.");
      let endpoint = "";
      if (protocol === "ssh") {
        endpoint = "/srpcom/cek-ssh";
      } else if (protocol === "xray") {
        endpoint = "/srpcom/cek-xray";
      } else {
        throw new Error("Protokol tidak didukung untuk monitoring.");
      }
      const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key }
      };
      const vpsReq = await fetch(targetServer.host + endpoint, fetchOptions);
      if (!vpsReq.ok) throw new Error(`Server VPS menolak request dengan HTTP Status: ${vpsReq.status}`);
      const vpsRes = await vpsReq.json();
      let resultText = vpsRes.detail?.stdout || vpsRes.stdout || "Aksi berhasil (VPS tidak merespons output text)";
      resultText = resultText.replace(/\x1B\[[0-9;]*[mK]/g, "");
      return jsonResponse({ success: true, resultText });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/live-explorer/list" && request.method === "POST") {
    try {
      const { serverId, protocol } = await request.json();
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server tidak ditemukan di konfigurasi.");
      const endpoint = `/srpcom/list-accounts/${protocol}`;
      const fetchOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key }
      };
      const vpsReq = await fetch(targetServer.host + endpoint, fetchOptions);
      if (!vpsReq.ok) throw new Error(`VPS menolak request dengan HTTP Status: ${vpsReq.status}`);
      const vpsRes = await vpsReq.json();
      let resultText = vpsRes.detail?.stdout || vpsRes.stdout || "Berhasil memuat namun tidak ada data yang diterima dari VPS.";
      resultText = resultText.replace(/\x1B\[[0-9;]*[mK]/g, "");
      return jsonResponse({ success: true, resultText });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/live-explorer/detail" && request.method === "POST") {
    try {
      const { serverId, protocol, username } = await request.json();
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server tidak ditemukan di konfigurasi.");
      let apiEndpoint = "";
      if (protocol === "ssh") apiEndpoint = "/srpcom/detail-ssh";
      else if (protocol === "l2tp") apiEndpoint = "/srpcom/detail-l2tp";
      else if (["vmess", "vless", "trojan"].includes(protocol)) apiEndpoint = `/srpcom/detail-${protocol}ws`;
      else throw new Error("Protokol tidak dikenali oleh sistem.");
      const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
        body: JSON.stringify({ user: username })
      };
      const vpsReq = await fetch(targetServer.host + apiEndpoint, fetchOptions);
      if (!vpsReq.ok) throw new Error(`VPS menolak request dengan HTTP Status: ${vpsReq.status}`);
      const vpsRes = await vpsReq.json();
      let resultText = vpsRes.detail?.stdout || vpsRes.stdout || "Detail tidak ditemukan pada VPS (Atau username salah).";
      resultText = resultText.replace(/\x1B\[[0-9;]*[mK]/g, "");
      return jsonResponse({ success: true, resultText });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/live-explorer/delete" && request.method === "POST") {
    try {
      const { serverId, protocol, username } = await request.json();
      if (!username) throw new Error("Username tidak boleh kosong.");
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server tidak ditemukan di konfigurasi.");
      const dbRes = await env.DB.prepare("DELETE FROM vpns WHERE username = ? AND server = ?").bind(username, targetServer.name).run();
      const dbMsg = dbRes.meta.changes > 0 ? `Dihapus dari Database Lokal (${dbRes.meta.changes} record).` : "Tidak ditemukan di Database Lokal.";
      let apiEndpoint = "";
      if (protocol === "ssh") apiEndpoint = "/srpcom/del-ssh";
      else if (protocol === "l2tp") apiEndpoint = "/srpcom/del-l2tp";
      else if (["vmess", "vless", "trojan"].includes(protocol)) apiEndpoint = `/srpcom/del-${protocol}ws`;
      else throw new Error("Protokol tidak dikenali oleh sistem.");
      const fetchOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
        body: JSON.stringify({ user: username })
      };
      const vpsReq = await fetch(targetServer.host + apiEndpoint, fetchOptions);
      if (!vpsReq.ok) throw new Error(`VPS menolak request dengan HTTP Status: ${vpsReq.status}`);
      const vpsRes = await vpsReq.json();
      let resultText = vpsRes.detail?.stdout || vpsRes.stdout || "Hapus live berhasil (VPS tidak merespons output text)";
      resultText = resultText.replace(/\x1B\[[0-9;]*[mK]/g, "");
      const finalLog = `Status Database Lokal: ${dbMsg}

Respon VPS:
${resultText}`;
      if (sendTelegramLog2) {
        await sendTelegramLog2(`\u{1F5D1}\uFE0F ADMIN LIVE DELETE ACCOUNT`, `Admin menghapus akun dari explorer secara live.
Server: ${targetServer.name}
Protocol: ${protocol.toUpperCase()}
Username: ${username}

Log:
${finalLog}`, appSettings);
      }
      return jsonResponse({ success: true, resultText: finalLog });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/live-explorer/renew" && request.method === "POST") {
    try {
      const { serverId, protocol, username, duration } = await request.json();
      if (!username) throw new Error("Username tidak boleh kosong.");
      if (!duration || isNaN(parseInt(duration))) throw new Error("Durasi perpanjangan tidak valid.");
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server tidak ditemukan di konfigurasi.");
      const vpnRecord = await env.DB.prepare("SELECT * FROM vpns WHERE username = ? AND server = ?").bind(username, targetServer.name).first();
      let dbMsg = "Tidak ditemukan di Database Lokal (Akun Gaib).";
      if (vpnRecord) {
        await env.DB.prepare("UPDATE vpns SET exp = exp || ? WHERE id = ?").bind(` (+${duration} Hari)`, vpnRecord.id).run();
        const userTitle = `[RENEW] Perpanjangan Berhasil!`;
        const userMsg = `Masa aktif akun VPN <b>${username}</b> Anda telah berhasil diperpanjang oleh Admin sebanyak <b>${duration} Hari</b>.`;
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(vpnRecord.email, userTitle, userMsg, now).run();
        dbMsg = `Diperpanjang di Database Lokal & Inbox terkirim ke ${vpnRecord.email}.`;
      }
      let apiEndpoint = "";
      if (protocol === "ssh") apiEndpoint = "/srpcom/renew-ssh";
      else if (protocol === "l2tp") apiEndpoint = "/srpcom/renew-l2tp";
      else if (["vmess", "vless", "trojan"].includes(protocol)) apiEndpoint = `/srpcom/renew-${protocol}ws`;
      else throw new Error("Protokol tidak dikenali oleh sistem.");
      const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
        body: JSON.stringify({ user: username, exp: String(duration) })
      };
      const vpsReq = await fetch(targetServer.host + apiEndpoint, fetchOptions);
      if (!vpsReq.ok) throw new Error(`VPS menolak request dengan HTTP Status: ${vpsReq.status}`);
      const vpsRes = await vpsReq.json();
      let resultText = vpsRes.detail?.stdout || vpsRes.stdout || "Perpanjang live berhasil (VPS tidak merespons output text)";
      resultText = resultText.replace(/\x1B\[[0-9;]*[mK]/g, "");
      const finalLog = `Status Database Lokal: ${dbMsg}

Respon VPS:
${resultText}`;
      if (sendTelegramLog2) {
        await sendTelegramLog2(`\u{1F504} ADMIN LIVE RENEW ACCOUNT`, `Admin memperpanjang akun dari explorer secara live.
Server: ${targetServer.name}
Protocol: ${protocol.toUpperCase()}
Username: ${username}
Ditambah: ${duration} Hari

Log:
${finalLog}`, appSettings);
      }
      return jsonResponse({ success: true, resultText: finalLog });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/live-explorer/link-user" && request.method === "POST") {
    try {
      const { serverId, protocol, username, email } = await request.json();
      if (!username) throw new Error("Username VPN tidak boleh kosong.");
      if (!email) throw new Error("Email user website tidak boleh kosong.");
      const targetServer = appSettings.servers.find((s) => s.id === serverId);
      if (!targetServer) throw new Error("Server tidak ditemukan di konfigurasi.");
      const targetUser = await env.DB.prepare("SELECT email, name FROM users WHERE email = ?").bind(email).first();
      if (!targetUser) {
        return jsonResponse({ success: false, message: `Email "${email}" tidak terdaftar sebagai pengguna website.` }, 400);
      }
      let apiEndpoint = "";
      if (protocol === "ssh") apiEndpoint = "/srpcom/detail-ssh";
      else if (protocol === "l2tp") apiEndpoint = "/srpcom/detail-l2tp";
      else if (["vmess", "vless", "trojan"].includes(protocol)) apiEndpoint = `/srpcom/detail-${protocol}ws`;
      else throw new Error("Protokol tidak dikenali oleh sistem.");
      const fetchOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
        body: JSON.stringify({ user: username })
      };
      const vpsReq = await fetch(targetServer.host + apiEndpoint, fetchOptions);
      let rawResponseText = "";
      let remainingDaysStr = "30 Hari";
      if (vpsReq.ok) {
        const vpsRes = await vpsReq.json();
        rawResponseText = vpsRes.detail?.stdout || vpsRes.stdout || "";
        rawResponseText = rawResponseText.replace(/\x1B\[[0-9;]*[mK]/g, "");
        const expiryMatch = rawResponseText.match(/(?:Expired|Expired On|Kedaluwarsa|Masa Aktif)\s*:\s*([^\n\r]+)/i);
        if (expiryMatch) {
          remainingDaysStr = expiryMatch[1].trim();
        } else {
          const daysMatch = rawResponseText.match(/(\d+)\s*(?:Hari|Days)/i);
          if (daysMatch) {
            remainingDaysStr = daysMatch[0].trim();
          }
        }
      }
      const now2 = getWIBTime();
      const existingVpn = await env.DB.prepare("SELECT id FROM vpns WHERE username = ? AND server = ?").bind(username, targetServer.name).first();
      if (existingVpn) {
        await env.DB.prepare("UPDATE vpns SET email = ?, protocol = ?, date = ?, exp = ? WHERE id = ?").bind(email, protocol.toUpperCase(), now2, remainingDaysStr, existingVpn.id).run();
      } else {
        await env.DB.prepare("INSERT INTO vpns (email, server, protocol, username, date, exp) VALUES (?, ?, ?, ?, ?, ?)").bind(email, targetServer.name, protocol.toUpperCase(), username, now2, remainingDaysStr).run();
      }
      const titleInbox = `Akun VPN/SSH Dihubungkan ke Akun Anda`;
      const bodyMsg = `Admin telah menghubungkan akun berikut ke akun website Anda:<br>
                            - <b>Username:</b> ${username}<br>
                            - <b>Server:</b> ${targetServer.name}<br>
                            - <b>Protokol:</b> ${protocol.toUpperCase()}<br>
                            - <b>Masa Aktif:</b> ${remainingDaysStr}<br><br>
                            Anda dapat melakukan perpanjangan masa aktif akun ini secara mandiri melalui menu Dashboard.`;
      await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(email, titleInbox, bodyMsg, now2).run();
      if (sendTelegramLog2) {
        await sendTelegramLog2(`\u{1F464} ADMIN LINK ACCOUNT TO USER`, `Admin menghubungkan akun VPN/SSH ke user website.
Server: ${targetServer.name}
Protocol: ${protocol.toUpperCase()}
Username: ${username}
Email User: ${email}

Masa Aktif: ${remainingDaysStr}`, appSettings);
      }
      return jsonResponse({ success: true, message: `Akun "${username}" berhasil dihubungkan ke email "${email}"!` });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/vpn-action" && request.method === "POST") {
    try {
      const { vpnId, action, extraData } = await request.json();
      const vpnRecord = await env.DB.prepare("SELECT * FROM vpns WHERE id = ?").bind(vpnId).first();
      if (!vpnRecord) throw new Error("VPN tidak ditemukan di database.");
      const targetServer = appSettings.servers.find((s) => s.name === vpnRecord.server);
      if (!targetServer) throw new Error("Konfigurasi server VPS tidak ditemukan.");
      const protocol = vpnRecord.protocol.toLowerCase();
      let endpoint = "";
      let fetchMethod = "POST";
      let includeBody = true;
      if (action === "delete") {
        fetchMethod = "DELETE";
        if (protocol.includes("trojan")) endpoint = "/srpcom/del-trojanws";
        else if (protocol.includes("vmess")) endpoint = "/srpcom/del-vmessws";
        else if (protocol.includes("vless")) endpoint = "/srpcom/del-vlessws";
        else if (protocol.includes("ssh") || protocol.includes("ovpn")) endpoint = "/srpcom/del-ssh";
        else if (protocol.includes("l2tp")) endpoint = "/srpcom/del-l2tp";
      } else if (action === "renew") {
        fetchMethod = "POST";
        if (protocol.includes("trojan")) endpoint = "/srpcom/renew-trojanws";
        else if (protocol.includes("vmess")) endpoint = "/srpcom/renew-vmessws";
        else if (protocol.includes("vless")) endpoint = "/srpcom/renew-vlessws";
        else if (protocol.includes("ssh") || protocol.includes("ovpn")) endpoint = "/srpcom/renew-ssh";
        else if (protocol.includes("l2tp")) endpoint = "/srpcom/renew-l2tp";
        else throw new Error("Protokol ini tidak mendukung fitur Perpanjang.");
      } else if (action === "change_uuid") {
        fetchMethod = "POST";
        const isXray = protocol.includes("trojan") || protocol.includes("vmess") || protocol.includes("vless");
        if (isXray) endpoint = `/srpcom/change-uuid`;
        else throw new Error("Fitur Ganti UUID dari API ini khusus untuk jenis VPN XRAY (Trojan/Vmess/Vless) saja.");
      } else if (action === "detail") {
        fetchMethod = "GET";
        includeBody = false;
        if (protocol.includes("trojan")) endpoint = "/srpcom/detail-trojanws";
        else if (protocol.includes("vmess")) endpoint = "/srpcom/detail-vmessws";
        else if (protocol.includes("vless")) endpoint = "/srpcom/detail-vlessws";
        else throw new Error("Protokol ini tidak mendukung fitur Cek Detail.");
      } else if (action === "lock" || action === "unlock") {
        fetchMethod = "GET";
        includeBody = false;
        const isXray = protocol.includes("trojan") || protocol.includes("vmess") || protocol.includes("vless");
        if (isXray) endpoint = `/srpcom/${action}-xray`;
        else if (protocol.includes("ssh") || protocol.includes("ovpn")) endpoint = `/srpcom/${action}-ssh`;
        else throw new Error("Protokol ini tidak mendukung fitur Lock/Unlock.");
      }
      if (!endpoint) throw new Error("Aksi atau protokol tidak dikenali.");
      let finalUrl = targetServer.host + endpoint;
      if (!includeBody) finalUrl += `?user=${encodeURIComponent(vpnRecord.username)}`;
      let resultText = "";
      try {
        const fetchOptions = {
          method: fetchMethod,
          headers: { "Content-Type": "application/json", "x-api-key": targetServer.key }
        };
        if (includeBody) {
          let payload = { user: vpnRecord.username };
          if (action === "renew" && extraData) payload.exp = String(extraData);
          if (action === "change_uuid" && extraData && extraData !== "random") payload.uuid = extraData;
          fetchOptions.body = JSON.stringify(payload);
        }
        const vpsReq = await fetch(finalUrl, fetchOptions);
        if (!vpsReq.ok) throw new Error(`Server VPS menolak request dengan HTTP Status: ${vpsReq.status}`);
        const vpsRes = await vpsReq.json();
        resultText = vpsRes.detail?.stdout || vpsRes.stdout || "Aksi berhasil (VPS tidak merespons output text)";
      } catch (apiError) {
        if (action === "detail") {
          const inboxRecord = await env.DB.prepare("SELECT message FROM inbox WHERE email = ? AND message LIKE ? ORDER BY id DESC LIMIT 1").bind(vpnRecord.email, `%${vpnRecord.username}%`).first();
          if (inboxRecord) {
            let cleanConfigText = inboxRecord.message.replace(/\x1B\[[0-9;]*[mK]/g, "").replace(/<\/?[^>]+(>|$)/g, "");
            const matches = [...inboxRecord.message.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)];
            let extracted = matches.length > 0 ? matches[matches.length - 1][1] : cleanConfigText.trim();
            resultText = `=================================
INFORMASI ${vpnRecord.protocol.toUpperCase()}
=================================

Username : ${vpnRecord.username}
Server   : ${vpnRecord.server}
Expired  : ${vpnRecord.exp}

*Catatan: API Cek Detail VPS tidak sinkron dengan Cloudflare. Data ditarik dari Riwayat Database.*

${extracted}`;
          } else {
            throw new Error(`Gagal ke API VPS (${apiError.message}) dan Riwayat config tidak ditemukan di Database.`);
          }
        } else {
          throw apiError;
        }
      }
      if (action === "delete") {
        await env.DB.prepare("DELETE FROM vpns WHERE id = ?").bind(vpnId).run();
        if (sendTelegramLog2) await sendTelegramLog2(`\u{1F5D1}\uFE0F ADMIN HAPUS VPN`, `Admin menghapus akun VPN secara permanen.
ID VPN: ${vpnId}
Username: ${vpnRecord.username}
Email Pemilik: ${vpnRecord.email}`, appSettings);
      } else if (action === "renew") {
        await env.DB.prepare("UPDATE vpns SET exp = exp || ? WHERE id = ?").bind(` (+${extraData} Hari)`, vpnId).run();
        const userTitle = `[RENEW] Perpanjangan Berhasil!`;
        const userMsg = `Masa aktif akun VPN <b>${vpnRecord.username}</b> Anda telah berhasil diperpanjang oleh Admin sebanyak <b>${extraData} Hari</b>.`;
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(vpnRecord.email, userTitle, userMsg, now).run();
        const adminTitle = `[ADMIN RENEW] Perpanjangan ${vpnRecord.username}`;
        const adminMsg = `Anda berhasil memperpanjang akun VPN <b>${vpnRecord.username}</b> milik user <b>${vpnRecord.email}</b> sebanyak <b>${extraData} Hari</b>.`;
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(currentUser.email, adminTitle, adminMsg, now).run();
        if (sendTelegramLog2) await sendTelegramLog2(`\u{1F504} ADMIN RENEW VPN`, `Admin memperpanjang akun VPN.
Username: ${vpnRecord.username}
Email Pemilik: ${vpnRecord.email}
Ditambah: ${extraData} Hari`, appSettings);
      } else if (action === "change_uuid") {
        const uuidInfo = extraData && extraData !== "random" ? `menjadi <b>${extraData}</b>` : `dengan UUID acak baru`;
        const userTitle = `[UPDATE] Konfigurasi UUID VPN Diganti`;
        const userMsg = `UUID untuk akun VPN <b>${vpnRecord.username}</b> Anda telah diperbarui ${uuidInfo} oleh sistem.\\n\\nBerikut adalah detail konfigurasi terbaru Anda:<br><br><div class="bg-gray-950 p-4 rounded-lg overflow-x-auto custom-scrollbar border border-gray-800"><pre class="text-green-400 font-mono text-[11px] leading-relaxed select-all whitespace-pre-wrap">${resultText}</pre></div>`;
        await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(vpnRecord.email, userTitle, userMsg, now).run();
        if (sendTelegramLog2) await sendTelegramLog2(`\u{1F511} ADMIN GANTI UUID VPN`, `Admin mengganti UUID akun VPN.
Username: ${vpnRecord.username}
Email Pemilik: ${vpnRecord.email}`, appSettings);
      }
      return jsonResponse({ success: true, resultText });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/backup" && request.method === "GET") {
    try {
      const backupData = await generateBackupData(env);
      return new Response(JSON.stringify(backupData, null, 2), {
        headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="backup.json"' }
      });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/backup-telegram" && request.method === "POST") {
    try {
      const botToken = appSettings.telegram_bot_token;
      const chatId = appSettings.telegram_channel_id;
      if (!botToken || !chatId) {
        return jsonResponse({ success: false, message: "Bot Token atau Chat ID Telegram belum dikonfigurasi!" }, 400);
      }
      const backupObj = await generateBackupData(env);
      const { users, vpns, inbox, invoices, settings, licenses } = backupObj;
      const dateMatch = now.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const todayStr = dateMatch ? dateMatch[0] : "";
      const monthStr = dateMatch ? `${dateMatch[2]}/${dateMatch[3]}` : "";
      const totalUsers = users.length;
      const totalVpns = vpns.filter((v) => !v.exp.toLowerCase().includes("jam")).length;
      const totalServers = appSettings.servers ? appSettings.servers.length : 0;
      const totalSaldo = users.reduce((sum, u) => sum + (u.balance || 0), 0);
      const paidInvoices = invoices.filter((i) => i.status === "PAID");
      const xlPurchases = inbox.filter((i) => i.title && i.title.includes("[SUKSES] Pembelian Paket XL"));
      const totalTransactions = paidInvoices.length + vpns.length + xlPurchases.length;
      const vpnsThisMonth = vpns.filter((v) => v.date && v.date.includes(monthStr));
      const topupThisMonth = paidInvoices.filter((i) => i.date && i.date.includes(monthStr)).reduce((sum, i) => sum + (i.amount || 0), 0);
      const xlThisMonth = xlPurchases.filter((i) => i.date && i.date.includes(monthStr)).length;
      let vpnMonthDetails = "";
      const serversList = appSettings.servers || [];
      serversList.forEach((srv) => {
        const countSrv = vpnsThisMonth.filter((v) => v.server === srv.name).length;
        vpnMonthDetails += `- ${srv.name}: ${countSrv}
`;
      });
      const vpnsToday = vpns.filter((v) => v.date && v.date.includes(todayStr));
      const topupToday = paidInvoices.filter((i) => i.date && i.date.includes(todayStr)).reduce((sum, i) => sum + (i.amount || 0), 0);
      const xlToday = xlPurchases.filter((i) => i.date && i.date.includes(todayStr)).length;
      let vpnTodayDetails = "";
      serversList.forEach((srv) => {
        const countSrv = vpnsToday.filter((v) => v.server === srv.name).length;
        vpnTodayDetails += `- ${srv.name}: ${countSrv}
`;
      });
      const captionHtml = `<b>\u{1F4CA} Statistik Warung Pulsa</b>

Pengguna: ${totalUsers}
Transaksi: ${totalTransactions}
Akun VPN: ${totalVpns}
Server: ${totalServers}
Saldo: Rp ${totalSaldo.toLocaleString("id-ID")}

<b>Bulan ini:</b>
Top Up: Rp ${topupThisMonth.toLocaleString("id-ID")}
Pembelian paket XL : ${xlThisMonth} transaksi
Pembuatan Akun: ${vpnsThisMonth.length}
${vpnMonthDetails}
<b>Hari ini:</b>
Top Up: Rp ${topupToday.toLocaleString("id-ID")}
Pembelian paket XL : ${xlToday} transaksi
Pembuatan Akun: ${vpnsToday.length}
${vpnTodayDetails}
#warungpulsabackup`;
      const backupData = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([backupData], { type: "application/json" });
      await saveBackupToR2(env, backupObj, now);
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", captionHtml);
      formData.append("parse_mode", "HTML");
      formData.append("document", blob, `Backup_WarungPulsa_${now.replace(/[\s:]/g, "_")}.json`);
      const tgReq = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: formData
      });
      const tgRes = await tgReq.json();
      if (!tgRes.ok) {
        return jsonResponse({ success: false, message: tgRes.description || "Gagal mengirim ke Telegram" }, 500);
      }
      let rekapText = `Rekap saldo pengguna
Total : Rp.${totalSaldo.toLocaleString("id-ID")}

`;
      rekapText += "NO | Akun                          | Saldo      |\n";
      users.forEach((u, i) => {
        const no = String(i + 1).padEnd(2, " ");
        const email = u.email.padEnd(29, " ");
        const balance = (u.balance || 0).toLocaleString("id-ID").padEnd(10, " ");
        rekapText += `${no} | ${email} | ${balance} |
`;
      });
      const timeMatch = now.match(/(\d{2})[:\.](\d{2})/);
      const fileNameTime = dateMatch && timeMatch ? `${dateMatch[1]}${dateMatch[2]}${dateMatch[3]}_${timeMatch[1]}${timeMatch[2]} WIB` : "now";
      const rekapBlob = new Blob([rekapText], { type: "text/plain" });
      const rekapFormData = new FormData();
      rekapFormData.append("chat_id", chatId);
      rekapFormData.append("document", rekapBlob, `rekap saldo user ${fileNameTime}.txt`);
      await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: rekapFormData
      });
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  if (url.pathname === "/api/admin/restore" && request.method === "POST") {
    try {
      const data = await request.json();
      if (!data.users || !data.vpns || !data.inbox || !data.invoices || !data.settings) throw new Error("Format backup tidak valid.");
      await env.DB.batch([
        env.DB.prepare("DELETE FROM users"),
        env.DB.prepare("DELETE FROM vpns"),
        env.DB.prepare("DELETE FROM inbox"),
        env.DB.prepare("DELETE FROM invoices"),
        env.DB.prepare("DELETE FROM settings")
      ]);
      try {
        await env.DB.prepare("DELETE FROM licenses").run();
      } catch (e) {
      }
      try {
        await env.DB.prepare("DELETE FROM transactions").run();
      } catch (e) {
      }
      try {
        await env.DB.prepare("DELETE FROM tickets").run();
      } catch (e) {
      }
      try {
        await env.DB.prepare("DELETE FROM ticket_replies").run();
      } catch (e) {
      }
      try {
        await env.DB.prepare("DELETE FROM ai_usage").run();
      } catch (e) {
      }
      const stmts = [];
      for (const u of data.users) stmts.push(env.DB.prepare("INSERT INTO users (email, name, phone, balance, is_blocked) VALUES (?, ?, ?, ?, ?)").bind(u.email, u.name, u.phone, u.balance, u.is_blocked || 0));
      for (const v of data.vpns) stmts.push(env.DB.prepare("INSERT INTO vpns (id, email, server, protocol, username, date, exp) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(v.id, v.email, v.server, v.protocol, v.username, v.date, v.exp));
      for (const i of data.inbox) stmts.push(env.DB.prepare("INSERT INTO inbox (id, email, title, message, date, read) VALUES (?, ?, ?, ?, ?, ?)").bind(i.id, i.email, i.title, i.message, i.date, i.read));
      for (const inv of data.invoices) stmts.push(env.DB.prepare("INSERT INTO invoices (id, ref, email, amount, status, date) VALUES (?, ?, ?, ?, ?, ?)").bind(inv.id, inv.ref, inv.email, inv.amount, inv.status, inv.date));
      for (const s of data.settings) stmts.push(env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").bind(s.key, s.value));
      for (const l of data.licenses || []) {
        stmts.push(env.DB.prepare("INSERT INTO licenses (id, email, vps_name, ip_address, expires_at, created_at, subdomain, cf_record_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(l.id, l.email, l.vps_name, l.ip_address, l.expires_at, l.created_at, l.subdomain || null, l.cf_record_id || null));
      }
      for (const t of data.transactions || []) {
        stmts.push(env.DB.prepare("INSERT INTO transactions (id, email, type, amount, description, balance, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(t.id, t.email, t.type, t.amount, t.description, t.balance, t.created_at));
      }
      for (const tk of data.tickets || []) {
        stmts.push(env.DB.prepare("INSERT INTO tickets (id, email, subject, category, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(tk.id, tk.email, tk.subject, tk.category, tk.status, tk.created_at, tk.updated_at));
      }
      for (const tr of data.ticket_replies || []) {
        stmts.push(env.DB.prepare("INSERT INTO ticket_replies (id, ticket_id, sender_type, message, created_at) VALUES (?, ?, ?, ?, ?)").bind(tr.id, tr.ticket_id, tr.sender_type, tr.message, tr.created_at));
      }
      for (const au of data.ai_usage || []) {
        stmts.push(env.DB.prepare("INSERT INTO ai_usage (email, count, slot) VALUES (?, ?, ?)").bind(au.email, au.count, au.slot));
      }
      const BATCH_SIZE = 90;
      for (let i = 0; i < stmts.length; i += BATCH_SIZE) await env.DB.batch(stmts.slice(i, i + BATCH_SIZE));
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  return null;
}
__name(handleAdminRoutes, "handleAdminRoutes");
__name2(handleAdminRoutes, "handleAdminRoutes");
__name22(handleAdminRoutes, "handleAdminRoutes");
__name222(handleAdminRoutes, "handleAdminRoutes");
function renderMutasiPage(currentUser) {
  return `
    <div class="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        <h1 class="text-3xl font-black text-white mb-2 tracking-tight">Riwayat Mutasi Saldo</h1>
        <p class="text-gray-400 text-sm mb-8">Pantau arus kas masuk dan keluar dari dompet Anda.</p>
        
        <div class="bg-gray-800 rounded-3xl border border-gray-700 shadow-xl overflow-hidden">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead class="bg-gray-950 text-gray-400 border-b border-gray-700">
                        <tr>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Tanggal</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs">Deskripsi Transaksi</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-right">Nominal</th>
                            <th class="p-4 font-bold uppercase tracking-wider text-xs text-right">Sisa Saldo</th>
                        </tr>
                    </thead>
                    <tbody id="mutasiTableBody" class="divide-y divide-gray-800">
                        <tr><td colspan="4" class="p-8 text-center text-cyan-400 animate-pulse">Memuat data transaksi...</td></tr>
                    </tbody>
                </table>
            </div>
            <!-- Pagination Controls -->
            <div class="p-4 bg-gray-900/50 border-t border-gray-700 flex items-center justify-between gap-4 flex-wrap">
                <button id="prevBtn" onclick="changePage(currentPage - 1)" class="bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Sebelum
                </button>
                <span id="pageIndicator" class="text-xs text-gray-400 font-medium">Halaman 1 dari 1</span>
                <button id="nextBtn" onclick="changePage(currentPage + 1)" class="bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                    Berikut <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </div>
    </div>

    <script>
        let currentPage = 1;
        let totalPages = 1;

        async function loadMutasi(page = 1) {
            currentPage = page;
            const tbody = document.getElementById('mutasiTableBody');
            const pageIndicator = document.getElementById('pageIndicator');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            try {
                const res = await fetch('/api/transactions?page=' + page + '&limit=10');
                const data = await res.json();
                
                if (data.success) {
                    if (data.data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-500">Belum ada riwayat transaksi.</td></tr>';
                        pageIndicator.innerText = 'Halaman 1 dari 1';
                        prevBtn.disabled = true;
                        nextBtn.disabled = true;
                    } else {
                        tbody.innerHTML = data.data.map(trx => {
                            const isMasuk = trx.type === 'IN';
                            const nominalClass = isMasuk ? 'text-green-400' : 'text-cyan-400';
                            const sign = isMasuk ? '+' : '-';
                            
                            let sisaSaldoText = '-';
                            if (trx.balance !== undefined && trx.balance !== null) {
                                sisaSaldoText = 'Rp ' + trx.balance.toLocaleString('id-ID');
                            }
                            
                            const dateParts = trx.created_at ? trx.created_at.split(', ') : ['', ''];
                            const dateHtml = dateParts[1] ? \`\${dateParts[0]}<br>\${dateParts[1]}\` : (trx.created_at || '-');
                            
                            return \`
                            <tr class="hover:bg-gray-800/50 transition">
                                <td class="p-4 font-mono text-xs text-gray-500">\${dateHtml}</td>
                                <td class="p-4 text-white font-medium leading-snug text-[11px]" style="font-family: 'Arial Narrow', Arial, sans-serif;">\${escapeHtmlClient(trx.description)}</td>
                                <td class="p-4 font-mono font-bold text-right \${nominalClass}">\${sign} Rp \${trx.amount.toLocaleString('id-ID')}</td>
                                <td class="p-4 font-mono font-bold text-right text-gray-300">\${sisaSaldoText}</td>
                            </tr>\`;
                        }).join('');
                        
                        const pg = data.pagination;
                        totalPages = pg.totalPages;
                        pageIndicator.innerText = 'Halaman ' + pg.page + ' dari ' + pg.totalPages + ' (Total ' + pg.total + ' Transaksi)';
                        prevBtn.disabled = pg.page <= 1;
                        nextBtn.disabled = pg.page >= pg.totalPages;
                    }
                } else {
                    tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-sky-400">Gagal mengambil data.</td></tr>';
                }
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-sky-400">Kesalahan koneksi internet.</td></tr>';
            }
        }
        
        function changePage(page) {
            if (page >= 1 && page <= totalPages) {
                loadMutasi(page);
            }
        }
        
        // Panggil saat halaman dimuat
        loadMutasi(1);
    <\/script>
    `;
}
__name(renderMutasiPage, "renderMutasiPage");
__name2(renderMutasiPage, "renderMutasiPage");
__name22(renderMutasiPage, "renderMutasiPage");
__name222(renderMutasiPage, "renderMutasiPage");
async function handleMutasiAPI(request, env, currentUser) {
  if (!currentUser) {
    return jsonResponse({ success: false, message: "Unauthorized" }, 401);
  }
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    const totalRow = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM transactions WHERE email = ?"
    ).bind(currentUser.email).first();
    const total = totalRow ? totalRow.count : 0;
    const totalPages = Math.ceil(total / limit) || 1;
    const { results } = await env.DB.prepare(
      "SELECT * FROM transactions WHERE email = ? ORDER BY id DESC LIMIT ? OFFSET ?"
    ).bind(currentUser.email, limit, offset).all();
    return jsonResponse({
      success: true,
      data: results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (e) {
    return jsonResponse({ success: false, message: e.message }, 500);
  }
}
__name(handleMutasiAPI, "handleMutasiAPI");
__name2(handleMutasiAPI, "handleMutasiAPI");
__name22(handleMutasiAPI, "handleMutasiAPI");
__name222(handleMutasiAPI, "handleMutasiAPI");
async function handleAIRoutes(url, request, env, currentUser, ctx) {
  if (url.pathname === "/api/ai/chat" && request.method === "POST") {
    if (!currentUser) return jsonResponse({ success: false, message: "Silakan login terlebih dahulu untuk chat dengan AI." }, 401);
    try {
      const { message, history: rawHistory = [] } = await request.json();
      const history = [];
      if (Array.isArray(rawHistory)) {
        for (const h of rawHistory) {
          if (h && typeof h === "object" && typeof h.content === "string") {
            if (h.role === "user" || h.role === "assistant") {
              history.push({ role: h.role, content: h.content });
            }
          }
        }
      }
      const email = currentUser.email;
      const isAdmin = isSuperAdmin(currentUser, env);
      const userName = currentUser.name ? currentUser.name.split(" ")[0] : "Sobat";
      let appSettings = await getAppSettings(env);
      const currentPrice = appSettings.price_per_day || 233;
      const p10 = currentPrice * 10;
      const p20 = currentPrice * 20;
      const p30 = currentPrice * 30;
      const p60 = currentPrice * 60;
      const p90 = currentPrice * 90;
      if (appSettings.ai_chat_active === false && !isAdmin) {
        return jsonResponse({ success: false, message: "Ngapunten, fitur Asisten AI saweg dipateni (dimatikan) dening Admin." }, 403);
      }
      const serverListStr = (appSettings.servers || []).map((s, index) => `${index + 1}. ID: ${s.id} | Nama: ${s.name}`).join("\n");
      let dynamicSystemPrompt = `
Kamu adalah "Asisten Digital Warung Pulsa", seorang pemuda ramah asal Jawa yang asik tapi tetap sopan, serta memiliki nilai-nilai Islami.

KEPRIBADIAN & BAHASA:
- Gunakan Bahasa Indonesia yang santai, bersahabat, dan sopan sebagai bahasa utama.
- Unsur etnis Jawa (seperti kata: nggih, monggo, pripun, matur nuwun) hanya digunakan sesekali saja.
- Selalu gunakan salam "Assalamu'alaikum" jika disapa pertama kali.
- Panggil user langsung dengan namanya "${userName}" tanpa embel-embel Mas/Mbak/Kak.

INFORMASI USER SAAT INI:
- Nama Panggilan: ${userName}
- Saldo Saat Ini: Rp ${(currentUser.balance || 0).toLocaleString("id-ID")}

DAFTAR HARGA VPN (PASTI & JANGAN MENGARANG MATEMATIKA SENDIRI):
- 10 hari = Rp ${p10.toLocaleString("id-ID")}
- 20 hari = Rp ${p20.toLocaleString("id-ID")}
- 30 hari = Rp ${p30.toLocaleString("id-ID")}
- 60 hari = Rp ${p60.toLocaleString("id-ID")}
- 90 hari = Rp ${p90.toLocaleString("id-ID")}
- Trial 1 Jam = Gratis (Rp 0)

INFORMASI CARA TOP UP SALDO (PENTING):
Jika user bertanya bagaimana cara top up atau isi saldo, beritahu mereka dengan ramah: "Untuk mengisi saldo, silakan tutup jendela chat ini sebentar, lalu klik tombol atau menu 'Top Up' yang ada di halaman utama aplikasi. Di sana kamu bisa memilih nominal dan metode pembayarannya (QRIS Otomatis atau Manual) ya." JANGAN memberikan link eksternal untuk top up.

PENGETAHUAN PRODUK & TROUBLESHOOTING (WAJIB TAHU UNTUK MENJAWAB PERTANYAAN USER):
- Panduan Protokol: Trojan sangat direkomendasikan untuk Game Online (karena ping sangat rendah & ringan). VMess/VLESS paling stabil untuk Streaming YouTube/browsing. SSH/L2TP cocok untuk tunneling dasar.
- Aturan Pemakaian VPN: Dilarang keras digunakan untuk Torrenting, DDOS, Hacking, atau Carding. Batas maksimal pemakaian adalah 2 Device/IP secara bersamaan. Jika melanggar, akun akan dibanned otomatis oleh server!
- Troubleshooting Klien: Jika VPN "konek tapi bengong" (tidak ada akses internet), arahkan user untuk melakukan Mode Pesawat (ON/OFF 5 detik) untuk merefresh jaringan atau ganti Bug/SNI. Jika susah konek, minta user mengecek sisa kuota/opok mereka.
- Seputar Tembak Paket XL (KMSP): Jika SMS OTP MyXL tidak masuk, beritahu user bahwa sistem pusat kadang delay dan minta mereka mencoba lagi setelah 5 menit. Jelaskan juga bahwa pembayaran metode E-Wallet hanya memotong saldo web untuk "Biaya Admin" saja, sedangkan harga paket asli dibayar langsung via aplikasi e-wallet (DANA/Gopay) pengguna.
- Info Top Up: QRIS Otomatis (ShopeePay / GoPay) akan masuk dalam hitungan detik. QRIS Manual harus transfer sesuai nominal unik dan wajib menekan tombol Konfirmasi.

DAFTAR SERVER AKTIF (PENTING):
${serverListStr}

ATURAN SAAT DITANYA SALDO:
Jika user hanya bertanya saldo (contoh: "cek saldo", "sisa saldo"), cukup sebutkan Saldo Saat Ini. JANGAN membahas/melanjutkan pesanan VPN jika memang pesanannya sudah selesai atau user tidak memintanya.

FITUR PEMBELIAN VPN INTERAKTIF (URUTAN WAJIB):
Pandu user secara BERTAHAP (SATU PER SATU). JANGAN menanyakan semuanya sekaligus dalam satu balasan.

1. Langkah 1 (Tanya PROTOKOL): Tampilkan list angka 1-5 (SSH, VMess, VLESS, Trojan, L2TP). TUNGGU JAWABAN.
2. Langkah 2 (Tanya SERVER): Tampilkan "DAFTAR SERVER AKTIF" di atas menggunakan angka urutan. TUNGGU JAWABAN.
3. Langkah 3 (Tanya DURASI): Tampilkan list angka 1-6 (10, 20, 30, 60, 90 hari, atau 6. Trial 1 Jam). TUNGGU JAWABAN.
4. Langkah 4 (Tanya USERNAME): 
   - JIKA USER MEMILIH TRIAL (6): JANGAN TANYA USERNAME! LANGSUNG LOMPAT KE LANGKAH 5.
   - JIKA BERBAYAR (1-5): Minta user membuat username (huruf/angka, maks 15 karakter). TUNGGU JAWABAN.
5. Langkah 5 (Konfirmasi & CEK SALDO): Sebutkan rincian pesanan dan Total Harga (ambil dari DAFTAR HARGA VPN di atas). 
   - WAJIB CEK SALDO: Bandingkan Total Harga dengan "Saldo Saat Ini" (Rp ${(currentUser.balance || 0).toLocaleString("id-ID")}). 
   - Jika saldo kurang, beritahu dengan sopan bahwa saldonya tidak cukup dan arahkan untuk Top Up. JANGAN LANJUT KE LANGKAH 6.
   - Jika saldo cukup atau pesanan gratis, katakan "Saldo kamu cukup" lalu tanyakan konfirmasi persetujuan.
6. Langkah 6 (Eksekusi): Jika user menjawab "YA" atau "SETUJU" pada saat konfirmasi pesanan, KAMU WAJIB MERESPON HANYA DENGAN KODE INI SAJA (TANPA BASA-BASI LAIN):
   [ACTION_BUY_VPN:protokol:serverId:durasi:username]
   - protokol: ssh, vmessws, vlessws, trojanws, l2tp
   - durasi: 10, 20, 30, 60, 90, trial
   - username: huruf/angka (maks 15 karakter). Jika TRIAL, KOSONGKAN/ABAIKAN saja bagian ini.
   Contoh Berbayar yang Benar: [ACTION_BUY_VPN:vmessws:srv1:10:depsek2]
   Contoh Trial yang Benar: [ACTION_BUY_VPN:vmessws:srv1:trial]
   PENTING: Jangan tulis kalimat apapun selain kode siku tersebut agar sistem backend bisa membaca pesanan!

FITUR PERPANJANG VPN (RENEW):
Jika user meminta memperpanjang akun VPN miliknya, ikuti langkah ini:
1. Tanya username VPN yang mau diperpanjang (jika user belum menyebutkannya).
2. Tanya durasi perpanjangan (10, 20, 30, 60, atau 90 hari). Trial tidak berlaku.
3. Sebutkan Total Harga dan cek Saldo Saat Ini.
4. Jika user Setuju/Ya, keluarkan HANYA kode ini: [ACTION_RENEW_VPN:username_vpn:durasi_angka]
   Contoh: [ACTION_RENEW_VPN:depsek2:30]

FITUR CEK PULSA & KUOTA XL (INTERAKTIF):
Jika user meminta "cek pulsa", "cek kuota", "cek lokasi", tanyakan nomor XL/Axis mereka (misal: "Boleh ketik nomor XL/Axis-nya yang mau dicek?").
Jika user memberikan nomor HP (contoh: 0819xxx), KAMU WAJIB MERESPON HANYA DENGAN KODE INI SAJA (TANPA BASA-BASI LAIN):
[ACTION_CHECK_PULSA:nomor_hp]
Contoh: [ACTION_CHECK_PULSA:081912345678]

TUGAS SETELAH EKSEKUSI BERHASIL:
Jika sistem memberikan pesan balasan "[SYSTEM RESPONSE]: ...", kamu WAJIB membalas user dengan menampilkan teks informasi/konfigurasi tersebut SECARA UTUH DAN LENGKAP agar user bisa menyalinnya langsung dari layar chat ini.

ATURAN PENGALIHAN LINK:
Berikan link berikut hanya jika ditanyakan spesifik:
- Cek Pulsa: /cekpulsa-otp
- Converter: /converter
- Group Telegram: https://t.me/srpcomgroup
- Channel Telegram: https://t.me/srpcomchannel
- Admin/CS: https://t.me/srpcomadmin
- Email: cs1@warungpulsa.com

ATURAN KEAMANAN:
- Dilarang membocorkan API Key, Kredensial, atau struktur Database.
- Dilarang keras menampilkan kode [ACTION_...] kepada user di layar chat.
- Hanya Admin yang bisa menambah saldo.
`;
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      const todayDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const slotKey = `${todayDate}-${currentHour}`;
      let usage = await env.DB.prepare("SELECT count, slot FROM ai_usage WHERE email = ?").bind(email).first();
      if (!usage) {
        await env.DB.prepare("INSERT INTO ai_usage (email, count, slot) VALUES (?, 1, ?)").bind(email, slotKey).run();
      } else {
        if (usage.slot !== slotKey) {
          await env.DB.prepare("UPDATE ai_usage SET count = 1, slot = ? WHERE email = ?").bind(slotKey, email).run();
        } else {
          if (usage.count >= 50 && !isAdmin) {
            return jsonResponse({ success: false, message: "Waduh, batas chat AI sudah mencapai limit (Maks 50x per jam). Coba lagi jam depan ya!" }, 429);
          }
          await env.DB.prepare("UPDATE ai_usage SET count = count + 1 WHERE email = ?").bind(email).run();
        }
      }
      if (isAdmin) {
        dynamicSystemPrompt += `


===================================
\u{1F6A8} MODE ADMIN SANGAT KETAT \u{1F6A8}
Lawan bicaramu adalah ADMIN. JANGAN PERNAH MENGARANG CERITA ATAU MEMBUAT ROLEPLAY!
Jika Admin meminta tindakan sistem (seperti tambah saldo, kurangi saldo, dll), KAMU WAJIB HANYA MEMBALAS DENGAN KODE SIKU SAJA! TIDAK BOLEH ADA TEKS LAIN!

CONTOH YANG BENAR:
Admin: "tambah saldo budi@gmail.com 20000"
Balasanmu: [ACTION_ADD_BALANCE:budi@gmail.com:20000]

CONTOH YANG SALAH (DILARANG KERAS):
Admin: "tambah saldo budi@gmail.com 20000"
Balasanmu: "Sistem telah menambah saldo..." ATAU "[ADMIN RESPONSE]..."

DAFTAR KODE (PILIH SALAH SATU DAN KETIK TANPA BASA-BASI):
- Tambah Saldo: [ACTION_ADD_BALANCE:email:nominal]
- Kurangi Saldo: [ACTION_DEDUCT_BALANCE:email:nominal]
- Cek Statistik: [DB_STATS]
- Cek User: [DB_USER:email]
- VPN Terbaru: [DB_RECENT_VPN]
- Cari VPN: [DB_SEARCH_VPN:kata_kunci]
- Detail VPN: [DB_DETAIL_VPN:username]
- Backup: [DB_BACKUP_TELEGRAM]
- Mutasi Global: [DB_RECENT_TRANSACTIONS]
- Mutasi User: [DB_USER_TRANSACTIONS:email]
===================================`;
      }
      let messages = [{ role: "system", content: dynamicSystemPrompt }, ...history.slice(-20), { role: "user", content: message }];
      let finalReply = `Mohon maaf ${userName}, server AI saya sedang sedikit sibuk. Bisa dicoba lagi sebentar lagi?`;
      let maxLoops = 2;
      for (let i = 0; i < maxLoops; i++) {
        let reply = "";
        let aiProvider = appSettings.ai_provider || "cloudflare";
        if (aiProvider === "deepseek") {
          if (!env.DEEPSEEK_API_KEY) throw new Error("API Key DeepSeek belum diatur di Secrets Cloudflare.");
          const dsRes = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
              model: "deepseek-v4-flash",
              messages,
              max_tokens: 600,
              temperature: 0.4
            })
          });
          if (!dsRes.ok) throw new Error(`DeepSeek API Error: ${dsRes.status} ${await dsRes.text()}`);
          const dsData = await dsRes.json();
          reply = dsData.choices[0].message.content;
        } else if (aiProvider === "gemini") {
          const geminiApiKey = env.GEMINI_API_KEY || "AIzaSyA40MjBzjfrz5USxbksV61M-B6aMc3NP_0";
          const geminiContents = [];
          let systemInstructionText = "";
          for (const msg of messages) {
            if (msg.role === "system") {
              systemInstructionText = msg.content;
            } else {
              const geminiRole = msg.role === "assistant" ? "model" : "user";
              geminiContents.push({
                role: geminiRole,
                parts: [{ text: msg.content }]
              });
            }
          }
          const geminiRequestBody = {
            contents: geminiContents
          };
          if (systemInstructionText) {
            geminiRequestBody.systemInstruction = {
              parts: [{ text: systemInstructionText }]
            };
          }
          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(geminiRequestBody)
          });
          if (!geminiRes.ok) throw new Error(`Gemini API Error: ${geminiRes.status} ${await geminiRes.text()}`);
          const geminiData = await geminiRes.json();
          reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        } else {
          const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { messages, max_tokens: 600, temperature: 0.4 });
          reply = aiResponse.response || aiResponse.choices?.[0]?.message?.content;
        }
        if (!reply) break;
        reply = reply.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        let buyVpnMatch = reply.match(/ACTION_BUY_VPN\s*:\s*([^:]+)\s*:\s*([^:]+)\s*:\s*([^:\]\n]+)(?:\s*:\s*([^\]\n]*))?/i);
        let renewVpnMatch = reply.match(/ACTION_RENEW_VPN\s*:\s*([^:\s\]]+)\s*:\s*([^\]\n]+)/i);
        let checkPulsaMatch = reply.match(/ACTION_CHECK_PULSA\s*:\s*([^\]\n]+)/i);
        let statsMatch = isAdmin ? reply.match(/DB_STATS/i) : null;
        let userMatch = isAdmin ? reply.match(/DB_USER\s*:\s*([^\]\n\s]+)/i) : null;
        let recentVpnMatch = isAdmin ? reply.match(/DB_RECENT_VPN/i) : null;
        let searchVpnMatch = isAdmin ? reply.match(/DB_SEARCH_VPN\s*:\s*([^\]\n]+)/i) : null;
        let detailVpnMatch = isAdmin ? reply.match(/DB_DETAIL_VPN\s*:\s*([^\]\n\s]+)/i) : null;
        let backupMatch = isAdmin ? reply.match(/DB_BACKUP_TELEGRAM/i) : null;
        let recentTrxMatch = isAdmin ? reply.match(/DB_RECENT_TRANSACTIONS/i) : null;
        let userTrxMatch = isAdmin ? reply.match(/DB_USER_TRANSACTIONS\s*:\s*([^\]\n\s]+)/i) : null;
        let addBalanceMatch = isAdmin ? reply.match(/ACTION_ADD_BALANCE\s*:\s*([^:\s\]]+)\s*:\s*([^\]\n]+)/i) : null;
        let deductBalanceMatch = isAdmin ? reply.match(/ACTION_DEDUCT_BALANCE\s*:\s*([^:\s\]]+)\s*:\s*([^\]\n]+)/i) : null;
        if (buyVpnMatch || renewVpnMatch || checkPulsaMatch || statsMatch || userMatch || recentVpnMatch || searchVpnMatch || detailVpnMatch || backupMatch || recentTrxMatch || userTrxMatch || addBalanceMatch || deductBalanceMatch) {
          let dbResult = "";
          let priceToRefund = 0;
          let refundProtocol = "";
          try {
            if (checkPulsaMatch) {
              let phone = checkPulsaMatch[1].replace(/[^0-9]/g, "");
              if (!env.KMSP_API_KEY) {
                dbResult = "GAGAL: API Key KMSP belum disetel oleh Admin.";
              } else {
                const tokenListRes = await KMSP.getAccessTokenList(env.KMSP_API_KEY, phone);
                let hasSession = false;
                if (tokenListRes.success && tokenListRes.data && tokenListRes.data.length > 0) {
                  const activeTokenObj = tokenListRes.data.find((t) => String(t.msisdn).includes(phone) || String(phone).includes(String(t.msisdn)));
                  if (activeTokenObj) {
                    const authIdToken = `${activeTokenObj.session_id}:${activeTokenObj.token}`;
                    const extendRes = await KMSP.extendSession(env.KMSP_API_KEY, phone, authIdToken);
                    if (extendRes.success && extendRes.data && extendRes.data.access_token) {
                      hasSession = true;
                      const accessToken = extendRes.data.access_token;
                      const [infoRes, quotaRes, locRes] = await Promise.all([
                        KMSP.cekPulsaMasaAktif(env.KMSP_API_KEY, accessToken),
                        KMSP.cekPaketAktif(env.KMSP_API_KEY, accessToken),
                        KMSP.cekLokasi(env.KMSP_API_KEY, accessToken)
                      ]);
                      if (infoRes.success) {
                        let quotaDetails = "";
                        if (quotaRes.success && quotaRes.data && quotaRes.data.quotas) {
                          quotaRes.data.quotas.forEach((q) => {
                            quotaDetails += `
- **${q.name || "Paket Data"}** (Aktif s.d ${q.expired_at || "-"}):`;
                            if (q.benefits && Array.isArray(q.benefits)) {
                              q.benefits.forEach((b) => {
                                quotaDetails += `
  \u2022 ${b.name}: Sisa ${b.remaining_quota || b.remaining || "-"} / ${b.quota || b.total || "-"}`;
                              });
                            }
                          });
                        } else {
                          quotaDetails = "\n- Tidak ada paket/kuota aktif ditemukan.";
                        }
                        let loc = locRes.success && locRes.data ? locRes.data.location : "Tidak Terdeteksi";
                        dbResult = `DATA XL (BERHASIL):
Nomor: ${infoRes.data.msisdn}
Status: ${infoRes.data.subscription_status}
Lokasi: ${loc}
Pulsa: ${infoRes.data.pulsa_real || infoRes.data.pulsa || "Rp 0"}
Masa Aktif: ${infoRes.data.active_until || "-"}

Detail Kuota:${quotaDetails}

TUGASMU: Beritahu data detail di atas kepada user dengan gaya yang sangat rapi, santai, dan gunakan bullet points tanpa mengubah isi angka/data aslinya.`;
                      } else {
                        dbResult = `GAGAL: ${infoRes.message}`;
                      }
                    }
                  }
                }
                if (!hasSession) {
                  dbResult = `GAGAL: Nomor ${phone} belum memiliki sesi OTP aktif di sistem. TUGASMU: Beritahu user dengan santai "Wah, nomor ${phone} belum terverifikasi OTP nih. Silakan login OTP dulu melalui menu 'Cekpulsa / OTP' atau 'Paket Data XL' di layar kamu ya. Setelah berhasil verifikasi di sana, kamu bisa balik lagi ke sini dan minta saya cek!"`;
                }
              }
            } else if (addBalanceMatch || deductBalanceMatch) {
              let activeMatch = addBalanceMatch ? addBalanceMatch : deductBalanceMatch;
              let targetEmail = activeMatch[1].trim().toLowerCase();
              let amountStr = activeMatch[2].trim().replace(/[^0-9]/g, "");
              let parsedAmount = parseInt(amountStr);
              if (isNaN(parsedAmount) || parsedAmount === 0) {
                dbResult = `TINDAKAN (GAGAL): Nominal tidak valid (harus angka). Nominal terbaca: ${amountStr}`;
              } else {
                let amount = addBalanceMatch ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);
                let u = await env.DB.prepare("SELECT email, balance FROM users WHERE LOWER(email) = ?").bind(targetEmail).first();
                if (!u) {
                  dbResult = `TINDAKAN (GAGAL): User dengan email '${targetEmail}' tidak ditemukan.`;
                } else {
                  let actualEmail = u.email;
                  await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(amount, actualEmail).run();
                  let newU = await env.DB.prepare("SELECT balance FROM users WHERE email = ?").bind(actualEmail).first();
                  let newBalance = newU ? newU.balance : 0;
                  const now = getWIBTime();
                  const mutasiType = amount > 0 ? "IN" : "OUT";
                  const mutasiDesc = amount > 0 ? "Penambahan Saldo oleh Admin (via AI)" : "Pengurangan Saldo oleh Admin (via AI)";
                  await env.DB.prepare("INSERT INTO transactions (email, type, amount, description, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(actualEmail, mutasiType, Math.abs(amount), mutasiDesc, newBalance, now).run();
                  const isAddition = amount > 0;
                  const absValue = Math.abs(amount).toLocaleString("id-ID");
                  const actionText = isAddition ? "Penambahan" : "Pengurangan";
                  const actionVerb = isAddition ? "ditambahkan" : "dikurangi";
                  const colorClass = isAddition ? "text-green-400" : "text-cyan-400";
                  const userTitle = `[SALDO] ${actionText} Saldo`;
                  const userMsg = `Saldo Anda telah ${actionVerb} sebesar <b class="${colorClass}">Rp ${absValue}</b> oleh sistem Admin.`;
                  await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(actualEmail, userTitle, userMsg, now).run();
                  dbResult = `TINDAKAN (BERHASIL): Saldo akun ${actualEmail} berhasil ${actionVerb} sebesar Rp ${absValue}. Sisa saldo saat ini menjadi: Rp ${newBalance.toLocaleString("id-ID")}. Info mutasi dan inbox berhasil dikirim ke user.`;
                }
              }
            } else if (statsMatch) {
              const totalUsers = await env.DB.prepare("SELECT COUNT(*) as c FROM users").first("c");
              const totalSaldoRow = await env.DB.prepare("SELECT SUM(balance) as s FROM users").first();
              const totalSaldo = totalSaldoRow ? totalSaldoRow.s : 0;
              const totalVpn = await env.DB.prepare("SELECT COUNT(*) as c FROM vpns").first("c");
              dbResult = `DATA DB (BERHASIL): Total Pengguna = ${totalUsers}, Total Seluruh Saldo Semua User = Rp ${totalSaldo.toLocaleString("id-ID")}, Total VPN Aktif = ${totalVpn}`;
            } else if (userMatch) {
              let targetEmail = userMatch[1].trim().toLowerCase();
              let u = await env.DB.prepare("SELECT name, phone, balance, is_blocked FROM users WHERE LOWER(email) = ?").bind(targetEmail).first();
              if (u) {
                dbResult = `DATA DB (BERHASIL): Email = ${targetEmail}, Nama = ${u.name}, No HP = ${u.phone}, Saldo = Rp ${u.balance.toLocaleString("id-ID")}, Status = ${u.is_blocked ? "DIBLOKIR/BANNED" : "AKTIF"}`;
              } else {
                dbResult = `DATA DB (GAGAL): User dengan email ${targetEmail} TIDAK DITEMUKAN di database.`;
              }
            } else if (recentVpnMatch) {
              const { results } = await env.DB.prepare("SELECT email, username, protocol, server, exp, date FROM vpns ORDER BY id DESC LIMIT 5").all();
              if (results && results.length > 0) {
                let vpnList = results.map((v, i2) => `${i2 + 1}. Email: ${v.email}, UserVPN: ${v.username}, Protokol: ${v.protocol}, Server: ${v.server}, Tanggal: ${v.date}`).join("\n");
                dbResult = `DATA DB (BERHASIL): 5 Akun VPN Terbaru dibuat:
${vpnList}`;
              } else {
                dbResult = `DATA DB (BERHASIL): Belum ada akun VPN yang dibuat di database.`;
              }
            } else if (searchVpnMatch) {
              let keyword = searchVpnMatch[1].trim();
              const { results } = await env.DB.prepare("SELECT email, username, protocol, server, exp, date FROM vpns WHERE username LIKE ? OR email LIKE ? ORDER BY id DESC LIMIT 10").bind(`%${keyword}%`, `%${keyword}%`).all();
              if (results && results.length > 0) {
                let vpnList = results.map((v, i2) => `${i2 + 1}. Email: ${v.email}, UserVPN: ${v.username}, Protokol: ${v.protocol}, Server: ${v.server}, Exp: ${v.exp}, Tanggal: ${v.date}`).join("\n");
                dbResult = `DATA DB (BERHASIL): Ditemukan ${results.length} akun VPN dengan kata kunci '${keyword}':
${vpnList}`;
              } else {
                dbResult = `DATA DB (BERHASIL): Tidak ada akun VPN yang mengandung kata '${keyword}'.`;
              }
            } else if (detailVpnMatch) {
              let targetUser = detailVpnMatch[1].trim();
              let vpn = await env.DB.prepare("SELECT * FROM vpns WHERE username = ?").bind(targetUser).first();
              if (vpn) {
                let inboxRecord = await env.DB.prepare("SELECT message FROM inbox WHERE email = ? AND message LIKE ? ORDER BY id DESC LIMIT 1").bind(vpn.email, `%${targetUser}%`).first();
                let configText = "";
                if (inboxRecord) {
                  const matches = [...inboxRecord.message.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)];
                  configText = matches.length > 0 ? matches[matches.length - 1][1] : inboxRecord.message.replace(/<[^>]*>?/gm, "").trim();
                } else {
                  configText = "(Config detail tidak ditemukan di riwayat inbox)";
                }
                dbResult = `DATA DB (BERHASIL): Detail akun ${targetUser} berhasil ditarik dari database.
TUGASMU: Berikan balasan kepada Admin menggunakan FORMAT PERSIS SEPERTI DI BAWAH INI (Tanpa kamu ubah isi config-nya):

=================================
INFORMASI ${vpn.protocol.toUpperCase()}
=================================

Username : ${vpn.username}
Server   : ${vpn.server}
Expired  : ${vpn.exp}

*Catatan: API Cek Detail VPS tidak sinkron dengan Cloudflare. Data ditarik dari Riwayat Database.*
${configText}`;
              } else {
                dbResult = `DATA DB (GAGAL): Akun VPN dengan username '${targetUser}' tidak ditemukan.`;
              }
            } else if (recentTrxMatch) {
              const { results } = await env.DB.prepare("SELECT email, type, amount, balance, description, created_at FROM transactions ORDER BY id DESC LIMIT 10").all();
              if (results && results.length > 0) {
                let trxList = results.map((t, i2) => `${i2 + 1}. [${t.created_at}] ${t.email} | ${t.type === "IN" ? "+" : "-"}Rp${t.amount.toLocaleString("id-ID")} | Sisa: Rp${(t.balance || 0).toLocaleString("id-ID")} | Info: ${t.description}`).join("\n");
                dbResult = `DATA DB (BERHASIL): 10 Aktivitas Perubahan Saldo Terbaru secara Global:
${trxList}`;
              } else {
                dbResult = `DATA DB (BERHASIL): Belum ada riwayat perubahan saldo (mutasi) di database.`;
              }
            } else if (userTrxMatch) {
              let targetEmail = userTrxMatch[1].trim().toLowerCase();
              const { results } = await env.DB.prepare("SELECT type, amount, balance, description, created_at FROM transactions WHERE LOWER(email) = ? ORDER BY id DESC LIMIT 10").bind(targetEmail).all();
              if (results && results.length > 0) {
                let trxList = results.map((t, i2) => `${i2 + 1}. [${t.created_at}] ${t.type === "IN" ? "+" : "-"}Rp${t.amount.toLocaleString("id-ID")} | Sisa: Rp${(t.balance || 0).toLocaleString("id-ID")} | Info: ${t.description}`).join("\n");
                dbResult = `DATA DB (BERHASIL): Riwayat Mutasi untuk ${targetEmail} (10 terakhir):
${trxList}`;
              } else {
                dbResult = `DATA DB (BERHASIL): Tidak ada riwayat transaksi/mutasi untuk email ${targetEmail}.`;
              }
            } else if (backupMatch) {
              try {
                const botToken = appSettings.telegram_bot_token;
                const chatId = appSettings.telegram_channel_id;
                if (!botToken || !chatId) {
                  dbResult = "DATA DB (GAGAL): Bot Token atau Chat ID Telegram belum dikonfigurasi di Pengaturan Admin.";
                } else {
                  const backupObj = await generateBackupData(env);
                  const { users, vpns } = backupObj;
                  const nowStr = getWIBTime();
                  const dateMatch = nowStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
                  const todayStr = dateMatch ? dateMatch[0] : "";
                  const monthStr = dateMatch ? `${dateMatch[2]}/${dateMatch[3]}` : "";
                  const totalUsers = users.length;
                  const totalVpns = vpns.filter((v) => !v.exp.toLowerCase().includes("jam")).length;
                  const totalServers = appSettings.servers ? appSettings.servers.length : 0;
                  const totalSaldo = users.reduce((sum, u) => sum + (u.balance || 0), 0);
                  const invoices = backupObj.invoices || [];
                  const inbox = backupObj.inbox || [];
                  const paidInvoices = invoices.filter((i2) => i2.status === "PAID");
                  const xlPurchases = inbox.filter((i2) => i2.title && i2.title.includes("[SUKSES] Pembelian Paket XL"));
                  const totalTransactions = paidInvoices.length + vpns.length + xlPurchases.length;
                  const vpnsThisMonth = vpns.filter((v) => v.date && v.date.includes(monthStr));
                  const topupThisMonth = paidInvoices.filter((i2) => i2.date && i2.date.includes(monthStr)).reduce((sum, i2) => sum + (i2.amount || 0), 0);
                  const xlThisMonth = xlPurchases.filter((i2) => i2.date && i2.date.includes(monthStr)).length;
                  let vpnMonthDetails = "";
                  const serversList = appSettings.servers || [];
                  serversList.forEach((srv) => {
                    const countSrv = vpnsThisMonth.filter((v) => v.server === srv.name).length;
                    vpnMonthDetails += `- ${srv.name}: ${countSrv}
`;
                  });
                  const vpnsToday = vpns.filter((v) => v.date && v.date.includes(todayStr));
                  const topupToday = paidInvoices.filter((i2) => i2.date && i2.date.includes(todayStr)).reduce((sum, i2) => sum + (i2.amount || 0), 0);
                  const xlToday = xlPurchases.filter((i2) => i2.date && i2.date.includes(todayStr)).length;
                  let vpnTodayDetails = "";
                  serversList.forEach((srv) => {
                    const countSrv = vpnsToday.filter((v) => v.server === srv.name).length;
                    vpnTodayDetails += `- ${srv.name}: ${countSrv}
`;
                  });
                  const captionHtml = `<b>\u{1F4CA} Statistik Warung Pulsa (Backup Manual AI)</b>

Pengguna: ${totalUsers}
Transaksi: ${totalTransactions}
Akun VPN: ${totalVpns}
Server: ${totalServers}
Saldo: Rp ${totalSaldo.toLocaleString("id-ID")}

<b>Bulan ini:</b>
Top Up: Rp ${topupThisMonth.toLocaleString("id-ID")}
Pembelian paket XL : ${xlThisMonth} transaksi
Pembuatan Akun: ${vpnsThisMonth.length}
${vpnMonthDetails}
<b>Hari ini:</b>
Top Up: Rp ${topupToday.toLocaleString("id-ID")}
Pembelian paket XL : ${xlToday} transaksi
Pembuatan Akun: ${vpnsToday.length}
${vpnTodayDetails}
#warungpulsabackup`;
                  const backupData = JSON.stringify(backupObj, null, 2);
                  await saveBackupToR2(env, backupObj, nowStr);
                  const cleanNow = nowStr.replace(/[\/\s:,]/g, "_");
                  const blob = new Blob([backupData], { type: "application/json" });
                  const formData = new FormData();
                  formData.append("chat_id", chatId);
                  formData.append("caption", captionHtml);
                  formData.append("parse_mode", "HTML");
                  formData.append("document", blob, `Backup_WarungPulsa_${cleanNow}.json`);
                  const tgReq = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                    method: "POST",
                    body: formData
                  });
                  if (tgReq.ok) {
                    let rekapText = `Rekap saldo pengguna
Total : Rp.${totalSaldo.toLocaleString("id-ID")}

`;
                    rekapText += "NO | Akun                          | Saldo      |\n";
                    users.forEach((u, i2) => {
                      const no = String(i2 + 1).padEnd(2, " ");
                      const email2 = u.email.padEnd(29, " ");
                      const balance = (u.balance || 0).toLocaleString("id-ID").padEnd(10, " ");
                      rekapText += `${no} | ${email2} | ${balance} |
`;
                    });
                    const timeMatch = nowStr.match(/(\d{2})[:\.](\d{2})/);
                    const fileNameTime = dateMatch && timeMatch ? `${dateMatch[1]}${dateMatch[2]}${dateMatch[3]}_${timeMatch[1]}${timeMatch[2]} WIB` : "now";
                    const rekapBlob = new Blob([rekapText], { type: "text/plain" });
                    const rekapFormData = new FormData();
                    rekapFormData.append("chat_id", chatId);
                    rekapFormData.append("document", rekapBlob, `rekap saldo user ${fileNameTime}.txt`);
                    await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                      method: "POST",
                      body: rekapFormData
                    });
                    dbResult = "DATA DB (BERHASIL): Backup database beserta statistik dan rekap saldo telah sukses dikirim ke Telegram Admin.";
                  } else {
                    const tgErr = await tgReq.text();
                    dbResult = `DATA DB (GAGAL): Gagal mengirim file JSON ke Telegram. Server response: ${tgErr}`;
                  }
                }
              } catch (e) {
                dbResult = `DATA DB (GAGAL): System Error saat backup - ${e.message}`;
              }
            } else if (renewVpnMatch) {
              let targetUsername = renewVpnMatch[1].trim();
              let rawDur = renewVpnMatch[2].trim().toLowerCase();
              let duration = rawDur.replace(/[^0-9]/g, "");
              let days = parseInt(duration);
              if (isNaN(days) || days <= 0) {
                dbResult = `GAGAL: Durasi tidak valid (harus angka hari).`;
              } else {
                let price = days * currentPrice;
                let u = await env.DB.prepare("SELECT balance FROM users WHERE email = ?").bind(email).first();
                if (!u || u.balance < price) {
                  dbResult = `GAGAL: Saldo tidak mencukupi (Kurang Rp ${(price - (u ? u.balance : 0)).toLocaleString("id-ID")}). Arahkan user untuk Top Up.`;
                } else {
                  let vpn = await env.DB.prepare("SELECT * FROM vpns WHERE username = ?").bind(targetUsername).first();
                  if (!vpn) {
                    dbResult = `GAGAL: Akun VPN dengan username '${targetUsername}' tidak ditemukan di database kami.`;
                  } else if (!isAdmin && vpn.email !== email) {
                    dbResult = `GAGAL (UNAUTHORIZED): Akun VPN '${targetUsername}' BUKAN milik user ini (${email}). User hanya boleh memperpanjang akun miliknya sendiri. Beritahu user dengan tegas.`;
                  } else {
                    let serverList = appSettings.servers || [];
                    let targetServer = serverList.find((s) => s.name === vpn.server);
                    if (!targetServer) {
                      throw new Error(`Server '${vpn.server}' sudah tidak aktif / tidak ditemukan di konfigurasi saat ini.`);
                    }
                    await env.DB.prepare("UPDATE users SET balance = balance - ? WHERE email = ?").bind(price, email).run();
                    const nowWib = getWIBTime();
                    await env.DB.prepare("INSERT INTO transactions (email, type, amount, description, balance, created_at) VALUES (?, 'OUT', ?, ?, ?, ?)").bind(email, price, `Perpanjang VPN ${vpn.protocol} (${targetUsername}) +${days} Hari`, u.balance - price, nowWib).run();
                    priceToRefund = price;
                    refundProtocol = vpn.protocol;
                    let proto = vpn.protocol.toLowerCase();
                    let endpoint = "";
                    if (proto.includes("ssh")) endpoint = "/srpcom/renew-ssh";
                    else if (proto.includes("vless")) endpoint = "/srpcom/renew-vlessws";
                    else if (proto.includes("trojan")) endpoint = "/srpcom/renew-trojanws";
                    else if (proto.includes("vmess")) endpoint = "/srpcom/renew-vmessws";
                    else if (proto.includes("l2tp")) endpoint = "/srpcom/renew-l2tp";
                    else throw new Error("Protokol tidak dikenali untuk perpanjangan.");
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 15e3);
                    let vpsRes;
                    try {
                      const vpsReq = await fetch(targetServer.host + endpoint, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
                        body: JSON.stringify({ user: targetUsername, exp: String(days) }),
                        signal: controller.signal
                      });
                      clearTimeout(timeoutId);
                      vpsRes = await vpsReq.json();
                    } catch (fetchErr) {
                      clearTimeout(timeoutId);
                      if (fetchErr.name === "AbortError") {
                        throw new Error("Koneksi VPS Timeout (>15 detik) saat mencoba memperpanjang.");
                      }
                      throw fetchErr;
                    }
                    let configText = vpsRes.detail?.stdout || vpsRes.stdout || "";
                    let lowerConfig = configText.toLowerCase();
                    if (lowerConfig.includes("error") || lowerConfig.includes("failed") || lowerConfig.includes("not found") || lowerConfig.includes("tidak ditemukan")) {
                      throw new Error(`Gagal diperpanjang oleh server VPS: Username mungkin sudah terhapus di server aslinya.`);
                    } else if (configText) {
                      priceToRefund = 0;
                      await env.DB.prepare("UPDATE vpns SET exp = exp || ' (+' || ? || ' Hari)' WHERE username = ?").bind(days, targetUsername).run();
                      let plainConfig = configText.replace(/<\/?(b|strong|code|pre|i|u|span|div|font)[^>]*>/gi, "");
                      const cleanConfig = plainConfig.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                      const inboxMsg = `Perpanjangan VPN ${targetUsername} berhasil ditambahkan ${days} Hari.<br><br><div class="bg-gray-950 p-3 rounded-xl border border-gray-800 overflow-x-auto"><pre class="text-green-400 font-mono text-[11px] whitespace-pre-wrap break-all select-all">${cleanConfig}</pre></div>`;
                      await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(email, `[RENEW] ${targetUsername} Sukses!`, inboxMsg, nowWib).run();
                      finalReply = `Alhamdulillah ${userName}, akun VPN **${targetUsername}** berhasil diperpanjang masa aktifnya selama **${days} Hari**! \u{1F389}

Berikut adalah detail terbarunya:

<div class="bg-[#0a0a0a] p-4 rounded-xl border border-gray-700 overflow-x-auto mt-3 mb-3 shadow-inner"><pre class="text-green-400 font-mono text-[11px] leading-relaxed select-all whitespace-pre-wrap">${cleanConfig}</pre></div>

Info ini juga sudah saya amankan di Kotak Masuk kamu ya.`;
                      return jsonResponse({ success: true, reply: finalReply });
                    } else {
                      throw new Error("Server tidak memberikan respon konfigurasi saat perpanjangan (Timeout).");
                    }
                  }
                }
              }
            } else if (buyVpnMatch) {
              let rawProto = buyVpnMatch[1].trim().toLowerCase();
              let rawSrv = buyVpnMatch[2].trim().toLowerCase();
              let rawDur = buyVpnMatch[3].trim().toLowerCase();
              let customUsername = buyVpnMatch[4] ? buyVpnMatch[4].trim() : "";
              let protocol = rawProto.includes("2") || rawProto.includes("vmess") ? "vmessws" : rawProto.includes("3") || rawProto.includes("vless") ? "vlessws" : rawProto.includes("4") || rawProto.includes("trojan") ? "trojanws" : rawProto.includes("5") || rawProto.includes("l2tp") ? "l2tp" : "ssh";
              let duration = rawDur.includes("6") || rawDur.includes("trial") || rawDur.includes("jam") || rawDur === "1" ? "trial" : rawDur.replace(/[^0-9]/g, "");
              const isTrial = duration === "trial";
              const days = isTrial ? 0 : parseInt(duration);
              const price = isTrial ? 0 : days * currentPrice;
              let u = await env.DB.prepare("SELECT balance FROM users WHERE email = ?").bind(email).first();
              if (!isTrial && (isNaN(days) || days <= 0)) {
                dbResult = `GAGAL: Durasi pembelian tidak valid (terdeteksi: ${rawDur}). Durasi harus berupa angka hari yang lebih besar dari 0.`;
              } else if (!u || u.balance < price) {
                dbResult = `GAGAL: Saldo tidak mencukupi (Kurang Rp ${(price - (u ? u.balance : 0)).toLocaleString("id-ID")}).`;
              } else {
                let trialLimitReached = false;
                if (isTrial && !isAdmin) {
                  const todayDateStr = getWIBDateOnly();
                  const trialCount = await env.DB.prepare("SELECT COUNT(*) as count FROM vpns WHERE email = ? AND exp = '1 Jam' AND date LIKE ?").bind(email, `${todayDateStr}%`).first("count");
                  if (trialCount >= 3) trialLimitReached = true;
                }
                if (trialLimitReached) {
                  dbResult = `GAGAL: Batas Klaim Tercapai! User ini maksimal hanya dapat membuat 3 akun TRIAL dalam sehari. Beritahu user dengan sopan dan sarankan untuk Top Up agar bebas limit.`;
                } else {
                  let serverList = appSettings.servers || [];
                  let targetServer = null;
                  let srvIdx = parseInt(rawSrv);
                  if (!isNaN(srvIdx) && srvIdx > 0 && srvIdx <= serverList.length) targetServer = serverList[srvIdx - 1];
                  else targetServer = serverList.find((s) => s.id.toLowerCase() === rawSrv || s.name.toLowerCase().includes(rawSrv));
                  if (!targetServer) throw new Error("Server tidak ditemukan.");
                  let username = customUsername ? customUsername.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : `wp${Math.floor(1e3 + Math.random() * 9e3)}`;
                  if (username.length === 0) username = `wp${Math.floor(1e3 + Math.random() * 9e3)}`;
                  if (username.length > 15) username = username.substring(0, 15);
                  const password = crypto.randomUUID().split("-")[0];
                  if (price > 0) {
                    await env.DB.prepare("UPDATE users SET balance = balance - ? WHERE email = ?").bind(price, email).run();
                    const nowWib = getWIBTime();
                    await env.DB.prepare("INSERT INTO transactions (email, type, amount, description, balance, created_at) VALUES (?, 'OUT', ?, ?, ?, ?)").bind(email, price, `Beli VPN ${protocol.toUpperCase()} - Akun: ${username} | Server: ${targetServer.name} via AI`, u.balance - price, nowWib).run();
                    priceToRefund = price;
                    refundProtocol = protocol;
                  }
                  const vpnMap = {
                    "ssh": { ep: isTrial ? "/srpcom/trial-ssh" : "/srpcom/add-ssh", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, password, exp: String(days), limit_ip: "2" } },
                    "vlessws": { ep: isTrial ? "/srpcom/trial-vlessws" : "/srpcom/add-vlessws", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, exp: String(days), limit_quota: "0", limit_ip: "2" } },
                    "trojanws": { ep: isTrial ? "/srpcom/trial-trojanws" : "/srpcom/add-trojanws", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, exp: String(days), limit_quota: "0", limit_ip: "2" } },
                    "vmessws": { ep: isTrial ? "/srpcom/trial-vmessws" : "/srpcom/add-vmessws", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, exp: String(days), limit_quota: "0", limit_ip: "2" } },
                    "l2tp": { ep: "/srpcom/add-l2tp", pl: isTrial ? { user: `trial${Math.floor(1e3 + Math.random() * 9e3)}`, password, exp: "1" } : { user: username, password, exp: String(days) } }
                  };
                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), 15e3);
                  let vpsRes;
                  try {
                    const vpsReq = await fetch(targetServer.host + vpnMap[protocol].ep, {
                      method: "POST",
                      headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
                      body: JSON.stringify(vpnMap[protocol].pl),
                      signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    vpsRes = await vpsReq.json();
                  } catch (fetchErr) {
                    clearTimeout(timeoutId);
                    if (fetchErr.name === "AbortError") {
                      throw new Error("Koneksi VPS Timeout (>15 detik) saat mencoba membuat VPN.");
                    }
                    throw fetchErr;
                  }
                  let configText = vpsRes.detail?.stdout || vpsRes.stdout || "";
                  let lowerConfig = configText.toLowerCase();
                  if (lowerConfig.includes("already exist") || lowerConfig.includes("choose another name") || lowerConfig.includes("error") || lowerConfig.includes("failed")) {
                    throw new Error(`Gagal dieksekusi VPS. Username mungkin sudah terpakai.`);
                  } else if (configText) {
                    const now = getWIBTime();
                    priceToRefund = 0;
                    let actualUsername = username;
                    if (isTrial && protocol !== "l2tp") {
                      const match = configText.match(/Username\s*:\s*([^\s<]+)/i) || configText.match(/User\s*:\s*([^\s<]+)/i) || configText.match(/Account\s*:\s*([^\s<]+)/i);
                      actualUsername = match ? match[1] : `Trial-${Math.floor(1e3 + Math.random() * 9e3)}`;
                    } else if (isTrial && protocol === "l2tp") {
                      actualUsername = vpnMap[protocol].pl.user;
                    }
                    let plainConfig = configText.replace(/<\/?(b|strong|code|pre|i|u|span|div|font)[^>]*>/gi, "");
                    const cleanConfig = plainConfig.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    const inboxMsg = `Halo! Ini detail konfigurasi VPN Anda:<br><br><div class="bg-gray-950 p-3 rounded-xl border border-gray-800 overflow-x-auto"><pre class="text-green-400 font-mono text-[11px] whitespace-pre-wrap break-all select-all">${cleanConfig}</pre></div>`;
                    await env.DB.prepare("INSERT INTO vpns (email, server, protocol, username, date, exp) VALUES (?, ?, ?, ?, ?, ?)").bind(email, targetServer.name, protocol.toUpperCase(), actualUsername, now, isTrial ? "1 Jam" : days + " Hari").run();
                    await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(email, `[${protocol.toUpperCase()}] Pesanan Sukses!`, inboxMsg, now).run();
                    finalReply = `Alhamdulillah ${userName}, pesanan akun VPN kamu berhasil dibuat! \u{1F389}

Berikut adalah detail konfigurasinya:

<div class="bg-[#0a0a0a] p-4 rounded-xl border border-gray-700 overflow-x-auto mt-3 mb-3 shadow-inner"><pre class="text-green-400 font-mono text-[11px] leading-relaxed select-all whitespace-pre-wrap">${cleanConfig}</pre></div>

Silakan klik/tahan teks di atas untuk menyalin. Jangan khawatir, konfigurasi ini juga sudah saya amankan di menu Kotak Masuk (Inbox) kamu ya.`;
                    return jsonResponse({ success: true, reply: finalReply });
                  } else {
                    throw new Error("Server tidak memberikan respon konfigurasi (Timeout).");
                  }
                }
              }
            }
          } catch (err) {
            if (priceToRefund > 0) {
              await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(priceToRefund, email).run();
              let uRefund = await env.DB.prepare("SELECT balance FROM users WHERE email = ?").bind(email).first();
              const nowWib = getWIBTime();
              await env.DB.prepare("INSERT INTO transactions (email, type, amount, description, balance, created_at) VALUES (?, 'IN', ?, ?, ?, ?)").bind(email, priceToRefund, `Refund Pembayaran VPN Gagal (${refundProtocol.toUpperCase()}) via AI`, uRefund.balance, nowWib).run();
              dbResult = `TINDAKAN (GAGAL): ${err.message} Saldo user sebesar Rp ${priceToRefund.toLocaleString("id-ID")} telah dikembalikan (di-refund) secara otomatis ke akun user. Sampaikan permohonan maaf dan sampaikan saldo sudah aman/kembali.`;
            } else {
              dbResult = `ERROR: ${err.message}`;
            }
          }
          messages.push({ role: "assistant", content: reply }, { role: "user", content: `[SYSTEM RESPONSE]: ${dbResult}

Sekarang jawab user dengan ramah dan segera jalankan instruksi di atas.` });
          continue;
        }
        finalReply = reply.replace(/\[?\s*ACTION_[A-Z_]+[^\]\n]*\]?/ig, "").replace(/\[?\s*DB_[A-Z_]+[^\]\n]*\]?/ig, "").replace(/\[ADMIN RESPONSE\]/ig, "").replace(/\[SYSTEM RESPONSE\]/ig, "").trim();
        if (!finalReply) {
          finalReply = isAdmin ? "Siap, perintah sampun diproses dening sistem! Wonten malih sing saged kulo bantu?" : "Nggeh, sampun kulo catet. Enten sing badhe ditangletaken malih?";
        }
        break;
      }
      return jsonResponse({ success: true, reply: finalReply });
    } catch (e) {
      console.error("AI Error Exception:", e);
      return jsonResponse({ success: false, message: `System Error: ${e.message}. Silakan coba lagi.` }, 500);
    }
  }
  return null;
}
__name(handleAIRoutes, "handleAIRoutes");
__name2(handleAIRoutes, "handleAIRoutes");
__name22(handleAIRoutes, "handleAIRoutes");
__name222(handleAIRoutes, "handleAIRoutes");
function renderAIChatUI(currentUser, appSettings = {}) {
  if (appSettings.ai_chat_active === false) {
    return "";
  }
  const userName = currentUser && currentUser.name ? currentUser.name.split(" ")[0] : "Sobat";
  const initialGreetingHTML = `
        <div class="bg-gray-800 text-gray-300 p-3 rounded-2xl rounded-tl-none text-xs border border-gray-700 max-w-[85%] shadow-sm flex flex-col gap-2">
            <span>Assalamu'alaikum ${userName}! Saya Asisten Pintar <b>Warung Pulsa</b>. Ada yang bisa saya bantu terkait layanan toko atau sekadar ngobrol santai?</span>
            <div class="flex flex-wrap gap-2 mt-1">
                <button onclick="window.sendQuickReply('buat vpn')" class="bg-sky-600 hover:bg-sky-500 text-white text-[10px] py-1 px-3 rounded-full transition shadow-sm border border-sky-600/50">\u{1F680} buat vpn</button>
                <button onclick="window.sendQuickReply('cara topup')" class="bg-sky-600 hover:bg-sky-500 text-white text-[10px] py-1 px-3 rounded-full transition shadow-sm border border-sky-600/50">\u{1F4B3} cara topup</button>
                <button onclick="window.sendQuickReply('cek pulsa xl')" class="bg-sky-600 hover:bg-sky-500 text-white text-[10px] py-1 px-3 rounded-full transition shadow-sm border border-sky-600/50">\u{1F4CA} cek pulsa</button>
            </div>
        </div>
    `;
  return `
    <div id="aiChatWrapper" class="fixed bottom-6 right-6 z-[9999] font-sans">
        <div id="aiChatWindow" class="hidden flex flex-col bg-gray-900 border border-gray-700 w-[320px] sm:w-[380px] h-[450px] rounded-3xl shadow-2xl overflow-hidden mb-4 transform transition-all duration-300 scale-95 opacity-0 origin-bottom-right">
            <div class="bg-sky-600 p-4 flex justify-between items-center shadow-lg">
                <div class="flex items-center gap-3">
                    <div class="bg-white/20 p-2 rounded-xl">\u{1F916}</div>
                    <div><h4 class="text-white font-bold text-sm leading-none">Asisten Digital</h4><span class="text-red-100 text-[10px] uppercase font-bold tracking-widest">Online</span></div>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="window.clearAiChat()" class="text-white/60 hover:text-red-200 transition" title="Bersihkan Obrolan"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                    <button onclick="window.toggleAiChat()" class="text-white/60 hover:text-white text-2xl leading-none">&times;</button>
                </div>
            </div>
            <div id="aiChatMessages" class="flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 bg-[#0b1120]">
                ${initialGreetingHTML}
            </div>
            <div class="p-3 bg-gray-950 border-t border-gray-800">
                <div class="flex gap-2 bg-gray-900 border border-gray-700 rounded-2xl p-1 px-3 focus-within:border-sky-600 transition">
                    <input type="text" id="aiInput" placeholder="Tanya sesuatu..." class="bg-transparent border-0 outline-none text-sm text-white flex-1 py-2" onkeypress="if(event.key === 'Enter') window.sendAiChat()">
                    <button onclick="window.sendAiChat()" id="btnSendAi" class="text-sky-400 hover:text-cyan-400 p-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>
                </div>
            </div>
        </div>
        <button onclick="window.toggleAiChat()" class="bg-sky-600 hover:bg-sky-500 text-white p-4 rounded-full shadow-2xl transition-transform active:scale-90 group relative flex items-center justify-center">
            <span class="absolute -top-2 -left-2 bg-sky-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">AI</span>
            <svg id="aiIconOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            <svg id="aiIconClose" class="w-7 h-7 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>
    <script>
        window.aiHistory = window.aiHistory || [];

        window.clearAiChat = function() {
            window.aiHistory = [];
            document.getElementById('aiChatMessages').innerHTML = \`${initialGreetingHTML}\`;
        };

        window.toggleAiChat = function() {
            const win = document.getElementById('aiChatWindow');
            const iconOpen = document.getElementById('aiIconOpen');
            const iconClose = document.getElementById('aiIconClose');
            if (!win) return;
            
            if (win.classList.contains('hidden')) {
                win.classList.remove('hidden'); 
                setTimeout(() => { win.classList.add('scale-100', 'opacity-100'); }, 10);
                if (iconOpen) iconOpen.classList.add('hidden'); 
                if (iconClose) iconClose.classList.remove('hidden');
            } else {
                win.classList.remove('scale-100', 'opacity-100'); 
                setTimeout(() => { win.classList.add('hidden'); }, 300);
                if (iconOpen) iconOpen.classList.remove('hidden'); 
                if (iconClose) iconClose.classList.add('hidden');
            }
        };

        window.sendQuickReply = function(text) {
            const input = document.getElementById('aiInput');
            if (input) {
                input.value = text;
                window.sendAiChat();
            }
        };

        window.sendAiChat = async function() {
            const input = document.getElementById('aiInput');
            const msg = input.value.trim();
            if (!msg) return;
            input.value = ''; input.disabled = true;
            const container = document.getElementById('aiChatMessages');
            
            const escapeHTML = (str) => str.replace(/[&<>'"]/g, tag => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            }[tag] || tag));

            container.innerHTML += '<div class="bg-sky-600 text-white p-3 rounded-2xl rounded-tr-none text-xs ml-auto max-w-[85%] shadow-sm">' + escapeHTML(msg) + '</div>';
            
            const loadingId = 'ai-loading-' + Date.now();
            container.innerHTML += '<div id="' + loadingId + '" class="bg-gray-800 text-gray-400 p-3 rounded-2xl rounded-tl-none text-xs italic border border-gray-700 w-fit shadow-sm">Mengetik...</div>';
            container.scrollTop = container.scrollHeight;
            
            try {
                const res = await fetch('/api/ai/chat', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ message: msg, history: window.aiHistory }) 
                });
                const data = await res.json();
                
                const loader = document.getElementById(loadingId);
                if (loader) loader.remove();
                
                if (data.success) {
                    let formatted = data.reply
                        .replace(/(https?:\\/\\/[^\\s<]+)/g, '<a href="$1" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline transition">$1</a>')
                        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-white font-bold">$1</strong>')
                        .replace(/^-\\s+(.*)$/gm, '<div class="flex items-start gap-2 mt-1 mb-1"><span class="text-cyan-400 mt-[1px]">\u2726</span><span class="flex-1">$1</span></div>')
                        .replace(/\\n/g, '<br>');
                    
                    formatted = formatted.replace(/<\\/div><br>/g, '</div>').replace(/<br><div/g, '<div');

                    container.innerHTML += '<div class="bg-gray-800 text-gray-200 p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed border border-gray-700 max-w-[95%] shadow-sm">' + formatted + '</div>';
                    
                    window.aiHistory.push({ role: 'user', content: msg }, { role: 'assistant', content: data.reply });
                    if (window.aiHistory.length > 20) window.aiHistory = window.aiHistory.slice(-20);
                } else { 
                    container.innerHTML += '<div class="bg-sky-900/20 text-cyan-400 p-3 rounded-2xl text-[10px] text-center border border-sky-500/20">' + data.message + '</div>'; 
                }
            } catch(e) { 
                const loader = document.getElementById(loadingId);
                if (loader) loader.remove();
                container.innerHTML += '<div class="bg-sky-900/20 text-cyan-400 p-3 rounded-2xl text-[10px] text-center border border-sky-500/20">Koneksi terputus. Coba lagi.</div>'; 
            }
            container.scrollTop = container.scrollHeight; 
            input.disabled = false; 
            input.focus();
        };
    <\/script>
    `;
}
__name(renderAIChatUI, "renderAIChatUI");
__name2(renderAIChatUI, "renderAIChatUI");
__name22(renderAIChatUI, "renderAIChatUI");
__name222(renderAIChatUI, "renderAIChatUI");
async function createCloudflareDNS(env, subdomain, ipAddress) {
  if (!env.CF_ZONE_ID || !env.CF_GLOBAL_KEY || !env.CF_EMAIL) {
    console.warn("CF_ZONE_ID, CF_GLOBAL_KEY, or CF_EMAIL is not set. Skipping DNS record creation.");
    return null;
  }
  const url = `https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/dns_records`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "X-Auth-Email": env.CF_EMAIL,
        "X-Auth-Key": env.CF_GLOBAL_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "A",
        name: subdomain,
        content: ipAddress,
        ttl: 1,
        // Auto
        proxied: false
        // DNS Only
      })
    });
    const data = await res.json();
    if (data.success) {
      return data.result.id;
    } else {
      console.error("Cloudflare DNS API Error:", data.errors);
      return null;
    }
  } catch (e) {
    console.error("Cloudflare Fetch Error:", e);
    return null;
  }
}
__name(createCloudflareDNS, "createCloudflareDNS");
__name2(createCloudflareDNS, "createCloudflareDNS");
__name22(createCloudflareDNS, "createCloudflareDNS");
__name222(createCloudflareDNS, "createCloudflareDNS");
async function deleteCloudflareDNS(env, recordId) {
  if (!env.CF_ZONE_ID || !env.CF_GLOBAL_KEY || !env.CF_EMAIL || !recordId) return false;
  const url = `https://api.cloudflare.com/client/v4/zones/${env.CF_ZONE_ID}/dns_records/${recordId}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "X-Auth-Email": env.CF_EMAIL,
        "X-Auth-Key": env.CF_GLOBAL_KEY
      }
    });
    const data = await res.json();
    return !!data.success;
  } catch (e) {
    console.error("Cloudflare Delete Fetch Error:", e);
    return false;
  }
}
__name(deleteCloudflareDNS, "deleteCloudflareDNS");
__name2(deleteCloudflareDNS, "deleteCloudflareDNS");
__name22(deleteCloudflareDNS, "deleteCloudflareDNS");
__name222(deleteCloudflareDNS, "deleteCloudflareDNS");
async function renderLicensePage(env, currentUser, appSettings, url) {
  const pricePerDay = appSettings.script_price_per_day || 500;
  try {
    await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS licenses (
                id TEXT PRIMARY KEY,
                email TEXT,
                vps_name TEXT,
                ip_address TEXT,
                expires_at INTEGER,
                created_at TEXT
            )
        `).run();
  } catch (e) {
  }
  try {
    await env.DB.prepare("ALTER TABLE licenses ADD COLUMN subdomain TEXT").run();
  } catch (e) {
  }
  try {
    await env.DB.prepare("ALTER TABLE licenses ADD COLUMN cf_record_id TEXT").run();
  } catch (e) {
  }
  const licPage = url ? parseInt(url.searchParams.get("page") || "1") : 1;
  const licLimit = 10;
  const licOffset = (licPage - 1) * licLimit;
  let totalLicenses = 0;
  try {
    const totalRow = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM licenses WHERE email = ?"
    ).bind(currentUser.email).first();
    totalLicenses = totalRow ? totalRow.count : 0;
  } catch (e) {
    console.error("Gagal count lisensi:", e);
  }
  const totalPages = Math.ceil(totalLicenses / licLimit) || 1;
  let licenses = [];
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM licenses WHERE email = ? ORDER BY rowid DESC LIMIT ? OFFSET ?"
    ).bind(currentUser.email, licLimit, licOffset).all();
    licenses = results || [];
  } catch (e) {
    console.error("Gagal load lisensi:", e);
  }
  let licenseListHtml = "";
  if (!licenses || licenses.length === 0) {
    licenseListHtml = `
            <tr><td colspan="5" class="p-8 text-center text-gray-500">Anda belum memiliki lisensi IP yang terdaftar.</td></tr>
        `;
  } else {
    licenseListHtml = licenses.map((lic) => {
      const isExpired = lic.expires_at < Date.now();
      const expDate = new Date(lic.expires_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB";
      const statusBadge = isExpired ? '<span class="bg-sky-500/20 text-cyan-400 border border-sky-500/30 text-[10px] px-2 py-1 rounded uppercase font-bold">Expired</span>' : '<span class="bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] px-2 py-1 rounded uppercase font-bold">Aktif</span>';
      return `
            <tr class="hover:bg-gray-800/50 transition border-b border-gray-800 last:border-0">
                <td class="p-4 font-mono text-sm text-cyan-400 font-bold">${escapeHTML(lic.ip_address)}</td>
                <td class="p-4 text-sm text-gray-300 font-medium">
                    ${escapeHTML(lic.vps_name)}
                    ${lic.subdomain ? `<br><span class="text-[10px] text-yellow-400 font-mono font-bold">${escapeHTML(lic.subdomain)}</span>` : ""}
                </td>
                <td class="p-4 text-xs font-mono ${isExpired ? "text-cyan-400" : "text-yellow-400"}">${expDate}</td>
                <td class="p-4 text-center">${statusBadge}</td>
                <td class="p-4 flex gap-2 justify-center">
                    <button onclick="extendLicense('${lic.id}', '${lic.ip_address}')" class="bg-sky-600 hover:bg-sky-500 text-white text-[11px] px-3 py-1.5 rounded-lg uppercase font-bold transition shadow">Perpanjang</button>
                    <button onclick="deleteLicense('${lic.id}', '${lic.ip_address}')" class="bg-sky-600 hover:bg-sky-500 text-white text-[11px] px-3 py-1.5 rounded-lg uppercase font-bold transition shadow">Hapus IP</button>
                </td>
            </tr>
            `;
    }).join("");
  }
  return `
    <div class="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-800 pb-5 gap-4">
            <div>
                <h1 class="text-3xl font-black text-white tracking-tight flex items-center gap-3">\u{1F4DC} Lisensi Autoscript</h1>
                <p class="text-gray-400 text-sm mt-2">Daftarkan IP VPS Anda agar dapat menggunakan Autoscript Installer Premium kami.</p>
            </div>
            <div class="bg-gray-800 px-4 py-2.5 rounded-xl border border-gray-700 flex items-center gap-3 shadow-inner">
                <span class="text-xs text-gray-400 font-bold uppercase">Harga Script</span>
                <span class="bg-sky-500/20 text-cyan-400 px-2.5 py-0.5 rounded font-mono font-bold border border-sky-600/30">Rp ${pricePerDay.toLocaleString("id-ID")} / Hari</span>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Form Registrasi IP -->
            <div class="lg:col-span-1 bg-gray-900 p-6 md:p-8 rounded-3xl border border-sky-600/30 shadow-2xl h-fit">
                <h2 class="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-3">\u2795 Daftarkan IP Baru</h2>
                <form id="formBuyLicense" class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase">Nama VPS / Domain</label>
                        <input type="text" id="licName" required placeholder="Contoh: xiaoyan123" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase">Alamat IPv4 VPS</label>
                        <input type="text" id="licIp" required placeholder="Contoh: 103.123.45.67" pattern="^([0-9]{1,3}\\.){3}[0-9]{1,3}$" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-cyan-400 font-mono focus:ring-2 focus:ring-sky-500 outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase">Masa Aktif (Durasi)</label>
                        <select id="licDuration" onchange="updateLicPrice()" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none text-sm font-bold">
                            <option value="30">30 Hari (1 Bulan)</option>
                            <option value="90">90 Hari (3 Bulan)</option>
                            <option value="180">180 Hari (6 Bulan)</option>
                            <option value="365">365 Hari (1 Tahun)</option>
                        </select>
                    </div>
                    <div class="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-gray-800 mt-2">
                        <span class="text-sm text-gray-400 font-medium">Total:</span>
                        <span class="text-2xl font-black text-green-400 tracking-tight" id="licPriceDisplay">Rp ${(pricePerDay * 30).toLocaleString("id-ID")}</span>
                    </div>
                    <button type="submit" id="btnBuyLic" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-base mt-2">Bayar & Daftarkan</button>
                </form>
            </div>

            <!-- Tabel Daftar IP -->
            <div class="lg:col-span-3 bg-gray-900 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
                <div class="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50 font-bold">
                    <h2 class="text-xl font-bold text-white">Daftar IP Saya</h2>
                    <span class="text-xs text-gray-400">Gunakan perintah <code class="bg-black px-1.5 py-0.5 rounded text-pink-400">wget</code> untuk install di VPS.</span>
                </div>
                <div class="overflow-x-auto flex-grow custom-scrollbar">
                    <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                        <thead class="bg-gray-950 text-gray-400 border-b border-gray-700">
                            <tr>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">IP Address</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Nama VPS</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Expired Date</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs text-center">Status</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800">
                            ${licenseListHtml}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination Controls -->
                ${totalPages > 1 ? `
                <div class="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between gap-4 flex-wrap">
                    <a href="${licPage > 1 ? `/lisensi?page=${licPage - 1}` : "#"}" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${licPage <= 1 ? "opacity-50 pointer-events-none" : ""}">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Sebelum
                    </a>
                    <span class="text-xs text-gray-400 font-medium">Halaman ${licPage} dari ${totalPages} (Total ${totalLicenses} IP)</span>
                    <a href="${licPage < totalPages ? `/lisensi?page=${licPage + 1}` : "#"}" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${licPage >= totalPages ? "opacity-50 pointer-events-none" : ""}">
                        Berikut <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
                ` : ""}
                
                <!-- Box Instruksi Install -->
                <div class="p-6 bg-gray-950 border-t border-gray-800">
                    <h3 class="text-sm font-bold text-yellow-400 mb-2 flex items-center gap-2">\u{1F680} Cara Install di VPS:</h3>
                    <div class="bg-black p-3 rounded-lg border border-gray-800 flex items-center justify-between group">
                        <code class="text-green-400 text-xs font-mono select-all">sudo wget -qO installx https://srpcom.cloud/installx && sudo chmod +x installx && sudo ./installx</code>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const LIC_PRICE_PER_DAY = ${pricePerDay};

        function updateLicPrice() {
            const days = parseInt(document.getElementById('licDuration').value);
            document.getElementById('licPriceDisplay').innerText = 'Rp ' + (days * LIC_PRICE_PER_DAY).toLocaleString('id-ID');
        }

        document.getElementById('formBuyLicense').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('licName').value.trim();
            const ip = document.getElementById('licIp').value.trim();
            const days = document.getElementById('licDuration').value;
            const price = parseInt(days) * LIC_PRICE_PER_DAY;

            const conf = await swalDark.fire({
                title: 'Konfirmasi Pendaftaran IP',
                html: 'Sistem akan memotong Saldo Anda sebesar <b class="text-green-400">Rp ' + price.toLocaleString('id-ID') + '</b>.<br>Pastikan IP <b>' + ip + '</b> sudah benar!',
                icon: 'question', showCancelButton: true, confirmButtonText: 'Ya, Beli Lisensi'
            });

            if(!conf.isConfirmed) return;

            const btn = document.getElementById('btnBuyLic');
            btn.disabled = true; btn.innerText = 'Memproses...';

            try {
                const res = await fetch('/api/license/buy', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vps_name: name, ip_address: ip, duration: days })
                });
                const data = await res.json();
                
                if (data.success) {
                    await swalDark.fire('Berhasil', 'IP berhasil didaftarkan! Silakan jalankan script instalasi di VPS Anda.', 'success');
                    window.location.reload();
                } else {
                    swalDark.fire('Gagal', data.message, 'error');
                }
            } catch(e) {
                swalDark.fire('Error', 'Kesalahan koneksi', 'error');
            }
            btn.disabled = false; btn.innerText = 'Bayar & Daftarkan';
        });

        async function extendLicense(id, ip) {
            const { value: days, isDismissed } = await swalDark.fire({
                title: 'Perpanjang Masa Aktif',
                html: '<p class="text-sm mb-4">IP: <b class="text-cyan-400 font-mono">' + ip + '</b></p><p class="text-xs text-gray-400 mb-2">Harga: Rp ' + LIC_PRICE_PER_DAY.toLocaleString('id-ID') + '/Hari</p>',
                input: 'select',
                inputOptions: { '30': '30 Hari', '90': '90 Hari', '180': '180 Hari', '365': '365 Hari' },
                inputPlaceholder: '-- Pilih Tambahan Waktu --',
                showCancelButton: true, confirmButtonText: 'Bayar & Perpanjang'
            });

            if (isDismissed || !days) return;
            const price = parseInt(days) * LIC_PRICE_PER_DAY;

            const conf = await swalDark.fire({ title: 'Konfirmasi', text: 'Saldo akan dipotong Rp ' + price.toLocaleString('id-ID') + '. Lanjutkan?', icon: 'warning', showCancelButton: true });
            if (!conf.isConfirmed) return;

            swalDark.fire({title: 'Memproses...', didOpen: () => Swal.showLoading()});
            try {
                const res = await fetch('/api/license/extend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, duration: days }) });
                const data = await res.json();
                if(data.success) { await swalDark.fire('Berhasil', 'Masa aktif berhasil ditambah.', 'success'); window.location.reload(); }
                else { swalDark.fire('Gagal', data.message, 'error'); }
            } catch(e) { swalDark.fire('Error', 'Koneksi bermasalah', 'error'); }
        }

        async function deleteLicense(id, ip) {
            const conf = await swalDark.fire({
                title: 'Hapus Lisensi IP?',
                text: 'IP ' + ip + ' akan dihapus dan script di VPS tersebut tidak akan bisa diinstall ulang/update. (Sisa masa aktif hangus dan tidak di-refund).',
                icon: 'error', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus IP!'
            });
            if(!conf.isConfirmed) return;

            swalDark.fire({title: 'Menghapus...', didOpen: () => Swal.showLoading()});
            try {
                const res = await fetch('/api/license/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
                if((await res.json()).success) { await swalDark.fire('Dihapus', 'Lisensi IP berhasil dihapus.', 'success'); window.location.reload(); }
                else { swalDark.fire('Gagal', 'Sistem error.', 'error'); }
            } catch(e) { swalDark.fire('Error', 'Koneksi bermasalah', 'error'); }
        }
    <\/script>
    `;
}
__name(renderLicensePage, "renderLicensePage");
__name2(renderLicensePage, "renderLicensePage");
__name22(renderLicensePage, "renderLicensePage");
__name222(renderLicensePage, "renderLicensePage");
async function handleLicenseRoutes(url, request, env, currentUser, appSettings, sendTelegramLog2) {
  const path = url.pathname;
  const method = request.method;
  if (path.startsWith("/api/license")) {
    try {
      await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS licenses (
                    id TEXT PRIMARY KEY,
                    email TEXT,
                    vps_name TEXT,
                    ip_address TEXT,
                    expires_at INTEGER,
                    created_at TEXT
                )
            `).run();
    } catch (e) {
    }
    try {
      await env.DB.prepare("ALTER TABLE licenses ADD COLUMN subdomain TEXT").run();
    } catch (e) {
    }
    try {
      await env.DB.prepare("ALTER TABLE licenses ADD COLUMN cf_record_id TEXT").run();
    } catch (e) {
    }
  }
  if (path === "/api/license/check" && method === "GET") {
    const ip = url.searchParams.get("ip");
    const name = url.searchParams.get("name");
    if (!ip || !name) return jsonResponse({ success: false, message: "IP atau Nama VPS tidak diberikan." }, 400);
    try {
      let license = await env.DB.prepare("SELECT * FROM licenses WHERE ip_address = ? AND vps_name = ?").bind(ip, name).first();
      if (!license) {
        const licByIp = await env.DB.prepare("SELECT * FROM licenses WHERE ip_address = ?").bind(ip).first();
        if (licByIp) {
          return jsonResponse({
            success: false,
            message: `Kombinasi IP dan Nama VPS tidak cocok. IP ini terdaftar dengan Nama VPS: ${licByIp.vps_name}`,
            data: { vps_name: licByIp.vps_name }
          }, 403);
        }
        return jsonResponse({ success: false, message: "Kombinasi IP dan Nama VPS belum terdaftar di database Lisensi." }, 403);
      }
      if (license.expires_at < Date.now()) {
        return jsonResponse({
          success: false,
          message: "Lisensi untuk IP dan Nama VPS ini sudah KADALUARSA (Expired).",
          data: { vps_name: license.vps_name }
        }, 403);
      }
      const expDateStr = new Date(license.expires_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit", month: "short", year: "numeric" });
      return jsonResponse({ success: true, message: "Lisensi Valid.", data: { vps_name: license.vps_name, expires_at: expDateStr, subdomain: license.subdomain } });
    } catch (e) {
      return jsonResponse({ success: false, message: "Database Error" }, 500);
    }
  }
  if (!currentUser) return null;
  const pricePerDay = appSettings.script_price_per_day || 500;
  if (path === "/api/license/buy" && method === "POST") {
    try {
      const { vps_name, ip_address, duration } = await request.json();
      const days = parseInt(duration);
      if (![30, 90, 180, 365].includes(days)) throw new Error("Durasi pendaftaran lisensi tidak valid.");
      if (!/^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip_address)) throw new Error("Format IP Address tidak valid.");
      const checkExist = await env.DB.prepare("SELECT id FROM licenses WHERE ip_address = ?").bind(ip_address).first();
      if (checkExist) throw new Error("IP ini sudah terdaftar oleh seseorang. Silakan hapus yang lama jika ingin mendaftarkan ulang.");
      const price = days * pricePerDay;
      const deduct = await env.DB.prepare("UPDATE users SET balance = balance - ? WHERE email = ? AND balance >= ?").bind(price, currentUser.email, price).run();
      if (deduct.meta.changes === 0) throw new Error("Saldo tidak mencukupi.");
      await catatMutasi(env, currentUser.email, "OUT", price, `Beli Lisensi Script IP ${ip_address} (${days} Hari)`);
      const licenseId = "LIC-" + crypto.randomUUID().split("-")[0].toUpperCase();
      const expiresAt = Date.now() + days * 24 * 60 * 60 * 1e3;
      const nowWib = getWIBTime();
      const expDateStr = new Date(expiresAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB";
      let nextNum = 1001;
      try {
        const { results } = await env.DB.prepare(
          "SELECT subdomain FROM licenses WHERE subdomain LIKE 'srv-%.warungpulsa.com'"
        ).all();
        if (results && results.length > 0) {
          let maxNum = 1e3;
          for (const row of results) {
            if (row.subdomain) {
              const match = row.subdomain.match(/^srv-(\d{4,})\.tuban\.store$/);
              if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) {
                  maxNum = num;
                }
              }
            }
          }
          nextNum = maxNum + 1;
        }
      } catch (e) {
        console.error("Gagal mendapatkan urutan subdomain:", e);
      }
      const generatedSubdomain = `srv-${nextNum}.warungpulsa.com`;
      let cfRecordId = null;
      if (env.CF_ZONE_ID && env.CF_GLOBAL_KEY && env.CF_EMAIL) {
        cfRecordId = await createCloudflareDNS(env, generatedSubdomain, ip_address);
      }
      await env.DB.prepare(
        "INSERT INTO licenses (id, email, vps_name, ip_address, expires_at, created_at, subdomain, cf_record_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(licenseId, currentUser.email, vps_name, ip_address, expiresAt, nowWib, generatedSubdomain, cfRecordId).run();
      if (sendTelegramLog2) await sendTelegramLog2(`\u{1F4DC} LISENSI BARU DIBELI`, `User: ${currentUser.email}
IP: ${ip_address}
Nama: <code>${vps_name}</code>
Subdomain: <code>${generatedSubdomain}</code>
Durasi: ${days} Hari &lt;expired : ${expDateStr}&gt;
Status: Sukses`, appSettings);
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 400);
    }
  }
  if (path === "/api/license/extend" && method === "POST") {
    try {
      const { id, duration } = await request.json();
      const days = parseInt(duration);
      if (![30, 90, 180, 365].includes(days)) throw new Error("Durasi perpanjangan lisensi tidak valid.");
      const price = days * pricePerDay;
      const license = await env.DB.prepare("SELECT * FROM licenses WHERE id = ?").bind(id).first();
      if (!license) throw new Error("Lisensi tidak ditemukan.");
      if (!isSuperAdmin(currentUser, env) && license.email !== currentUser.email) throw new Error("Akses ditolak. Ini bukan lisensi Anda.");
      const deduct = await env.DB.prepare("UPDATE users SET balance = balance - ? WHERE email = ? AND balance >= ?").bind(price, currentUser.email, price).run();
      if (deduct.meta.changes === 0) throw new Error("Saldo tidak mencukupi.");
      await catatMutasi(env, currentUser.email, "OUT", price, `Perpanjang Lisensi IP ${license.ip_address} (+${days} Hari)`);
      const currentExp = license.expires_at;
      const now = Date.now();
      const baseTime = currentExp > now ? currentExp : now;
      const newExp = baseTime + days * 24 * 60 * 60 * 1e3;
      await env.DB.prepare("UPDATE licenses SET expires_at = ? WHERE id = ?").bind(newExp, id).run();
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 400);
    }
  }
  if (path === "/api/license/delete" && method === "POST") {
    try {
      const { id } = await request.json();
      const license = await env.DB.prepare("SELECT * FROM licenses WHERE id = ?").bind(id).first();
      if (!license) throw new Error("Lisensi tidak ditemukan.");
      let query = "DELETE FROM licenses WHERE id = ?";
      let params = [id];
      if (!isSuperAdmin(currentUser, env)) {
        if (license.email !== currentUser.email) {
          throw new Error("Akses ditolak. Ini bukan lisensi Anda.");
        }
        query += " AND email = ?";
        params.push(currentUser.email);
      }
      const result = await env.DB.prepare(query).bind(...params).run();
      if (result.meta.changes === 0) throw new Error("Gagal menghapus. Data tidak ditemukan atau Anda tidak memiliki akses.");
      if (isSuperAdmin(currentUser, env) && license.cf_record_id) {
        await deleteCloudflareDNS(env, license.cf_record_id);
      }
      return jsonResponse({ success: true });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 400);
    }
  }
  if (path === "/api/admin/licenses" && method === "GET") {
    if (!isSuperAdmin(currentUser, env)) return jsonResponse({ success: false }, 401);
    try {
      const { results } = await env.DB.prepare("SELECT * FROM licenses ORDER BY rowid DESC").all();
      return jsonResponse({ success: true, data: results });
    } catch (e) {
      return jsonResponse({ success: false, message: e.message }, 500);
    }
  }
  return null;
}
__name(handleLicenseRoutes, "handleLicenseRoutes");
__name2(handleLicenseRoutes, "handleLicenseRoutes");
__name22(handleLicenseRoutes, "handleLicenseRoutes");
__name222(handleLicenseRoutes, "handleLicenseRoutes");
function renderConverterPage() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WARUNG PULSA CONVERTER v.7.1</title>
    <!-- Open Graph Meta Tags for Social Media Previews -->
    <meta property="og:title" id="ogTitle" content="WARUNG PULSA CONVERTER v.7.1">
    <meta property="og:description" content="Konversi berbagai format proxy ke YAML dengan mudah. Mendukung VLESS, VMess, Trojan, dan HTTP Upgrade.">
    <meta property="og:image" content="https://files.catbox.moe/cdsj88.png">
    <meta property="og:url" content=""> <!-- You can set the final URL here later -->

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="${LOGO_URL}">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Keyframes for animation */
        @keyframes animateRainbow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes animateRunningText { to { background-position: -200% center; } }

        /* --- Blinking Text & Border Animation --- */
        @keyframes blink-orange-border { 50% { border-color: #f97316; box-shadow: 0 0 12px #f97316; } }
        @keyframes blink-green-text { 50% { color: #16a34a; text-shadow: 0 0 8px #16a34a; } }

        /* --- Base Styles (AM / Light Theme) --- */
        body { font-family: 'Inter', sans-serif; overflow-x: hidden; padding-bottom: 4rem; background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab); background-size: 400% 400%; animation: animateRainbow 15s ease infinite; transition: background 0.5s ease, color 0.5s ease; }
        .header-container { display: flex; align-items: center; justify-content: center; margin-top: 1rem; margin-bottom: 0.5rem; gap: 0.75rem; }
        .logo-img { max-width: 75px; height: auto; border-radius: 0.5rem; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)); }
        .main-title-text { font-size: 1.875rem; font-weight: 700; background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: animateRunningText 4s linear infinite; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); }
        .container { background-color: rgba(220, 252, 231, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.18); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); padding: 2rem; max-width: 900px; width: 95%; margin: 0 auto 2rem auto; transition: background-color 0.5s ease, border-color 0.5s ease; }
        
        /* --- PM / Dark Theme Styles --- */
        body.dark-theme {
            /* Dark gradient background */
            background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364);
            background-size: 400% 400%;
            animation: animateRainbow 15s ease infinite;
            color: #e5e7eb;
        }
        
        body.dark-theme .container {
            /* Darker container with transparency */
            background-color: rgba(31, 41, 55, 0.9);
            border-color: rgba(75, 85, 99, 0.4);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
        }

        body.dark-theme textarea {
            background-color: #1f2937 !important; /* Dark gray bg */
            color: #f3f4f6;
            border-color: #4b5563;
        }
        
        body.dark-theme textarea::placeholder {
            color: #9ca3af;
        }

        body.dark-theme .info-text {
            color: #d1d5db; /* Lighter text for info */
        }
        
        body.dark-theme .account-count-info { color: #fb923c; } /* Lighter orange */
        body.dark-theme .output-count-info { color: #4ade80; } /* Lighter green */

        body.dark-theme .footer-link {
            color: #9ca3af;
            text-shadow: none;
        }
        body.dark-theme .footer-link:hover {
            color: #f3f4f6;
        }

        /* --- Interactive Styles --- */
        textarea { resize: vertical; transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, height 0.3s ease, rows 0.3s ease; border: 2px solid transparent; }
        textarea.blinking-orange-border { animation: blink-orange-border 1.5s infinite; }
        textarea.static-green-border { border-color: #22c55e; background-color: #dcfce7 !important; }
        /* Override green border background in dark mode */
        body.dark-theme textarea.static-green-border { background-color: #064e3b !important; border-color: #34d399; }

        pre { white-space: pre-wrap; word-break: break-all; border: 2px solid #d1d5db; border-radius: 0.5rem; padding: 1rem; color: #1f2937; font-size: 0.875rem; overflow-x: auto; min-height: 150px; transition: background-color 0.3s ease, border-color 0.3s ease; }
        
        .message-box { margin-top: 1rem; padding: 0.75rem; border-radius: 0.5rem; text-align: center; font-size: 0.875rem; transition: opacity 0.5s ease-in-out, transform 0.3s ease, height 0.3s ease, padding 0.3s ease, margin 0.3s ease; }
        .message-box.success { background-color: #d1fae5; color: #065f46; }
        .message-box.error { background-color: #fee2e2; color: #991b1b; }
        .message-box.info { background-color: #dbeafe; color: #1e40af; }
        .message-box.warning { background-color: #fef3c7; color: #92400e; }

        .action-button, .toggle-button { position: relative; font-weight: 600; padding: 0.5rem; border-radius: 0.5rem; border: 2px solid transparent; border-bottom-width: 4px; transition: all 0.15s ease-in-out; text-align: center; font-size: 0.875rem; line-height: 1.25rem; }
        .action-button:hover:not(:disabled), .toggle-button:hover:not(:disabled) { transform: translateY(-2px); }
        .action-button:active:not(:disabled), .toggle-button:active:not(:disabled) { transform: translateY(1px); border-bottom-width: 2px; }
        .action-button:disabled, .toggle-button:disabled { background-color: #e5e7eb !important; border-color: #d1d5db !important; color: #9ca3af !important; cursor: not-allowed; opacity: 1; }
        
        /* Adjust disabled buttons in dark mode */
        body.dark-theme .action-button:disabled, body.dark-theme .toggle-button:disabled {
            background-color: #374151 !important;
            border-color: #4b5563 !important;
            color: #6b7280 !important;
        }

        .toggle-button.active { transform: translateY(1px); border-bottom-width: 2px; }
        
        /* --- All Bug Button --- */
        .all-bugs-on {
            background-image: linear-gradient(90deg, #f87171, #fb923c, #facc15, #4ade80, #38bdf8, #818cf8, #c084fc, #f87171);
            background-size: 200% 200%;
            color: white;
            font-weight: 700;
            border: 4px solid transparent !important;
            border-image: none !important;
            animation: animateRainbow 4s ease infinite;
        }
        .all-bugs-off {
            border-width: 4px !important;
            border-style: solid;
            border-image-slice: 1;
            border-image-source: linear-gradient(to right, #f87171, #fb923c, #facc15, #4ade80, #38bdf8, #818cf8, #c084fc);
            background-color: rgba(255, 255, 255, 0.6) !important;
            color: #92400e !important;
        }
        #btnAllBugs:disabled {
            border: 2px solid #d1d5db !important; 
            border-bottom-width: 4px !important;
            background-color: #e5e7eb !important; 
            color: #9ca3af !important;
            border-image: none !important; 
        }

        .info-text { font-weight: 500; font-size: 0.875rem; }
        .account-count-info { color: #f97316; } /* Orange-500 */
        .output-count-info { color: #15803d; } /* Green-700 */
        .blinking-number { animation: blink-green-text 1s infinite; }

        .hadith-quote-container { text-align: center; margin-top: 2rem; padding: 0 1rem; font-style: italic; color: white; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6); min-height: 40px; }
        .footer-link-container { text-align: center; margin-top: 1rem; padding-bottom: 1rem; }
        .footer-link { color: #000000; text-decoration: none; font-weight: 600; text-shadow: 1px 1px 2px rgba(255,255,255,0.4); transition: color 0.3s ease; }
        .footer-link:hover { text-decoration: underline; color: #1f2937; }
        
        @media (max-width: 768px) { 
            .header-container { flex-direction: column; gap: 0.25rem; } 
            .main-title-text { font-size: 1.5rem; } 
            .button-actions-group { flex-direction: column; gap: 0.75rem; } 
            .button-actions-group .action-button { width: 100%; } 
            #toggleButtonGrid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .toggle-button { padding: 0.5rem 0.25rem; font-size: 0.75rem; }
        }
        @media (max-width: 480px) { 
            .container { padding: 1.5rem; } 
            .main-title-text { font-size: 1.25rem; } 
            #toggleButtonGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
    </style>
</head>
<body class="flex flex-col items-center min-h-screen p-4">

    <a href="https://t.me/srpcomstorebot" target="_blank" rel="noopener noreferrer" class="block w-full">
        <div class="header-container">
            <img src="${LOGO_URL}" alt="Logo SRPCOM" class="logo-img rounded-full w-12 h-12 border border-gray-700 shadow-md" onerror="this.onerror=null; this.src='${LOGO_URL}';">
            <h1 id="appTitle" class="main-title-text"></h1>
        </div>
    </a>

    <div class="container">
        <div class="space-y-6">
            <div>
                 <div class="flex justify-between items-center mb-2">
                    <div id="accountCountInfo" class="info-text account-count-info" style="display: none;"></div>
                    <button id="btnClearInput" style="display: none;" class="bg-pink-500 bg-opacity-50 hover:bg-opacity-70 text-white font-semibold py-1 px-3 rounded-lg text-sm">
                        Hapus saja
                    </button>
                </div>
                <textarea
                    id="proxyUriInput"
                    rows="8"
                    class="w-full p-3 rounded-lg focus:outline-none bg-white"
                    placeholder="Tempel URI atau detail akun di sini..."
                ></textarea>
                <div id="outputCountInfo" class="info-text output-count-info text-left mt-2" style="display: none;"></div>
            </div>

            <!-- Button Grid -->
            <div id="toggleButtonGrid" class="grid grid-cols-3 md:grid-cols-4 gap-4">
                <button id="btnVidio" class="toggle-button">ProsChamp</button>
                <button id="btnVidioSni" class="toggle-button">whatsappSNI</button>
                <button id="btnAvaWc" class="toggle-button">avaWC</button>
                <button id="btnFb" class="toggle-button">fb</button>
                <button id="btnSpotify" class="toggle-button">spotify</button>
                <button id="btnNetflix" class="toggle-button">netflix</button>
                <button id="btnRuangguru" class="toggle-button">ruangguru</button>
                <button id="btnTiktokWC" class="toggle-button">tiktokWC</button>
                <button id="btnShopee" class="toggle-button">shopee</button>
                <button id="btnFreeFireWC" class="toggle-button">FreeFireWC</button>
                <!-- Tombol baru SupportzoomWC -->
                <button id="btnSupportzoomWC" class="toggle-button">SupportzoomWC</button>
                
                <button id="btnConvert" class="toggle-button">Tanpa bug</button>
                <button id="btnAllBugs" class="toggle-button col-span-3 md:col-span-4">All Bug</button>
            </div>

            <div>
                <pre id="yamlOutput"></pre>
            </div>

            <div class="flex flex-col sm:flex-row justify-center gap-4 button-actions-group">
                <button id="btnCopy" class="action-button action-button-lower bg-teal-600 hover:bg-teal-700 text-white">Salin Hasil</button>
                <button id="btnExportTxt" class="action-button action-button-lower bg-orange-500 hover:bg-orange-600 text-white">Export ke .txt</button>
                <button id="btnExportFullConfig" class="action-button action-button-lower bg-black hover:bg-gray-800 text-white">Config Siap Pakai</button>
            </div>

            <div id="messageBox" class="message-box" style="display: none;"></div>
        </div>
    </div>
    
    <div id="hadithQuoteContainer" class="hadith-quote-container"></div>
    <div class="footer-link-container">
        <a href="https://t.me/srpcomstorebot" target="_blank" class="footer-link">Order VPN disini : t.me/srpcomstorebot</a>
    </div>

    <script>
        // --- APPLICATION SETTINGS ---
        const APP_VERSION = "7.1";
        const APP_NAME = "WARUNG PULSA CONVERTER";
        // -------------------------

        // --- GOOGLE APPS SCRIPT SETTINGS ---
        const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxoRq19zXE3N3rA4S7lkb4A_gP4KykrNqgX0k6-Z4pzwKtNi4wC6enBpHRBY9uepeoM/exec";
        const SECRET_KEY = "makan"; 
        // -------------------------------------

        // --- DOM Element Cache ---
        const dom = {
            appTitle: document.getElementById('appTitle'),
            ogTitle: document.getElementById('ogTitle'),
            proxyUriInput: document.getElementById('proxyUriInput'),
            yamlOutput: document.getElementById('yamlOutput'),
            messageBox: document.getElementById('messageBox'),
            hadithQuoteContainer: document.getElementById('hadithQuoteContainer'),
            btnClearInput: document.getElementById('btnClearInput'),
            toggleButtonGrid: document.getElementById('toggleButtonGrid'),
            accountCountInfo: document.getElementById('accountCountInfo'),
            outputCountInfo: document.getElementById('outputCountInfo'),
            btnCopy: document.getElementById('btnCopy'),
            btnExportTxt: document.getElementById('btnExportTxt'),
            btnExportFullConfig: document.getElementById('btnExportFullConfig'),
            allToggleButtons: () => document.querySelectorAll('.toggle-button'),
            lowerActionButtons: () => document.querySelectorAll('.action-button-lower'),
        };

        // --- State Management ---
        const state = {
            activeButtons: new Set(),
            lastActiveButtonId: null,
            lastSavedUris: new Set(), 
        };

        // --- Theme Management ---
        function checkTimeBasedTheme() {
            const now = new Date();
            const hours = now.getHours();
            
            // AM: 00:00 - 11:59 (Hours 0-11)
            // PM: 12:00 - 23:59 (Hours 12-23)
            const isPM = hours >= 12;

            if (isPM) {
                document.body.classList.add('dark-theme');
                console.log('PM detected: Switched to Dark Theme');
            } else {
                document.body.classList.remove('dark-theme');
                console.log('AM detected: Switched to Light Theme');
            }
        }

        // --- Configuration ---
        const modificationRules = {
            'btnVidio':    { suffix: '_ProsChamp', rule: { newServer: 'pros.srpcom.cloud' } },
            'btnVidioSni': { suffix: '_whatsappSNI', rule: { newSni: 'chat.whatsapp.com', newHost: 'chat.whatsapp.com' } },
            'btnAvaWc':    { suffix: '_avawc',    rule: { newServer: 'ava.game.naver.com', prefixSniHost: 'ava.game.naver.com.' } },
            'btnFb':       { suffix: '_fb',       rule: { newServer: 'investor.fb.com' } },
            'btnSpotify':  { suffix: '_spotify',  rule: { newServer: 'investors.spotify.com' } },
            'btnNetflix':  { suffix: '_netflix',  rule: { newServer: 'cache.netflix.com' } },
            'btnRuangguru': { suffix: '_ruangguru', rule: { newSni: 'edu.ruangguru.com', newHost: 'edu.ruangguru.com' } },
            'btnTiktokWC': { suffix: '_tiktokwc', rule: { newServer: 'api24-normal.tiktokv.com', prefixSniHost: 'api24-normal.tiktokv.com.' } },
            'btnShopee':   { suffix: '_shopee',   rule: { newServer: 'cvs-deo.shopeemobile.com' } },
            'btnFreeFireWC': { suffix: '_FreeFireWC', rule: { newServer: 'dl.cvs.freefiremobile.com', prefixSniHost: 'dl.cvs.freefiremobile.com.' } },
            // Aturan Baru SupportzoomWC
            'btnSupportzoomWC': { suffix: '_SupportzoomWC', rule: { newServer: 'support.zoom.us', prefixSniHost: 'support.zoom.us.' } },
            'btnConvert':  { suffix: '',          rule: {} } 
        };

        const buttonStateClasses = {
            'btnVidio':    { on: ['bg-purple-600', 'text-white', 'active'], off: ['bg-white', 'text-purple-600', 'border-purple-400'] },
            'btnVidioSni': { on: ['bg-green-600', 'text-white', 'active'], off: ['bg-white', 'text-green-600', 'border-green-400'] },
            'btnAvaWc':    { on: ['bg-yellow-400', 'text-black', 'active'], off: ['bg-white', 'text-yellow-500', 'border-yellow-400'] },
            'btnFb':       { on: ['bg-blue-800', 'text-white', 'active'], off: ['bg-white', 'text-blue-800', 'border-blue-600'] },
            'btnSpotify':  { on: ['bg-green-500', 'text-white', 'active'], off: ['bg-white', 'text-green-600', 'border-green-500'] },
            'btnNetflix':  { on: ['bg-sky-700', 'text-white', 'active'], off: ['bg-white', 'text-red-700', 'border-sky-500'] },
            'btnRuangguru': { on: ['bg-teal-500', 'text-white', 'active'], off: ['bg-white', 'text-teal-600', 'border-teal-500'] },
            'btnTiktokWC': { on: ['bg-pink-600', 'text-white', 'active'], off: ['bg-white', 'text-pink-600', 'border-pink-500'] },
            'btnShopee':   { on: ['bg-orange-500', 'text-white', 'active'], off: ['bg-white', 'text-orange-600', 'border-orange-500'] },
            'btnFreeFireWC': { on: ['bg-cyan-500', 'text-white', 'active'], off: ['bg-white', 'text-cyan-600', 'border-cyan-500'] },
            // Style untuk tombol SupportzoomWC
            'btnSupportzoomWC': { on: ['bg-blue-500', 'text-white', 'active'], off: ['bg-white', 'text-blue-500', 'border-blue-500'] },
            'btnConvert':  { on: ['bg-gray-200', 'text-black', 'active'], off: ['bg-white', 'text-gray-500', 'border-gray-400'] },
            'btnAllBugs':  { on: ['all-bugs-on', 'active'], off: ['all-bugs-off'] }
        };

        const outputStyleMap = {
            'btnVidio':    { border: '#a855f7', bg: '#f3e8ff' },
            'btnVidioSni': { border: '#22c55e', bg: '#dcfce7' },
            'btnAvaWc':    { border: '#facc15', bg: '#fef9c3' },
            'btnFb':       { border: '#1877F2', bg: '#dbeafe' },
            'btnSpotify':  { border: '#1DB954', bg: '#d1fae5' },
            'btnNetflix':  { border: '#E50914', bg: '#fee2e2' },
            'btnRuangguru': { border: '#14b8a6', bg: '#ccfbf1' },
            'btnTiktokWC': { border: '#db2777', bg: '#fce7f3' },
            'btnShopee':   { border: '#f97316', bg: '#fff7ed' },
            'btnFreeFireWC': { border: '#06b6d4', bg: '#cffafe' },
            // Output Style untuk SupportzoomWC
            'btnSupportzoomWC': { border: '#3b82f6', bg: '#eff6ff' },
            'btnConvert':  { border: '#3b82f6', bg: '#dbeafe' },
            'btnAllBugs':  { border: '#f59e0b', bg: '#fef3c7' }
        };
        
        const hadithQuotes = ["\\"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain.\\"", "\\"Amal yang paling dicintai oleh Allah adalah yang paling terus-menerus meskipun sedikit.\\"", "\\"Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.\\"", "\\"Senyummu di hadapan saudaramu adalah sedekah bagimu.\\"", "\\"Orang yang kuat bukanlah dia yang pandai bergulat, tetapi orang yang kuat adalah dia yang mampu mengendalikan dirinya ketika marah.\\"", "\\"Sesungguhnya Allah tidak melihat pada bentuk rupa dan harta kalian, tetapi Dia melihat pada hati dan amalan kalian.\\"", "\\"Setiap kebaikan adalah sedekah.\\"", "\\"Jauhilah olehmu sifat hasad (dengki), karena sesungguhnya hasad itu memakan kebaikan-kebaikan sebagaimana api memakan kayu bakar.\\"", "\\"Barangsiapa yang tidak menyayangi, maka ia tidak akan disayangi.\\"", "\\"Tinggalkanlah apa yang meragukanmu kepada apa yang tidak meragukanmu.\\"", "\\"Sebagian dari kebaikan Islam seseorang adalah meninggalkan apa yang tidak bermanfaat baginya.\\"", "\\"Bertakwalah kepada Allah di mana pun kamu berada, iringilah perbuatan buruk dengan perbuatan baik yang akan menghapusnya, dan bergaullah dengan manusia dengan akhlak yang baik.\\"", "\\"Dua nikmat yang banyak manusia tertipu di dalamnya, yaitu kesehatan dan waktu luang.\\"", "\\"Barangsiapa yang beriman kepada Allah dan hari akhir, maka hendaklah ia berkata baik atau diam.\\"", "\\"Setiap anak Adam sering berbuat salah, dan sebaik-baik orang yang berbuat salah adalah yang mau bertaubat.\\"", "\\"Sesungguhnya kejujuran akan membimbing pada kebaikan, dan kebaikan itu akan membimbing ke surga.\\"", "\\"Permudahlah dan jangan mempersulit, berilah kabar gembira dan jangan membuat orang lari.\\"", "\\"Takutlah kepada neraka meskipun hanya dengan (sedekah) sebiji kurma.\\"", "\\"Ikhlaslah dalam beramal, niscaya cukup bagimu amalan yang sedikit.\\"", "\\"Barangsiapa yang ingin dilapangkan rezekinya dan dipanjangkan umurnya, maka hendaklah ia menyambung tali silaturahmi.\\"", "\\"Sesungguhnya amalan itu tergantung pada niatnya, dan setiap orang akan mendapatkan sesuai dengan apa yang ia niatkan.\\"", "\\"Bukanlah kekayaan itu karena banyaknya harta, tetapi kekayaan yang hakiki adalah kekayaan jiwa (hati).\\"", "\\"Dunia adalah penjara bagi orang mukmin dan surga bagi orang kafir.\\"", "\\"Allah tidak akan menyiksa suatu kaum hingga mereka meminta ampun.\\"", "\\"Agama itu mudah, maka janganlah kamu mempersulitnya.\\"", "\\"Malu adalah sebagian dari iman.\\"", "\\"Doa adalah senjatanya orang mukmin.\\"", "\\"Kebersihan adalah sebagian dari iman.\\"", "\\"Barangsiapa yang memudahkan urusan orang lain, maka Allah akan memudahkan urusannya di dunia dan akhirat.\\"", "\\"Tidak ada ketaatan kepada makhluk dalam bermaksiat kepada Khaliq (Pencipta).\\""];

        // --- Utility Functions ---
        function showMessage(msg, type = 'info', duration = 3000) {
            dom.messageBox.textContent = msg;
            dom.messageBox.className = \`message-box \${type}\`;
            dom.messageBox.style.display = 'block';
            dom.messageBox.style.opacity = 1;
            setTimeout(() => {
                dom.messageBox.style.opacity = 0;
                setTimeout(() => { dom.messageBox.style.display = 'none'; }, 500);
            }, duration);
        }

        function encodeBase64(str) {
            try {
                return btoa(unescape(encodeURIComponent(str)));
            } catch (e) {
                console.error("Base64 Encode Error:", e);
                return null;
            }
        }

        function parseSshDetailsList(text) {
            const lines = text.split('\\n');
            const accounts = [];
            let currentAcc = {};
            
            for (let line of lines) {
                line = line.trim();
                if (!line) continue;
                
                let hostMatch = line.match(/(?:Hostname|Host|IP-Address|IP)\\s*:\\s*([^\\s\\n]+)/i);
                let userMatch = line.match(/(?:Username|User)\\s*:\\s*([^\\s\\n]+)/i);
                let passMatch = line.match(/(?:Password|Pass)\\s*:\\s*([^\\s\\n]+)/i);
                
                if (hostMatch) {
                    if (currentAcc.host && currentAcc.username && currentAcc.password) {
                        accounts.push(currentAcc);
                        currentAcc = {};
                    }
                    currentAcc.host = hostMatch[1].trim();
                }
                if (userMatch) {
                    if (currentAcc.username && currentAcc.host && currentAcc.password) {
                        accounts.push(currentAcc);
                        currentAcc = {};
                    }
                    currentAcc.username = userMatch[1].trim();
                }
                if (passMatch) {
                    if (currentAcc.password && currentAcc.host && currentAcc.username) {
                        accounts.push(currentAcc);
                        currentAcc = {};
                    }
                    currentAcc.password = passMatch[1].trim();
                }
            }
            
            if (currentAcc.host && currentAcc.username && currentAcc.password) {
                accounts.push(currentAcc);
            }
            
            return accounts.length > 0 ? accounts : null;
        }

        function decodeBase64(str) {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) { str += '='; }
            try {
                return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            } catch (e) {
                console.error("Base64 Decode Error:", e);
                return null; 
            }
        }

        function fallbackCopyToClipboard(text, msg) {
            if (!text || text.trim() === '' || text.trim() === 'proxies:') {
                showMessage('No output to copy.', 'info');
                return;
            }
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = 0;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showMessage(msg, 'success');
            } catch (err) {
                showMessage('Failed to copy. Please copy manually.', 'error');
            } finally {
                document.body.removeChild(ta);
            }
        }

        function sanitizeFilename(name) {
            // Update regex to include SupportzoomWC
            const baseName = (name || 'config').replace(/_(ProsChamp|whatsappSNI|avawc|fb|spotify|netflix|ruangguru|tiktokwc|shopee|FreeFireWC|SupportzoomWC)$/, ''); 
            return baseName.replace(/[<>:"/\\\\|?*\\s]+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '').substring(0, 50) || 'config';
        }

        function exportToFile(content, filename, type) {
            try {
                const blob = new Blob([content], { type });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
                showMessage(\`Successfully exported to \${filename}!\`, 'success');
            } catch (err) {
                showMessage('Failed to export file.', 'error');
            }
        }

        // --- Core Logic ---
        function parseUri(uri) {
            try {
                if (uri.startsWith('vmess://')) {
                    const decodedJson = decodeBase64(uri.substring(8).trim());
                    if (!decodedJson) return null;
                    const config = JSON.parse(decodedJson);
                    return {
                        type: 'vmess',
                        name: config.ps || 'VMess_Proxy',
                        server: config.add,
                        port: config.port,
                        uuid: config.id,
                        alterId: config.aid || 0,
                        cipher: 'auto',
                        tls: config.tls === 'tls',
                        network: config.net || 'tcp',
                        path: config.path,
                        host: config.host,
                        sni: config.sni,
                        isHttpUpgrade: config.net === 'httpupgrade',
                    };
                }
                const url = new URL(uri);
                const params = url.searchParams;
                const name = decodeURIComponent(url.hash.substring(1));

                if (uri.startsWith('vless://')) {
                    return {
                        type: 'vless',
                        name: name || \`vless-\${url.hostname}\`,
                        server: url.hostname,
                        port: url.port,
                        uuid: url.username,
                        network: params.get('type') || 'tcp',
                        tls: params.get('security') === 'tls',
                        sni: params.get('sni'),
                        host: params.get('host'),
                        path: params.get('path'),
                        serviceName: params.get('serviceName'),
                        isHttpUpgrade: params.get('type') === 'httpupgrade',
                    };
                }
                if (uri.startsWith('trojan://')) {
                    return {
                        type: 'trojan',
                        name: name || \`trojan-\${url.hostname}\`,
                        server: url.hostname,
                        port: url.port,
                        password: url.username,
                        network: params.get('type') || 'tcp',
                        sni: params.get('sni'),
                        host: params.get('host'),
                        path: params.get('path'),
                        serviceName: params.get('serviceName'),
                        isHttpUpgrade: params.get('type') === 'httpupgrade',
                    };
                }
            } catch (e) {
                console.error(\`Failed to parse URI: \${uri}\`, e);
                return null;
            }
            return null;
        }

        function generateYaml(parsed, rule, suffix, expiryDate) {
            const finalServer = rule.newServer || parsed.server;
            let finalSni = parsed.sni || parsed.host || parsed.server;
            if (rule.newSni) finalSni = rule.newSni;
            else if (rule.prefixSniHost) finalSni = rule.prefixSniHost + parsed.server;

            let finalHost = parsed.host || parsed.server;
            if (rule.newHost) finalHost = rule.newHost;
            else if (rule.prefixSniHost) finalHost = rule.prefixSniHost + parsed.server;

            let config;

            if (parsed.type === 'trojan') {
                config = {
                    name: \`\${parsed.name}\${suffix}\`, 
                    server: finalServer,
                    port: parsed.port,
                    type: 'trojan',
                    password: \`"\${parsed.password}"\`, 
                    'skip-cert-verify': true,
                    sni: finalSni,
                    network: parsed.network,
                };
                if (parsed.network === 'ws') {
                    config['ws-opts'] = {
                        path: \`"\${parsed.path || '/'}"\`,
                        headers: { Host: finalHost }
                    };
                } else if (parsed.network === 'grpc') {
                    config['grpc-opts'] = { 'grpc-service-name': \`"\${parsed.serviceName || ''}"\` };
                }
                config.udp = true;
            } else { 
                config = {
                    name: \`"\${parsed.name}\${suffix}"\`,
                    type: parsed.type,
                    server: finalServer,
                    port: parsed.port,
                    udp: true,
                    'skip-cert-verify': true,
                };

                if (parsed.type === 'vmess') {
                    Object.assign(config, { uuid: parsed.uuid, alterId: parsed.alterId, cipher: parsed.cipher });
                } else if (parsed.type === 'vless') {
                    Object.assign(config, { uuid: parsed.uuid, cipher: 'auto' });
                }

                if (parsed.isHttpUpgrade) {
                    config.tls = parsed.tls;
                    config.servername = finalSni;
                    config['client-fingerprint'] = 'chrome';
                    config.alpn = ['http/1.1'];
                    config.network = 'ws';
                    config['ws-opts'] = {
                        path: \`"\${parsed.path}"\`,
                        headers: {
                            Host: finalHost,
                            'v2ray-http-upgrade': true,
                            'v2ray-http-upgrade-fast-open': false,
                        }
                    };
                    if (parsed.type === 'trojan') { 
                        delete config.servername;
                        config.sni = finalSni;
                    }
                } else {
                    config.tls = parsed.tls;
                    if (config.tls) {
                        config[parsed.type === 'trojan' ? 'sni' : 'servername'] = finalSni;
                    }
                    config.network = parsed.network;
                    if (parsed.network === 'ws') {
                        config['ws-opts'] = {
                            path: \`"\${parsed.path || '/'}"\`,
                            headers: { Host: finalHost }
                        };
                    } else if (parsed.network === 'grpc') {
                        config['grpc-opts'] = { 'grpc-service-name': \`"\${parsed.serviceName || ''}"\` };
                    }
                }
            }
                
            let yamlString = \`- \${Object.entries(config).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    if (key === 'alpn') return \`alpn:\\n    - \${value.join('\\n    - ')}\`;
                    const subEntries = Object.entries(value).map(([subKey, subValue]) => {
                        if (typeof subValue === 'object' && subValue !== null) {
                            const headerEntries = Object.entries(subValue).map(([hKey, hValue]) => \`      \${hKey}: \${hValue}\`).join('\\n');
                            return \`    \${subKey}:\\n\${headerEntries}\`;
                        }
                        return \`    \${subKey}: \${subValue}\`;
                    }).join('\\n');
                    return \`\${key}:\\n\${subEntries}\`;
                }
                return \`\${key}: \${value}\`;
            }).join('\\n  ')}\`;

            if (expiryDate) {
                const expiry = new Date(expiryDate.replace('WIB', '').trim());
                if (!isNaN(expiry.getTime())) {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    expiry.setHours(0, 0, 0, 0);

                    const diffTime = expiry - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    let statusText;
                    if (diffDays < 0) {
                        statusText = '(AKUN SUDAH EXPIRED)';
                    } else {
                        statusText = \`(sisa \${diffDays} hari)\`;
                    }
                    yamlString += \`\\n#EXPIRED ON : \${expiryDate} \${statusText}\`;
                } else {
                    yamlString += \`\\n#EXPIRED ON : \${expiryDate}\`;
                }
            } else {
                yamlString += \`\\n#EXPIRED ON : -\`;
            }
            
            return yamlString;
        }

        function getValidUris(rawInput) {
            const urisToProcess = new Map();
            const uriRegex = /(vmess|vless|trojan):\\/\\/\\S+/g;
            
            const accountSeparator = /\\[\\w+\\/\\w+_\\w+\\]/;
            
            const blocks = rawInput.split(accountSeparator).map((part, index, arr) => {
                if (index > 0) {
                    const separatorMatch = rawInput.match(new RegExp(accountSeparator.source, 'g'));
                    return separatorMatch[index - 1] + part;
                }
                return part;
            });

            for (const block of blocks) {
                const trimmedBlock = block.trim();
                if (trimmedBlock === '') continue;

                let tlsUri = null;
                let nonTlsUri = null;
                let expiry = null;

                const lines = trimmedBlock.split('\\n');
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    
                    if (trimmedLine.startsWith("LINK WS TLS :")) {
                        const match = trimmedLine.match(uriRegex);
                        if (match) tlsUri = match[0];
                    } else if (trimmedLine.startsWith("LINK WS NONE-TLS :")) {
                        const match = trimmedLine.match(uriRegex);
                        if (match) nonTlsUri = match[0];
                    } else if (trimmedLine.toUpperCase().startsWith("EXPIRED ON")) {
                        const expiryParts = trimmedLine.split(':');
                        if (expiryParts.length > 1) {
                            expiry = expiryParts.slice(1).join(':').trim();
                        }
                    }
                }

                const finalUri = tlsUri || nonTlsUri;
                if (finalUri && !urisToProcess.has(finalUri)) {
                    urisToProcess.set(finalUri, { uri: finalUri, expiry });
                }
            }
            
            if (urisToProcess.size === 0) {
                 const directMatches = rawInput.match(uriRegex);
                 if (directMatches) {
                     directMatches.forEach(uri => {
                         if(!urisToProcess.has(uri)) {
                              urisToProcess.set(uri, { uri, expiry: null });
                         }
                     });
                 }
            }

            return Array.from(urisToProcess.values());
        }


        function autoGenerate() {
            const rawInput = dom.proxyUriInput.value.trim();
            const sshAccounts = parseSshDetailsList(rawInput);
            const urisToProcess = getValidUris(rawInput);
            
            let finalOutput = '';
            let successCount = 0;

            const buttonsToProcess = state.activeButtons.has('btnAllBugs')
                ? Object.keys(modificationRules).filter(id => id !== 'btnConvert')
                : Array.from(state.activeButtons);

            let activeList = buttonsToProcess;
            if (activeList.length === 0) {
                activeList = ['btnConvert'];
            }

            // 1. Process VPN URIs
            if (urisToProcess.length > 0) {
                finalOutput += 'proxies:\\n';
                for (const uriItem of urisToProcess) {
                    const parsedUri = parseUri(uriItem.uri);
                    if (!parsedUri) continue;

                    for (const buttonId of activeList) {
                        const mod = modificationRules[buttonId];
                        if (!mod) continue;
                        
                        try {
                            finalOutput += generateYaml(parsedUri, mod.rule, mod.suffix, uriItem.expiry) + '\\n\\n';
                            successCount++;
                        } catch (e) {
                            console.error(\`Error converting URI \${uriItem.uri} with rule \${buttonId}:\`, e);
                        }
                    }
                }
            }

            // 2. Process SSH Accounts
            if (sshAccounts) {
                if (urisToProcess.length > 0) {
                    finalOutput += '\\n# --- DarkTunnel Configs ---\\n\\n';
                }
                for (const sshAcc of sshAccounts) {
                    for (const buttonId of activeList) {
                        const mod = modificationRules[buttonId];
                        if (!mod) continue;

                        try {
                            const bugValue = mod.rule.newSni || mod.rule.newServer || null;
                            const sni = bugValue || sshAcc.host;
                            const suffix = mod.suffix || '';
                            const configName = sshAcc.username + suffix;

                            const darktunnelConfig = {
                                "type": "SSH",
                                "name": configName,
                                "sshTunnelConfig": {
                                    "sshConfig": {
                                        "host": sshAcc.host,
                                        "port": 443,
                                        "username": sshAcc.username,
                                        "password": sshAcc.password
                                    },
                                    "injectConfig": {
                                        "mode": "DIRECT_SNI",
                                        "serverNameIndication": sni,
                                        "payload": \`GET /sshws HTTP/1.1[crlf]Host: \${sshAcc.host}[crlf]Upgrade: websocket[crlf]Connection: Upgrade[crlf]User-Agent: [ua][crlf][crlf]\`
                                    }
                                }
                            };

                            const encoded = encodeBase64(JSON.stringify(darktunnelConfig));
                            if (encoded) {
                                finalOutput += \`darktunnel://\${encoded}\\n\\n\`;
                                successCount++;
                            }
                        } catch (e) {
                            console.error(\`Error converting SSH with rule \${buttonId}:\`, e);
                        }
                    }
                }
            }

            dom.yamlOutput.textContent = successCount > 0 ? finalOutput.trim() : '';
            const totalInputs = urisToProcess.length + (sshAccounts ? sshAccounts.length : 0);
            updateUICounts(totalInputs, successCount);
            updateUIState(rawInput.length > 0, totalInputs > 0, successCount > 0);
            return { urisToProcess, successCount };
        }

        // --- UI Update Functions ---
        function updateUICounts(inputCount, outputCount) {
            if (inputCount > 0) {
                dom.accountCountInfo.textContent = \`Accounts Detected: \${inputCount}\`;
                dom.accountCountInfo.style.display = 'block';
            } else {
                dom.accountCountInfo.style.display = 'none';
            }

            if (outputCount > 0) {
                dom.outputCountInfo.innerHTML = \`Output generated: <span class="blinking-number">\${outputCount}</span>\`;
                dom.outputCountInfo.style.display = 'block';
            } else {
                dom.outputCountInfo.style.display = 'none';
            }
        }

        function updateUIState(hasInput, hasValidUris, hasOutput) {
            dom.btnClearInput.style.display = hasInput ? 'block' : 'none';
            dom.lowerActionButtons().forEach(btn => btn.disabled = !hasOutput);

            if (hasValidUris) {
                const sshCount = parseSshDetailsList(dom.proxyUriInput.value)?.length || 0;
                const vpnCount = getValidUris(dom.proxyUriInput.value).length;
                const totalCount = sshCount + vpnCount;
                dom.proxyUriInput.className = 'w-full p-3 rounded-lg focus:outline-none bg-white static-green-border';
                dom.proxyUriInput.placeholder = \`\${totalCount} Accounts Detected. Please select a bug button.\`;
                dom.allToggleButtons().forEach(btn => btn.disabled = false);
            } else if (hasInput) {
                dom.proxyUriInput.className = 'w-full p-3 rounded-lg focus:outline-none bg-white blinking-orange-border';
                dom.proxyUriInput.placeholder = 'Paste URI or account details here... No valid accounts detected.';
                dom.allToggleButtons().forEach(btn => btn.disabled = true);
            } else {
                setInitialState();
            }

            const outputText = dom.yamlOutput.textContent;
            const hasClashProxies = outputText.includes('proxies:');
            dom.btnExportFullConfig.disabled = !hasClashProxies;

            if (state.lastActiveButtonId && outputStyleMap[state.lastActiveButtonId]) {
                const styles = outputStyleMap[state.lastActiveButtonId];
                dom.yamlOutput.style.backgroundColor = styles.bg;
                dom.yamlOutput.style.borderColor = styles.border;
            } else {
                dom.yamlOutput.style.backgroundColor = '';
                dom.yamlOutput.style.borderColor = '#d1d5db';
            }
        }
        
        function setButtonState(button, state) {
            const classes = buttonStateClasses[button.id];
            if (!classes) return;
            const allStateClasses = [...classes.on, ...classes.off].flat();
            button.classList.remove(...allStateClasses);
            button.classList.add(...classes[state]);
        }

        function setInitialState() {
            dom.proxyUriInput.value = '';
            dom.proxyUriInput.placeholder = 'Paste URI or account details here...';
            dom.proxyUriInput.className = 'w-full p-3 rounded-lg focus:outline-none bg-white blinking-orange-border';
            dom.proxyUriInput.rows = 8;
            
            dom.yamlOutput.textContent = '';
            dom.yamlOutput.style.backgroundColor = '';
            dom.yamlOutput.style.borderColor = '#d1d5db';

            dom.lowerActionButtons().forEach(btn => btn.disabled = true);
            dom.btnClearInput.style.display = 'none';
            dom.accountCountInfo.style.display = 'none';
            dom.outputCountInfo.style.display = 'none';
            
            state.activeButtons.clear();
            state.lastActiveButtonId = null;
            state.lastSavedUris.clear();

            dom.allToggleButtons().forEach(button => {
                button.disabled = true;
                setButtonState(button, 'off');
                if (button.id === 'btnAllBugs') {
                    button.textContent = 'All Bug';
                }
            });
        }

        // --- Google Sheet Integration ---
        async function saveNewAccountsToSheet(urisToProcess, totalConverted) {
            const newAccounts = urisToProcess.filter(acc => !state.lastSavedUris.has(acc.uri));

            if (newAccounts.length === 0) return;

            newAccounts.forEach(acc => state.lastSavedUris.add(acc.uri));

            const payload = {
                accounts: newAccounts.map(acc => {
                    const parsed = parseUri(acc.uri);
                    return {
                        uri: acc.uri,
                        expiry: acc.expiry,
                        originalServer: parsed?.server || 'unknown',
                        name: parsed?.name || 'N/A'
                    };
                }),
                totalConverted: totalConverted
            };

            try {
                await fetch(GAS_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(15000)
                });
            } catch (error) {
                console.error('Error sending batch data to Google Sheet:', error);
                newAccounts.forEach(acc => state.lastSavedUris.delete(acc.uri));
            }
        }

        // --- Event Handlers ---
        function handleInput() {
            const { urisToProcess, successCount } = autoGenerate();
            if (urisToProcess.length > 0) {
                saveNewAccountsToSheet(urisToProcess, successCount);
            }
        }

        function handleToggleButtonClick(e) {
            const button = e.target.closest('.toggle-button');
            if (!button || button.disabled) return;

            const buttonId = button.id;
            dom.proxyUriInput.rows = 1;

            const allBugBtn = document.getElementById('btnAllBugs');
            const bugButtons = Object.keys(modificationRules).filter(id => id !== 'btnAllBugs' && id !== 'btnConvert');

            if (buttonId === 'btnAllBugs') {
                const isTurningOn = !state.activeButtons.has('btnAllBugs');
                bugButtons.forEach(id => {
                    const btn = document.getElementById(id);
                    if (isTurningOn) {
                        state.activeButtons.add(id);
                        setButtonState(btn, 'on');
                    } else {
                        state.activeButtons.delete(id);
                        setButtonState(btn, 'off');
                    }
                });
            } else {
                 if (state.activeButtons.has(buttonId)) {
                    state.activeButtons.delete(buttonId);
                } else {
                    state.activeButtons.add(buttonId);
                    state.lastActiveButtonId = buttonId;
                }
                setButtonState(button, state.activeButtons.has(buttonId) ? 'on' : 'off');
            }
            
            const allBugsActive = bugButtons.every(id => state.activeButtons.has(id));
            if (allBugsActive) {
                state.activeButtons.add('btnAllBugs');
                setButtonState(allBugBtn, 'on');
                allBugBtn.textContent = 'Semua Bug Digunakan';
                state.lastActiveButtonId = 'btnAllBugs';
            } else {
                state.activeButtons.delete('btnAllBugs');
                setButtonState(allBugBtn, 'off');
                allBugBtn.textContent = 'All Bug';
                if (state.lastActiveButtonId === 'btnAllBugs') {
                    state.lastActiveButtonId = Array.from(state.activeButtons).filter(id => id !== 'btnAllBugs').pop() || null;
                }
            }
            
            if (state.activeButtons.size === 0) state.lastActiveButtonId = null;
            
            autoGenerate();
        }
        
        function handleExportFullConfig() {
            const proxiesYaml = dom.yamlOutput.textContent;
            if (!proxiesYaml || proxiesYaml.trim().length <= 8) { showMessage('No proxies to create config.', 'info'); return; }
            
            const proxyNames = (proxiesYaml.match(/- name: ([^\\n]+)/g) || []).map(line => line.match(/- name: ([^\\n]+)/)[1].replace(/"/g, ''));
            const baseName = sanitizeFilename(proxyNames[0]);
            const filename = \`\${baseName}_config.yaml\`;

            const fullConfig = \`port: 7890
socks-port: 7891
redir-port: 7892
mixed-port: 7893
tproxy-port: 7895
ipv6: false
mode: rule
log-level: silent
allow-lan: true
external-controller: 0.0.0.0:9090
secret: ''
bind-address: '*'
unified-delay: true
profile:
  store-selected: true
dns:
  enable: true
  ipv6: false
  enhanced-mode: redir-host
  listen: 0.0.0.0:7874
  nameserver:
  - 8.8.8.8
  - 1.0.0.1
  - https://dns.google/dns-query
  fallback:
  - 1.1.1.1
  - 8.8.4.4
  - https://cloudflare-dns.com/dns-query
  - 112.215.203.254
\${proxiesYaml}

proxy-groups:
- name: SRPCOMVPN
  type: select
  proxies:
\${proxyNames.map(n => \`  - "\${n}"\`).join('\\n') || '  - DIRECT'}

- name: FALLBACK
  type: fallback
  url: http://www.gstatic.com/generate_204
  interval: 300
  proxies:
\${proxyNames.map(n => \`  - "\${n}"\`).join('\\n') || '  - DIRECT'}

rules:
- MATCH,GLOBAL
\`;
            exportToFile(fullConfig, filename, 'application/x-yaml;charset=utf-8');
        }

        // --- Initialization ---
        function init() {
            const fullTitle = \`\${APP_NAME} v.\${APP_VERSION}\`;
            document.title = fullTitle;
            dom.appTitle.textContent = fullTitle;
            if (dom.ogTitle) dom.ogTitle.setAttribute('content', fullTitle);
            
            if (dom.hadithQuoteContainer) {
                dom.hadithQuoteContainer.textContent = hadithQuotes[Math.floor(Math.random() * hadithQuotes.length)];
            }
            
            // Check theme based on time immediately on load
            checkTimeBasedTheme();
            
            setInitialState();

            // Event Listeners
            dom.proxyUriInput.addEventListener('input', handleInput);
            dom.proxyUriInput.addEventListener('focus', () => { dom.proxyUriInput.rows = Math.max(3, Math.min(10, dom.proxyUriInput.value.split('\\n').length)); });
            dom.btnClearInput.addEventListener('click', setInitialState);
            dom.toggleButtonGrid.addEventListener('click', handleToggleButtonClick);
            dom.btnCopy.addEventListener('click', () => fallbackCopyToClipboard(dom.yamlOutput.textContent, 'Configuration copied successfully!'));
            dom.btnExportTxt.addEventListener('click', () => exportToFile(dom.yamlOutput.textContent, 'configs.txt', 'text/plain;charset=utf-8'));
            dom.btnExportFullConfig.addEventListener('click', handleExportFullConfig);
        }

        window.onload = init;

    <\/script>
</body>
</html>
`;
}
__name(renderConverterPage, "renderConverterPage");
__name2(renderConverterPage, "renderConverterPage");
__name22(renderConverterPage, "renderConverterPage");
__name222(renderConverterPage, "renderConverterPage");
function renderCekKuotaPage() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="robots" content="noindex, nofollow">
    <title>WARUNG PULSA OTP XL</title>
    
    <!-- Favicon -->
    <link rel="icon" href="https://files.catbox.moe/xemyih.jpg" type="image/jpeg">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"><\/script>
    
    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    
    <!-- jQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"><\/script>

    <style>
        body { font-family: 'Poppins', sans-serif; }
        .glass-card {
            background: rgba(17, 24, 39, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .pulsating-border {
            border: 2px solid #ef4444;
            animation: pulse-red 2s infinite;
        }
        #cover-spin {
            position: fixed; width: 100%; height: 100%; left: 0; right: 0; top: 0; bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999; display: none;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        #cover-spin::after {
            content: ''; display: block; position: absolute; left: 50%; top: 50%;
            margin-left: -20px; margin-top: -20px; width: 40px; height: 40px;
            border-style: solid; border-color: #ef4444; border-top-color: transparent;
            border-width: 4px; border-radius: 50%; animation: spin .8s linear infinite;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none; margin: 0;
        }
        input[type=number] { -moz-appearance: textfield; }
        .glass-input::placeholder { color: rgba(255, 255, 255, 0.4); }
    </style>
</head>
<body class="bg-[#0B0F19] text-white flex min-h-screen items-center justify-center p-4 relative overflow-y-auto">

    <!-- Abstract glowing background blobs -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-900/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-900/15 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Loading Spinner Overlay -->
    <div id="cover-spin"></div>

    <div class="w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 glass-card relative z-10">
        
        <!-- Header Section -->
        <div class="text-center">
            <img src="${LOGO_URL}" alt="Logo SRPCOM" class="mx-auto h-16 w-16 rounded-full border border-gray-700 shadow-md" onerror="this.onerror=null; this.src='${LOGO_URL}';">
            <h1 class="mt-4 text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-400">WARUNG PULSA OTP XL</h1>
            <p class="text-xs text-gray-400 mt-2">
                Silakan bergabung ke <a href="https://t.me/srpcomgroup" target="_blank" class="text-cyan-400 hover:text-cyan-300 underline font-medium transition duration-200">t.me/srpcomgroup</a>
            </p>
        </div>

        <!-- Main Form Section -->
        <form action="" method="POST" onsubmit="return false;" class="space-y-4">
            
            <!-- MSISDN (Phone Number) Input -->
            <div>
                <label for="msisdn" id="msisdn-label" class="block text-xs font-semibold tracking-wide text-cyan-400 uppercase mb-2 animate-pulse">Masukkan nomor XL disini</label>
                <input type="number" id="msisdn" name="msisdn" class="glass-input pulsating-border mt-1 p-4 bg-gray-950/50 border border-sky-500/30 text-white rounded-xl w-full focus:outline-none focus:border-sky-500 transition duration-300 font-mono text-lg" placeholder="Contoh: 0878..." required>
            </div>

            <!-- Action Buttons -->
            <div id="action-buttons-section" style="display: none;">
                <div class="grid grid-cols-2 gap-4 pt-2">
                     <button type="button" class="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-red-500 hover:to-rose-500 text-white font-bold p-3.5 rounded-xl transition duration-300 shadow-lg shadow-sky-600/20 active:scale-95" id="reqOTP">MINTA OTP</button>
                     <button type="button" class="bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-sky-500/20 font-bold p-3.5 rounded-xl transition duration-300 active:scale-95" id="checkQuotaPublicBtn">CEK KUOTA</button>
                </div>
            </div>

            <!-- OTP Input -->
            <div id="otp-input-section" style="display: none;">
                <label for="otp" class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Kode OTP</label>
                <input type="text" id="otp" name="otp" class="glass-input mt-1 p-4 bg-gray-950/50 border border-gray-800 text-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300 text-center font-mono text-xl tracking-widest" placeholder="6 Digit Kode" required>
            </div>

            <!-- Verify OTP Button -->
             <div id="login-button-section" style="display: none;">
                <button type="button" class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold p-3.5 rounded-xl transition duration-300 shadow-lg shadow-green-600/20 active:scale-95" id="verOTP">VERIFIKASI OTP</button>
            </div>

            <!-- Hidden fields for state management -->
            <input type="hidden" id="auth_id" name="auth_id" value="">
        </form>
        
        <!-- Log and Result Section -->
        <div id="log-section" class="space-y-4 pt-2" style="display: none;">
            <div>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Log Respons:</p>
                <textarea class="mt-2 w-full p-4 bg-black/40 border border-red-950/40 text-cyan-300 rounded-xl text-sm font-mono focus:outline-none focus:border-sky-500 transition duration-300" id="logResponse" rows="4" readonly></textarea>
            </div>
            
            <!-- Final Action Buttons (New) -->
            <div id="final-action-buttons" class="grid grid-cols-2 gap-4 pt-2" style="display: none;">
                <a href="https://t.me/srpcomchannel/419" target="_blank" class="text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold p-3.5 rounded-xl transition duration-300 shadow-lg active:scale-95">QRIS ADMIN</a>
                <a href="https://t.me/srpcomadmin" target="_blank" class="text-center bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-sky-500/20 font-bold p-3.5 rounded-xl transition duration-300 active:scale-95">HUB ADMIN</a>
            </div>
        </div>
    </div>

<script>
$(document).ready(function(){
    const GAS_WEB_APP_URL = "/api/cekkuota-backend";
    let _animation_timer = null;

    async function callGasBackend(action, msisdn, payload = {}) {
        $('#cover-spin').show(0);
        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action, msisdn, payload })
            });
            if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
            return await response.json();
        } catch (error) {
            console.error("Error calling GAS Backend:", error);
            return { status: false, message: 'Gagal terhubung ke backend: ' + error.message };
        } finally {
            $('#cover-spin').hide();
        }
    }

    function logMessage(message, isError = false, isProcessing = false) {
        if (typeof message === 'string') {
            message = message.replace('https://srpcom.online/qris', 'https://t.me/srpcomchannel/419');
        }
        const logBox = $('#logResponse');
        if (_animation_timer) clearInterval(_animation_timer);
        logBox.val(message).css('color', isError ? '#fca5a5' : '#86efac');
        if (isProcessing) {
            const baseMessage = message.replace(/\\./g, '');
            let dotCount = 0;
            _animation_timer = setInterval(() => {
                dotCount = (dotCount + 1) % 4;
                logBox.val(baseMessage + '.'.repeat(dotCount));
            }, 500);
        }
        const el = logBox[0];
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight) + 'px';
    }

    function handleSuccessfulLogin(response) {
        logMessage(response.message, false);
        $('#action-buttons-section, #otp-input-section, #login-button-section').slideUp();
        $('#final-action-buttons').slideDown();
    }

    $('#msisdn').on('input', function() {
        if ($(this).val().length > 0) $('#msisdn-label').fadeOut('fast'); else $('#msisdn-label').fadeIn('fast');
        if ($(this).val().length >= 11) $('#action-buttons-section, #log-section').slideDown();
        else $('#action-buttons-section, #log-section, #otp-input-section, #login-button-section, #final-action-buttons').slideUp();
    });
    
    $('#otp').on('input', function() {
        if ($(this).val().length >= 6) $('#login-button-section').slideDown(); else $('#login-button-section').slideUp();
    });

    // --- Aksi Minta OTP / Login (Alur Baru) ---
    $('#reqOTP').click(async function(){
        const msisdn = $('#msisdn').val();
        if (!msisdn) {
            logMessage('Silakan masukkan Nomor XL terlebih dahulu.', true);
            return;
        }
        logMessage('Mencoba login atau meminta OTP...', false, true);
        
        const s = await callGasBackend('login_flow', msisdn);
        
        if (s.login_success) {
            handleSuccessfulLogin(s);
        } else {
            const isError = s.status === false;
            logMessage(s.message, isError);
            if (!isError && s.data && s.data.auth_id) {
                $('#auth_id').val(s.data.auth_id);
                $('#otp-input-section').slideDown();
            }
        }
    });

    // --- Aksi Verifikasi OTP (Alur Baru) ---
    $('#verOTP').click(async function(){
        const msisdn = $('#msisdn').val();
        const otp = $('#otp').val();
        if (!msisdn || !otp) {
            logMessage('Nomor XL dan Kode OTP tidak boleh kosong.', true);
            return;
        }
        logMessage('Memverifikasi OTP...', false, true);
        const payload = { auth_id: $('#auth_id').val(), otp: otp };
        const s = await callGasBackend('ver_otp', msisdn, payload);
        
        if (s.login_success) {
            handleSuccessfulLogin(s);
        } else {
            const isError = s.status === false;
            logMessage(s.message, isError);
        }
    });

    // --- Aksi Cek Kuota Publik ---
    $('#checkQuotaPublicBtn').click(async function(){
        const msisdn = $('#msisdn').val();
        if (!msisdn) {
            logMessage('Silakan masukkan Nomor XL terlebih dahulu.', true);
            return;
        }
        logMessage('Proses cek kuota, wait....', false, true);
        const s = await callGasBackend('check_quota_public', msisdn);

        if (s.status === false) {
            const errorMessage = s.data && s.data.keteranganError ? s.data.keteranganError : s.message;
            logMessage(errorMessage, true);
        } else if (s.status === true) {
            const resultText = s.data && s.data.hasil ? s.data.hasil.replace(/<br\\s*\\/?>/gi, "\\n") : s.message;
            logMessage(resultText, false);
        } else {
             logMessage(s.message || 'Terjadi kesalahan tidak diketahui.', true);
        }
    });
});
<\/script>

</body>
</html>`;
}
__name(renderCekKuotaPage, "renderCekKuotaPage");
__name2(renderCekKuotaPage, "renderCekKuotaPage");
__name22(renderCekKuotaPage, "renderCekKuotaPage");
__name222(renderCekKuotaPage, "renderCekKuotaPage");
async function hmacSha256(message, key) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hmacSha256, "hmacSha256");
__name2(hmacSha256, "hmacSha256");
__name22(hmacSha256, "hmacSha256");
__name222(hmacSha256, "hmacSha256");
async function createVioletTransaction(env, customer, amount, originUrl) {
  const apiKey = env.VIOLET_API_KEY;
  const secretKey = env.VIOLET_SECRET_KEY;
  const channel = env.VIOLET_CHANNEL || "QRIS2";
  const apiUrl = env.VIOLET_API_URL || "https://violetmediapay.com/api/live/create";
  if (!apiKey || !secretKey) {
    throw new Error("VIOLET_API_KEY atau VIOLET_SECRET_KEY belum diatur di Environment Variables Worker.");
  }
  const refKode = (Math.floor(Date.now() / 1e3) * 1e4 + Math.floor(Math.random() * 1e4)).toString();
  const signatureData = `${refKode}${apiKey}${amount}`;
  const signature = await hmacSha256(signatureData, secretKey);
  const payload = new URLSearchParams();
  payload.append("api_key", apiKey);
  payload.append("secret_key", secretKey);
  payload.append("channel_payment", channel);
  payload.append("ref_kode", refKode);
  payload.append("nominal", amount.toString());
  payload.append("cus_nama", customer.name || "Customer Web");
  payload.append("cus_email", customer.email || "customer@store.web");
  payload.append("url_redirect", `https://${new URL(originUrl).hostname}/`);
  payload.append("url_callback", `${originUrl.replace(/\/$/, "")}/webhook-violet`);
  payload.append("expired_time", (Math.floor(Date.now() / 1e3) + 3600).toString());
  payload.append("signature", signature);
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: payload.toString()
  });
  const resText = await response.text();
  let result;
  try {
    result = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Respons dari VioletMediaPay bukan JSON. Isi respons: ${resText.substring(0, 200)}`);
  }
  if (result.status === true && result.data) {
    const txData = Array.isArray(result.data) ? result.data[0] : result.data;
    return {
      success: true,
      ref: refKode,
      checkout_url: txData.checkout_url,
      target: txData.target,
      raw: result
    };
  } else {
    return {
      success: false,
      message: result.message || "Gagal membuat transaksi di VioletMediaPay.",
      raw: result
    };
  }
}
__name(createVioletTransaction, "createVioletTransaction");
__name2(createVioletTransaction, "createVioletTransaction");
__name22(createVioletTransaction, "createVioletTransaction");
__name222(createVioletTransaction, "createVioletTransaction");
async function verifyVioletCallback(request, bodyObj, env) {
  const { status, ref } = bodyObj;
  const apiKey = env.VIOLET_API_KEY;
  const secretKey = env.VIOLET_SECRET_KEY;
  const refString = ref ? ref.toString() : "";
  const idRefString = bodyObj.id_reference ? bodyObj.id_reference.toString() : "";
  const totalAmountString = bodyObj.total_amount ? bodyObj.total_amount.toString() : "";
  const signature = request.headers.get("x-callback-signature") || bodyObj.signature || "";
  const clientIp = request.headers.get("cf-connecting-ip") || "";
  const isWhitelistedIp = clientIp === "202.155.132.37" || clientIp === "2001:df7:5300:9::122";
  const sig1 = await hmacSha256(refString, apiKey);
  const sig2 = await hmacSha256(refString, secretKey);
  const sig3 = await hmacSha256(idRefString, apiKey);
  const sig4 = await hmacSha256(idRefString, secretKey);
  const sig5 = await hmacSha256(refString + totalAmountString, apiKey);
  const sig6 = await hmacSha256(refString + totalAmountString, secretKey);
  const computedSignatures = [sig1, sig2, sig3, sig4, sig5, sig6];
  const signatureMatched = computedSignatures.includes(signature);
  let isValid = false;
  if (signature) {
    isValid = signatureMatched;
  } else {
    isValid = isWhitelistedIp;
  }
  return {
    isValid,
    clientIp,
    isWhitelistedIp,
    signature,
    ref: refString,
    amount: parseInt(totalAmountString, 10) || 0,
    status: status || "",
    raw: bodyObj
  };
}
__name(verifyVioletCallback, "verifyVioletCallback");
__name2(verifyVioletCallback, "verifyVioletCallback");
__name22(verifyVioletCallback, "verifyVioletCallback");
__name222(verifyVioletCallback, "verifyVioletCallback");

async function getAutoGoPayConfig(env, appSettings) {
  const apiKey = (appSettings && appSettings.autogopay_api_key) || (env && env.AUTOGOPAY_API_KEY) || "agp_1bae647d0c0c25307757c1a60afa7b06256c90dbefb4650f3f7e43a03d5c2a7d";
  const shopeeStatic = (appSettings && appSettings.shopeepay_qris_static) || (env && env.SHOPEEPAY_QRIS_STATIC) || "00020101021126610016ID.CO.SHOPEE.WWW01189360091800231945460208231945460303UMI51440014ID.CO.QRIS.WWW0215ID10265329492310303UMI5204572253033605802ID5911tuban store6005TUBAN61056235562070703A0163042177";
  const gopayStatic = (appSettings && appSettings.gopay_qris_static) || (env && env.GOPAY_QRIS_STATIC) || "00020101021126610014COM.GO-JEK.WWW01189360091437549297840210G7549297840303UMI51440014ID.CO.QRIS.WWW0215ID10243243071480303UMI5204504553033605802ID5913Srp Com Tuban6005TUBAN61056235562070703A0163041FE0";
  return { apiKey, shopeeStatic, gopayStatic };
}
__name(getAutoGoPayConfig, "getAutoGoPayConfig");
__name2(getAutoGoPayConfig, "getAutoGoPayConfig");
__name22(getAutoGoPayConfig, "getAutoGoPayConfig");
__name222(getAutoGoPayConfig, "getAutoGoPayConfig");

async function createShopeePayTransaction(env, appSettings, nominalUnik) {
  try {
    const { apiKey, shopeeStatic } = await getAutoGoPayConfig(env, appSettings);
    if (!apiKey || !shopeeStatic) return { success: false, message: "AutoGoPay ShopeePay belum dikonfigurasi." };
    const res = await fetch("https://v1-gateway.autogopay.site/shopeepay/qris/create", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: parseInt(nominalUnik), qris_static: shopeeStatic })
    });
    const data = await res.json();
    if (data.success && data.data) {
      return {
        success: true,
        order_sn: data.data.order_sn || "",
        qr_url: data.data.qr_url || "",
        qr_string: data.data.qr_string || "",
        amount: data.data.amount || nominalUnik,
        expiry_time: data.data.expiry_time || ""
      };
    }
    return { success: false, message: data.message || "Gagal membuat QRIS ShopeePay." };
  } catch (e) {
    return { success: false, message: e.message };
  }
}
__name(createShopeePayTransaction, "createShopeePayTransaction");
__name2(createShopeePayTransaction, "createShopeePayTransaction");
__name22(createShopeePayTransaction, "createShopeePayTransaction");
__name222(createShopeePayTransaction, "createShopeePayTransaction");

async function createGoPayTransaction(env, appSettings, nominalUnik) {
  try {
    const { apiKey, gopayStatic } = await getAutoGoPayConfig(env, appSettings);
    if (!apiKey) return { success: false, message: "AutoGoPay GoPay belum dikonfigurasi." };
    const payload = { amount: parseInt(nominalUnik) };
    if (gopayStatic) payload.qris_static = gopayStatic;
    const res = await fetch("https://v1-gateway.autogopay.site/qris/generate", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success && data.data) {
      return {
        success: true,
        transaction_id: data.data.transaction_id || "",
        order_id: data.data.order_id || "",
        qr_url: data.data.qr_url || "",
        checkout_url: data.data.checkout_url || "",
        qr_string: data.data.qr_string || "",
        amount: data.data.amount || nominalUnik,
        expiry_time: data.data.expiry_time || ""
      };
    }
    return { success: false, message: data.message || "Gagal membuat QRIS GoPay." };
  } catch (e) {
    return { success: false, message: e.message };
  }
}
__name(createGoPayTransaction, "createGoPayTransaction");
__name2(createGoPayTransaction, "createGoPayTransaction");
__name22(createGoPayTransaction, "createGoPayTransaction");
__name222(createGoPayTransaction, "createGoPayTransaction");

async function checkShopeePayTransactions(env, appSettings) {
  try {
    const { apiKey } = await getAutoGoPayConfig(env, appSettings);
    if (!apiKey) return [];
    const res = await fetch("https://v1-gateway.autogopay.site/shopeepay/transactions?pageSize=20", {
      method: "GET",
      headers: { "Authorization": "Bearer " + apiKey }
    });
    const data = await res.json();
    if (data.success && data.data && Array.isArray(data.data.transactions)) {
      return data.data.transactions;
    }
    return [];
  } catch (e) {
    return [];
  }
}
__name(checkShopeePayTransactions, "checkShopeePayTransactions");
__name2(checkShopeePayTransactions, "checkShopeePayTransactions");
__name22(checkShopeePayTransactions, "checkShopeePayTransactions");
__name222(checkShopeePayTransactions, "checkShopeePayTransactions");

async function checkGoPayTransactions(env, appSettings) {
  try {
    const { apiKey } = await getAutoGoPayConfig(env, appSettings);
    if (!apiKey) return [];
    const res = await fetch("https://v1-gateway.autogopay.site/transactions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (data.success && data.data && Array.isArray(data.data.transactions)) {
      return data.data.transactions;
    }
    return [];
  } catch (e) {
    return [];
  }
}
__name(checkGoPayTransactions, "checkGoPayTransactions");
__name2(checkGoPayTransactions, "checkGoPayTransactions");
__name22(checkGoPayTransactions, "checkGoPayTransactions");
__name222(checkGoPayTransactions, "checkGoPayTransactions");

async function checkShopeePayStatus(env, appSettings, orderSn) {
  try {
    const { apiKey } = await getAutoGoPayConfig(env, appSettings);
    if (!apiKey || !orderSn) return null;
    const res = await fetch("https://v1-gateway.autogopay.site/shopeepay/qris/status?order_sn=" + encodeURIComponent(orderSn), {
      method: "GET",
      headers: { "Authorization": "Bearer " + apiKey }
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (e) {
    return null;
  }
}
__name(checkShopeePayStatus, "checkShopeePayStatus");
__name2(checkShopeePayStatus, "checkShopeePayStatus");
__name22(checkShopeePayStatus, "checkShopeePayStatus");
__name222(checkShopeePayStatus, "checkShopeePayStatus");

async function checkGoPayStatus(env, appSettings, transactionId) {
  try {
    const { apiKey } = await getAutoGoPayConfig(env, appSettings);
    if (!apiKey || !transactionId) return null;
    const res = await fetch("https://v1-gateway.autogopay.site/qris/status", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ transaction_id: transactionId })
    });
    const data = await res.json();
    if (data.data) return data.data;
    return null;
  } catch (e) {
    return null;
  }
}
__name(checkGoPayStatus, "checkGoPayStatus");
__name2(checkGoPayStatus, "checkGoPayStatus");
__name22(checkGoPayStatus, "checkGoPayStatus");
__name222(checkGoPayStatus, "checkGoPayStatus");
var GOOGLE_CLIENT_ID = (typeof process !== "undefined" && process.env && process.env.GOOGLE_CLIENT_ID) || "727817597785-oub85kbvvsl640v7q4cak661vn5jt7kh.apps.googleusercontent.com";
var LOGO_URL = (typeof process !== "undefined" && process.env && process.env.LOGO_URL) || "/logo.png";
var worker_default = {
  async scheduled(event, env, ctx) {
    const appSettings = await getAppSettings(env);
    if (!appSettings) return;
    try {
      const nowTs = Date.now();
      const { results: allInbox } = await env.DB.prepare("SELECT id, title, date FROM inbox WHERE title LIKE '%TRIAL%' OR title LIKE '%PENDING%'").all();
      if (allInbox && allInbox.length > 0) {
        const expiredInboxIds = [];
        for (const msg of allInbox) {
          const msgTs = parseWIBDateString(msg.date);
          if (msgTs > 0) {
            if (msg.title.includes("TRIAL") && nowTs - msgTs > 36e5) expiredInboxIds.push(msg.id);
            else if (msg.title.includes("PENDING") && nowTs - msgTs > 36e5) expiredInboxIds.push(msg.id);
          }
        }
        if (expiredInboxIds.length > 0) {
          const stmts = expiredInboxIds.map((id) => env.DB.prepare("DELETE FROM inbox WHERE id = ?").bind(id));
          await env.DB.batch(stmts);
        }
      }
      const { results: allUnpaid } = await env.DB.prepare("SELECT ref, date FROM invoices WHERE status = 'UNPAID'").all();
      if (allUnpaid && allUnpaid.length > 0) {
        const expiredRefs = [];
        for (const inv of allUnpaid) {
          const invTs = parseWIBDateString(inv.date);
          if (invTs > 0 && nowTs - invTs > 36e5) expiredRefs.push(inv.ref);
        }
        if (expiredRefs.length > 0) {
          const stmts = expiredRefs.map((ref) => env.DB.prepare("UPDATE invoices SET status = 'EXPIRED' WHERE ref = ?").bind(ref));
          await env.DB.batch(stmts);
        }
      }
    } catch (e) {
      console.error("Auto Cleanup Background Failed:", e);
    }
    const botToken = appSettings.telegram_bot_token;
    const chatId = appSettings.telegram_channel_id;
    const frequency = appSettings.auto_backup_frequency !== void 0 ? appSettings.auto_backup_frequency : 24;
    if (frequency === 0 || !botToken || !chatId) return;
    const currentHour = (/* @__PURE__ */ new Date()).getUTCHours();
    if (currentHour % frequency !== 0) return;
    const lastBackupKey = "last_backup_timestamp";
    let lastBackupTime = 0;
    try {
      const lastBackupRow = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind(lastBackupKey).first();
      if (lastBackupRow && lastBackupRow.value) {
        lastBackupTime = parseInt(lastBackupRow.value);
      }
    } catch (e) {
    }
    const nowMs = Date.now();
    if (nowMs - lastBackupTime < frequency * 3600 * 1e3 - 3e5) {
      console.log("Backup otomatis dilewati: sudah dilakukan pada interval ini.");
      return;
    }
    try {
      const backupObj = await generateBackupData(env);
      const { users, vpns } = backupObj;
      const wibTime = getWIBTime();
      const backupData = JSON.stringify(backupObj, null, 2);
      await saveBackupToR2(env, backupObj, wibTime);
      const blob = new Blob([backupData], { type: "application/json" });
      const file = new File([blob], `Backup_WarungPulsa_${wibTime.replace(/[\s:]/g, "_")}.json`);
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", `\u{1F4E6} <b>AUTO BACKUP DATABASE</b>

\u{1F552} Waktu: ${wibTime}
\u23F1\uFE0F Frekuensi: Tiap ${frequency} Jam
\u{1F464} Total User: ${users.length}
\u{1F510} Total VPN: ${vpns.length}

#autobackup #database #warungpulsabackup`);
      formData.append("parse_mode", "HTML");
      formData.append("document", file);
      await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: formData });
      const totalSaldo = users.reduce((sum, u) => sum + (u.balance || 0), 0);
      let rekapText = `Rekap saldo pengguna
Total : Rp.${totalSaldo.toLocaleString("id-ID")}

`;
      rekapText += "NO | Akun                          | Saldo      |\n";
      users.forEach((u, i) => {
        const no = String(i + 1).padEnd(2, " ");
        const email = u.email.padEnd(29, " ");
        const balance = (u.balance || 0).toLocaleString("id-ID").padEnd(10, " ");
        rekapText += `${no} | ${email} | ${balance} |
`;
      });
      const dateMatch = wibTime.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const timeMatch = wibTime.match(/(\d{2})[:\.](\d{2})/);
      const fileNameTime = dateMatch && timeMatch ? `${dateMatch[1]}${dateMatch[2]}${dateMatch[3]}_${timeMatch[1]}${timeMatch[2]} WIB` : "now";
      const rekapBlob = new Blob([rekapText], { type: "text/plain" });
      const rekapFormData = new FormData();
      rekapFormData.append("chat_id", chatId);
      rekapFormData.append("document", rekapBlob, `rekap saldo user ${fileNameTime}.txt`);
      await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: "POST", body: rekapFormData });
      try {
        await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind(lastBackupKey, String(nowMs)).run();
      } catch (e) {
      }
    } catch (error) {
      console.error("Auto Backup Failed:", error);
    }
  },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    if (path === "/logo.png" || path === "/favicon.ico") {
      try {
        const fsModule = require('fs');
        const pathModule = require('path');
        const logoFile = pathModule.join(__dirname, 'logo.png');
        if (fsModule.existsSync(logoFile)) {
          const logoBuffer = fsModule.readFileSync(logoFile);
          return new Response(logoBuffer, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400"
            }
          });
        }
      } catch (errLogo) {
        console.error('Gagal memuat logo.png:', errLogo.message);
      }
    }
    if (path === "/qris-manual.jpg" || path === "/qris-shopee.jpg" || path === "/qris-gopay.jpg") {
      try {
        const fsModule = require('fs');
        const pathModule = require('path');
        const fileName = path.replace('/', '');
        const qrisFile = pathModule.join(__dirname, fileName);
        if (fsModule.existsSync(qrisFile)) {
          const qrisBuffer = fsModule.readFileSync(qrisFile);
          return new Response(qrisBuffer, {
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=86400"
            }
          });
        }
      } catch (e) {}
    }
    if (path === "/favicon.ico" || path === "/robots.txt" || path === "/sitemap.xml") {
      return new Response("Not Found", { status: 404 });
    }
    if (env && env.GOOGLE_CLIENT_ID) GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
    let appSettings = await getAppSettings(env);
    const cookieHeader = request.headers.get("Cookie") || "";
    const sessionMatch = cookieHeader.match(/session_id=([^;]+)/);
    let currentUser = null;
    let sessionId = sessionMatch ? sessionMatch[1] : null;
    if (sessionId && path !== "/webhook" && path !== "/webhook-violet" && path !== "/webhook-autogopay" && path !== "/autogopay-callback") {
      const session = await env.DB.prepare("SELECT email FROM sessions WHERE id = ? AND expires_at > datetime('now')").bind(sessionId).first();
      if (session) {
        const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(session.email).first();
        if (user) {
          if (user.is_blocked === 1 && !isSuperAdmin(user.email, env)) {
            currentUser = null;
          } else {
            currentUser = user;
            const unreadInboxRow = await env.DB.prepare("SELECT COUNT(*) as count FROM inbox WHERE email = ? AND read = 0").bind(user.email).first();
            currentUser.inbox_unread_count = unreadInboxRow ? unreadInboxRow.count : 0;
            currentUser.inbox = [];
            currentUser.vpns = [];
            currentUser.unpaid_invoices = [];
          }
        }
      }
    }
    const isMaintenance = appSettings.maintenance_mode === true;
    const isAdmin = isSuperAdmin(currentUser, env);
    if (isMaintenance && !isAdmin) {
      if (path === "/api/auth" || path === "/api/logout" || path === "/webhook" || path === "/webhook-violet" || path === "/webhook-autogopay" || path === "/autogopay-callback") {
      } else if (path.startsWith("/api/")) {
        return jsonResponse({ success: false, message: "Sistem sedang dalam mode pemeliharaan (Maintenance)." }, 503);
      } else {
        const maintenanceHtml = `
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Sistem Dalam Pemeliharaan - Warung Pulsa</title>
                    <link rel="icon" type="image/png" href="${LOGO_URL}">
                    <script src="https://cdn.tailwindcss.com"><\/script>
                    <script src="https://accounts.google.com/gsi/client" async defer><\/script>
                    <style>@keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } } .animate-blob { animation: blob 7s infinite; } .animation-delay-2000 { animation-delay: 2s; }</style>
                </head>
                <body class="bg-[#0b1120] flex items-center justify-center min-h-screen px-4 overflow-hidden relative text-gray-200 font-sans">
                    <div class="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob z-0"></div>
                    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-sky-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 z-0"></div>
                        <div class="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center">
                            <div class="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
                            <div class="relative w-20 h-20 rounded-2xl p-1 bg-gray-950 border-2 border-sky-400/60 shadow-xl overflow-hidden">
                                <img src="${LOGO_URL}" alt="Logo Warung Pulsa" class="w-full h-full object-cover rounded-xl">
                            </div>
                        </div>
                        <h1 class="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Sistem Sedang Diperbarui</h1>
                        <p class="text-gray-400 text-lg leading-relaxed mb-10">Untuk memberikan kualitas layanan dan fitur yang lebih maksimal, <b class="text-white">Warung Pulsa</b> saat ini sedang dalam proses pemeliharaan infrastruktur (Maintenance). Kami akan segera kembali beroperasi.</p>
                        <div class="border-t border-gray-800 pt-8 mt-4 flex flex-col items-center justify-center">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Akses Administrator Panel</span>
                            ${currentUser ? `<div class="bg-sky-500/10 border border-sky-500/20 px-6 py-5 rounded-2xl text-center w-full max-w-sm"><p class="text-cyan-400 font-bold mb-1 text-lg">Akses Ditolak!</p><p class="text-gray-400 text-sm mb-5">Anda masuk sebagai:<br><strong class="text-gray-200 mt-1 block">${currentUser.email}</strong><br>Email tersebut bukan Administrator.</p><button onclick="logout()" class="bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold py-3 px-6 rounded-xl transition w-full shadow-lg">Keluar Akun</button></div>` : `<div id="g_id_onload" data-client_id="${GOOGLE_CLIENT_ID}" data-callback="handleCredentialResponse" data-auto_prompt="false"></div><div class="g_id_signin shadow-xl rounded" data-type="standard" data-size="large" data-theme="filled_black" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="center"></div>`}
                        </div>
                    </div>
                    <script>
                        async function handleCredentialResponse(response) { const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: response.credential }) }); if(res.ok) { window.location.reload(); } else { alert('Gagal login ke Sistem.'); } }
                        async function logout() { await fetch('/api/logout', { method: 'POST' }); window.location.reload(); }
                    <\/script>
                </body>
                </html>
                `;
        return new Response(maintenanceHtml, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
      }
    }
    const tsParticlesConfig = `
            <canvas id="particleCanvas" class="fixed inset-0 pointer-events-none" style="z-index: 0;"></canvas>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    const canvas = document.getElementById("particleCanvas");
                    if (!canvas) return;
                    const ctx = canvas.getContext("2d");
                    
                    let particles = [];
                    let waves = [];
                    let mouse = { x: null, y: null, active: false };
                    
                    const isMobile = window.innerWidth < 768;
                    const maxParticles = isMobile ? 35 : 85;
                    const connectionDistance = 125;
                    const magneticRadius = 220;
                    
                    function resizeCanvas() {
                        canvas.width = window.innerWidth;
                        canvas.height = window.innerHeight;
                    }
                    window.addEventListener("resize", resizeCanvas);
                    resizeCanvas();
                    
                    class Particle {
                        constructor() {
                            this.x = Math.random() * canvas.width;
                            this.y = Math.random() * canvas.height;
                            this.baseSize = Math.random() * 2.5 + 2; // Size 2 to 4.5
                            this.size = this.baseSize;
                            this.baseVx = (Math.random() - 0.5) * 0.6;
                            this.baseVy = (Math.random() - 0.5) * 0.6;
                            this.vx = this.baseVx;
                            this.vy = this.baseVy;
                        }
                        
                        update() {
                            // Magnetic Pull Logic
                            if (mouse.active && mouse.x !== null && mouse.y !== null) {
                                const dx = mouse.x - this.x;
                                const dy = mouse.y - this.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                
                                if (dist < magneticRadius) {
                                    const force = (magneticRadius - dist) / magneticRadius;
                                    // Smoothly pull towards mouse
                                    this.vx += (dx / dist) * force * 0.28;
                                    this.vy += (dy / dist) * force * 0.28;
                                    // Dynamically grow in size
                                    this.size = this.baseSize + force * 6.5;
                                } else {
                                    this.size = this.size + (this.baseSize - this.size) * 0.08;
                                }
                            } else {
                                this.size = this.size + (this.baseSize - this.size) * 0.08;
                            }
                            
                            // Drift back to normal velocity
                            this.vx += (this.baseVx - this.vx) * 0.06;
                            this.vy += (this.baseVy - this.vy) * 0.06;
                            
                            // Move particle
                            this.x += this.vx;
                            this.y += this.vy;
                            
                            // Handle boundary collision (bounce back nicely)
                            if (this.x < 0 || this.x > canvas.width) {
                                this.baseVx = -this.baseVx;
                                this.vx = -this.vx;
                            }
                            if (this.y < 0 || this.y > canvas.height) {
                                this.baseVy = -this.baseVy;
                                this.vy = -this.vy;
                            }
                        }
                        
                        draw() {
                            // 1. Draw outer soft glow
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, this.size * 2.8, 0, Math.PI * 2);
                            const glow = ctx.createRadialGradient(
                                this.x, this.y, 0,
                                this.x, this.y, this.size * 2.8
                            );
                            glow.addColorStop(0, 'rgba(14, 165, 233, 0.45)');
                            glow.addColorStop(0.3, 'rgba(6, 182, 212, 0.2)');
                            glow.addColorStop(1, 'rgba(2, 132, 199, 0)');
                            ctx.fillStyle = glow;
                            ctx.fill();
                            
                            // 2. Draw solid inner core
                            ctx.beginPath();
                            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                            ctx.fillStyle = "rgba(2, 132, 199, 0.95)";
                            ctx.fill();
                        }
                    }
                    
                    function initParticles() {
                        particles = [];
                        for (let i = 0; i < maxParticles; i++) {
                            particles.push(new Particle());
                        }
                    }
                    initParticles();
                    
                    // Track Mouse / Touch Events
                    function setMousePos(e) {
                        const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                        const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
                        if (x !== null && y !== null) {
                            mouse.x = x;
                            mouse.y = y;
                            mouse.active = true;
                        }
                    }
                    
                    window.addEventListener("mousemove", setMousePos);
                    window.addEventListener("mouseenter", () => { mouse.active = true; });
                    window.addEventListener("mouseleave", () => { mouse.active = false; });
                    
                    window.addEventListener("touchstart", (e) => {
                        mouse.active = true;
                        setMousePos(e);
                    }, { passive: true });
                    window.addEventListener("touchmove", (e) => {
                        setMousePos(e);
                    }, { passive: true });
                    window.addEventListener("touchend", () => {
                        mouse.active = false;
                    });
                    
                    // Click Blast / Wave Trigger
                    window.addEventListener("click", function(e) {
                        waves.push({
                            x: e.clientX,
                            y: e.clientY,
                            radius: 0,
                            maxRadius: isMobile ? 120 : 190,
                            speed: isMobile ? 6 : 9,
                            force: isMobile ? 12 : 22,
                            opacity: 1
                        });
                    });
                    
                    function drawLines() {
                        for (let i = 0; i < particles.length; i++) {
                            for (let j = i + 1; j < particles.length; j++) {
                                const dx = particles[i].x - particles[j].x;
                                const dy = particles[i].y - particles[j].y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                
                                if (dist < connectionDistance) {
                                    const alpha = (1 - dist / connectionDistance) * 0.28;
                                    ctx.strokeStyle = "rgba(14, 165, 233, " + alpha + ")";
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(particles[i].x, particles[i].y);
                                    ctx.lineTo(particles[j].x, particles[j].y);
                                    ctx.stroke();
                                }
                            }
                        }
                    }
                    
                    function animate() {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        
                        // Update & draw waves
                        for (let w = waves.length - 1; w >= 0; w--) {
                            const wave = waves[w];
                            wave.radius += wave.speed;
                            wave.opacity = 1 - (wave.radius / wave.maxRadius);
                            
                            if (wave.radius >= wave.maxRadius) {
                                waves.splice(w, 1);
                                continue;
                            }
                            
                            // Draw the Ripple Shockwave
                            ctx.beginPath();
                            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                            ctx.strokeStyle = "rgba(6, 182, 212, " + (wave.opacity * 0.45) + ")";
                            ctx.lineWidth = 2.5;
                            ctx.shadowBlur = 12;
                            ctx.shadowColor = "rgba(14, 165, 233, 0.4)";
                            ctx.stroke();
                            ctx.shadowBlur = 0; // reset
                            
                            // Calculate Push/Blast Force for all particles
                            for (let i = 0; i < particles.length; i++) {
                                const p = particles[i];
                                const dx = p.x - wave.x;
                                const dy = p.y - wave.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                
                                if (Math.abs(dist - wave.radius) < 25) {
                                    const angle = Math.atan2(dy, dx);
                                    const pushForce = wave.force * (1 - wave.radius / wave.maxRadius);
                                    p.vx += Math.cos(angle) * pushForce;
                                    p.vy += Math.sin(angle) * pushForce;
                                }
                            }
                        }
                        
                        // Update & draw particles
                        for (let i = 0; i < particles.length; i++) {
                            particles[i].update();
                            particles[i].draw();
                        }
                        
                        drawLines();
                        requestAnimationFrame(animate);
                    }
                    animate();
                });
            <\/script>
        `;
    const renderLayout = /* @__PURE__ */ __name222((title, content) => {
      const metaTags = `
                <meta name="title" content="${title} - Warung Pulsa">
                <meta name="description" content="Warung Pulsa melayani pembuatan Proxy & VPN Premium (SSH, VMess, VLESS, Trojan) dan Top Up Paket Data XL Otomatis 24 Jam dengan layanan terbaik.">
                <meta name="keywords" content="VPN Premium, Proxy, SSH, Trojan, VLESS, VMess, Tuban Store, Top Up XL, Tembak XL">
                <meta name="theme-color" content="#111827">
                <meta property="og:type" content="website">
                <meta property="og:url" content="/">
                <meta property="og:title" content="${title} | Warung Pulsa">
                <meta property="og:description" content="Layanan Proxy & VPN Premium serta Top Up Paket Data XL Otomatis 24 Jam. Nikmati koneksi internet cepat, aman, dan tanpa batas!">
                <meta property="og:image" content="${LOGO_URL}">
                <meta property="og:site_name" content="Warung Pulsa">
                <meta property="twitter:card" content="summary_large_image">
                <meta property="twitter:url" content="/">
                <meta property="twitter:title" content="${title} | Warung Pulsa">
                <meta property="twitter:description" content="Layanan Proxy & VPN Premium serta Top Up Paket Data XL Otomatis 24 Jam. Nikmati koneksi internet cepat, aman, dan tanpa batas!">
                <meta property="twitter:image" content="${LOGO_URL}">`;
      if (currentUser) {
        const unreadCount = currentUser.inbox_unread_count || 0;
        const badgeHtml = unreadCount > 0 ? `<span class="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto animate-pulse shadow-md shadow-sky-500/40">${unreadCount}</span>` : "";
        return `<!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <title>${title} - Warung Pulsa</title>
                    ${metaTags}
                    <link rel="icon" type="image/png" href="${LOGO_URL}">
                    <script src="https://cdn.tailwindcss.com"><\/script>
                    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"><\/script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
                    <style>
                        html { scroll-behavior: smooth; } 
                        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px;} 
                        .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px;} 
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; } 
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
                        
                        /* Fix SweetAlert2 Select Options visibility in Dark Theme */
                        .swal2-select {
                            background-color: #111827 !important;
                            color: #f3f4f6 !important;
                            border: 1px solid #4b5563 !important;
                        }
                        .swal2-select option {
                            background-color: #1f2937 !important;
                            color: #f3f4f6 !important;
                        }
                        
                        /* Pulse Hamburger Animation */
                        @keyframes pulseHamburger {
                            0%, 100% { color: #ffffff; }
                            50% { color: #374151; }
                        }
                        .pulse-hamburger {
                            animation: pulseHamburger 2s infinite ease-in-out;
                        }
                    </style>
                    <script>
                        // Globalisasi Konfigurasi SwalDark
                        const swalDark = Swal.mixin({ background: '#1f2937', color: '#f3f4f6', confirmButtonColor: '#0284c7', cancelButtonColor: '#475569', customClass: { popup: 'border border-gray-700 rounded-2xl shadow-2xl' } });
                        
                        // GLOBALISASI ESCAPE HTML AGAR BISA DIPAKAI DI SEMUA MENU (TIKET, ADMIN, DLL)
                        function escapeHtmlClient(str) {
                            if (!str) return '';
                            return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
                        }
                    <\/script>
                </head>
                <body class="bg-gray-900 text-white font-sans flex h-screen overflow-hidden relative">
                    ${tsParticlesConfig}
                    <div id="sidebarOverlay" class="fixed inset-0 bg-black/60 z-40 hidden md:hidden" onclick="toggleSidebar()"></div>
                    
                    <!-- Fullscreen Loading Overlay -->
                    <div id="loadingOverlay" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center hidden">
                        <div class="relative flex items-center justify-center mb-6">
                            <!-- Outer spinning ring -->
                            <div class="w-24 h-24 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin"></div>
                            <!-- Logo in the center -->
                            <img src="${LOGO_URL}" alt="Logo" class="w-14 h-14 rounded-full absolute object-cover shadow-lg shadow-sky-500/20">
                        </div>
                        <h3 class="text-xl font-black text-white tracking-wider uppercase mb-2 animate-pulse">proses create akun...wait...</h3>
                        <p class="text-sm text-gray-400 font-medium">Mohon tunggu, jangan tutup atau memuat ulang halaman ini...</p>
                    </div>
                    
                    <!-- FIX TUMPANG TINDIH NAVBAR PC: Menambahkan md:z-0 pada aside agar modal tertutup -->
                    <aside id="sidebar" class="fixed inset-y-0 left-0 bg-gray-950 border-r border-gray-800 w-64 transform -translate-x-full md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 md:z-0 flex flex-col shadow-2xl md:shadow-none">
                        <div class="p-6 border-b border-gray-800 flex justify-between items-center relative z-10">
                            <div class="flex items-center gap-3">
                                <img src="${LOGO_URL}" alt="Logo" class="w-8 h-8 rounded-full border border-gray-700 shadow-md">
                                <span class="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600">Warung Pulsa</span>
                            </div>
                            <button onclick="toggleSidebar()" class="md:hidden text-gray-400 hover:text-white p-1">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div class="p-6 border-b border-gray-800 bg-gray-900/30 relative z-10">
                            <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Saldo Aktif</p>
                            <p class="text-2xl font-bold text-green-400 font-mono tracking-tight drop-shadow-md">Rp ${currentUser.balance.toLocaleString("id-ID")}</p>
                        </div>
                        <nav class="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                            ${isSuperAdmin(currentUser, env) ? `
                            <div class="pb-4 mb-4 border-b border-gray-800">
                                <a href="/admin" class="flex items-center gap-3 p-3 rounded-xl bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-900/40 transition shadow-inner">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    <span class="font-bold text-sm tracking-wide">Admin Panel</span>
                                </a>
                            </div>` : ""}
                            <a href="/" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Dashboard" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg><span class="font-medium text-sm">Dashboard Utama</span></a>
                            <a href="/vpn-saya" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "VPN Saya" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg><span class="font-medium text-sm">VPN Saya</span></a>
                            <a href="/paket-data" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Paket Data XL" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg><span class="font-medium text-sm">Paket Data XL</span></a>
                            <a href="/lisensi" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Lisensi Script" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="font-medium text-sm">Lisensi Script</span></a>
                            <a href="/converter" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Converter Config" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg><span class="font-medium text-sm">Converter Config</span></a>
                            <a href="/cekpulsa-otp" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Cekpulsa / OTP" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg><span class="font-medium text-sm">Cekpulsa / OTP</span></a>
                            <a href="/inbox" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Inbox" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg><span class="font-medium text-sm">Kotak Masuk</span>${badgeHtml}</a>
                            <a href="/mutasi" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Riwayat Saldo" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span class="font-medium text-sm">Riwayat Saldo</span></a>
                            <a href="/tiket" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition ${title === "Pusat Bantuan" ? "bg-gray-800 text-white shadow-md border border-gray-700" : "text-gray-400"}"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg><span class="font-medium text-sm">Pusat Bantuan</span></a>
                        </nav>
                        <div class="p-4 border-t border-gray-800 bg-gray-900/50 relative z-10">
                            <a href="/profil" title="Buka Profil Saya" class="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-800 transition cursor-pointer group">
                                ${currentUser.picture ? `
                                    <img src="${currentUser.picture}" alt="${escapeHTML(currentUser.name)}" class="w-10 h-10 rounded-full object-cover shadow-lg shrink-0 border border-gray-750 transition" referrerpolicy="no-referrer">
                                ` : `
                                    <div class="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center font-bold text-white uppercase shadow-lg shrink-0 group-hover:bg-sky-500 transition">${currentUser.name.charAt(0)}</div>
                                `}
                                <div class="overflow-hidden flex-grow">
                                    <p class="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition">${escapeHTML(currentUser.name)}</p>
                                    <p class="text-[10px] text-gray-500 truncate">${currentUser.email}</p>
                                </div>
                                <svg class="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </a>
                        </div>
                    </aside>
                    <div class="flex-1 flex flex-col h-screen overflow-hidden bg-transparent">
                        <header class="md:hidden bg-gray-950 border-b border-gray-800 p-4 flex items-center justify-between z-30 shadow-md">
                            <div class="flex items-center gap-3">
                                <button onclick="toggleSidebar()" class="pulse-hamburger p-1"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
                                <img src="${LOGO_URL}" alt="Logo" class="w-7 h-7 rounded-full border border-gray-700">
                                <span class="text-lg font-bold text-white truncate">${title}</span>
                            </div>
                            ${unreadCount > 0 ? `<a href="/inbox" class="bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-sky-500/50 animate-pulse">${unreadCount} Baru</a>` : ""}
                        </header>
                        <main class="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                            ${content}
                            <footer class="border-t border-gray-800 mt-12 py-8 text-center text-gray-600 text-xs flex items-center justify-center gap-2">
                                <img src="${LOGO_URL}" alt="Logo" class="w-4 h-4 opacity-50 grayscale hover:grayscale-0 transition">
                                <span>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Warung Pulsa. Hak cipta dilindungi.</span>
                            </footer>
                        </main>
                    </div>

                    <!-- PANGGIL UI CHAT DARI AI.JS -->
                    ${renderAIChatUI(currentUser, appSettings)}

                    <script>
                        function toggleSidebar() { document.getElementById('sidebar').classList.toggle('-translate-x-full'); document.getElementById('sidebarOverlay').classList.toggle('hidden'); }
                        async function logout() { await fetch('/api/logout', { method: 'POST' }); window.location.href = '/'; }
                    <\/script>
                </body>
                </html>`;
      } else {
        return `<!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                    <title>${title} - Warung Pulsa</title>
                    ${metaTags}
                    <link rel="icon" type="image/png" href="${LOGO_URL}">
                    <script src="https://cdn.tailwindcss.com"><\/script>
                    <script src="https://accounts.google.com/gsi/client" async defer><\/script>
                    <style>
                        .glass-panel { background: rgba(31, 41, 55, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(75, 85, 99, 0.4); } 
                        html { scroll-behavior: smooth; }
                        
                        /* Pulse Hamburger Animation */
                        @keyframes pulseHamburger {
                            0%, 100% { color: #ffffff; }
                            50% { color: #374151; }
                        }
                        .pulse-hamburger {
                            animation: pulseHamburger 2s infinite ease-in-out;
                        }
                    </style>
                </head>
                <body class="bg-gray-900 text-white font-sans min-h-screen flex flex-col relative">
                    ${tsParticlesConfig}
                    <nav class="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
                        <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                            <a href="/" class="flex items-center gap-3 group">
                                <img src="${LOGO_URL}" alt="Logo" class="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-700 shadow-md group-hover:border-sky-500 transition duration-300">
                                <span class="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600">Warung Pulsa</span>
                            </a>
                            <div class="hidden md:flex gap-7 items-center text-sm font-medium">
                                <a href="/" class="text-gray-300 hover:text-white transition">Beranda</a>
                                <a href="/produk" class="text-gray-300 hover:text-white transition">Produk & Harga</a>
                                <a href="/paket-data" class="text-gray-300 hover:text-white transition">Paket Data XL</a>
                                <a href="/cekpulsa-otp" class="text-gray-300 hover:text-white transition">Cekpulsa / OTP</a>
                                <a href="/converter" class="text-gray-300 hover:text-white transition">Converter</a>
                                <a href="/syarat-ketentuan" class="text-gray-300 hover:text-white transition">Syarat & Ketentuan</a>
                                <a href="/login" class="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold py-2 px-5 rounded-xl text-xs transition shadow-lg shadow-sky-600/30 flex items-center gap-2 border border-sky-400/30 active:scale-95">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                    Masuk
                                </a>
                            </div>
                            <button onclick="document.getElementById('mobileNav').classList.toggle('hidden')" class="md:hidden pulse-hamburger p-1"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
                        </div>
                        <div id="mobileNav" class="hidden md:hidden bg-gray-950 border-t border-gray-800 absolute w-full left-0 top-[73px] shadow-2xl">
                            <div class="flex flex-col p-4 space-y-4">
                                <a href="/" class="text-gray-300 hover:text-white font-medium text-lg border-b border-gray-800 pb-3 flex items-center gap-3">Beranda</a>
                                <a href="/produk" class="text-gray-300 hover:text-white font-medium text-lg border-b border-gray-800 pb-3 flex items-center gap-3">Produk & Harga</a>
                                <a href="/paket-data" class="text-gray-300 hover:text-white font-medium text-lg border-b border-gray-800 pb-3 flex items-center gap-3">Paket Data XL</a>
                                <a href="/cekpulsa-otp" class="text-gray-300 hover:text-white font-medium text-lg border-b border-gray-800 pb-3 flex items-center gap-3">Cekpulsa / OTP</a>
                                <a href="/converter" class="text-gray-300 hover:text-white font-medium text-lg border-b border-gray-800 pb-3 flex items-center gap-3">Converter</a>
                                <a href="/syarat-ketentuan" class="text-gray-300 hover:text-white font-medium text-lg border-b border-gray-800 pb-3 flex items-center gap-3">Syarat & Ketentuan</a>
                                <a href="/login" class="bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold py-3 px-4 rounded-xl text-center text-sm flex items-center justify-center gap-2 shadow-lg mt-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                                    Masuk Akun
                                </a>
                            </div>
                        </div>
                    </nav>
                    <main class="flex-grow relative z-10">${content}</main>
                    <footer class="bg-gray-950 border-t border-gray-800 pt-12 pb-8 mt-16 relative z-10">
                        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div>
                                <div class="flex items-center gap-3 mb-4">
                                    <img src="${LOGO_URL}" alt="Logo" class="w-8 h-8 rounded-full border border-gray-800">
                                    <h3 class="text-xl font-bold text-sky-400">Warung Pulsa</h3>
                                </div>
                                <p class="text-gray-400 leading-relaxed text-sm">Solusi utama untuk privasi dan kebebasan internet Anda. Kami menyediakan layanan Proxy & VPN Premium berbasis Server Khusus dengan koneksi kecepatan tinggi, stabil, dan aman.</p>
                            </div>
                            <div>
                                <h4 class="font-bold text-white mb-4 uppercase tracking-wider text-sm">Tautan Cepat</h4>
                                <ul class="space-y-2 text-sm text-gray-400">
                                    <li><a href="/" class="hover:text-cyan-400 transition">Beranda / Dashboard</a></li>
                                    <li><a href="/produk" class="hover:text-cyan-400 transition">Produk & Harga</a></li>
                                    <li><a href="/paket-data" class="hover:text-cyan-400 transition">Isi Ulang Paket Data</a></li>
                                    <li><a href="/syarat-ketentuan" class="hover:text-cyan-400 transition">Syarat & Ketentuan</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="font-bold text-white mb-4 uppercase tracking-wider text-sm">Layanan Pelanggan (CS)</h4>
                                <p class="text-sm text-gray-400 mb-3">Jika mengalami kendala teknis atau transaksi, silakan hubungi CS kami (Arif):</p>
                                <ul class="space-y-3 text-sm text-gray-300">
                                    <li><a href="https://wa.me/6282175037525" target="_blank" class="flex items-center gap-3 hover:text-green-400 transition group"><div class="bg-gray-800 p-2 rounded-full group-hover:bg-green-500/20"><svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div><span>WhatsApp: 0821 7503 7525</span></a>
                                    </li>
                                    <li><a href="https://t.me/srpcomadmin" target="_blank" class="flex items-center gap-3 hover:text-cyan-400 transition group"><div class="bg-gray-800 p-2 rounded-full group-hover:bg-sky-500/20"><svg class="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></div><span>Telegram: @srpcomadmin</span></a></li>
                                    <li><a href="mailto:admin@warungpulsa.com" class="flex items-center gap-3 hover:text-pink-400 transition group"><div class="bg-gray-800 p-2 rounded-full group-hover:bg-pink-500/20"><svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div><span>Email: admin@warungpulsa.com</span></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="text-center text-gray-600 mt-10 pt-6 border-t border-gray-900 text-xs">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Warung Pulsa. Hak cipta dilindungi.</div>
                    </footer>
                </body>
                </html>`;
      }
    }, "renderLayout");
    const renderIframePage = /* @__PURE__ */ __name222((title, frameUrl) => {
      const content = `
            <div class="w-full px-2 py-2 flex flex-col h-[90vh] min-h-[650px] relative z-10">
                <div class="flex-grow bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative group">
                    <div class="absolute inset-0 flex items-center justify-center z-0">
                        <div class="flex flex-col items-center gap-3">
                            <svg class="w-8 h-8 text-gray-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            <p class="text-gray-500 font-medium">Memuat halaman ${title}...</p>
                        </div>
                    </div>
                    <iframe src="${frameUrl}" class="w-full h-full border-0 relative z-10 bg-transparent rounded-3xl" title="${title}"></iframe>
                </div>
            </div>`;
      return renderLayout(title, content);
    }, "renderIframePage");
    if (path === "/tiket" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      const ticketPage = parseInt(url.searchParams.get("page") || "1");
      const ticketLimit = 10;
      const ticketOffset = (ticketPage - 1) * ticketLimit;
      const totalTickets = await env.DB.prepare(
        "SELECT COUNT(*) as count FROM tickets WHERE email = ?"
      ).bind(currentUser.email).first("count") || 0;
      const totalPages = Math.ceil(totalTickets / ticketLimit) || 1;
      const { results: tickets } = await env.DB.prepare(
        "SELECT * FROM tickets WHERE email = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?"
      ).bind(currentUser.email, ticketLimit, ticketOffset).all();
      let ticketListHtml = "";
      if (!tickets || tickets.length === 0) {
        ticketListHtml = `<div class="text-center py-16 bg-gray-800 rounded-3xl border border-gray-700"><p class="text-gray-400 text-lg">Belum ada riwayat tiket bantuan.</p></div>`;
      } else {
        ticketListHtml = `
                <div class="space-y-4">
                    ${tickets.map((t) => {
          let statusBadge = "";
          if (t.status === "OPEN") statusBadge = '<span class="bg-sky-500/20 text-cyan-400 border border-sky-500/30 text-[10px] px-2.5 py-1 rounded uppercase font-bold tracking-wider">Menunggu Admin</span>';
          else if (t.status === "PENDING") statusBadge = '<span class="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] px-2.5 py-1 rounded uppercase font-bold tracking-wider">Menunggu Balasan Anda</span>';
          else statusBadge = '<span class="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-[10px] px-2.5 py-1 rounded uppercase font-bold tracking-wider">Selesai (Closed)</span>';
          return `
                        <div onclick="openTicketView('${t.id}')" class="bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-700 shadow-xl hover:border-sky-600/50 hover:bg-gray-800/80 transition cursor-pointer">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                                <h3 class="text-lg font-bold text-white leading-snug truncate">${escapeHTML(t.subject)}</h3>
                                <div class="shrink-0 flex items-center gap-3">
                                    <span class="text-xs font-mono text-gray-500">${t.id}</span>
                                    ${statusBadge}
                                </div>
                            </div>
                            <div class="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <span>${t.category}</span> &bull; <span>Update: ${t.updated_at}</span>
                            </div>
                        </div>`;
        }).join("")}
                </div>
                
                <!-- Pagination Controls -->
                ${totalPages > 1 ? `
                <div class="mt-8 flex items-center justify-between gap-4 flex-wrap bg-gray-800 p-4 border border-gray-700 rounded-2xl relative z-10">
                    <a href="${ticketPage > 1 ? `/tiket?page=${ticketPage - 1}` : "#"}" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${ticketPage <= 1 ? "opacity-50 pointer-events-none" : ""}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Sebelum
                    </a>
                    <span class="text-xs text-gray-400 font-medium">Halaman ${ticketPage} dari ${totalPages} (Total ${totalTickets} Tiket)</span>
                    <a href="${ticketPage < totalPages ? `/tiket?page=${ticketPage + 1}` : "#"}" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${ticketPage >= totalPages ? "opacity-50 pointer-events-none" : ""}">
                        Berikut <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
                ` : ""}`;
      }
      const content = `
            <div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-800 pb-5 gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white tracking-tight flex items-center gap-3">Pusat Bantuan (Tiket)</h1>
                        <p class="text-gray-400 text-sm mt-2">Laporkan kendala teknis atau masalah layanan Anda di sini.</p>
                    </div>
                    <button onclick="openCreateTicketModal()" class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition flex items-center gap-2">
                        \u2795 Buat Tiket Baru
                    </button>
                </div>
                
                ${ticketListHtml}

                <!-- Modal Buat Tiket -->
                <div id="createTicketModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div class="bg-gray-900 p-6 md:p-8 rounded-3xl w-full max-w-lg border border-sky-600/30 shadow-2xl">
                        <div class="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                            <h3 class="text-2xl font-bold text-white tracking-tight">Kirim Tiket Baru</h3>
                            <button onclick="closeCreateTicketModal()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <form id="createTicketForm" class="space-y-5">
                            <div>
                                <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Kategori Kendala</label>
                                <select id="ticketCategory" required class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-sky-500 outline-none">
                                    <option value="Kendala Server VPN">Kendala Server VPN (Mati/Lemot)</option>
                                    <option value="Kendala Top Up Saldo">Kendala Top Up Saldo (QRIS)</option>
                                    <option value="Kendala Paket Data XL">Kendala Paket Data XL / Axis</option>
                                    <option value="Pertanyaan Lainnya">Pertanyaan Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Judul Masalah</label>
                                <input type="text" id="ticketSubject" required placeholder="Singkat, padat, dan jelas..." class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-sky-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Detail Kendala</label>
                                <textarea id="ticketMessage" required rows="4" placeholder="Jelaskan secara rinci (sertakan nomor XL, ID transaksi, atau Username VPN jika ada)..." class="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-sky-500 outline-none custom-scrollbar resize-none"></textarea>
                            </div>
                            <button type="submit" id="btnSubmitTicket" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg transition text-lg mt-4">Kirim Tiket Sekarang</button>
                        </form>
                    </div>
                </div>

                <!-- Modal Lihat & Chat Tiket -->
                <div id="ticketViewModal" class="fixed inset-0 bg-black/90 hidden z-50 flex items-center justify-center p-4 backdrop-blur-md">
                    <div class="bg-gray-900 rounded-3xl w-full max-w-3xl max-h-[95vh] flex flex-col border border-gray-700 shadow-2xl">
                        <div class="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-950 rounded-t-3xl">
                            <div>
                                <h3 class="text-xl font-bold text-white flex items-center gap-2" id="tvTitle">Judul</h3>
                                <p class="text-xs text-gray-400 mt-1 font-mono" id="tvSubtitle">#ID - Kategori</p>
                            </div>
                            <button onclick="closeTicketView()" class="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-xl transition">&times;</button>
                        </div>
                        
                        <div id="ticketChatContainer" class="flex-grow p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-[#0b1120] bg-opacity-50">
                            <!-- Chat Bubbles -->
                        </div>
                        
                        <div class="p-4 border-t border-gray-800 bg-gray-950 rounded-b-3xl">
                            <div id="ticketReplyArea" class="flex gap-3">
                                <input type="hidden" id="replyTicketId" value="">
                                <textarea id="replyTicketMessage" rows="2" placeholder="Ketik balasan Anda di sini..." class="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none custom-scrollbar text-sm resize-none"></textarea>
                                <div class="flex flex-col gap-2 shrink-0">
                                    <button onclick="sendTicketReply()" id="btnSendReply" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow flex-grow">Kirim</button>
                                    <button onclick="closeTicket()" id="btnCloseTicket" class="bg-gray-700 hover:bg-sky-600 text-gray-300 hover:text-white text-xs font-bold px-5 py-2 rounded-xl transition border border-gray-600 hover:border-sky-500">Tandai Selesai</button>
                                </div>
                            </div>
                            <div id="ticketClosedArea" class="hidden text-center p-3">
                                <p class="text-sm text-gray-500 font-bold">\u{1F512} Tiket ini telah ditutup karena masalah sudah diselesaikan.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tombol Hubungi Admin via Telegram -->
                <div class="mt-12 flex justify-center">
                    <a href="https://t.me/srpcomadmin" target="_blank" class="inline-flex items-center gap-2.5 bg-[#229ED9] hover:bg-[#208ebe] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#229ED9]/20 transition-all duration-300 transform hover:-translate-y-0.5">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                        </svg>
                        Hubungi Admin
                    </a>
                </div>

            </div>
            
            <script>
                function openCreateTicketModal() { document.getElementById('createTicketModal').classList.remove('hidden'); }
                function closeCreateTicketModal() { document.getElementById('createTicketModal').classList.add('hidden'); }
                function closeTicketView() { document.getElementById('ticketViewModal').classList.add('hidden'); window.location.reload(); }

                document.getElementById('createTicketForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const btn = document.getElementById('btnSubmitTicket');
                    btn.disabled = true; btn.innerText = 'Mengirim...';

                    const payload = {
                        category: document.getElementById('ticketCategory').value,
                        subject: document.getElementById('ticketSubject').value.trim(),
                        message: document.getElementById('ticketMessage').value.trim()
                    };

                    try {
                        const res = await fetch('/api/ticket/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                        const data = await res.json();
                        if (data.success) {
                            await swalDark.fire('Berhasil', 'Tiket keluhan berhasil dikirim. Admin akan segera merespons.', 'success');
                            window.location.reload();
                        } else { swalDark.fire('Gagal', data.message, 'error'); }
                    } catch(e) { swalDark.fire('Error', 'Kesalahan koneksi internet', 'error'); }
                    btn.disabled = false; btn.innerText = 'Kirim Tiket Sekarang';
                });

                async function openTicketView(id) {
                    document.getElementById('ticketViewModal').classList.remove('hidden');
                    const chatContainer = document.getElementById('ticketChatContainer');
                    chatContainer.innerHTML = '<p class="text-center text-cyan-400 mt-10 animate-pulse">Memuat riwayat chat...</p>';
                    document.getElementById('replyTicketId').value = id;
                    document.getElementById('replyTicketMessage').value = '';

                    try {
                        const res = await fetch('/api/ticket/view', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: id }) });
                        const data = await res.json();

                        if (data.success) {
                            const t = data.ticket;
                            document.getElementById('tvTitle').innerText = t.subject;
                            document.getElementById('tvSubtitle').innerText = t.id + ' | ' + t.category;

                            if (t.status === 'CLOSED') {
                                document.getElementById('ticketReplyArea').classList.add('hidden');
                                document.getElementById('ticketClosedArea').classList.remove('hidden');
                            } else {
                                document.getElementById('ticketReplyArea').classList.remove('hidden');
                                document.getElementById('ticketClosedArea').classList.add('hidden');
                            }

                            if (data.replies.length === 0) {
                                chatContainer.innerHTML = '<p class="text-center text-gray-500 mt-10">Belum ada percakapan.</p>';
                            } else {
                                chatContainer.innerHTML = data.replies.map(r => {
                                    const isUser = r.sender_type === 'user';
                                    const bubbleClass = isUser 
                                        ? 'bg-sky-600 text-white rounded-l-2xl rounded-tr-2xl ml-auto shadow-md' 
                                        : 'bg-gray-800 text-gray-200 rounded-r-2xl rounded-tl-2xl mr-auto border border-gray-700';
                                    
                                    const senderLabel = isUser ? '' : '<span class="text-[10px] font-bold text-teal-400 mb-1 block uppercase">Admin Support</span>';

                                    // FIX SPASI CHAT (Hapus Enter pada Template Literal)
                                    return '<div class="max-w-[85%] md:max-w-[75%] ' + (isUser ? 'ml-auto' : 'mr-auto') + '">' + senderLabel + '<div class="px-4 py-2.5 text-sm whitespace-pre-wrap break-words leading-normal ' + bubbleClass + '">' + escapeHtmlClient(r.message) + '</div><span class="text-[10px] text-gray-500 block mt-1 ' + (isUser ? 'text-right font-mono' : 'text-left font-mono') + '">' + r.created_at + '</span></div>';
                                }).join('');
                                
                                setTimeout(() => { chatContainer.scrollTop = chatContainer.scrollHeight; }, 100);
                            }
                        } else {
                            chatContainer.innerHTML = '<p class="text-center text-sky-400 mt-10">Gagal memuat tiket.</p>';
                        }
                    } catch(e) { chatContainer.innerHTML = '<p class="text-center text-sky-400 mt-10">Error koneksi.</p>'; }
                }

                async function sendTicketReply() {
                    const ticketId = document.getElementById('replyTicketId').value;
                    const message = document.getElementById('replyTicketMessage').value.trim();
                    if (!message) return;

                    const btn = document.getElementById('btnSendReply');
                    btn.disabled = true; btn.innerText = 'Kirim...';

                    try {
                        const res = await fetch('/api/ticket/reply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId, message }) });
                        if ((await res.json()).success) {
                            openTicketView(ticketId); // reload chat
                        }
                    } catch(e) { swalDark.fire('Error', 'Gagal membalas tiket.', 'error'); }
                    btn.disabled = false; btn.innerText = 'Kirim';
                }

                async function closeTicket() {
                    const ticketId = document.getElementById('replyTicketId').value;
                    const conf = await swalDark.fire({ title: 'Tandai Selesai?', text: 'Jika masalah Anda sudah teratasi, Anda dapat menutup tiket ini.', icon: 'info', showCancelButton: true });
                    if (!conf.isConfirmed) return;

                    const btn = document.getElementById('btnCloseTicket');
                    btn.disabled = true;

                    try {
                        const res = await fetch('/api/ticket/close', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId }) });
                        if ((await res.json()).success) {
                            openTicketView(ticketId);
                        }
                    } catch(e) { swalDark.fire('Error', 'Gagal menutup', 'error'); }
                    btn.disabled = false;
                }
            <\/script>
            `;
      return new Response(renderLayout("Pusat Bantuan", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/vpn-saya" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      const vpnPage = parseInt(url.searchParams.get("page") || "1");
      const vpnLimit = 10;
      const vpnOffset = (vpnPage - 1) * vpnLimit;
      const totalVpns = await env.DB.prepare(
        "SELECT COUNT(*) as count FROM vpns WHERE email = ?"
      ).bind(currentUser.email).first("count") || 0;
      const totalPages = Math.ceil(totalVpns / vpnLimit) || 1;
      const { results: vpns } = await env.DB.prepare(
        "SELECT * FROM vpns WHERE email = ? ORDER BY id DESC LIMIT ? OFFSET ?"
      ).bind(currentUser.email, vpnLimit, vpnOffset).all();
      let vpnHtml = "";
      if (vpns && vpns.length > 0) {
        vpnHtml = `
                <div class="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900 shadow-xl">
                    <table class="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                        <thead class="bg-gray-950 text-gray-400 border-b border-gray-700">
                            <tr>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Username VPN</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Protokol & Server</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs">Expired</th>
                                <th class="p-4 font-bold uppercase tracking-wider text-xs text-center">Aksi & Eksekusi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-800">
                            ${vpns.map((v) => `
                                <tr class="hover:bg-gray-800/50 transition">
                                    <td class="p-4 font-bold text-cyan-400 font-mono text-base">${v.username}</td>
                                    <td class="p-4 text-xs">
                                        <span class="block text-gray-200 font-bold mb-0.5">${v.protocol}</span>
                                        <span class="text-gray-500">${v.server}</span>
                                    </td>
                                    <td class="p-4 text-xs font-mono font-bold ${v.exp.includes("1 Jam") ? "text-cyan-400" : "text-yellow-400"}">${v.exp}</td>
                                    <td class="p-4 flex gap-2 justify-center">
                                        <button onclick="detailVpn('${v.id}')" class="bg-gray-700 hover:bg-gray-600 text-white text-[11px] px-3 py-2 rounded-lg uppercase font-bold transition shadow-md flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Detail</button>
                                        ${v.exp.includes("1 Jam") ? `<span class="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[11px] px-3 py-2 rounded-lg uppercase font-bold text-center inline-block cursor-not-allowed">Trial Tidak Bisa Diperpanjang</span>` : `<button onclick="renewVpn('${v.id}', '${v.username}')" class="bg-sky-600 hover:bg-sky-500 text-white text-[11px] px-3 py-2 rounded-lg uppercase font-bold transition shadow-md flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Perpanjang</button>`}
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                    
                    <!-- Pagination controls -->
                    ${totalPages > 1 ? `
                    <div class="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between gap-4 flex-wrap">
                        <a href="${vpnPage > 1 ? `/vpn-saya?page=${vpnPage - 1}` : "#"}" class="bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${vpnPage <= 1 ? "opacity-50 pointer-events-none" : ""}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Sebelum
                        </a>
                        <span class="text-xs text-gray-400 font-medium">Halaman ${vpnPage} dari ${totalPages} (Total ${totalVpns} VPN)</span>
                        <a href="${vpnPage < totalPages ? `/vpn-saya?page=${vpnPage + 1}` : "#"}" class="bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${vpnPage >= totalPages ? "opacity-50 pointer-events-none" : ""}">
                            Berikut <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </div>
                    ` : ""}
                </div>`;
      } else {
        vpnHtml = `
                <div class="text-center py-16 bg-gray-800 rounded-3xl border border-gray-700 flex flex-col items-center justify-center shadow-inner relative z-10">
                    <div class="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-5 border border-gray-700">
                        <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                    </div>
                    <p class="text-gray-400 text-lg font-medium mb-1">Anda belum memiliki VPN aktif.</p>
                    <p class="text-gray-500 text-sm mb-6">Server VPN yang Anda buat akan muncul di sini.</p>
                    <a href="/" class="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-xl transition font-bold shadow-lg shadow-sky-600/30">Buat VPN Sekarang</a>
                </div>`;
      }
      const content = `
            <div class="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-gray-800 pb-5 gap-4">
                    <div>
                        <h1 class="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            <svg class="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                            VPN Aktif Saya
                        </h1>
                        <p class="text-gray-400 text-sm mt-2">Kelola, lihat detail, dan perpanjang masa aktif server VPN Anda di sini.</p>
                    </div>
                    <div class="bg-gray-800 px-4 py-2.5 rounded-xl border border-gray-700 flex items-center gap-3 shadow-inner">
                        <span class="text-xs text-gray-400 font-bold uppercase">Total Akun</span>
                        <span class="bg-sky-500/20 text-cyan-400 px-2.5 py-0.5 rounded font-mono font-bold border border-sky-600/30">${totalVpns}</span>
                    </div>
                </div>
                ${vpnHtml}
            </div>

            <script>
                const PRICE_PER_DAY = ${appSettings.price_per_day};

                async function detailVpn(vpnId) {
                    swalDark.fire({ title: 'Menghubungkan ke Server...', text: 'Mengambil data detail VPN secara real-time.', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                    try {
                        const res = await fetch('/api/check-detail', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vpnId }) });
                        const data = await res.json();
                        if (data.success) {
                            swalDark.fire({
                                title: 'Detail Config VPN',
                                html: \`<div class="bg-gray-950 p-4 rounded-xl mt-2 overflow-x-auto text-left border border-gray-800 shadow-inner"><pre class="text-green-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">\${data.detail}</pre></div>\`,
                                width: '600px',
                                confirmButtonText: 'Tutup',
                                confirmButtonColor: '#374151'
                            });
                        } else {
                            swalDark.fire('Gagal', data.message || 'Tidak dapat mengambil detail dari VPS.', 'error');
                        }
                    } catch(e) {
                        swalDark.fire('Error', 'Kesalahan jaringan. Gagal menghubungi API.', 'error');
                    }
                }

                async function renewVpn(vpnId, username) {
                    const { value: days, isDismissed } = await swalDark.fire({
                        title: 'Perpanjang VPN',
                        html: \`
                            <div class="text-left bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4">
                                <p class="text-xs text-gray-400 font-bold uppercase mb-1">Username Akun</p>
                                <p class="text-cyan-400 font-mono font-bold text-lg">\${username}</p>
                            </div>
                            <p class="text-sm text-gray-300 mb-4">Silakan pilih durasi perpanjangan. Saldo Web Anda akan otomatis terpotong sebesar <b>Rp \${PRICE_PER_DAY}/Hari</b>.</p>
                        \`,
                        input: 'select',
                        inputOptions: {
                            '10': '10 Hari - Rp ' + (10 * PRICE_PER_DAY).toLocaleString('id-ID'),
                            '20': '20 Hari - Rp ' + (20 * PRICE_PER_DAY).toLocaleString('id-ID'),
                            '30': '30 Hari - Rp ' + (30 * PRICE_PER_DAY).toLocaleString('id-ID') + ' (Rekomendasi)',
                            '60': '60 Hari - Rp ' + (60 * PRICE_PER_DAY).toLocaleString('id-ID'),
                            '90': '90 Hari - Rp ' + (90 * PRICE_PER_DAY).toLocaleString('id-ID')
                        },
                        inputPlaceholder: '-- Pilih Durasi --',
                        showCancelButton: true,
                        confirmButtonText: '<svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Konfirmasi',
                        cancelButtonText: 'Batal',
                        inputValidator: (value) => {
                            if (!value) return 'Anda harus memilih durasi!';
                        }
                    });

                    if (isDismissed || !days) return;

                    const price = parseInt(days) * PRICE_PER_DAY;
                    const confirm = await swalDark.fire({
                        title: 'Konfirmasi Pembayaran',
                        text: \`Sistem akan memotong Saldo Web Anda sebesar Rp \${price.toLocaleString('id-ID')} untuk memperpanjang VPN ini. Lanjutkan?\`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Ya, Bayar & Perpanjang'
                    });

                    if (!confirm.isConfirmed) return;

                    swalDark.fire({ title: 'Memproses ke VPS...', text: 'Mohon tunggu, sedang menembak API ke server.', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                    try {
                        const res = await fetch('/api/renew', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ vpnId, duration: days })
                        });
                        const data = await res.json();

                        if (data.success) {
                            await swalDark.fire('Berhasil!', \`Masa aktif VPN <b>\${username}</b> telah sukses ditambah \${days} Hari.\`, 'success');
                            window.location.reload();
                        } else {
                            swalDark.fire('Gagal', data.message || 'Transaksi gagal', 'error');
                        }
                    } catch(e) {
                        swalDark.fire('Error', 'Kesalahan koneksi ke server VPS', 'error');
                    }
                }
            <\/script>
            `;
      return new Response(renderLayout("VPN Saya", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if ((path === "/login" || path === "/masuk") && method === "GET") {
      if (currentUser) {
        return Response.redirect("https://" + url.host + "/", 302);
      }
      const loginPageHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Masuk - Warung Pulsa</title>
    <link rel="icon" type="image/png" href="${LOGO_URL}">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script src="https://accounts.google.com/gsi/client" async defer><\/script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        @keyframes floatLogo {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes glowPulse {
            0%, 100% { opacity: 0.5; transform: scale(0.98); }
            50% { opacity: 0.85; transform: scale(1.05); }
        }
        .float-logo { animation: floatLogo 6s ease-in-out infinite; }
        .glow-pulse { animation: glowPulse 4s ease-in-out infinite; }
    </style>
</head>
<body class="bg-[#0b1120] text-gray-100 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none glow-pulse"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute top-10 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md my-auto">
        <div class="mb-6 text-center">
            <a href="/" class="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-cyan-300 transition py-2 px-5 rounded-full bg-gray-900/80 border border-gray-800 hover:border-sky-500/40 backdrop-blur-md shadow-lg shadow-black/40">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Kembali ke Beranda
            </a>
        </div>

        <div class="bg-gradient-to-b from-gray-900/95 via-gray-900/85 to-gray-950/95 border border-sky-500/30 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-11 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(14,165,233,0.22)] text-center relative overflow-hidden">
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

            <div class="relative mx-auto mb-7 w-32 h-32 md:w-36 md:h-36 flex items-center justify-center float-logo">
                <div class="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 rounded-3xl blur-2xl opacity-70 glow-pulse"></div>
                <div class="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl p-2 bg-gray-950/95 border-2 border-sky-400/60 shadow-[0_10px_35px_rgba(14,165,233,0.4)] flex items-center justify-center overflow-hidden">
                    <img src="${LOGO_URL}" alt="Logo Warung Pulsa" class="w-full h-full object-cover rounded-2xl">
                </div>
            </div>

            <h1 class="text-2xl md:text-3xl font-black text-white tracking-tight">
                Warung <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">Pulsa</span>
            </h1>
            <p class="text-xs font-bold tracking-widest text-sky-400 uppercase mt-1 mb-3">Portal Member & Layanan Digital</p>
            <p class="text-xs md:text-sm text-gray-400 leading-relaxed mb-8">Silakan masuk menggunakan akun Google Anda untuk mengakses dashboard, deposit saldo otomatis, dan membuat VPN instan.</p>

            <div class="p-4 rounded-2xl bg-gray-950/70 border border-gray-800/90 mb-7 flex flex-col items-center justify-center shadow-inner">
                <div id="g_id_onload" data-client_id="${GOOGLE_CLIENT_ID}" data-callback="handleCredentialResponse" data-auto_prompt="false"></div>
                <div class="g_id_signin flex justify-center w-full shadow-xl" data-type="standard" data-size="large" data-theme="filled_black" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="left"></div>
            </div>

            <div class="grid grid-cols-2 gap-2.5 pt-5 border-t border-gray-800/80 text-[11px] text-gray-400">
                <div class="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gray-950/50 border border-gray-800/80">
                    <svg class="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <span class="font-medium">OAuth Resmi Google</span>
                </div>
                <div class="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-gray-950/50 border border-gray-800/80">
                    <svg class="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    <span class="font-medium">Sistem 100% Otomatis</span>
                </div>
            </div>
        </div>

        <p class="text-center text-xs text-gray-500 mt-6">&copy; ${new Date().getFullYear()} Warung Pulsa. Hak cipta dilindungi.</p>
    </div>

    <script>
        async function handleCredentialResponse(response) {
            const btn = document.querySelector('.g_id_signin');
            if (btn) btn.style.opacity = '0.5';
            try {
                const res = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential: response.credential })
                });
                if (res.ok) {
                    window.location.href = '/';
                } else {
                    alert('Gagal login dengan Google.');
                    if (btn) btn.style.opacity = '1';
                }
            } catch(e) {
                alert('Terjadi kesalahan saat memproses login.');
                if (btn) btn.style.opacity = '1';
            }
        }
    <\/script>
</body>
</html>`;
      return new Response(loginPageHtml, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/" && method === "GET") {
      if (!currentUser) {
        const content = `
                <div class="relative overflow-hidden bg-transparent pt-12 md:pt-16 pb-28 md:pb-36">
                    <div class="absolute inset-0 z-0 pointer-events-none">
                        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]"></div>
                        <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                    <div class="relative max-w-6xl mx-auto px-4 text-center z-10">
                        <span class="inline-block py-1.5 px-4 rounded-full bg-sky-950/60 text-cyan-300 text-xs md:text-sm font-bold mb-6 border border-sky-500/30 shadow-lg shadow-sky-500/10 backdrop-blur-md">Mulai Rp ${appSettings.price_per_day}/Hari &bull; Layanan VPN & PPOB Otomatis</span>
                        <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-5 drop-shadow-xl">Akses Internet <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">Tanpa Batas</span></h1>
                        <p class="mt-2 max-w-2xl text-base md:text-lg text-gray-400 mx-auto mb-10 leading-relaxed">Amankan koneksi Anda, buka blokir geografis, dan nikmati kecepatan tinggi dengan multi-protokol server dari Warung Pulsa.</p>

                        <!-- Box Login Elegan dengan Logo Menonjol -->
                        <div class="relative inline-block w-full max-w-md mx-auto z-20 text-center">
                            <div class="bg-gradient-to-b from-gray-900/95 via-gray-900/85 to-gray-950/95 border border-sky-500/30 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(14,165,233,0.22)] relative overflow-hidden">
                                <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

                                <!-- Logo Warung Pulsa Lebih Besar & Elegan -->
                                <div class="relative mx-auto mb-6 w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                                    <div class="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 rounded-3xl blur-xl opacity-65 animate-pulse"></div>
                                    <div class="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl p-1.5 bg-gray-950 border-2 border-sky-400/60 shadow-2xl flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
                                        <img src="${LOGO_URL}" alt="Logo Warung Pulsa" class="w-full h-full object-cover rounded-2xl">
                                    </div>
                                </div>

                                <h3 class="text-2xl font-black text-white tracking-tight mb-1">
                                    Masuk ke <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">Warung Pulsa</span>
                                </h3>
                                <p class="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Portal Member & Transaksi</p>
                                <p class="text-xs md:text-sm text-gray-400 mb-6 leading-relaxed">Login satu klik menggunakan akun Google Anda untuk mengisi saldo, membuat akun VPN, dan mengelola layanan.</p>

                                <div class="p-3.5 rounded-2xl bg-gray-950/70 border border-gray-800 flex flex-col items-center justify-center mb-6 shadow-inner">
                                    <div id="g_id_onload" data-client_id="${GOOGLE_CLIENT_ID}" data-callback="handleCredentialResponse" data-auto_prompt="false"></div>
                                    <div class="g_id_signin flex justify-center w-full shadow-lg" data-type="standard" data-size="large" data-theme="filled_black" data-text="sign_in_with" data-shape="rectangular" data-logo_alignment="left"></div>
                                </div>

                                <div class="grid grid-cols-2 gap-2 pt-4 border-t border-gray-800/80 text-[11px] text-gray-400">
                                    <div class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-gray-950/40 border border-gray-800/80">
                                        <svg class="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        <span class="font-medium">OAuth Resmi Google</span>
                                    </div>
                                    <div class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-gray-950/40 border border-gray-800/80">
                                        <svg class="w-3.5 h-3.5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span class="font-medium">Aktif Otomatis 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="py-16 md:py-24 bg-gray-800/80 border-y border-gray-800 relative z-10 backdrop-blur-sm">
                    <div class="max-w-6xl mx-auto px-4">
                        <div class="text-center mb-16">
                            <h2 class="text-3xl md:text-4xl font-bold text-white">Mengapa Memilih Warung Pulsa?</h2>
                            <div class="w-20 h-1.5 bg-sky-500 mx-auto mt-6 rounded-full shadow-lg shadow-sky-600/50"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="bg-gray-900 p-8 rounded-3xl border border-gray-700 shadow-xl hover:-translate-y-2 hover:border-sky-600 transition-all duration-300">
                                <div class="w-14 h-14 bg-sky-950/50 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 shadow-inner border border-sky-600/20"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                                <h3 class="text-xl font-bold text-white mb-3">Kecepatan Tinggi</h3>
                                <p class="text-gray-400 text-sm leading-relaxed">Server berkinerja tinggi yang dihosting di cloud terkemuka, menjamin ping rendah dan bandwidth besar untuk streaming & gaming.</p>
                            </div>
                            <div class="bg-gray-900 p-8 rounded-3xl border border-gray-700 shadow-xl hover:-translate-y-2 hover:border-sky-600 transition-all duration-300">
                                <div class="w-14 h-14 bg-sky-950/50 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 shadow-inner border border-sky-600/20"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
                                <h3 class="text-xl font-bold text-white mb-3">Pilihan Protokol Luas</h3>
                                <p class="text-gray-400 text-sm leading-relaxed">Tersedia jaringan SSH Premium, L2TP, VMess, VLESS, hingga Trojan WebSocket yang dapat disesuaikan dengan kebutuhan Anda.</p>
                            </div>
                            <div class="bg-gray-900 p-8 rounded-3xl border border-gray-700 shadow-xl hover:-translate-y-2 hover:border-green-500 transition-all duration-300">
                                <div class="w-14 h-14 bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 text-green-400 shadow-inner border border-green-500/20"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
                                <h3 class="text-xl font-bold text-white mb-3">Sistem Otomatis</h3>
                                <p class="text-gray-400 text-sm leading-relaxed">Top up saldo via QRIS Realtime dan pembuatan server VPN dilakukan 100% otomatis dalam hitungan detik tanpa campur tangan admin.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="py-16 md:py-24 bg-gray-900/80 relative z-10 backdrop-blur-sm">
                    <div class="max-w-6xl mx-auto px-4">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                            <div>
                                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Tentang Warung Pulsa</h2>
                                <div class="w-16 h-1.5 bg-sky-500 rounded-full mb-8"></div>
                                <p class="text-gray-400 leading-relaxed mb-6 text-justify text-lg"><strong>Warung Pulsa</strong> adalah platform penyedia layanan Virtual Private Network (VPN) dan Proxy premium terpercaya. Kami membangun infrastruktur ini di atas server berkinerja tinggi untuk memastikan Anda mendapatkan kecepatan tanpa kompromi.</p>
                                <div class="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl border border-sky-600/30 shadow-lg mb-6">
                                    <p class="text-red-100 font-medium leading-relaxed text-justify">Produk utama yang kami jual adalah layanan <strong>VPN Premium</strong>. Anda dapat menikmati seluruh fitur dan keunggulan jaringan proxy kami dengan sistem tarif transparan sebesar <strong>Rp ${appSettings.price_per_day} per hari</strong>.</p>
                                </div>
                                <p class="text-gray-400 leading-relaxed text-justify mb-6 text-lg">Seluruh ekosistem website ini\u2014mulai dari pendaftaran, pengisian saldo, hingga proses <em>deployment</em> server VPN\u2014berjalan <strong>100% secara otomatis 24 jam nonstop</strong>.</p>
                            </div>
                            <div class="bg-gray-800 p-6 md:p-10 rounded-3xl border border-gray-700 shadow-2xl relative">
                                <h2 class="text-2xl md:text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">Alur Transaksi Otomatis</h2>
                                <div class="space-y-8">
                                    <div class="flex gap-5 items-start">
                                        <div class="w-12 h-12 rounded-2xl bg-sky-950/50 text-cyan-400 flex items-center justify-center font-black text-xl border border-sky-600/30 shrink-0 shadow-lg">1</div>
                                        <div><h3 class="text-white font-bold mb-2 text-lg">Login dengan Akun Google</h3><p class="text-sm text-gray-400 leading-relaxed">Tidak perlu repot mengisi form. Akses dashboard langsung dengan 1 klik menggunakan akun Google Anda.</p></div>
                                    </div>
                                    <div class="flex gap-5 items-start">
                                        <div class="w-12 h-12 rounded-2xl bg-green-900/50 text-green-400 flex items-center justify-center font-black text-xl border border-green-500/30 shrink-0 shadow-lg">2</div>
                                        <div><h3 class="text-white font-bold mb-2 text-lg">Top Up Saldo via QRIS</h3><p class="text-sm text-gray-400 leading-relaxed">Pilih nominal top up dan scan QRIS melalui aplikasi bank/e-wallet Anda. Saldo otomatis bertambah.</p></div>
                                    </div>
                                    <div class="flex gap-5 items-start">
                                        <div class="w-12 h-12 rounded-2xl bg-yellow-900/50 text-yellow-400 flex items-center justify-center font-black text-xl border border-yellow-500/30 shrink-0 shadow-lg">3</div>
                                        <div><h3 class="text-white font-bold mb-2 text-lg">Pembuatan VPN Instan</h3><p class="text-sm text-gray-400 leading-relaxed">Pilih Server, Protokol, Username dan Durasi di dashboard lalu klik 'Bayar'. Server langsung dieksekusi.</p></div>
                                    </div>
                                    <div class="flex gap-5 items-start">
                                        <div class="w-12 h-12 rounded-2xl bg-pink-900/50 text-pink-400 flex items-center justify-center font-black text-xl border border-pink-500/30 shrink-0 shadow-lg">4</div>
                                        <div><h3 class="text-white font-bold mb-2 text-lg">Detail Masuk ke Inbox</h3><p class="text-sm text-gray-400 leading-relaxed">Detail config lengkap VPN Anda akan langsung dikirim ke menu <strong>Inbox</strong>. Siap digunakan!</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script>
                    async function handleCredentialResponse(response) { const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential: response.credential }) }); if(res.ok) { window.location.reload(); } else { swalDark.fire('Gagal', 'Gagal login dengan Google.', 'error'); } }
                <\/script>
                `;
        return new Response(renderLayout("Login", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
      } else {
        const nowTs = Date.now();
        const { results: unpaidInvoices } = await env.DB.prepare("SELECT * FROM invoices WHERE email = ? AND status = 'UNPAID'").bind(currentUser.email).all();
        const validUnpaid = [];
        if (unpaidInvoices) {
          for (const inv of unpaidInvoices) {
            const invTs = parseWIBDateString(inv.date);
            if (invTs > 0 && nowTs - invTs > 36e5) continue;
            validUnpaid.push(inv);
          }
        }
        currentUser.unpaid_invoices = validUnpaid;
        const formatRupiah = /* @__PURE__ */ __name222((angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(angka), "formatRupiah");
        const serverOptions = appSettings.servers.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
        const isQrisManualOn = appSettings.payment_qris_manual === true;
        const isShopeePayOn = appSettings.payment_shopeepay !== false;
        const isGoPayOn = appSettings.payment_gopay !== false;
        let paymentMethodHtml = "";
        const activeMethods = [];
        if (isShopeePayOn) activeMethods.push({ value: "shopeepay", label: "ShopeePay QRIS (AutoGoPay)" });
        if (isGoPayOn) activeMethods.push({ value: "gopay", label: "GoPay QRIS (AutoGoPay)" });
        if (isQrisManualOn) activeMethods.push({ value: "manual", label: "QRIS Manual (Konfirmasi Admin)" });
        if (activeMethods.length > 1) {
          let optionsHtml = activeMethods.map((m) => `<option value="${m.value}">${m.label}</option>`).join("");
          paymentMethodHtml = `<select id="topupMethod" class="w-full mb-3 bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm outline-none text-white focus:ring-2 focus:ring-sky-500 transition">${optionsHtml}</select>`;
        } else if (activeMethods.length === 1) {
          paymentMethodHtml = `<input type="hidden" id="topupMethod" value="${activeMethods[0].value}">`;
        } else {
          paymentMethodHtml = `<p class="text-cyan-400 text-xs mb-3 font-bold bg-sky-900/20 p-2 rounded-lg border border-sky-500/20">Metode Top Up saat ini sedang dinonaktifkan Admin.</p>`;
        }
        const disableTopupButton = activeMethods.length === 0 ? 'disabled class="bg-gray-700 text-gray-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed shrink-0"' : 'class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shrink-0"';
        let pendingBannerHtml = "";
        if (currentUser.unpaid_invoices && currentUser.unpaid_invoices.length > 0) {
          pendingBannerHtml = `
                        <div class="bg-yellow-900/40 border border-yellow-500/50 p-4 md:p-5 rounded-3xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                            <div class="flex items-center gap-4">
                                <div class="bg-yellow-500/20 p-3 rounded-full shrink-0"><svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                                <div><h4 class="text-yellow-400 font-bold text-lg">Menunggu Pembayaran!</h4><p class="text-sm text-yellow-200 mt-1">Anda memiliki <b>${currentUser.unpaid_invoices.length}</b> tagihan Top Up Saldo yang belum dibayar.</p></div>
                            </div>
                            <a href="/inbox" class="w-full md:w-auto text-center bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow whitespace-nowrap border border-yellow-500">Cek Inbox Pembayaran</a>
                        </div>
                    `;
        }
        const content = `
                <div class="max-w-4xl mx-auto px-4 md:px-8 py-8">
                    <div class="mb-8 hidden md:block text-center relative z-10">
                        <h1 class="text-3xl font-black text-white mb-2 tracking-tight">Dashboard Utama</h1>
                        <p class="text-gray-400 text-sm">Kelola isi saldo dompet dan buat akun VPN baru Anda.</p>
                    </div>

                    ${pendingBannerHtml}

                    <div class="space-y-8 relative z-10">
                        <div class="bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden">
                            <div class="absolute -right-6 -top-6 text-gray-700 opacity-20"><svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.26-.87-2.32-1.92H7.9c.07 1.8 1.46 3.1 3 3.5V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg></div>
                            <h2 class="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Total Saldo Aktif</h2>
                            <p class="text-4xl md:text-5xl font-black text-green-400 mb-4 tracking-tighter drop-shadow-lg">${formatRupiah(currentUser.balance)}</p>
                            
                            <!-- Tombol Toggle Form Top Up -->
                            <button id="btnToggleTopup" onclick="document.getElementById('topupFormContainer').classList.toggle('hidden'); this.querySelector('.toggle-icon').classList.toggle('rotate-45');" class="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-lg flex items-center gap-2 text-sm relative z-20">
                                <svg class="w-4 h-4 transition-transform duration-300 toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                <span>Top Up Saldo</span>
                            </button>

                            <div id="topupFormContainer" class="hidden mt-6 bg-gray-950 p-5 rounded-2xl border border-gray-800 relative z-20">
                                <h3 class="text-sm font-bold text-white mb-3">Isi Ulang Saldo</h3>
                                ${paymentMethodHtml}
                                <div class="flex flex-col sm:flex-row gap-3">
                                    <select id="topupAmount" class="flex-grow bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm outline-none text-white focus:ring-2 focus:ring-sky-500 transition">
                                        <option value="1000">Rp 1.000</option>
                                        <option value="5000">Rp 5.000</option>
                                        <option value="10000">Rp 10.000</option>
                                        <option value="20000">Rp 20.000</option>
                                        <option value="50000">Rp 50.000</option>
                                        <option value="100000">Rp 100.000</option>
                                        <option value="500000">Rp 500.000</option>
                                    </select>
                                    <button onclick="topUp()" id="btnTopup" ${disableTopupButton}>Top Up</button>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gradient-to-br from-red-950 to-red-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-sky-600 relative z-20">
                            <h2 class="text-xl md:text-2xl font-bold text-white mb-6">\u2795 Buat Akun VPN Baru</h2>
                            <div class="space-y-5 mb-8">
                                <div>
                                    <label class="block text-xs text-red-200 mb-2 font-bold tracking-wide">USERNAME VPN (HURUF & ANGKA)</label>
                                    <input type="text" id="vpnUsername" placeholder="Contoh: jagoan123" required pattern="[a-zA-Z0-9]+" class="w-full bg-gray-900 border border-red-800/50 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-red-400 outline-none transition placeholder-gray-600 relative z-20">
                                </div>
                                <div>
                                    <label class="block text-xs text-red-200 mb-2 font-bold tracking-wide">PILIH SERVER TUJUAN</label>
                                    <select id="vpnServer" class="w-full bg-gray-900 border border-red-800/50 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-red-400 outline-none relative z-20">
                                        ${serverOptions}
                                    </select>
                                </div>
                                <div class="grid grid-cols-2 gap-4 relative z-20">
                                    <div>
                                        <label class="block text-xs text-red-200 mb-2 font-bold tracking-wide">PROTOKOL</label>
                                        <select id="vpnProtocol" class="w-full bg-gray-900 border border-red-800/50 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-red-400 outline-none">
                                            <option value="trojanws">Trojan WS</option>
                                            <option value="vmessws">VMess WS</option>
                                            <option value="vlessws">VLESS WS</option>
                                            <option value="ssh">SSH/OVPN</option>
                                            <option value="l2tp">L2TP</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs text-red-200 mb-2 font-bold tracking-wide">DURASI</label>
                                        <select id="vpnDuration" onchange="updatePrice()" class="w-full bg-gray-900 border border-red-800/50 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-red-400 outline-none">
                                            <option value="10">10 Hari</option>
                                            <option value="20">20 Hari</option>
                                            <option value="30" selected>30 Hari</option>
                                            <option value="60">60 Hari</option>
                                            <option value="90">90 Hari</option>
                                            <option value="trial">TRIAL (1 Jam)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="flex justify-between items-center mb-6 bg-black/30 p-5 rounded-2xl border border-sky-600/30">
                                <span class="text-sm text-red-100 font-medium">Total Harga:</span>
                                <span class="text-3xl font-black text-yellow-400 tracking-tight" id="totalPriceDisplay">Rp ${(appSettings.price_per_day * 30).toLocaleString("id-ID")}</span>
                            </div>
                            <button onclick="buyVPN()" id="btnBuy" class="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-black py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition transform hover:-translate-y-1 text-lg relative z-20">BAYAR & BUAT AKUN</button>
                        </div>
                    </div>
                </div>

                <script>
                    const pricePerDay = ${appSettings.price_per_day};
                    const USER_EMAIL = "${currentUser.email}";
                    
                    function updatePrice() {
                        const val = document.getElementById('vpnDuration').value;
                        const userInput = document.getElementById('vpnUsername');
                        if (val === 'trial') {
                            document.getElementById('totalPriceDisplay').innerText = 'GRATIS';
                            userInput.value = ''; userInput.disabled = true; userInput.placeholder = 'Auto-generate oleh Server';
                            userInput.classList.add('opacity-50', 'cursor-not-allowed');
                        } else {
                            const days = parseInt(val);
                            document.getElementById('totalPriceDisplay').innerText = 'Rp ' + (days * pricePerDay).toLocaleString('id-ID');
                            userInput.disabled = false; userInput.placeholder = 'Contoh: jagoan123';
                            userInput.classList.remove('opacity-50', 'cursor-not-allowed');
                        }
                    }

                    function playSuccessChime() {
                        try {
                            const AudioCtx = window.AudioContext || window.webkitAudioContext;
                            if (!AudioCtx) return;
                            const ctx = new AudioCtx();
                            const now = ctx.currentTime;
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(523.25, now);
                            osc.frequency.setValueAtTime(659.25, now + 0.1);
                            osc.frequency.setValueAtTime(783.99, now + 0.2);
                            osc.frequency.setValueAtTime(1046.50, now + 0.3);
                            gain.gain.setValueAtTime(0.2, now);
                            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.start(now);
                            osc.stop(now + 0.8);
                        } catch(e) {}
                    }

                    let paymentCheckInterval = null;
                    function showAutoGoPayModal(data) {
                        if (paymentCheckInterval) clearInterval(paymentCheckInterval);
                        const titleMethod = data.method === 'shopeepay' ? 'ShopeePay' : 'GoPay';
                        let timeLeft = 15 * 60;
                        let isChecking = false;
                        const qrImgSrc = data.qr_url ? data.qr_url : ('https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=' + encodeURIComponent(data.qr_raw || ''));

                        swalDark.fire({
                            title: '💳 Pembayaran ' + titleMethod + ' QRIS',
                            html: '<div class="text-left text-sm text-gray-300 space-y-3">' +
                                  '  <div class="bg-gray-900 p-3.5 rounded-2xl border border-gray-700 text-center">' +
                                  '    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Wajib Bayar</p>' +
                                  '    <p class="text-3xl font-black text-green-400 tracking-tight">Rp ' + Number(data.total_amount).toLocaleString('id-ID') + '</p>' +
                                  '    <span class="inline-block mt-1 text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2.5 py-0.5 rounded-md font-mono">Termasuk kode unik Rp ' + data.unique_code + '</span>' +
                                  '  </div>' +
                                  '  <div class="text-center my-2 relative">' +
                                  '    <img src="' + qrImgSrc + '" alt="QRIS ' + titleMethod + '" class="mx-auto rounded-2xl w-60 h-60 object-contain shadow-2xl border border-gray-700 bg-white p-2">' +
                                  '    <p class="text-[11px] text-gray-400 mt-2">Scan QRIS dengan <b>' + titleMethod + ' / BCA / DANA / OVO / Semua Bank & E-Wallet</b>.</p>' +
                                  '  </div>' +
                                  '  <div class="bg-gray-950 p-3.5 rounded-xl border border-gray-800 text-xs font-mono space-y-1.5">' +
                                  '    <div class="flex justify-between items-center"><span class="text-gray-500">No. Ref:</span><span class="text-white font-bold">' + data.ref + '</span></div>' +
                                  '    <div class="flex justify-between items-center"><span class="text-gray-500">Batas Waktu:</span><span id="qrisTimer" class="text-cyan-400 font-bold">15:00</span></div>' +
                                  '    <div class="flex justify-between items-center pt-1 border-t border-gray-850"><span class="text-gray-500">Status Live:</span>' +
                                  '      <span id="qrisStatusBadge" class="inline-flex items-center gap-1.5 text-xs text-yellow-400 font-bold">' +
                                  '        <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span></span>' +
                                  '        Mendeteksi otomatis...' +
                                  '      </span>' +
                                  '    </div>' +
                                  '  </div>' +
                                  '</div>',
                            showCancelButton: true,
                            confirmButtonText: '🔍 Cek Status Sekarang',
                            cancelButtonText: 'Tutup',
                            confirmButtonColor: '#22c55e',
                            cancelButtonColor: '#6b7280',
                            didOpen: () => {
                                const timerEl = document.getElementById('qrisTimer');
                                const badgeEl = document.getElementById('qrisStatusBadge');
                                
                                const checkPaymentFn = async (isManual = false) => {
                                    if (isChecking) return false;
                                    isChecking = true;
                                    try {
                                        const chkRes = await fetch('/api/check-payment', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ref: data.ref, order_sn: data.order_sn, transaction_id: data.transaction_id })
                                        });
                                        const chkData = await chkRes.json();
                                        if (chkData.success && chkData.status === 'PAID') {
                                            if (paymentCheckInterval) clearInterval(paymentCheckInterval);
                                            playSuccessChime();
                                            if (badgeEl) {
                                                badgeEl.innerHTML = '<span class="inline-flex items-center gap-1 text-green-400 font-bold">✅ Berhasil Terbayar!</span>';
                                            }
                                            await swalDark.fire({
                                                title: 'Pembayaran Berhasil! 🎉',
                                                html: '<p class="text-sm text-gray-300">Dana sebesar <b class="text-green-400 text-xl font-bold">Rp ' + Number(data.total_amount).toLocaleString('id-ID') + '</b> telah otomatis ditambahkan ke saldo akun Anda!</p>',
                                                icon: 'success',
                                                confirmButtonText: 'Mantap!',
                                                confirmButtonColor: '#22c55e'
                                            });
                                            window.location.reload();
                                            return true;
                                        } else if (isManual) {
                                            swalDark.showValidationMessage(chkData.message || 'Pembayaran belum terdeteksi. Silakan tunggu sebentar setelah transfer.');
                                        }
                                    } catch(e){}
                                    isChecking = false;
                                    return false;
                                };

                                paymentCheckInterval = setInterval(async () => {
                                    timeLeft--;
                                    if (timerEl) {
                                        const m = Math.floor(timeLeft / 60);
                                        const s = timeLeft % 60;
                                        timerEl.innerText = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
                                    }
                                    if (timeLeft <= 0) {
                                        clearInterval(paymentCheckInterval);
                                        if (badgeEl) { badgeEl.innerHTML = '<span class="text-sky-400 font-bold">Kedaluwarsa</span>'; }
                                    } else if (timeLeft % 3 === 0) {
                                        await checkPaymentFn(false);
                                    }
                                }, 1000);
                            },
                            preConfirm: async () => {
                                swalDark.resetValidationMessage();
                                const isPaid = await fetch('/api/check-payment', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ ref: data.ref, order_sn: data.order_sn, transaction_id: data.transaction_id })
                                }).then(r => r.json()).catch(() => ({}));
                                
                                if (isPaid && isPaid.status === 'PAID') {
                                    if (paymentCheckInterval) clearInterval(paymentCheckInterval);
                                    playSuccessChime();
                                    await swalDark.fire('Pembayaran Berhasil! 🎉', 'Saldo akun Anda telah berhasil ditambahkan!', 'success');
                                    window.location.reload();
                                    return true;
                                }
                                swalDark.showValidationMessage(isPaid.message || ('Pembayaran belum terdeteksi. Pastikan Anda telah mentransfer nominal tepat Rp ' + Number(data.total_amount).toLocaleString('id-ID')));
                                return false;
                            },
                            willClose: () => {
                                if (paymentCheckInterval) clearInterval(paymentCheckInterval);
                            }
                        });
                    }

                    async function topUp() {
                        const amount = document.getElementById('topupAmount').value;
                        const methodEl = document.getElementById('topupMethod');
                        const method = methodEl ? methodEl.value : 'none';

                        if (method === 'none') return swalDark.fire('Gagal', 'Pembayaran sedang dinonaktifkan Admin.', 'error');
                        if (method === 'manual') {
                            const uniqueCode = Math.floor(Math.random() * 99) + 1;
                            const finalAmount = parseInt(amount) + uniqueCode;

                            swalDark.fire({
                                title: 'QRIS Pembayaran Manual',
                                html: '<p class="mb-4 text-sm text-gray-300">Silakan transfer <b>TEPAT SEJUMLAH</b> <b class="text-green-400 text-xl">Rp ' + finalAmount.toLocaleString('id-ID') + '</b> ke QRIS di bawah ini.</p>' +
                                      '<p class="text-xs text-yellow-400 mb-4 bg-yellow-500/10 p-2.5 rounded-lg border border-yellow-500/20 shadow-sm">*Angka unik <b>' + uniqueCode + '</b> di belakang ditambahkan otomatis agar Admin dapat memverifikasi dana Anda lebih cepat.</p>' +
                                      '<img src="/qris-manual.jpg" alt="QRIS Manual" class="mx-auto rounded-xl w-64 mb-4 shadow-lg border border-gray-700">' +
                                      '<p class="text-xs text-gray-400 mb-2">Setelah transfer selesai, wajib klik tombol di bawah ini untuk mengirimkan <b>Bukti Transfer</b> kepada Admin melalui WhatsApp.</p>',
                                showCancelButton: true, confirmButtonText: 'Konfirmasi via WA', cancelButtonText: 'Batal', confirmButtonColor: '#22c55e'
                            }).then((res) => {
                                if (res.isConfirmed) {
                                    const waMsg = ['Halo Admin, saya ingin konfirmasi Top Up saldo.', 'Email Akun: ' + USER_EMAIL, 'Nominal: Rp ' + finalAmount.toLocaleString('id-ID'), 'Metode: QRIS Manual', '', 'Berikut adalah bukti transfer saya:'].join(String.fromCharCode(10));
                                    window.open('https://wa.me/6282175037525?text=' + encodeURIComponent(waMsg), '_blank');
                                }
                            });
                            return;
                        }

                        const btn = document.getElementById('btnTopup');
                        btn.innerText = 'Tunggu...'; btn.disabled = true;
                        try {
                            const res = await fetch('/api/topup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: parseInt(amount), method: method }) });
                            const data = await res.json();
                            if(data.success) {
                                if (data.method === 'shopeepay' || data.method === 'gopay') {
                                    showAutoGoPayModal(data);
                                } else if (data.checkout_url) {
                                    window.location.href = data.checkout_url;
                                } else {
                                    swalDark.fire('Berhasil', 'Invoice top up berhasil dibuat.', 'success');
                                }
                            } else {
                                swalDark.fire('Gagal', data.message, 'error');
                            }
                        } catch(e) { swalDark.fire('Error', 'Gagal menghubungi server.', 'error'); }
                        btn.innerText = 'Top Up'; btn.disabled = false;
                    }

                    async function buyVPN() {
                        const val = document.getElementById('vpnDuration').value;
                        let confirmMsg = ''; let total = 0;
                        let vpnUsername = document.getElementById('vpnUsername').value.trim();
                        
                        if (val !== 'trial') {
                            if (!vpnUsername || /[^a-zA-Z0-9]/.test(vpnUsername)) {
                                return swalDark.fire('Invalid Input', 'Username tidak boleh kosong dan HANYA boleh berisi huruf dan angka (tanpa spasi/simbol)!', 'warning');
                            }
                            total = parseInt(val) * pricePerDay;
                            confirmMsg = 'Saldo Anda akan dipotong sebesar Rp ' + total.toLocaleString('id-ID') + ' untuk pembuatan server ini. Lanjutkan?';
                        } else {
                            confirmMsg = 'Anda akan membuat akun TRIAL (Gratis) dengan durasi 1 Jam. Lanjutkan?';
                        }

                        const confirmResult = await swalDark.fire({
                            title: 'Konfirmasi Pembelian', text: confirmMsg, icon: 'question',
                            showCancelButton: true, confirmButtonText: 'Ya, buat akun', cancelButtonText: 'Batal'
                        });

                        if(!confirmResult.isConfirmed) return;
                        
                        const btn = document.getElementById('btnBuy');
                        btn.innerText = 'proses create akun...wait...'; btn.disabled = true;
                        const overlay = document.getElementById('loadingOverlay');
                        if (overlay) overlay.classList.remove('hidden');

                        try {
                            const res = await fetch('/api/buy', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ serverId: document.getElementById('vpnServer').value, protocol: document.getElementById('vpnProtocol').value, duration: val, customUsername: vpnUsername }) });
                            const data = await res.json();
                            if (overlay) overlay.classList.add('hidden');
                            if(data.success) {
                                await swalDark.fire('Berhasil!', '\u{1F389} Server berhasil dibuat! Silakan cek menu INBOX Anda untuk melihat konfigurasi.', 'success');
                                window.location.reload();
                            } else {
                                swalDark.fire('Gagal', data.message, 'error');
                            }
                        } catch(e) {
                            if (overlay) overlay.classList.add('hidden');
                            swalDark.fire('Error', 'Terjadi kesalahan saat memproses pesanan.', 'error');
                        }
                        btn.innerText = 'BAYAR & BUAT AKUN'; btn.disabled = false;
                    }
                <\/script>
                `;
        return new Response(renderLayout("Dashboard", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
      }
    }
    if (path === "/produk" && method === "GET") {
      const content = `
            <div class="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16 relative z-10">
                <div class="text-center mb-12 md:mb-16">
                    <h1 class="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Produk & Harga</h1>
                    <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">Kami menyediakan tarif flat dan transparan. Satu harga untuk akses semua protokol dan jaringan proxy terbaik kami.</p>
                    <div class="w-24 h-1.5 bg-sky-500 mx-auto mt-6 rounded-full shadow-lg shadow-sky-600/50"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <div class="bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] border border-gray-700 shadow-2xl overflow-hidden relative transform transition hover:-translate-y-2">
                        <div class="absolute top-0 right-0 bg-yellow-500 text-yellow-900 font-bold text-xs px-5 py-1.5 rounded-bl-xl uppercase tracking-wider shadow-md">Tarif Flat</div>
                        <div class="p-8 md:p-10 border-b border-gray-700 text-center">
                            <h2 class="text-2xl font-bold text-white mb-2">VPN & Proxy All-in-One</h2>
                            <p class="text-gray-400 text-sm mb-6">Hitungan murni berdasarkan pemakaian hari</p>
                            <div class="flex justify-center items-baseline gap-1">
                                <span class="text-3xl font-bold text-cyan-400">Rp</span>
                                <span class="text-6xl font-black text-white">${appSettings.price_per_day}</span>
                            </div>
                            <p class="text-gray-500 text-sm mt-2">/ Hari</p>
                        </div>
                        <div class="p-8 md:p-10 bg-gray-900/50">
                            <ul class="space-y-4 mb-8">
                                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="text-gray-300 text-sm md:text-base">Bebas Pilih Server</span></li>
                                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="text-gray-300 text-sm md:text-base">Bebas Pilih Protokol (SSH/VMess/Vless/Trojan)</span></li>
                                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="text-gray-300 text-sm md:text-base">Limit 2 Device / IP Bersamaan</span></li>
                                <li class="flex items-center gap-3"><svg class="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> <span class="text-gray-300 text-sm md:text-base">Aktivasi Otomatis via API</span></li>
                            </ul>
                            <a href="/" class="block w-full bg-sky-600 hover:bg-sky-500 text-white text-center font-bold py-4 px-4 rounded-xl transition shadow-lg shadow-sky-600/30 relative z-20">BUAT SEKARANG (Dashboard)</a>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-2xl md:text-3xl font-bold text-white mb-6">Pilihan Durasi Bebas</h3>
                        <p class="text-gray-400 leading-relaxed mb-8 text-base">Sistem kami memungkinkan Anda mengatur durasi pemakaian (10, 20, 30, 60, hingga 90 hari) sesuai kebutuhan dompet Anda. Saldo akan otomatis terpotong proporsional.</p>
                        <div class="space-y-5">
                            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex justify-between items-center relative z-20"><span class="text-gray-300 font-bold text-lg">10 Hari</span><span class="text-cyan-400 font-mono text-lg">Rp ${(appSettings.price_per_day * 10).toLocaleString("id-ID")}</span></div>
                            <div class="bg-gray-800 p-5 rounded-2xl border border-sky-600/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex justify-between items-center transform scale-105 my-6 relative z-20"><span class="text-white font-black text-lg md:text-xl">30 Hari (Recomend)</span><span class="text-yellow-400 font-black text-xl font-mono">Rp ${(appSettings.price_per_day * 30).toLocaleString("id-ID")}</span></div>
                            <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex justify-between items-center relative z-20"><span class="text-gray-300 font-bold text-lg">90 Hari</span><span class="text-cyan-400 font-mono text-lg">Rp ${(appSettings.price_per_day * 90).toLocaleString("id-ID")}</span></div>
                        </div>
                    </div>
                </div>
            </div>`;
      return new Response(renderLayout("Produk & Harga", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/paket-data" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      const savedPhone = currentUser.phone || "";
      let pkgDescStr;
      try {
        pkgDescStr = await env.DB.prepare("SELECT value FROM settings WHERE key = 'pkg_desc'").first("value");
      } catch (e) {
      }
      let pkgDescMap = pkgDescStr ? JSON.parse(pkgDescStr) : {};
      const isAdminStr = isSuperAdmin(currentUser, env) ? "true" : "false";
      const content = `
            <div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
                <h1 class="text-3xl font-black text-white mb-6 border-b border-gray-800 pb-4 tracking-tight">Beli Paket Data XL</h1>
                
                <div class="bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-6 md:p-8">
                    <div class="space-y-6">
                        <div class="relative z-20">
                            <label class="block text-sm font-bold text-gray-400 mb-2 uppercase flex justify-between items-center">
                                <span>Nomor HP Tujuan</span>
                                <button onclick="openPhonebook()" class="text-xs text-cyan-400 font-bold bg-sky-950/20 hover:bg-sky-950/40 px-3 py-1.5 rounded transition flex items-center gap-1.5 shadow-sm border border-sky-600/30">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> \u{1F4D6} Nomorku
                                </button>
                            </label>
                            <input type="number" id="xlPhone" value="${savedPhone}" oninput="resetOtpState()" placeholder="Contoh: 0818xxxxxx" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white text-lg focus:ring-2 focus:ring-sky-500 outline-none transition font-mono tracking-wider shadow-inner">
                        </div>
                        
                        <div id="packageSelectionSection" class="relative z-20">
                            <label class="block text-sm font-bold text-gray-400 mb-2 uppercase">Pilih Paket Data</label>
                            <div class="relative mb-2">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
                                <input type="text" id="searchPackage" placeholder="Ketik pencarian: xtra combo, unlimited..." class="w-full bg-gray-950 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition shadow-inner">
                            </div>
                            
                            <div id="packageListContainer" class="w-full bg-gray-900 border border-gray-700 rounded-xl max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                <div class="p-4 flex justify-center items-center gap-3">
                                    <svg class="w-5 h-5 text-sky-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    <span class="text-gray-400 text-sm font-medium">Sinkronisasi produk dengan Server...</span>
                                </div>
                            </div>
                            
                            <input type="hidden" id="xlPackageId" value="">
                            <input type="hidden" id="xlPackagePrice" value="0">
                            <input type="hidden" id="xlNeedOtp" value="false">
                            <input type="hidden" id="xlPackageName" value="">
                            <p class="text-xs text-gray-500 mt-2 text-right font-mono" id="pkgCount">Total: 0 paket</p>
                        </div>

                        <div id="otpSection" class="hidden bg-gray-950 p-5 rounded-2xl border border-gray-800 space-y-4 shadow-inner relative z-20">
                            <div id="otpVerifyMode">
                                <div class="flex gap-3 mb-4 items-start">
                                    <svg class="w-6 h-6 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                    <div><h4 class="text-sm font-bold text-white mb-1">Paket Khusus MyXL</h4><p class="text-xs text-gray-400 leading-relaxed">Paket ini mewajibkan verifikasi nomor HP Anda. Klik tombol di bawah dan sistem akan mengecek apakah sesi Anda masih tersimpan.</p></div>
                                </div>
                                <button onclick="verifySmartOtp()" id="btnSmartVerify" class="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-xl transition shadow">\u{1F6E1}\uFE0F Verifikasi Nomor Ini</button>
                            </div>
                            <div id="otpManualMode" class="hidden">
                                <label class="block text-sm font-bold text-yellow-400 mb-2">Kode OTP telah dikirim ke nomor Anda</label>
                                <div class="flex gap-2">
                                    <input type="text" id="xlOtpCode" placeholder="6 Digit OTP" class="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 text-white text-center tracking-widest text-lg font-mono focus:ring-2 focus:ring-yellow-500 outline-none">
                                    <button onclick="submitManualOtp()" id="btnSubmitOtp" class="bg-green-600 hover:bg-green-500 text-white font-bold px-6 rounded-xl transition shadow shrink-0">Kirim</button>
                                </div>
                            </div>
                            <div id="otpSuccessMode" class="hidden">
                                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-green-900/20 p-4 rounded-xl border border-green-500/30">
                                    <div class="flex items-center gap-3">
                                        <div class="bg-green-500/20 p-2 rounded-full"><svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
                                        <div><span class="block text-sm font-bold text-green-400">Sesi Aktif Terverifikasi!</span><span class="text-xs text-gray-400">Tombol Beli sekarang terbuka.</span></div>
                                    </div>
                                    <button onclick="checkPulsa()" id="btnCheckPulsa" class="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 text-xs font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow">\u{1F4B3} Cek Pulsa, Kuota & Lokasi</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-900 p-5 rounded-2xl border border-gray-700 flex flex-col mb-4 relative z-20">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-400 font-bold">Harga Jual:</span>
                                <span class="text-3xl font-black text-green-400 font-mono tracking-tight" id="xlPriceDisplay">Rp 0</span>
                            </div>
                            <div id="xlDescDisplay" class="border-t border-gray-800 pt-3 mt-3 hidden"></div>
                        </div>

                        <div class="mb-4 relative z-20">
                            <label class="block text-sm font-bold text-gray-400 mb-2 uppercase">Metode Pembayaran</label>
                            <select id="xlPaymentMethod" class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-sky-500 outline-none transition">
                                <option value="BALANCE">Saldo Web (Potong Penuh)</option>
                            </select>
                            <p id="xlPaymentNotice" class="text-xs text-yellow-500 mt-2">*Catatan: Silakan pilih paket terlebih dahulu untuk melihat info pembayaran.</p>
                        </div>

                        <button onclick="buyXL()" id="btnBuyXL" disabled class="w-full bg-gray-700 text-gray-400 font-black py-4 rounded-xl shadow-lg transition text-lg mt-4 cursor-not-allowed relative z-20">PILIH PAKET TERLEBIH DAHULU</button>
                    </div>
                </div>

                <div id="phonebookModal" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div class="bg-gray-900 p-6 rounded-3xl w-full max-w-md border border-sky-600/30 shadow-2xl flex flex-col max-h-[80vh]">
                        <div class="flex justify-between items-center mb-5 border-b border-gray-800 pb-3">
                            <h3 class="text-xl font-bold text-white flex items-center gap-2">\u{1F4D6} Buku Telepon</h3>
                            <button onclick="closePhonebook()" class="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <div class="mb-4 flex gap-2">
                            <input type="number" id="newPhoneNumber" placeholder="Ketik No. Baru..." class="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none text-sm font-mono tracking-wider">
                            <button onclick="addNumberToPhonebook()" class="bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 py-3 rounded-xl transition shadow-lg text-sm shrink-0">Simpan</button>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Daftar Tersimpan</p>
                            <p class="text-xs text-gray-500 font-mono" id="phonebookCount">0/10</p>
                        </div>
                        <div id="phonebookList" class="overflow-y-auto custom-scrollbar flex-grow space-y-2"></div>
                    </div>
                </div>
            </div>

            <script>
                const USER_EMAIL = "${currentUser.email}";
                const IS_ADMIN = ${isAdminStr};
                let pkgDescMap = ${JSON.stringify(pkgDescMap)};
                let phonebookList = ${currentUser.phonebook || "[]"};

                function getPhonebook() { return phonebookList; }

                function savePhonebook(data) {
                    phonebookList = data;
                    fetch('/api/phonebook', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phonebook: data })
                    }).catch(e => console.error("Gagal simpan phonebook", e));
                }

                function openPhonebook() { document.getElementById('phonebookModal').classList.remove('hidden'); renderPhonebook(); }
                function closePhonebook() { document.getElementById('phonebookModal').classList.add('hidden'); }

                function renderPhonebook() {
                    const list = getPhonebook();
                    const container = document.getElementById('phonebookList');
                    document.getElementById('phonebookCount').innerText = list.length + '/10';
                    if (list.length === 0) { container.innerHTML = '<p class="text-center text-gray-500 text-sm py-6">Belum ada nomor tersimpan.</p>'; return; }
                    container.innerHTML = list.map((phone, index) => 
                        '<div class="flex justify-between items-center bg-gray-800 p-3 rounded-xl border border-gray-700 hover:border-sky-600/50 transition"><span class="text-white font-mono font-medium tracking-wider">' + phone + '</span><div class="flex gap-2"><button onclick="selectPhone(\\'' + phone + '\\')" class="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-md">Pilih</button><button onclick="deletePhone(' + index + ')" class="bg-sky-600/20 hover:bg-sky-600/40 text-cyan-400 border border-sky-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition">Hapus</button></div></div>'
                    ).join('');
                }

                function addNumberToPhonebook(number = null) {
                    const newPhone = number || document.getElementById('newPhoneNumber').value.trim();
                    if (!newPhone) return;
                    let list = getPhonebook();
                    if (list.includes(newPhone)) { if (!number) swalDark.fire('Info', 'Nomor sudah ada di buku telepon.', 'info'); return; }
                    if (list.length >= 10) { if (!number) swalDark.fire('Penuh', 'Buku telepon penuh (Maks 10 nomor). Hapus nomor lama terlebih dahulu.', 'warning'); return; }
                    list.push(newPhone);
                    savePhonebook(list);
                    if (!number) { document.getElementById('newPhoneNumber').value = ''; renderPhonebook(); swalDark.fire('Tersimpan', 'Nomor berhasil ditambahkan ke Buku Telepon.', 'success'); }
                }

                function deletePhone(index) { let list = getPhonebook(); list.splice(index, 1); savePhonebook(list); renderPhonebook(); }
                function selectPhone(phone) { document.getElementById('xlPhone').value = phone; resetOtpState(); closePhonebook(); }

                let allPackages = [];
                let currentAuthId = '';
                let currentAccessToken = '';
                
                async function loadPackages() {
                    try {
                        const res = await fetch('/api/kmsp/services');
                        const data = await res.json();
                        if(data.success) {
                            allPackages = data.data || [];
                            renderPackages(allPackages);
                        } else {
                            document.getElementById('packageListContainer').innerHTML = '<div class="p-4 text-center text-cyan-400 text-sm font-bold">' + (data.message || 'Gagal memuat API') + '</div>';
                        }
                    } catch(e) { document.getElementById('packageListContainer').innerHTML = '<div class="p-4 text-center text-cyan-400 text-sm">Error koneksi: ' + e.message + '</div>'; }
                }

                function renderPackages(packagesToRender) {
                    const container = document.getElementById('packageListContainer');
                    const countText = document.getElementById('pkgCount');
                    if (!packagesToRender || packagesToRender.length === 0) {
                        container.innerHTML = '<div class="p-4 text-center text-gray-500 text-sm">-- Tidak ada paket ditemukan --</div>';
                        countText.innerText = 'Total: 0 paket';
                        updateCheckoutUI('', 0, false);
                        return;
                    }
                    container.innerHTML = packagesToRender.map(pkg => {
                        const idStr = pkg.id || pkg.package_code || pkg.service_id;
                        const needOtpStr = pkg.no_need_login ? 'false' : 'true'; 
                        const badge = needOtpStr === 'true' ? '<span class="ml-2 text-[10px] bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-1.5 py-0.5 rounded uppercase font-bold shrink-0">Butuh OTP</span>' : '';
                        const safeNameHTML = pkg.name.replace(/"/g, '&quot;'); 
                        return '<div data-id="' + idStr + '" data-price="' + pkg.price + '" data-otp="' + needOtpStr + '" data-name="' + safeNameHTML + '" onclick="selectPackage(this)" class="package-item w-full flex justify-between items-center p-3 rounded-xl hover:bg-gray-800 cursor-pointer border border-transparent transition"><div class="flex-grow pr-4 flex flex-col sm:flex-row sm:items-center gap-1"><span class="text-sm font-medium text-gray-200">' + safeNameHTML + '</span>' + badge + '</div><span class="text-sm font-mono font-black text-green-400 shrink-0">Rp ' + pkg.price.toLocaleString('id-ID') + '</span></div>';
                    }).join('');
                    countText.innerText = 'Total: ' + packagesToRender.length + ' paket';
                    if(!document.getElementById('xlPackageId').value) updateCheckoutUI('', 0, false);
                }

                function selectPackage(element) {
                    const id = element.getAttribute('data-id');
                    const price = element.getAttribute('data-price');
                    const needOtpStr = element.getAttribute('data-otp');
                    const pkgName = element.getAttribute('data-name');
                    const isNeedOtp = needOtpStr === 'true';
                    
                    document.getElementById('xlPackageId').value = id;
                    document.getElementById('xlPackagePrice').value = price;
                    document.getElementById('xlNeedOtp').value = needOtpStr;
                    document.getElementById('xlPackageName').value = pkgName;
                    
                    document.querySelectorAll('.package-item').forEach(el => { el.classList.remove('bg-sky-950/30', 'border-sky-600/40'); el.classList.add('hover:bg-gray-800'); });
                    element.classList.remove('hover:bg-gray-800'); element.classList.add('bg-sky-950/30', 'border-sky-600/40');

                    const paymentSelect = document.getElementById('xlPaymentMethod');
                    const paymentNotice = document.getElementById('xlPaymentNotice');

                    if (pkgName.includes('[Method E-Wallet]')) {
                        paymentSelect.innerHTML = '<option value="DANA">DANA (Hanya Biaya Admin)</option><option value="GOPAY">GOPAY (Hanya Biaya Admin)</option>';
                        paymentNotice.innerHTML = '*Catatan: Saldo Web Anda HANYA dipotong sebesar Biaya Admin. Harga paket dibayar langsung via Aplikasi DANA/GOPAY.';
                    } else {
                        paymentSelect.innerHTML = '<option value="BALANCE">Saldo Web</option>';
                        if (pkgName.includes('[Method Pulsa]')) paymentNotice.innerHTML = '*Catatan: Pembayaran paket akan <b>memotong PULSA XL</b> Anda secara langsung. Saldo Web Anda HANYA dipotong untuk <b>Biaya Admin</b>.';
                        else paymentNotice.innerHTML = '*Catatan: Saldo Web Anda akan dipotong secara penuh sesuai dengan Harga Jual.';
                    }
                    updateCheckoutUI(id, price, isNeedOtp);
                }

                function updateCheckoutUI(id, price, isNeedOtp) {
                    const btnBuy = document.getElementById('btnBuyXL');
                    const otpSection = document.getElementById('otpSection');
                    const descContainer = document.getElementById('xlDescDisplay');
                    
                    document.getElementById('xlPriceDisplay').innerText = 'Rp ' + parseInt(price).toLocaleString('id-ID');

                    if (!id) {
                        btnBuy.disabled = true; btnBuy.className = 'w-full bg-gray-700 text-gray-400 font-black py-4 rounded-xl shadow-lg transition text-lg mt-4 cursor-not-allowed relative z-20'; btnBuy.innerText = 'PILIH PAKET TERLEBIH DAHULU';
                        otpSection.classList.add('hidden');
                        descContainer.classList.add('hidden');
                        return;
                    }
                    
                    descContainer.classList.remove('hidden');
                    const descText = pkgDescMap[id] || 'Belum ada deskripsi penjelasan untuk paket ini.';
                    let descHtml = '<p class="text-sm text-[#F38020] whitespace-pre-wrap leading-relaxed">' + escapeHtmlClient(descText) + '</p>';
                    if (IS_ADMIN) {
                        descHtml += '<button onclick="editPkgDesc(\\'' + id + '\\')" class="mt-3 text-xs bg-sky-600/20 hover:bg-sky-600/40 text-cyan-400 border border-sky-600/30 px-3 py-1.5 rounded transition font-bold flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Edit Deskripsi Paket</button>';
                    }
                    descContainer.innerHTML = descHtml;

                    if (isNeedOtp) {
                        otpSection.classList.remove('hidden');
                        if (currentAccessToken !== '') {
                            document.getElementById('otpVerifyMode').classList.add('hidden'); document.getElementById('otpManualMode').classList.add('hidden'); document.getElementById('otpSuccessMode').classList.remove('hidden');
                            btnBuy.disabled = false; btnBuy.className = 'w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-lg transition text-lg mt-4 relative z-20'; btnBuy.innerText = 'BELI SEKARANG';
                        } else {
                            document.getElementById('otpVerifyMode').classList.remove('hidden'); document.getElementById('otpManualMode').classList.add('hidden'); document.getElementById('otpSuccessMode').classList.add('hidden');
                            btnBuy.disabled = true; btnBuy.className = 'w-full bg-gray-700 text-gray-400 font-black py-4 rounded-xl shadow-lg transition text-lg mt-4 cursor-not-allowed relative z-20'; btnBuy.innerText = 'VERIFIKASI OTP TERLEBIH DAHULU';
                        }
                    } else {
                        otpSection.classList.add('hidden');
                        btnBuy.disabled = false; btnBuy.className = 'w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-lg transition text-lg mt-4 relative z-20'; btnBuy.innerText = 'BELI SEKARANG (INSTAN)';
                    }
                }
                
                async function editPkgDesc(id) {
                    const pkgName = document.getElementById('xlPackageName').value;
                    const { value: text, isConfirmed } = await swalDark.fire({
                        title: 'Edit Deskripsi Paket',
                        html: '<p class="text-sm text-gray-400 mb-2">' + pkgName + '</p>',
                        input: 'textarea',
                        inputValue: pkgDescMap[id] || '',
                        inputPlaceholder: 'Ketikkan penjelasan / deskripsi paket di sini...',
                        showCancelButton: true,
                        confirmButtonText: 'Simpan ke Database',
                        cancelButtonText: 'Batal'
                    });
                    
                    if (isConfirmed) {
                        const loadingAlert = swalDark.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                        try {
                            const res = await fetch('/api/admin/save-pkg-desc', {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ pkgId: id, description: text })
                            });
                            const data = await res.json();
                            if (data.success) {
                                pkgDescMap[id] = text;
                                updateCheckoutUI(id, document.getElementById('xlPackagePrice').value, document.getElementById('xlNeedOtp').value === 'true');
                                swalDark.fire('Berhasil', 'Deskripsi paket berhasil disimpan!', 'success');
                            } else {
                                swalDark.fire('Gagal', 'Terjadi kesalahan sistem saat menyimpan deskripsi.', 'error');
                            }
                        } catch(e) {
                            swalDark.fire('Error', 'Koneksi API bermasalah.', 'error');
                        }
                    }
                }

                document.getElementById('searchPackage').addEventListener('input', function(e) {
                    const keyword = e.target.value.toLowerCase();
                    const filteredPackages = allPackages.filter(pkg => pkg.name.toLowerCase().includes(keyword));
                    renderPackages(filteredPackages);
                });

                function resetOtpState() {
                    currentAuthId = ''; currentAccessToken = ''; document.getElementById('xlOtpCode').value = '';
                    const isNeedOtp = document.getElementById('xlNeedOtp').value === 'true';
                    if (isNeedOtp && document.getElementById('xlPackageId').value !== '') updateCheckoutUI(document.getElementById('xlPackageId').value, document.getElementById('xlPackagePrice').value, true);
                }

                async function verifySmartOtp() {
                    const phone = document.getElementById('xlPhone').value;
                    if (!phone) return swalDark.fire('Perhatian', 'Isi nomor HP terlebih dahulu!', 'warning');
                    
                    const btn = document.getElementById('btnSmartVerify');
                    btn.disabled = true; btn.innerText = 'Mengecek Sesi API...';
                    try {
                        const res = await fetch('/api/xl/smart-verify', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({phone}) });
                        const data = await res.json();
                        if (data.success) {
                            if (data.needs_otp === false) {
                                currentAccessToken = data.access_token;
                                await swalDark.fire({ icon: 'success', title: 'Sesi XL Ditemukan', text: 'Sesi login lama Anda berhasil diperpanjang. Tidak perlu repot isi OTP lagi!', timer: 3000, showConfirmButton: false });
                                updateCheckoutUI(document.getElementById('xlPackageId').value, document.getElementById('xlPackagePrice').value, true);
                            } else {
                                currentAuthId = data.auth_id;
                                document.getElementById('otpVerifyMode').classList.add('hidden'); document.getElementById('otpManualMode').classList.remove('hidden'); document.getElementById('xlOtpCode').focus();
                            }
                        } else { swalDark.fire('Gagal', data.message, 'error'); }
                    } catch(e) { swalDark.fire('Error', 'Kesalahan jaringan', 'error'); }
                    btn.disabled = false; btn.innerText = '\u{1F6E1}\uFE0F Verifikasi Nomor Ini';
                }

                async function submitManualOtp() {
                    const phone = document.getElementById('xlPhone').value;
                    const otp = document.getElementById('xlOtpCode').value;
                    if (!otp || otp.length < 4) return swalDark.fire('Perhatian', 'Masukkan kode OTP SMS!', 'warning');
                    
                    const btn = document.getElementById('btnSubmitOtp');
                    btn.disabled = true; btn.innerText = 'Cek...';
                    try {
                        const res = await fetch('/api/xl/login-otp', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({phone, authId: currentAuthId, otp}) });
                        const data = await res.json();
                        if (data.success) {
                            currentAccessToken = data.data.access_token;
                            updateCheckoutUI(document.getElementById('xlPackageId').value, document.getElementById('xlPackagePrice').value, true);
                        } else { swalDark.fire('Verifikasi Gagal', data.message, 'error'); }
                    } catch(e) { swalDark.fire('Error', 'Kesalahan jaringan', 'error'); }
                    btn.disabled = false; btn.innerText = 'Kirim';
                }

                async function checkPulsa() {
                    const btn = document.getElementById('btnCheckPulsa');
                    btn.innerHTML = '<svg class="w-4 h-4 animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Mengecek...';
                    btn.disabled = true;
                    try {
                        const res = await fetch('/api/xl/check-balance', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({accessToken: currentAccessToken}) });
                        const data = await res.json();
                        if (data.success) {
                            let quotaHtml = '';
                            if (data.quota && data.quota.quotas && Array.isArray(data.quota.quotas) && data.quota.quotas.length > 0) {
                                quotaHtml = '<div class="mt-4 border-t border-gray-700 pt-3"><h4 class="text-sm font-bold text-cyan-400 mb-3">Detail Paket & Kuota:</h4>';
                                data.quota.quotas.forEach(q => { 
                                    let benefitsHtml = '';
                                    if (q.benefits && Array.isArray(q.benefits)) {
                                        q.benefits.forEach(b => {
                                            benefitsHtml += '<div class="ml-2 mt-1 border-l-2 border-gray-600 pl-3 py-1"><p class="text-xs text-gray-300">' + b.name + '</p><p class="text-[11px] font-mono font-bold text-yellow-400">Sisa: ' + (b.remaining_quota || b.remaining || '-') + ' / ' + (b.quota || b.total || '-') + '</p></div>';
                                        });
                                    }
                                    quotaHtml += '<div class="mb-3 bg-gray-800 p-4 rounded-xl border border-gray-600 shadow-sm"><p class="text-sm font-bold text-white leading-tight">' + (q.name || 'Paket Data') + '</p><p class="text-[11px] text-gray-400 mt-1 mb-2">\u{1F342} Aktif Hingga: ' + (q.expired_at || '-') + '</p>' + benefitsHtml + '</div>'; 
                                });
                                quotaHtml += '</div>';
                            } else { quotaHtml = '<div class="mt-4 border-t border-gray-700 pt-3"><p class="text-xs text-gray-500 text-center py-2">Tidak ada paket/kuota aktif ditemukan.</p></div>'; }

                            let lokasiText = (data.location && data.location.location) ? data.location.location : 'Tidak Terdeteksi';

                            swalDark.fire({
                                html: '<h3 class="text-xl font-bold text-white mb-4 mt-2">Informasi Detail XL Anda</h3><div class="text-left bg-gray-900 p-5 rounded-xl border border-gray-700 max-h-[75vh] overflow-y-auto custom-scrollbar"><div class="space-y-3 text-sm"><p><span class="text-gray-400">Nomor:</span> <span class="font-mono text-white float-right">' + (data.info.msisdn || '-') + '</span></p><p><span class="text-gray-400">Status:</span> <span class="font-bold text-green-400 float-right">' + (data.info.subscription_status || 'Aktif') + '</span></p><p><span class="text-gray-400">Lokasi:</span> <span class="font-bold text-cyan-400 float-right">' + lokasiText + '</span></p><p class="pt-3 border-t border-gray-800"><span class="text-gray-400">Pulsa:</span> <span class="font-mono font-black text-yellow-400 float-right">' + (data.info.pulsa_real || data.info.pulsa || 'Rp 0') + '</span></p><p><span class="text-gray-400">Masa Aktif:</span> <span class="text-gray-200 float-right">' + (data.info.active_until || '-') + '</span></p></div>' + quotaHtml + '</div>',
                                width: '44em',
                                showCloseButton: true,
                                confirmButtonText: 'Tutup'
                            });
                        } else { swalDark.fire('Gagal Cek Pulsa', data.message, 'error'); }
                    } catch(e) { swalDark.fire('Error', 'Gagal memanggil API', 'error'); }
                    btn.disabled = false; btn.innerHTML = '\u{1F4B3} Cek Pulsa, Kuota & Lokasi';
                }

                async function buyXL() {
                    const phone = document.getElementById('xlPhone').value;
                    const serviceId = document.getElementById('xlPackageId').value;
                    const price = parseInt(document.getElementById('xlPackagePrice').value) || 0;
                    const paymentMethod = document.getElementById('xlPaymentMethod').value;
                    const pkgName = document.getElementById('xlPackageName').value;
                    
                    if(!phone || !serviceId) return swalDark.fire('Perhatian', 'Harap isi Nomor HP dan Pilih Paket dari daftar', 'warning');
                    
                    let confirmText = '\\nSaldo Anda akan dipotong Rp ' + price.toLocaleString('id-ID') + ' secara penuh. Lanjutkan?';
                    if (pkgName.includes('[Method Pulsa]')) confirmText = 'Anda memilih paket [Method Pulsa]. Harga paket akan memotong PULSA XL Anda, dan Saldo Web HANYA akan dipotong untuk Biaya Admin. Lanjutkan?';
                    else if (paymentMethod !== 'BALANCE') confirmText = 'Anda memilih metode ' + paymentMethod + '. Saldo Web Anda HANYA akan dipotong untuk Markup/Biaya Admin. Harga paket dibayar langsung di aplikasi ' + paymentMethod + '. Lanjutkan?';

                    const confirm = await swalDark.fire({ title: 'Konfirmasi Pembelian', text: confirmText, icon: 'question', showCancelButton: true });
                    if(!confirm.isConfirmed) return;

                    const btn = document.getElementById('btnBuyXL');
                    btn.disabled = true; btn.innerText = 'Memproses Transaksi...';

                    try {
                        const res = await fetch('/api/buy-xl', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ phone, serviceId, accessToken: currentAccessToken, paymentMethod }) });
                        const data = await res.json();
                        
                        if(data.success) {
                            addNumberToPhonebook(phone);
                            if (data.is_pending_payment) {
                                if (data.payment_data && data.payment_data.deeplink_data && data.payment_data.deeplink_data.deeplink_url) {
                                    swalDark.fire({
                                        title: 'Lanjutkan ke Pembayaran',
                                        html: '<p class="text-sm mb-4">Saldo Web dipotong <b>Rp ' + data.deducted_amount.toLocaleString('id-ID') + '</b> (Biaya Admin).</p><p class="text-sm text-gray-400 mb-4">Klik tombol di bawah untuk membayar harga paket via aplikasi <b>' + paymentMethod + '</b>.</p>',
                                        showConfirmButton: true, confirmButtonText: 'Buka Aplikasi ' + paymentMethod, showCancelButton: true, cancelButtonText: 'Tutup', allowOutsideClick: false
                                    }).then((result) => { if (result.isConfirmed) { window.open(data.payment_data.deeplink_data.deeplink_url, '_blank'); } window.location.reload(); });
                                } else {
                                    await swalDark.fire('Berhasil', 'Pesanan berhasil dibuat. Silakan selesaikan pembayaran via ' + paymentMethod + '. Link tersedia di Inbox Anda.', 'success'); window.location.reload();
                                }
                            } else { await swalDark.fire('Berhasil!', 'Pembelian sukses diproses! Bukti transaksi dikirim ke Inbox.', 'success'); window.location.reload(); }
                        } else { swalDark.fire('Transaksi Gagal', data.message, 'error'); }
                    } catch(e) { swalDark.fire('Error', 'Kesalahan jaringan', 'error'); }
                    btn.disabled = false; btn.innerText = 'BELI SEKARANG';
                }
                loadPackages();
            <\/script>
            `;
      return new Response(renderLayout("Paket Data XL", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/converter" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      return new Response(renderIframePage("Converter Config", "/api/converter-html"), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/api/converter-html" && method === "GET") {
      if (!currentUser) return new Response("Unauthorized", { status: 401 });
      return new Response(renderConverterPage(), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/cekpulsa-otp" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      return new Response(renderIframePage("Cekpulsa / OTP", "/api/cekkuota-html"), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/api/cekkuota-html" && method === "GET") {
      if (!currentUser) return new Response("Unauthorized", { status: 401 });
      return new Response(renderCekKuotaPage(), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/admin" && method === "GET") {
      if (!currentUser || !isSuperAdmin(currentUser, env)) return Response.redirect(url.origin + "/", 302);
      try {
        await env.DB.prepare("ALTER TABLE users ADD COLUMN is_blocked INTEGER DEFAULT 0").run();
      } catch (e) {
      }
      const adminContent = await renderAdminDashboard(env, currentUser, appSettings);
      return new Response(renderLayout("Admin Dashboard", adminContent), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/inbox" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      // Auto-cleanup pesan pending yang fakturnya sudah PAID
      await env.DB.prepare("DELETE FROM inbox WHERE email = ? AND (title LIKE '%[PENDING]%' OR title LIKE '%PENDING%') AND EXISTS (SELECT 1 FROM invoices WHERE invoices.email = inbox.email AND invoices.status = 'PAID' AND inbox.message LIKE '%' || invoices.ref || '%')").bind(currentUser.email).run().catch(() => {});
      await env.DB.prepare("UPDATE inbox SET read = 1 WHERE email = ? AND read = 0").bind(currentUser.email).run();
      const inboxPage = parseInt(url.searchParams.get("page") || "1");
      const inboxLimit = 10;
      const inboxOffset = (inboxPage - 1) * inboxLimit;
      const totalInbox = await env.DB.prepare(
        "SELECT COUNT(*) as count FROM inbox WHERE email = ?"
      ).bind(currentUser.email).first("count") || 0;
      const totalPages = Math.ceil(totalInbox / inboxLimit) || 1;
      const { results: inboxResults } = await env.DB.prepare(
        "SELECT * FROM inbox WHERE email = ? ORDER BY id DESC LIMIT ? OFFSET ?"
      ).bind(currentUser.email, inboxLimit, inboxOffset).all();
      let inboxHtml = `<div class="text-center py-16 bg-gray-800 rounded-3xl border border-gray-700 relative z-10"><p class="text-gray-400 text-lg">Belum ada pesan di kotak masuk Anda.</p></div>`;
      let pendingRefs = [];
      if (inboxResults && inboxResults.length > 0) {
        inboxHtml = inboxResults.map((msg) => {
          let msgBody = msg.message;
          const refMatch = msgBody.match(/(AGP[A-Z0-9\-]+)/);
          if (msg.title.includes("[PENDING]") && refMatch) {
            pendingRefs.push(refMatch[1]);
            if (!msgBody.includes("checkInboxPayment")) {
              msgBody += `<div style="text-align: center; margin-top: 20px;"><button onclick="checkInboxPayment('${refMatch[1]}', true)" class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-lg inline-flex items-center gap-2 cursor-pointer border border-green-400/30 hover:scale-105"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 🔍 Cek Status Pembayaran</button><div class="mt-2 text-xs text-yellow-400/80 font-mono flex items-center justify-center gap-1.5"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span></span> Deteksi live aktif di latar belakang...</div></div>`;
            }
          }
          return `<div class="bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-700 shadow-xl mb-6 hover:border-sky-600/50 transition relative z-10"><div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b border-gray-700 pb-4 gap-2"><h3 class="text-xl font-bold text-cyan-400 leading-snug">${msg.title}</h3><span class="text-xs font-mono text-gray-500 bg-gray-900 px-3 py-1.5 rounded-lg shrink-0">${msg.date}</span></div><div class="text-gray-300 text-sm md:text-base leading-relaxed break-words">${msgBody}</div></div>`;
        }).join("");
        if (totalPages > 1) {
          inboxHtml += `
                    <div class="mt-8 flex items-center justify-between gap-4 flex-wrap bg-gray-800 p-4 border border-gray-700 rounded-2xl relative z-10">
                        <a href="${inboxPage > 1 ? `/inbox?page=${inboxPage - 1}` : "#"}" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${inboxPage <= 1 ? "opacity-50 pointer-events-none" : ""}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg> Sebelum
                        </a>
                        <span class="text-xs text-gray-400 font-medium">Halaman ${inboxPage} dari ${totalPages} (Total ${totalInbox} Pesan)</span>
                        <a href="${inboxPage < totalPages ? `/inbox?page=${inboxPage + 1}` : "#"}" class="bg-gray-900 hover:bg-gray-850 border border-gray-750 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${inboxPage >= totalPages ? "opacity-50 pointer-events-none" : ""}">
                            Berikut <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </div>`;
        }
      }
      const content = `<div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10"><h1 class="text-3xl font-black text-white mb-8 tracking-tight">Kotak Masuk (Inbox)</h1>${inboxHtml}</div>
      <script>
      function playSuccessChime() {
          try {
              const AudioCtx = window.AudioContext || window.webkitAudioContext;
              if (!AudioCtx) return;
              const ctx = new AudioCtx();
              const now = ctx.currentTime;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(523.25, now);
              osc.frequency.setValueAtTime(659.25, now + 0.1);
              osc.frequency.setValueAtTime(783.99, now + 0.2);
              osc.frequency.setValueAtTime(1046.50, now + 0.3);
              gain.gain.setValueAtTime(0.2, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + 0.8);
          } catch(e) {}
      }

      let isInboxChecking = false;
      async function checkInboxPayment(ref, isManual = false) {
          if (!ref || isInboxChecking) return;
          isInboxChecking = true;
          if (isManual) {
              swalDark.fire({
                  title: 'Memeriksa Pembayaran...',
                  text: 'Sedang mengecek status ke server & gateway...',
                  allowOutsideClick: false,
                  didOpen: () => { swalDark.showLoading(); }
              });
          }
          try {
              const res = await fetch('/api/check-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ref: ref })
              });
              const data = await res.json();
              if (data.success && data.status === 'PAID') {
                  playSuccessChime();
                  await swalDark.fire({
                      title: 'Pembayaran Berhasil! 🎉',
                      text: 'Pembayaran terverifikasi! Saldo akun Anda telah ditambahkan dan tagihan ini telah lunas.',
                      icon: 'success',
                      confirmButtonText: 'OK',
                      confirmButtonColor: '#22c55e'
                  });
                  window.location.reload();
                  return;
              } else if (isManual) {
                  swalDark.fire('Belum Terdeteksi', data.message || 'Pembayaran belum terdeteksi. Pastikan Anda telah mentransfer tepat sejumlah tagihan.', 'info');
              }
          } catch(e) {
              if (isManual) swalDark.fire('Error', 'Gagal menghubungi server.', 'error');
          }
          isInboxChecking = false;
      }

      const pendingList = ${JSON.stringify(pendingRefs)};
      if (pendingList && pendingList.length > 0) {
          setInterval(async () => {
              for (const r of pendingList) {
                  await checkInboxPayment(r, false);
              }
          }, 3500);
      }
      <\/script>`;
      return new Response(renderLayout("Inbox", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/lisensi" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      const content = await renderLicensePage(env, currentUser, appSettings, url);
      return new Response(renderLayout("Lisensi Script", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/profil" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      const content = `
            <div class="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
                <h1 class="text-3xl font-black text-white mb-8 border-b border-gray-800 pb-4 tracking-tight">Profil Saya</h1>
                <div class="bg-gray-800 p-6 md:p-10 rounded-3xl border border-gray-700 shadow-2xl">
                    <div class="flex flex-col items-center mb-8 border-b border-gray-700 pb-6">
                        ${currentUser.picture ? `
                            <img src="${currentUser.picture}" alt="${escapeHTML(currentUser.name)}" class="w-20 h-20 rounded-full object-cover shadow-2xl border-2 border-sky-500/50 mb-3" referrerpolicy="no-referrer">
                        ` : `
                            <div class="w-20 h-20 rounded-full bg-sky-600 flex items-center justify-center font-bold text-white text-2xl uppercase shadow-2xl mb-3">${currentUser.name.charAt(0)}</div>
                        `}
                        <h2 class="text-lg font-bold text-white">${escapeHTML(currentUser.name)}</h2>
                        <p class="text-xs text-gray-500 font-mono mt-1">${currentUser.email}</p>
                    </div>
                    <form id="profileForm" class="space-y-6">
                        <div><label class="block text-sm font-bold tracking-wide text-gray-400 mb-2 uppercase">Email Akun (Terkunci)</label><input type="email" value="${currentUser.email}" disabled class="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-500 cursor-not-allowed font-medium"></div>
                        <div><label class="block text-sm font-bold tracking-wide text-gray-400 mb-2 uppercase">Nama Lengkap</label><input type="text" id="profileName" value="${escapeHTML(currentUser.name)}" required class="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition font-medium"></div>
                        <div><label class="block text-sm font-bold tracking-wide text-gray-400 mb-2 uppercase">Nomor WhatsApp / XL Tersimpan</label><input type="text" id="profilePhone" value="${currentUser.phone || ""}" placeholder="Contoh: 081234567890" class="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition font-medium"></div>
                        <div class="pt-4"><button type="submit" id="btnUpdateProfile" class="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 px-4 rounded-xl transition shadow-lg text-lg tracking-wide">Simpan Perubahan</button></div>
                    </form>
                    <div class="mt-8 pt-6 border-t border-gray-700">
                        <button onclick="logout()" type="button" class="w-full bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-500/30 hover:border-sky-500 font-bold py-4 rounded-xl transition shadow-lg text-lg tracking-wide flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar Akun
                        </button>
                    </div>
                </div>
            </div>
            <script>
                document.getElementById('profileForm').addEventListener('submit', async (e) => {
                    e.preventDefault(); const btn = document.getElementById('btnUpdateProfile'); const name = document.getElementById('profileName').value; const phone = document.getElementById('profilePhone').value; btn.innerText = 'Menyimpan...'; btn.disabled = true;
                    try { const res = await fetch('/api/update-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone }) }); if((await res.json()).success) { swalDark.fire('Berhasil', 'Profil berhasil diperbarui!', 'success').then(() => window.location.reload()); } else { swalDark.fire('Gagal', 'Gagal menyimpan profil.', 'error'); btn.disabled = false; } } catch(err) { swalDark.fire('Error', 'Terjadi kesalahan.', 'error'); btn.disabled = false; }
                });
            <\/script>
            `;
      return new Response(renderLayout("Profil Saya", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/syarat-ketentuan" && method === "GET") {
      const content = `<div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10"><h1 class="text-3xl md:text-5xl font-black text-white mb-10 border-b border-gray-800 pb-6 tracking-tight">Syarat & Ketentuan</h1><div class="space-y-10 text-gray-300 leading-relaxed bg-gray-800 p-8 md:p-12 rounded-3xl border border-gray-700 shadow-2xl text-lg"><section><h2 class="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><div class="w-2 h-8 bg-sky-500 rounded-full"></div> Penggunaan Layanan (AUP)</h2><p class="mb-3 text-gray-400">Anda <strong>DILARANG KERAS</strong> menggunakan layanan VPN untuk: Peretasan, Penipuan finansial, atau Serangan DDoS.</p></section><section><h2 class="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><div class="w-2 h-8 bg-sky-500 rounded-full"></div> Saldo & Refund</h2><p class="text-gray-400">Transaksi final. Tidak ada refund setelah VPN/Paket berstatus Aktif.</p></section></div></div>`;
      return new Response(renderLayout("Syarat & Ketentuan", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/kontak" && method === "GET") {
      const content = `<div class="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10"><h1 class="text-3xl md:text-5xl font-black text-white mb-6 text-center tracking-tight">Pusat Bantuan CS</h1><p class="text-gray-400 text-center mb-12 text-lg">Kami siap membantu menyelesaikan kendala jaringan, aplikasi, dan status top-up.</p><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><a href="https://wa.me/6282175037525" target="_blank" class="bg-gray-800 p-10 rounded-[2rem] border border-gray-700 hover:border-green-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] transition-all text-center"><h2 class="text-2xl md:text-3xl font-black text-white mb-2">WhatsApp</h2><p class="text-green-400 font-mono text-xl md:text-lg lg:text-xl">0821 7503 7525</p></a><a href="https://t.me/srpcomadmin" target="_blank" class="bg-gray-800 p-10 rounded-[2rem] border border-gray-700 hover:border-sky-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all text-center"><h2 class="text-2xl md:text-3xl font-black text-white mb-2">Telegram</h2><p class="text-cyan-400 font-mono text-xl md:text-lg lg:text-xl">@srpcomadmin</p></a><a href="mailto:admin@warungpulsa.com" class="bg-gray-800 p-10 rounded-[2rem] border border-gray-700 hover:border-pink-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)] transition-all text-center flex flex-col justify-center"><h2 class="text-2xl md:text-3xl font-black text-white mb-2">Email</h2><p class="text-pink-400 font-mono text-lg md:text-base lg:text-lg truncate">admin@warungpulsa.com</p></a></div></div>`;
      return new Response(renderLayout("Kontak CS", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/mutasi" && method === "GET") {
      if (!currentUser) return Response.redirect(url.origin + "/", 302);
      const content = renderMutasiPage(currentUser);
      return new Response(renderLayout("Riwayat Saldo", content), { headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }
    if (path === "/api/transactions" && method === "GET") {
      return await handleMutasiAPI(request, env, currentUser);
    }
    if (path === "/api/ticket/create" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { category, subject, message } = await request.json();
        const ticketId = "TCK-" + Math.floor(1e4 + Math.random() * 9e4);
        const now = getWIBTime();
        await env.DB.prepare("INSERT INTO tickets (id, email, subject, category, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'OPEN', ?, ?)").bind(ticketId, currentUser.email, subject, category, now, now).run();
        await env.DB.prepare("INSERT INTO ticket_replies (ticket_id, sender_type, message, created_at) VALUES (?, 'user', ?, ?)").bind(ticketId, message, now).run();
        if (sendTelegramLog) await sendTelegramLog(`\u{1F3AB} TIKET BARU [${ticketId}]`, `User: ${currentUser.email}
Kategori: ${category}
Judul: ${subject}

Pesan:
${message}`, appSettings);
        return jsonResponse({ success: true, ticketId });
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/ticket/view" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { ticketId } = await request.json();
        const ticket = await env.DB.prepare("SELECT * FROM tickets WHERE id = ? AND email = ?").bind(ticketId, currentUser.email).first();
        if (!ticket) throw new Error("Tiket tidak ditemukan.");
        const { results: replies } = await env.DB.prepare("SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY id ASC").bind(ticketId).all();
        return jsonResponse({ success: true, ticket, replies: replies || [] });
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/ticket/reply" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { ticketId, message } = await request.json();
        const ticket = await env.DB.prepare("SELECT * FROM tickets WHERE id = ? AND email = ?").bind(ticketId, currentUser.email).first();
        if (!ticket || ticket.status === "CLOSED") throw new Error("Tiket tidak valid atau sudah ditutup.");
        const now = getWIBTime();
        await env.DB.prepare("INSERT INTO ticket_replies (ticket_id, sender_type, message, created_at) VALUES (?, 'user', ?, ?)").bind(ticketId, message, now).run();
        await env.DB.prepare("UPDATE tickets SET status = 'OPEN', updated_at = ? WHERE id = ?").bind(now, ticketId).run();
        if (sendTelegramLog) await sendTelegramLog(`\u{1F4AC} BALASAN TIKET [${ticketId}]`, `User: ${currentUser.email}

Pesan:
${message}`, appSettings);
        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/ticket/close" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { ticketId } = await request.json();
        const ticket = await env.DB.prepare("SELECT * FROM tickets WHERE id = ? AND email = ?").bind(ticketId, currentUser.email).first();
        if (!ticket) throw new Error("Tiket tidak ditemukan.");
        const now = getWIBTime();
        await env.DB.prepare("UPDATE tickets SET status = 'CLOSED', updated_at = ? WHERE id = ?").bind(now, ticketId).run();
        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/auth" && method === "POST") {
      try {
        const { credential } = await request.json();
        const payload = await (await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`)).json();
        if (payload.aud !== GOOGLE_CLIENT_ID) return jsonResponse({ success: false, message: "Invalid Client ID" }, 400);
        let isNewUser = false;
        let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(payload.email).first();
        if (!user) {
          isNewUser = true;
          await env.DB.prepare("INSERT INTO users (email, name, phone, balance, picture) VALUES (?, ?, '', 0, ?)").bind(payload.email, payload.name, payload.picture).run();
        } else {
          if (user.is_blocked === 1) {
            if (isSuperAdmin(payload.email, env)) {
              await env.DB.prepare("UPDATE users SET is_blocked = 0 WHERE email = ?").bind(payload.email).run();
            } else {
              return jsonResponse({ success: false, message: "Akun diblokir." }, 403);
            }
          }
          await env.DB.prepare("UPDATE users SET name = ?, picture = ? WHERE email = ?").bind(payload.name, payload.picture, payload.email).run();
        }
        const newSessionId = crypto.randomUUID();
        await env.DB.prepare("INSERT INTO sessions (id, email, expires_at) VALUES (?, ?, datetime('now', '+7 days'))").bind(newSessionId, payload.email).run();
        await sendTelegramLog("\u{1F464} LOG LOGIN AKUN", `Email: ${payload.email}
Nama: ${payload.name}
Waktu: ${getWIBTime()}`, appSettings);
        if (isNewUser) {
          const welcomeSubject = "Selamat Datang di Warung Pulsa!";
          const welcomeBody = `<p>Halo <b>${escapeHTML(payload.name)}</b>,</p>
                                         <p>Terima kasih telah bergabung! Akun Anda berhasil didaftarkan di platform <b>Warung Pulsa</b>.</p>
                                         <p>Kami hadir memberikan solusi proxy dan VPN premium dengan kecepatan terbaik serta dukungan berbagai protokol jaringan canggih. Anda sekarang sudah memiliki akses penuh ke Dashboard untuk:</p>
                                         <ul>
                                            <li>Mengisi saldo secara otomatis via QRIS</li>
                                            <li>Membangun server VPN baru hanya dalam hitungan detik</li>
                                            <li>Melakukan pengisian Paket Data XL/Axis</li>
                                         </ul>
                                         <p>Mulai pengalaman berinternet tanpa batas bersama kami hari ini.</p>
                                         <div style="text-align: center;"><a href="https://${url.hostname}/" class="btn">Masuk ke Dashboard Utama</a></div>`;
          ctx.waitUntil(sendEmailViaGAS(payload.email, welcomeSubject, buildEmailTemplate("Selamat Datang, " + escapeHTML(payload.name) + "!", welcomeBody), env));
        } else {
          const loginSubject = "Notifikasi Login Baru pada Akun Anda";
          const loginBody = `<p>Halo <b>${escapeHTML(payload.name)}</b>,</p>
                                       <p>Sistem kami mendeteksi aktivitas login yang baru saja berhasil dilakukan ke akun Warung Pulsa Anda.</p>
                                       <table class="info-table">
                                           <tr><td>Waktu Akses</td><td>${getWIBTime()}</td></tr>
                                           <tr><td>Alamat Email</td><td>${escapeHTML(payload.email)}</td></tr>
                                           <tr><td>IP Pengakses</td><td>${request.headers.get("cf-connecting-ip") || "IP Tersembunyi"}</td></tr>
                                       </table>
                                       <p>Apabila ini adalah Anda, maka tidak ada tindakan yang perlu dilakukan. Namun, apabila Anda merasa <b>tidak melakukan aktivitas login ini</b>, mohon segera hubungi Administrator kami (CS) untuk mengamankan akun dan saldo dompet Anda.</p>`;
          ctx.waitUntil(sendEmailViaGAS(payload.email, loginSubject, buildEmailTemplate("Aktivitas Login Baru", loginBody), env));
        }
        return new Response(JSON.stringify({ success: true }), { headers: { "Set-Cookie": `session_id=${newSessionId}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`, "Content-Type": "application/json" } });
      } catch (e) {
        return jsonResponse({ success: false }, 500);
      }
    }
    if (path === "/api/logout" && method === "POST") {
      if (sessionId) await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
      return new Response(JSON.stringify({ success: true }), { headers: { "Set-Cookie": `session_id=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`, "Content-Type": "application/json" } });
    }
    if (path === "/api/update-profile" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { name, phone } = await request.json();
        if (!name) return jsonResponse({ success: false }, 400);
        await env.DB.prepare("UPDATE users SET name = ?, phone = ? WHERE email = ?").bind(name, phone || "", currentUser.email).run();
        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ success: false }, 500);
      }
    }
    if (path === "/api/phonebook" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        try {
          await env.DB.prepare("ALTER TABLE users ADD COLUMN phonebook TEXT DEFAULT '[]'").run();
        } catch (e) {
        }
        const { phonebook } = await request.json();
        await env.DB.prepare("UPDATE users SET phonebook = ? WHERE email = ?").bind(JSON.stringify(phonebook), currentUser.email).run();
        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/topup" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const nowTs = Date.now();
        const { results: unpaidInvoices } = await env.DB.prepare("SELECT * FROM invoices WHERE email = ? AND status = 'UNPAID'").bind(currentUser.email).all();
        const validUnpaid = [];
        if (unpaidInvoices) {
          for (const inv of unpaidInvoices) {
            const invTs = parseWIBDateString(inv.date);
            if (invTs > 0 && nowTs - invTs > 36e5) continue;
            validUnpaid.push(inv);
          }
        }
        currentUser.unpaid_invoices = validUnpaid;
        const unpaidCount = currentUser.unpaid_invoices ? currentUser.unpaid_invoices.length : 0;
        if (unpaidCount >= 3) return jsonResponse({ success: false, message: "Terlalu banyak tagihan UNPAID. Harap lunasi atau tunggu 1 jam hingga tagihan sebelumnya kadaluarsa otomatis." }, 400);
        const { amount, method: selectedMethod } = await request.json();
        if (typeof amount !== "number" || isNaN(amount) || amount < 1e3 || amount > 1e7 || !Number.isInteger(amount)) {
          return jsonResponse({ success: false, message: "Nominal top up tidak valid. Minimal Rp 1.000 dan Maksimal Rp 10.000.000." }, 400);
        }
        if (selectedMethod === "shopeepay" || selectedMethod === "auto") {
          const uniqueCode = Math.floor(Math.random() * 99) + 1;
          const nominalUnik = amount + uniqueCode;
          const refKode = "AGPSHOPEE-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
          const tx = await createShopeePayTransaction(env, appSettings, nominalUnik);
          if (tx.success) {
            await env.DB.prepare("INSERT INTO invoices (ref, email, amount, status, date) VALUES (?, ?, ?, 'UNPAID', ?)").bind(refKode, currentUser.email, nominalUnik, getWIBTime()).run();
            const qrDisplay = tx.qr_url || ("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(tx.qr_string || ''));
            const pendingMsg = `Halo! Anda telah membuat permintaan Top Up Saldo via ShopeePay sebesar <b class="text-green-400">Rp ${nominalUnik.toLocaleString("id-ID")}</b> (Termasuk kode unik Rp ${uniqueCode}).<br><br>Silakan scan QRIS ShopeePay di bawah ini sebelum batas waktu habis (Maksimal 15 Menit):<br><br><div style="text-align: center; margin: 15px 0;"><img src="${qrDisplay}" alt="QRIS ShopeePay" style="max-width:220px;border-radius:12px;margin:auto;display:block;border:1px solid #374151;"></div><br><span style="font-size:10px;color:#6b7280;">No. Ref: ${refKode}</span><div style="text-align: center; margin-top: 20px;"><button onclick="checkInboxPayment('${refKode}', true)" class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-lg inline-flex items-center gap-2 cursor-pointer border border-green-400/30 hover:scale-105"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 🔍 Cek Status Pembayaran</button><div class="mt-2 text-xs text-yellow-400/80 font-mono flex items-center justify-center gap-1.5"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span></span> Deteksi live aktif di latar belakang...</div></div>`;
            await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(currentUser.email, `[PENDING] Top Up Saldo`, pendingMsg, getWIBTime()).run();
            ctx.waitUntil(sendTelegramLog("🧾 LOG CREATE TOP UP", `User <b>${currentUser.email}</b> membuat tagihan Top Up Saldo.

Nominal: Rp ${nominalUnik.toLocaleString("id-ID")} (Termasuk Kode Unik Rp ${uniqueCode})
Metode: ShopeePay (AutoGoPay)
Ref: ${refKode}
Status: UNPAID PENDING`, appSettings));
            return jsonResponse({
              success: true,
              method: "shopeepay",
              ref: refKode,
              amount,
              unique_code: uniqueCode,
              total_amount: nominalUnik,
              order_sn: tx.order_sn,
              qr_url: tx.qr_url,
              qr_raw: tx.qr_string
            });
          } else {
            return jsonResponse({ success: false, message: tx.message }, 400);
          }
        }
        if (selectedMethod === "gopay" || (selectedMethod === "auto" && appSettings.payment_gopay)) {
          const uniqueCode = Math.floor(Math.random() * 99) + 1;
          const nominalUnik = amount + uniqueCode;
          const refKode = "AGPGOPAY-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
          const tx = await createGoPayTransaction(env, appSettings, nominalUnik);
          if (tx.success) {
            await env.DB.prepare("INSERT INTO invoices (ref, email, amount, status, date) VALUES (?, ?, ?, 'UNPAID', ?)").bind(refKode, currentUser.email, nominalUnik, getWIBTime()).run();
            const qrDisplay = tx.qr_url || ("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(tx.qr_string || ''));
            const pendingMsg = `Halo! Anda telah membuat permintaan Top Up Saldo via GoPay sebesar <b class="text-green-400">Rp ${nominalUnik.toLocaleString("id-ID")}</b> (Termasuk kode unik Rp ${uniqueCode}).<br><br>Silakan scan QRIS GoPay di bawah ini sebelum batas waktu habis (Maksimal 15 Menit):<br><br><div style="text-align: center; margin: 15px 0;"><img src="${qrDisplay}" alt="QRIS GoPay" style="max-width:220px;border-radius:12px;margin:auto;display:block;border:1px solid #374151;"></div><br><span style="font-size:10px;color:#6b7280;">No. Ref: ${refKode}</span><div style="text-align: center; margin-top: 20px;"><button onclick="checkInboxPayment('${refKode}', true)" class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl text-sm transition shadow-lg inline-flex items-center gap-2 cursor-pointer border border-green-400/30 hover:scale-105"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 🔍 Cek Status Pembayaran</button><div class="mt-2 text-xs text-yellow-400/80 font-mono flex items-center justify-center gap-1.5"><span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span></span> Deteksi live aktif di latar belakang...</div></div>`;
            await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(currentUser.email, `[PENDING] Top Up Saldo`, pendingMsg, getWIBTime()).run();
            ctx.waitUntil(sendTelegramLog("🧾 LOG CREATE TOP UP", `User <b>${currentUser.email}</b> membuat tagihan Top Up Saldo.

Nominal: Rp ${nominalUnik.toLocaleString("id-ID")} (Termasuk Kode Unik Rp ${uniqueCode})
Metode: GoPay (AutoGoPay)
Ref: ${refKode}
Status: UNPAID PENDING`, appSettings));
            return jsonResponse({
              success: true,
              method: "gopay",
              ref: refKode,
              amount,
              unique_code: uniqueCode,
              total_amount: nominalUnik,
              transaction_id: tx.transaction_id,
              checkout_url: tx.checkout_url,
              qr_url: tx.qr_url,
              qr_raw: tx.qr_string
            });
          } else {
            return jsonResponse({ success: false, message: tx.message }, 400);
          }
        }
        return jsonResponse({ success: false, message: "Metode pembayaran tidak valid atau sedang dinonaktifkan." }, 400);
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/buy" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { serverId, protocol, duration, customUsername } = await request.json();
        const isTrial = duration === "trial";
        const days = isTrial ? 0 : parseInt(duration);
        if (!isTrial && ![10, 20, 30, 60, 90].includes(days)) throw new Error("Durasi tidak valid.");
        if (isTrial && !isSuperAdmin(currentUser, env)) {
          const todayDateStr = getWIBDateOnly();
          const trialCount = await env.DB.prepare("SELECT COUNT(*) as count FROM vpns WHERE email = ? AND exp = '1 Jam' AND date LIKE ?").bind(currentUser.email, `${todayDateStr}%`).first("count");
          if (trialCount >= 3) return jsonResponse({ success: false, message: "Batas Klaim Tercapai! Anda maksimal hanya dapat membuat 3 akun TRIAL dalam sehari." }, 400);
        }
        const targetServer = appSettings.servers.find((s) => s.id === serverId);
        if (!targetServer) return jsonResponse({ success: false, message: "Server tidak ditemukan." }, 400);
        let username = customUsername ? customUsername.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : `wp${Math.floor(1e3 + Math.random() * 9e3)}`;
        if (username.length === 0) username = `wp${Math.floor(1e3 + Math.random() * 9e3)}`;
        if (username.length > 15) username = username.substring(0, 15);
        const password = crypto.randomUUID().split("-")[0];
        const price = isTrial ? 0 : days * appSettings.price_per_day;
        if (price > 0) {
          const deductBalance = await env.DB.prepare("UPDATE users SET balance = balance - ? WHERE email = ? AND balance >= ?").bind(price, currentUser.email, price).run();
          if (deductBalance.meta.changes === 0) return jsonResponse({ success: false, message: "Saldo tidak mencukupi." }, 400);
          await catatMutasi(env, currentUser.email, "OUT", price, `Pembuatan VPN Baru (${protocol.toUpperCase()}) - Akun: ${username} | Server: ${targetServer.name}`);
        }
        try {
          const vpnMap = {
            "ssh": { ep: isTrial ? "/srpcom/trial-ssh" : "/srpcom/add-ssh", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, password, exp: String(days), limit_ip: "2" } },
            "vlessws": { ep: isTrial ? "/srpcom/trial-vlessws" : "/srpcom/add-vlessws", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, exp: String(days), limit_quota: "0", limit_ip: "2" } },
            "trojanws": { ep: isTrial ? "/srpcom/trial-trojanws" : "/srpcom/add-trojanws", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, exp: String(days), limit_quota: "0", limit_ip: "2" } },
            "vmessws": { ep: isTrial ? "/srpcom/trial-vmessws" : "/srpcom/add-vmessws", pl: isTrial ? { exp: "1", limit_ip: "2" } : { user: username, exp: String(days), limit_quota: "0", limit_ip: "2" } },
            "l2tp": { ep: "/srpcom/add-l2tp", pl: isTrial ? { user: `trial${Math.floor(1e3 + Math.random() * 9e3)}`, password, exp: "1" } : { user: username, password, exp: String(days) } }
          };
          if (!vpnMap[protocol]) throw new Error("Protokol tidak didukung");
          let apiEndpoint = vpnMap[protocol].ep;
          let payload = vpnMap[protocol].pl;
          if (isTrial && protocol === "l2tp") username = payload.user;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15e3);
          let vpsRes;
          try {
            const vpsReq = await fetch(targetServer.host + apiEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
              body: JSON.stringify(payload),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!vpsReq.ok) throw new Error(`Koneksi VPS Gagal (${vpsReq.status}).`);
            vpsRes = await vpsReq.json();
          } catch (fetchErr) {
            clearTimeout(timeoutId);
            if (fetchErr.name === "AbortError") {
              throw new Error("Koneksi VPS Timeout (>15 detik). Pembuatan VPN dibatalkan.");
            }
            throw fetchErr;
          }
          let configText = vpsRes.detail?.stdout || vpsRes.stdout || "";
          if (!configText) throw new Error("Detail config kosong dari VPS.");
          if (configText.toLowerCase().includes("already exist") || configText.toLowerCase().includes("choose another name")) {
            throw new Error(`Username '${username}' sudah terpakai.`);
          }
          let actualUsername = username;
          if (isTrial && protocol !== "l2tp") {
            const match = configText.match(/Username\s*:\s*([^\s<]+)/i) || configText.match(/User\s*:\s*([^\s<]+)/i) || configText.match(/Account\s*:\s*([^\s<]+)/i);
            actualUsername = match ? match[1] : `Trial-${Math.floor(1e3 + Math.random() * 9e3)}`;
          }
          const now = getWIBTime();
          const titleInbox = `[${protocol.toUpperCase()}] Pesanan Server ${isTrial ? "TRIAL " : ""}Sukses!`;
          const bodyMsg = `Halo! Ini adalah detail konfigurasi server VPN Anda:<br><br><div class="bg-gray-950 p-4 rounded-lg overflow-x-auto custom-scrollbar border border-gray-800"><pre class="text-green-400 font-mono text-[11px] leading-relaxed select-all whitespace-pre-wrap">${configText}</pre></div>`;
          await env.DB.prepare("INSERT INTO vpns (email, server, protocol, username, date, exp) VALUES (?, ?, ?, ?, ?, ?)").bind(currentUser.email, targetServer.name, protocol.toUpperCase(), actualUsername, now, isTrial ? "1 Jam" : days + " Hari").run();
          await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(currentUser.email, titleInbox, bodyMsg, now).run();
          ctx.waitUntil(sendTelegramLog(`\u{1F680} ${titleInbox}`, `User: ${currentUser.email}
Username VPN: ${actualUsername}
Server: ${targetServer.name}
Durasi: ${isTrial ? "TRIAL (1 Jam)" : days + " Hari"}
 
Detail:
${configText}`, appSettings));
          const emailSubject = `Pesanan VPN Server ${isTrial ? "TRIAL " : ""}Berhasil Dibuat`;
          const emailBody = `<p>Terima kasih atas pesanan Anda. Sistem kami telah berhasil membangun jaringan server <b>${protocol.toUpperCase()}</b> Anda.</p>
                                       <table class="info-table">
                                           <tr><td>Username Akun</td><td>${actualUsername}</td></tr>
                                           <tr><td>Protokol Jaringan</td><td>${protocol.toUpperCase()}</td></tr>
                                           <tr><td>Lokasi Server</td><td>${targetServer.name}</td></tr>
                                           <tr><td>Masa Aktif</td><td>${isTrial ? "1 Jam (Mode Trial)" : days + " Hari"}</td></tr>
                                           <tr><td>Waktu Pembuatan</td><td>${now}</td></tr>
                                       </table>
                                       <p>Berikut ini adalah data konfigurasi lengkap Anda yang sudah terenkripsi dan siap disalin ke dalam aplikasi VPN Client pilihan Anda:</p>
                                       <div class="config-box">${configText}</div>
                                       <p>Jaga kerahasiaan konfigurasi ini dan gunakan secara bertanggung jawab sesuai Kebijakan Layanan kami.</p>`;
          ctx.waitUntil(sendEmailViaGAS(currentUser.email, emailSubject, buildEmailTemplate("Pesanan VPN Dikonfirmasi", emailBody), env));
          return jsonResponse({ success: true });
        } catch (err) {
          if (price > 0) {
            await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(price, currentUser.email).run();
            await catatMutasi(env, currentUser.email, "IN", price, `Refund Pembelian VPN Gagal (${protocol.toUpperCase()})`);
          }
          throw err;
        }
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/renew" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { vpnId, duration } = await request.json();
        const days = parseInt(duration);
        const vpnRecord = await env.DB.prepare("SELECT * FROM vpns WHERE id = ? AND email = ?").bind(vpnId, currentUser.email).first();
        if (!vpnRecord) throw new Error("Data VPN tidak ditemukan.");
        const price = days * appSettings.price_per_day;
        const deductBalance = await env.DB.prepare("UPDATE users SET balance = balance - ? WHERE email = ? AND balance >= ?").bind(price, currentUser.email, price).run();
        if (deductBalance.meta.changes === 0) return jsonResponse({ success: false, message: "Saldo tidak mencukupi." }, 400);
        await catatMutasi(env, currentUser.email, "OUT", price, `Perpanjang VPN (${vpnRecord.username}) - ${days} Hari`);
        try {
          const targetServer = appSettings.servers.find((s) => s.name === vpnRecord.server);
          if (!targetServer) throw new Error("Server tidak ditemukan.");
          let apiEndpoint = "";
          let protocolStr = vpnRecord.protocol.toLowerCase();
          if (protocolStr.includes("ssh")) apiEndpoint = "/srpcom/renew-ssh";
          else if (protocolStr.includes("vless")) apiEndpoint = "/srpcom/renew-vlessws";
          else if (protocolStr.includes("vmess")) apiEndpoint = "/srpcom/renew-vmessws";
          else if (protocolStr.includes("trojan")) apiEndpoint = "/srpcom/renew-trojanws";
          else if (protocolStr.includes("l2tp")) apiEndpoint = "/srpcom/renew-l2tp";
          else throw new Error("Protokol tidak support.");
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15e3);
          let vpsRes;
          try {
            const vpsReq = await fetch(targetServer.host + apiEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
              body: JSON.stringify({ user: vpnRecord.username, exp: String(days) }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!vpsReq.ok) throw new Error(`API Gagal (${vpsReq.status}).`);
            vpsRes = await vpsReq.json();
          } catch (fetchErr) {
            clearTimeout(timeoutId);
            if (fetchErr.name === "AbortError") {
              throw new Error("Koneksi VPS Timeout (>15 detik). Perpanjangan VPN dibatalkan.");
            }
            throw fetchErr;
          }
          let configText = vpsRes.detail?.stdout || vpsRes.stdout || "";
          if (configText.toLowerCase().includes("not found") || configText.toLowerCase().includes("tidak ditemukan")) {
            throw new Error(`Akun '${vpnRecord.username}' tidak ditemukan di VPS.`);
          }
          const now = getWIBTime();
          await env.DB.prepare("UPDATE vpns SET exp = ? WHERE id = ?").bind(vpnRecord.exp + ` (+${days} Hari)`, vpnRecord.id).run();
          await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(currentUser.email, `[RENEW] Perpanjangan Berhasil!`, `Masa aktif akun VPN <b>${vpnRecord.username}</b> berhasil ditambah ${days} Hari.`, now).run();
          ctx.waitUntil(sendTelegramLog(`\u{1F504} [RENEW] PERPANJANGAN BERHASIL`, `User: ${currentUser.email}
Username VPN: ${vpnRecord.username}
Server: ${vpnRecord.server}
Ditambah: ${days} Hari`, appSettings));
          const renewSubject = `Perpanjangan VPN ${vpnRecord.username} Berhasil`;
          const renewBody = `<p>Halo, ini adalah notifikasi otomatis bahwa perpanjangan masa aktif VPN Anda telah berhasil diproses.</p>
                                       <table class="info-table">
                                           <tr><td>Username VPN</td><td>${vpnRecord.username}</td></tr>
                                           <tr><td>Server Host</td><td>${vpnRecord.server}</td></tr>
                                           <tr><td>Tambahan Masa Aktif</td><td>${days} Hari</td></tr>
                                           <tr><td>Waktu Perpanjang</td><td>${now}</td></tr>
                                       </table>
                                       <p>Terima kasih telah mempercayakan koneksi internet dan privasi Anda kepada layanan Warung Pulsa.</p>`;
          ctx.waitUntil(sendEmailViaGAS(currentUser.email, renewSubject, buildEmailTemplate("Perpanjangan Berhasil", renewBody), env));
          return jsonResponse({ success: true });
        } catch (err) {
          await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(price, currentUser.email).run();
          await catatMutasi(env, currentUser.email, "IN", price, `Refund Perpanjangan VPN Gagal (${vpnRecord.username})`);
          throw err;
        }
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/check-detail" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { vpnId } = await request.json();
        const vpnRecord = await env.DB.prepare("SELECT * FROM vpns WHERE id = ? AND email = ?").bind(vpnId, currentUser.email).first();
        if (!vpnRecord) throw new Error("Data VPN tidak ditemukan.");
        const targetServer = appSettings.servers.find((s) => s.name === vpnRecord.server);
        let detailConfigText = "";
        if (targetServer) {
          let protocolStr = vpnRecord.protocol.toLowerCase();
          let endpoint = protocolStr.includes("vless") ? "/srpcom/detail-vlessws" : protocolStr.includes("trojan") ? "/srpcom/detail-trojanws" : protocolStr.includes("vmess") ? "/srpcom/detail-vmessws" : "";
          if (endpoint) {
            try {
              let req = await fetch(targetServer.host + endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": targetServer.key },
                body: JSON.stringify({ user: vpnRecord.username })
              });
              if (req.ok) {
                let res = await req.json();
                detailConfigText = res.detail?.stdout || res.stdout || "";
              }
            } catch (e) {
            }
          }
        }
        if (!detailConfigText) {
          const inboxRecord = await env.DB.prepare("SELECT message FROM inbox WHERE email = ? AND message LIKE ? ORDER BY id DESC LIMIT 1").bind(currentUser.email, `%${vpnRecord.username}%`).first();
          if (inboxRecord) {
            const matches = [...inboxRecord.message.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)];
            detailConfigText = matches.length > 0 ? matches[matches.length - 1][1] : inboxRecord.message.replace(/<[^>]*>?/gm, "").trim();
            detailConfigText = `=================================
INFORMASI ${vpnRecord.protocol.toUpperCase()}
=================================

Username : ${vpnRecord.username}
Server   : ${vpnRecord.server}
Expired  : ${vpnRecord.exp}

*Catatan: Data ditarik dari Database.

` + detailConfigText;
          } else {
            throw new Error("Gagal mengambil data detail.");
          }
        }
        return jsonResponse({ success: true, detail: detailConfigText });
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/api/cekkuota-backend" && method === "POST") {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        const { action, msisdn, payload } = await request.json();
        if (action === "check_quota_public") {
          const kmspApiKey = "60ef29aa-a648-4668-90ae-20951ef90c55";
          const res = await fetch(`https://apigw.kmsp-store.com/sidompul/v4/cek_kuota?msisdn=${msisdn}&isJSON=true`, {
            headers: {
              "Authorization": "Basic c2lkb21wdWxhcGk6YXBpZ3drbXNw",
              "X-API-Key": kmspApiKey,
              "X-App-Version": "4.0.0"
            }
          });
          const data = await res.json();
          if (data.status === true) {
            return jsonResponse({
              status: true,
              message: "Cek kuota sukses",
              data: { hasil: data.data.hasil }
            });
          } else {
            const errorText = data.data?.keteranganError || data.message || "Gagal menarik kuota.";
            return jsonResponse({
              status: false,
              message: errorText
            });
          }
        }
        if (action === "login_flow") {
          const apiKey = "465eaf4a-178c-4e8b-96d7-831f2568a9df";
          try {
            const sessionRes = await fetch(`https://golang-openapi-accesstokenlist-xltembakservice.kmsp-store.com/v1?api_key=${apiKey}`);
            if (sessionRes.ok) {
              const sessionData = await sessionRes.json();
              if (sessionData.status && sessionData.data) {
                const activeSession = sessionData.data.find((s) => s.msisdn === msisdn);
                if (activeSession && activeSession.token) {
                  const finalMsg = `Berhasil Login! (Sesi Aktif Ditemukan)

Nomor siap diisi paket. silakan lanjutkan dengan pembayaran ke QRIS admin https://t.me/srpcomchannel/419 . dan konfirmasi ke admin agar order paket diproses.`;
                  try {
                    const notifTitle = `\u{1F4CA} PENGGUNAAN CEK KUOTA (WEB - SESI)`;
                    const notifMsg = `\u{1F464} Pengguna: ${currentUser.email}
\u{1F4F1} Nomor HP: ${msisdn}
\u2705 Status: Login Sesi Aktif Sukses`;
                    if (sendTelegramLog) await sendTelegramLog(notifTitle, notifMsg, appSettings);
                  } catch (e) {
                  }
                  return jsonResponse({
                    login_success: true,
                    message: finalMsg
                  });
                }
              }
            }
          } catch (e) {
            console.error("Gagal melakukan pengecekan sesi KMSP:", e);
          }
          const res = await fetch(`https://golang-openapi-reqotp-xltembakservice.kmsp-store.com/v1?api_key=${apiKey}&phone=${msisdn}&method=OTP`);
          const data = await res.json();
          if (data.status === true) {
            return jsonResponse({
              status: true,
              message: data.message || "OTP berhasil dikirim.",
              data: { auth_id: data.data.auth_id }
            });
          } else {
            return jsonResponse({
              status: false,
              message: data.message || "Gagal meminta OTP."
            });
          }
        }
        if (action === "ver_otp") {
          const apiKey = "465eaf4a-178c-4e8b-96d7-831f2568a9df";
          const { auth_id, otp } = payload || {};
          const loginRes = await fetch(`https://golang-openapi-login-xltembakservice.kmsp-store.com/v1?api_key=${apiKey}&phone=${msisdn}&method=OTP&auth_id=${auth_id}&otp=${otp}`);
          const loginData = await loginRes.json();
          if (!loginData.status) {
            return jsonResponse({
              status: false,
              message: loginData.message || "Verifikasi OTP gagal."
            });
          }
          const access_token = loginData.data?.access_token;
          if (!access_token) {
            return jsonResponse({
              status: false,
              message: "Gagal mendapatkan token akses."
            });
          }
          const finalMsg = `Berhasil Login!

Nomor siap diisi paket. silakan lanjutkan dengan pembayaran ke QRIS admin https://t.me/srpcomchannel/419 . dan konfirmasi ke admin agar order paket diproses.`;
          try {
            const notifTitle = `\u{1F4CA} PENGGUNAAN CEK KUOTA (WEB)`;
            const notifMsg = `\u{1F464} Pengguna: ${currentUser.email}
\u{1F4F1} Nomor HP: ${msisdn}
\u2705 Status: Login OTP Sukses`;
            if (sendTelegramLog) await sendTelegramLog(notifTitle, notifMsg, appSettings);
          } catch (e) {
          }
          return jsonResponse({
            login_success: true,
            message: finalMsg
          });
        }
        return jsonResponse({ success: false, message: "Invalid action" }, 400);
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    if (path === "/webhook" && method === "POST") {
      try {
        const tripaySignature = request.headers.get("x-callback-signature");
        const rawBody = await request.text();
        const bodyObj = JSON.parse(rawBody);
        if (!await verifyWebhookSignature(env.TRIPAY_PRIVATE_KEY, rawBody, tripaySignature)) {
          return jsonResponse({ success: false, message: "Invalid Signature" }, 403);
        }
        if (bodyObj.status === "PAID") {
          const updateInvoice = await env.DB.prepare("UPDATE invoices SET status = 'PAID' WHERE ref = ? AND status = 'UNPAID'").bind(bodyObj.merchant_ref).run();
          if (updateInvoice.meta.changes === 1) {
            const invoice = await env.DB.prepare("SELECT * FROM invoices WHERE ref = ?").bind(bodyObj.merchant_ref).first();
            await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(invoice.amount, invoice.email).run();
            await catatMutasi(env, invoice.email, "IN", invoice.amount, `Top Up Saldo via TriPay (Ref: ${invoice.ref})`);
            await env.DB.prepare("DELETE FROM inbox WHERE email = ? AND title = '[PENDING] Top Up Saldo' AND message LIKE ?").bind(invoice.email, `%${bodyObj.merchant_ref}%`).run();
            await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(invoice.email, "Top Up Saldo Berhasil", `Pembayaran QRIS sebesar <b>Rp ${Number(invoice.amount).toLocaleString("id-ID")}</b> telah diverifikasi.`, getWIBTime()).run();
            await sendTelegramLog("\u{1F4B0} TOP UP SALDO BERHASIL", `Pembayaran QRIS sebesar <b>Rp ${Number(invoice.amount).toLocaleString("id-ID")}</b> telah diverifikasi.

Ref: ${invoice.ref}
Email: ${invoice.email}
Saldo otomatis ditambahkan.`, appSettings);
            const topUpSubject = `Top Up Saldo Sebesar Rp ${Number(invoice.amount).toLocaleString("id-ID")} Berhasil`;
            const topUpBody = `<p>Kami menginformasikan bahwa pembayaran Top Up Saldo Anda melalui Gateway TriPay telah kami verifikasi dengan sukses.</p>
                                           <table class="info-table">
                                               <tr><td>No. Referensi</td><td>${invoice.ref}</td></tr>
                                               <tr><td>Waktu Validasi</td><td>${getWIBTime()}</td></tr>
                                               <tr><td>Nominal Saldo</td><td style="color: #10b981; font-size: 18px;">Rp ${Number(invoice.amount).toLocaleString("id-ID")}</td></tr>
                                           </table>
                                           <p>Saldo web Anda telah ditambahkan secara otomatis dan kini dapat langsung digunakan untuk berlangganan layanan VPN maupun Paket Data XL tanpa hambatan.</p>
                                           <div style="text-align: center;"><a href="/" class="btn">Kembali ke Dashboard Utama</a></div>`;
            ctx.waitUntil(sendEmailViaGAS(invoice.email, topUpSubject, buildEmailTemplate("Bukti Transaksi Top Up", topUpBody), env));
          }
        }
        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ success: false }, 500);
      }
    }
    if (path === "/webhook-violet" && method === "POST") {
      try {
        const rawBody = await request.text();
        const bodyObj = JSON.parse(rawBody);
        const verification = await verifyVioletCallback(request, bodyObj, env);
        if (!verification.isValid) {
          const headersObj = {};
          for (const [k, v] of request.headers.entries()) {
            headersObj[k] = v;
          }
          const errMsg = `\u2022 IP Pengirim: <code>${verification.clientIp}</code> (Status Whitelist: ${verification.isWhitelistedIp ? "YA" : "TIDAK"})
\u2022 Signature: <code>${verification.signature || "KOSONG/UNDEFINED"}</code>

\u2022 Body JSON:
<pre>${JSON.stringify(bodyObj, null, 2)}</pre>

\u2022 Headers HTTP:
<pre>${JSON.stringify(headersObj, null, 2)}</pre>`;
          await sendTelegramLog("\u26A0\uFE0F INVALID VIOLET CALLBACK", errMsg, appSettings);
          console.error("Invalid Callback Source/Signature for Violet!");
          return jsonResponse({ success: false, message: "Invalid Signature or Source IP" }, 403);
        }
        if (verification.status === "success") {
          const updateInvoice = await env.DB.prepare("UPDATE invoices SET status = 'PAID' WHERE ref = ? AND status = 'UNPAID'").bind(verification.ref).run();
          if (updateInvoice.meta.changes === 1) {
            const invoice = await env.DB.prepare("SELECT * FROM invoices WHERE ref = ?").bind(verification.ref).first();
            await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(invoice.amount, invoice.email).run();
            await catatMutasi(env, invoice.email, "IN", invoice.amount, `Top Up Saldo via Violet (Ref: ${invoice.ref})`);
            await env.DB.prepare("DELETE FROM inbox WHERE email = ? AND title = '[PENDING] Top Up Saldo' AND message LIKE ?").bind(invoice.email, `%${verification.ref}%`).run();
            await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(invoice.email, "Top Up Saldo Berhasil", `Pembayaran QRIS sebesar <b>Rp ${Number(invoice.amount).toLocaleString("id-ID")}</b> telah diverifikasi.`, getWIBTime()).run();
            await sendTelegramLog("\u{1F4B0} TOP UP SALDO BERHASIL", `Pembayaran QRIS sebesar <b>Rp ${Number(invoice.amount).toLocaleString("id-ID")}</b> telah diverifikasi.

Ref: ${invoice.ref}
Email: ${invoice.email}
Saldo otomatis ditambahkan. (Gateway: Violet)`, appSettings);
            const topUpSubject = `Top Up Saldo Sebesar Rp ${Number(invoice.amount).toLocaleString("id-ID")} Berhasil`;
            const topUpBody = `<p>Kami menginformasikan bahwa pembayaran Top Up Saldo Anda melalui Gateway VioletMediaPay telah kami verifikasi dengan sukses.</p>
                                           <table class="info-table">
                                               <tr><td>No. Referensi</td><td>${invoice.ref}</td></tr>
                                               <tr><td>Waktu Validasi</td><td>${getWIBTime()}</td></tr>
                                               <tr><td>Nominal Saldo</td><td style="color: #10b981; font-size: 18px;">Rp ${Number(invoice.amount).toLocaleString("id-ID")}</td></tr>
                                           </table>
                                           <p>Saldo web Anda telah ditambahkan secara otomatis dan kini dapat langsung digunakan.</p>
                                           <div style="text-align: center;"><a href="https://${url.hostname}/" class="btn">Kembali ke Dashboard Utama</a></div>`;
            ctx.waitUntil(sendEmailViaGAS(invoice.email, topUpSubject, buildEmailTemplate("Bukti Transaksi Top Up", topUpBody), env));
          }
        } else if (verification.status === "kadaluarsa" || verification.status === "refund") {
          await env.DB.prepare("UPDATE invoices SET status = 'EXPIRED' WHERE ref = ? AND status = 'UNPAID'").bind(verification.ref).run();
        }
        return jsonResponse({ status: true });
      } catch (e) {
        await sendTelegramLog("\u{1F6A8} ERROR DI WEBHOOK-VIOLET", `Error: ${e.message}
Stack: ${e.stack || ""}`, appSettings);
        return jsonResponse({ status: false, error: e.message }, 500);
      }
    }
    if ((path === "/webhook-autogopay" || path === "/autogopay-callback") && method === "POST") {
      try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-signature") || request.headers.get("X-Signature");
        const { apiKey } = await getAutoGoPayConfig(env, appSettings);
        
        if (signature && apiKey) {
          const expectedSig = await hmacSha256(rawBody, apiKey);
          if (signature.toLowerCase() !== expectedSig.toLowerCase()) {
            return jsonResponse({ success: false, message: "Invalid webhook signature." }, 401);
          }
        }

        const bodyObj = JSON.parse(rawBody || "{}");
        const amount = bodyObj.transaction?.amount || bodyObj.amount || bodyObj.data?.amount;
        const status = String(bodyObj.transaction?.status || bodyObj.status || bodyObj.transaction_status || bodyObj.data?.status || "").toLowerCase();
        const issuer = String(bodyObj.transaction?.issuer || bodyObj.issuer || "").toLowerCase();
        const isMoneyIn = bodyObj.is_money_in === true || bodyObj.data?.is_money_in === true;

        if (amount && (status === "settlement" || status === "success" || status === "paid" || status === "1" || isMoneyIn)) {
          const invoice = await env.DB.prepare("SELECT * FROM invoices WHERE amount = ? AND status = 'UNPAID' AND (ref LIKE 'AGP%' OR ref LIKE 'AGPGOPAY%' OR ref LIKE 'AGPSHOPEE%') ORDER BY rowid DESC LIMIT 1").bind(parseInt(amount)).first();
          if (invoice) {
            const updateInvoice = await env.DB.prepare("UPDATE invoices SET status = 'PAID' WHERE ref = ? AND status = 'UNPAID'").bind(invoice.ref).run();
            if (updateInvoice.meta.changes === 1) {
              let gatewayType = "AutoGoPay";
              if (issuer.includes("gopay") || invoice.ref.includes("GOPAY")) {
                gatewayType = "GoPay";
              } else if (issuer.includes("shopee") || invoice.ref.includes("SHOPEE")) {
                gatewayType = "ShopeePay";
              }
              await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(invoice.amount, invoice.email).run();
              await catatMutasi(env, invoice.email, "IN", invoice.amount, "Top Up Saldo via " + gatewayType + " AutoGoPay (Ref: " + invoice.ref + ")");
              await env.DB.prepare("DELETE FROM inbox WHERE email = ? AND message LIKE ?").bind(invoice.email, "%" + invoice.ref + "%").run().catch(() => {});
              await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(invoice.email, "Top Up Saldo Berhasil", "Pembayaran QRIS " + gatewayType + " sebesar <b>Rp " + Number(invoice.amount).toLocaleString("id-ID") + "</b> telah diverifikasi otomatis via Webhook.", getWIBTime()).run();
              await sendTelegramLog("💰 TOP UP SALDO BERHASIL (WEBHOOK)", "Pembayaran QRIS " + gatewayType + " sebesar <b>Rp " + Number(invoice.amount).toLocaleString("id-ID") + "</b> telah diverifikasi.\n\nRef: " + invoice.ref + "\nEmail: " + invoice.email + "\nGateway: " + gatewayType + " (AutoGoPay Webhook)", appSettings);
              const topUpSubject = "Top Up Saldo Sebesar Rp " + Number(invoice.amount).toLocaleString("id-ID") + " Berhasil";
              const topUpBody = '<p>Pembayaran Top Up Saldo Anda melalui Gateway ' + gatewayType + ' telah diverifikasi dengan sukses via Webhook.</p>' +
                                '<table class="info-table">' +
                                    '<tr><td>No. Referensi</td><td>' + invoice.ref + '</td></tr>' +
                                    '<tr><td>Waktu Validasi</td><td>' + getWIBTime() + '</td></tr>' +
                                    '<tr><td>Nominal Saldo</td><td style="color: #10b981; font-size: 18px;">Rp ' + Number(invoice.amount).toLocaleString("id-ID") + '</td></tr>' +
                              '</table>' +
                              '<div style="text-align: center;"><a href="https://' + url.hostname + '/" class="btn">Kembali ke Dashboard Utama</a></div>';
              ctx.waitUntil(sendEmailViaGAS(invoice.email, topUpSubject, buildEmailTemplate("Bukti Transaksi Top Up", topUpBody), env));
            }
            return jsonResponse({ success: true, message: "Callback processed" });
          }
        }
        return jsonResponse({ success: true, message: "Callback received" });
      } catch (e) {
        return jsonResponse({ success: false, error: e.message }, 500);
      }
    }
    if (path === "/api/check-payment" && (method === "POST" || method === "GET")) {
      if (!currentUser) return jsonResponse({ success: false, message: "Unauthorized" }, 401);
      try {
        let bodyData = {};
        if (method === "POST") {
          bodyData = await request.json().catch(() => ({}));
        }
        const ref = bodyData.ref || url.searchParams.get("ref");
        const orderSn = bodyData.order_sn || url.searchParams.get("order_sn");
        const transactionId = bodyData.transaction_id || url.searchParams.get("transaction_id");

        if (!ref) return jsonResponse({ success: false, message: "Parameter ref diperlukan." }, 400);

        const invoice = await env.DB.prepare("SELECT * FROM invoices WHERE ref = ? AND email = ?").bind(ref, currentUser.email).first();
        if (!invoice) return jsonResponse({ success: false, message: "Invoice tidak ditemukan." }, 404);

        if (invoice.status === "PAID") {
          // Hapus pesan pending inbox jika faktur sudah PAID
          await env.DB.prepare("DELETE FROM inbox WHERE email = ? AND message LIKE ?").bind(currentUser.email, "%" + ref + "%").run().catch(() => {});
          return jsonResponse({ success: true, status: "PAID", message: "Pembayaran telah berhasil diverifikasi!" });
        }

        let isPaid = false;
        let gatewayType = "AutoGoPay";

        if (ref.startsWith("AGPSHOPEE-") || ref.startsWith("AGP-")) {
          gatewayType = "ShopeePay";
          // 1. Cek spesifik order_sn jika tersedia
          if (orderSn) {
            const statusData = await checkShopeePayStatus(env, appSettings, orderSn);
            if (statusData && (statusData.paid === true || statusData.status === "success" || statusData.order_status === 1 || statusData.status === 1)) {
              isPaid = true;
            }
          }
          // 2. Cek riwayat mutasi ShopeePay via /shopeepay/transactions
          if (!isPaid) {
            const shopeeTrx = await checkShopeePayTransactions(env, appSettings);
            for (const trx of shopeeTrx) {
              const trxAmount = parseInt(trx.amount);
              const isMoneyIn = trx.is_money_in === true || trx.status === 1 || String(trx.title || "").includes("Pembayaran") || String(trx.status || "").toLowerCase() === "settlement";
              if (trxAmount === parseInt(invoice.amount) && isMoneyIn) {
                isPaid = true;
                break;
              }
            }
          }
          // 3. Fallback cek ke /transactions jika perlu
          if (!isPaid) {
            const generalTrx = await checkGoPayTransactions(env, appSettings);
            for (const trx of generalTrx) {
              const trxStatus = String(trx.status || "").toLowerCase();
              if (parseInt(trx.amount) === parseInt(invoice.amount) && (trxStatus === "settlement" || trxStatus === "success" || trxStatus === "paid")) {
                isPaid = true;
                break;
              }
            }
          }
        } else if (ref.startsWith("AGPGOPAY-")) {
          gatewayType = "GoPay";
          // 1. Cek spesifik transaction_id jika ada
          if (transactionId) {
            const statusData = await checkGoPayStatus(env, appSettings, transactionId);
            if (statusData) {
              const txStatus = String(statusData.transaction_status || statusData.status || "").toLowerCase();
              if (txStatus === "settlement" || txStatus === "success") {
                isPaid = true;
              }
            }
          }
          // 2. Cek riwayat transaksi GoPay
          if (!isPaid) {
            const gopayTrx = await checkGoPayTransactions(env, appSettings);
            for (const trx of gopayTrx) {
              const trxStatus = String(trx.status || "").toLowerCase();
              if (parseInt(trx.amount) === parseInt(invoice.amount) && (trxStatus === "settlement" || trxStatus === "success" || trxStatus === "paid")) {
                isPaid = true;
                break;
              }
            }
          }
        }

        if (isPaid) {
          const updateInvoice = await env.DB.prepare("UPDATE invoices SET status = 'PAID' WHERE ref = ? AND status = 'UNPAID'").bind(ref).run();
          if (updateInvoice.meta.changes === 1) {
            await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE email = ?").bind(invoice.amount, invoice.email).run();
            await catatMutasi(env, invoice.email, "IN", invoice.amount, "Top Up Saldo via " + gatewayType + " (Ref: " + invoice.ref + ")");
            // Hapus pesan pending inbox yang bersangkutan
            await env.DB.prepare("DELETE FROM inbox WHERE email = ? AND message LIKE ?").bind(invoice.email, "%" + invoice.ref + "%").run().catch(() => {});
            await env.DB.prepare("INSERT INTO inbox (email, title, message, date, read) VALUES (?, ?, ?, ?, 0)").bind(invoice.email, "Top Up Saldo Berhasil", "Pembayaran QRIS " + gatewayType + " sebesar <b>Rp " + Number(invoice.amount).toLocaleString("id-ID") + "</b> telah diverifikasi.", getWIBTime()).run();
            await sendTelegramLog("💰 TOP UP SALDO BERHASIL", "Pembayaran QRIS sebesar <b>Rp " + Number(invoice.amount).toLocaleString("id-ID") + "</b> telah diverifikasi.\n\nRef: " + invoice.ref + "\nEmail: " + invoice.email + "\nGateway: " + gatewayType + " (AutoGoPay)\nSaldo otomatis ditambahkan.", appSettings);
            const topUpSubject = "Top Up Saldo Sebesar Rp " + Number(invoice.amount).toLocaleString("id-ID") + " Berhasil";
            const topUpBody = '<p>Pembayaran Top Up Saldo Anda melalui Gateway ' + gatewayType + ' telah diverifikasi dengan sukses.</p>' +
                              '<table class="info-table">' +
                                  '<tr><td>No. Referensi</td><td>' + invoice.ref + '</td></tr>' +
                                  '<tr><td>Waktu Validasi</td><td>' + getWIBTime() + '</td></tr>' +
                                  '<tr><td>Nominal Saldo</td><td style="color: #10b981; font-size: 18px;">Rp ' + Number(invoice.amount).toLocaleString("id-ID") + '</td></tr>' +
                              '</table>' +
                              '<div style="text-align: center;"><a href="https://' + url.hostname + '/" class="btn">Kembali ke Dashboard Utama</a></div>';
            ctx.waitUntil(sendEmailViaGAS(invoice.email, topUpSubject, buildEmailTemplate("Bukti Transaksi Top Up", topUpBody), env));
          }
          return jsonResponse({ success: true, status: "PAID", message: "Pembayaran berhasil dikonfirmasi! Saldo telah otomatis masuk ke akun Anda." });
        }

        return jsonResponse({ success: true, status: "UNPAID", message: "Pembayaran belum terdeteksi. Silakan pastikan Anda mentransfer tepat sejumlah tagihan." });
      } catch (e) {
        return jsonResponse({ success: false, message: e.message }, 500);
      }
    }
    const kmspRouteResponse = await handleKMSPRoutes(url, request, env, currentUser, appSettings, sendTelegramLog);
    if (kmspRouteResponse) return kmspRouteResponse;
    const adminRouteResponse = await handleAdminRoutes(url, request, env, currentUser, appSettings, sendTelegramLog);
    if (adminRouteResponse) return adminRouteResponse;
    const aiResponse = await handleAIRoutes(url, request, env, currentUser, ctx);
    if (aiResponse) return aiResponse;
    const licenseRouteResponse = await handleLicenseRoutes(url, request, env, currentUser, appSettings, sendTelegramLog);
    if (licenseRouteResponse) return licenseRouteResponse;
    return new Response("Not Found", { status: 404 });
  }
};
module.exports = worker_default;
//# sourceMappingURL=worker.js.map