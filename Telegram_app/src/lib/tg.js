// Telegram WebApp SDK ga osongina kirish.
// Telegram tashqarisida (oddiy brauzerda) ham ishlashi uchun null-safe.

export const tg = (typeof window !== "undefined" && window.Telegram?.WebApp) || null;

export function tgReady() {
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.("#1a56db");
  } catch (e) {
    /* ignore */
  }
}

export function getInitData() {
  return tg?.initData || "";
}

export function getInitUser() {
  return tg?.initDataUnsafe?.user || null;
}

export function showAlert(text) {
  if (tg?.showAlert) tg.showAlert(text);
  else alert(text);
}
