import { useState } from "react";
import { api } from "../lib/api";
import { showAlert } from "../lib/tg";

export default function ProfileForm({ user, onSaved }) {
  const [name, setName] = useState(user?.name || "");
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Ismni kiriting");
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        name: name.trim(),
        full_name: fullName.trim(),
      });
      onSaved(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>👋 Xush kelibsiz!</h1>
        <p className="muted">
          Davom etish uchun ism va familiyangizni kiriting.
        </p>
      </div>

      <form className="card" onSubmit={onSubmit}>
        {error && <div className="error">{error}</div>}

        <div className="field">
          <label className="label">Ism *</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alisher"
            autoFocus
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
              Telegram'dan ulashilgan raqam — o'zgartirib bo'lmaydi
            </p>
          </div>
        )}

        <button className="btn" disabled={saving}>
          {saving ? "Saqlanmoqda..." : "Davom etish"}
        </button>
      </form>
    </div>
  );
}
