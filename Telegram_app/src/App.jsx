import { useEffect, useState } from "react";
import { tgReady, getInitData } from "./lib/tg";
import { api, setToken, getToken } from "./lib/api";
import Welcome from "./pages/Welcome.jsx";
import StudentRegister from "./pages/StudentRegister.jsx";
import PendingApproval from "./pages/PendingApproval.jsx";
import StudentCabinet from "./pages/StudentCabinet.jsx";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null); // null | 'pending' | 'approved' | 'rejected'
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const loadStudentStatus = async () => {
    try {
      const res = await api.getStudentMe();
      setStudentStatus(res.status);
      setStudent(res.student);
    } catch (err) {
      console.error("getStudentMe:", err);
    }
  };

  useEffect(() => {
    tgReady();
    const initData = getInitData();

    const bootstrap = async () => {
      try {
        if (!initData) {
          // Telegram tashqarisida — token cache'da bo'lsa user'ni olamiz
          if (getToken()) {
            try {
              const u = await api.me();
              setUser(u);
              await loadStudentStatus();
            } catch {
              setToken(null);
            }
          }
          setLoading(false);
          return;
        }

        // Telegram ichida — initData orqali login
        const res = await api.webappAuth(initData);
        setToken(res.token);
        setUser(res.user);
        await loadStudentStatus();
      } catch (err) {
        console.error(err);
        setError(err.message || "Telegram autentifikatsiyasi xatosi");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div
          className="scale-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "70vh",
          }}
        >
          <div
            style={{
              fontSize: 56,
              marginBottom: 16,
              animation: "bounceIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            🎨
          </div>
          <div className="spinner" style={{ margin: "0 0 12px" }} />
          <p className="muted" style={{ fontSize: 13 }}>
            YoshIjodkor yuklanmoqda…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="card scale-in">
          <div
            style={{
              fontSize: 48,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            ⚠️
          </div>
          <h2 style={{ textAlign: "center", marginBottom: 12 }}>
            Autentifikatsiya xatosi
          </h2>
          <div className="alert alert-danger">{error}</div>
          <p className="hint" style={{ textAlign: "center" }}>
            Iltimos botdagi <b>📱 Telefon raqamni ulashish</b> tugmasini
            bosganingizga ishonch hosil qiling va Mini App'ni qayta oching.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Welcome />;
  }

  // Status'ga qarab sahifa tanlash
  if (studentStatus === null) {
    return (
      <StudentRegister
        user={user}
        onRegistered={(res) => {
          setStudentStatus(res.status);
          setStudent(res.student);
        }}
      />
    );
  }

  if (studentStatus === "pending") {
    return (
      <PendingApproval student={student} onRefresh={loadStudentStatus} />
    );
  }

  if (studentStatus === "rejected") {
    return (
      <div className="app">
        <div className="card center scale-in" style={{ paddingTop: 32 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              margin: "0 auto 20px",
              background: "var(--grad-rose)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            ❌
          </div>
          <h1>Arizangiz rad etilgan</h1>
          <p className="muted">
            Maktab ma'muriyati arizangizni rad etdi. Qo'shimcha ma'lumot uchun
            maktab bilan bog'laning.
          </p>
        </div>
      </div>
    );
  }

  // approved
  return <StudentCabinet user={user} student={student} />;
}
