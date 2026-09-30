// ============================================================
// Utils — pure helpers
// ============================================================

export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
export const DAY_ORDER = { Senin: 0, Selasa: 1, Rabu: 2, Kamis: 3, Jumat: 4, Sabtu: 5, Minggu: 6 };
export const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
export const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];

export function escapeHtml(v) {
  if (v == null) return "";
  return String(v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function parseJam(jam) {
  if (!jam || typeof jam !== "string") return { start: 0, end: 0, startStr: "", endStr: "" };
  const m = jam.match(/^(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})$/);
  if (!m) return { start: 0, end: 0, startStr: jam, endStr: "" };
  const s = +m[1] * 60 + +m[2];
  const e = +m[3] * 60 + +m[4];
  return { start: s, end: e, startStr: m[1] + ":" + m[2], endStr: m[3] + ":" + m[4] };
}

export function fmtDuration(minutes) {
  if (minutes < 60) return `${minutes} mnt`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} jam ${m} mnt` : `${h} jam`;
}

export function fmtCountdown(ms) {
  if (ms <= 0) return "sekarang";
  const totalMin = Math.ceil(ms / 60000);
  if (totalMin < 60) return `${totalMin} mnt lagi`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m ? `${h} jam ${m} mnt lagi` : `${h} jam lagi`;
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function fmtDateID(iso, opts = {}) {
  const d = parseISODate(iso);
  if (!d) return iso || "";
  const { short = false, withYear = true, withWeekday = false } = opts;
  const day = d.getDate();
  const mon = short ? MONTHS_SHORT[d.getMonth()] : MONTHS[d.getMonth()];
  const y = withYear ? ` ${d.getFullYear()}` : "";
  const wd = withWeekday ? `${DAYS[(d.getDay() + 6) % 7]}, ` : "";
  return `${wd}${day} ${mon}${y}`;
}

export function debounce(fn, ms = 150) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

export function groupBy(arr, keyFn) {
  const out = new Map();
  for (const item of arr) {
    const k = keyFn(item);
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(item);
  }
  return out;
}

export function sortSessions(a, b) {
  const d = (DAY_ORDER[a.hari] ?? 99) - (DAY_ORDER[b.hari] ?? 99);
  if (d !== 0) return d;
  return parseJam(a.jam).start - parseJam(b.jam).start;
}

export function nowMinutes(d = new Date()) {
  return d.getHours() * 60 + d.getMinutes();
}

// Cocokkan filter kelas tunggal ("A") dengan sesi gabungan ("A,C" / "A,B,C").
// Legacy RKBesar memakai kelas gabungan untuk kuliah bersama — harus match semua anggotanya.
export function kelasMatch(sessionKelas, filterKelas) {
  if (!filterKelas) return true;
  if (!sessionKelas) return false;
  return String(sessionKelas).split(",").map((k) => k.trim()).includes(String(filterKelas).trim());
}

export function expandKelasList(kelasStr) {
  if (!kelasStr) return [];
  return String(kelasStr).split(",").map((k) => k.trim()).filter(Boolean);
}