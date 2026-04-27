import { useState } from "react";
import { api } from "../lib/api";

const CATEGORIES = [
  { value: "paintings", label: "🎨 Rassomchilik" },
  { value: "handcraft", label: "✂️ Qo'l mehnati" },
  { value: "clothing", label: "👗 Tikilgan kiyimlar" },
  { value: "toys", label: "🧸 O'yinchoqlar" },
  { value: "souvenirs", label: "🎁 Suvenir/Sovg'a" },
  { value: "holiday", label: "🎉 Bayram/Dekor" },
  { value: "educational", label: "📚 Ta'limiy" },
  { value: "digital", label: "💻 Raqamli" },
  { value: "creative", label: "⭐ Ijodiy xizmat" },
  { value: "school", label: "🏫 Maktab loyihasi" },
  { value: "eco", label: "🌿 Eko/Tabiiy" },
  { value: "other", label: "📦 Boshqa" },
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
      alert("Rasm 2MB dan kichik bo'lsin");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Mahsulot nomini kiriting");
    if (!price || parseFloat(price) <= 0)
      return setError("Narx 0 dan katta bo'lishi kerak");
    if (!image) return setError("Rasmni yuklang");

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
      onCreated(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>🎨 Yangi mahsulot</h2>
          <button
            onClick={onClose}
            style={{
              border: 0,
              background: "transparent",
              fontSize: 24,
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: 20 }}>
          {error && <div className="error">{error}</div>}

          {/* Rasm */}
          <div className="field">
            <label className="label">Rasm *</label>
            <label
              style={{
                display: "block",
                cursor: "pointer",
                border: "2px dashed #d1d5db",
                borderRadius: 12,
                padding: image ? 0 : 30,
                textAlign: "center",
                color: "#9ca3af",
                background: "#f9fafb",
                overflow: "hidden",
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />
              ) : (
                <>
                  <div style={{ fontSize: 36 }}>📷</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>
                    Rasm yuklash
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onImage}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {/* Nomi */}
          <div className="field">
            <label className="label">Mahsulot nomi *</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Akril rasmi"
            />
          </div>

          {/* Narx + Soni */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="field">
              <label className="label">Narx (so'm) *</label>
              <input
                className="input"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="50000"
              />
            </div>
            <div className="field">
              <label className="label">Soni *</label>
              <input
                className="input"
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* Turi */}
          <div className="field">
            <label className="label">Turi</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tavsif */}
          <div className="field">
            <label className="label">Tavsif (ixtiyoriy)</label>
            <textarea
              className="textarea"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Mahsulot haqida qisqacha"
            />
          </div>

          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #fcd34d",
              color: "#92400e",
              padding: 10,
              borderRadius: 10,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            ℹ️ Mahsulotingiz maktab ma'muriyati tomonidan tasdiqlangandan keyin
            saytda ko'rinadi.
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
              className="btn"
              style={{ flex: 1 }}
              disabled={saving}
            >
              {saving ? "Yuborilmoqda..." : "Yuborish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
