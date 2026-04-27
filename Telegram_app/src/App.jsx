import { useEffect, useState } from "react";
import { tgReady, getInitData, getInitUser, showAlert } from "./lib/tg";
import { api, setToken, getToken } from "./lib/api";
import Welcome from "./pages/Welcome.jsx";
import ProfileForm from "./pages/ProfileForm.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    tgReady();

    const initData = getInitData();
    const tgUser = getInitUser();

    // Telegram tashqarisida ochilsa (oddiy brauzer)
    if (!initData) {
      // Token cache'da bo'lsa, foydalanuvchini olish
      if (getToken()) {
        api
          .me()
          .then((u) => {
            setUser(u);
            setNeedsProfile(!u.name || !u.phone);
          })
          .catch(() => setToken(null))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
      return;
    }

    // Mini App ichida — initData orqali login
    api
      .webappAuth(initData)
      .then((res) => {
        setToken(res.token);
        setUser(res.user);
        setNeedsProfile(!!res.needs_profile);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Telegram autentifikatsiyasi xatosi");
      })
      .finally(() => setLoading(false));
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

  if (needsProfile) {
    return (
      <ProfileForm
        user={user}
        onSaved={(updated) => {
          setUser(updated);
          setNeedsProfile(false);
        }}
      />
    );
  }

  return <Home user={user} />;
}
