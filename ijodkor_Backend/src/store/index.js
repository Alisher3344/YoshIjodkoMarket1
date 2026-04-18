import { create } from "zustand";
import { translations } from "../i18n/translations";
import {
  authAPI,
  productsAPI,
  ordersAPI,
  customOrdersAPI,
  usersAPI,
  setToken,
  clearToken,
} from "../utils/api";

// ── Til ──────────────────────────────────────────────────────────────────
export const useLangStore = create((set, get) => ({
  lang: "uz",
  setLang: (lang) => set({ lang }),
  t: (key) => translations[get().lang][key] || key,
}));

// ── Savat ─────────────────────────────────────────────────────────────────
// Savat xotirada — sahifa yopilsa tozalanadi
export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { ...product, qty: 1 }] });
    }
  },

  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

  updateQty: (id, qty) => {
    if (qty < 1) return;
    set({
      items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
    });
  },

  clearCart: () => set({ items: [] }),

  get total() {
    return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  get count() {
    return get().items.reduce((sum, i) => sum + i.qty, 0);
  },
}));

// ── Auth ──────────────────────────────────────────────────────────────────
export const useAuthStore = create((set) => ({
  isLoggedIn: false,
  user: null,

  loginWithAPI: async (username, password) => {
    try {
      const res = await authAPI.login(username, password);
      setToken(res.token);
      set({ isLoggedIn: true, user: res.user });
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    clearToken();
    set({ isLoggedIn: false, user: null });
  },
}));

// ── Mahsulotlar ───────────────────────────────────────────────────────────
export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const products = await productsAPI.getAll(params);
      set({ products });
    } catch (err) {
      set({ error: err.message, products: [] });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (product) => {
    const newProduct = await productsAPI.create(product);
    set({ products: [newProduct, ...get().products] });
    return { success: true };
  },

  updateProduct: async (id, data) => {
    const updated = await productsAPI.update(id, data);
    set({
      products: get().products.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      ),
    });
  },

  deleteProduct: async (id) => {
    await productsAPI.delete(id);
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  getByCategory: (cat) => {
    if (!cat || cat === "all") return get().products;
    return get().products.filter((p) => p.category === cat);
  },

  search: (query) => {
    const q = query.toLowerCase();
    return get().products.filter(
      (p) =>
        p.name_uz?.toLowerCase().includes(q) ||
        p.name_ru?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q)
    );
  },
}));

// ── Buyurtmalar ───────────────────────────────────────────────────────────
export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    try {
      const orders = await ordersAPI.getAll();
      set({ orders });
    } finally {
      set({ loading: false });
    }
  },

  addOrder: async (orderData) => {
    const res = await ordersAPI.create(orderData);
    return res.id;
  },

  updateStatus: async (id, status) => {
    await ordersAPI.updateStatus(id, status);
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });
  },

  getStats: () => {
    const orders = get().orders;
    const revenue = orders
      .filter((o) => o.status === "done")
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      total: orders.length,
      new: orders.filter((o) => o.status === "new").length,
      done: orders.filter((o) => o.status === "done").length,
      revenue,
    };
  },
}));

// ── Maxsus buyurtmalar ────────────────────────────────────────────────────
export const useCustomOrderStore = create((set, get) => ({
  customOrders: [],
  loading: false,

  fetchCustomOrders: async () => {
    set({ loading: true });
    try {
      const customOrders = await customOrdersAPI.getAll();
      set({ customOrders });
    } finally {
      set({ loading: false });
    }
  },

  addCustomOrder: async (order) => {
    const res = await customOrdersAPI.create(order);
    return res.id;
  },

  updateCustomStatus: async (id, status) => {
    await customOrdersAPI.updateStatus(id, status);
    set({
      customOrders: get().customOrders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    });
  },
}));

// ── Foydalanuvchilar ──────────────────────────────────────────────────────
export const useUsersStore = create((set, get) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const users = await usersAPI.getAll();
      set({ users });
    } finally {
      set({ loading: false });
    }
  },

  addUser: async (user) => {
    const newUser = await usersAPI.create(user);
    set({ users: [newUser, ...get().users] });
    return { success: true };
  },

  updateUser: async (id, data) => {
    await usersAPI.update(id, data);
    set({
      users: get().users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    });
  },

  deleteUser: async (id) => {
    await usersAPI.delete(id);
    set({ users: get().users.filter((u) => u.id !== id) });
  },

  toggleActive: async (id) => {
    await usersAPI.toggle(id);
    set({
      users: get().users.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      ),
    });
  },
}));
