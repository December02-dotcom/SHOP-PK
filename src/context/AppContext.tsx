import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Voucher, Order, ShippingAddress, User, WarehouseConfig } from '../types';
import { PRODUCTS, VOUCHERS, CATEGORIES } from '../data';
import { DEFAULT_WAREHOUSE_CONFIG, calculateShippingEstimate } from '../utils/shipping';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  adminLogin: (username: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  serverConnected: boolean;
  warehouse: WarehouseConfig;
  updateWarehouse: (config: WarehouseConfig) => Promise<void>;
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, option?: string) => void;
  removeFromCart: (productId: string, option?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, option?: string) => void;
  clearCart: () => void;
  activeVoucher: Voucher | null;
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
  orders: Order[];
  createOrder: (address: ShippingAddress, shippingMethod: 'standard' | 'express' | 'saver', paymentMethod: 'cod' | 'bank_transfer') => Promise<Order>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeTab: 'home' | 'cart' | 'orders' | 'admin';
  setActiveTab: (tab: 'home' | 'cart' | 'orders' | 'admin') => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: { sender: 'user' | 'shop'; text: string; time: string }[];
  sendChatMessage: (text: string) => void;
  sortBy: 'popular' | 'latest' | 'sold' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'popular' | 'latest' | 'sold' | 'price-asc' | 'price-desc') => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth & User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);

  // Products, Categories, Orders
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pkdt_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('pkdt_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pkdt_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Warehouse State (Set by Admin)
  const [warehouse, setWarehouse] = useState<WarehouseConfig>(() => {
    const saved = localStorage.getItem('pkdt_warehouse');
    return saved ? JSON.parse(saved) : DEFAULT_WAREHOUSE_CONFIG;
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'sold' | 'price-asc' | 'price-desc'>('popular');
  
  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pkdt_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeVoucher, setActiveVoucher] = useState<Voucher | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'cart' | 'orders' | 'admin'>('home');
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'shop'; text: string; time: string }[]>([
    { sender: 'shop', text: 'Xin chào! Cảm ơn bạn đã ghé thăm Shop Mall. Bạn có cần hỗ trợ tư vấn sản phẩm nào không ạ? 🥰', time: 'Vừa xong' }
  ]);

  // Sync with Web Server API
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setServerConnected(true);
        }
      } catch (e) {
        setServerConnected(false);
      }
    };

    const fetchServerData = async () => {
      try {
        const [prodRes, catRes, orderRes, whRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/orders'),
          fetch('/api/settings/warehouse')
        ]);

        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods) && prods.length > 0) {
            setProducts(prods);
          }
        }
        if (catRes.ok) {
          const cats = await catRes.json();
          if (Array.isArray(cats) && cats.length > 0) {
            setCategories(cats);
          }
        }
        if (orderRes.ok) {
          const ords = await orderRes.json();
          if (Array.isArray(ords)) {
            setOrders(ords);
          }
        }
        if (whRes.ok) {
          const whData = await whRes.json();
          if (whData && whData.city) {
            setWarehouse(whData);
          }
        }
      } catch (err) {
        console.warn('Backend server not ready yet, using cached/local state');
      }
    };

    checkServer();
    fetchServerData();
  }, []);

  // Restore User Session from Token on startup
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('pkdt_token');
      if (!token) return;

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        } else {
          localStorage.removeItem('pkdt_token');
        }
      } catch (err) {
        console.error('Failed to restore session from server:', err);
      }
    };

    restoreSession();
  }, []);

  // Auth Functions
  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Đăng nhập thất bại!' };
      }
      localStorage.setItem('pkdt_token', data.token);
      setCurrentUser(data.user);
      return { success: true, message: 'Thành công' };
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối tới Web Server!' };
    }
  };

  const adminLogin = async (username: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Đăng nhập Quản trị thất bại!' };
      }
      localStorage.setItem('pkdt_token', data.token);
      setCurrentUser(data.user);
      return { success: true, message: 'Thành công' };
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối tới Web Server!' };
    }
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Đăng ký thất bại!' };
      }
      localStorage.setItem('pkdt_token', data.token);
      setCurrentUser(data.user);
      return { success: true, message: 'Thành công' };
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối tới Web Server!' };
    }
  };

  const logout = () => {
    localStorage.removeItem('pkdt_token');
    setCurrentUser(null);
  };

  // Persist local caches
  useEffect(() => {
    localStorage.setItem('pkdt_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pkdt_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pkdt_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pkdt_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('pkdt_warehouse', JSON.stringify(warehouse));
  }, [warehouse]);

  // Warehouse Update (Admin)
  const updateWarehouse = async (config: WarehouseConfig) => {
    setWarehouse(config);
    try {
      await fetch('/api/settings/warehouse', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
    } catch (err) {
      console.error('Failed to sync warehouse settings to server', err);
    }
  };

  // Products CRUD
  const addProduct = async (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    } catch (err) {
      console.error('Failed to sync product to server', err);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
    try {
      await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
    } catch (err) {
      console.error('Failed to update product on server', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete product from server', err);
    }
  };

  // Categories CRUD
  const addCategory = async (category: Category) => {
    setCategories((prev) => [...prev, category]);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
    } catch (err) {
      console.error('Failed to sync category to server', err);
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    setCategories((prev) => prev.map((c) => c.id === updatedCategory.id ? updatedCategory : c));
    try {
      await fetch(`/api/categories/${updatedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory)
      });
    } catch (err) {
      console.error('Failed to update category on server', err);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Failed to delete category from server', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to update order status on server', err);
    }
  };

  // Cart Handlers
  const addToCart = (product: Product, quantity: number, option?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedOption === option
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, quantity, selectedOption: option }];
    });
  };

  const removeFromCart = (productId: string, option?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedOption === option))
    );
  };

  const updateCartQuantity = (productId: string, quantity: number, option?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, option);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedOption === option
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveVoucher(null);
  };

  const applyVoucher = (code: string) => {
    const voucher = VOUCHERS.find((v) => v.code.toUpperCase() === code.toUpperCase().trim());
    if (!voucher) {
      return { success: false, message: 'Mã giảm giá không tồn tại!' };
    }

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (subtotal < voucher.minOrderValue) {
      const remaining = voucher.minOrderValue - subtotal;
      const remainingFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(remaining);
      return { 
        success: false, 
        message: `Đơn hàng chưa đạt tối thiểu. Bạn cần mua thêm ${remainingFormatted} để dùng mã này!` 
      };
    }

    setActiveVoucher(voucher);
    return { success: true, message: `Áp dụng thành công: ${voucher.name}` };
  };

  const removeVoucher = () => {
    setActiveVoucher(null);
  };

  // Create Order with Web Server sync
  const createOrder = async (
    address: ShippingAddress, 
    shippingMethod: 'standard' | 'express' | 'saver', 
    paymentMethod: 'cod' | 'bank_transfer'
  ) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    // Calculate dynamic shipping based on warehouse location and customer address
    const shippingEstimate = calculateShippingEstimate(warehouse, address, subtotal, shippingMethod);
    const shippingFee = shippingEstimate.selectedFee;
    const originalShippingFee = shippingEstimate.originalFee;

    let discountAmount = 0;
    if (activeVoucher) {
      if (activeVoucher.discountType === 'fixed') {
        discountAmount = activeVoucher.value;
      } else {
        discountAmount = Math.round((subtotal * activeVoucher.value) / 100);
        if (activeVoucher.maxDiscount && discountAmount > activeVoucher.maxDiscount) {
          discountAmount = activeVoucher.maxDiscount;
        }
      }
    }

    if (activeVoucher?.code === 'FRESESHIP') {
      discountAmount = Math.min(shippingFee, 25000);
    }

    const finalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

    const newOrder: Order = {
      id: 'DH' + Math.floor(100000 + Math.random() * 900000),
      userId: currentUser?.id,
      date: new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...cart],
      shippingAddress: address,
      shippingMethod,
      shippingFee,
      originalShippingFee,
      shippingDistanceKm: shippingEstimate.distanceKm,
      warehouseOrigin: {
        name: warehouse.name,
        city: warehouse.city,
        district: warehouse.district
      },
      estimatedDelivery: shippingEstimate.selectedEstimatedTime,
      paymentMethod,
      voucherCode: activeVoucher?.code,
      discountAmount,
      totalAmount: subtotal,
      finalAmount,
      status: 'pending'
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (err) {
      console.error('Failed to post order to web server:', err);
    }

    return newOrder;
  };

  // Chat simulator
  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { sender: 'user' as const, text, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let replyText = 'Cảm ơn bạn đã nhắn tin cho shop! Chúng mình sẽ phản hồi lại ngay lập tức khi nhân viên trực máy online ạ. Khách có thắc mắc gì cứ để lại lời nhắn nhé! 🧡';
      
      const query = text.toLowerCase();
      if (query.includes('ship') || query.includes('vận chuyển') || query.includes('giao hàng')) {
        replyText = 'Shop có hỗ trợ giao hàng Toàn Quốc qua GHTK, Viettel Post hỏa tốc từ 1-3 ngày. Nhập mã FRESESHIP để được giảm ngay 25k ship nha bạn! 🚚';
      } else if (query.includes('size') || query.includes('kích thước') || query.includes('ôm')) {
        replyText = 'Sản phẩm áo thun/đầm của shop có đủ kích thước S, M, L, XL chuẩn phom Việt Nam. Bạn có thể xem bảng size ở mô tả chi tiết sản phẩm hoặc cho mình xin chiều cao cân nặng để shop tư vấn trực tiếp nha! 📐';
      } else if (query.includes('giảm giá') || query.includes('voucher') || query.includes('khuyến mãi') || query.includes('mã')) {
        replyText = 'Hiện tại shop đang chạy mã giảm giá PKDT50K giảm thẳng 50k cho đơn từ 300k và mã PKDT10 giảm 10%. Hãy lưu lại mã ở mục Voucher và áp dụng ngay trong Giỏ hàng nhé! 🎟️✨';
      } else if (query.includes('chất liệu') || query.includes('vải') || query.includes('inox') || query.includes('bảo hành')) {
        replyText = 'Dạ sản phẩm bên mình luôn cam kết mô tả đúng chất liệu 100% (ví dụ Cotton Premium, Thép không gỉ 316, Thủy tinh cường lực cao cấp). Shop hỗ trợ bảo hành chính hãng lỗi 1 đổi 1 trong vòng 7 ngày nếu có lỗi từ nhà sản xuất nha bạn! 💎';
      } else if (query.includes('hi') || query.includes('hello') || query.includes('shop ơi') || query.includes('alo')) {
        replyText = 'Dạ shop em nghe ạ! Em có thể giúp gì cho mình về sản phẩm hay việc đặt hàng không ạ? 🥰';
      }

      const shopMsg = {
        sender: 'shop' as const,
        text: replyText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, shopMsg]);
    }, 1000);
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.rating - a.rating;
    if (sortBy === 'latest') return b.id.localeCompare(a.id);
    if (sortBy === 'sold') return b.sold - a.sold;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authModalOpen,
        setAuthModalOpen,
        login,
        adminLogin,
        register,
        logout,
        serverConnected,
        warehouse,
        updateWarehouse,
        products,
        filteredProducts,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        activeVoucher,
        applyVoucher,
        removeVoucher,
        orders,
        createOrder,
        selectedProduct,
        setSelectedProduct,
        activeTab,
        setActiveTab,
        chatOpen,
        setChatOpen,
        chatMessages,
        sendChatMessage,
        sortBy,
        setSortBy,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
