import { useState } from "react";
import { api } from "../lib/api";
import { haptic, showAlert } from "../lib/tg";

const CATEGORIES = [
  { value: "paintings",   emoji: "🎨", label: "Rassomchilik" },
  { value: "handcraft",   emoji: "✂️", label: "Qo'l mehnati" },
  { value: "clothing",    emoji: "👗", label: "Tikilgan kiyimlar" },
  { value: "toys",        emoji: "🧸", label: "O'yinchoqlar" },
  { value: "souvenirs",   emoji: "🎁", label: "Suvenir / Sovg'a" },
  { value: "holiday",     emoji: "🎉", label: "Bayram / Dekor" },
  { value: "educational", emoji: "📚", label: "Ta'limiy" },
  { value: "digital",     emoji: "💻", label: "Raqamli" },
  { value: "creative",    emoji: "⭐", label: "Ijodiy xizmat" },
  { value: "school",      emoji: "🏫", label: "Maktab loyihasi" },
  { value: "eco",         emoji: "🌿", label: "Eko / Tabiiy" },
  { value: "other",       emoji: "📦", label: "Boshqa" },
];

export default function ProductForm({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [category, setCategory] = useState("paintings");
  const [image, setImage] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      haptic.error();
      showAlert("Rasm 2MB dan kichik bo'lsin");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target.result);
      haptic.light();
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      haptic.error();
      return setError("Mahsulot nomini kiriting");
    }
    if (!price || parseFloat(price) <= 0) {
      haptic.error();
      return setError("Narx 0 dan katta bo'lishi kerak");
    }
    if (!image) {
      haptic.error();
      return setError("Rasmni yuklang");
    }

    setSaving(true);
    try {
      const created = await api.uploadStudentProduct({
        name_uz: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock) || 1,
        category,
        image,
        desc_uz: desc.trim(),
      });
      haptic.success();
      onCreated(created);
    } catch (err) {
      haptic.error();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="sheet-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-title">
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>🎨</span>
            Yangi mahsulot
          </h2>
          <button
            className="sheet-close"
            onClick={() => {
              haptic.light();
              onClose();
            }}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {error && <div className="error">⚠️ {error}</div>}

          {/* Rasm yuklash */}
          <div className="field">
            <label className="label">Mahsulot rasmi *</label>
            {image ? (
              <label className="upload-zone-image">
                <img src={image} alt="" />
                <div className="upload-zone-overlay">📷 O'zgartirish</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImage}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <label className="upload-zone">
                <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                <div style={{ fontWeight: 700, color: "var(--text-1)", fontSize: 14 }}>
                  Rasm yuklash
                </div>
                <div className="hint" style={{ marginTop: 4 }}>
                  Maksimal 2 MB
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImage}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>

          {/* Nom */}
          <div className="field">
            <label className="label">Mahsulot nomi *</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Akril rasmi"
              maxLength={80}
            />
          </div>

          {/* Narx + Soni */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
            <div className="field">
              <label className="label">Narx (so'm) *</label>
              <input
                className="input"
                type="number"
                inputMode="numeric"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50 000"
              />
            </div>
            <div className="field">
              <label className="label">Soni *</label>
              <input
                className="input"
                type="number"
                inputMode="numeric"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* Turi — chip selector */}
          <div className="field">
            <label className="label">Turi</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                maxHeight: 130,
                overflowY: "auto",
                padding: 4,
                margin: -4,
              }}
            >
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setCategory(c.value);
                    haptic.select();
                  }}
                  style={{
                    border: "1.5px solid",
                    borderColor: category === c.value
                      ? "var(--brand-1)"
                      : "var(--border)",
                    background: category === c.value
                      ? "rgba(37, 99, 235, 0.08)"
                      : "var(--surface-1)",
                    color: category === c.value
                      ? "var(--brand-1)"
                      : "var(--text-2)",
                    borderRadius: "var(--r-full)",
                    padding: "8px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all var(--t-fast)",
                  }}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tavsif */}
          <div className="field">
            <label className="label">Tavsif (ixtiyoriy)</label>
            <textarea
              className="textarea"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Mahsulot haqida qisqacha…"
              maxLength={300}
            />
          </div>

          <div className="alert alert-info" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <div>
              Mahsulotingiz maktab ma'muriyati tomonidan tasdiqlangandan keyin
              saytda ko'rinadi.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Bekor
            </button>
            <button
              type="submit"
              className="btn btn-gradient"
              style={{ flex: 1.4 }}
              disabled={saving}
            >
              {saving ? "Yuborilmoqda…" : "Yuborish →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
