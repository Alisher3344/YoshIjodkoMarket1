import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { haptic, showConfirm } from "../lib/tg";
import ProductForm from "./ProductForm.jsx";

const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

const STATUS = {
  pending:  { label: "Kutmoqda",   className: "pill-warning", emoji: "⏳" },
  approved: { label: "Tasdiqlandi", className: "pill-success", emoji: "✅" },
  rejected: { label: "Rad etildi",  className: "pill-danger",  emoji: "❌" },
  sold:     { label: "Sotilgan",    className: "pill-info",    emoji: "🎉" },
};

const CATEGORY_EMOJI = {
  paintings: "🎨",
  handcraft: "✂️",
  clothing: "👗",
  toys: "🧸",
  souvenirs: "🎁",
  holiday: "🎉",
  educational: "📚",
  digital: "💻",
  creative: "⭐",
  school: "🏫",
  eco: "🌿",
  other: "📦",
};

export default function StudentCabinet({ user, student }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await api.getMyStudentProducts();
      setProducts(list);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onDelete = async (id) => {
    const ok = await showConfirm("Mahsulotni o'chirasizmi?");
    if (!ok) return;
    try {
      await api.deleteMyStudentProduct(id);
      haptic.success();
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      haptic.error();
      alert(err.message);
    }
  };

  const isSold = (p) => p.status === "approved" && (p.stock || 0) === 0;

  const stats = {
    total: products.length,
    approved: products.filter((p) => p.status === "approved" && !isSold(p))
      .length,
    pending: products.filter((p) => p.status === "pending").length,
    sold: products.filter(isSold).length,
  };

  return (
    <div className="app">
      {/* Hero — Profil */}
      <div className="hero scale-in">
        <div className="flex items-center gap-3">
          <div className="avatar avatar-lg" style={{ border: "4px solid rgba(255,255,255,0.25)" }}>
            {student.avatar ? (
              <img src={student.avatar} alt="" />
            ) : (
              student.name?.[0]?.toUpperCase() || "👤"
            )}
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 2 }}>
              👋 Salom,
            </div>
            <h2 style={{ color: "#fff", margin: 0, fontSize: 20 }}>
              {student.name} {student.full_name}
            </h2>
            <div className="flex gap-2 mt-2" style={{ flexWrap: "wrap" }}>
              {student.grade && (
                <span className="pill pill-glass">
                  🎓 {student.grade}-sinf
                </span>
              )}
              <span className="pill pill-glass">
                ✅ Tasdiqlangan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistika */}
      <div
        className="stats fade-in"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{ color: "var(--success)" }}>
            {stats.approved}
          </div>
          <div className="stat-label">Faol</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{ color: "var(--warning)" }}>
            {stats.pending}
          </div>
          <div className="stat-label">Kutmoqda</div>
        </div>
        <div className="stat">
          <div className="stat-value" style={{ color: "var(--info, #3b82f6)" }}>
            {stats.sold}
          </div>
          <div className="stat-label">Sotilgan</div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="segmented">
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => {
            setTab("products");
            haptic.select();
          }}
        >
          🎨 Mahsulotlar
        </button>
        <button
          className={tab === "profile" ? "active" : ""}
          onClick={() => {
            setTab("profile");
            haptic.select();
          }}
        >
          👤 Profil
        </button>
      </div>

      {tab === "profile" && (
        <div className="card fade-in">
          <h3 style={{ marginBottom: 8 }}>Mening profilim</h3>
          <div className="row">
            <span className="row-label">Ism</span>
            <span className="row-value">{student.name}</span>
          </div>
          <div className="row">
            <span className="row-label">Familiya</span>
            <span className="row-value">{student.full_name || "—"}</span>
          </div>
          <div className="row">
            <span className="row-label">Sinf</span>
            <span className="row-value">{student.grade || "—"}</span>
          </div>
          <div className="row">
            <span className="row-label">Telefon</span>
            <span className="row-value">{user?.phone || "—"}</span>
          </div>
          <p className="hint" style={{ marginTop: 12, marginBottom: 0 }}>
            Ma'lumotni o'zgartirish uchun maktab ma'muriyatiga murojaat qiling.
          </p>
        </div>
      )}

      {tab === "products" && (
        <div className="fade-in">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0 }}>Mening mahsulotlarim</h2>
            <button
              className="btn btn-sm btn-gradient"
              style={{ width: "auto" }}
              onClick={() => {
                setShowForm(true);
                haptic.medium();
              }}
            >
              + Qo'shish
            </button>
          </div>

          {loading ? (
            <div className="flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 96, borderRadius: 16 }}
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card empty">
              <span className="empty-emoji">🎨</span>
              <div className="empty-title">Hali mahsulotlaringiz yo'q</div>
              <div className="empty-desc">
                Yuqoridagi <b>+ Qo'shish</b> tugmasini bosib o'zingiz ijod
                qilgan mahsulotni yuklang.
              </div>
            </div>
          ) : (
            <div className="flex-col gap-2">
              {products.map((p) => {
                const sold = isSold(p);
                const status = sold
                  ? STATUS.sold
                  : STATUS[p.status] || STATUS.approved;
                const emoji = CATEGORY_EMOJI[p.category] || "📦";
                return (
                  <div
                    key={p.id}
                    className="list-item"
                    style={{
                      opacity: sold ? 0.6 : 1,
                      background: sold ? "#f9fafb" : undefined,
                      position: "relative",
                    }}
                  >
                    {p.image ? (
                      <img
                        className="list-img"
                        src={p.image}
                        alt=""
                        style={{
                          filter: sold ? "grayscale(0.6)" : undefined,
                        }}
                      />
                    ) : (
                      <div
                        className="list-img"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                        }}
                      >
                        {emoji}
                      </div>
                    )}
                    <div className="flex-1">
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          marginBottom: 2,
                          textDecoration: sold ? "line-through" : "none",
                          textDecorationColor: "rgba(15,23,42,0.3)",
                        }}
                        className="truncate"
                      >
                        {p.name_uz}
                      </div>
                      <div
                        style={{
                          color: sold ? "#94a3b8" : "var(--brand-1)",
                          fontWeight: 800,
                          fontSize: 13,
                          marginBottom: 6,
                        }}
                      >
                        {formatPrice(p.price)}
                        {sold ? " · sotilgan" : ` · ${p.stock} dona`}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <span className={`pill ${status.className}`}>
                          {status.emoji} {status.label}
                        </span>
                        {sold && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#3b82f6",
                              fontWeight: 700,
                            }}
                          >
                            Mahsulotingiz sotildi 🎉
                          </span>
                        )}
                        {p.status === "pending" && (
                          <button
                            onClick={() => onDelete(p.id)}
                            style={{
                              border: "1px solid var(--danger-bg)",
                              background: "transparent",
                              color: "var(--danger)",
                              borderRadius: "var(--r-full)",
                              padding: "3px 10px",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            🗑 O'chirish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onCreated={(p) => {
            setProducts((prev) => [p, ...prev]);
            setShowForm(false);
            haptic.success();
          }}
        />
      )}
    </div>
  );
}
