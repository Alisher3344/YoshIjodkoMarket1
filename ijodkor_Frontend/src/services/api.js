// src/services/api.js
// Backend: FastAPI http://127.0.0.1:8000/api

const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

let _token = null;

export function setToken(token) {
  _token = token;
}
export function clearToken() {
  _token = null;
}
export function getToken() {
  return _token;
}

async function request(method, path, data = null) {
  const headers = { "Content-Type": "application/json" };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;

  const opts = { method, headers };
  if (data) opts.body = JSON.stringify(data);

  const res = await fetch(`${BASE}${path}`, opts);
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.detail || json.error || "Xatolik yuz berdi");
  return json;
}

export const authAPI = {
  login: (username, password) =>
    request("POST", "/auth/login", { username, password }),
  me: () => request("GET", "/auth/me"),
};

export const productsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/products${q ? "?" + q : ""}`);
  },
  getOne: (id) => request("GET", `/products/${id}`),
  create: (data) => request("POST", "/products", data),
  update: (id, data) => request("PUT", `/products/${id}`, data),
  delete: (id) => request("DELETE", `/products/${id}`),
};

export const ordersAPI = {
  create: (data) => request("POST", "/orders", data),
  getAll: () => request("GET", "/orders"),
  updateStatus: (id, status) =>
    request("PUT", `/orders/${id}/status`, { status }),
};

export const customOrdersAPI = {
  create: (data) => request("POST", "/custom-orders", data),
  getAll: () => request("GET", "/custom-orders"),
  updateStatus: (id, status) =>
    request("PUT", `/custom-orders/${id}/status`, { status }),
};

export const usersAPI = {
  getAll: () => request("GET", "/users"),
  create: (data) => request("POST", "/users", data),
  update: (id, data) => request("PUT", `/users/${id}`, data),
  delete: (id) => request("DELETE", `/users/${id}`),
  toggle: (id) => request("PATCH", `/users/${id}/toggle`),
};
