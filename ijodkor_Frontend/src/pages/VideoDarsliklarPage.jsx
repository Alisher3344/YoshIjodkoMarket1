import { useState, useEffect } from "react";
import { Video, Play, Search, Clock, X } from "lucide-react";
import useStore from "../store/useStore";

const VIDEO_CATEGORIES = [
  { key: "all", uz: "Barchasi", ru: "Все" },
  { key: "math", uz: "Matematika", ru: "Математика" },
  { key: "physics", uz: "Fizika", ru: "Физика" },
  { key: "chemistry", uz: "Kimyo", ru: "Химия" },
  { key: "biology", uz: "Biologiya", ru: "Биология" },
  { key: "english", uz: "Ingliz tili", ru: "Английский" },
  { key: "informatics", uz: "Informatika", ru: "Информатика" },
  { key: "other", uz: "Boshqa", ru: "Другие" },
];

export default function VideoDarsliklarPage() {
  const { lang } = useStore();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [videos, setVideos] = useState([]);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("admin_videos") || "[]");
      setVideos(data);
    } catch {
      setVideos([]);
    }
  }, []);

  const filtered = videos.filter((v) => {
    if (subject !== "all" && v.category !== subject) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (v.title_uz || "").toLowerCase().includes(q) ||
        (v.title_ru || "").toLowerCase().includes(q) ||
        (v.teacher || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openVideo = async (v) => {
    if (v.type === "youtube") {
      setPlaying(v);
      return;
    }
    // Fayl uchun IndexedDB'dan o'qish
    try {
      const req = indexedDB.open("admin_video_db", 1);
      req.onsuccess = () => {
        const tx = req.result.transaction("videos", "readonly");
        const getReq = tx.objectStore("videos").get(v.id);
        getReq.onsuccess = () => {
          if (!getReq.result) {
            alert(lang === "uz" ? "Video topilmadi" : "Видео не найдено");
            return;
          }
          const url = URL.createObjectURL(getReq.result);
          setPlaying({ ...v, _blobUrl: url });
        };
      };
    } catch {
      alert(lang === "uz" ? "Xato" : "Ошибка");
    }
  };

  const closeVideo = () => {
    if (playing?._blobUrl) URL.revokeObjectURL(playing._blobUrl);
    setPlaying(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Hero */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 rounded-2xl p-4 sm:p-6 border border-red-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Video size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 truncate">
              {lang === "uz" ? "Video Darsliklar" : "Видеоуроки"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              {lang === "uz"
                ? `${videos.length} ta video dars`
                : `${videos.length} видеоуроков`}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile fanlar — horizontal scroll */}
      <div className="lg:hidden mb-4 -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          {VIDEO_CATEGORIES.map((s) => {
            const count =
              s.key === "all"
                ? videos.length
                : videos.filter((v) => v.category === s.key).length;
            return (
              <button
                key={s.key}
                onClick={() => setSubject(s.key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                  subject === s.key
                    ? "bg-rose-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {lang === "uz" ? s.uz : s.ru} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-6">
        <aside className="hidden lg:block space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-black text-sm text-gray-800 mb-3">
              {lang === "uz" ? "Fanlar" : "Предметы"}
            </h3>
            <div className="space-y-1">
              {VIDEO_CATEGORIES.map((s) => {
                const count =
                  s.key === "all"
                    ? videos.length
                    : videos.filter((v) => v.category === s.key).length;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSubject(s.key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                      subject === s.key
                        ? "bg-rose-50 text-rose-700 font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{lang === "uz" ? s.uz : s.ru}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <main>
          <div className="bg-white rounded-2xl p-3 border border-gray-100 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={
                  lang === "uz" ? "Video qidiring..." : "Найти видео..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <Video size={36} className="text-rose-600" />
              </div>
              <h3 className="font-black text-xl text-gray-800 mb-2">
                {videos.length === 0
                  ? lang === "uz"
                    ? "Hozircha videolar yo'q"
                    : "Видео пока нет"
                  : lang === "uz"
                  ? "Topilmadi"
                  : "Не найдено"}
              </h3>
              <p className="text-gray-500 text-sm">
                {videos.length === 0
                  ? lang === "uz"
                    ? "Tez orada video darsliklar qo'shiladi"
                    : "Скоро будут добавлены видеоуроки"
                  : lang === "uz"
                  ? "Boshqa fan yoki qidiruvni sinab ko'ring"
                  : "Попробуйте другой предмет или запрос"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((v) => {
                const cat = VIDEO_CATEGORIES.find((c) => c.key === v.category);
                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition cursor-pointer group"
                    onClick={() => openVideo(v)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-200 relative flex items-center justify-center overflow-hidden">
                      {v.type === "youtube" && v.thumbnail && (
                        <img
                          src={v.thumbnail}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
                      <div className="relative w-16 h-16 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition shadow-xl">
                        <Play
                          size={26}
                          className="text-rose-600 ml-1"
                          fill="currentColor"
                        />
                      </div>
                      {v.type === "youtube" && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                          YouTube
                        </span>
                      )}
                      {v.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock size={10} />
                          {v.duration}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-black text-sm text-gray-800 line-clamp-2 mb-1">
                        {lang === "uz"
                          ? v.title_uz
                          : v.title_ru || v.title_uz}
                      </h3>
                      <div className="flex items-center justify-between text-xs">
                        <p className="text-gray-500 truncate">
                          {v.teacher ||
                            (lang === "uz" ? "O'qituvchi" : "Преподаватель")}
                        </p>
                        {cat && (
                          <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0">
                            {lang === "uz" ? cat.uz : cat.ru}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      {playing && (
        <div
          onClick={closeVideo}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-800 truncate">
                {lang === "uz"
                  ? playing.title_uz
                  : playing.title_ru || playing.title_uz}
              </h3>
              <button
                onClick={closeVideo}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-3"
              >
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              {playing.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1`}
                  title={playing.title_uz}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={playing._blobUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
            {playing.teacher && (
              <div className="p-3 text-sm text-gray-600">
                {lang === "uz" ? "O'qituvchi: " : "Преподаватель: "}
                <span className="font-bold">{playing.teacher}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
