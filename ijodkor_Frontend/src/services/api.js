const BASE_URL = "https://web-production-c57d3.up.railway.app/api";

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
  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok)
    throw new Error(json.detail || json.error || "Xatolik yuz berdi");
  return json;
}

export const api = {
  // Auth
  login: (username, password) =>
    request("POST", "/auth/login", { username, password }),
  register: (data) => request("POST", "/auth/register", data),
  me: () => request("GET", "/auth/me"),

  // Products
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request("GET", `/products${q ? "?" + q : ""}`).then((r) => ({
      data: Array.isArray(r) ? r : [],
    }));
  },
  getMyProducts: () =>
    request("GET", "/products/my").then((r) => ({
      data: Array.isArray(r) ? r : [],
    })),
  getProduct: (id) => request("GET", `/products/${id}`),
  createProduct: (data) => request("POST", "/products", data),
  updateProduct: (id, data) => request("PUT", `/products/${id}`, data),
  deleteProduct: (id) => request("DELETE", `/products/${id}`),

  // Orders
  getOrders: () =>
    request("GET", "/orders").then((r) => ({
      data: Array.isArray(r) ? r : [],
    })),
  createOrder: (data) => request("POST", "/orders", data),
  updateStatus: (id, status) =>
    request("PUT", `/orders/${id}/status`, { status }),

  // Custom orders
  getCustomOrders: () =>
    request("GET", "/custom-orders").then((r) => ({
      data: Array.isArray(r) ? r : [],
    })),
  createCustomOrder: (data) => request("POST", "/custom-orders", data),
  updateCustomStatus: (id, status) =>
    request("PUT", `/custom-orders/${id}/status`, { status }),

  // Users (admin)
  getUsers: () =>
    request("GET", "/users").then((r) => ({ data: Array.isArray(r) ? r : [] })),
  createUser: (data) => request("POST", "/users", data),
  updateUser: (id, data) => request("PUT", `/users/${id}`, data),
  deleteUser: (id) => request("DELETE", `/users/${id}`),
  toggleUser: (id) => request("PATCH", `/users/${id}/toggle`),
  updateProfile: (data) => request("PUT", "/auth/profile", data),
  getMySales: () =>
    request("GET", "/auth/my-sales").then((r) => (Array.isArray(r) ? r : [])),
  getProductsByUser: (userId) =>
    request("GET", `/products/user/${userId}`).then((r) =>
      Array.isArray(r) ? r : []
    ),
  sendContact: (data) => request("POST", "/contact/", data),
};
