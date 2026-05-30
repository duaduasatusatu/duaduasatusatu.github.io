import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'comments.json');

function loadComments() {
  try {
    if (existsSync(DATA_FILE)) {
      return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveComments(comments) {
  writeFileSync(DATA_FILE, JSON.stringify(comments, null, 2));
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { text, username } = req.body || {};

    if (!username || !text) {
      return res.status(400).json({ error: 'Username dan text komentar wajib diisi' });
    }

    const comments = loadComments();
    comments.push({
      id: Date.now() + Math.random(),
      username,
      text,
      timestamp: Date.now(),
      approved: false
    });
    saveComments(comments);
    return res.status(200).json({ message: 'Komentar terkirim, menunggu persetujuan admin' });
  }

  if (req.method === 'GET') {
    const ADMIN_USER = 'Adeovalin2211';
    const ADMIN_PASS = 'Brebes25';
    const { email, password } = req.headers;

    if (email !== ADMIN_USER || password !== ADMIN_PASS) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json(loadComments());
  }

  if (req.method === 'PUT') {
    const { id, approved } = req.body || {};
    const comments = loadComments();
    const idx = comments.findIndex(c => String(c.id) === String(id));

    if (idx > -1) {
      comments[idx].approved = approved;
      saveComments(comments);
      return res.status(200).json({ message: 'Komentar diperbarui' });
    }
    return res.status(404).json({ error: 'Komentar tidak ditemukan' });
  }

  res.status(405).json({ error: 'Method tidak diizinkan' });
}