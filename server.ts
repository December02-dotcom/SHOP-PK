import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { PRODUCTS, CATEGORIES } from "./src/data";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Web Server Database file path
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "server-db.json");

interface ServerDB {
  products: any[];
  categories: any[];
  users: any[];
  orders: any[];
}

// Initial default seed database
const defaultAdmin = {
  id: "usr_admin",
  name: "Quản trị viên",
  email: "admin@pkdientu.vn",
  phone: "0900000000",
  password: "admin123", // Simple demo string check
  role: "admin",
  createdAt: new Date().toISOString(),
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

const defaultCustomer = {
  id: "usr_demo",
  name: "Nguyễn Văn Khách",
  email: "khachhang@gmail.com",
  phone: "0912345678",
  password: "123456",
  role: "customer",
  createdAt: new Date().toISOString(),
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  address: {
    fullName: "Nguyễn Văn Khách",
    phone: "0912345678",
    city: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Dịch Vọng Hậu",
    street: "123 Phố Duy Tân"
  }
};

function loadDatabase(): ServerDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error loading db file, re-initializing:", err);
  }

  const initialDb: ServerDB = {
    products: PRODUCTS,
    categories: CATEGORIES,
    users: [defaultAdmin, defaultCustomer],
    orders: []
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write initial db file:", e);
  }

  return initialDb;
}

function saveDatabase(db: ServerDB) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist database:", err);
  }
}

let db = loadDatabase();

// In-memory token session mapping for simplicity
const activeSessions: Record<string, any> = {};

// --- API ROUTES ---

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", serverTime: new Date().toISOString() });
});

// Auth: Register Customer
app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, password, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!" });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: "Email này đã được đăng ký tài khoản!" });
  }

  const newUser = {
    id: "usr_" + Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone ? phone.trim() : "",
    password: password.trim(),
    role: "customer",
    createdAt: new Date().toISOString(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    address: address || undefined
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = "token_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  const { password: _, ...userWithoutPassword } = newUser;
  activeSessions[token] = userWithoutPassword;

  return res.json({
    token,
    user: userWithoutPassword
  });
});

// Auth: Login (Customer or Admin)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Vui lòng nhập Tên đăng nhập/Email và Mật khẩu!" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // Find user by email or username
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === cleanEmail ||
      (u.role === "admin" && cleanEmail === "admin") ||
      (u.phone && u.phone === cleanEmail)
  );

  if (!user || user.password !== cleanPass) {
    return res.status(401).json({ error: "Email/SĐT hoặc mật khẩu không chính xác!" });
  }

  const token = "token_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  const { password: _, ...userWithoutPassword } = user;
  activeSessions[token] = userWithoutPassword;

  return res.json({
    token,
    user: userWithoutPassword
  });
});

// Auth: Admin Dedicated Login
app.post("/api/auth/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Vui lòng nhập tên tài khoản Quản trị và Mật khẩu!" });
  }

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const admin = db.users.find(
    (u) =>
      u.role === "admin" &&
      (u.email.toLowerCase() === cleanUser || cleanUser === "admin" || u.phone === cleanUser) &&
      u.password === cleanPass
  );

  if (!admin) {
    return res.status(401).json({ error: "Tài khoản hoặc mật khẩu Quản trị không chính xác!" });
  }

  const token = "admin_token_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  const { password: _, ...adminWithoutPassword } = admin;
  activeSessions[token] = adminWithoutPassword;

  return res.json({
    token,
    user: adminWithoutPassword
  });
});

// Auth: Get Current Profile
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Chưa đăng nhập" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const user = activeSessions[token];

  if (!user) {
    return res.status(401).json({ error: "Phiên đăng nhập hết hạn hoặc không hợp lệ" });
  }

  return res.json({ user });
});

// Products CRUD
app.get("/api/products", (req, res) => {
  res.json(db.products);
});

app.post("/api/products", (req, res) => {
  const product = req.body;
  if (!product.id) {
    product.id = "p_" + Date.now();
  }
  db.products.unshift(product);
  saveDatabase(db);
  res.json(product);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Sản phẩm không tồn tại" });
  }
  db.products[index] = { ...db.products[index], ...req.body };
  saveDatabase(db);
  res.json(db.products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.products = db.products.filter((p) => p.id !== id);
  saveDatabase(db);
  res.json({ success: true, id });
});

// Categories CRUD
app.get("/api/categories", (req, res) => {
  res.json(db.categories);
});

app.post("/api/categories", (req, res) => {
  const category = req.body;
  if (!category.id) {
    category.id = "cat_" + Date.now();
  }
  db.categories.push(category);
  saveDatabase(db);
  res.json(category);
});

app.put("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const index = db.categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Danh mục không tồn tại" });
  }
  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDatabase(db);
  res.json(db.categories[index]);
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  db.categories = db.categories.filter((c) => c.id !== id);
  saveDatabase(db);
  res.json({ success: true, id });
});

// Orders CRUD
app.get("/api/orders", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userOrders = db.orders.filter((o) => o.userId === userId);
    return res.json(userOrders);
  }
  res.json(db.orders);
});

app.post("/api/orders", (req, res) => {
  const order = req.body;
  if (!order.id) {
    order.id = "DH" + Math.floor(100000 + Math.random() * 900000);
  }
  db.orders.unshift(order);
  saveDatabase(db);
  res.json(order);
});

app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = db.orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
  }
  order.status = status;
  saveDatabase(db);
  res.json(order);
});

// Users list (Admin)
app.get("/api/users", (req, res) => {
  const sanitized = db.users.map(({ password, ...u }) => u);
  res.json(sanitized);
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
