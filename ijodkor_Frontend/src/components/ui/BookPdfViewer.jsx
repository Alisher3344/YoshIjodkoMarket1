import { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Maximize2,
  Minimize2,
  Loader2,
} from "lucide-react";

const PDFJS_VERSION = "4.0.379";
const PDFJS_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;
const PDFJS_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
const PAGE_FLIP_URL = "https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js";

let pdfjsPromise = null;
const loadPdfJs = () => {
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = import(/* @vite-ignore */ PDFJS_URL).then((mod) => {
    mod.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    return mod;
  });
  return pdfjsPromise;
};

let pageFlipPromise = null;
const loadPageFlip = () => {
  if (pageFlipPromise) return pageFlipPromise;
  pageFlipPromise = new Promise((resolve, reject) => {
    if (window.St?.PageFlip) {
      resolve(window.St.PageFlip);
      return;
    }
    const script = document.createElement("script");
    script.src = PAGE_FLIP_URL;
    script.onload = () => {
      if (window.St?.PageFlip) resolve(window.St.PageFlip);
      else reject(new Error("PageFlip yuklab bo'lmadi"));
    };
    script.onerror = () => reject(new Error("PageFlip script xato"));
    document.head.appendChild(script);
  });
  return pageFlipPromise;
};

// PDF sahifani JPEG blob URL'ga aylantirish
const renderPageToUrl = async (pdf, pageNum, targetWidth) => {
  const page = await pdf.getPage(pageNum);
  const viewport1 = page.getViewport({ scale: 1 });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const scale = (targetWidth / viewport1.width) * dpr;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(URL.createObjectURL(blob)),
      "image/jpeg",
      0.85
    );
  });
};

export default function BookPdfViewer({
  url,
  name = "kitob.pdf",
  onClose,
  onDownload,
  lang = "uz",
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [ready, setReady] = useState(false);

  const containerRef = useRef(null);
  const flipBookRef = useRef(null);
  const pageImagesRef = useRef({});
  const pdfRef = useRef(null);

  // Cleanup blob URLs
  const cleanupBlobs = () => {
    Object.values(pageImagesRef.current).forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {}
    });
    pageImagesRef.current = {};
  };

  // PageFlip dispose
  const disposeFlip = () => {
    if (flipBookRef.current) {
      try {
        flipBookRef.current.destroy?.();
      } catch {}
      flipBookRef.current = null;
    }
  };

  // PDF + PageFlip yuklash va ishga tushirish
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setReady(false);
    setError(null);
    setRenderProgress(0);
    cleanupBlobs();

    (async () => {
      try {
        const [pdfjs, PageFlip] = await Promise.all([
          loadPdfJs(),
          loadPageFlip(),
        ]);
        if (cancelled) return;

        const pdf = await pdfjs.getDocument(url).promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);

        // Target width — container hisobiga
        const containerW = containerRef.current?.clientWidth || 1100;
        const containerH = containerRef.current?.clientHeight || 750;
        const pageW = Math.min(Math.floor(containerW / 2) - 20, 700);
        const pageH = Math.floor(pageW * 1.414);

        // Birinchi 6 sahifani render qilish — kitobni darhol ko'rsatish uchun
        const initialPagesToRender = Math.min(6, pdf.numPages);
        for (let p = 1; p <= initialPagesToRender; p++) {
          if (cancelled) return;
          const u = await renderPageToUrl(pdf, p, pageW);
          pageImagesRef.current[p] = u;
          setRenderProgress(Math.round((p / pdf.numPages) * 100));
        }

        if (cancelled) return;

        // PageFlip uchun HTML sahifalarni yaratish
        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";

        for (let p = 1; p <= pdf.numPages; p++) {
          const pageDiv = document.createElement("div");
          pageDiv.className = "book-page";
          pageDiv.dataset.page = String(p);
          pageDiv.style.cssText = `
            background:#fff;
            overflow:hidden;
            display:flex;
            align-items:center;
            justify-content:center;
          `;
          const imgUrl = pageImagesRef.current[p];
          if (imgUrl) {
            pageDiv.innerHTML = `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;display:block" />`;
          } else {
            pageDiv.innerHTML = `
              <div style="display:flex;flex-direction:column;align-items:center;gap:8px;color:#92400e;font-size:12px;font-weight:700">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span>${p}</span>
              </div>
            `;
          }
          containerRef.current.appendChild(pageDiv);
        }

        // PageFlip init
        const flip = new PageFlip(containerRef.current, {
          width: pageW,
          height: pageH,
          size: "stretch",
          minWidth: 280,
          maxWidth: 700,
          minHeight: 400,
          maxHeight: 1000,
          drawShadow: true,
          flippingTime: 700,
          showCover: false,
          mobileScrollSupport: false,
          usePortrait: window.innerWidth < 700,
          autoSize: true,
          maxShadowOpacity: 0.5,
          useMouseEvents: true,
          swipeDistance: 30,
          showPageCorners: true,
          disableFlipByClick: false,
        });

        flip.loadFromHTML(
          containerRef.current.querySelectorAll(".book-page")
        );

        flip.on("flip", (e) => {
          const newPage = e.data + 1;
          setCurrentPage(newPage);
          // Yaqin sahifalarni fonda yuklash
          renderNearbyPages(newPage);
        });

        flipBookRef.current = flip;
        setReady(true);
        setLoading(false);

        // Qolgan sahifalarni fonda yuklash
        renderRemainingPages(initialPagesToRender + 1, pageW, cancelled);
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setError(e.message || "PDF yuklab bo'lmadi");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      disposeFlip();
      cleanupBlobs();
    };
  }, [url]);

  // Fonda qolgan sahifalarni yuklash
  const renderRemainingPages = async (startPage, pageW, cancelled) => {
    const pdf = pdfRef.current;
    if (!pdf) return;
    for (let p = startPage; p <= pdf.numPages; p++) {
      if (cancelled || !pdfRef.current) return;
      if (pageImagesRef.current[p]) continue;
      try {
        const u = await renderPageToUrl(pdf, p, pageW);
        if (cancelled || !pdfRef.current) {
          URL.revokeObjectURL(u);
          return;
        }
        pageImagesRef.current[p] = u;
        updatePageDom(p, u);
        setRenderProgress(Math.round((p / pdf.numPages) * 100));
      } catch (e) {
        console.error(`Page ${p} render error`, e);
      }
    }
  };

  // Yaqin atrof sahifalar (current ± 3) — ustuvor render
  const renderNearbyPages = async (pageNum) => {
    const pdf = pdfRef.current;
    if (!pdf || !containerRef.current) return;
    const pageW =
      containerRef.current.querySelector(".book-page")?.clientWidth || 500;
    const pagesToCheck = [];
    for (let off = 0; off <= 4; off++) {
      pagesToCheck.push(pageNum + off);
      pagesToCheck.push(pageNum - off);
    }
    for (const p of pagesToCheck) {
      if (p < 1 || p > pdf.numPages) continue;
      if (pageImagesRef.current[p]) continue;
      try {
        const u = await renderPageToUrl(pdf, p, pageW);
        pageImagesRef.current[p] = u;
        updatePageDom(p, u);
      } catch {}
    }
  };

  // DOM'dagi sahifa elementini yangilash
  const updatePageDom = (pageNum, imgUrl) => {
    if (!containerRef.current) return;
    const div = containerRef.current.querySelector(
      `.book-page[data-page="${pageNum}"]`
    );
    if (div && !div.querySelector("img")) {
      div.innerHTML = `<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;display:block" />`;
    }
  };

  // Klaviatura
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") flipBookRef.current?.flipNext();
      if (e.key === "ArrowLeft") flipBookRef.current?.flipPrev();
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Resize — PageFlip update
  useEffect(() => {
    if (!ready) return;
    const handler = () => {
      flipBookRef.current?.update?.();
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [ready, fullscreen]);

  const goNext = () => flipBookRef.current?.flipNext();
  const goPrev = () => flipBookRef.current?.flipPrev();
  const goPage = (n) => {
    if (n >= 1 && n <= numPages) {
      flipBookRef.current?.turnToPage(n - 1);
    }
  };

  const progress = numPages ? (currentPage / numPages) * 100 : 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        fullscreen ? "bg-[#1a0e05]" : "bg-black/95 p-2 sm:p-4"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`flex flex-col overflow-hidden ${
          fullscreen
            ? "w-screen h-screen"
            : "w-full max-w-7xl h-[94vh] rounded-2xl shadow-2xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, #2a1810 0%, #4a2d1a 50%, #2a1810 100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-[#1a0e05]/95 to-[#2a1810]/95 backdrop-blur-md border-b border-amber-700/40 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
              📖
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-sm text-amber-50 truncate">
                {name}
              </h3>
              <p className="text-[11px] text-amber-200/70">
                {lang === "uz"
                  ? `${currentPage} / ${numPages} ${
                      loading ? "" : "sahifa"
                    }`
                  : `${currentPage} / ${numPages}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-200 transition"
                title={lang === "uz" ? "Yuklab olish" : "Скачать"}
              >
                <Download size={17} />
              </button>
            )}
            <button
              onClick={() => setFullscreen((f) => !f)}
              className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-200 transition"
            >
              {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-red-500/30 text-amber-50 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Book area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden p-2 sm:p-6">
          {/* Wood-grain table effect background */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at center, rgba(251,191,36,0.15), transparent 70%)",
            }}
          />

          {loading && (
            <div className="text-center relative z-10">
              <div className="relative inline-block mb-4">
                <Loader2 className="animate-spin text-amber-400" size={48} />
              </div>
              <p className="text-amber-100 text-sm font-bold mb-2">
                {lang === "uz"
                  ? "Kitob tayyorlanmoqda..."
                  : "Подготовка книги..."}
              </p>
              {renderProgress > 0 && (
                <div className="w-48 mx-auto h-1.5 bg-amber-900/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="text-center text-red-300 max-w-md relative z-10">
              <p className="text-sm font-bold mb-2">{error}</p>
            </div>
          )}

          {/* Container — PageFlip ishlatadi */}
          <div
            ref={containerRef}
            className={`relative ${loading ? "invisible" : "visible"}`}
            style={{
              width: "100%",
              maxWidth: "1400px",
              height: "100%",
              maxHeight: "100%",
              filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.6))",
            }}
          />

          {/* Navigation arrows */}
          {ready && !loading && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-900/60 hover:bg-amber-700 backdrop-blur-md shadow-2xl flex items-center justify-center text-amber-50 hover:scale-110 active:scale-95 transition z-30 border border-amber-500/40"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-amber-900/60 hover:bg-amber-700 backdrop-blur-md shadow-2xl flex items-center justify-center text-amber-50 hover:scale-110 active:scale-95 transition z-30 border border-amber-500/40"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Bottom controls */}
        {!loading && !error && (
          <div className="flex-shrink-0 px-3 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-[#1a0e05]/95 to-[#2a1810]/95 backdrop-blur-md border-t border-amber-700/40">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-amber-200/80 w-10 text-right">
                {currentPage}
              </span>
              <div className="flex-1 h-1.5 bg-amber-900/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-amber-200/80 w-10">
                {numPages}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={goPrev}
                className="px-3 py-1.5 rounded-lg bg-amber-700/40 hover:bg-amber-600/60 text-amber-50 text-xs font-bold transition border border-amber-500/30"
              >
                ← {lang === "uz" ? "Oldingi" : "Назад"}
              </button>
              <input
                type="number"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={(e) => goPage(parseInt(e.target.value))}
                className="w-16 text-center text-xs font-bold border-2 border-amber-500/40 rounded-lg px-2 py-1.5 outline-none focus:border-amber-400 bg-amber-950/60 text-amber-50"
              />
              <button
                onClick={goNext}
                className="px-3 py-1.5 rounded-lg bg-amber-700/40 hover:bg-amber-600/60 text-amber-50 text-xs font-bold transition border border-amber-500/30"
              >
                {lang === "uz" ? "Keyingi" : "Вперёд"} →
              </button>
            </div>
            {renderProgress < 100 && (
              <div className="mt-2 text-center text-[10px] text-amber-300/60">
                {lang === "uz"
                  ? `Yuklanmoqda: ${renderProgress}%`
                  : `Загрузка: ${renderProgress}%`}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .book-page {
          box-shadow: inset 0 0 30px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
