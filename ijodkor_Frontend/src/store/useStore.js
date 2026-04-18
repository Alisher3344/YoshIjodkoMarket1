// src/store/useStore.js
import { create } from "zustand";
import { translations } from "../data/translations";
import {
  authAPI,
  productsAPI,
  ordersAPI,
  customOrdersAPI,
  usersAPI,
  setToken,
  clearToken,
} from "../services/api"; // ← services/api (utils/api emas!)

function toList(r) {
  return Array.isArray(r) ? r : r?.data || r?.items || [];
}

const useStore = create((set, get) => ({
  // ── Til ────────────────────────────────────────────────────────────────
  lang: "uz",
  setLang: (lang) => set({ lang }),
  t: (key) => translations[get().lang]?.[key] || key,

  // ── Savat (xotirada) ───────────────────────────────────────────────────
  cart: [],
  addToCart: (product) => {
    const cart = get().cart;
    const ex = cart.find((i) => i.id === product.id);
    set({
      cart: ex
        ? cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { ...product, qty: 1 }],
    });
  },
  removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),
  updateQty: (id, qty) => {
    if (qty < 1) {
      get().removeFromCart(id);
      return;
    }
    set({ cart: get().cart.map((i) => (i.id === id ? { ...i, qty } : i)) });
  },
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((s, i) => s + i.price * i.qty, 0),
  cartCount: () => get().cart.reduce((s, i) => s + i.qty, 0),

  // ── UI ─────────────────────────────────────────────────────────────────
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  searchQuery: "",
  setSearchQuery: (v) => set({ searchQuery: v }),
  selectedCategory: "all",
  setSelectedCategory: (v) => set({ selectedCategory: v }),
  sortBy: "newest",
  setSortBy: (v) => set({ sortBy: v }),

  // ── Auth ───────────────────────────────────────────────────────────────
  adminLoggedIn: false,
  currentUser: null,

  adminLogin: async (username, password) => {
    try {
      const res = await authAPI.login(username, password);
      const token = res.token || res.access_token;
      if (!token) throw new Error("Token kelmadi");
      setToken(token);
      set({ adminLoggedIn: true, currentUser: res.user || null });
      return true;
    } catch {
      return false;
    }
  },

  adminLogout: () => {
    clearToken();
    set({ adminLoggedIn: false, currentUser: null });
  },

  // ── Mahsulotlar ────────────────────────────────────────────────────────
  products: [],
  customProducts: [], // AdminPage uchun (legacy)
  productsLoading: false,

  fetchProducts: async (params = {}) => {
    set({ productsLoading: true });
    try {
      const res = await productsAPI.getAll(params);
      set({ products: toList(res) });
    } catch (err) {
      console.error("fetchProducts:", err.message);
      set({ products: [] });
    } finally {
      set({ productsLoading: false });
    }
  },

  addProduct: async (data) => {
    const p = await productsAPI.create(data);
    await get().fetchProducts();
    return p;
  },

  editProduct: async (id, data) => {
    await productsAPI.update(id, data);
    await get().fetchProducts();
  },

  deleteProduct: async (id) => {
    await productsAPI.delete(id);
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  // ── Buyurtmalar ────────────────────────────────────────────────────────
  orders: [],
  ordersLoading: false,

  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const res = await ordersAPI.getAll();
      set({ orders: toList(res) });
    } catch (err) {
      console.error("fetchOrders:", err.message);
    } finally {
      set({ ordersLoading: false });
    }
  },

  addOrder: async (order) => {
    const payload = {
      customer_name: order.name || order.customer_name,
      customer_phone: order.phone || order.customer_phone,
      customer_address: order.address || order.customer_address || "",
      city: order.city || "",
      payment_method: order.payment || order.payment_method || "cash",
      note: order.note || "",
      total: order.total || 0,
      items: (order.items || []).map((i) => ({
        product_id: i.id || i.product_id,
        name_uz: i.name_uz || i.nameUz || "",
        name_ru: i.name_ru || i.nameRu || "",
        price: i.price,
        qty: i.qty,
        image: i.image || "",
        author: i.author || "",
        school: i.school || "",
        card_number: i.card_number || i.cardNumber || "",
        student_type: i.student_type || i.studentType || "normal",
      })),
    };
    const res = await ordersAPI.create(payload);
    return res;
  },

  updateOrderStatus: async (id, status) => {
    await ordersAPI.updateStatus(id, status);
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });
  },

  // ── Maxsus buyurtmalar ─────────────────────────────────────────────────
  customOrders: [],

  fetchCustomOrders: async () => {
    try {
      const res = await customOrdersAPI.getAll();
      set({ customOrders: toList(res) });
    } catch (err) {
      console.error("fetchCustomOrders:", err.message);
    }
  },

  addCustomOrder: async (order) => {
    const payload = {
      customer_name: order.name || order.customer_name,
      customer_phone: order.phone || order.customer_phone,
      customer_address: order.address || "",
      order_type: order.type || order.order_type || "",
      description: order.desc || order.description || "",
      budget: order.budget || "",
      deadline: order.deadline || "",
      payment_method: order.payment || order.payment_method || "",
    };
    const res = await customOrdersAPI.create(payload);
    return res;
  },

  // ── Foydalanuvchilar ───────────────────────────────────────────────────
  users: [],

  fetchUsers: async () => {
    try {
      const res = await usersAPI.getAll();
      set({ users: toList(res) });
    } catch (err) {
      console.error("fetchUsers:", err.message);
    }
  },

  addUser: async (user) => {
    await usersAPI.create(user);
    await get().fetchUsers();
  },

  editUser: async (id, data) => {
    await usersAPI.update(id, data);
    await get().fetchUsers();
  },

  deleteUser: async (id) => {
    await usersAPI.delete(id);
    set({ users: get().users.filter((u) => u.id !== id) });
  },

  toggleUserStatus: async (id) => {
    await usersAPI.toggle(id);
    await get().fetchUsers();
  },

  // ── Statistika ─────────────────────────────────────────────────────────
  stats: null,
  fetchStats: async () => {
    try {
      const orders = get().orders;
      set({
        stats: {
          total_orders: orders.length,
          new_orders: orders.filter((o) => o.status === "new").length,
          revenue: orders
            .filter((o) => o.status === "done")
            .reduce((s, o) => s + (o.total || 0), 0),
        },
      });
    } catch (err) {
      console.error("fetchStats:", err.message);
    }
  },
}));

export default useStore;
