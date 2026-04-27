import { useEffect, useState } from "react";
import { api } from "../lib/api";
import ProductForm from "./ProductForm.jsx";

const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

const STATUS_BADGE = {
  pending:  { label: "⏳ Tasdiq kutmoqda", bg: "#fef3c7", color: "#92400e" },
  approved: { label: "✅ Tasdiqlangan",   bg: "#dcfce7", color: "#166534" },
  rejected: { label: "❌ Rad etilgan",     bg: "#fee2e2", color: "#991b1b" },
};

export default function StudentCabinet({ user, student }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await api.getMyStudentProducts();
      setProducts(list);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Mahsulotni o'chirasizmi?")) return;
    try {
      await api.deleteMyStudentProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      {/* Profil header */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {student.avatar ? (
            <img
              src={student.avatar}
              alt=""
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid var(--tg-link)",
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--tg-link)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              {student.name?.[0]?.toUpperCase() || "👤"}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {student.name} {student.full_name}
            </div>
            <div className="hint" style={{ marginTop: 2 }}>
              {student.grade && <>🎓 {student.grade}-sinf</>}
              {student.grade && user?.phone && " · "}
              {user?.phone && <>📞 {user.phone}</>}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 6,
                padding: "2px 10px",
                background: "#dcfce7",
                color: "#166534",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              ✅ Tasdiqlangan
            </div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          background: "#fff",
          padding: 4,
          borderRadius: 12,
        }}
      >
        <button
          onClick={() => setTab("profile")}
          style={{
            flex: 1,
            padding: "10px",
            border: 0,
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
            background: tab === "profile" ? "var(--tg-link)" : "transparent",
            color: tab === "profile" ? "#fff" : "var(--tg-text)",
          }}
        >
          👤 Profil
        </button>
        <button
          onClick={() => setTab("products")}
          style={{
            flex: 1,
            padding: "10px",
            border: 0,
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
            background: tab === "products" ? "var(--tg-link)" : "transparent",
            color: tab === "products" ? "#fff" : "var(--tg-text)",
          }}
        >
          🎨 Mahsulotlar
          {products.length > 0 && (
            <span
              style={{
                marginLeft: 6,
                fontSize: 11,
                background: tab === "products" ? "rgba(255,255,255,0.3)" : "#e5e7eb",
                padding: "1px 7px",
                borderRadius: 999,
              }}
            >
              {products.length}
            </span>
          )}
        </button>
      </div>

      {tab === "profile" && (
        <div className="card">
          <h2>Mening profilim</h2>
          <Row label="Ism" value={student.name} />
          <Row label="Familiya" value={student.full_name || "—"} />
          <Row label="Sinf" value={student.grade || "—"} />
          <Row label="Telefon" value={user?.phone || "—"} />
          <p className="hint" style={{ marginTop: 12 }}>
            Ma'lumotni o'zgartirish uchun maktab ma'muriyati bilan bog'laning.
          </p>
        </div>
      )}

      {tab === "products" && (
        <div className="card">
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
              onClick={() => setShowForm(true)}
              style={{
                background: "var(--tg-link)",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                padding: "8px 14px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              + Qo'shish
            </button>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ fontSize: 48 }}>🎨</div>
              <p className="muted" style={{ marginTop: 8 }}>
                Hozircha mahsulotlaringiz yo'q.
              </p>
              <p className="hint">
                Yuqoridagi <b>+ Qo'shish</b> tugmasini bosib mahsulot yuklang.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {products.map((p) => {
                const badge = STATUS_BADGE[p.status] || STATUS_BADGE.approved;
                return (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: 10,
                      background: "#f9fafb",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt=""
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 10,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 10,
                          background: "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                          flexShrink: 0,
                        }}
                      >
                        📦
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          marginBottom: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.name_uz}
                      </div>
                      <div
                        style={{
                          color: "var(--tg-link)",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        {formatPrice(p.price)} · {p.stock} dona
                      </div>
                      <div
                        style={{
                          display: "inline-block",
                          marginTop: 4,
                          padding: "2px 8px",
                          background: badge.bg,
                          color: badge.color,
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {badge.label}
                      </div>
                      {p.status === "pending" && (
                        <button
                          onClick={() => onDelete(p.id)}
                          style={{
                            marginLeft: 6,
                            background: "transparent",
                            border: "1px solid #fca5a5",
                            color: "#dc2626",
                            borderRadius: 999,
                            padding: "1px 8px",
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          🗑 O'chirish
                        </button>
                      )}
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
          }}
        />
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #f3f4f6",
        fontSize: 14,
      }}
    >
      <span className="muted">{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
