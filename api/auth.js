import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'users.json');

function loadUsers() {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return {};
}

function saveUsers(users) {
  writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { email, password, action } = req.body || {};

  if (!email || !password || !action) {
    return res.status(400).json({ error: 'Email, password, dan action wajib diisi' });
  }

  const users = loadUsers();

  if (action === 'register') {
    if (users[email]) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    users[email] = { password, createdAt: new Date().toISOString() };
    saveUsers(users);
    return res.status(200).json({ message: 'Registrasi berhasil', email });
  }

  if (action === 'login') {
    if (!users[email] || users[email].password !== password) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }
    return res.status(200).json({ message: 'Login berhasil', email });
  }

  res.status(400).json({ error: 'Action tidak valid' });
}