const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

let _token = localStorage.getItem("token") || null;

export function setToken(t) {
  _token = t;
  localStorage.setItem("token", t);
}
export function clearToken() {
  _token = null;
  localStorage.removeItem("token");
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

export const api = {
  login: (username, password) =>
    request("POST", "/auth/login", { username, password }),
  me: () => request("GET", "/auth/me"),

  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/products${q ? "?" + q : ""}`).then((r) => ({
      data: Array.isArray(r) ? r : [],
    }));
  },
  getProduct: (id) => request("GET", `/products/${id}`),
  createProduct: (data) => request("POST", "/products", data),
  updateProduct: (id, data) => request("PUT", `/products/${id}`, data),
  deleteProduct: (id) => request("DELETE", `/products/${id}`),

  getOrders: () =>
    request("GET", "/orders").then((r) => ({
      data: Array.isArray(r) ? r : [],
    })),
  createOrder: (data) => request("POST", "/orders", data),
  updateStatus: (id, status) =>
    request("PUT", `/orders/${id}/status`, { status }),

  getCustomOrders: () =>
    request("GET", "/custom-orders").then((r) => ({
      data: Array.isArray(r) ? r : [],
    })),
  createCustomOrder: (data) => request("POST", "/custom-orders", data),
  updateCustomStatus: (id, status) =>
    request("PUT", `/custom-orders/${id}/status`, { status }),

  getUsers: () =>
    request("GET", "/users").then((r) => ({ data: Array.isArray(r) ? r : [] })),
  createUser: (data) => request("POST", "/users", data),
  updateUser: (id, data) => request("PUT", `/users/${id}`, data),
  deleteUser: (id) => request("DELETE", `/users/${id}`),
  toggleUser: (id) => request("PATCH", `/users/${id}/toggle`),
};
