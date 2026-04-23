import { create } from "zustand";
import { translations } from "../components/ui/data/translations";
import { api, setToken, clearToken } from "../services/api";

export const ROLES = {
  student: {
    key: "student",
    labelUz: "O'quvchi",
    labelRu: "Ученик",
    color: "bg-blue-100 text-blue-700",
    icon: "🎓",
  },
  admin: {
    key: "admin",
    labelUz: "Admin",
    labelRu: "Администратор",
    color: "bg-gray-800 text-white",
    icon: "⚙️",
  },
  superadmin: {
    key: "superadmin",
    labelUz: "Super Admin",
    labelRu: "Супер Админ",
    color: "bg-red-600 text-white",
    icon: "👑",
  },
};

function norm(p) {
  return {
    ...p,
    nameUz: p.name_uz || p.nameUz || "",
    nameRu: p.name_ru || p.nameRu || "",
    descUz: p.desc_uz || p.descUz || "",
    descRu: p.desc_ru || p.descRu || "",
    authorRu: p.author_ru || p.authorRu || "",
    schoolRu: p.school_ru || p.schoolRu || "",
    districtRu: p.district_ru || p.districtRu || "",
    regionRu: p.region_ru || p.regionRu || "",
    oldPrice: p.old_price ?? p.oldPrice ?? null,
    studentType: p.student_type || p.studentType || "normal",
    cardNumber: p.card_number || p.cardNumber || "",
    storyUz: p.story_uz || p.storyUz || "",
    storyRu: p.story_ru || p.storyRu || "",
    authorAvatar: p.author_avatar || p.authorAvatar || "",
    illnessInfo: p.illness_info || p.illnessInfo || "",
    fullName: p.full_name || p.fullName || "",
  };
}

function toBackend(d) {
  return {
    name_uz: d.nameUz || d.name_uz || "",
    name_ru: d.nameRu || d.name_ru || "",
    desc_uz: d.descUz || d.desc_uz || "",
    desc_ru: d.descRu || d.desc_ru || "",
    price: Number(d.price) || 0,
    old_price: d.oldPrice ? Number(d.oldPrice) : null,
    stock: Number(d.stock) || 0,
    category: d.category || "",
    badge: d.badge || "",
    author: d.author || "",
    author_ru: d.authorRu || d.author_ru || "",
    school: d.school || "",
    school_ru: d.schoolRu || d.school_ru || "",
    grade: d.grade || "",
    district: d.district || "",
    district_ru: d.districtRu || d.district_ru || "",
    region: d.region || "",
    region_ru: d.regionRu || d.region_ru || "",
    phone: d.phone || "",
    student_type: d.studentType || d.student_type || "normal",
    card_number: d.cardNumber || d.card_number || "",
    story_uz: d.storyUz || d.story_uz || "",
    story_ru: d.storyRu || d.story_ru || "",
    photo: d.photo || "",
    image: d.image || "",
    rating: d.rating || 5.0,
    reviews: d.reviews || 0,
    sold: d.sold || 0,
  };
}

const useStore = create((set, get) => ({
  lang: localStorage.getItem("lang") || "uz",
  setLang: (lang) => {
    localStorage.setItem("lang", lang);
    set({ lang });
  },
  t: (key) => {
    const { lang } = get();
    return translations[lang]?.[key] || key;
  },

  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  addToCart: (product) => {
    const cart = get().cart;
    const existing = cart.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, qty: Math.min(item.qty + 1, item.stock || 99) }
          : item
      );
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    localStorage.setItem("cart", JSON.stringify(newCart));
    set({ cart: newCart });
  },
  removeFromCart: (id) => {
    const newCart = get().cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    set({ cart: newCart });
  },
  updateQty: (id, qty) => {
    if (qty < 1) {
      get().removeFromCart(id);
      return;
    }
    const newCart = get().cart.map((item) =>
      item.id === id ? { ...item, qty: Math.min(qty, item.stock || 99) } : item
    );
    localStorage.setItem("cart", JSON.stringify(newCart));
    set({ cart: newCart });
  },
  clearCart: () => {
    localStorage.setItem("cart", "[]");
    set({ cart: [] });
  },
  cartTotal: () =>
    get().cart.reduce((sum, item) => sum + item.price * item.qty, 0),
  cartCount: () => get().cart.reduce((sum, item) => sum + item.qty, 0),

  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
  searchQuery: "",
  setSearchQuery: (v) => set({ searchQuery: v }),
  selectedCategory: "all",
  setSelectedCategory: (v) => set({ selectedCategory: v }),
  sortBy: "newest",
  setSortBy: (v) => set({ sortBy: v }),

  darkMode: localStorage.getItem("darkMode") === "true",
  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark", next);
    set({ darkMode: next });
  },

  adminLoggedIn: !!localStorage.getItem("token"),
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),

  adminLogin: async (username, password) => {
    try {
      const res = await api.login(username, password);
      const token = res.token || res.access_token;
      if (!token) return false;
      setToken(token);
      localStorage.setItem("currentUser", JSON.stringify(res.user));
      set({ adminLoggedIn: true, currentUser: res.user });
      return true;
    } catch {
      return false;
    }
  },

  register: async ({ name, full_name, phone, password }) => {
    try {
      const res = await api.register({ name, full_name, phone, password });
      const token = res.token || res.access_token;
      if (!token) return { ok: false, error: "Token kelmadi" };
      setToken(token);
      localStorage.setItem("currentUser", JSON.stringify(res.user));
      set({ adminLoggedIn: true, currentUser: res.user });
      return { ok: true, user: res.user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.updateProfile(data);
      localStorage.setItem("currentUser", JSON.stringify(res));
      set({ currentUser: res });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  adminLogout: () => {
    clearToken();
    localStorage.removeItem("currentUser");
    set({
      adminLoggedIn: false,
      currentUser: null,
      myProducts: [],
      myStudents: [],
      studentProducts: [],
      selectedStudent: null,
    });
  },

  products: [],
  customProducts: [],
  productsLoading: false,

  fetchProducts: async (params = {}) => {
    set({ productsLoading: true });
    try {
      const res = await api.getProducts(params);
      set({ products: (res.data || []).map(norm) });
    } catch (err) {
      console.error("fetchProducts:", err.message);
      set({ products: [] });
    } finally {
      set({ productsLoading: false });
    }
  },

  addProduct: async (data) => {
    await api.createProduct(toBackend(data));
    await get().fetchProducts();
    if (get().currentUser) await get().fetchMyProducts();
  },
  editProduct: async (id, data) => {
    await api.updateProduct(id, toBackend(data));
    await get().fetchProducts();
    if (get().currentUser) await get().fetchMyProducts();
  },
  deleteProduct: async (id) => {
    await api.deleteProduct(id);
    set({ products: get().products.filter((p) => p.id !== id) });
    set({ myProducts: get().myProducts.filter((p) => p.id !== id) });
  },

  myProducts: [],
  fetchMyProducts: async () => {
    try {
      const res = await api.getMyProducts();
      set({ myProducts: (res.data || []).map(norm) });
    } catch (err) {
      console.error("fetchMyProducts:", err.message);
      set({ myProducts: [] });
    }
  },

  orders: [],
  ordersLoading: false,
  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const res = await api.getOrders();
      set({ orders: res.data || [] });
    } catch (err) {
      console.error("fetchOrders:", err.message);
    } finally {
      set({ ordersLoading: false });
    }
  },
  addOrder: async (order) => {
    const user = get().currentUser;
    return await api.createOrder({
      customer_name: order.name || order.customer_name,
      customer_phone: order.phone || order.customer_phone,
      customer_address: order.address || order.customer_address || "",
      city: order.city || "",
      payment_method: order.payment || order.payment_method || "cash",
      note: order.note || "",
      total: order.total || 0,
      buyer_user_id: user?.id || null,
      buyer_user_name: user?.name || "",
      buyer_user_phone: user?.phone || user?.username || "",
      items: (order.items || []).map((i) => ({
        product_id: i.id || i.product_id,
        name_uz: i.nameUz || i.name_uz || "",
        name_ru: i.nameRu || i.name_ru || "",
        price: i.price,
        qty: i.qty,
        image: i.image || "",
        author: i.author || "",
        school: i.school || "",
        card_number: i.cardNumber || i.card_number || "",
        student_type: i.studentType || i.student_type || "normal",
      })),
    });
  },
  updateOrderStatus: async (id, status) => {
    await api.updateStatus(id, status);
    await get().fetchOrders();
  },

  customOrders: [],
  fetchCustomOrders: async () => {
    try {
      const res = await api.getCustomOrders();
      set({ customOrders: res.data || [] });
    } catch (err) {
      console.error("fetchCustomOrders:", err.message);
    }
  },
  addCustomOrder: async (order) => {
    return await api.createCustomOrder({
      customer_name: order.name || "",
      customer_phone: order.phone || "",
      customer_address: order.address || "",
      order_type: order.type || "",
      description: order.desc || order.description || "",
      budget: order.budget || "",
      deadline: order.deadline || "",
      payment_method: order.payment || "",
    });
  },

  users: [],
  fetchUsers: async () => {
    try {
      const res = await api.getUsers();
      set({ users: res.data || [] });
    } catch (err) {
      console.error("fetchUsers:", err.message);
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
    await api.toggleUser(id);
    await get().fetchUsers();
  },

  myStudents: [],
  studentProducts: [],
  selectedStudent: null,

  fetchMyStudents: async () => {
    try {
      const res = await api.getMyStudents();
      set({ myStudents: res.data || [] });
    } catch (err) {
      console.error("fetchMyStudents:", err.message);
      set({ myStudents: [] });
    }
  },

  addStudent: async (data) => {
    await api.createStudent(data);
    await get().fetchMyStudents();
  },

  editStudent: async (id, data) => {
    await api.updateStudent(id, data);
    await get().fetchMyStudents();
  },

  removeStudent: async (id) => {
    await api.deleteStudent(id);
    await get().fetchMyStudents();
  },

  toggleStudentActive: async (id) => {
    await api.toggleStudent(id);
    await get().fetchMyStudents();
  },

  setSelectedStudent: (student) => set({ selectedStudent: student }),

  fetchStudentProducts: async (studentId) => {
    try {
      const products = await api.getStudentProducts(studentId);
      set({ studentProducts: (products || []).map(norm) });
    } catch (err) {
      console.error("fetchStudentProducts:", err.message);
      set({ studentProducts: [] });
    }
  },

  addProductForStudent: async (studentId, data) => {
    const payload = { ...toBackend(data), student_id: studentId };
    await api.createProduct(payload);
    await get().fetchStudentProducts(studentId);
  },

  editProductForStudent: async (productId, studentId, data) => {
    const payload = { ...toBackend(data), student_id: studentId };
    await api.updateProduct(productId, payload);
    await get().fetchStudentProducts(studentId);
  },

  deleteProductForStudent: async (productId, studentId) => {
    await api.deleteProduct(productId);
    await get().fetchStudentProducts(studentId);
  },
}));

export default useStore;
