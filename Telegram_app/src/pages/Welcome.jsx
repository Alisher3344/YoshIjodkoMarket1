export default function Welcome() {
  return (
    <div className="app">
      <div className="card-gradient card scale-in" style={{ marginTop: 40 }}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            className="bounce-in"
            style={{
              fontSize: 72,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
              marginBottom: 12,
            }}
          >
            🎨
          </div>
          <h1 style={{ color: "#fff", marginBottom: 8 }}>YoshIjodkor</h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}>
            Yosh ijodkorlar mahsulotlari
          </p>
        </div>
      </div>

      <div className="card mt-3 fade-in">
        <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🚀</span>
          Boshlash uchun
        </h3>
        <ol style={{ paddingLeft: 20, color: "var(--text-2)", lineHeight: 1.7, fontSize: 14 }}>
          <li>
            Telegram'da <b>@YoshijodkorBot</b> ga <code style={badgeCode}>/start</code> yuboring
          </li>
          <li>📱 <b>Telefon raqamingizni ulashing</b></li>
          <li>🎨 Mini App ochilganda profilingizni to'ldiring</li>
        </ol>
      </div>

      <div className="alert alert-info">
        <span style={{ fontSize: 18 }}>💡</span>
        <div>
          Hisob yaratilgandan so'ng o'zingiz ijod qilgan mahsulotlarni
          to'g'ridan-to'g'ri shu yerda yuklay olasiz.
        </div>
      </div>
    </div>
  );
}

const badgeCode = {
  background: "rgba(37, 99, 235, 0.1)",
  color: "var(--brand-1)",
  padding: "1px 6px",
  borderRadius: 6,
  fontSize: 12,
  fontFamily: "ui-monospace, Menlo, monospace",
  fontWeight: 600,
};
