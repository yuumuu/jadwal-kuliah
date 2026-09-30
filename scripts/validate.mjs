#!/usr/bin/env node
// ============================================================
// Validator data jadwal — jalankan: node scripts/validate.mjs
// ============================================================

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const DAYS = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
const TIME_RE = /^(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})$/;

async function loadJSON(p) {
  const raw = await readFile(resolve(ROOT, p), "utf8");
  return JSON.parse(raw);
}

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function checkTime(s, where) {
  const m = s.match(TIME_RE);
  if (!m) return err(`${where}: format jam tidak valid "${s}"`);
  const [, h1, m1, h2, m2] = m.map(Number);
  if (h1 > 23 || h2 > 23 || m1 > 59 || m2 > 59) err(`${where}: jam di luar rentang "${s}"`);
  const start = h1 * 60 + m1, end = h2 * 60 + m2;
  if (start >= end) err(`${where}: jam mulai >= jam selesai "${s}"`);
  return { start, end };
}

function inRange(date, start, end) {
  return date >= start && date <= end;
}

async function main() {
  const index = await loadJSON("data/jadwal.json");
  const dosen = await loadJSON("data/entities/dosen.json");
  const ruang = await loadJSON("data/entities/ruang.json");
  const matkul = await loadJSON("data/entities/matkul.json");

  const dosenSet = new Set((dosen.items || []).map((d) => d.kode));
  const ruangSet = new Set((ruang.items || []).map((r) => r.kode));
  const matkulSet = new Set((matkul.items || []).map((m) => m.kode));

  if (!Array.isArray(index.semesters) || !index.semesters.length) {
    err("data/jadwal.json: 'semesters' kosong atau bukan array");
  }

  for (const sem of index.semesters) {
    const where = `index ${sem.id}`;
    if (!sem.id) err(`${where}: id wajib`);
    if (!sem.file) { err(`${where}: file wajib`); continue; }
    if (!existsSync(resolve(ROOT, sem.file))) { err(`${where}: file ${sem.file} tidak ada`); continue; }
    if (!sem.startDate || !sem.endDate) err(`${where}: startDate/endDate wajib`);
    if (!sem.lastUpdated) warn(`${where}: lastUpdated kosong`);
    if (!sem.source) warn(`${where}: source kosong`);

    const detail = await loadJSON(sem.file);
    const dr = { start: sem.startDate, end: sem.endDate };

    // Sesions
    const seen = new Set();
    const roomTime = new Map();
    const dosenTime = new Map();
    for (const s of detail.sessions || []) {
      const sw = `${where} sesi ${s.kode}/${s.kelas}/${s.hari}`;
      if (!s.kode) err(`${sw}: kode kosong`);
      if (!matkulSet.has(s.kode)) err(`${sw}: kode ${s.kode} tidak ada di entities/matkul.json`);
      if (!s.hari || !DAYS.includes(s.hari)) err(`${sw}: hari tidak valid "${s.hari}"`);
      if (!s.kelas) err(`${sw}: kelas kosong`);
      if (!s.ruang) err(`${sw}: ruang kosong`);
      if (!ruangSet.has(s.ruang)) err(`${sw}: ruang ${s.ruang} tidak ada di entities/ruang.json`);
      if (!s.dosen) err(`${sw}: dosen kosong`);
      if (!dosenSet.has(s.dosen)) err(`${sw}: dosen ${s.dosen} tidak ada di entities/dosen.json`);
      const t = checkTime(s.jam || "", sw);
      if (!t) continue;

      const key = `${s.kode}|${s.kelas}|${s.hari}|${s.jam}`;
      if (seen.has(key)) err(`${sw}: sesi duplikat`);
      seen.add(key);

      // Overlap ruang — warning saja: data legacy punya kuliah gabungan RKBesar
      // dan kode dosen koordinator yang mengampu paralel. UI sudah menampilkan banner konflik.
      const rk = `${s.hari}|${s.ruang}`;
      if (!roomTime.has(rk)) roomTime.set(rk, []);
      for (const other of roomTime.get(rk)) {
        if (t.start < other.end && other.start < t.end) {
          warn(`${where}: ruang ${s.ruang} bentrok di ${s.hari} ${s.jam} dengan ${other.label}`);
        }
      }
      roomTime.get(rk).push({ ...t, label: `${s.kode}/${s.kelas} ${s.jam}` });

      // Overlap dosen — warning saja (alasan sama seperti ruang).
      const dk = `${s.hari}|${s.dosen}`;
      if (!dosenTime.has(dk)) dosenTime.set(dk, []);
      for (const other of dosenTime.get(dk)) {
        if (t.start < other.end && other.start < t.end) {
          warn(`${where}: dosen ${s.dosen} bentrok di ${s.hari} ${s.jam} dengan ${other.label}`);
        }
      }
      dosenTime.get(dk).push({ ...t, label: `${s.kode}/${s.kelas} ${s.jam}` });
    }

    // Holidays & important
    for (const h of [...(detail.holidays || []), ...(detail.important || [])]) {
      if (!h.date || !/^\d{4}-\d{2}-\d{2}$/.test(h.date)) err(`${where}: tanggal ${h.date} tidak valid`);
      if (h.date && !inRange(h.date, dr.start, dr.end)) {
        err(`${where}: tanggal ${h.date} (${h.name}) di luar rentang semester ${dr.start}–${dr.end}`);
      }
    }
  }

  if (warnings.length) {
    console.log("\n⚠️  Peringatan:");
    for (const w of warnings) console.log("  - " + w);
  }
  if (errors.length) {
    console.error("\n❌ Error:");
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }
  console.log("\n✅ Validasi lolos.");
}

main().catch((e) => { console.error(e); process.exit(1); });