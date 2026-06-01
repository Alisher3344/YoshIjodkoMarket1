import { useEffect, useRef, useState } from "react";

let ytApiPromise = null;
const loadYouTubeApi = () => {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
  return ytApiPromise;
};

// Custom YouTube player — branding to'liq yashirilgan
export default function YouTubePlayer({ videoId, autoplay = true }) {
  const wrapperRef = useRef(null);
  const targetRef = useRef(null);
  const playerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [quality, setQuality] = useState("auto");
  const [availableQualities, setAvailableQualities] = useState([]);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [speed, setSpeed] = useState(1);

  const hideTimerRef = useRef(null);

  // Player init
  useEffect(() => {
    let cancelled = false;
    let player = null;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !targetRef.current) return;

      player = new YT.Player(targetRef.current, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
          showinfo: 0,
          fs: 0,
          disablekb: 1,
          cc_load_policy: 0,
          autohide: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            setIsReady(true);
            setDuration(e.target.getDuration());
            setVolume(e.target.getVolume());
            try {
              const qs = e.target.getAvailableQualityLevels?.() || [];
              setAvailableQualities(qs);
              setQuality(e.target.getPlaybackQuality?.() || "auto");
            } catch {}
            // Iframe'ni to'liq container hajmiga keltirish
            const iframe = e.target.getIframe();
            if (iframe) {
              iframe.style.position = "absolute";
              iframe.style.top = "0";
              iframe.style.left = "0";
              iframe.style.width = "100%";
              iframe.style.height = "100%";
              iframe.style.border = "0";
            }
            if (autoplay) {
              try {
                e.target.playVideo();
              } catch {}
            }
          },
          onStateChange: (e) => {
            if (e.data === 1) {
              setPlaying(true);
              // Sifatlar play boshlangach to'la chiqadi
              try {
                const qs =
                  playerRef.current?.getAvailableQualityLevels?.() || [];
                if (qs.length > 0) setAvailableQualities(qs);
              } catch {}
            } else {
              setPlaying(false);
            }
          },
          onPlaybackQualityChange: (e) => {
            setQuality(e.data);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
        playerRef.current = null;
      } catch {}
    };
  }, [videoId]);

  // Progress tracking
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      try {
        const t = playerRef.current?.getCurrentTime?.();
        if (typeof t === "number") setCurrentTime(t);
      } catch {}
    }, 250);
    return () => clearInterval(interval);
  }, [isReady]);

  // Tashqarini bosganda quality menu yopish
  useEffect(() => {
    if (!showQualityMenu) return;
    const handler = (e) => {
      // Faqat player ichidagi klikni inkor qilamiz
      if (!wrapperRef.current?.contains(e.target)) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showQualityMenu]);

  // Auto-hide controls (faqat o'ynayotganda)
  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2500);
    }
  };

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [playing]);

  const togglePlay = () => {
    if (!isReady) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!isReady) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const handleSeek = (e) => {
    if (!isReady) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const seekTime = ratio * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const handleVolume = (e) => {
    const v = parseInt(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume?.(v);
    if (v === 0) {
      playerRef.current?.mute?.();
      setMuted(true);
    } else if (muted) {
      playerRef.current?.unMute?.();
      setMuted(false);
    }
  };

  // Sifat (quality) labellari
  const QUALITY_LABELS = {
    highres: "4K+",
    hd2160: "2160p",
    hd1440: "1440p",
    hd1080: "1080p",
    hd720: "720p",
    large: "480p",
    medium: "360p",
    small: "240p",
    tiny: "144p",
    auto: "Avto",
  };

  const changeQuality = (q) => {
    if (!isReady || !playerRef.current) return;
    try {
      playerRef.current.setPlaybackQuality?.(q);
      setQuality(q);
    } catch {}
    setShowQualityMenu(false);
  };

  const changeSpeed = (rate) => {
    if (!isReady || !playerRef.current) return;
    try {
      playerRef.current.setPlaybackRate?.(rate);
      setSpeed(rate);
    } catch {}
    setShowQualityMenu(false);
  };

  const enterFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black overflow-hidden select-none"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Iframe target */}
      <div
        ref={targetRef}
        className="absolute inset-0"
      />

      {/* Click capture — video bosilganda play/pause */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 cursor-pointer z-10"
      />

      {/* TOP overlay — YouTube title/channel info'ni qoplaydi */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black via-black/70 to-transparent z-20 pointer-events-none transition-opacity ${
          !playing || showControls ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* BOTTOM-RIGHT overlay — YouTube logosini qoplaydi */}
      <div className="absolute bottom-0 right-0 w-32 h-14 bg-black z-20 pointer-events-none" />

      {/* BOTTOM-LEFT overlay — "More videos"/share tugmalarini qoplaydi */}
      <div className="absolute bottom-0 left-0 w-32 h-14 bg-black z-20 pointer-events-none" />

      {/* PAUSE OVERLAY — to'xtatilganda butun video tepasiga "More videos" cardlarini qoplash */}
      {!playing && isReady && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Markaz oqim — YouTube end screen cardlarini qoplaydi */}
          <div className="absolute inset-x-0 top-16 bottom-14 bg-black/70 backdrop-blur-sm" />
        </div>
      )}

      {/* Loading */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-30 pointer-events-none">
          <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Center play tugma (pause holatda) */}
      {isReady && !playing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group/play"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/95 group-hover/play:bg-rose-600 flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-7 h-7 sm:w-9 sm:h-9 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* CUSTOM CONTROLS BAR */}
      {isReady && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-t from-black via-black/90 to-transparent pt-8 pb-3 px-3 sm:px-4">
            {/* Progress bar */}
            <div
              onClick={handleSeek}
              className="w-full h-1 bg-white/25 rounded-full cursor-pointer group/bar mb-3 hover:h-1.5 transition-all"
            >
              <div
                className="h-full bg-rose-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-rose-500 rounded-full opacity-0 group-hover/bar:opacity-100 transition" />
              </div>
            </div>

            <div className="flex items-center gap-3 text-white">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="hover:scale-110 active:scale-95 transition flex-shrink-0"
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 group/vol flex-shrink-0">
                <button
                  onClick={toggleMute}
                  className="hover:scale-110 transition"
                >
                  {muted || volume === 0 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={muted ? 0 : volume}
                  onChange={handleVolume}
                  className="w-0 group-hover/vol:w-20 transition-all h-1 accent-rose-500"
                />
              </div>

              {/* Time */}
              <div className="text-xs font-bold tabular-nums">
                {fmt(currentTime)} / {fmt(duration)}
              </div>

              <div className="flex-1" />

              {/* Settings (sifat va tezlik) */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowQualityMenu((v) => !v)}
                  className={`hover:scale-110 transition flex items-center gap-1 ${
                    showQualityMenu ? "text-rose-400" : ""
                  }`}
                  title="Sifat va tezlik"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                  </svg>
                  <span className="text-[10px] font-bold hidden sm:inline">
                    {QUALITY_LABELS[quality] || "Avto"}
                  </span>
                </button>

                {/* Quality menu */}
                {showQualityMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full right-0 mb-2 w-44 bg-black/95 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10"
                  >
                    {/* Tezlik */}
                    <div className="border-b border-white/10">
                      <div className="px-3 pt-2.5 pb-1 text-[10px] uppercase font-black text-white/50 tracking-wider">
                        Tezlik
                      </div>
                      <div className="grid grid-cols-3 gap-1 p-2 pt-1">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                          <button
                            key={r}
                            onClick={() => changeSpeed(r)}
                            className={`py-1 rounded-md text-xs font-bold transition ${
                              speed === r
                                ? "bg-rose-600 text-white"
                                : "bg-white/5 text-white/80 hover:bg-white/10"
                            }`}
                          >
                            {r}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sifat */}
                    <div>
                      <div className="px-3 pt-2.5 pb-1 text-[10px] uppercase font-black text-white/50 tracking-wider">
                        Sifat
                      </div>
                      <div className="max-h-48 overflow-y-auto pb-2">
                        {(availableQualities.length > 0
                          ? [...availableQualities].filter(
                              (q) => q !== "auto"
                            )
                          : ["hd1080", "hd720", "large", "medium", "small"]
                        ).map((q) => (
                          <button
                            key={q}
                            onClick={() => changeQuality(q)}
                            className={`w-full text-left px-3 py-1.5 text-xs font-bold transition flex items-center justify-between ${
                              quality === q
                                ? "bg-rose-600/30 text-rose-300"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                          >
                            <span>{QUALITY_LABELS[q] || q}</span>
                            {quality === q && (
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3.5 h-3.5"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            )}
                          </button>
                        ))}
                        <button
                          onClick={() => changeQuality("default")}
                          className={`w-full text-left px-3 py-1.5 text-xs font-bold transition flex items-center justify-between ${
                            quality === "default" || quality === "auto"
                              ? "bg-rose-600/30 text-rose-300"
                              : "text-white/80 hover:bg-white/10"
                          }`}
                        >
                          <span>Avto</span>
                          {(quality === "default" || quality === "auto") && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3.5 h-3.5"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={enterFullscreen}
                className="hover:scale-110 transition flex-shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
