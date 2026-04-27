const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

let _token = localStorage.getItem("tg_token") || null;

export function setToken(t) {
  _token = t;
  if (t) localStorage.setItem("tg_token", t);
  else localStorage.removeItem("tg_token");
}

export function getToken() {
  return _token;
}

async function request(method, path, data = null) {
  const headers = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;
  const opts = { method, headers };
  if (data) opts.body = JSON.stringify(data);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (res.status === 204) return null;
  let json;
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  if (!res.ok) {
    throw new Error(json.detail || json.error || `HTTP ${res.status}`);
  }
  return json;
}

export const api = {
  // Telegram
  webappAuth: (initData) =>
    request("POST", "/telegram/webapp-auth", { init_data: initData }),
  me: () => request("GET", "/telegram/me"),
  updateProfile: (data) => request("PUT", "/telegram/profile", data),

  // Student (o'quvchi) — ro'yxatdan o'tish
  getStudentMe: () => request("GET", "/telegram/student-me"),
  registerStudent: (data) =>
    request("POST", "/telegram/student-register", data),

  // O'quvchi mahsulotlari
  getMyStudentProducts: () =>
    request("GET", "/telegram/student-products").then((r) =>
      Array.isArray(r) ? r : []
    ),
  uploadStudentProduct: (data) =>
    request("POST", "/telegram/student-product", data),
  deleteMyStudentProduct: (id) =>
    request("DELETE", `/telegram/student-product/${id}`),

  // Maktablar (ro'yxatdan o'tishda dropdown uchun)
  getSchools: () =>
    request("GET", "/schools/").then((r) => (Array.isArray(r) ? r : [])),

  // Mahsulotlar (asosiy backend bilan bir xil)
  getProducts: () =>
    request("GET", "/products/").then((r) => (Array.isArray(r) ? r : [])),
  getProduct: (id) => request("GET", `/products/${id}`),
};
