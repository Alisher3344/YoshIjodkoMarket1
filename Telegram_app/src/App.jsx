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
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="card">
          <div className="error">⚠️ {error}</div>
          <p className="muted">
            Iltimos, botdagi <b>📱 Telefon raqamni ulashish</b> tugmasini bosgan
            bo'lganingizga ishonch hosil qiling, va Mini App'ni qayta oching.
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
        <div className="card center">
          <div style={{ fontSize: 64, marginBottom: 8 }}>❌</div>
          <h1>Arizangiz rad etilgan</h1>
          <p className="muted" style={{ marginTop: 12 }}>
            Maktab ma'muriyati arizangizni rad etdi. Qo'shimcha ma'lumot
            uchun maktab bilan bog'laning.
          </p>
        </div>
      </div>
    );
  }

  // approved
  return <StudentCabinet user={user} student={student} />;
}
