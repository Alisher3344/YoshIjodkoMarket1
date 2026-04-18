import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import useStore from "../../store/useStore";

export default function DonationModal({ product, onClose }) {
  const { lang } = useStore();
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const name =
    lang === "uz" ? product.name_uz : product.name_ru || product.name_uz;
  const author =
    lang === "uz" ? product.author : product.author_ru || product.author;
  const school =
    lang === "uz" ? product.school : product.school_ru || product.school;
  const district =
    lang === "uz" ? product.district : product.district_ru || product.district;
  const story =
    lang === "uz" ? product.story_uz : product.story_ru || product.story_uz;

  const copyCard = () => {
    if (product.card_number) {
      navigator.clipboard.writeText(product.card_number.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-black text-lg text-rose-600">
              ❤️ {lang === "uz" ? "Qo'llab-quvvatlash" : "Поддержать"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* O'quvchi */}
            <div className="flex items-center gap-4">
              {product.photo && (
                <img
                  src={product.photo}
                  alt={author}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-200"
                />
              )}
              <div>
                <p className="font-black text-gray-900 text-lg">{author}</p>
                <p className="text-sm text-gray-500">{school}</p>
                {district && (
                  <p className="text-xs text-gray-400">{district}</p>
                )}
              </div>
            </div>

            {/* Mahsulot */}
            <div className="bg-rose-50 rounded-2xl p-4">
              <p className="text-sm text-rose-700 font-medium">{name}</p>
              <p className="text-xl font-black text-rose-600 mt-1">
                {product.price?.toLocaleString("uz-UZ")} so'm
              </p>
            </div>

            {/* Hikoya */}
            {story && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{story}"
                </p>
              </div>
            )}

            {/* Karta */}
            {product.card_number && (
              <div>
                <p className="text-xs text-gray-500 mb-2 font-semibold">
                  {lang === "uz" ? "Karta raqami:" : "Номер карты:"}
                </p>
                <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
                  <span className="flex-1 font-black tracking-widest text-gray-800 text-lg">
                    {product.card_number}
                  </span>
                  <button
                    onClick={copyCard}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-[#1a56db] text-white hover:bg-[#1341a8]"
                    }`}
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied
                      ? lang === "uz"
                        ? "Nusxalandi"
                        : "Скопировано"
                      : lang === "uz"
                      ? "Nusxa"
                      : "Копировать"}
                  </button>
                </div>
              </div>
            )}

            {/* To'lov tugmalari */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://my.click.uz/services/pay?amount=${product.price}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#00AEEF] text-white text-xs font-bold py-2.5 rounded-xl text-center hover:opacity-90 transition"
              >
                💙 Click
              </a>
              <a
                href={`https://checkout.paycom.uz?amount=${product.price}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#37AEE2] text-white text-xs font-bold py-2.5 rounded-xl text-center hover:opacity-90 transition"
              >
                💳 Payme
              </a>
              <a
                href={`https://uzumbank.uz?amount=${product.price}`}
                target="_blank"
                rel="noreferrer"
                className="bg-purple-600 text-white text-xs font-bold py-2.5 rounded-xl text-center hover:opacity-90 transition"
              >
                🟣 Uzum
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
