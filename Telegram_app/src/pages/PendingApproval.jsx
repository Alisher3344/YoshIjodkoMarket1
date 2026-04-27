export default function PendingApproval({ student, onRefresh }) {
  return (
    <div className="app">
      <div className="card center">
        <div style={{ fontSize: 64, marginBottom: 8 }}>⏳</div>
        <h1>Arizangiz qabul qilindi</h1>
        <p className="muted" style={{ marginTop: 12 }}>
          Sizning ma'lumotingiz maktab ma'muriyati tomonidan tasdiqlanishini
          kuting. Bu odatda 1-2 ish kuni davom etadi.
        </p>

        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            borderRadius: 12,
            padding: 14,
            marginTop: 18,
            textAlign: "left",
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, color: "#92400e" }}>
            Yuborilgan ma'lumotlar:
          </p>
          <ul
            style={{
              margin: "8px 0 0",
              paddingLeft: 20,
              color: "#92400e",
              fontSize: 14,
            }}
          >
            <li>
              <b>Ism:</b> {student.name}
            </li>
            {student.full_name && (
              <li>
                <b>Familiya:</b> {student.full_name}
              </li>
            )}
            {student.grade && (
              <li>
                <b>Sinf:</b> {student.grade}
              </li>
            )}
          </ul>
        </div>

        <button
          className="btn-secondary btn"
          style={{ marginTop: 20 }}
          onClick={onRefresh}
        >
          🔄 Yangilash
        </button>
      </div>
    </div>
  );
}
