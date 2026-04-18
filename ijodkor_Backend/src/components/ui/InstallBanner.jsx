import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { useLangStore } from "../../store";

export default function InstallBanner() {
  const { t } = useLangStore();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("pwa-dismissed")) return;
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
      <div className="bg-[#4c1d95] text-white rounded-2xl p-4 shadow-2xl border border-[#ffffff]/20 flex items-center gap-3 animate-fadeInUp">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#ffffff] shrink-0">
          <img
            src="/logo.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">{t("install_banner")}</p>
          <p className="text-white/50 text-xs mt-0.5">Yosh Ijodkor</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1 bg-[#ffffff] text-[#4c1d95] text-xs font-black px-3 py-2 rounded-xl transition-all hover:scale-105 hover:bg-[#8b5cf6]"
          >
            <Download className="w-3.5 h-3.5" />
            {t("install_btn")}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}
