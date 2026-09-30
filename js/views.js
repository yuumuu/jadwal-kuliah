// ============================================================
// View renderers
// ============================================================

import {
  DAYS, DAY_ORDER, MONTHS, MONTHS_SHORT,
  escapeHtml, fmtDateID, parseISODate, todayKey, nowMinutes,
  parseJam, groupBy, sortSessions, fmtCountdown, kelasMatch,
} from "./utils.js";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

export function sessionCard(s, { live = false, conflict = false } = {}) {
  const cls = ["session"];
  if (live) cls.push("session--live");
  if (conflict) cls.push("session--conflict");
  const dosen = s._dosenNama || s.dosen;
  const ruang = s._ruangNama || s.ruang;
  return `
    <button class="${cls.join(" ")}" data-session='${escapeHtml(JSON.stringify({
      kode: s.kode, kelas: s.kelas, hari: s.hari, jam: s.jam, ruang: s.ruang, dosen: s.dosen,
    }))}'>
      <div class="session__time">
        <span>${escapeHtml(s._startStr || "")}</span>
        <small>${escapeHtml(s._endStr || "")}</small>
      </div>
      <div class="session__body">
        <div class="session__title">${escapeHtml(s._matkulNama || s.matkul || s.kode)}</div>
        <div class="session__meta">
          <span>${escapeHtml(s.kode)}</span>
          <span>·</span>
          <span>Kelas ${escapeHtml(s.kelas)}</span>
          <span>·</span>
          <span>${escapeHtml(ruang)}</span>
          <span>·</span>
          <span>${escapeHtml(dosen)}</span>
        </div>
      </div>
    </button>
  `;
}

// ------------------------------------------------------------
// Now / Next hero
// ------------------------------------------------------------

export function renderNowNext(root, { semester, mainClass, now = new Date() }) {
  if (!semester) { root.innerHTML = ""; return; }
  const todayName = DAYS[(now.getDay() + 6) % 7];
  const todayISO = todayKey(now);
  const nowMin = nowMinutes(now);

  const holiday = semester.holidays.find((h) => h.date === todayISO);
  const all = semester.sessions.filter((s) => kelasMatch(s.kelas, mainClass));
  const todaySessions = all.filter((s) => s.hari === todayName);
  const live = todaySessions.find((s) => s._start <= nowMin && nowMin < s._end);
  const next = todaySessions.find((s) => s._start > nowMin);

  const heroLive = live ? liveHero(live, nowMin) : emptyLive(todaySessions.length);
  const heroNext = next ? nextHero(next, nowMin) : emptyNext(todaySessions, holiday);

  root.innerHTML = heroLive + heroNext;
}

function liveHero(s, nowMin) {
  const remain = s._end - nowMin;
  return `
    <div class="hero hero--live">
      <div class="hero__label"><span class="hero__dot"></span> Sedang berlangsung</div>
      <div class="hero__title">${escapeHtml(s._matkulNama || s.kode)}</div>
      <div class="hero__meta">
        <span>${escapeHtml(s._startStr)}–${escapeHtml(s._endStr)}</span>
        <span>·</span>
        <span>${escapeHtml(s._ruangNama || s.ruang)}</span>
        <span>·</span>
        <span>Kelas ${escapeHtml(s.kelas)}</span>
      </div>
      <div class="hero__countdown">
        <span class="tiny">Selesai dalam</span>
        <strong>${escapeHtml(fmtCountdown(remain * 60000))}</strong>
      </div>
    </div>
  `;
}

function emptyLive(count) {
  const msg = count === 0 ? "Tidak ada kelas hari ini." : "Tidak ada kelas yang sedang berlangsung.";
  return `
    <div class="hero">
      <div class="hero__label"><span class="hero__dot"></span> Sekarang</div>
      <div class="hero__empty">${escapeHtml(msg)}</div>
    </div>
  `;
}

function nextHero(s, nowMin) {
  const wait = s._start - nowMin;
  return `
    <div class="hero hero--next">
      <div class="hero__label"><span class="hero__dot"></span> Berikutnya</div>
      <div class="hero__title">${escapeHtml(s._matkulNama || s.kode)}</div>
      <div class="hero__meta">
        <span>${escapeHtml(s._startStr)}–${escapeHtml(s._endStr)}</span>
        <span>·</span>
        <span>${escapeHtml(s._ruangNama || s.ruang)}</span>
        <span>·</span>
        <span>Kelas ${escapeHtml(s.kelas)}</span>
      </div>
      <div class="hero__countdown">
        <span class="tiny">Mulai dalam</span>
        <strong>${escapeHtml(fmtCountdown(wait * 60000))}</strong>
      </div>
    </div>
  `;
}

function emptyNext(todaySessions, holiday) {
  let msg = "Tidak ada kelas lagi hari ini.";
  if (holiday) msg = `Libur: ${holiday.name}`;
  else if (todaySessions.length === 0) msg = "Tidak ada kelas hari ini.";
  return `
    <div class="hero">
      <div class="hero__label"><span class="hero__dot"></span> Berikutnya</div>
      <div class="hero__empty">${escapeHtml(msg)}</div>
    </div>
  `;
}

// ------------------------------------------------------------
// View: Jadwal (per semester)
// ------------------------------------------------------------

export function renderSchedule(ctx) {
  const { semester, state } = ctx;
  if (!semester) return emptyState("Semester belum dipilih", "Pilih semester dari menu.");

  const { filterDay = "all", mainClass = null } = state;
  let sessions = semester.sessions.slice();
  if (mainClass) sessions = sessions.filter((s) => kelasMatch(s.kelas, mainClass));
  if (filterDay !== "all") sessions = sessions.filter((s) => s.hari === filterDay);

  const grouped = groupBy(sessions, (s) => s.hari);
  const todayName = DAYS[(new Date().getDay() + 6) % 7];

  const dayPager = `
    <div class="day-pager" role="tablist" aria-label="Filter hari">
      <button class="day-pager__btn" role="tab" aria-pressed="${filterDay === "all"}" data-day="all">
        <span>Semua</span><small>7 hari</small>
      </button>
      ${DAYS.slice(0, 6).map((d) => {
        const isToday = d === todayName;
        return `
          <button class="day-pager__btn" role="tab" aria-pressed="${filterDay === d}" data-day="${d}">
            <span>${escapeHtml(d.slice(0, 3))}</span>
            <small>${isToday ? "hari ini" : ""}</small>
          </button>
        `;
      }).join("")}
    </div>
  `;

  const classChips = `
    <div class="chip-row" role="group" aria-label="Filter kelas">
      <button class="chip" role="button" aria-pressed="${!mainClass}" data-class="">Semua kelas</button>
      ${semester.classes.map((c) =>
        `<button class="chip" role="button" aria-pressed="${mainClass === c}" data-class="${escapeHtml(c)}">Kelas ${escapeHtml(c)}</button>`
      ).join("")}
    </div>
  `;

  const statStrip = `
    <div class="stat-strip" aria-label="Statistik semester">
      <div class="stat"><div class="stat__label">Sesi</div><div class="stat__value">${sessions.length}</div></div>
      <div class="stat"><div class="stat__label">Matkul</div><div class="stat__value">${new Set(sessions.map((s) => s.kode)).size}</div></div>
      <div class="stat"><div class="stat__label">Kelas</div><div class="stat__value">${mainClass ? escapeHtml(mainClass) : "All"}</div></div>
      <div class="stat"><div class="stat__label">SKS</div><div class="stat__value">${calcSKS(sessions)}</div></div>
    </div>
  `;

  let body;
  if (sessions.length === 0) {
    body = emptyState("Tidak ada sesi", "Coba ubah filter hari atau kelas.");
  } else if (filterDay === "all") {
    body = DAYS.slice(0, 6)
      .filter((d) => grouped.has(d))
      .map((d) => dayGroup(d, grouped.get(d), d === todayName, state))
      .join("");
  } else {
    body = `<div class="session-list">${sessions.map((s) => sessionCard(s)).join("")}</div>`;
  }

  return `
    ${dayPager}
    ${classChips}
    ${statStrip}
    ${body}
  `;
}

function dayGroup(day, sessions, isToday, state) {
  const items = sessions.slice().sort(sortSessions);
  return `
    <section class="day-group" data-day-group="${escapeHtml(day)}">
      <header class="day-group__header">
        <h2 class="day-group__title ${isToday ? "day-group__title--today" : ""}">
          ${escapeHtml(day)}
        </h2>
        <span class="day-group__count">${items.length} sesi</span>
      </header>
      <div class="session-list">
        ${items.map((s) => sessionCard(s)).join("")}
      </div>
    </section>
  `;
}

function calcSKS(sessions) {
  const seen = new Set();
  let total = 0;
  for (const s of sessions) {
    const key = s.kode + "|" + s.kelas;
    if (seen.has(key)) continue;
    seen.add(key);
    total += Number(s.sks || 3);
  }
  return total;
}

// ------------------------------------------------------------
// View: Jadwal Saya (lintas semester)
// ------------------------------------------------------------

export function renderMine(ctx) {
  const { allSemesters, myClasses, activeSemesterId } = ctx;
  if (!myClasses || Object.keys(myClasses).length === 0) {
    return emptyState(
      "Belum ada kelas pilihan",
      "Pilih kelas kamu untuk melihat jadwal lintas semester.",
      `<button class="btn btn--primary" data-action="open-class-picker">Pilih kelas</button>`
    );
  }

  const rows = [];
  for (const sem of allSemesters) {
    const kelas = myClasses[sem.id];
    if (!kelas) continue;
    const sessions = sem.sessions.filter((s) => kelasMatch(s.kelas, kelas));
    for (const s of sessions) rows.push({ ...s, _semId: sem.id, _semLabel: sem.label });
  }
  rows.sort(sortSessions);

  const conflicts = findConflicts(rows);
  const conflictIds = new Set();
  for (const c of conflicts) { conflictIds.add(c.a); conflictIds.add(c.b); }

  const banner = conflicts.length === 0 ? "" : `
    <div class="banner banner--danger">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.86l-8.4 14.55A2 2 0 0 0 3.65 21h16.7a2 2 0 0 0 1.73-2.59L13.7 3.86a2 2 0 0 0-3.42 0Z"/></svg>
      <div class="banner__body">
        <div class="banner__title">${conflicts.length} konflik jadwal</div>
        <details>
          <summary>Lihat detail</summary>
          <ul style="margin:8px 0 0;padding-left:20px">
            ${conflicts.map((c) => `<li>${escapeHtml(c.label)}</li>`).join("")}
          </ul>
        </details>
      </div>
    </div>
  `;

  const grouped = groupBy(rows, (s) => s.hari);
  const todayName = DAYS[(new Date().getDay() + 6) % 7];
  const body = DAYS.slice(0, 6).filter((d) => grouped.has(d)).map((d) => {
    const items = grouped.get(d);
    return `
      <section class="day-group">
        <header class="day-group__header">
          <h2 class="day-group__title ${d === todayName ? "day-group__title--today" : ""}">${escapeHtml(d)}</h2>
          <span class="day-group__count">${items.length} sesi</span>
        </header>
        <div class="session-list">
          ${items.map((s) => sessionCard(s, { conflict: conflictIds.has(s._semId + "|" + s.kode + "|" + s.kelas + "|" + s.hari + "|" + s.jam) })).join("")}
        </div>
      </section>
    `;
  }).join("");

  return `${banner}${body}`;
}

function findConflicts(rows) {
  const out = [];
  const byDay = groupBy(rows, (s) => s.hari);
  for (const [day, list] of byDay) {
    const sorted = list.slice().sort((a, b) => a._start - b._start);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i], b = sorted[j];
        if (b._start >= a._end) break;
        if (a.kode === b.kode) continue;
        out.push({
          a: keyOf(a), b: keyOf(b),
          label: `${day} ${a._startStr}–${a._endStr}: ${a._matkulNama} (${a.kelas}) bentrok dengan ${b._matkulNama} (${b.kelas})`,
        });
      }
    }
  }
  return out;
}

function keyOf(s) { return s._semId + "|" + s.kode + "|" + s.kelas + "|" + s.hari + "|" + s.jam; }

// ------------------------------------------------------------
// View: Kalender
// ------------------------------------------------------------

export function renderCalendar(ctx) {
  const { semester, state } = ctx;
  if (!semester) return emptyState("Semester belum dipilih", "Pilih semester dari menu.");

  const { calYear, calMonth, filterDay } = state;
  const start = parseISODate(semester.startDate);
  const end = parseISODate(semester.endDate);

  const firstOfMonth = new Date(calYear, calMonth, 1);
  const startDow = (firstOfMonth.getDay() + 6) % 7; // Senin=0
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const cells = [];
  // leading days from prev month
  for (let i = 0; i < startDow; i++) {
    const d = new Date(calYear, calMonth, 1 - (startDow - i));
    cells.push({ date: d, outside: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ date: new Date(calYear, calMonth, i), outside: false });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), outside: true });
  }

  const holidayMap = new Map(semester.holidays.map((h) => [h.date, h]));
  const importantMap = new Map(semester.important.map((i) => [i.date, i]));
  const inRange = (d) => start && end && d >= start && d <= end;

  const sessionDays = new Set(semester.sessions.map((s) => s.hari));

  const today = todayKey();

  const grid = cells.map(({ date, outside }) => {
    const iso = todayKey(date);
    const isToday = iso === today;
    const isHoliday = holidayMap.has(iso);
    const isImportant = importantMap.has(iso);
    const isSelected = state.selectedDate === iso;
    const dow = (date.getDay() + 6) % 7;
    const hasClass = inRange(date) && sessionDays.has(DAYS[dow]) && !isHoliday;
    const cls = ["cal-cell"];
    if (outside) cls.push("cal-cell--outside");
    if (isToday) cls.push("cal-cell--today");
    if (isHoliday) cls.push("cal-cell--holiday");
    if (isImportant) cls.push("cal-cell--important");
    if (isSelected) cls.push("cal-cell--selected");
    return `
      <button class="${cls.join(" ")}" data-date="${iso}" ${outside ? 'tabindex="-1"' : ""}>
        <span>${date.getDate()}</span>
        <span class="cal-cell__dots">
          ${hasClass ? '<span class="cal-cell__dot"></span>' : ""}
          ${isHoliday ? '<span class="cal-cell__dot"></span>' : ""}
        </span>
      </button>
    `;
  }).join("");

  const monthLabel = `${MONTHS[calMonth]} ${calYear}`;
  const rangeLabel = start && end
    ? `${fmtDateID(semester.startDate, { short: true })} – ${fmtDateID(semester.endDate, { short: true })}`
    : "";

  const monthHolidays = semester.holidays.filter((h) => {
    const d = parseISODate(h.date);
    return d && d.getFullYear() === calYear && d.getMonth() === calMonth;
  });

  return `
    <div class="cal-header">
      <div>
        <div class="cal-title">${escapeHtml(monthLabel)}<small>${escapeHtml(rangeLabel)}</small></div>
      </div>
      <div class="cal-nav">
        <button class="icon-btn" data-cal-nav="-1" aria-label="Bulan sebelumnya">‹</button>
        <button class="icon-btn" data-cal-nav="today" aria-label="Hari ini">•</button>
        <button class="icon-btn" data-cal-nav="1" aria-label="Bulan berikutnya">›</button>
      </div>
    </div>
    <div class="cal-grid" role="grid">
      ${["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map((d) => `<div class="cal-dow">${d}</div>`).join("")}
      ${grid}
    </div>
    <div class="cal-legend">
      <span><i style="background:var(--primary)"></i> Ada kuliah</span>
      <span><i style="background:var(--danger)"></i> Libur</span>
      <span><i style="background:var(--warning)"></i> Agenda</span>
    </div>
    ${monthHolidays.length ? `
      <div class="section-title" style="margin-top:var(--sp-5)">
        <h2>Libur bulan ini</h2>
      </div>
      <div class="stack-sm">
        ${monthHolidays.map((h) => `
          <div class="card" style="padding:var(--sp-3)">
            <div class="row-between">
              <strong>${escapeHtml(h.name)}</strong>
              <span class="tiny mono">${escapeHtml(fmtDateID(h.date, { short: true }))}</span>
            </div>
          </div>
        `).join("")}
      </div>
    ` : ""}
  `;
}

// ------------------------------------------------------------
// View: Cari
// ------------------------------------------------------------

export function renderSearch(ctx) {
  const { allSemesters, state } = ctx;
  const q = (state.query || "").trim().toLowerCase();
  const { searchScope = "active", activeSemesterId } = state;

  const results = [];
  for (const sem of allSemesters) {
    if (searchScope === "active" && sem.id !== activeSemesterId) continue;
    for (const s of sem.sessions) {
      const hay = [
        s._matkulNama, s.kode, s.kelas, s.hari, s.jam,
        s._dosenNama, s.dosen, s._ruangNama, s.ruang,
      ].join(" ").toLowerCase();
      if (!q || hay.includes(q)) results.push({ ...s, _sem: sem });
    }
  }
  results.sort(sortSessions);

  const grouped = groupBy(results, (s) => s._sem.id);

  const scopeChips = `
    <div class="chip-row" role="group" aria-label="Cakupan pencarian">
      <button class="chip" aria-pressed="${searchScope === "active"}" data-scope="active">Semester aktif</button>
      <button class="chip" aria-pressed="${searchScope === "all"}" data-scope="all">Semua semester</button>
    </div>
  `;

  const body = results.length === 0
    ? emptyState("Tidak ada hasil", q ? `Tidak ditemukan "${escapeHtml(q)}".` : "Ketik untuk mencari matkul, dosen, ruang, atau kelas.")
    : [...grouped.entries()].map(([semId, items]) => {
        const sem = items[0]._sem;
        return `
          <section class="day-group">
            <header class="day-group__header">
              <h2 class="day-group__title">${escapeHtml(sem.label)}</h2>
              <span class="day-group__count">${items.length} hasil</span>
            </header>
            <div class="session-list">
              ${items.map((s) => sessionCard(s)).join("")}
            </div>
          </section>
        `;
      }).join("");

  return `${scopeChips}${body}`;
}

// ------------------------------------------------------------
// Shared empty state
// ------------------------------------------------------------

function emptyState(title, text, extra = "") {
  return `
    <div class="empty">
      <div class="empty__icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      </div>
      <div class="empty__title">${escapeHtml(title)}</div>
      <div class="empty__text">${text}</div>
      ${extra ? `<div style="margin-top:var(--sp-4)">${extra}</div>` : ""}
    </div>
  `;
}

// ------------------------------------------------------------
// Detail sheet content
// ------------------------------------------------------------

export function sessionDetailBody(s, semester, entities) {
  const dosen = entities?.dosen?.items?.find((d) => d.kode === s.dosen);
  const ruang = entities?.ruang?.items?.find((r) => r.kode === s.ruang);
  const matkul = entities?.matkul?.items?.find((m) => m.kode === s.kode);
  return `
    <div class="stack">
      <div>
        <div class="tiny">Mata kuliah</div>
        <div style="font-size:var(--fs-lg);font-weight:var(--fw-bold)">${escapeHtml(matkul?.nama || s._matkulNama || s.kode)}</div>
        <div class="muted">${escapeHtml(s.kode)} · ${escapeHtml(s.sks || matkul?.sks || 3)} SKS</div>
      </div>
      <div class="divider"></div>
      <div class="row-between"><span class="muted">Hari</span><strong>${escapeHtml(s.hari)}</strong></div>
      <div class="row-between"><span class="muted">Jam</span><strong class="mono">${escapeHtml(s._startStr)}–${escapeHtml(s._endStr)}</strong></div>
      <div class="row-between"><span class="muted">Kelas</span><strong>${escapeHtml(s.kelas)}</strong></div>
      <div class="row-between"><span class="muted">Ruang</span><strong>${escapeHtml(ruang?.nama || s._ruangNama || s.ruang)}</strong></div>
      <div class="row-between"><span class="muted">Dosen</span><strong>${escapeHtml(dosen?.nama || s._dosenNama || s.dosen)}</strong></div>
      ${dosen?.email ? `<div class="row-between"><span class="muted">Email</span><a href="mailto:${escapeHtml(dosen.email)}">${escapeHtml(dosen.email)}</a></div>` : ""}
      <div class="divider"></div>
      <div class="row" style="gap:var(--sp-2)">
        <button class="btn btn--soft" data-act="add-class" data-kelas="${escapeHtml(s.kelas)}">Jadikan kelas saya</button>
        ${semester?.holidays?.length ? `<button class="btn btn--ghost" data-act="export-ics">Ekspor .ics</button>` : ""}
      </div>
    </div>
  `;
}