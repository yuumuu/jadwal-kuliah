// ============================================================
// Data layer — fetch, cache, normalize, index
// ============================================================

import { parseJam, sortSessions, expandKelasList } from "./utils.js";

const BASE = ""; // relative

export class DataStore {
  constructor() {
    this.index = null;
    this.semesters = new Map();   // id -> semester detail (normalized)
    this.entities = null;         // { dosen, ruang, matkul }
    this.usingFallback = false;
    this._inflight = new Map();
  }

  async loadIndex() {
    if (this.index) return this.index;
    if (this._inflight.has("index")) return this._inflight.get("index");
    const p = (async () => {
      try {
        const [idx, dosen, ruang, matkul] = await Promise.all([
          fetchJSON(`${BASE}data/jadwal.json`),
          fetchJSON(`${BASE}data/entities/dosen.json`),
          fetchJSON(`${BASE}data/entities/ruang.json`),
          fetchJSON(`${BASE}data/entities/matkul.json`),
        ]);
        this.index = idx;
        this.entities = { dosen, ruang, matkul };
        this.usingFallback = false;
      } catch (e) {
        console.warn("[jadkul] fetch gagal, pakai fallback:", e);
        this.index = FALLBACK_INDEX;
        this.entities = FALLBACK_ENTITIES;
        this.usingFallback = true;
      }
      this._inflight.delete("index");
      return this.index;
    })();
    this._inflight.set("index", p);
    return p;
  }

  async loadSemester(id) {
    if (this.semesters.has(id)) return this.semesters.get(id);
    if (this._inflight.has(id)) return this._inflight.get(id);
    const meta = (this.index?.semesters || []).find((s) => s.id === id);
    if (!meta) throw new Error(`Semester tidak ditemukan: ${id}`);

    const p = (async () => {
      let raw;
      try {
        raw = await fetchJSON(`${BASE}${meta.file}`);
      } catch (e) {
        console.warn(`[jadkul] gagal fetch ${meta.file}, pakai fallback`, e);
        raw = FALLBACK_SEMESTERS[id] || FALLBACK_SEMESTERS.__default;
        this.usingFallback = true;
      }
      const normalized = normalizeSemester(raw, meta, this.entities);
      this.semesters.set(id, normalized);
      this._inflight.delete(id);
      return normalized;
    })();
    this._inflight.set(id, p);
    return p;
  }

  getSemester(id) { return this.semesters.get(id); }
  getIndex() { return this.index; }
  getEntities() { return this.entities; }
}

function fetchJSON(url) {
  return fetch(url, { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
    return r.json();
  });
}

function normalizeSemester(raw, meta, entities) {
  const dosenMap = new Map((entities?.dosen?.items || []).map((d) => [d.kode, d]));
  const ruangMap = new Map((entities?.ruang?.items || []).map((r) => [r.kode, r]));
  const matkulMap = new Map((entities?.matkul?.items || []).map((m) => [m.kode, m]));

  const sessions = (raw.sessions || []).map((s) => {
    const parsed = parseJam(s.jam);
    const matkul = matkulMap.get(s.kode);
    const dosen = dosenMap.get(s.dosen);
    const ruang = ruangMap.get(s.ruang);
    return {
      ...s,
      _start: parsed.start,
      _end: parsed.end,
      _startStr: parsed.startStr,
      _endStr: parsed.endStr,
      _matkulNama: matkul?.nama || s.matkul || s.kode,
      _dosenNama: dosen?.nama || s.dosen,
      _ruangNama: ruang?.nama || s.ruang,
      _color: matkul?.color || s.color || null,
    };
  }).sort(sortSessions);

  const classes = raw.classes || [...new Set(sessions.flatMap((s) => expandKelasList(s.kelas)))].filter(Boolean).sort();

  return {
    id: meta.id,
    label: meta.label,
    program: meta.program,
    period: meta.period,
    year: meta.year,
    startDate: raw.startDate || meta.startDate,
    endDate: raw.endDate || meta.endDate,
    lastUpdated: raw.lastUpdated || meta.lastUpdated,
    source: raw.source || meta.source,
    version: raw.version || meta.version,
    classes,
    sessions,
    holidays: (raw.holidays || []).slice().sort((a, b) => a.date.localeCompare(b.date)),
    important: (raw.important || []).slice().sort((a, b) => a.date.localeCompare(b.date)),
    meta,
  };
}

// ------------------------------------------------------------
// Fallback (kecil, jelas ditandai di UI)
// ------------------------------------------------------------

const FALLBACK_ENTITIES = {
  dosen: { items: [
    { kode: "AB", nama: "Dr. Andi Budiman", email: "andi@example.ac.id" },
    { kode: "CS", nama: "Citra Sari, M.Kom", email: "citra@example.ac.id" },
  ]},
  ruang: { items: [
    { kode: "F3.201", nama: "F3.201 — Lab Algoritma", gedung: "F3" },
    { kode: "F3.202", nama: "F3.202 — Ruang Teori", gedung: "F3" },
  ]},
  matkul: { items: [
    { kode: "TI501", nama: "Algoritma Lanjut", sks: 3, color: "#4f46e5" },
    { kode: "TI502", nama: "Basis Data", sks: 3, color: "#06b6d4" },
  ]},
};

const FALLBACK_INDEX = {
  lastUpdated: "2026-09-15",
  version: "2.0.0",
  semesters: [
    {
      id: "ti-s5-gasal-2026",
      label: "TI Semester 5 — Gasal 2026/2027",
      program: "ti", period: "gasal", year: "2026/2027",
      startDate: "2026-09-14", endDate: "2027-01-23",
      file: "data/semesters/ti-s5-gasal-2026.json",
      status: "active",
      lastUpdated: "2026-09-15",
    },
  ],
};

const FALLBACK_SEMESTERS = {
  "ti-s5-gasal-2026": {
    id: "ti-s5-gasal-2026",
    startDate: "2026-09-14", endDate: "2027-01-23",
    classes: ["A", "B"],
    sessions: [
      { kode: "TI501", kelas: "A", hari: "Senin", jam: "07:00-09:30", ruang: "F3.201", dosen: "AB" },
      { kode: "TI502", kelas: "A", hari: "Senin", jam: "10:00-12:30", ruang: "F3.202", dosen: "CS" },
      { kode: "TI501", kelas: "B", hari: "Selasa", jam: "07:00-09:30", ruang: "F3.201", dosen: "AB" },
      { kode: "TI502", kelas: "B", hari: "Rabu", jam: "13:00-15:30", ruang: "F3.202", dosen: "CS" },
    ],
    holidays: [
      { date: "2026-12-25", name: "Hari Raya Natal" },
      { date: "2027-01-01", name: "Tahun Baru 2027" },
    ],
    important: [],
  },
  __default: {
    id: "fallback", startDate: "2026-09-14", endDate: "2027-01-23",
    classes: ["A"], sessions: [], holidays: [], important: [],
  },
};