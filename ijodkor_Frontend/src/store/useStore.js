import { create } from 'zustand';
import { translations } from '../data/translations';
import { api } from '../services/api';

export const ROLES = {
  student:  { key: 'student',  labelUz: "O'quvchi",                  labelRu: "Ученик",                       color: 'bg-blue-100 text-blue-700',   icon: '🎓' },
  school:   { key: 'school',   labelUz: "Maktab",                    labelRu: "Школа",                        color: 'bg-green-100 text-green-700', icon: '🏫' },
  parent:   { key: 'parent',   labelUz: "Ota-ona",                   labelRu: "Родитель",                     color: 'bg-yellow-100 text-yellow-700',icon: '👪' },
  district: { key: 'district', labelUz: "Hudud bo'yicha mas'ul",     labelRu: "Ответственный района",         color: 'bg-orange-100 text-orange-700',icon: '📍' },
  region:   { key: 'region',   labelUz: "Viloyat bo'yicha mas'ul",   labelRu: "Ответственный области",        color: 'bg-purple-100 text-purple-700',icon: '🗺️' },
  republic: { key: 'republic', labelUz: "Respublika bo'yicha mas'ul",labelRu: "Ответственный республики",     color: 'bg-red-100 text-red-700',     icon: '🇺🇿' },
  admin:    { key: 'admin',    labelUz: "Admin",                     labelRu: "Администратор",                color: 'bg-gray-800 text-white',      icon: '⚙️' },
};

const useStore = create((set, get) => ({
  // Language
  lang: localStorage.getItem('lang') || 'uz',
  setLang: (lang) => { localStorage.setItem('lang', lang); set({ lang }); },
  t: (key) => { const { lang } = get(); return translations[lang][key] || key; },

  // Cart
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
  addToCart: (product) => {
    const cart = get().cart;
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, item.stock) } : item);
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    localStorage.setItem('cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },
  removeFromCart: (id) => {
    const newCart = get().cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },
  updateQty: (id, qty) => {
    if (qty < 1) { get().removeFromCart(id); return; }
    const newCart = get().cart.map(item => item.id === id ? { ...item, qty: Math.min(qty, item.stock) } : item);
    localStorage.setItem('cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },
  clearCart: () => { localStorage.setItem('cart', '[]'); set({ cart: [] }); },
  cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.qty, 0),
  cartCount: () => get().cart.reduce((sum, item) => sum + item.qty, 0),

  // UI
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
  searchQuery: '',
  setSearchQuery: (v) => set({ searchQuery: v }),
  selectedCategory: 'all',
  setSelectedCategory: (v) => set({ selectedCategory: v }),
  sortBy: 'newest',
  setSortBy: (v) => set({ sortBy: v }),

  // Auth — real API
  adminLoggedIn: !!localStorage.getItem('token'),
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
  adminLogin: async (login, password) => {
    try {
      const res = await api.login(login, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      set({ adminLoggedIn: true, currentUser: res.user });
      return true;
    } catch (err) {
      return false;
    }
  },
  adminLogout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    set({ adminLoggedIn: false, currentUser: null });
  },
  changeAdminPassword: async (oldPass, newPass) => {
    try {
      const user = get().currentUser;
      // Avval login orqali tekshiramiz
      await api.login(user.login, oldPass);
      await api.updateUser(user.id, { password: newPass });
      return true;
    } catch {
      return false;
    }
  },

  // Products — real API
  products: [],
  productsLoading: false,
  fetchProducts: async (params = {}) => {
    set({ productsLoading: true });
    try {
      const res = await api.getProducts(params);
      set({ products: res.data || [] });
    } catch (err) {
      console.error('Products fetch error:', err);
    } finally {
      set({ productsLoading: false });
    }
  },
  customProducts: [], // legacy uchun
  addProduct: async (product) => {
    const res = await api.createProduct(product);
    await get().fetchProducts();
    return res;
  },
  editProduct: async (id, data) => {
    await api.updateProduct(id, data);
    await get().fetchProducts();
  },
  deleteProduct: async (id) => {
    await api.deleteProduct(id);
    await get().fetchProducts();
  },

  // Orders — real API
  orders: [],
  ordersLoading: false,
  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const res = await api.getOrders();
      set({ orders: res.data || [] });
    } catch (err) {
      console.error('Orders fetch error:', err);
    } finally {
      set({ ordersLoading: false });
    }
  },
  addOrder: async (order) => {
    const res = await api.createOrder({
      customer_name: order.name,
      customer_phone: order.phone,
      customer_address: order.address,
      city: order.city,
      payment_method: order.payment,
      note: order.note,
      items: order.items.map(i => ({
        id: i.id,
        nameUz: i.nameUz,
        nameRu: i.nameRu,
        image: i.image,
        author: i.author,
        school: i.school,
        cardNumber: i.cardNumber,
        student_type: i.studentType,
        price: i.price,
        qty: i.qty,
      })),
    });
    return res;
  },
  updateOrderStatus: async (id, status) => {
    await api.updateStatus(id, status);
    await get().fetchOrders();
  },

  // Users — real API
  users: [],
  fetchUsers: async () => {
    try {
      const res = await api.getUsers();
      set({ users: res.data || [] });
    } catch (err) {
      console.error('Users fetch error:', err);
    }
  },
  addUser: async (user) => {
    await api.createUser(user);
    await get().fetchUsers();
  },
  editUser: async (id, data) => {
    await api.updateUser(id, data);
    await get().fetchUsers();
  },
  deleteUser: async (id) => {
    await api.deleteUser(id);
    await get().fetchUsers();
  },
  toggleUserStatus: async (id) => {
    const user = get().users.find(u => u.id === id);
    if (!user) return;
    await api.updateUser(id, { status: user.status === 'active' ? 'blocked' : 'active' });
    await get().fetchUsers();
  },

  // Stats
  stats: null,
  fetchStats: async () => {
    try {
      const res = await api.getStats();
      set({ stats: res });
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  },
}));

export default useStore;
