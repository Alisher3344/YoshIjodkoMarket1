import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { haptic, showAlert } from "../lib/tg";
import {
  REGION_NAMES,
  getCities,
  getDistricts,
  buildAvailability,
} from "../lib/uzRegions";

export default function StudentRegister({ user, onRegistered }) {
  const [name, setName] = useState(user?.name || "");
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [grade, setGrade] = useState("");
  const [avatar, setAvatar] = useState("");

  // Hududiy tanlov
  const [region, setRegion] = useState("");
  // location: {type: "city"|"district", value: "..."}
  const [location, setLocation] = useState(null);
  const [schoolId, setSchoolId] = useState("");

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

  const availability = useMemo(() => buildAvailability(schools), [schools]);

  // Tanlangan viloyat va hududga mos maktablar
  const filteredSchools = useMemo(() => {
    if (!region) return [];
    return schools.filter((s) => {
      if (s.region !== region) return false;
      if (location?.type === "city") return s.city === location.value;
      if (location?.type === "district") return s.district === location.value;
      return false;
    });
  }, [schools, region, location]);

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
    if (!region) {
      haptic.error();
      return setError("Viloyatni tanlang");
    }
    if (!location) {
      haptic.error();
      return setError("Shahar yoki tumanni tanlang");
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
          tasdiqlagandan so'ng mahsulot qo'sha olasiz.
        </p>
      </div>

      <form onSubmit={onSubmit} className="fade-in">
        {/* Avatar */}
        <div className="card" style={{ textAlign: "center" }}>
          <label
            style={{
              display: "inline-block",
              width: 112,
              height: 112,
              borderRadius: "50%",
              cursor: "pointer",
              border: "3px solid var(--brand-1)",
              padding: 0,
              overflow: "hidden",
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
            {avatar
              ? "Rasmni o'zgartirish uchun bosing"
              : "Profil rasmini yuklang (ixtiyoriy)"}
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

          {/* Viloyat tanlash */}
          <div className="field">
            <label className="label">Viloyatingiz *</label>
            {loadingSchools ? (
              <div className="skeleton" style={{ height: 46 }} />
            ) : (
              <select
                className="input"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setLocation(null);
                  setSchoolId("");
                  haptic.select();
                }}
              >
                <option value="">— Tanlang —</option>
                {REGION_NAMES.map((r) => {
                  const enabled = availability.hasRegion(r);
                  return (
                    <option
                      key={r}
                      value={r}
                      disabled={!enabled}
                      style={{
                        color: enabled ? "inherit" : "#9ca3af",
                      }}
                    >
                      {r}
                      {!enabled ? "  (maktab yo'q)" : ""}
                    </option>
                  );
                })}
              </select>
            )}
            <p className="hint" style={{ marginTop: 6, marginBottom: 0 }}>
              Hozircha faqat maktablar biriktirilgan viloyatlarni tanlay olasiz.
            </p>
          </div>

          {/* Shahar / Tuman tanlash */}
          {region && (
            <div className="field">
              <label className="label">Shahar yoki tuman *</label>
              <select
                className="input"
                value={location ? `${location.type}:${location.value}` : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) {
                    setLocation(null);
                  } else {
                    const [type, ...rest] = v.split(":");
                    setLocation({ type, value: rest.join(":") });
                  }
                  setSchoolId("");
                  haptic.select();
                }}
              >
                <option value="">— Tanlang —</option>

                {getCities(region).length > 0 && (
                  <optgroup label="🏙 Shaharlar">
                    {getCities(region).map((c) => {
                      const enabled = availability.hasCity(region, c);
                      return (
                        <option
                          key={c}
                          value={`city:${c}`}
                          disabled={!enabled}
                          style={{ color: enabled ? "inherit" : "#9ca3af" }}
                        >
                          {c}
                          {!enabled ? "  (maktab yo'q)" : ""}
                        </option>
                      );
                    })}
                  </optgroup>
                )}

                {getDistricts(region).length > 0 && (
                  <optgroup label="🏞 Tumanlar">
                    {getDistricts(region).map((d) => {
                      const enabled = availability.hasDistrict(region, d);
                      return (
                        <option
                          key={d}
                          value={`district:${d}`}
                          disabled={!enabled}
                          style={{ color: enabled ? "inherit" : "#9ca3af" }}
                        >
                          {d}
                          {!enabled ? "  (maktab yo'q)" : ""}
                        </option>
                      );
                    })}
                  </optgroup>
                )}
              </select>
            </div>
          )}

          {/* Maktab tanlash */}
          {region && location && (
            <div className="field">
              <label className="label">Maktab *</label>
              {filteredSchools.length === 0 ? (
                <div
                  style={{
                    padding: "12px 14px",
                    border: "1px dashed #e5e7eb",
                    borderRadius: 12,
                    color: "#9ca3af",
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  Bu hududda maktab topilmadi
                </div>
              ) : (
                <select
                  className="input"
                  value={schoolId}
                  onChange={(e) => {
                    setSchoolId(e.target.value);
                    haptic.select();
                  }}
                >
                  <option value="">— Tanlang —</option>
                  {filteredSchools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

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
