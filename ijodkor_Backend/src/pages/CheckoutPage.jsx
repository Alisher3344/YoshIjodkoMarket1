import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import { useLangStore, useCartStore, useOrderStore } from "../store";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { lang, t } = useLangStore();
  const { items, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cash",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const formatPrice = (p) => p.toLocaleString("uz-UZ");

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = lang === "uz" ? "Ismingizni kiriting" : "Введите имя";
    if (!form.phone.trim() || form.phone.length < 9)
      e.phone = lang === "uz" ? "Telefon raqamni kiriting" : "Введите телефон";
    if (!form.address.trim())
      e.address = lang === "uz" ? "Manzilingizni kiriting" : "Введите адрес";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);

    try {
      const orderData = {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        payment_method: form.payment,
        items: items.map((i) => ({
          product_id: i.id,
          name_uz: i.name_uz,
          name_ru: i.name_ru || "",
          price: i.price,
          qty: i.qty,
        })),
        total,
      };

      const id = await addOrder(orderData);

      if (id) {
        const paymentLabels = {
          cash: "Naqd pul",
          click: "Click",
          payme: "Payme",
          uzum: "Uzum Bank",
        };

        await fetch("http://127.0.0.1:8000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            message:
              `🛒 YANGI BUYURTMA #${id}\n\n` +
              `👤 Mijoz: ${form.name}\n` +
              `📞 Telefon: ${form.phone}\n` +
              `📍 Manzil: ${form.address}\n` +
              `💳 To'lov: ${paymentLabels[form.payment] || form.payment}\n` +
              `💰 Jami: ${total.toLocaleString("uz-UZ")} so'm\n\n` +
              `📦 Mahsulotlar:\n` +
              items
                .map(
                  (i) =>
                    `  • ${i.name_uz} x${i.qty} — ${(
                      i.price * i.qty
                    ).toLocaleString("uz-UZ")} so'm`
                )
                .join("\n"),
          }),
        });

        clearCart();
        setOrderId(id);
        setSubmitted(true);
        toast.success(
          lang === "uz" ? "Buyurtma qabul qilindi!" : "Заказ принят!"
        );
      } else {
        toast.error(lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка");
      }
    } catch {
      toast.error(lang === "uz" ? "Xatolik yuz berdi" : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {lang === "uz" ? "Savat bo'sh" : "Корзина пуста"}
          </p>
          <Link to="/products" className="text-purple-600 font-bold">
            {t("cart_continue")}
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-[#4c1d95] mb-3 font-serif">
            {lang === "uz" ? "Buyurtma qabul qilindi!" : "Заказ принят!"}
          </h2>
          <p className="text-gray-500 mb-2">{t("checkout_success")}</p>
          <p className="text-sm text-purple-600 font-bold mb-8">
            ID: {orderId}
          </p>
          <div className="flex gap-3">
            <Link
              to="/"
              className="flex-1 bg-[#4c1d95] text-white font-bold py-3.5 rounded-2xl text-center hover:bg-[#5b21b6] transition-colors"
            >
              {lang === "uz" ? "Bosh sahifaga" : "На главную"}
            </Link>
            <Link
              to="/products"
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-2xl text-center hover:bg-gray-200 transition-colors"
            >
              {t("cart_continue")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const paymentOptions = [
    { id: "cash", label: t("pay_cash"), icon: "💵" },
    { id: "click", label: t("pay_click"), icon: "🟢" },
    { id: "payme", label: t("pay_payme"), icon: "🔵" },
    { id: "uzum", label: t("pay_uzum"), icon: "🟣" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 text-sm font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("back")}
        </button>

        <h1 className="text-3xl font-black text-[#4c1d95] mb-8 font-serif">
          {t("checkout_title")}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-[#4c1d95] text-lg mb-5 font-serif">
                {lang === "uz" ? "Aloqa ma'lumotlari" : "Контактные данные"}
              </h3>
              <div className="space-y-4">
                {/* Ism */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    {t("checkout_name")}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    placeholder={lang === "uz" ? "Ism Familiya" : "Имя Фамилия"}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-sm ${
                      errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#4c1d95]"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    {t("checkout_phone")}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm({ ...form, phone: e.target.value });
                      setErrors({ ...errors, phone: "" });
                    }}
                    placeholder="+998 90 000 00 00"
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-sm ${
                      errors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#4c1d95]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Manzil */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    {t("checkout_address")}
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => {
                      setForm({ ...form, address: e.target.value });
                      setErrors({ ...errors, address: "" });
                    }}
                    placeholder={
                      lang === "uz" ? "Shahar, ko'cha, uy" : "Город, улица, дом"
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-sm ${
                      errors.address
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#4c1d95]"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* To'lov */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-[#4c1d95] text-lg mb-5 font-serif flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                {t("checkout_payment")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setForm({ ...form, payment: opt.id })}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      form.payment === opt.id
                        ? "border-[#4c1d95] bg-[#ede9fe]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-sm font-bold text-gray-700">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-black text-[#4c1d95] text-lg mb-5 font-serif">
                {lang === "uz" ? "Buyurtma" : "Заказ"}
              </h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 line-clamp-2">
                        {lang === "uz" ? item.name_uz : item.name_ru}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.qty} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-xs font-black text-purple-600 shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between font-black text-[#4c1d95] text-lg mb-5">
                <span>{t("cart_total")}</span>
                <span>
                  {formatPrice(total)} {t("sum")}
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#4c1d95] hover:bg-[#5b21b6] disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {lang === "uz" ? "Yuklanmoqda..." : "Загрузка..."}
                  </>
                ) : (
                  <>{t("checkout_btn")} ✓</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
