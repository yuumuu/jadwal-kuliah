
/* ═══════════════════════════════════════════════════════════════
   HEROICONS SVG STRINGS
   ═══════════════════════════════════════════════════════════════ */
const ICONS = {
  calendar: '<i class="hgi-stroke hgi-calendar-03"></i>',
  clock: '<i class="hgi-stroke hgi-clock-01"></i>',
  location: '<i class="hgi-stroke hgi-location-01"></i>',
  teacher: '<i class="hgi-stroke hgi-graduation-scroll"></i>',
  holiday: '<i class="hgi-stroke hgi-calendar-block-01"></i>',
  important: '<i class="hgi-stroke hgi-alert-circle"></i>',
  star: '<i class="hgi-stroke hgi-star"></i>'
};

/* ═══════════════════════════════════════════════════════════════
   FALLBACK DATA SETUP
   ═══════════════════════════════════════════════════════════════ */
const FALLBACK_INDEX = {
  "semesters": [
    { "id": "ti-s1-gasal-2026", "label": "Semester 1", "period": "Gasal", "academicYear": "2026/2027", "program": "TI", "semester": 1, "status": "active", "active": true, "startDate": "2026-09-01", "endDate": "2027-01-15", "file": "data/ti-s1-gasal-2026.json" },
    { "id": "ti-s3-gasal-2026", "label": "Semester 3", "period": "Gasal", "academicYear": "2026/2027", "program": "TI", "semester": 3, "status": "active", "active": true, "startDate": "2026-09-01", "endDate": "2027-01-15", "file": "data/ti-s3-gasal-2026.json" },
    { "id": "ti-s5-gasal-2026", "label": "Semester 5", "period": "Gasal", "academicYear": "2026/2027", "program": "TI", "semester": 5, "status": "active", "active": true, "startDate": "2026-09-01", "endDate": "2027-01-15", "file": "data/ti-s5-gasal-2026.json" },
    { "id": "ti-s7-gasal-2026", "label": "Semester 7", "period": "Gasal", "academicYear": "2026/2027", "program": "TI", "semester": 7, "status": "active", "active": true, "startDate": "2026-09-01", "endDate": "2027-01-15", "file": "data/ti-s7-gasal-2026.json" },
    { "id": "ai-s1-gasal-2026", "label": "Semester 1", "period": "Gasal", "academicYear": "2026/2027", "program": "AI", "semester": 1, "status": "active", "active": true, "startDate": "2026-09-01", "endDate": "2027-01-15", "file": "data/ai-s1-gasal-2026.json" },
    { "id": "ti-peminatan-gasal-2026", "label": "Peminatan / Lintas Semester", "period": "Gasal", "academicYear": "2026/2027", "program": "TI", "semester": 0, "status": "active", "active": true, "startDate": "2026-09-01", "endDate": "2027-01-15", "file": "data/ti-peminatan-gasal-2026.json" },
    { "id": "ti-s5-gasal-2025", "label": "Semester 5 (Arsip)", "period": "Gasal", "academicYear": "2025/2026", "program": "TI", "semester": 5, "status": "archived", "active": false, "startDate": "2025-09-01", "endDate": "2026-01-15", "file": "data/ti-s5-gasal-2026.json" }
  ]
};

const FALLBACK_DETAIL = {
  "id": "ti-s5-gasal-2026", "startDate": "2026-09-01", "endDate": "2027-01-15",
  "subjectColors": {"TI501":"#3b82f6","TI502":"#8b5cf6","TI503":"#06b6d4","TI504":"#10b981","TI505":"#f59e0b","TI506":"#ef4444","TI507":"#ec4899","TI508":"#6366f1"},
  "holidays": [{"date":"2026-01-01","name":"Tahun Baru Masehi"},{"date":"2026-03-20","name":"Hari Raya Idul Fitri 1447 H"},{"date":"2026-08-17","name":"Hari Kemerdekaan RI"},{"date":"2026-12-25","name":"Hari Raya Natal"}],
  "importantDates": [{"date":"2026-09-07","name":"Awal Perkuliahan"},{"date":"2026-12-15","name":"Awal Ujian Akhir Semester"},{"date":"2027-01-15","name":"Akhir Semester"}],
  "schedules": {
    "Senin": [{"kode":"TI506","matkul":"Manajemen Proyek","kelas":"D","jam":"08.50-11.30","ruang":"F6.102","dosen":"HQ/WS"},{"kode":"TI503","matkul":"Pengembangan Web Service","kelas":"B","jam":"08.50-11.30","ruang":"F4.002","dosen":"DP/QA"},{"kode":"TI501","matkul":"Pengembangan Aplikasi Web","kelas":"E","jam":"08.50-11.30","ruang":"F4.003","dosen":"AS"}],
    "Selasa": [{"kode":"TI506","matkul":"Manajemen Proyek","kelas":"A","jam":"07.50-10.30","ruang":"F4.001","dosen":"HQ"},{"kode":"TI503","matkul":"Pengembangan Web Service","kelas":"E","jam":"08.50-11.30","ruang":"F6.102","dosen":"FF"}],
    "Rabu": [{"kode":"TI501","matkul":"Pengembangan Aplikasi Web","kelas":"A","jam":"08.50-11.30","ruang":"-","dosen":"AS"}],
    "Kamis": [{"kode":"TI505","matkul":"Tata Kelola Teknologi Informasi","kelas":"D,E,F","jam":"08.50-11.30","ruang":"-","dosen":"CO"}],
    "Jumat": [{"kode":"TI502","matkul":"Pengembangan Aplikasi Mobile","kelas":"A","jam":"07.50-10.30","ruang":"-","dosen":"HS"}],
    "Sabtu": [{"kode":"TI507","matkul":"Bahasa Inggris untuk Membaca Naskah Akademik","kelas":"B","jam":"07.00-08.40","ruang":"-","dosen":"TW"}]
  }
};

const DAY_ORDER = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const MONTH_NAMES = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const LECTURER_MAP = {
  "HQ": { name: "Haidar Qudratullah, M.T.", dept: "Teknologi Informasi UMY", email: "haidar@umy.ac.id" },
  "WS": { name: "Wisnu Susanto, M.Eng.", dept: "Teknologi Informasi UMY", email: "wisnu@umy.ac.id" },
  "DP": { name: "Dwi Permadi, M.Kom.", dept: "Teknologi Informasi UMY", email: "dwi.permadi@umy.ac.id" },
  "AS": { name: "Agus Suprianto, M.T.", dept: "Teknologi Informasi UMY", email: "agus.s@umy.ac.id" },
  "FF": { name: "Fifi Fitriani, M.T.", dept: "Teknologi Informasi UMY", email: "fifi@umy.ac.id" },
  "CO": { name: "Cahyo Oktaviani, M.T.", dept: "Teknologi Informasi UMY", email: "cahyo@umy.ac.id" },
  "HS": { name: "Hardi Santoso, M.Eng.", dept: "Teknologi Informasi UMY", email: "hardi@umy.ac.id" },
  "TW": { name: "Tri Wibowo, M.Pd.", dept: "Bahasa & Sastra UMY", email: "tri.wibowo@umy.ac.id" },
  "EI": { name: "Eko Indarto, M.Kom.", dept: "Teknologi Informasi UMY", email: "eko.indarto@umy.ac.id" },
  "EP": { name: "Eka Prasetya, M.T.", dept: "Teknologi Informasi UMY", email: "eka.prasetya@umy.ac.id" },
  "QA": { name: "Qoirul Anam, M.T.", dept: "Teknologi Informasi UMY", email: "qoirul.anam@umy.ac.id" },
  "RG": { name: "Rizky Gumilar, M.T.", dept: "Teknologi Informasi UMY", email: "rizky.g@umy.ac.id" },
  "AM": { name: "Ahmad Mufid, M.T.", dept: "Teknologi Informasi UMY", email: "ahmad.mufid@umy.ac.id" }
};

/* ═══════════════════════════════════════════════════════════════
   APPLICATION CORE
   ═══════════════════════════════════════════════════════════════ */
const App = {
  index: null,
  detail: null,
  crossSemesterCache: {},
  _crossSemesterReady: false,
  _crossSemesterReadyPromise: null,
  state: {
    semesterId: "ti-s5-gasal-2026",
    activeTab: "schedule",
    scheduleView: "table",
    selectedDay: "all",
    selectedClasses: [],
    selectedClassesCal: [],
    searchQuery: "",
    theme: "light",
    style: "default",
    mainClass: null,
    calActiveMonthIndex: 0,
    calShowAll: false,
    hasOnboarded: false,
    myClasses: {}
  },

  async init() {
    this.index = await this.loadIndex();
    this.loadPrefs();
    
    if (!this.getSemesterMeta(this.state.semesterId)) {
      this.state.semesterId = this.index.semesters[0]?.id || "ti-s5-gasal-2026";
    }

    if (!["table", "grid", "list", "timeline"].includes(this.state.scheduleView)) {
      this.state.scheduleView = "table";
    }

    this.applyTheme(this.state.theme);
    this.applyStyle(this.state.style);
    this.populateSemesterSelect();
    this.bindEvents();

    await this.loadSemesterDetail(this.state.semesterId);
    this.applySemesterUI(this.state.semesterId);

    if (!this.state.hasOnboarded) {
      this.showWelcomeModal();
    }
  },

  async loadIndex() {
    try {
      const res = await fetch("data/jadwal.json");
      if (!res.ok) throw new Error();
      return await res.json();
    } catch (e) {
      return FALLBACK_INDEX;
    }
  },

  async loadSemesterDetail(semesterId) {
    const meta = this.getSemesterMeta(semesterId);
    if (!meta) return;
    try {
      const res = await fetch(meta.file);
      if (!res.ok) throw new Error();
      this.detail = await res.json();
    } catch (e) {
      this.detail = FALLBACK_DETAIL;
    }
  },

  getSemesterMeta(id) {
    const fromIndex = this.index.semesters.find(s => s.id === id);
    if (!fromIndex) return null;
    return {
      ...fromIndex,
      startDate: fromIndex.startDate || (this.detail && this.detail.startDate) || "2026-09-01",
      endDate: fromIndex.endDate || (this.detail && this.detail.endDate) || "2027-01-15"
    };
  },

  getAllClasses() {
    if (!this.detail) return [];
    const cls = new Set();
    Object.values(this.detail.schedules || {}).forEach(rows => {
      rows.forEach(r => (r.kelas || "").split(",").forEach(c => cls.add(c.trim())));
    });
    return [...cls].sort();
  },

  /* ── JADWAL SAYA: PILIH KELAS PER MATKUL LINTAS SEMESTER ── */
  getClassesForKode(kode, detail = this.detail) {
    if (!detail) return [];
    const cls = new Set();
    Object.values(detail.schedules || {}).forEach(rows => {
      rows.forEach(r => {
        if (r.kode === kode) (r.kelas || "").split(",").forEach(c => cls.add(c.trim()));
      });
    });
    return [...cls].sort();
  },

  getMatkulList(detail = this.detail) {
    if (!detail) return [];
    const seen = new Map();
    Object.values(detail.schedules || {}).forEach(rows => {
      rows.forEach(r => { if (!seen.has(r.kode)) seen.set(r.kode, r.matkul); });
    });
    return [...seen.entries()]
      .map(([kode, matkul]) => ({ kode, matkul, kelas: this.getClassesForKode(kode, detail) }))
      .sort((a, b) => a.kode.localeCompare(b.kode));
  },

  getEligibleSemesters() {
    return (this.index.semesters || []).filter(s => s.status !== "archived" && s.active !== false);
  },

  async loadCrossSemesterData() {
    const eligible = this.getEligibleSemesters();
    await Promise.all(eligible.map(async (meta) => {
      if (this.crossSemesterCache[meta.id]) return;
      try {
        const res = await fetch(meta.file);
        if (!res.ok) throw new Error();
        this.crossSemesterCache[meta.id] = await res.json();
      } catch (e) {
        console.warn(`Gagal memuat data semester ${meta.id}`, e);
      }
    }));
  },

  getCrossSemesterMatkulList() {
    return this.getEligibleSemesters()
      .filter(meta => this.crossSemesterCache[meta.id])
      .map(meta => ({
        semesterId: meta.id,
        semesterLabel: `${meta.program} ${meta.label}`,
        matkul: this.getMatkulList(this.crossSemesterCache[meta.id])
      }));
  },

  async ensureCrossSemesterReady() {
    await this.loadCrossSemesterData();
    const { result, removedKodes } = this.sanitizeMyClasses(this.state.myClasses);
    this.state.myClasses = result;
    if (removedKodes.length > 0) {
      this.savePrefs();
      alert(`${removedKodes.length} pilihan kelas dihapus karena tidak tersedia lagi: ${removedKodes.join(", ")}`);
    }
  },

  async ensureCrossSemesterReadyOnce() {
    if (this._crossSemesterReady) return;
    if (!this._crossSemesterReadyPromise) {
      this._crossSemesterReadyPromise = this.ensureCrossSemesterReady().then(() => {
        this._crossSemesterReady = true;
      });
    }
    await this._crossSemesterReadyPromise;
  },

  sanitizeMyClasses(myClasses) {
    const result = {};
    const removedKodes = [];
    Object.entries(myClasses || {}).forEach(([key, kelas]) => {
      const sep = key.indexOf("::");
      if (sep === -1) { result[key] = kelas; return; }
      const semesterId = key.slice(0, sep);
      const kode = key.slice(sep + 2);
      const meta = this.index.semesters.find(s => s.id === semesterId);
      if (!meta) { removedKodes.push(kode); return; }
      const detail = this.crossSemesterCache[semesterId];
      if (!detail) { result[key] = kelas; return; }
      const avail = this.getClassesForKode(kode, detail);
      if (avail.includes(kelas)) result[key] = kelas;
      else removedKodes.push(kode);
    });
    return { result, removedKodes };
  },

  isMine(r, semesterId = this.state.semesterId) {
    const mine = this.state.myClasses[`${semesterId}::${r.kode}`];
    return !!mine && r.rClasses.includes(mine);
  },

  flattenCrossSemesterMine() {
    const items = [];
    Object.entries(this.state.myClasses).forEach(([key, kelas]) => {
      const sep = key.indexOf("::");
      if (sep === -1) return;
      const semesterId = key.slice(0, sep);
      const kode = key.slice(sep + 2);
      const detail = this.crossSemesterCache[semesterId];
      const meta = this.index.semesters.find(s => s.id === semesterId);
      if (!detail || !meta) return;
      this.flattenSchedules("all", [], "", detail)
        .filter(r => r.kode === kode && r.rClasses.includes(kelas))
        .forEach(r => items.push({ ...r, semesterId, semesterLabel: `${meta.program} ${meta.label}` }));
    });
    return items;
  },

  getTodayName() {
    const d = new Date().getDay();
    return d >= 1 && d <= 6 ? DAY_ORDER[d - 1] : null;
  },

  flattenSchedules(dayFilter, classFilter, query = "", detail = this.detail) {
    if (!detail) return [];
    const items = [];
    const days = dayFilter === "all" ? DAY_ORDER : [dayFilter];
    const q = query.toLowerCase().trim();

    days.forEach(day => {
      (detail.schedules[day] || []).forEach(r => {
        const rClasses = r.kelas.split(",").map(c => c.trim());
        const matchClass = classFilter.length === 0 || classFilter.some(c => rClasses.includes(c));
        const matchQuery = !q ||
          r.matkul.toLowerCase().includes(q) ||
          r.kode.toLowerCase().includes(q) ||
          r.dosen.toLowerCase().includes(q) ||
          r.ruang.toLowerCase().includes(q);

        if (matchClass && matchQuery) {
          items.push({
            day, ...r, rClasses,
            color: (detail.subjectColors && detail.subjectColors[r.kode]) || null
          });
        }
      });
    });
    return items;
  },

  isHighlighted(r) {
    if (this.state.mainClass && r.rClasses.includes(this.state.mainClass)) return true;
    return this.state.selectedClasses.some(c => r.rClasses.includes(c));
  },

  isMineOrMain(r) {
    if (this.state.mainClass && r.rClasses.includes(this.state.mainClass)) return true;
    return this.isMine(r, r.semesterId || this.state.semesterId);
  },

  parseJam(jam) {
    const m = (jam || "").match(/(\d{1,2})[.:](\d{2})\s*-\s*(\d{1,2})[.:](\d{2})/);
    if (!m) return null;
    const start = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    const end = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
    return { start, end };
  },

  findConflicts(data) {
    const conflicts = [];
    const conflictKeys = new Set();
    const byDay = {};
    data.forEach((r, idx) => { (byDay[r.day] = byDay[r.day] || []).push({ r, idx }); });

    Object.values(byDay).forEach(rows => {
      for (let i = 0; i < rows.length; i++) {
        const a = rows[i].r;
        const aRange = this.parseJam(a.jam);
        if (!aRange) continue;
        for (let j = i + 1; j < rows.length; j++) {
          const b = rows[j].r;
          if (a.kode === b.kode) continue;
          const bRange = this.parseJam(b.jam);
          if (!bRange) continue;
          if (aRange.start < bRange.end && bRange.start < aRange.end) {
            conflicts.push({ a, b });
            conflictKeys.add(`${a.day}|${a.kode}|${a.jam}`);
            conflictKeys.add(`${b.day}|${b.kode}|${b.jam}`);
          }
        }
      }
    });
    return { conflicts, conflictKeys };
  },

  async selectSemester(id) {
    const meta = this.getSemesterMeta(id);
    if (!meta) return;
    this.state.semesterId = id;
    this.savePrefs();
    document.getElementById("semesterSelect").value = id;
    await this.loadSemesterDetail(id);
    this.applySemesterUI(id);
  },

  applySemesterUI(id) {
    const meta = this.getSemesterMeta(id);
    if (!meta) return;
    this.state.selectedDay = "all";
    const classes = this.getAllClasses();

    if (this.state.mainClass && !classes.includes(this.state.mainClass)) {
      this.state.mainClass = null;
    }

    this.state.selectedClasses = this.state.mainClass ? [this.state.mainClass] : [];
    this.state.selectedClassesCal = this.state.mainClass ? [this.state.mainClass] : [];

    const start = new Date((meta.startDate || "2026-09-01") + "T00:00:00");
    this.state.calYear = start.getFullYear();
    const today = new Date();
    if (today.getFullYear() === this.state.calYear) {
      this.state.calActiveMonthIndex = today.getMonth();
    } else {
      this.state.calActiveMonthIndex = start.getMonth();
    }

    const isArchived = meta.status === "archived" || meta.active === false;
    const archLabel = isArchived ? " [ARSIP]" : "";

    document.getElementById("headerMeta").textContent = `${meta.program} · ${meta.label} (${meta.academicYear})${archLabel}`;
    document.getElementById("mainClassLabel").textContent = this.state.mainClass || "Semua";

    this.renderToolbar("schedule");
    this.renderToolbar("calendar");
    this.renderView("schedule");
    this.renderView("calendar");
    this.renderStats();
  },

  renderStats() {
    if (!this.detail) return;
    const all = this.flattenSchedules("all", []);
    const hasMain = !!this.state.mainClass;
    const hasMyClasses = Object.keys(this.state.myClasses).length > 0;
    const mineCount = all.filter(r => this.isMineOrMain(r)).length;
    let mineLabel;
    if (hasMain && hasMyClasses) mineLabel = "Sesi Kelas Saya";
    else if (hasMain) mineLabel = `Sesi Kelas ${this.state.mainClass}`;
    else if (hasMyClasses) mineLabel = "Sesi Jadwal Saya (Per Matkul)";
    else mineLabel = "Kelas Utama Belum Set";
    const perDay = {};
    DAY_ORDER.forEach(d => perDay[d] = 0);
    all.forEach(r => perDay[r.day]++);
    const busiest = Object.entries(perDay).sort((a,b) => b[1] - a[1])[0];
    const matkulSet = new Set(all.map(r => r.kode));

    const html = `
      <div class="stat-card">
        <div class="stat-value">${all.length}</div>
        <div class="stat-label">Total Sesi Kuliah</div>
      </div>
      <div class="stat-card accent">
        <div class="stat-value">${(hasMain || hasMyClasses) ? mineCount : '—'}</div>
        <div class="stat-label">${mineLabel}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${matkulSet.size}</div>
        <div class="stat-label">Mata Kuliah</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${busiest ? busiest[0] : '-'}</div>
        <div class="stat-label">Hari Terpadat (${busiest ? busiest[1] : 0} Sesi)</div>
      </div>
    `;
    document.getElementById("statGrid").innerHTML = html;
  },

  /* ── ACTIVE VS ARCHIVE POP-UP MODAL (REQS 1 & 5) ── */
  showWelcomeModal() {
    const modal = document.getElementById("welcomeModal");
    const activeSemWrap = document.getElementById("modalSemOptionsActive");
    const archiveSemWrap = document.getElementById("modalSemOptionsArchive");
    const archiveWrapContainer = document.getElementById("modalSemOptionsArchiveWrap");
    const toggleArchiveBtn = document.getElementById("modalArchiveToggleBtn");
    const classWrap = document.getElementById("modalClassChips");

    let tempSemId = this.state.semesterId;
    let tempClass = this.state.mainClass;
    let showArchive = false;

    const renderSemBtns = () => {
      const activeSemesters = this.index.semesters.filter(s => s.status !== "archived" && s.active !== false);
      const archivedSemesters = this.index.semesters.filter(s => s.status === "archived" || s.active === false);

      activeSemWrap.innerHTML = activeSemesters.map(s =>
        `<button class="modal-opt-btn ${s.id === tempSemId ? "active" : ""}" data-id="${s.id}">${s.program} ${s.label}</button>`
      ).join("");

      archiveSemWrap.innerHTML = archivedSemesters.length
        ? archivedSemesters.map(s => `<button class="modal-opt-btn archive-btn ${s.id === tempSemId ? "active" : ""}" data-id="${s.id}">${s.program} ${s.label} (${s.academicYear})</button>`).join("")
        : `<div style="font-size:0.75rem; color:var(--text-muted);">Belum ada arsip jadwal lama.</div>`;

      modal.querySelectorAll(".modal-opt-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          tempSemId = btn.dataset.id;
          renderSemBtns();
          await this.loadSemesterDetail(tempSemId);
          renderClassBtns();
        });
      });
    };

    toggleArchiveBtn.onclick = () => {
      showArchive = !showArchive;
      archiveWrapContainer.style.display = showArchive ? "block" : "none";
      toggleArchiveBtn.textContent = showArchive ? "Sembunyikan Arsip" : "Lihat Arsip Jadwal";
    };

    const renderClassBtns = () => {
      const classes = this.getAllClasses();
      classWrap.innerHTML = `<button class="chip ${!tempClass ? "active" : ""}" data-cls="">Semua Kelas</button>` +
        classes.map(c => `<button class="modal-class-btn ${c === tempClass ? "active" : ""}" data-cls="${c}">${c}</button>`).join("");

      classWrap.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          tempClass = btn.dataset.cls || null;
          renderClassBtns();
        });
      });
    };

    renderSemBtns();
    renderClassBtns();

    modal.style.display = "flex";

    document.getElementById("welcomeModalSave").onclick = async () => {
      this.state.mainClass = tempClass;
      this.state.hasOnboarded = true;
      modal.style.display = "none";
      await this.selectSemester(tempSemId);
    };

    document.getElementById("welcomeModalSkip").onclick = async () => {
      this.state.mainClass = null;
      this.state.hasOnboarded = true;
      modal.style.display = "none";
      await this.selectSemester(tempSemId);
    };
  },

  /* ── ACTIVE VS ARCHIVE SELECT POPULATION (REQS 1) ── */
  populateSemesterSelect() {
    const sel = document.getElementById("semesterSelect");
    const activeList = this.index.semesters.filter(s => s.status !== "archived" && s.active !== false);
    const archiveList = this.index.semesters.filter(s => s.status === "archived" || s.active === false);

    let html = `<optgroup label="Semester Aktif">`;
    activeList.forEach(s => {
      html += `<option value="${s.id}">${s.program} ${s.label} (${s.academicYear})</option>`;
    });
    html += `</optgroup>`;

    if (archiveList.length) {
      html += `<optgroup label="Arsip Jadwal (Tahun Ajaran Lalu)">`;
      archiveList.forEach(s => {
        html += `<option value="${s.id}">${s.program} ${s.label} (${s.academicYear}) [Arsip]</option>`;
      });
      html += `</optgroup>`;
    }

    sel.innerHTML = html;
  },

  renderToolbar(tab) {
    if (!this.detail) return;
    if (tab === "schedule") {
      const dayWrap = document.getElementById("dayFilter");
      const today = this.getTodayName();

      let html = `<button class="chip ${this.state.selectedDay === 'all' ? 'active' : ''}" data-day="all">Semua Hari</button>`;
      if (today) {
        html += `<button class="chip today-chip ${this.state.selectedDay === today ? 'active' : ''}" data-day="${today}">Hari Ini (${today})</button>`;
      }
      DAY_ORDER.forEach(d => {
        html += `<button class="chip ${this.state.selectedDay === d ? 'active' : ''}" data-day="${d}">${d}</button>`;
      });

      dayWrap.innerHTML = html;
      dayWrap.querySelectorAll(".chip").forEach(c => {
        c.addEventListener("click", () => {
          this.state.selectedDay = c.dataset.day;
          this.renderToolbar("schedule");
          this.renderView("schedule");
        });
      });

      this.renderClassChips("classFilter", this.state.selectedClasses, (cls) => {
        this.state.selectedClasses = cls;
        this.renderView("schedule");
      });
    } else {
      this.renderClassChips("classFilterCal", this.state.selectedClassesCal, (cls) => {
        this.state.selectedClassesCal = cls;
        this.renderView("calendar");
      });
    }
  },

  renderClassChips(containerId, selected, onChange) {
    const classes = this.getAllClasses();
    const wrap = document.getElementById(containerId);
    const allActive = selected.length === 0;

    wrap.innerHTML = `<button class="chip ${allActive ? "active" : ""}" data-cls="all">Semua</button>` +
      classes.map(c => `<button class="chip ${selected.includes(c) ? "multi-active" : ""}" data-cls="${c}">${c}${c === this.state.mainClass ? ' ' + ICONS.star : ''}</button>`).join("");

    wrap.querySelectorAll(".chip").forEach(ch => {
      ch.addEventListener("click", () => {
        const cls = ch.dataset.cls;
        if (cls === "all") { selected.length = 0; }
        else {
          const idx = selected.indexOf(cls);
          if (idx >= 0) selected.splice(idx, 1); else selected.push(cls);
        }
        onChange([...selected]);
        this.renderClassChips(containerId, selected, onChange);
      });
    });
  },

  renderView(tab) {
    if (tab === "schedule") {
      const data = this.flattenSchedules(this.state.selectedDay, this.state.selectedClasses, this.state.searchQuery);
      const container = document.getElementById("scheduleContainer");
      document.getElementById("scheduleCount").textContent = `${data.length} sesi ditemukan`;
      this.updateFilterBadges();

      const view = this.state.scheduleView;
      if (view === "grid") this.renderGrid(data, container);
      else if (view === "list") this.renderList(data, container);
      else if (view === "timeline") this.renderTimeline(data, container);
      else this.renderTable(data, container);
    } else if (tab === "calendar") {
      const container = document.getElementById("calendarContainer");
      this.renderCalendarView(container);
    } else if (tab === "myschedule") {
      this.renderMySchedule();
    }
  },

  closeAllMenus() {
    document.querySelectorAll(".menu-dropdown.open").forEach(m => m.classList.remove("open"));
  },

  updateFilterBadges() {
    const count = (this.state.selectedDay !== "all" ? 1 : 0) + (this.state.selectedClasses ? this.state.selectedClasses.length : 0);
    ["scheduleFilterBadge", "scheduleFilterBadge2"].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = String(count);
      el.style.display = count > 0 ? "inline-flex" : "none";
    });
  },

  /* ── JADWAL SAYA: RENDER TAB LINTAS SEMESTER ── */
  async renderMySchedule() {
    const container = document.getElementById("myScheduleContainer");
    if (!this._crossSemesterReady) {
      container.innerHTML = `<div class="empty-state">Memuat data lintas semester...</div>`;
      await this.ensureCrossSemesterReadyOnce();
    }

    const data = this.flattenCrossSemesterMine();
    document.getElementById("myScheduleCount").textContent = `${data.length} sesi ditemukan`;
    if (Object.keys(this.state.myClasses).length === 0) {
      container.innerHTML = `<div class="empty-state">Anda belum mengatur kelas untuk mata kuliah manapun. Klik "Atur Kelas per Matkul" untuk mulai.</div>`;
      return;
    }
    const { conflicts, conflictKeys } = this.findConflicts(data);
    let banner = "";
    if (conflicts.length > 0) {
      const lines = conflicts.map(({ a, b }) =>
        `${a.day}, ${a.jam}: ${a.kode} (Kelas ${a.kelas}) vs ${b.kode} (Kelas ${b.kelas})`
      );
      banner = `<div class="conflict-banner">
        <strong>${ICONS.important} Bentrok Jadwal Terdeteksi (${conflicts.length})</strong>
        ${lines.map(l => `• ${l}`).join("<br>")}
      </div>`;
    }
    container.innerHTML = banner;
    const tableWrap = document.createElement("div");
    container.appendChild(tableWrap);
    this.renderTable(data, tableWrap, conflictKeys);
  },

  async showMyClassesModal() {
    const modal = document.getElementById("myClassesModal");
    const wrap = document.getElementById("myClassesMatkulList");
    modal.style.display = "flex";
    wrap.innerHTML = `<div class="empty-state">Memuat data lintas semester...</div>`;

    if (!this._crossSemesterReady) {
      await this.ensureCrossSemesterReadyOnce();
    }

    let temp = { ...this.state.myClasses };
    const openSemesters = new Set([this.state.semesterId]);

    const renderRows = () => {
      wrap.querySelectorAll("details.matkul-semester-group").forEach(d => {
        if (d.open) openSemesters.add(d.dataset.semesterId); else openSemesters.delete(d.dataset.semesterId);
      });

      const groups = this.getCrossSemesterMatkulList();
      wrap.innerHTML = groups.length ? groups.map(g => `
        <details class="matkul-semester-group" data-semester-id="${g.semesterId}" ${openSemesters.has(g.semesterId) ? "open" : ""}>
          <summary class="matkul-semester-header">${g.semesterLabel} <span class="mm-count">(${g.matkul.length} matkul)</span></summary>
          <div class="matkul-semester-body">
            ${g.matkul.length ? g.matkul.map(m => {
              const key = `${g.semesterId}::${m.kode}`;
              return `
              <div class="modal-matkul-row">
                <div class="mm-title"><span class="mm-code">${m.kode}</span><span>${m.matkul}</span></div>
                <div class="mm-chip-row">
                  <button class="chip ${!temp[key] ? "active" : ""}" data-key="${key}" data-cls="">Belum Pilih</button>
                  ${m.kelas.map(c => `<button class="chip ${temp[key] === c ? "active" : ""}" data-key="${key}" data-cls="${c}">${c}</button>`).join("")}
                </div>
              </div>`;
            }).join("") : `<div class="empty-state">Tidak ada matkul.</div>`}
          </div>
        </details>
      `).join("") : `<div class="empty-state">Data semester belum tersedia.</div>`;

      wrap.querySelectorAll("button[data-key]").forEach(btn => {
        btn.addEventListener("click", () => {
          const { key, cls } = btn.dataset;
          if (cls) temp[key] = cls; else delete temp[key];
          renderRows();
        });
      });
    };

    renderRows();

    document.getElementById("myClassesModalSave").onclick = () => {
      this.state.myClasses = { ...temp };
      this.savePrefs();
      modal.style.display = "none";
      this.renderMySchedule();
    };
    document.getElementById("myClassesModalClose").onclick = () => {
      modal.style.display = "none";
    };
  },

  formatDosenBadges(dosenStr) {
    if (!dosenStr || dosenStr === "-") return "-";
    const initials = dosenStr.split("/").map(s => s.trim());
    return initials.map(init => `<span class="dosen-chip" data-dosen="${init}" title="Klik detail pengampu ${init}">${init}</span>`).join(" / ");
  },

  showLecturerModal(initial) {
    const info = LECTURER_MAP[initial] || { name: `Dosen (${initial})`, dept: "Teknologi Informasi UMY", email: "-" };
    document.getElementById("lecturerModalTitle").textContent = `Detail Pengampu — ${initial}`;
    
    const all = this.flattenSchedules("all", []);
    const taught = all.filter(r => (r.dosen || "").split("/").map(s => s.trim()).includes(initial));

    let html = `
      <div style="background:var(--bg-subtle); padding:0.85rem; border-radius:var(--radius-sm); margin-bottom:1rem; border-left:4px solid var(--primary);">
        <div style="font-size:1.05rem; font-weight:800; color:var(--text-main);">${info.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem; font-family:var(--font-mono);">${info.dept}</div>
        ${info.email !== '-' ? `<div style="font-size:0.78rem; color:var(--primary); margin-top:0.2rem; font-family:var(--font-mono);">${info.email}</div>` : ''}
      </div>
      <h4 style="font-size:0.85rem; margin-bottom:0.5rem; font-weight:700;">Mata Kuliah Diampu Semester Ini (${taught.length} Sesi):</h4>
    `;

    if (taught.length) {
      html += `<div style="display:flex; flex-direction:column; gap:0.4rem; max-height:240px; overflow-y:auto;">`;
      taught.forEach(s => {
        html += `<div style="background:var(--bg-card); border:1px solid var(--border-color); padding:0.55rem 0.75rem; border-radius:var(--radius-sm);">
          <div style="font-weight:700; font-size:0.84rem;"><span style="color:var(--primary); font-family:var(--font-mono);">${s.kode}</span> — ${s.matkul}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem; font-family:var(--font-mono);">${s.day} · ${s.jam} · Kelas ${s.kelas} · Ruang ${s.ruang}</div>
        </div>`;
      });
      html += `</div>`;
    } else {
      html += `<div style="font-size:0.8rem; color:var(--text-muted);">Tidak ada data sesi untuk dosen ini pada semester aktif.</div>`;
    }

    document.getElementById("lecturerModalContent").innerHTML = html;
    document.getElementById("lecturerModal").style.display = "flex";
  },

  bindDosenChipListeners(container) {
    container.querySelectorAll(".dosen-chip[data-dosen]").forEach(chip => {
      chip.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showLecturerModal(chip.dataset.dosen);
      });
    });
  },

  /* ── RENDERERS ── */
  renderTable(data, container, conflictKeys = new Set()) {
    if (!data.length) { container.innerHTML = this.emptyState(); return; }
    const showSemester = !!data[0].semesterLabel;
    let html = `<div class="table-wrap"><table class="schedule-table"><thead><tr>
      <th>Hari</th><th>Kode</th><th>Mata Kuliah</th>${showSemester ? "<th>Semester</th>" : ""}<th>Kelas</th><th>Jam</th><th>Ruang</th><th>Dosen</th>
    </tr></thead><tbody>`;

    data.forEach(r => {
      const hl = this.isHighlighted(r) ? "highlight" : "";
      const conflict = conflictKeys.has(`${r.day}|${r.kode}|${r.jam}`) ? "conflict-row" : "";
      const dot = r.color ? `<span class="subject-dot" style="background:${r.color}"></span>` : "";
      const star = this.isMineOrMain(r) ? `<span class="star-badge">${ICONS.star} Kelas Saya</span>` : "";
      const dosenBadges = this.formatDosenBadges(r.dosen);
      html += `<tr class="${hl} ${conflict}">
        <td style="font-weight:700;">${r.day}</td>
        <td class="code-tag">${dot}${r.kode}</td>
        <td style="font-weight:600;">${r.matkul}${star}</td>
        ${showSemester ? `<td><span class="class-tag">${r.semesterLabel}</span></td>` : ""}
        <td><span class="class-tag">${r.kelas}</span></td>
        <td style="font-family:var(--font-mono);">${r.jam}</td>
        <td><strong>${r.ruang}</strong></td>
        <td>${dosenBadges}</td>
      </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
    this.bindDosenChipListeners(container);
  },

  renderGrid(data, container) {
    if (!data.length) { container.innerHTML = this.emptyState(); return; }
    let html = `<div class="view-grid">`;

    data.forEach(r => {
      const hl = this.isHighlighted(r) ? "highlight" : "";
      const star = this.isMineOrMain(r) ? `<span class="star-badge">${ICONS.star}</span>` : "";
      const dosenBadges = this.formatDosenBadges(r.dosen);
      html += `<div class="grid-card ${hl}">
        <div class="grid-card-header">
          <span class="grid-card-code" style="color:${r.color || 'var(--primary)'}">${r.kode}</span>
          <span class="class-tag">Kelas ${r.kelas} ${star}</span>
        </div>
        <div class="grid-card-title">${r.matkul}</div>
        <div class="grid-card-meta">
          <span>${ICONS.calendar} ${r.day}, ${r.jam}</span>
          <span>${ICONS.location} Ruang ${r.ruang}</span>
          <span>${ICONS.teacher} Dosen: ${dosenBadges}</span>
        </div>
      </div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
    this.bindDosenChipListeners(container);
  },

  renderList(data, container) {
    if (!data.length) { container.innerHTML = this.emptyState(); return; }
    let html = `<div class="view-list">`;
    const grouped = {};
    data.forEach(r => { (grouped[r.day] = grouped[r.day] || []).push(r); });

    DAY_ORDER.forEach(day => {
      const items = grouped[day];
      if (!items) return;
      html += `<div class="list-group-header"><span>${ICONS.calendar}</span> ${day} (${items.length} sesi)</div>`;
      items.forEach(r => {
        const hl = this.isHighlighted(r) ? "highlight" : "";
        const star = this.isMineOrMain(r) ? `<span class="star-badge">${ICONS.star}</span>` : "";
        const dosenBadges = this.formatDosenBadges(r.dosen);
        html += `<div class="list-item-card ${hl}">
          <div class="list-time">${r.jam}</div>
          <div>
            <div class="list-info-title">${r.kode} — ${r.matkul} ${star}</div>
            <div class="list-info-sub">Kelas ${r.kelas} · Dosen ${dosenBadges}</div>
          </div>
          <div class="list-location">${r.ruang}</div>
        </div>`;
      });
    });

    html += `</div>`;
    container.innerHTML = html;
    this.bindDosenChipListeners(container);
  },

  renderTimeline(data, container) {
    if (!data.length) { container.innerHTML = this.emptyState(); return; }
    let html = `<div class="timeline-wrap">`;
    data.forEach(r => {
      const hl = this.isHighlighted(r) ? "highlight" : "";
      const dosenBadges = this.formatDosenBadges(r.dosen);
      html += `<div class="timeline-item ${hl}">
        <div class="timeline-card ${hl}">
          <div style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted); font-weight:700;">${r.day} | ${r.jam}</div>
          <div style="font-weight:700; font-size:0.95rem; margin-top:0.2rem;">${r.kode} — ${r.matkul}</div>
          <div style="font-size:0.82rem; color:var(--text-muted); margin-top:0.2rem;">Kelas ${r.kelas} · Ruang ${r.ruang} · Dosen ${dosenBadges}</div>
        </div>
      </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    this.bindDosenChipListeners(container);
  },

  /* ── CALENDAR MONTH RENDERER ── */
  renderCalendarView(container) {
    const meta = this.getSemesterMeta(this.state.semesterId);
    if (!meta || !this.detail) { container.innerHTML = this.emptyState(); return; }

    const start = new Date((meta.startDate || "2026-09-01") + "T00:00:00");
    const baseYear = this.state.calYear || start.getFullYear();

    const holidayMap = {}; (this.detail.holidays || []).forEach(h => { holidayMap[h.date] = h.name; });
    const importantMap = {}; (this.detail.importantDates || []).forEach(d => { importantMap[d.date] = d.name; });

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

    const classDayMap = {};
    this.flattenSchedules("all", this.state.selectedClassesCal).forEach(r => {
      (classDayMap[r.day] = classDayMap[r.day] || new Set()).add(r.kode);
    });

    const months = [];
    for (let m = 0; m < 12; m++) {
      const y = baseYear;
      const monthData = { year: y, month: m, days: [] };
      const firstDay = new Date(y, m, 1);
      const lastDay = new Date(y, m + 1, 0);

      const startOffset = (firstDay.getDay() + 6) % 7;
      for (let i = 0; i < startOffset; i++) monthData.days.push({ empty: true });

      for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const dayOfWeek = new Date(y, m, d).getDay();
        const dayName = dayOfWeek >= 1 && dayOfWeek <= 6 ? DAY_ORDER[dayOfWeek - 1] : null;
        const isHoliday = !!holidayMap[dateStr];
        const isImportant = !!importantMap[dateStr];
        const hasClass = !isHoliday && dayName && classDayMap[dayName] && classDayMap[dayName].size > 0;

        monthData.days.push({
          num: d, dateStr, dayName, isHoliday, isImportant, hasClass, isToday: dateStr === todayStr,
          holidayName: holidayMap[dateStr] || null, importantName: importantMap[dateStr] || null
        });
      }
      months.push(monthData);
    }

    if (this.state.calActiveMonthIndex < 0) this.state.calActiveMonthIndex = 11;
    if (this.state.calActiveMonthIndex >= 12) this.state.calActiveMonthIndex = 0;

    const targetMonths = this.state.calShowAll ? months : [months[this.state.calActiveMonthIndex]];
    const activeM = months[this.state.calActiveMonthIndex];

    const labelElem = document.getElementById("calCurrentMonthLabel");
    if (labelElem) {
      labelElem.textContent = this.state.calShowAll 
        ? `Kalender 1 Tahun Full ${baseYear} (12 Bulan: Jan - Des)`
        : `${MONTH_NAMES[activeM.month]} ${activeM.year}`;
    }

    const DAY_NAMES = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
    let html = "";

    targetMonths.forEach(m => {
      html += `<div class="cal-month-card">
        <div class="cal-month-header"><span>${ICONS.calendar}</span> ${MONTH_NAMES[m.month]} ${m.year}</div>
        <div class="cal-grid">`;
      DAY_NAMES.forEach(d => { html += `<div class="cal-day-name">${d}</div>`; });

      m.days.forEach(day => {
        if (day.empty) { html += `<div class="cal-date-cell empty"></div>`; return; }
        let cls = "cal-date-cell";
        if (day.isToday) cls += " today";
        if (day.isHoliday) cls += " holiday";
        if (day.isImportant) cls += " important";

        let dots = '<div class="cal-dots">';
        if (day.hasClass) dots += '<span class="cal-dot"></span>';
        if (day.isHoliday) dots += '<span class="cal-dot holiday-dot"></span>';
        if (day.isImportant) dots += '<span class="cal-dot important-dot"></span>';
        dots += '</div>';

        html += `<div class="${cls}" data-date="${day.dateStr}">
          <span>${day.num}</span>
          ${dots}
        </div>`;
      });

      html += `</div></div>`;
    });

    html += `<div class="cal-legend">
      <span class="legend-item"><span class="legend-dot" style="background:var(--accent)"></span> Hari Ini</span>
      <span class="legend-item"><span class="legend-dot" style="background:var(--primary)"></span> Ada Perkuliahan</span>
      <span class="legend-item"><span class="legend-dot" style="background:var(--danger)"></span> Libur Nasional</span>
      <span class="legend-item"><span class="legend-dot" style="background:var(--success)"></span> Agenda Akademik</span>
    </div>`;

    container.innerHTML = html;

    container.querySelectorAll(".cal-date-cell[data-date]").forEach(cell => {
      cell.addEventListener("click", () => this.showDateDetailModal(cell.dataset.date));
    });
  },

  showDateDetailModal(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const dayOfWeek = d.getDay();
    const dayName = dayOfWeek >= 1 && dayOfWeek <= 6 ? DAY_ORDER[dayOfWeek - 1] : "Minggu";
    const dateLabel = `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

    const holiday = (this.detail.holidays || []).find(h => h.date === dateStr);
    const important = (this.detail.importantDates || []).find(h => h.date === dateStr);
    const sessions = dayName !== "Minggu" ? this.flattenSchedules(dayName, this.state.selectedClassesCal) : [];

    document.getElementById("dateModalTitle").textContent = `${dayName}, ${dateLabel}`;
    let body = "";

    if (holiday) {
      body += `<div style="background:var(--danger-light); color:var(--danger); padding:0.75rem; border-radius:var(--radius-sm); font-weight:700; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">${ICONS.holiday} Libur: ${holiday.name}</div>`;
    }
    if (important) {
      body += `<div style="background:var(--success-light); color:var(--success); padding:0.75rem; border-radius:var(--radius-sm); font-weight:700; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">${ICONS.important} Agenda: ${important.name}</div>`;
    }
    if (sessions.length) {
      body += `<h4 style="font-size:0.85rem; margin-bottom:0.4rem;">Jadwal Perkuliahan (${sessions.length} sesi):</h4><div style="display:flex; flex-direction:column; gap:0.5rem;">`;
      sessions.forEach(s => {
        body += `<div style="background:var(--bg-subtle); padding:0.6rem; border-radius:var(--radius-sm);">
          <div style="font-weight:700; font-size:0.85rem;">${s.kode} — ${s.matkul}</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;">${ICONS.clock} ${s.jam} | Kelas ${s.kelas} | Ruang ${s.ruang} | Dosen: ${s.dosen}</div>
        </div>`;
      });
      body += `</div>`;
    }

    if (!holiday && !important && !sessions.length) {
      body = `<div style="color:var(--text-muted); text-align:center; padding:1rem;">Tidak ada sesi perkuliahan atau agenda khusus pada tanggal ini.</div>`;
    }

    document.getElementById("dateModalContent").innerHTML = body;
    document.getElementById("dateDetailModal").style.display = "flex";
  },

  copyScheduleSummary() {
    const data = this.flattenSchedules(this.state.selectedDay, this.state.selectedClasses, this.state.searchQuery);
    if (!data.length) { alert("Tidak ada sesi untuk disalin."); return; }
    
    const meta = this.getSemesterMeta(this.state.semesterId);
    let text = `*JadKul — Jadwal Pengajaran TI UMY*\n*Semester:* ${meta.label} (${meta.academicYear})\n*Hari:* ${this.state.selectedDay === 'all' ? 'Semua Hari' : this.state.selectedDay}\n*Total:* ${data.length} sesi\n---------------------------------\n`;
    
    data.forEach((r, i) => {
      text += `${i+1}. [${r.day} ${r.jam}] ${r.kode} - ${r.matkul} (Kelas ${r.kelas}) @ Ruang ${r.ruang} (Dosen: ${r.dosen})\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
      alert("Ringkasan jadwal berhasil disalin ke clipboard! Siap dibagikan ke WhatsApp / Telegram.");
    }).catch(() => {
      alert("Gagal menyalin otomatis. Silakan salin manual.");
    });
  },

  async copyMyScheduleSummary() {
    if (!this._crossSemesterReady) {
      await this.ensureCrossSemesterReadyOnce();
    }
    const data = this.flattenCrossSemesterMine();
    if (!data.length) { alert("Belum ada kelas yang diatur untuk disalin."); return; }

    let text = `*JadKul — Jadwal Saya (Personalisasi Lintas Semester)*\n*Total:* ${data.length} sesi\n---------------------------------\n`;

    data.forEach((r, i) => {
      text += `${i+1}. [${r.day} ${r.jam}] ${r.kode} - ${r.matkul} (Kelas ${r.kelas}) @ Ruang ${r.ruang} (Dosen: ${r.dosen}) — ${r.semesterLabel}\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      alert("Ringkasan jadwal saya berhasil disalin ke clipboard! Siap dibagikan ke WhatsApp / Telegram.");
    }).catch(() => {
      alert("Gagal menyalin otomatis. Silakan salin manual.");
    });
  },

  applyTheme(theme) {
    this.state.theme = theme;
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    document.querySelectorAll(".theme-btn").forEach(b => b.classList.toggle("active", b.dataset.theme === theme));
    this.savePrefs();
  },

  applyStyle(style) {
    this.state.style = style;
    if (style === "default") document.documentElement.removeAttribute("data-style");
    else document.documentElement.setAttribute("data-style", style);
    document.getElementById("styleSelect").value = style;
    this.savePrefs();
  },

  savePrefs() {
    const prefs = {
      semesterId: this.state.semesterId,
      scheduleView: this.state.scheduleView,
      theme: this.state.theme,
      style: this.state.style,
      mainClass: this.state.mainClass || "",
      hasOnboarded: this.state.hasOnboarded,
      myClasses: this.state.myClasses || {}
    };
    try { localStorage.setItem("jadkul_prefs", JSON.stringify(prefs)); } catch(e) {}
  },

  loadPrefs() {
    try {
      const raw = localStorage.getItem("jadkul_prefs");
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.semesterId) this.state.semesterId = p.semesterId;
      if (p.scheduleView) {
        this.state.scheduleView = ["table", "grid", "list", "timeline"].includes(p.scheduleView) ? p.scheduleView : "table";
      }
      if (p.theme) this.state.theme = p.theme;
      if (p.style) this.state.style = p.style;
      if (p.mainClass) this.state.mainClass = p.mainClass;
      if (p.hasOnboarded) this.state.hasOnboarded = p.hasOnboarded;
      if (p.myClasses && typeof p.myClasses === "object") {
        const migratedSemesterId = p.semesterId || this.state.semesterId;
        const migrated = {};
        Object.entries(p.myClasses).forEach(([key, kelas]) => {
          migrated[key.includes("::") ? key : `${migratedSemesterId}::${key}`] = kelas;
        });
        this.state.myClasses = migrated;
      }
    } catch(e) {}
  },

  bindEvents() {
    document.getElementById("semesterSelect").addEventListener("change", (e) => this.selectSemester(e.target.value));
    document.getElementById("editMainClassBtn").addEventListener("click", () => this.showWelcomeModal());
    document.getElementById("editMyClassesBtn").addEventListener("click", () => this.showMyClassesModal());
    document.getElementById("resetMyClassesBtn").addEventListener("click", () => {
      if (!confirm("Hapus semua pilihan kelas di Jadwal Saya? Tindakan ini tidak bisa dibatalkan.")) return;
      this.state.myClasses = {};
      this.savePrefs();
      this.renderMySchedule();
    });
    document.querySelectorAll(".theme-btn").forEach(btn => btn.addEventListener("click", () => this.applyTheme(btn.dataset.theme)));
    document.getElementById("styleSelect").addEventListener("change", (e) => this.applyStyle(e.target.value));
    document.getElementById("copySummaryBtn").addEventListener("click", () => this.copyScheduleSummary());
    document.getElementById("copyMyScheduleSummaryBtn").addEventListener("click", () => this.copyMyScheduleSummary());

    const printBtn = document.getElementById("printScheduleBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        const meta = this.getSemesterMeta(this.state.semesterId);
        if (meta) {
          document.getElementById("printTitle").textContent = `JADWAL PERKULIAHAN — ${meta.program} ${meta.label}`;
          document.getElementById("printMeta").textContent = `Tahun Ajaran ${meta.academicYear} | Filter: ${this.state.selectedDay === 'all' ? 'Semua Hari' : this.state.selectedDay} (${this.state.mainClass ? 'Kelas ' + this.state.mainClass : 'Semua Kelas'})`;
        }
        window.print();
      });
    }

    const printMyBtn = document.getElementById("printMyScheduleBtn");
    if (printMyBtn) {
      printMyBtn.addEventListener("click", async () => {
        if (!this._crossSemesterReady) {
          await this.ensureCrossSemesterReadyOnce();
          this.renderMySchedule();
        }
        document.getElementById("printMyTitle").textContent = `JADWAL SAYA — Personalisasi Lintas Semester`;
        document.getElementById("printMyMeta").textContent = `TI/AI UMY | Dicetak ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
        window.print();
      });
    }

    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        this.state.activeTab = btn.dataset.tab;
        document.getElementById(btn.dataset.tab + "Panel").classList.add("active");
        this.renderView(btn.dataset.tab);
      });
    });

    document.querySelectorAll("#scheduleViewTabs .view-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#scheduleViewTabs .view-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.state.scheduleView = btn.dataset.view;
        this.renderView("schedule");
        this.savePrefs();
      });
    });

    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.state.searchQuery = e.target.value;
      this.renderView("schedule");
    });

    document.getElementById("calPrevBtn").addEventListener("click", () => {
      this.state.calShowAll = false;
      this.state.calActiveMonthIndex--;
      if (this.state.calActiveMonthIndex < 0) {
        this.state.calActiveMonthIndex = 11;
        this.state.calYear = (this.state.calYear || 2026) - 1;
      }
      this.renderView("calendar");
    });
    document.getElementById("calNextBtn").addEventListener("click", () => {
      this.state.calShowAll = false;
      this.state.calActiveMonthIndex++;
      if (this.state.calActiveMonthIndex > 11) {
        this.state.calActiveMonthIndex = 0;
        this.state.calYear = (this.state.calYear || 2026) + 1;
      }
      this.renderView("calendar");
    });
    document.getElementById("calTodayBtn").addEventListener("click", () => {
      this.state.calShowAll = false;
      const today = new Date();
      this.state.calYear = today.getFullYear();
      this.state.calActiveMonthIndex = today.getMonth();
      this.renderView("calendar");
    });
    const showAllBtn = document.getElementById("calShowAllBtn") || document.getElementById("calAllBtn");
    if (showAllBtn) {
      showAllBtn.addEventListener("click", () => {
        this.state.calShowAll = !this.state.calShowAll;
        this.renderView("calendar");
        this.closeAllMenus();
      });
    }

    /* ── UX overhaul: dropdown menus + collapsible filter ── */
    const menuPairs = [
      ["headerMoreBtn", "headerMoreMenu"],
      ["scheduleActionsBtn", "scheduleActionsMenu"],
      ["calActionsBtn", "calActionsMenu"],
      ["myScheduleActionsBtn", "myScheduleActionsMenu"]
    ];
    menuPairs.forEach(([btnId, menuId]) => {
      const btn = document.getElementById(btnId);
      const menu = document.getElementById(menuId);
      if (!btn || !menu) return;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = menu.classList.contains("open");
        this.closeAllMenus();
        if (!wasOpen) menu.classList.add("open");
      });
      menu.addEventListener("click", (e) => e.stopPropagation());
      menu.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", () => this.closeAllMenus());
      });
    });
    document.addEventListener("click", () => this.closeAllMenus());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.closeAllMenus(); });

    const schedDetails = document.getElementById("scheduleFilterDetails");
    const schedToggle = document.getElementById("scheduleFilterToggle");
    if (schedDetails && schedToggle) {
      if (window.innerWidth >= 640) schedDetails.open = true;
      schedToggle.addEventListener("click", () => {
        schedDetails.open = !schedDetails.open;
        schedToggle.setAttribute("aria-expanded", String(schedDetails.open));
      });
      schedDetails.addEventListener("toggle", () => {
        schedToggle.setAttribute("aria-expanded", String(schedDetails.open));
      });
    }
    const calDetails = document.getElementById("calFilterDetails");
    if (calDetails && window.innerWidth >= 640) calDetails.open = true;

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (this.state.theme === "system") this.applyTheme("system");
    });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
