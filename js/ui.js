// ============================================================
// UI primitives: toast, sheet, confirm
// ============================================================

import { el, escapeHtml } from "./utils.js";

let sheetEl, backdropEl, sheetBody, sheetTitle, lastFocus = null;
let sheetOnClose = null;

export function initUI() {
  sheetEl = document.getElementById("sheet");
  backdropEl = document.getElementById("overlayBackdrop");
  sheetBody = document.getElementById("sheetBody");
  sheetTitle = document.getElementById("sheetTitle");

  document.getElementById("sheetClose").addEventListener("click", closeSheet);
  backdropEl.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheetEl.hidden) closeSheet();
  });

  // Swipe-down to close (mobile)
  let startY = null;
  sheetEl.addEventListener("touchstart", (e) => {
    if (sheetBody.scrollTop > 0) return;
    startY = e.touches[0].clientY;
  }, { passive: true });
  sheetEl.addEventListener("touchmove", (e) => {
    if (startY == null) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) sheetEl.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  sheetEl.addEventListener("touchend", (e) => {
    if (startY == null) return;
    const dy = e.changedTouches[0].clientY - startY;
    sheetEl.style.transform = "";
    if (dy > 120) closeSheet();
    startY = null;
  });
}

export function openSheet({ title, body, onClose }) {
  lastFocus = document.activeElement;
  sheetTitle.textContent = title || "";
  if (typeof body === "string") sheetBody.innerHTML = body;
  else { sheetBody.innerHTML = ""; sheetBody.appendChild(body); }
  sheetEl.hidden = false;
  backdropEl.hidden = false;
  sheetOnClose = onClose || null;
  // Focus trap
  requestAnimationFrame(() => {
    const focusable = sheetEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    (focusable || sheetEl).focus?.();
  });
}

export function closeSheet() {
  if (sheetEl.hidden) return;
  sheetEl.hidden = true;
  backdropEl.hidden = true;
  sheetBody.innerHTML = "";
  if (typeof sheetOnClose === "function") sheetOnClose();
  sheetOnClose = null;
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus?.();
  lastFocus = null;
}

// ------------------------------------------------------------
// Toast
// ------------------------------------------------------------

let toastStack;

export function initToast() {
  toastStack = document.getElementById("toastStack");
}

export function toast(msg, { type = "info", duration = 4000, action } = {}) {
  const node = el(`
    <div class="toast toast--${type}" role="status">
      <div class="toast__msg">${escapeHtml(msg)}</div>
      ${action ? `<button class="toast__action" type="button">${escapeHtml(action.label)}</button>` : ""}
    </div>
  `);
  if (action && typeof action.onClick === "function") {
    node.querySelector(".toast__action").addEventListener("click", () => {
      action.onClick();
      node.remove();
    });
  }
  toastStack.appendChild(node);
  if (duration > 0) {
    setTimeout(() => {
      node.style.transition = "opacity .2s, transform .2s";
      node.style.opacity = "0";
      node.style.transform = "translateY(8px)";
      setTimeout(() => node.remove(), 220);
    }, duration);
  }
  return () => node.remove();
}

// ------------------------------------------------------------
// Confirm (ganti window.confirm)
// ------------------------------------------------------------

export function confirmSheet({ title, message, confirmLabel = "Lanjutkan", danger = false }) {
  return new Promise((resolve) => {
    const body = el(`
      <div class="stack">
        <p>${escapeHtml(message)}</p>
        <div class="row" style="justify-content:flex-end;gap:var(--sp-2)">
          <button class="btn btn--ghost" data-act="cancel">Batal</button>
          <button class="btn ${danger ? "btn--danger" : "btn--primary"}" data-act="ok">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    `);
    let settled = false;
    openSheet({
      title,
      body,
      onClose: () => { if (!settled) { settled = true; resolve(false); } },
    });
    body.querySelector('[data-act="cancel"]').addEventListener("click", () => {
      settled = true; resolve(false); closeSheet();
    });
    body.querySelector('[data-act="ok"]').addEventListener("click", () => {
      settled = true; resolve(true); closeSheet();
    });
  });
}