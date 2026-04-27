import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { haptic, showAlert } from "../lib/tg";

// DB'dan kelgan regions: [{name, cities:[{name}], districts:[{name}]}]
function buildAvailability(schools) {
  const regions = new Set();
  const citiesByRegion = {};
  const districtsByRegion = {};
  for (const s of schools || []) {
    if (s.region) {
      regions.add(s.region);
      if (s.city) {
        citiesByRegion[s.region] = citiesByRegion[s.region] || new Set();
        citiesByRegion[s.region].add(s.city);
      }
      if (s.district) {
        districtsByRegion[s.region] = districtsByRegion[s.region] || new Set();
        districtsByRegion[s.region].add(s.district);
      }
    }
  }
  return {
    hasRegion: (r) => regions.has(r),
    hasCity: (r, c) => !!citiesByRegion[r]?.has(c),
    hasDistrict: (r, d) => !!districtsByRegion[r]?.has(d),
  };
}

export default function StudentRegister({ user, onRegistered }) {
  const [name, setName] = useState(user?.name || "");
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [grade, setGrade] = useState("");
  const [avatar, setAvatar] = useState("");

  // Hududiy tanlov — 2 ta alohida input
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState(""); // shahar yoki tuman — bitta input
  const [schoolId, setSchoolId] = useState("");

  const [schools, setSchools] = useState([]);
  const [regionsData, setRegionsData] = useState([]); // DB'dan
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.getSchools().then((list) => setSchools(Array.isArray(list) ? list : [])).catch(() => setSchools([])),
      api.getRegions().then((list) => setRegionsData(Array.isArray(list) ? list : [])).catch(() => setRegionsData([])),
    ]).finally(() => setLoadingSchools(false));
  }, []);

  const availability = useMemo(() => buildAvailability(schools), [schools]);

  const REGION_NAMES = useMemo(
    () => regionsData.map((r) => r.name).sort(),
    [regionsData]
  );
  const getCities = (regionName) => {
    const r = regionsData.find((x) => x.name === regionName);
    return (r?.cities || []).map((c) => c.name);
  };
  const getDistricts = (regionName) => {
    const r = regionsData.find((x) => x.name === regionName);
    return (r?.districts || []).map((d) => d.name);
  };

  // Viloyat tanlanganda — shahar+tumanlar bitta flat ro'yxatda
  const districtOptions = useMemo(() => {
    if (!region) return [];
    const cities = getCities(region).map((c) => ({
      value: c,
      label: `🏙 ${c}`,
      enabled: availability.hasCity(region, c),
    }));
    const districts = getDistricts(region).map((d) => ({
      value: d,
      label: `🏞 ${d}`,
      enabled: availability.hasDistrict(region, d),
    }));
    return [...cities, ...districts];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, availability, regionsData]);

  // Tanlangan hudud bo'yicha maktablar
  const filteredSchools = useMemo(() => {
    if (!region || !district) return [];
    return schools.filter(
      (s) =>
        s.region === region && (s.city === district || s.district === district)
    );
  }, [schools, region, district]);

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
    if (!district) {
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

          {/* ─── 1-input: Viloyat ─────────────────────────────────── */}
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
                  setDistrict("");
                  setSchoolId("");
                  haptic.select();
                }}
              >
                <option value="">— Viloyatni tanlang —</option>
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
              Hozircha faqat maktablari bo'lgan viloyatlarni tanlay olasiz.
            </p>
          </div>

          {/* ─── 2-input: Shahar/Tuman ─────────────────────────────── */}
          <div className="field">
            <label className="label">Shahar yoki tuman *</label>
            <select
              className="input"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setSchoolId("");
                haptic.select();
              }}
              disabled={!region}
              style={{ opacity: region ? 1 : 0.5 }}
            >
              <option value="">
                {region
                  ? "— Shahar yoki tumanni tanlang —"
                  : "— Avval viloyatni tanlang —"}
              </option>
              {districtOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={!opt.enabled}
                  style={{ color: opt.enabled ? "inherit" : "#9ca3af" }}
                >
                  {opt.label}
                  {!opt.enabled ? "  (maktab yo'q)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* ─── 3-input: Maktab ──────────────────────────────────── */}
          <div className="field">
            <label className="label">Maktab *</label>
            {!region || !district ? (
              <div
                style={{
                  padding: "12px 14px",
                  border: "1px dashed #e5e7eb",
                  borderRadius: 12,
                  color: "#9ca3af",
                  fontSize: 13,
                  textAlign: "center",
                  background: "#fafafa",
                }}
              >
                Avval viloyat va tumanni tanlang
              </div>
            ) : filteredSchools.length === 0 ? (
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
                <option value="">— Maktabni tanlang —</option>
                {filteredSchools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
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
