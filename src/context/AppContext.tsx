import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Voucher, Order, ShippingAddress } from '../types';
import { PRODUCTS, VOUCHERS, CATEGORIES } from '../data';

interface AppContextType {
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
  createOrder: (address: ShippingAddress, shippingMethod: 'standard' | 'express' | 'saver', paymentMethod: 'cod' | 'bank_transfer') => Order;
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
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pkdt_products') || localStorage.getItem('shopee_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('pkdt_categories') || localStorage.getItem('shopee_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'latest' | 'sold' | 'price-asc' | 'price-desc'>('popular');
  
  // Load initial cart and orders from localStorage if they exist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pkdt_cart') || localStorage.getItem('shopee_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pkdt_orders') || localStorage.getItem('shopee_orders');
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

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('pkdt_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem('pkdt_orders', JSON.stringify(orders));
  }, [orders]);

  // Persist products and categories to localStorage
  useEffect(() => {
    localStorage.setItem('pkdt_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pkdt_categories', JSON.stringify(categories));
  }, [categories]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories((prev) => prev.map((c) => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Handle adding products to cart
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

  // Remove items from cart
  const removeFromCart = (productId: string, option?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedOption === option))
    );
  };

  // Update quantity in cart
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

  // Voucher validation and application
  const applyVoucher = (code: string) => {
    const voucher = VOUCHERS.find((v) => v.code.toUpperCase() === code.toUpperCase().trim());
    if (!voucher) {
      return { success: false, message: 'Mã giảm giá không tồn tại!' };
    }

    // Calculate current cart subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (subtotal < voucher.minOrderValue) {
      const remaining = voucher.minOrderValue - subtotal;
      // Convert to Vietnamese currency format helper
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

  // Simulated Checkout process
  const createOrder = (
    address: ShippingAddress, 
    shippingMethod: 'standard' | 'express' | 'saver', 
    paymentMethod: 'cod' | 'bank_transfer'
  ) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    // shipping fee
    let shippingFee = 30000;
    if (shippingMethod === 'express') shippingFee = 55000;
    if (shippingMethod === 'saver') shippingFee = 15000;

    // discount calculation
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

    // specific freeship handling
    if (activeVoucher?.code === 'FRESESHIP') {
      discountAmount = Math.min(shippingFee, 25000);
    }

    const finalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

    const newOrder: Order = {
      id: 'DH' + Math.floor(100000 + Math.random() * 900000),
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
      paymentMethod,
      voucherCode: activeVoucher?.code,
      discountAmount,
      totalAmount: subtotal,
      finalAmount,
      status: 'pending'
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  // Chat answers simulator
  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { sender: 'user' as const, text, time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages((prev) => [...prev, userMsg]);

    // Simple automated response rules based on keywords
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
    if (sortBy === 'popular') {
      return b.rating - a.rating;
    }
    if (sortBy === 'latest') {
      // simulate latest by ID
      return b.id.localeCompare(a.id);
    }
    if (sortBy === 'sold') {
      return b.sold - a.sold;
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <AppContext.Provider
      value={{
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
        deleteCategory
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
