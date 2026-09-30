// ============================================================
// Theme & style management
// ============================================================

const STYLES = [
  { id: "default", name: "Default", desc: "Bersih & modern", swatch: ["#4f46e5", "#06b6d4", "#f6f7fb"] },
  { id: "terminal", name: "Terminal", desc: "Monospace hijau", swatch: ["#4ade80", "#fbbf24", "#0a0e0a"] },
  { id: "cyberpunk", name: "Cyberpunk", desc: "Neon kontras tinggi", swatch: ["#ff00e5", "#00f0ff", "#0a0014"] },
  { id: "playful", name: "Playful", desc: "Rounded & hangat", swatch: ["#ff6b6b", "#ffd93d", "#fff8f0"] },
  { id: "y2k", name: "Y2K", desc: "Chrome & pastel", swatch: ["#ec4899", "#06b6d4", "#e0e7ff"] },
  { id: "neobrutalism", name: "Neobrutalism", desc: "Kotak tegas", swatch: ["#fbbf24", "#ec4899", "#fef3c7"] },
];

export function getStyles() { return STYLES; }

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",
    theme === "dark" ? "#0b1020" : "#f6f7fb");
}

export function applyStyle(styleId) {
  document.documentElement.dataset.style = styleId;
  loadFontForStyle(styleId);
}

function loadFontForStyle(styleId) {
  // Hanya style tertentu yang butuh font khusus. Default pakai system font.
  const FONTS = {
    // terminal/cyberpunk pakai monospace system, tidak perlu Google Fonts
    // contoh kalau mau load custom:
    // playful: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap",
  };
  const href = FONTS[styleId];
  if (!href) return;
  const existing = document.querySelector(`link[data-font="${styleId}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.font = styleId;
  document.head.appendChild(link);
}