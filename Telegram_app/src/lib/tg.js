// Telegram WebApp SDK — null-safe wrapper.

export const tg =
  (typeof window !== "undefined" && window.Telegram?.WebApp) || null;

export function tgReady() {
  if (!tg) return;
  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.("secondary_bg_color");
    tg.enableClosingConfirmation?.();
  } catch {
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

export function showConfirm(text) {
  return new Promise((resolve) => {
    if (tg?.showConfirm) {
      tg.showConfirm(text, (ok) => resolve(!!ok));
    } else {
      resolve(window.confirm(text));
    }
  });
}

// Haptic feedback — micro-interactions
export const haptic = {
  light:    () => tg?.HapticFeedback?.impactOccurred?.("light"),
  medium:   () => tg?.HapticFeedback?.impactOccurred?.("medium"),
  heavy:    () => tg?.HapticFeedback?.impactOccurred?.("heavy"),
  success:  () => tg?.HapticFeedback?.notificationOccurred?.("success"),
  warning:  () => tg?.HapticFeedback?.notificationOccurred?.("warning"),
  error:    () => tg?.HapticFeedback?.notificationOccurred?.("error"),
  select:   () => tg?.HapticFeedback?.selectionChanged?.(),
};

// MainButton — Telegram'ning native pastki tugmasi
export const mainButton = {
  show: (text, onClick, opts = {}) => {
    if (!tg?.MainButton) return;
    tg.MainButton.setText(text);
    if (opts.color) tg.MainButton.color = opts.color;
    if (opts.disabled) tg.MainButton.disable();
    else tg.MainButton.enable();
    tg.MainButton.show();
    if (onClick) {
      tg.MainButton.offClick();
      tg.MainButton.onClick(onClick);
    }
  },
  hide: () => tg?.MainButton?.hide(),
  setLoading: (loading) => {
    if (loading) tg?.MainButton?.showProgress();
    else tg?.MainButton?.hideProgress();
  },
};

// BackButton
export const backButton = {
  show: (onClick) => {
    if (!tg?.BackButton) return;
    tg.BackButton.show();
    if (onClick) {
      tg.BackButton.offClick();
      tg.BackButton.onClick(onClick);
    }
  },
  hide: () => tg?.BackButton?.hide(),
};

// Color helpers
export function setHeaderColor(color) {
  try {
    tg?.setHeaderColor?.(color);
  } catch {
    /* ignore */
  }
}
