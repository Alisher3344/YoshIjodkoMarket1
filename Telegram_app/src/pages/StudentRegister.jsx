import { useEffect, useState } from "react";
import { api } from "../lib/api";

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
      alert("Rasm 2MB dan kichik bo'lsin");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Ismni kiriting");
      return;
    }
    if (!schoolId) {
      setError("Maktabni tanlang");
      return;
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
      onRegistered(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>📝 Ro'yxatdan o'tish</h1>
        <p className="muted">
          Yosh ijodkor sifatida ro'yxatdan o'tish uchun ma'lumotlaringizni
          kiriting. Maktab ma'muriyati arizangizni tasdiqlagandan so'ng siz
          o'z mahsulotlaringizni qo'sha olasiz.
        </p>
      </div>

      <form className="card" onSubmit={onSubmit}>
        {error && <div className="error">{error}</div>}

        {/* Avatar */}
        <div className="field" style={{ textAlign: "center" }}>
          <label
            style={{
              display: "inline-block",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt=""
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid var(--tg-link)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  border: "3px dashed #d1d5db",
                  color: "#9ca3af",
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
          <p className="hint" style={{ marginTop: 6 }}>
            Rasm qo'shish (ixtiyoriy)
          </p>
        </div>

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
            <div className="spinner" style={{ margin: "12px auto" }} />
          ) : (
            <select
              className="input"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
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
          <div className="field">
            <label className="label">Telefon</label>
            <input
              className="input"
              value={user.phone}
              disabled
              style={{ background: "#f3f4f6" }}
            />
            <p className="hint" style={{ marginTop: 6 }}>
              Telegram'dan ulashilgan raqam
            </p>
          </div>
        )}

        <button className="btn" disabled={saving || loadingSchools}>
          {saving ? "Yuborilmoqda..." : "Ariza yuborish"}
        </button>
      </form>
    </div>
  );
}
