import { useState, useEffect } from "react";
import {
  Video,
  Play,
  Search,
  Clock,
  X,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import useStore from "../store/useStore";
import {
  VIDEO_CATEGORIES,
  findVideoCategory as findCategory,
} from "../components/ui/data/videoCategories";
import YouTubePlayer from "../components/ui/YouTubePlayer";

export default function VideoDarsliklarPage() {
  const { lang } = useStore();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
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

  // Tanlangan fan videolari
  const subjectVideos = (key) =>
    videos.filter((v) => v.category === key);

  // Filterlangan natijalar (qidiruv bilan)
  const filtered = selectedSubject
    ? subjectVideos(selectedSubject).filter((v) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          (v.title_uz || "").toLowerCase().includes(q) ||
          (v.title_ru || "").toLowerCase().includes(q) ||
          (v.teacher || "").toLowerCase().includes(q)
        );
      })
    : [];

  const openVideo = async (v) => {
    if (v.type === "youtube") {
      setPlaying(v);
      return;
    }
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

  const totalVideos = videos.length;

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
              {selectedSubject
                ? lang === "uz"
                  ? findCategory(selectedSubject)?.uz
                  : findCategory(selectedSubject)?.ru
                : lang === "uz"
                ? `${totalVideos} ta video, ${VIDEO_CATEGORIES.length} ta fan`
                : `${totalVideos} видео, ${VIDEO_CATEGORIES.length} предметов`}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {selectedSubject && (
        <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
          <button
            onClick={() => {
              setSelectedSubject(null);
              setSearch("");
            }}
            className="font-bold text-gray-500 hover:text-rose-600 flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            {lang === "uz" ? "Fanlar" : "Предметы"}
          </button>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="font-bold text-rose-600">
            {lang === "uz"
              ? findCategory(selectedSubject)?.uz
              : findCategory(selectedSubject)?.ru}
          </span>
        </div>
      )}

      {/* LEVEL 1: Fanlar grid */}
      {!selectedSubject && (
        <div>
          <h2 className="font-black text-base sm:text-lg text-gray-800 mb-3 sm:mb-4">
            {lang === "uz" ? "Fanni tanlang" : "Выберите предмет"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {VIDEO_CATEGORIES.map((cat) => {
              const c = cat.color;
              const count = subjectVideos(cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedSubject(cat.key)}
                  className={`bg-gradient-to-br ${c.bg} ${c.text} rounded-2xl p-4 sm:p-5 text-left hover:scale-[1.04] active:scale-[0.98] transition shadow-sm hover:shadow-lg border border-white/40 group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl sm:text-4xl">{cat.icon}</div>
                    <span
                      className={`${c.solid} text-white text-[10px] font-black px-2 py-0.5 rounded-full`}
                    >
                      {count}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base mb-0.5">
                    {lang === "uz" ? cat.uz : cat.ru}
                  </h3>
                  <p className="text-[10px] sm:text-xs opacity-70 flex items-center gap-1">
                    <Play size={10} fill="currentColor" />
                    {count}{" "}
                    {lang === "uz" ? "video dars" : "видео"}
                  </p>
                </button>
              );
            })}
          </div>

          {totalVideos === 0 && (
            <div className="mt-6 bg-white rounded-2xl p-8 text-center border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-rose-50 flex items-center justify-center">
                <Video size={28} className="text-rose-400" />
              </div>
              <p className="text-sm text-gray-500">
                {lang === "uz"
                  ? "Tez orada video darsliklar yuklanadi"
                  : "Скоро будут загружены видеоуроки"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* LEVEL 2: Tanlangan fan videolari */}
      {selectedSubject && (
        <div>
          {/* Search */}
          <div className="bg-white rounded-2xl p-3 border border-gray-100 mb-4">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={
                  lang === "uz"
                    ? "Video nomi bo'yicha qidirish..."
                    : "Поиск по названию..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <Video size={36} className="text-rose-600" />
              </div>
              <h3 className="font-black text-xl text-gray-800 mb-2">
                {subjectVideos(selectedSubject).length === 0
                  ? lang === "uz"
                    ? "Hozircha video yo'q"
                    : "Видео пока нет"
                  : lang === "uz"
                  ? "Topilmadi"
                  : "Не найдено"}
              </h3>
              <p className="text-gray-500 text-sm">
                {subjectVideos(selectedSubject).length === 0
                  ? lang === "uz"
                    ? "Bu fan uchun videolar tez orada qo'shiladi"
                    : "Видео для этого предмета будут добавлены скоро"
                  : lang === "uz"
                  ? "Boshqa qidiruvni sinab ko'ring"
                  : "Попробуйте другой запрос"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((v) => {
                const cat = findCategory(v.category);
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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
                <YouTubePlayer videoId={playing.youtubeId} autoplay />
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
