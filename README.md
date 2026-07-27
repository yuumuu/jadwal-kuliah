# JadKul — Jadwal Kuliah TI UMY

Aplikasi web statis untuk melihat jadwal kuliah program studi Teknologi Informasi Universitas Muhammadiyah Yogyakarta.

## Fitur

- **7 View Mode** — Table, Grid Cards, Card List, Compact, Calendar Month, Agenda, Timeline
- **Multi-Semester** — Setiap semester punya file JSON sendiri, pilih via landing page atau dropdown
- **Class Picker** — Dialog pemilihan kelas default muncul saat ganti semester
- **Filter Kelas** — Multi-select chip, bisa pilih beberapa kelas sekaligus
- **Filter Hari** — Single-select chip, filter per hari
- **Dark Mode** — Toggle Dark / Light / System, tersimpan ke localStorage
- **5 Style Themes** — Default, Playful, Elegant, Minimal, Bento, Formal
- **Preferensi Tersimpan** — View mode, tema, semester, dan kelas utama disimpan otomatis
- **Mobile-First** — Responsive design, FAB untuk navigasi cepat di mobile
- **Lazy Loading** — Data semester dimuat saat dipilih, tidak semua sekaligus
- **Fallback Offline** — Jika JSON gagal dimuat, app tetap jalan dengan data inline
- **Libur Nasional 2026** — Kalender menandai hari libur nasional & tanggal penting
- **Zero Dependencies** — Hanya HTML + CSS + JS, tanpa framework

## Cara Pakai

### 1. Buka Langsung

```bash
# Cukup buka index.html di browser
open index.html
```

> **Catatan:** Fitur `fetch()` untuk memuat `data/jadwal.json` membutuhkan server HTTP.
> Jika dibuka langsung sebagai file (`file://`), app akan menggunakan data fallback inline.

### 2. Pakai Server Lokal

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Lalu buka `http://localhost:8000`.

### 3. Deploy ke GitHub Pages

```bash
git init
git add .
git commit -m "init: jadwal kuliah app"
git branch -M main
git remote add origin https://github.com/USERNAME/jadwal-kuliah.git
git push -u origin main
```

Aktifkan GitHub Pages di Settings → Source → Main branch.

## Struktur File

```
jadwal-kuliah/
├── index.html              # Aplikasi utama (single-page)
├── data/
│   ├── jadwal.json         # Index file (metadata semester + path ke file detail)
│   ├── s5-gasal-2026.json  # Data detail semester 5
│   └── template.json       # Template kosong untuk semester baru
└── README.md               # Dokumentasi ini
```

## Format Data JSON

### Index File (`data/jadwal.json`)

File index berisi metadata semua semester dan path ke file detail:

```json
{
  "semesters": [
    {
      "id": "s5-gasal-2026",
      "label": "Semester 5",
      "period": "Gasal",
      "academicYear": "2026/2027",
      "program": "TI",
      "semester": 5,
      "startDate": "2026-09-01",
      "endDate": "2027-01-15",
      "file": "data/s5-gasal-2026.json"
    }
  ]
}
```

### Detail File (`data/s5-gasal-2026.json`)

File detail berisi jadwal kuliah, libur, dan tanggal penting:

```jsonc
{
  "semesters": [
    {
      // ── Identitas Semester ──
      "id": "s5-gasal-2026",          // Unique ID (snake_case)
      "label": "Semester 5",          // Nama tampil
      "period": "Gasal",              // Gasal / Genap
      "academicYear": "2026/2027",    // Tahun ajaran
      "program": "TI",                // Program studi
      "semester": 5,                  // Nomor semester

      // ── Rentang Waktu ──
      "startDate": "2026-09-01",      // Format YYYY-MM-DD
      "endDate": "2027-01-15",

      // ── Warna per Mata Kuliah ──
      "subjectColors": {
        "TI501": "#3b82f6",          // Hex color
        "TI502": "#8b5cf6",
        "TI503": "#06b6d4",
        "TI504": "#10b981",
        "TI505": "#f59e0b",
        "TI506": "#ef4444",
        "TI507": "#ec4899",
        "TI508": "#6366f1"
      },

      // ── Hari Libur Nasional ──
      "holidays": [
        {
          "date": "2026-01-01",       // Format YYYY-MM-DD
          "name": "Tahun Baru Masehi",
          "type": "national"          // national / religious / observance
        }
        // ... tambahkan libur lainnya
      ],

      // ── Tanggal Penting Akademik ──
      "importantDates": [
        {
          "date": "2026-09-07",
          "name": "Awal Perkuliahan",
          "type": "academic"          // academic / exam / registration
        }
      ],

      // ── Jadwal Kuliah ──
      "schedules": {
        "Senin": [
          {
            "kode": "TI506",              // Kode mata kuliah
            "matkul": "Manajemen Proyek", // Nama mata kuliah
            "kelas": "D",                 // Kelas (bisa multi: "D,E,F")
            "jam": "08.50-11.30",         // Format: HH.MM-HH.MM
            "ruang": "F6.102",            // Ruang (atau "-" jika online)
            "dosen": "HQ/WS"             // Dosen (atau "-" jika TBD)
          }
          // ... sesi lainnya
        ],
        "Selasa": [ /* ... */ ],
        "Rabu":   [ /* ... */ ],
        "Kamis":  [ /* ... */ ],
        "Jumat":  [ /* ... */ ],
        "Sabtu":  [ /* ... */ ]
      }
    }

    // ── Tambah semester lain ──
    // {
    //   "id": "s3-gasal-2025",
    //   "label": "Semester 3",
    //   ...
    // }
  ]
}
```

### Contoh Data Satu Sesi

```json
{
  "kode": "TI503",
  "matkul": "Pengembangan Web Service",
  "kelas": "B",
  "jam": "08.50-11.30",
  "ruang": "F4.002",
  "dosen": "DP/QA"
}
```

### Multi-Class Entry

Untuk sesi yang diikuti beberapa kelas sekaligus, gunakan koma:

```json
{
  "kode": "TI505",
  "matkul": "Tata Kelola Teknologi Informasi",
  "kelas": "A,B,C",
  "jam": "13.20-16.20",
  "ruang": "-",
  "dosen": "CO"
}
```

## Format Data CSV

Jika lebih nyaman pakai CSV, berikut template-nya:

```csv
semester,kode,matkul,kelas,hari,jam,ruang,dosen
S5-Gasal-2026,TI506,Manajemen Proyek,D,Senin,08.50-11.30,F6.102,HQ/WS
S5-Gasal-2026,TI503,Pengembangan Web Service,B,Senin,08.50-11.30,F4.002,DP/QA
S5-Gasal-2026,TI501,Pengembangan Aplikasi Web,E,Senin,08.50-11.30,F4.003,AS
S5-Gasal-2026,TI506,Manajemen Proyek,E,Senin,12.10-15.00,F6.102,HQ
S5-Gasal-2026,TI508,Technopreneurship,D,Senin,13.20-15.00,F4.001,FF
S5-Gasal-2026,TI503,Pengembangan Web Service,A,Senin,13.20-16.20,F4.002,DP
S5-Gasal-2026,TI501,Pengembangan Aplikasi Web,C,Senin,13.20-16.20,F4.003,AS
S5-Gasal-2026,TI506,Manajemen Proyek,A,Selasa,07.50-10.30,F4.001,HQ
S5-Gasal-2026,TI503,Pengembangan Web Service,E,Selasa,08.50-11.30,F6.102,FF
S5-Gasal-2026,TI506,Manajemen Proyek,C,Selasa,09.40-13.10,F6.202,HQ
S5-Gasal-2026,TI503,Pengembangan Web Service,D,Selasa,13.20-16.20,F6.102,DP/AM
S5-Gasal-2026,TI506,Manajemen Proyek,B,Selasa,13.20-16.20,F6.203,HQ/WS
S5-Gasal-2026,TI508,Technopreneurship,A,Selasa,13.20-15.00,F4.001,FF
S5-Gasal-2026,TI504,WAN dan Teknologi Jaringan,C,Selasa,15.30-17.10,F4.001,FF
S5-Gasal-2026,TI501,Pengembangan Aplikasi Web,A,Rabu,08.50-11.30,-,AS
S5-Gasal-2026,TI503,Pengembangan Web Service,C,Rabu,08.50-11.30,-,DP
S5-Gasal-2026,TI508,Technopreneurship,E,Rabu,08.50-11.30,-,EI
S5-Gasal-2026,TI501,Pengembangan Aplikasi Web,B,Rabu,13.20-16.20,-,AS
S5-Gasal-2026,TI504,WAN dan Teknologi Jaringan,A,Rabu,13.20-15.00,-,EP
S5-Gasal-2026,TI508,Technopreneurship,C,Rabu,13.20-15.00,-,FF
S5-Gasal-2026,TI504,WAN dan Teknologi Jaringan,E,Kamis,07.00-08.40,-,FF
S5-Gasal-2026,TI505,Tata Kelola Teknologi Informasi,D,E,F,Kamis,08.50-11.30,-,CO
S5-Gasal-2026,TI502,Pengembangan Aplikasi Mobile,B,Kamis,08.50-11.30,-,HS
S5-Gasal-2026,TI505,Tata Kelola Teknologi Informasi,A,B,C,Kamis,13.20-16.20,-,CO
S5-Gasal-2026,TI501,Pengembangan Aplikasi Web,D,Kamis,13.20-16.20,-,QA
S5-Gasal-2026,TI502,Pengembangan Aplikasi Mobile,E,Kamis,13.20-16.20,-,RG
S5-Gasal-2026,TI504,WAN dan Teknologi Jaringan,B,Kamis,16.20-18.00,-,EP
S5-Gasal-2026,TI502,Pengembangan Aplikasi Mobile,C,Kamis,16.20-19.20,-,HS
S5-Gasal-2026,TI502,Pengembangan Aplikasi Mobile,A,Jumat,07.50-10.30,-,HS
S5-Gasal-2026,TI504,WAN dan Teknologi Jaringan,D,Jumat,08.50-10.30,-,FF
S5-Gasal-2026,TI502,Pengembangan Aplikasi Mobile,D,Jumat,13.20-16.20,-,HS
S5-Gasal-2026,TI507,Bahasa Inggris untuk Membaca Naskah Akademik,B,Sabtu,07.00-08.40,-,TW
S5-Gasal-2026,TI507,Bahasa Inggris untuk Membaca Naskah Akademik,F,Sabtu,07.00-08.40,-,-
S5-Gasal-2026,TI507,Bahasa Inggris untuk Membaca Naskah Akademik,D,Sabtu,08.50-10.30,-,TW
S5-Gasal-2026,TI507,Bahasa Inggris untuk Membaca Naskah Akademik,C,Sabtu,08.50-10.30,-,TW
S5-Gasal-2026,TI507,Bahasa Inggris untuk Membaca Naskah Akademik,A,Sabtu,10.40-13.10,-,TW
S5-Gasal-2026,TI507,Bahasa Inggris untuk Membaca Naskah Akademik,E,Sabtu,13.20-15.00,-,TW
```

## Cara Menambah Semester Baru

1. Copy `data/template.json` ke `data/s{N}-{period}-{year}.json` (contoh: `data/s3-gasal-2025.json`)
2. Isi file detail dengan jadwal, libur, dan tanggal penting
3. Buka `data/jadwal.json` (index file)
4. Tambah objek baru di array `semesters`:
   ```json
   {
     "id": "s3-gasal-2025",
     "label": "Semester 3",
     "period": "Gasal",
     "academicYear": "2025/2026",
     "program": "TI",
     "semester": 3,
     "startDate": "2025-09-01",
     "endDate": "2026-01-15",
     "file": "data/s3-gasal-2025.json"
   }
   ```
5. Save semua file, refresh browser

### Menambah Semester via Index

Untuk menambah semester baru, cukup tambahkan entry di `data/jadwal.json` dan buat file detail-nya:

```jsonc
// data/jadwal.json
{
  "semesters": [
    // ... semester yang sudah ada
    {
      "id": "s3-gasal-2025",
      "label": "Semester 3",
      "period": "Gasal",
      "academicYear": "2025/2026",
      "program": "TI",
      "semester": 3,
      "startDate": "2025-09-01",
      "endDate": "2026-01-15",
      "file": "data/s3-gasal-2025.json"  // ← file detail
    }
  ]
}
```

## localStorage Keys

| Key | Value | Default |
|-----|-------|---------|
| `jadkul_prefs` | JSON object | `{}` |

Object preferences:
```jsonc
{
  "semesterId": "s5-gasal-2026",  // ID semester aktif
  "scheduleView": "table",        // table / grid / list / compact
  "calendarView": "month",        // month / agenda / timeline
  "theme": "system",              // light / dark / system
  "style": "default",             // default / playful / elegant / minimal / bento / formal
  "mainClass": "B"                // Kelas utama (default filter)
}
```

## Tech Stack

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- Vanilla JavaScript (ES2020+)
- [Lucide Icons](https://lucide.dev/) via CDN
- [IBM Plex](https://www.ibm.com/plex/) fonts via Google Fonts

## Lisensi

MIT License — silakan pakai dan modifikasi sesuai kebutuhan.
