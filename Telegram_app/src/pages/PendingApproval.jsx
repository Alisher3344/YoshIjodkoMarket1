import { haptic } from "../lib/tg";

export default function PendingApproval({ student, onRefresh }) {
  const handleRefresh = () => {
    haptic.light();
    onRefresh();
  };

  return (
    <div className="app">
      <div className="card center scale-in" style={{ paddingTop: 32, paddingBottom: 28 }}>
        <div
          className="pulse-ring"
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            margin: "0 auto 20px",
            background: "var(--grad-warm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
          }}
        >
          ⏳
        </div>
        <h1 style={{ marginBottom: 8 }}>Arizangiz qabul qilindi</h1>
        <p style={{ marginBottom: 0, fontSize: 14 }}>
          Sizning ma'lumotingiz maktab ma'muriyati tomonidan tasdiqlanishini
          kuting. Bu odatda 1–2 ish kuni davom etadi.
        </p>
      </div>

      <div className="card fade-in">
        <h3 style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <span>📋</span>
          Yuborilgan ma'lumotlar
        </h3>
        <div className="row">
          <span className="row-label">Ism</span>
          <span className="row-value">{student.name}</span>
        </div>
        {student.full_name && (
          <div className="row">
            <span className="row-label">Familiya</span>
            <span className="row-value">{student.full_name}</span>
          </div>
        )}
        {student.grade && (
          <div className="row">
            <span className="row-label">Sinf</span>
            <span className="row-value">{student.grade}</span>
          </div>
        )}
      </div>

      <div className="alert alert-info">
        <span style={{ fontSize: 18 }}>ℹ️</span>
        <div>
          Tasdiqlangach bu sahifa avtomatik o'zgaradi. Yoki pastdagi tugma
          orqali holatni qo'lda tekshiring.
        </div>
      </div>

      <button className="btn btn-secondary" onClick={handleRefresh}>
        🔄 Holatni tekshirish
      </button>
    </div>
  );
}
