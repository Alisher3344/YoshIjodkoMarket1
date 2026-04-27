import { useEffect, useState } from "react";
import { api } from "../lib/api";

const formatPrice = (n) => (n || 0).toLocaleString("uz-UZ") + " so'm";

export default function StudentCabinet({ user, student }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    if (!student?.id) return;
    setLoading(true);
    fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:8000/api"
      }/students/${student.id}/products`
    )
      .then((r) => r.json())
      .then((list) => setProducts(Array.isArray(list) ? list : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [student?.id]);

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
          <h2>Mening mahsulotlarim</h2>
          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{ fontSize: 48 }}>🎨</div>
              <p className="muted" style={{ marginTop: 8 }}>
                Hozircha mahsulotlaringiz yo'q.
              </p>
              <p className="hint">
                Yangi mahsulot qo'shish uchun maktab ma'muriyatiga murojaat
                qiling.
              </p>
            </div>
          ) : (
            <div className="product-list">
              {products.map((p) => (
                <div key={p.id} className="product">
                  {p.image ? (
                    <img className="product-img" src={p.image} alt="" />
                  ) : (
                    <div
                      className="product-img"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                      }}
                    >
                      📦
                    </div>
                  )}
                  <div className="product-name">{p.name_uz || p.nameUz}</div>
                  <div className="product-price">{formatPrice(p.price)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
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
