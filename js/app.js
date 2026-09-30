// ============================================================
// App entry — state, routing, events
// ============================================================

import { DataStore } from "./data.js";
import { applyTheme, applyStyle, getStyles } from "./theme.js";
import { initUI, initToast, openSheet, closeSheet, toast, confirmSheet } from "./ui.js";
import {
  renderNowNext, renderSchedule, renderMine, renderCalendar, renderSearch,
  sessionDetailBody,
} from "./views.js";
import {
  DAYS, escapeHtml, parseISODate, todayKey, debounce, groupBy, sortSessions, kelasMatch,
} from "./utils.js";

const PREFS_KEY = "jadkul_prefs_v2";

const NAV = [
  { id: "schedule", label: "Jadwal", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
  { id: "mine",     label: "Saya",   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id: "calendar", label: "Kalender", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
  { id: "search",   label: "Cari",   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' },
  { id: "menu",     label: "Menu",   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' },
];

class App {
  constructor() {
    this.data = new DataStore();
    this.state = {
      view: "schedule",
      activeSemesterId: null,
      mainClassBySem: {},        // { [semId]: "B" }
      filterDay: "all",
      calYear: null, calMonth: null,
      selectedDate: null,
      query: "",
      searchScope: "active",
      theme: "light",
      style: "default",
      myClasses: {},             // { [semId]: "B" }
      _renderToken: 0,
    };
    this.allSemesters = [];
    this.currentSemester = null;
    this._pendingClassPick = null;
  }

  async boot() {
    initUI();
    initToast();
    this.loadPrefs();
    applyTheme(this.state.theme);
    applyStyle(this.state.style);
    this.renderNav();

    try {
      await this.data.loadIndex();
      if (this.data.usingFallback) {
        toast("Menampilkan data contoh (offline). Periksa koneksi.", { type: "warning", duration: 8000 });
      }
      await this.loadAllSemesters();

      const idx = this.data.getIndex();
      const active = idx.semesters.find((s) => s.status === "active") || idx.semesters[0];
      this.state.activeSemesterId = this.state.activeSemesterId || active?.id;
      await this.selectSemester(this.state.activeSemesterId, { silent: true });

      document.getElementById("skeleton")?.remove();
      document.getElementById("app").hidden = false;
      this.bindEvents();
      this.render();

      // First-time onboarding (non-blocking)
      if (!this.state.onboarded) {
        setTimeout(() => this.showWelcome(), 400);
      }
    } catch (err) {
      console.error(err);
      document.getElementById("skeleton")?.remove();
      document.getElementById("app").hidden = false;
      document.getElementById("viewRoot").innerHTML =
        `<div class="empty"><div class="empty__title">Gagal memuat data</div>
         <div class="empty__text">${escapeHtml(err.message)}</div>
         <button class="btn btn--primary" onclick="location.reload()" style="margin-top:16px">Coba lagi</button></div>`;
    }
  }

  async loadAllSemesters() {
    const idx = this.data.getIndex();
    const results = await Promise.allSettled(
      idx.semesters.map((s) => this.data.loadSemester(s.id))
    );
    this.allSemesters = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
  }

  async selectSemester(id, { silent = false } = {}) {
    if (!id) return;
    this.state.activeSemesterId = id;
    const sem = await this.data.loadSemester(id);
    this.currentSemester = sem;
    // Reset calendar to semester start
    const start = parseISODate(sem.startDate) || new Date();
    this.state.calYear = start.getFullYear();
    this.state.calMonth = start.getMonth();
    if (!silent) this.savePrefs();
  }

  // ------------------------------------------------------------
  // Preferences
  // ------------------------------------------------------------

  loadPrefs() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"); } catch {}
    // migrate dari v1
    const v1 = (() => { try { return JSON.parse(localStorage.getItem("jadkul_prefs") || "{}"); } catch { return {}; } })();
    this.state.theme = raw.theme || v1.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    this.state.style = raw.style || v1.style || "default";
    this.state.activeSemesterId = raw.activeSemesterId || v1.semester || null;
    this.state.mainClassBySem = raw.mainClassBySem || (v1.mainClass && this.state.activeSemesterId
      ? { [this.state.activeSemesterId]: v1.mainClass } : {});
    this.state.myClasses = raw.myClasses || {};
    this.state.onboarded = !!raw.onboarded;
  }

  savePrefs() {
    const p = {
      version: 2,
      theme: this.state.theme,
      style: this.state.style,
      activeSemesterId: this.state.activeSemesterId,
      mainClassBySem: this.state.mainClassBySem,
      myClasses: this.state.myClasses,
      onboarded: this.state.onboarded,
    };
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  }

  get mainClass() {
    return this.state.mainClassBySem[this.state.activeSemesterId] || null;
  }

  set mainClass(v) {
    if (v) this.state.mainClassBySem[this.state.activeSemesterId] = v;
    else delete this.state.mainClassBySem[this.state.activeSemesterId];
    this.savePrefs();
  }

  // ------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------

  renderNav() {
    const tabsHtml = `<div class="tabs-nav__inner" role="tablist">
      ${NAV.map((n) => `
        <button class="tab" role="tab" data-view="${n.id}" aria-selected="${this.state.view === n.id}">
          ${n.icon}<span>${n.label}</span>
        </button>
      `).join("")}
    </div>`;
    document.getElementById("tabsNav").innerHTML = tabsHtml;

    document.getElementById("bottomNav").innerHTML = `<div class="bottom-nav__inner">${
      NAV.map((n) => `
        <button class="nav-item" role="tab" data-view="${n.id}" aria-selected="${this.state.view === n.id}">
          ${n.icon}<span>${n.label}</span>
        </button>
      `).join("")
    }</div>`;
  }

  setView(view) {
    this.state.view = view;
    document.querySelectorAll("[data-view]").forEach((b) => {
      b.setAttribute("aria-selected", String(b.dataset.view === view));
    });
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------

  render() {
    const root = document.getElementById("viewRoot");
    const { view, activeSemesterId } = this.state;

    // Header subtitle
    const sem = this.currentSemester;
    document.getElementById("headerSubtitle").textContent = sem
      ? `${sem.label}${this.mainClass ? ` · Kelas ${this.mainClass}` : ""}`
      : "Memuat…";

    // Now/Next — hanya tampil di view schedule/mine
    const hero = document.getElementById("nowNext");
    if (view === "schedule" || view === "mine") {
      hero.hidden = false;
      renderNowNext(hero, { semester: sem, mainClass: this.mainClass });
    } else {
      hero.hidden = true;
      hero.innerHTML = "";
    }

    const ctx = {
      semester: sem,
      allSemesters: this.allSemesters,
      myClasses: this.state.myClasses,
      activeSemesterId,
      state: this.state,
    };

    switch (view) {
      case "schedule": root.innerHTML = renderSchedule(ctx); break;
      case "mine":     root.innerHTML = renderMine(ctx); break;
      case "calendar": root.innerHTML = renderCalendar(ctx); break;
      case "search":   root.innerHTML = renderSearch(ctx); break;
      case "menu":     root.innerHTML = this.renderMenu(); break;
    }
  }

  renderMenu() {
    const idx = this.data.getIndex();
    const sem = this.currentSemester;
    const styles = getStyles();
    return `
      <div class="stack" style="gap:var(--sp-5)">
        <section>
          <div class="section-title"><h2>Semester</h2></div>
          <div class="menu-list">
            ${idx.semesters.map((s) => `
              <button class="menu-item" data-pick-semester="${escapeHtml(s.id)}">
                <div class="menu-item__icon">${s.status === "active" ? "★" : "▢"}</div>
                <div class="menu-item__body">
                  <div class="menu-item__title">${escapeHtml(s.label)}</div>
                  <div class="menu-item__desc">${escapeHtml(s.startDate)} – ${escapeHtml(s.endDate)}</div>
                </div>
                <div class="menu-item__trail">${s.id === this.state.activeSemesterId ? "✓" : ""}</div>
              </button>
            `).join("")}
          </div>
        </section>

        <section>
          <div class="section-title"><h2>Kelas saya</h2></div>
          <button class="menu-item" data-action="open-class-picker" style="border-radius:var(--r-md);border:1px solid var(--border);background:var(--surface);">
            <div class="menu-item__icon">👤</div>
            <div class="menu-item__body">
              <div class="menu-item__title">Pilih kelas per semester</div>
              <div class="menu-item__desc">${Object.keys(this.state.myClasses).length
                ? Object.entries(this.state.myClasses).map(([k, v]) => `${k}: ${v}`).join(" · ")
                : "Belum ada kelas dipilih"}</div>
            </div>
            <div class="menu-item__trail">›</div>
          </button>
        </section>

        <section>
          <div class="section-title"><h2>Gaya visual</h2></div>
          <div class="style-grid">
            ${styles.map((st) => `
              <button class="style-card" data-style="${escapeHtml(st.id)}" aria-pressed="${this.state.style === st.id}">
                <div class="style-card__swatch">
                  ${st.swatch.map((c) => `<span style="background:${escapeHtml(c)}"></span>`).join("")}
                </div>
                <div>
                  <div class="style-card__name">${escapeHtml(st.name)}</div>
                  <div class="style-card__desc">${escapeHtml(st.desc)}</div>
                </div>
              </button>
            `).join("")}
          </div>
        </section>

        <section>
          <div class="section-title"><h2>Preferensi</h2></div>
          <div class="menu-list">
            <button class="menu-item" data-action="toggle-theme">
              <div class="menu-item__icon">${this.state.theme === "dark" ? "🌙" : "☀️"}</div>
              <div class="menu-item__body">
                <div class="menu-item__title">Tema ${this.state.theme === "dark" ? "gelap" : "terang"}</div>
                <div class="menu-item__desc">Ketuk untuk ganti</div>
              </div>
            </button>
            <button class="menu-item" data-action="export-prefs">
              <div class="menu-item__icon">⬇️</div>
              <div class="menu-item__body">
                <div class="menu-item__title">Ekspor preferensi</div>
                <div class="menu-item__desc">Unduh file JSON</div>
              </div>
            </button>
            <button class="menu-item" data-action="import-prefs">
              <div class="menu-item__icon">⬆️</div>
              <div class="menu-item__body">
                <div class="menu-item__title">Impor preferensi</div>
                <div class="menu-item__desc">Pulihkan dari file JSON</div>
              </div>
            </button>
            <button class="menu-item" data-action="reset-prefs">
              <div class="menu-item__icon">♻️</div>
              <div class="menu-item__body">
                <div class="menu-item__title">Reset preferensi</div>
                <div class="menu-item__desc">Kembalikan ke pengaturan awal</div>
              </div>
            </button>
          </div>
        </section>

        <section>
          <div class="section-title"><h2>Tentang data</h2></div>
          <div class="card">
            <div class="stack-sm">
              <div class="row-between"><span class="muted">Diperbarui</span><span class="mono">${escapeHtml(sem?.lastUpdated || "—")}</span></div>
              <div class="row-between"><span class="muted">Versi data</span><span class="mono">${escapeHtml(sem?.version || "—")}</span></div>
              <div class="row-between"><span class="muted">Sumber</span><span class="tiny">${escapeHtml(sem?.source || "—")}</span></div>
            </div>
          </div>
        </section>

        <p class="tiny" style="text-align:center">${this.data.usingFallback ? "⚠️ Mode data contoh (offline)" : "Jadwal Kuliah · v2.0"}</p>
      </div>
    `;
  }

  // ------------------------------------------------------------
  // Events
  // ------------------------------------------------------------

  bindEvents() {
    // Tab/nav clicks
    document.addEventListener("click", (e) => {
      const navBtn = e.target.closest("[data-view]");
      if (navBtn) { this.setView(navBtn.dataset.view); return; }

      const themeBtn = e.target.closest("#themeToggle, [data-action='toggle-theme']");
      if (themeBtn) { this.toggleTheme(); return; }

      const menuBtn = e.target.closest("#menuBtn");
      if (menuBtn) { this.setView("menu"); return; }

      const brandBtn = e.target.closest("#brandBtn");
      if (brandBtn) { this.setView("schedule"); return; }

      // Session card → detail sheet
      const sessionBtn = e.target.closest(".session");
      if (sessionBtn) {
        try {
          const data = JSON.parse(sessionBtn.dataset.session);
          this.openSessionDetail(data);
        } catch {}
        return;
      }

      // Day filter
      const dayBtn = e.target.closest("[data-day]");
      if (dayBtn) {
        this.state.filterDay = dayBtn.dataset.day;
        this.render();
        return;
      }

      // Class filter (chip)
      const classChip = e.target.closest("[data-class]");
      if (classChip && classChip.classList.contains("chip")) {
        const v = classChip.dataset.class || null;
        this.mainClass = v;
        this.render();
        return;
      }

      // Calendar nav
      const calNav = e.target.closest("[data-cal-nav]");
      if (calNav) { this.navCalendar(calNav.dataset.calNav); return; }

      // Calendar date
      const calCell = e.target.closest("[data-date]");
      if (calCell) { this.openDateDetail(calCell.dataset.date); return; }

      // Semester pick
      const semBtn = e.target.closest("[data-pick-semester]");
      if (semBtn) { this.pickSemester(semBtn.dataset.pickSemester); return; }

      // Style pick
      const styleBtn = e.target.closest("[data-style]");
      if (styleBtn) {
        this.state.style = styleBtn.dataset.style;
        applyStyle(this.state.style);
        this.savePrefs();
        this.render();
        return;
      }

      // Menu actions
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action) this.handleAction(action, e.target.closest("[data-action]"));
    });

    // Search input (debounced)
    const onSearch = debounce((v) => {
      this.state.query = v;
      if (this.state.view !== "search") this.setView("search");
      else this.render();
    }, 150);
    // Search field appears only in search view; attach via delegation
    document.addEventListener("input", (e) => {
      if (e.target.matches("[data-search-input]")) {
        onSearch(e.target.value);
      }
    });
    document.addEventListener("click", (e) => {
      const clear = e.target.closest("[data-search-clear]");
      if (clear) {
        const inp = document.querySelector("[data-search-input]");
        if (inp) { inp.value = ""; inp.focus(); }
        this.state.query = "";
        this.render();
      }
      const scope = e.target.closest("[data-scope]");
      if (scope) { this.state.searchScope = scope.dataset.scope; this.render(); }
    });

    // Swipe on calendar
    let sx = 0, sy = 0, tracking = false;
    document.getElementById("viewRoot").addEventListener("touchstart", (e) => {
      if (this.state.view !== "calendar") return;
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY; tracking = true;
    }, { passive: true });
    document.getElementById("viewRoot").addEventListener("touchend", (e) => {
      if (!tracking) return; tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dy) < 40) {
        this.navCalendar(dx < 0 ? 1 : -1);
      }
    });
  }

  toggleTheme() {
    this.state.theme = this.state.theme === "dark" ? "light" : "dark";
    applyTheme(this.state.theme);
    this.savePrefs();
    this.render();
  }

  navCalendar(dir) {
    if (dir === "today") {
      const d = new Date();
      this.state.calYear = d.getFullYear();
      this.state.calMonth = d.getMonth();
    } else {
      let m = this.state.calMonth + Number(dir);
      let y = this.state.calYear;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      this.state.calMonth = m;
      this.state.calYear = y;
    }
    this.render();
  }

  async pickSemester(id) {
    if (id === this.state.activeSemesterId) return;
    await this.selectSemester(id);
    this.state.filterDay = "all";
    this.render();
    toast(`Beralih ke ${this.currentSemester.label}`, { type: "success" });
  }

  // ------------------------------------------------------------
  // Session detail
  // ------------------------------------------------------------

  openSessionDetail(data) {
    const sem = this.currentSemester;
    const full = sem.sessions.find((s) =>
      s.kode === data.kode && s.kelas === data.kelas && s.hari === data.hari && s.jam === data.jam
    ) || data;

    const body = document.createElement("div");
    body.innerHTML = sessionDetailBody(full, sem, this.data.getEntities());

    body.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "add-class") {
        const k = e.target.closest("[data-kelas]").dataset.kelas;
        this.state.myClasses[this.state.activeSemesterId] = k;
        this.savePrefs();
        toast(`Kelas ${k} ditambahkan ke Jadwal Saya`, {
          type: "success",
          action: { label: "Buka", onClick: () => this.setView("mine") },
        });
        closeSheet();
      }
      if (act === "export-ics") {
        this.exportICS();
      }
    });

    openSheet({ title: full._matkulNama || full.kode, body });
  }

  openDateDetail(iso) {
    const sem = this.currentSemester;
    if (!sem) return;
    const d = parseISODate(iso);
    const dayName = DAYS[(d.getDay() + 6) % 7];
    const holiday = sem.holidays.find((h) => h.date === iso);
    const important = sem.important.find((i) => i.date === iso);
    const sessions = sem.sessions.filter((s) => s.hari === dayName && kelasMatch(s.kelas, this.mainClass));

    const wrap = document.createElement("div");
    wrap.className = "stack";
    wrap.innerHTML = `
      ${holiday ? `<div class="banner banner--danger"><div class="banner__body"><div class="banner__title">${escapeHtml(holiday.name)}</div><div class="tiny">Hari libur</div></div></div>` : ""}
      ${important ? `<div class="banner banner--warning"><div class="banner__body"><div class="banner__title">${escapeHtml(important.name)}</div><div class="tiny">Agenda</div></div></div>` : ""}
      ${sessions.length === 0
        ? `<div class="empty"><div class="empty__text">Tidak ada sesi pada hari ini.</div></div>`
        : `<div class="session-list">${sessions.map((s) => sessionCard(s)).join("")}</div>`}
    `;
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".session");
      if (btn) {
        closeSheet();
        setTimeout(() => this.openSessionDetail(JSON.parse(btn.dataset.session)), 150);
      }
    });
    openSheet({ title: `${dayName}, ${iso}`, body: wrap });
    this.state.selectedDate = iso;
  }

  // ------------------------------------------------------------
  // Menu actions
  // ------------------------------------------------------------

  async handleAction(action, btn) {
    switch (action) {
      case "open-class-picker":
        this.openClassPicker();
        break;
      case "export-prefs":
        this.exportPrefs();
        break;
      case "import-prefs":
        this.importPrefs();
        break;
      case "reset-prefs":
        await this.resetPrefs();
        break;
    }
  }

  openClassPicker() {
    const idx = this.data.getIndex();
    const wrap = document.createElement("div");
    wrap.className = "stack";
    wrap.innerHTML = idx.semesters.map((s) => {
      const sem = this.allSemesters.find((x) => x.id === s.id);
      const classes = sem?.classes || [];
      const current = this.state.myClasses[s.id] || "";
      return `
        <div class="card" style="padding:var(--sp-3)">
          <div style="font-weight:var(--fw-semibold);margin-bottom:var(--sp-2)">${escapeHtml(s.label)}</div>
          <div class="chip-row">
            <button class="chip" data-set-class="${escapeHtml(s.id)}|" aria-pressed="${!current}">Tidak ada</button>
            ${classes.map((c) => `
              <button class="chip" data-set-class="${escapeHtml(s.id)}|${escapeHtml(c)}" aria-pressed="${current === c}">Kelas ${escapeHtml(c)}</button>
            `).join("")}
          </div>
        </div>
      `;
    }).join("");

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-set-class]");
      if (!btn) return;
      const [semId, kelas] = btn.dataset.setClass.split("|");
      if (kelas) this.state.myClasses[semId] = kelas;
      else delete this.state.myClasses[semId];
      this.savePrefs();
      // refresh chip pressed states
      wrap.querySelectorAll(`[data-set-class^="${semId}|"]`).forEach((c) => c.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      toast(kelas ? `Kelas ${kelas} disimpan` : "Kelas dihapus", { type: "success", duration: 2000 });
    });

    openSheet({ title: "Kelas saya", body: wrap });
  }

  exportPrefs() {
    const blob = new Blob([JSON.stringify({
      version: 2,
      theme: this.state.theme,
      style: this.state.style,
      activeSemesterId: this.state.activeSemesterId,
      mainClassBySem: this.state.mainClassBySem,
      myClasses: this.state.myClasses,
    }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jadkul-prefs.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Preferensi diekspor", { type: "success" });
  }

  importPrefs() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files[0]; if (!file) return;
      try {
        const json = JSON.parse(await file.text());
        if (json.theme) this.state.theme = json.theme;
        if (json.style) this.state.style = json.style;
        if (json.activeSemesterId) this.state.activeSemesterId = json.activeSemesterId;
        if (json.mainClassBySem) this.state.mainClassBySem = json.mainClassBySem;
        if (json.myClasses) this.state.myClasses = json.myClasses;
        applyTheme(this.state.theme);
        applyStyle(this.state.style);
        this.savePrefs();
        await this.selectSemester(this.state.activeSemesterId, { silent: true });
        this.render();
        toast("Preferensi diimpor", { type: "success" });
      } catch (e) {
        toast("File tidak valid", { type: "danger" });
      }
    };
    input.click();
  }

  async resetPrefs() {
    const ok = await confirmSheet({
      title: "Reset preferensi?",
      message: "Semua pilihan kelas, tema, dan gaya visual akan dihapus.",
      confirmLabel: "Reset",
      danger: true,
    });
    if (!ok) return;
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem("jadkul_prefs");
    toast("Preferensi direset", {
      type: "warning",
      duration: 5000,
      action: { label: "Muat ulang", onClick: () => location.reload() },
    });
  }

  // ------------------------------------------------------------
  // Welcome (non-blocking)
  // ------------------------------------------------------------

  showWelcome() {
    const body = document.createElement("div");
    body.className = "stack";
    body.innerHTML = `
      <p>Selamat datang! Pilih kelas kamu supaya jadwal pribadi bisa ditampilkan.</p>
      <div class="row" style="gap:var(--sp-2);justify-content:flex-end">
        <button class="btn btn--ghost" data-act="skip">Nanti saja</button>
        <button class="btn btn--primary" data-act="pick">Pilih kelas</button>
      </div>
    `;
    body.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]")?.dataset.act;
      if (act === "skip") { this.state.onboarded = true; this.savePrefs(); closeSheet(); }
      if (act === "pick") { this.state.onboarded = true; this.savePrefs(); closeSheet(); setTimeout(() => this.openClassPicker(), 200); }
    });
    openSheet({ title: "Mulai", body });
  }

  // ------------------------------------------------------------
  // ICS export
  // ------------------------------------------------------------

  exportICS() {
    const sem = this.currentSemester;
    const mainClass = this.mainClass;
    const sessions = sem.sessions.filter((s) => kelasMatch(s.kelas, mainClass));
    if (!sessions.length) { toast("Tidak ada sesi untuk diekspor", { type: "warning" }); return; }

    const dayIdx = { Senin: 0, Selasa: 1, Rabu: 2, Kamis: 3, Jumat: 4, Sabtu: 5 };
    const start = parseISODate(sem.startDate);
    const end = parseISODate(sem.endDate);
    const holidays = new Set(sem.holidays.map((h) => h.date));

    const pad = (n) => String(n).padStart(2, "0");
    const dt = (d, min) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(Math.floor(min / 60))}${pad(min % 60)}00`;

    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//jadkul//ID", "CALSCALE:GREGORIAN"];
    for (const s of sessions) {
      const dow = dayIdx[s.hari];
      if (dow == null) continue;
      // First occurrence on/after start
      const first = new Date(start);
      const diff = (dow - ((first.getDay() + 6) % 7) + 7) % 7;
      first.setDate(first.getDate() + diff);
      const exdates = [];
      for (let d = new Date(first); d <= end; d.setDate(d.getDate() + 7)) {
        const iso = todayKey(d);
        if (holidays.has(iso)) exdates.push(dt(d, s._start));
      }
      lines.push(
        "BEGIN:VEVENT",
        `UID:${s.kode}-${s.kelas}-${s.hari}-${s._start}@jadkul`,
        `DTSTART:${dt(first, s._start)}`,
        `DTEND:${dt(first, s._end)}`,
        `RRULE:FREQ=WEEKLY;UNTIL=${dt(end, 2359)}Z`,
        ...exdates.map((x) => `EXDATE:${x}`),
        `SUMMARY:${s._matkulNama || s.kode} (${s.kelas})`,
        `LOCATION:${s._ruangNama || s.ruang}`,
        `DESCRIPTION:Dosen: ${s._dosenNama || s.dosen}`,
        "END:VEVENT"
      );
    }
    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `jadkul-${sem.id}${mainClass ? "-" + mainClass : ""}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("File .ics diunduh", { type: "success" });
  }
}

// Boot
const app = new App();
app.boot();

// Service worker (opsional, only if served from http(s))
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}