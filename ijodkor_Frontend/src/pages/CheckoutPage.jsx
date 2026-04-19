import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Copy, X } from "lucide-react";
import useStore from "../store/useStore";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    t,
    lang,
    adminLoggedIn,
    cart,
    cartTotal,
    addOrder,
    clearCart,
    removeFromCart,
  } = useStore();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedCard, setCopiedCard] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "Qarshi",
    payment: "cash",
    note: "",
  });
  const [errors, setErrors] = useState({});

  // ⚠️ Login tekshirish
  useEffect(() => {
    if (!adminLoggedIn) {
      alert(
        lang === "uz"
          ? "⚠️ Mahsulot sotib olish uchun avvalo ro'yxatdan o'tishingiz kerak!"
          : "⚠️ Для покупки товара сначала нужно зарегистрироваться!"
      );
      navigate("/auth");
      return;
    }
    if (cart.length === 0 && !submitted) {
      // bo'sh savat bilan shu sahifada qolmasin
      // navigate("/");
    }
  }, [adminLoggedIn, navigate, lang]);

  // Agar login qilmagan bo'lsa — hech narsa ko'rsatmaymiz
  if (!adminLoggedIn) return null;

  const total = cartTotal();
  const formatPrice = (n) => n.toLocaleString("uz-UZ") + " so'm";

  const disabledItems = cart.filter(
    (i) => i.student_type === "disabled" || i.studentType === "disabled"
  );
  const normalItems = cart.filter(
    (i) => (i.student_type || i.studentType) !== "disabled"
  );
  const disabledTotal = disabledItems.reduce((s, i) => s + i.price * i.qty, 0);
  const normalTotal = normalItems.reduce((s, i) => s + i.price * i.qty, 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = lang === "uz" ? "Ism majburiy" : "Имя обязательно";
    if (!form.phone.trim())
      e.phone = lang === "uz" ? "Telefon majburiy" : "Телефон обязателен";
    if (!form.address.trim())
      e.address = lang === "uz" ? "Manzil majburiy" : "Адрес обязателен";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addOrder({
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        payment: form.payment,
        note: form.note,
        items: cart,
        total,
      });
      clearCart();
      setSubmitted(true);
    } catch (err) {
      alert(lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  const copyCard = (card) => {
    navigator.clipboard.writeText(card.replace(/\s/g, ""));
    setCopiedCard(card);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  if (cart.length === 0 && !submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-4">{t("emptyCart")}</h2>
        <Link
          to="/catalog"
          className="bg-[#1a56db] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1341a8] transition"
        >
          {t("catalog")}
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {t("orderSuccess")}
          </h2>
          <p className="text-gray-500">{t("orderSuccessMsg")}</p>
        </div>

        {disabledItems.length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 mb-6">
            <h3 className="font-black text-rose-700 text-lg mb-4">
              ❤️{" "}
              {lang === "uz"
                ? "Imkoniyati cheklangan o'quvchilarga to'lov"
                : "Оплата ученикам с ограниченными возможностями"}
            </h3>
            <div className="space-y-4">
              {disabledItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 border border-rose-200"
                >
                  <div className="font-bold text-gray-900 mb-2">
                    {lang === "uz"
                      ? item.name_uz || item.nameUz
                      : item.name_ru || item.nameRu || item.name_uz}
                  </div>
                  <div className="text-rose-600 font-black mb-3">
                    {formatPrice(item.price * item.qty)}
                  </div>
                  {(item.card_number || item.cardNumber) && (
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
                      <span className="flex-1 font-black tracking-widest">
                        {item.card_number || item.cardNumber}
                      </span>
                      <button
                        onClick={() =>
                          copyCard(item.card_number || item.cardNumber)
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          copiedCard === (item.card_number || item.cardNumber)
                            ? "bg-green-500 text-white"
                            : "bg-[#1a56db] text-white"
                        }`}
                      >
                        {copiedCard ===
                        (item.card_number || item.cardNumber) ? (
                          "✓"
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#1a56db] text-white py-3.5 rounded-xl font-black hover:bg-[#1341a8] transition"
        >
          {t("continueShopping")}
        </button>
      </div>
    );
  }

  const paymentMethods = [
    { key: "cash", label: t("cash"), icon: "💵" },
    { key: "click", label: "Click", icon: "💙" },
    { key: "payme", label: "Payme", icon: "💳" },
    { key: "uzumbank", label: "Uzum Bank", icon: "🟣" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a56db] mb-6 transition font-medium"
      >
        <ArrowLeft size={16} /> {lang === "uz" ? "Orqaga" : "Назад"}
      </button>

      <h1 className="text-2xl font-black text-gray-900 mb-6">
        {t("checkoutTitle")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-3">
              {lang === "uz" ? "Shaxsiy ma'lumotlar" : "Личные данные"}
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t("fullName")} *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition ${
                  errors.name ? "border-red-400" : "border-gray-200"
                }`}
                placeholder={
                  lang === "uz" ? "Ismingizni kiriting" : "Введите ваше имя"
                }
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t("phone")} *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition ${
                  errors.phone ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="+998 __ ___ __ __"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t("city")}
                </label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] bg-white"
                >
                  {[
                    "Qarshi",
                    "Shahrisabz",
                    "Kitob",
                    "Muborak",
                    "Nishon",
                    "Koson",
                    "Toshkent",
                    "Samarqand",
                    "Buxoro",
                  ].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t("address")} *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition ${
                    errors.address ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder={lang === "uz" ? "Ko'cha, uy" : "Улица, дом"}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-3 mb-4">
              {t("paymentMethod")}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((m) => (
                <label
                  key={m.key}
                  className={`flex items-center gap-2 border-2 rounded-xl p-3 cursor-pointer transition ${
                    form.payment === m.key
                      ? "border-[#1a56db] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.key}
                    checked={form.payment === m.key}
                    onChange={() => setForm({ ...form, payment: m.key })}
                    className="accent-[#1a56db]"
                  />
                  <span>{m.icon}</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {m.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("orderNote")}
            </label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56db] transition resize-none"
              placeholder={
                lang === "uz"
                  ? "Qo'shimcha ma'lumot..."
                  : "Дополнительная информация..."
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f97316] hover:bg-[#c2570d] disabled:bg-gray-300 text-white py-4 rounded-xl font-black text-base transition"
          >
            {loading
              ? lang === "uz"
                ? "Yuborilmoqda..."
                : "Отправка..."
              : `${t("placeOrder")} ✓`}
          </button>
        </form>

        {/* Buyurtma xulosasi */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b">
              {lang === "uz" ? "Buyurtma tarkibi" : "Состав заказа"}
            </h2>
            <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 group">
                  <img
                    src={
                      item.image ||
                      "https://placehold.co/50x50/e2e8f0/64748b?text=%20"
                    }
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 line-clamp-1">
                      {lang === "uz"
                        ? item.nameUz || item.name_uz
                        : item.nameRu ||
                          item.name_ru ||
                          item.nameUz ||
                          item.name_uz}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-400">x{item.qty}</span>
                      <span className="text-xs font-bold text-[#1a56db]">
                        {(item.price * item.qty).toLocaleString("uz-UZ")} so'm
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              {normalItems.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {lang === "uz" ? "Oddiy mahsulotlar" : "Обычные товары"}:
                  </span>
                  <span className="font-semibold">
                    {formatPrice(normalTotal)}
                  </span>
                </div>
              )}
              {disabledItems.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-rose-500">
                    ❤️{" "}
                    {lang === "uz"
                      ? "Imkoniyati cheklangan"
                      : "С огр. возможностями"}
                    :
                  </span>
                  <span className="font-semibold text-rose-600">
                    {formatPrice(disabledTotal)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {lang === "uz" ? "Yetkazib berish" : "Доставка"}:
                </span>
                <span className="font-semibold text-green-600">
                  {lang === "uz" ? "Bepul" : "Бесплатно"}
                </span>
              </div>
              <div className="flex justify-between font-black text-base border-t pt-2">
                <span>{t("total")}:</span>
                <span className="text-[#1a56db]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
