import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { haptic, showAlert } from "../lib/tg";

export default function StudentRegister({ user, onRegistered }) {
  const [name, setName] = useState(user?.name || "");
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [grade, setGrade] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getSchools()
      .then((list) => setSchools(Array.isArray(list) ? list : []))
      .catch(() => setSchools([]))
      .finally(() => setLoadingSchools(false));
  }, []);

  const onAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      haptic.error();
      showAlert("Rasm 2MB dan kichik bo'lsin");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
      haptic.light();
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      haptic.error();
      return setError("Ismni kiriting");
    }
    if (!schoolId) {
      haptic.error();
      return setError("Maktabni tanlang");
    }
    setSaving(true);
    try {
      const res = await api.registerStudent({
        name: name.trim(),
        full_name: fullName.trim(),
        grade: grade.trim(),
        school_id: parseInt(schoolId),
        avatar,
      });
      haptic.success();
      onRegistered(res);
    } catch (err) {
      haptic.error();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <div className="hero scale-in">
        <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
        <h1 style={{ color: "#fff", marginBottom: 4 }}>Ro'yxatdan o'tish</h1>
        <p style={{ color: "rgba(255,255,255,0.92)", margin: 0, fontSize: 14 }}>
          Yosh ijodkor sifatida ro'yxatdan o'ting. Maktab ma'muriyati arizangizni
          tasdiqlagandan so'ng mahsulot qo'shishingiz mumkin.
        </p>
      </div>

      <form onSubmit={onSubmit} className="fade-in">
        {/* Avatar uploader */}
        <div className="card" style={{ textAlign: "center" }}>
          <label
            className="upload-zone-image"
            style={{
              display: "inline-block",
              width: 112,
              height: 112,
              borderRadius: "50%",
              cursor: "pointer",
              border: "3px solid var(--brand-1)",
              padding: 0,
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "var(--grad-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                }}
              >
                📷
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={onAvatarUpload}
              style={{ display: "none" }}
            />
          </label>
          <p className="hint" style={{ marginTop: 10, marginBottom: 0 }}>
            {avatar ? "Rasmni o'zgartirish uchun bosing" : "Profil rasmini yuklang (ixtiyoriy)"}
          </p>
        </div>

        <div className="card">
          {error && <div className="error">⚠️ {error}</div>}

          <div className="field">
            <label className="label">Ism *</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alisher"
            />
          </div>

          <div className="field">
            <label className="label">Familiya</label>
            <input
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Karimov"
            />
          </div>

          <div className="field">
            <label className="label">Sinf</label>
            <input
              className="input"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Masalan: 4-A"
            />
          </div>

          <div className="field">
            <label className="label">Maktab *</label>
            {loadingSchools ? (
              <div className="skeleton" style={{ height: 46 }} />
            ) : (
              <select
                className="input"
                value={schoolId}
                onChange={(e) => {
                  setSchoolId(e.target.value);
                  haptic.select();
                }}
              >
                <option value="">— Maktabni tanlang —</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.district ? ` (${s.district})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {user?.phone && (
            <div className="field" style={{ marginBottom: 0 }}>
              <label className="label">Telefon</label>
              <input className="input" value={user.phone} disabled />
              <p className="hint" style={{ marginTop: 6 }}>
                Telegram orqali ulashilgan raqam
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-gradient"
          disabled={saving || loadingSchools}
        >
          {saving ? "Yuborilmoqda…" : "Arizani yuborish →"}
        </button>
      </form>
    </div>
  );
}
