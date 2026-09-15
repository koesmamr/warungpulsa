-- ==========================================================
-- Schema Database Warung Pulsa (Fresh Install)
-- Kompatibel dengan SQLite / Cloudflare D1
-- ==========================================================

CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    balance INTEGER DEFAULT 0,
    is_blocked INTEGER DEFAULT 0,
    phonebook TEXT DEFAULT '[]',
    picture TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    email TEXT,
    expires_at DATETIME
);

CREATE TABLE IF NOT EXISTS vpns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    server TEXT,
    protocol TEXT,
    username TEXT,
    date TEXT,
    exp TEXT
);

CREATE TABLE IF NOT EXISTS inbox (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    title TEXT,
    message TEXT,
    date TEXT,
    read INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS invoices (
    ref TEXT PRIMARY KEY,
    email TEXT,
    amount INTEGER,
    status TEXT,
    date DATETIME
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS debug_logs (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    email TEXT,
    subject TEXT,
    category TEXT,
    status TEXT,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS ticket_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT,
    sender_type TEXT,
    message TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    type TEXT,
    amount INTEGER,
    description TEXT,
    balance INTEGER DEFAULT 0,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS ai_usage (
    email TEXT PRIMARY KEY,
    count INTEGER,
    slot TEXT
);

CREATE TABLE IF NOT EXISTS licenses (
    id TEXT PRIMARY KEY,
    email TEXT,
    vps_name TEXT,
    ip_address TEXT,
    expires_at INTEGER,
    created_at TEXT,
    subdomain TEXT,
    cf_record_id TEXT
);

-- Indeks untuk mempercepat performa kueri
CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_id ON sessions(id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_vpns_email ON vpns(email);
CREATE INDEX IF NOT EXISTS idx_inbox_email ON inbox(email);
CREATE INDEX IF NOT EXISTS idx_inbox_read ON inbox(read);
CREATE INDEX IF NOT EXISTS idx_invoices_email ON invoices(email);
CREATE INDEX IF NOT EXISTS idx_invoices_ref ON invoices(ref);
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(email);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON ticket_replies(ticket_id);
