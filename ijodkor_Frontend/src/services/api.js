// src/services/api.js
// API_URL ni o'zingizning domeningizga o'zgartiring

const API_URL = 'https://yoshijodkor.uz/api/index.php';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, data = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (data) opts.body = JSON.stringify(data);

  try {
    const res = await fetch(`${API_URL}${path}`, opts);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Xatolik yuz berdi');
    return json;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  login:      (login, password) => request('POST', '/auth/login', { login, password }),
  me:         ()                => request('GET',  '/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/products${q ? '?' + q : ''}`);
  },
  getProduct:   (id)   => request('GET',    `/products/${id}`),
  createProduct:(data) => request('POST',   '/products', data),
  updateProduct:(id, data) => request('PUT',`/products/${id}`, data),
  deleteProduct:(id)   => request('DELETE', `/products/${id}`),

  // Orders
  getOrders:    (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/orders${q ? '?' + q : ''}`);
  },
  createOrder:  (data)        => request('POST', '/orders', data),
  updateStatus: (id, status)  => request('PUT',  `/orders/${id}/status`, { status }),
  confirmPayment:(id, itemId, confirmed) =>
    request('PUT', `/orders/${id}/payment`, { item_id: itemId, confirmed }),

  // Users
  getUsers:     ()            => request('GET',    '/users'),
  createUser:   (data)        => request('POST',   '/users', data),
  updateUser:   (id, data)    => request('PUT',    `/users/${id}`, data),
  deleteUser:   (id)          => request('DELETE', `/users/${id}`),

  // Donations
  createDonation:(data)       => request('POST',   '/donations', data),
  getDonations:  ()           => request('GET',    '/donations'),

  // Stats
  getStats:      ()           => request('GET',    '/stats'),
};
