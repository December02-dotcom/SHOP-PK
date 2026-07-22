import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category } from '../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  Tag, 
  Layers, 
  Check, 
  X, 
  ArrowLeft, 
  AlertCircle, 
  Filter, 
  Coins, 
  Package, 
  MapPin, 
  Sparkles,
  Shirt, 
  UserRound, 
  Smartphone, 
  Laptop, 
  Home, 
  Footprints, 
  Compass, 
  ShoppingBag, 
  Baby,
  Eye,
  Info,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  ShieldCheck,
  Users
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Shirt,
  UserRound,
  Smartphone,
  Laptop,
  Home,
  Sparkles,
  Footprints,
  Compass,
  ShoppingBag,
  Baby
};

// Preset colors for new categories
const PRESET_COLORS = [
  { name: 'Xanh Lá', class: 'bg-emerald-50 text-emerald-500' },
  { name: 'Hồng', class: 'bg-pink-50 text-pink-500' },
  { name: 'Xanh Dương', class: 'bg-blue-50 text-blue-500' },
  { name: 'Vàng Cam', class: 'bg-amber-50 text-amber-500' },
  { name: 'Tím', class: 'bg-purple-50 text-purple-500' },
  { name: 'Chàm', class: 'bg-indigo-50 text-indigo-500' },
  { name: 'Đỏ', class: 'bg-rose-50 text-rose-500' },
  { name: 'Xanh Cyan', class: 'bg-cyan-50 text-cyan-500' },
  { name: 'Cam', class: 'bg-orange-50 text-orange-500' },
  { name: 'Teal', class: 'bg-teal-50 text-teal-500' },
];

// Preset images to make it easy to create beautiful items
const PRESET_IMAGES = [
  { label: 'Thời Trang Nam', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80' },
  { label: 'Điện Thoại', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80' },
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1496181130204-7552cc1524e2?w=500&auto=format&fit=crop&q=80' },
  { label: 'Thời Trang Nữ', url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&auto=format&fit=crop&q=80' },
  { label: 'Giày Thể Thao', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80' },
  { label: 'Đồ Gia Dụng', url: 'https://images.unsplash.com/photo-1517705008128-361805f42e8a?w=500&auto=format&fit=crop&q=80' },
];

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    setActiveTab,
    orders,
    updateOrderStatus,
    currentUser,
    adminLogin,
    logout,
    serverConnected
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories' | 'orders' | 'users'>('products');

  // Admin login form state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminLoginErr, setAdminLoginErr] = useState<string | null>(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  // Registered customers list state from server
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch registered users when activeSubTab is 'users'
  React.useEffect(() => {
    if (currentUser?.role === 'admin' && activeSubTab === 'users') {
      const fetchUsers = async () => {
        setUsersLoading(true);
        try {
          const res = await fetch('/api/users');
          if (res.ok) {
            const data = await res.json();
            setUsersList(data);
          }
        } catch (e) {
          console.error('Failed to fetch users', e);
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsers();
    }
  }, [currentUser, activeSubTab]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginErr(null);
    setAdminLoginLoading(true);
    try {
      const res = await adminLogin(adminUsername, adminPassword);
      if (!res.success) {
        setAdminLoginErr(res.message);
      }
    } catch (err: any) {
      setAdminLoginErr('Lỗi kết nối tới Web Server!');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  // Products state & filters
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('');

  // Orders state & filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'shipping' | 'completed' | 'cancelled'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Modals / Form Triggers
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Current item being edited (null for creation)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // --- PRODUCT FORM FIELDS ---
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOrigPrice, setProdOrigPrice] = useState(0);
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState(10);
  const [prodImage, setProdImage] = useState('');
  const [prodLocation, setProdLocation] = useState('TP. Hồ Chí Minh');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIsMall, setProdIsMall] = useState(false);
  const [prodIsFavorite, setProdIsFavorite] = useState(false);
  const [prodIsFlashSale, setProdIsFlashSale] = useState(false);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsOnSale, setProdIsOnSale] = useState(false);
  const [prodImages, setProdImages] = useState<string[]>(['', '', '', '', '']);
  const [prodVideo, setProdVideo] = useState('');
  const [prodVideoDuration, setProdVideoDuration] = useState(30);
  
  // Specs and Options builder state
  const [prodSpecs, setProdSpecs] = useState<{ key: string; value: string }[]>([
    { key: 'Thương hiệu', value: '' },
    { key: 'Xuất xứ', value: '' }
  ]);
  const [prodOptions, setProdOptions] = useState<string[]>([]);
  const [newOptionInput, setNewOptionInput] = useState('');

  // --- CATEGORY FORM FIELDS ---
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catIconName, setCatIconName] = useState('Shirt');
  const [catColor, setCatColor] = useState('bg-blue-50 text-blue-500');

  // --- CUSTOM DIALOGS & CONFIRMATIONS ---
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        action();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const triggerAlert = (title: string, message: string) => {
    setAlertDialog({
      isOpen: true,
      title,
      message
    });
  };

  // --- ACTION HANDLERS ---
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(0);
    setProdOrigPrice(0);
    setProdCategory(categories[0]?.id || '');
    setProdStock(20);
    const initialUrl = PRESET_IMAGES[0]?.url || '';
    setProdImage(initialUrl);
    setProdImages([initialUrl, '', '', '', '']);
    setProdVideo('');
    setProdVideoDuration(30);
    setProdLocation('TP. Hồ Chí Minh');
    setProdDesc('Sản phẩm chất lượng cao chuẩn phân phối chính hãng. Bảo hành uy tín toàn quốc.');
    setProdIsMall(false);
    setProdIsFavorite(false);
    setProdIsFlashSale(false);
    setProdIsBestSeller(false);
    setProdIsOnSale(false);
    setProdSpecs([
      { key: 'Thương hiệu', value: 'No Brand' },
      { key: 'Chất liệu', value: 'Cao cấp' },
      { key: 'Xuất xứ', value: 'Việt Nam' }
    ]);
    setProdOptions(['Mẫu chuẩn']);
    setShowProductModal(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice || 0);
    setProdCategory(p.category);
    setProdStock(p.stock);
    setProdImage(p.image);
    
    // Map multiple images
    const initialImages = [...(p.images || [])];
    if (initialImages.length === 0 && p.image) {
      initialImages.push(p.image);
    }
    while (initialImages.length < 5) {
      initialImages.push('');
    }
    setProdImages(initialImages.slice(0, 5));
    setProdVideo(p.video || '');
    setProdVideoDuration(p.videoDuration || 30);

    setProdLocation(p.location);
    setProdDesc(p.description);
    setProdIsMall(!!p.isMall);
    setProdIsFavorite(!!p.isFavorite);
    setProdIsFlashSale(!!p.isFlashSale);
    setProdIsBestSeller(!!p.isBestSeller);
    setProdIsOnSale(!!p.isOnSale);
    
    // Map specifications
    const specsArr = Object.entries(p.specs || {}).map(([key, value]) => ({ key, value }));
    setProdSpecs(specsArr.length > 0 ? specsArr : [{ key: 'Thương hiệu', value: '' }]);
    
    // Options
    setProdOptions(p.options || []);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodImage.trim() || !prodCategory) {
      triggerAlert('Lỗi nhập liệu', 'Vui lòng điền các trường bắt buộc (Tên, Hình ảnh, Danh mục)!');
      return;
    }

    // Process specifications object
    const specsObj: Record<string, string> = {};
    prodSpecs.forEach(spec => {
      if (spec.key.trim()) {
        specsObj[spec.key.trim()] = spec.value.trim() || 'N/A';
      }
    });

    // Compute discount percentage automatically
    let discountPercent: number | undefined = undefined;
    if (prodOrigPrice > prodPrice) {
      discountPercent = Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100);
    }

    // Filter out empty image strings, and clean up URLs
    const filteredImages = prodImages.map(img => img.trim()).filter(img => img !== '');
    const finalMainImage = filteredImages[0] || prodImage || 'https://placehold.co/300?text=No+Image';
    const finalImages = filteredImages.length > 0 ? filteredImages : [finalMainImage];

    const finalProductData: Product = {
      id: editingProduct ? editingProduct.id : 'p_' + Date.now(),
      name: prodName,
      price: Number(prodPrice),
      originalPrice: prodOrigPrice > 0 ? Number(prodOrigPrice) : undefined,
      discount: discountPercent,
      category: prodCategory,
      stock: Number(prodStock),
      sold: editingProduct ? editingProduct.sold : 0,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      image: finalMainImage,
      images: finalImages,
      video: prodVideo.trim() || undefined,
      videoDuration: prodVideo.trim() ? Math.min(30, Number(prodVideoDuration) || 30) : undefined,
      location: prodLocation,
      description: prodDesc,
      isMall: prodIsMall,
      isFavorite: prodIsFavorite,
      isFlashSale: prodIsFlashSale,
      isBestSeller: prodIsBestSeller,
      isOnSale: prodIsOnSale,
      flashSaleProgress: prodIsFlashSale ? 15 : undefined,
      specs: specsObj,
      options: prodOptions.length > 0 ? prodOptions : undefined
    };

    if (editingProduct) {
      updateProduct(finalProductData);
    } else {
      addProduct(finalProductData);
    }

    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    triggerConfirm('Xóa sản phẩm', `Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`, () => {
      deleteProduct(id);
    });
  };

  // Specs helper functions
  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...prodSpecs];
    updated[index][field] = val;
    setProdSpecs(updated);
  };

  const addSpecField = () => {
    setProdSpecs([...prodSpecs, { key: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    setProdSpecs(prodSpecs.filter((_, i) => i !== index));
  };

  // Options helper functions
  const addOption = () => {
    if (newOptionInput.trim() && !prodOptions.includes(newOptionInput.trim())) {
      setProdOptions([...prodOptions, newOptionInput.trim()]);
      setNewOptionInput('');
    }
  };

  const removeOption = (opt: string) => {
    setProdOptions(prodOptions.filter(o => o !== opt));
  };

  // --- CATEGORY ACTION HANDLERS ---
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatId('');
    setCatName('');
    setCatIconName('Shirt');
    setCatColor('bg-blue-50 text-blue-500');
    setShowCategoryModal(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCatId(c.id);
    setCatName(c.name);
    setCatIconName(c.iconName);
    setCatColor(c.color);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catId.trim()) {
      triggerAlert('Thông báo', 'Vui lòng nhập Mã danh mục và Tên danh mục!');
      return;
    }

    const formattedId = catId.trim().toLowerCase().replace(/\s+/g, '-');

    const categoryData: Category = {
      id: formattedId,
      name: catName.trim(),
      iconName: catIconName,
      color: catColor
    };

    if (editingCategory) {
      updateCategory(categoryData);
    } else {
      // Check duplicate
      if (categories.some(c => c.id === formattedId)) {
        triggerAlert('Lỗi', 'Mã danh mục này đã tồn tại! Vui lòng chọn mã khác.');
        return;
      }
      addCategory(categoryData);
    }

    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const productsInCat = products.filter(p => p.category === id).length;
    let confirmMsg = `Bạn có chắc chắn muốn xóa danh mục "${name}" không?`;
    if (productsInCat > 0) {
      confirmMsg = `Cảnh báo: Có ${productsInCat} sản phẩm đang thuộc danh mục này. Nếu bạn xóa danh mục, các sản phẩm sẽ không thể lọc theo danh mục này nữa. Bạn vẫn muốn xóa chứ?`;
    }

    triggerConfirm('Xóa danh mục', confirmMsg, () => {
      deleteCategory(id);
    });
  };

  // Filtered lists for the admin dashboard tables
  const adminFilteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.id.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCatFilter ? p.category === productCatFilter : true;
    return matchesSearch && matchesCategory;
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 mt-12 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 p-6 text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Đăng Nhập Trang Quản Lý</h2>
            <p className="text-xs text-emerald-100 mt-1">Dành riêng cho Quản trị viên & Chủ gian hàng</p>
            
            <div className="mt-3 inline-flex items-center gap-2 bg-emerald-900/40 text-emerald-200 px-3 py-1 rounded-full text-[11px] font-medium border border-emerald-400/30">
              <span className={`w-2 h-2 rounded-full ${serverConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>Web Server (Port 3000): {serverConnected ? 'Đã kết nối' : 'Đang kết nối...'}</span>
            </div>
          </div>

          <form onSubmit={handleAdminSubmit} className="p-6 space-y-4">
            {adminLoginErr && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminLoginErr}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tài khoản Quản trị / Email</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#059669]"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#059669]"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {adminLoginLoading ? 'Đang xác thực...' : 'Đăng Nhập Quản Lý'}
            </button>

            <div className="pt-3 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400 mb-1.5">Tài khoản quản trị mẫu mặc định:</p>
              <div className="bg-gray-50 p-2.5 rounded text-[11px] text-gray-700 font-mono space-y-1 text-left border border-gray-100">
                <p>• Tài khoản: <b>admin</b> hoặc <b>admin@pkdientu.vn</b></p>
                <p>• Mật khẩu: <b>admin123</b></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      {/* Back to Home Header & Admin Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#059669] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang chủ PK ĐIỆN TỬ - CAMERA</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold">
            <UserRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentUser.name} (Admin)</span>
          </div>
          <button
            onClick={logout}
            className="text-xs text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Admin Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Title section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 stroke-[2.5]" />
            <span>HỆ THỐNG QUẢN TRỊ GIAN HÀNG PK ĐIỆN TỬ - CAMERA</span>
          </h1>
          <p className="text-emerald-100 text-xs mt-1.5 max-w-2xl leading-normal">
            Trang vận hành chuyên dụng dành cho Chủ Cửa Hàng. Cho phép bạn nhanh chóng chỉnh sửa, thêm mới, xóa bỏ toàn bộ sản phẩm và danh mục phân loại ngành hàng, cũng như quản lý toàn bộ đơn đặt hàng của khách hàng tức thì.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 font-bold text-xs sm:text-sm text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeSubTab === 'products'
                ? 'border-[#059669] text-[#059669] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Quản Lý Sản Phẩm ({products.length})</span>
            <span className="inline sm:hidden">Sản phẩm ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 font-bold text-xs sm:text-sm text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeSubTab === 'categories'
                ? 'border-[#059669] text-[#059669] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Quản Lý Danh Mục ({categories.length})</span>
            <span className="inline sm:hidden">Danh mục ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 font-bold text-xs sm:text-sm text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeSubTab === 'orders'
                ? 'border-[#059669] text-[#059669] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Quản Lý Đơn Hàng ({orders.length})</span>
            <span className="inline sm:hidden">Đơn hàng ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 font-bold text-xs sm:text-sm text-center border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeSubTab === 'users'
                ? 'border-[#059669] text-[#059669] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Khách Hàng ({usersList.length})</span>
            <span className="inline sm:hidden">Khách hàng ({usersList.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeSubTab === 'products' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Control Bar: Search, Category Filter, and Add Button */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
              <div className="flex flex-col sm:flex-row gap-2.5 flex-1 max-w-3xl">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm theo tên hoặc mã ID..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#059669] focus:bg-white text-gray-700 transition-colors"
                  />
                </div>
                {/* Category select filter */}
                <div className="relative w-full sm:w-48">
                  <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="w-full pl-8 pr-2 py-2.5 bg-gray-50 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#059669] focus:bg-white text-gray-700 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add Product Trigger Button */}
              <button
                onClick={openAddProduct}
                className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Thêm sản phẩm mới</span>
              </button>
            </div>

            {/* Products Table Wrapper */}
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-3xs">
              {/* Mobile Card Layout */}
              <div className="block md:hidden divide-y divide-gray-100 animate-fade-in">
                {adminFilteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 bg-gray-50/50">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-xs">Không tìm thấy sản phẩm nào phù hợp</p>
                  </div>
                ) : (
                  adminFilteredProducts.map((p) => {
                    const categoryObj = categories.find(c => c.id === p.category);
                    return (
                      <div key={p.id} className="p-4 flex flex-col gap-3 hover:bg-gray-50/50 transition-colors">
                        <div className="flex gap-3">
                          {/* Image */}
                          <div className="w-16 h-16 rounded-lg border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://placehold.co/150?text=Error'; }} referrerPolicy="no-referrer" />
                          </div>
                          {/* Title & Info */}
                          <div className="min-w-0 flex-grow space-y-1">
                            <h4 className="font-bold text-gray-800 text-xs line-clamp-2 leading-relaxed" title={p.name}>
                              {p.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="font-mono text-gray-400 bg-gray-50 px-1 rounded">ID: {p.id}</span>
                              <span className="text-gray-500 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                <Tag className="w-2.5 h-2.5 shrink-0" />
                                {categoryObj ? categoryObj.name : p.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Financials & Stock stats */}
                        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100/50 text-[10px]">
                          <div className="space-y-0.5">
                            <span className="text-gray-400 block font-medium">Giá bán:</span>
                            <span className="font-bold text-emerald-600 block">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-gray-400 block font-medium">Tồn kho:</span>
                            <span className={`font-bold block ${p.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                              {p.stock}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-gray-400 block font-medium">Đã bán:</span>
                            <span className="font-bold text-gray-700 block">{p.sold}</span>
                          </div>
                        </div>

                        {/* Badges & Actions row */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          {/* Featured Badges */}
                          <div className="flex flex-wrap gap-1">
                            {p.isMall && (
                              <span className="bg-[#047857] text-white font-black text-[7px] uppercase px-1 rounded-sm leading-none py-0.5">
                                Mall
                              </span>
                            )}
                            {p.isFavorite && (
                              <span className="bg-orange-500 text-white font-black text-[7px] uppercase px-1 rounded-sm leading-none py-0.5">
                                Yêu Thích
                              </span>
                            )}
                            {p.isFlashSale && (
                              <span className="bg-red-500 text-white font-black text-[7px] uppercase px-1 rounded-sm leading-none py-0.5">
                                Săn Deal
                              </span>
                            )}
                            {p.isBestSeller && (
                              <span className="bg-amber-500 text-white font-black text-[7px] uppercase px-1 rounded-sm leading-none py-0.5">
                                Bán Chạy
                              </span>
                            )}
                            {p.isOnSale && (
                              <span className="bg-rose-500 text-white font-black text-[7px] uppercase px-1 rounded-sm leading-none py-0.5">
                                Giảm Giá
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditProduct(p)}
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold text-[10px]"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold text-[10px]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Sản Phẩm</th>
                      <th className="py-3 px-4 w-32">Mã SP</th>
                      <th className="py-3 px-4 w-36">Danh Mục</th>
                      <th className="py-3 px-4 w-28 text-right">Giá Bán</th>
                      <th className="py-3 px-4 w-28 text-center">Tồn Kho</th>
                      <th className="py-3 px-4 w-24 text-center">Đã Bán</th>
                      <th className="py-3 px-4 w-28 text-center">Nhãn Đặc Trưng</th>
                      <th className="py-3 px-4 w-28 text-center">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                    {adminFilteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="font-semibold">Không tìm thấy sản phẩm nào phù hợp</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Vui lòng thử điều chỉnh lại bộ lọc tìm kiếm của bạn.</p>
                        </td>
                      </tr>
                    ) : (
                      adminFilteredProducts.map((p) => {
                        const categoryObj = categories.find(c => c.id === p.category);
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-4 flex items-center space-x-3">
                              <div className="w-12 h-12 rounded border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://placehold.co/150?text=Error'; }} referrerPolicy="no-referrer" />
                              </div>
                              <div className="min-w-0 max-w-[280px]">
                                <p className="font-bold text-gray-800 line-clamp-2 leading-relaxed" title={p.name}>
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span>{p.location}</span>
                                </p>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-500">{p.id}</td>
                            <td className="py-3.5 px-4">
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                                {categoryObj ? categoryObj.name : p.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="font-bold text-gray-800">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                              </div>
                              {p.originalPrice && (
                                <div className="text-[10px] text-gray-400 line-through">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.originalPrice)}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`font-bold ${p.stock <= 5 ? 'text-red-500 bg-red-50 px-1.5 py-0.5 rounded' : 'text-gray-700'}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-medium text-gray-500">{p.sold}</td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex flex-col gap-1 items-center">
                                {p.isMall && (
                                  <span className="bg-[#047857] text-white font-black text-[8px] uppercase px-1 rounded-sm leading-none py-0.5">
                                    Mall
                                  </span>
                                )}
                                {p.isFavorite && (
                                  <span className="bg-orange-500 text-white font-black text-[8px] uppercase px-1 rounded-sm leading-none py-0.5">
                                    Yêu Thích
                                  </span>
                                )}
                                {p.isFlashSale && (
                                  <span className="bg-red-500 text-white font-black text-[8px] uppercase px-1 rounded-sm leading-none py-0.5">
                                    Săn Deal
                                  </span>
                                )}
                                {p.isBestSeller && (
                                  <span className="bg-amber-500 text-white font-black text-[8px] uppercase px-1 rounded-sm leading-none py-0.5">
                                    Bán Chạy
                                  </span>
                                )}
                                {p.isOnSale && (
                                  <span className="bg-rose-500 text-white font-black text-[8px] uppercase px-1 rounded-sm leading-none py-0.5">
                                    Giảm Giá
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditProduct(p)}
                                  title="Chỉnh sửa sản phẩm"
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  title="Xóa sản phẩm"
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORY MANAGEMENT */}
        {activeSubTab === 'categories' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Header Control for categories */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <p className="text-xs text-gray-500 font-medium">
                Quản lý các phân loại ngành hàng chính để hiển thị bộ lọc thông minh trên thanh menu trang chủ.
              </p>
              <button
                onClick={openAddCategory}
                className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Thêm danh mục mới</span>
              </button>
            </div>

            {/* Categories Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => {
                const IconComponent = iconMap[c.iconName] || Shirt;
                const productsCount = products.filter(p => p.category === c.id).length;
                return (
                  <div 
                    key={c.id} 
                    className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-200 transition-all flex justify-between items-start"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Category Icon preview wrapper */}
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${c.color || 'bg-gray-50 text-gray-500'}`}>
                        <IconComponent className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{c.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">ID: {c.id}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1 bg-emerald-50 px-1.5 py-0.5 rounded-sm inline-block">
                          {productsCount} sản phẩm thuộc nhóm
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-1 shrink-0 ml-2">
                      <button
                        onClick={() => openEditCategory(c)}
                        title="Chỉnh sửa danh mục"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        title="Xóa danh mục"
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeSubTab === 'orders' && (
          <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-3 sm:p-4 rounded-xl flex items-center justify-between min-w-0">
                <div className="min-w-0">
                  <p className="text-gray-500 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Doanh Thu (Thực thu)</p>
                  <p className="text-emerald-700 text-sm sm:text-lg md:text-xl font-extrabold mt-1 truncate">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                      orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.finalAmount, 0)
                    )}
                  </p>
                </div>
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-600 shrink-0 ml-1">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3 sm:p-4 rounded-xl flex items-center justify-between min-w-0">
                <div className="min-w-0">
                  <p className="text-gray-500 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Đơn Chờ Xác Nhận</p>
                  <p className="text-amber-700 text-sm sm:text-lg md:text-xl font-extrabold mt-1 truncate">
                    {orders.filter(o => o.status === 'pending').length} đơn
                  </p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600 shrink-0 ml-1">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-xl flex items-center justify-between min-w-0">
                <div className="min-w-0">
                  <p className="text-gray-500 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Đơn Đang Giao</p>
                  <p className="text-blue-700 text-sm sm:text-lg md:text-xl font-extrabold mt-1 truncate">
                    {orders.filter(o => o.status === 'shipping').length} đơn
                  </p>
                </div>
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600 shrink-0 ml-1">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200/60 p-3 sm:p-4 rounded-xl flex items-center justify-between min-w-0">
                <div className="min-w-0">
                  <p className="text-gray-500 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Tổng Đơn Hàng</p>
                  <p className="text-gray-700 text-sm sm:text-lg md:text-xl font-extrabold mt-1 truncate">
                    {orders.length} đơn
                  </p>
                </div>
                <div className="bg-gray-500/10 p-2 rounded-lg text-gray-600 shrink-0 ml-1">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Tất cả', icon: <ShoppingBag className="w-3.5 h-3.5 shrink-0" /> },
                  { id: 'pending', label: 'Chờ xác nhận', icon: <Clock className="w-3.5 h-3.5 shrink-0" /> },
                  { id: 'shipping', label: 'Đang giao', icon: <Truck className="w-3.5 h-3.5 shrink-0" /> },
                  { id: 'completed', label: 'Đã hoàn thành', icon: <CheckCircle className="w-3.5 h-3.5 shrink-0" /> },
                  { id: 'cancelled', label: 'Đã hủy', icon: <XCircle className="w-3.5 h-3.5 shrink-0" /> }
                ].map((tab) => {
                  const count = tab.id === 'all' 
                    ? orders.length 
                    : orders.filter(o => o.status === tab.id).length;
                  const isActive = orderStatusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusFilter(tab.id as any)}
                      className={`px-2.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                        isActive 
                          ? 'bg-[#059669] text-white shadow-sm' 
                          : 'bg-white text-gray-500 hover:text-gray-700 border border-gray-200'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden min-[480px]:inline">{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5 ${
                        isActive 
                          ? 'bg-emerald-700/50 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Order Input */}
              <div className="relative md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Tìm mã đơn, tên, sđt khách..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 bg-white rounded outline-none focus:border-[#059669] text-gray-800"
                />
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.filter((o) => {
                const matchesStatus = orderStatusFilter === 'all' ? true : o.status === orderStatusFilter;
                const matchesSearch = 
                  o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  o.shippingAddress.phone.includes(orderSearch);
                return matchesStatus && matchesSearch;
              }).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-500">Không có đơn hàng nào khớp với bộ lọc!</p>
                  <p className="text-xs text-gray-400 mt-1">Hệ thống sẽ tự động cập nhật khi khách hàng đặt đơn mới.</p>
                </div>
              ) : (
                orders.filter((o) => {
                  const matchesStatus = orderStatusFilter === 'all' ? true : o.status === orderStatusFilter;
                  const matchesSearch = 
                    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.shippingAddress.phone.includes(orderSearch);
                  return matchesStatus && matchesSearch;
                }).map((o) => {
                  const isExpanded = expandedOrderId === o.id;
                  const totalItemsCount = o.items.reduce((sum, item) => sum + item.quantity, 0);

                  return (
                    <div key={o.id} className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden transition-all hover:shadow-sm">
                      {/* Card Header Summary */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50 border-b border-gray-100">
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <span className="font-mono text-xs font-extrabold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded shrink-0">
                            {o.id}
                          </span>
                          <span className="text-[11px] sm:text-xs text-gray-500 font-medium flex items-center gap-1 bg-white border border-gray-100 px-2 py-1 rounded shadow-2xs shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{o.date}</span>
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded flex items-center gap-1 shrink-0">
                            <Package className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{totalItemsCount} <span className="hidden min-[480px]:inline">sản phẩm</span></span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                          <div className="flex items-center gap-1.5 shrink-0">
                            {o.status === 'pending' && (
                              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 animate-pulse" />
                                <span>Chờ xác nhận</span>
                              </span>
                            )}
                            {o.status === 'shipping' && (
                              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                                <span>Đang giao</span>
                              </span>
                            )}
                            {o.status === 'completed' && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                                <span>Hoàn thành</span>
                              </span>
                            )}
                            {o.status === 'cancelled' && (
                              <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                                <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500" />
                                <span>Đã hủy</span>
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                            className="p-1 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded border border-gray-200 bg-white shadow-2xs transition-colors cursor-pointer text-[11px] sm:text-xs font-bold flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                            <span className="hidden min-[480px]:inline">{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
                            <span className="inline min-[480px]:hidden">{isExpanded ? 'Thu gọn' : 'Chi tiết'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Card Content & Expandable Details */}
                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Quick Recipient summary when collapsed */}
                        {!isExpanded && (
                          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 text-xs bg-gray-50/50 p-3 rounded-lg border border-gray-100/60">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <UserRound className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="font-bold text-gray-800">{o.shippingAddress.fullName}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{o.shippingAddress.phone}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                              <span className="text-gray-400 font-medium">Thành tiền:</span>
                              <span className="font-extrabold text-sm text-[#059669] flex items-center gap-1">
                                <Coins className="w-4 h-4 text-[#059669]/80 shrink-0" />
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.finalAmount)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Detailed expansion */}
                        {isExpanded && (
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs leading-relaxed">
                            {/* Products Column */}
                            <div className="lg:col-span-2 space-y-3">
                              <h4 className="font-bold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Danh Sách Sản Phẩm Đã Mua</span>
                              </h4>
                              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto pr-1">
                                {o.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                    <div className="w-12 h-12 rounded border border-gray-100 bg-gray-50 overflow-hidden shrink-0 animate-fade-in">
                                      <img src={item.product.image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://placehold.co/150?text=Error'; }} referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex-grow">
                                      <h5 className="font-bold text-gray-800 line-clamp-1">{item.product.name}</h5>
                                      <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                        {item.selectedOption && (
                                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                                            Phân loại: {item.selectedOption}
                                          </span>
                                        )}
                                        <span>Số lượng: {item.quantity}</span>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-bold text-gray-700">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}
                                      </p>
                                      <p className="text-[10px] text-gray-400">
                                        Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recipient & Payment info Column */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                              <div>
                                <h4 className="font-bold text-gray-700 border-b border-gray-200 pb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-2.5">
                                  <UserRound className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                                  <span>Thông Tin Giao Hàng</span>
                                </h4>
                                <ul className="space-y-2 text-gray-600 text-[11px]">
                                  <li className="flex items-center gap-1.5">
                                    <UserRound className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span><strong className="text-gray-700">Họ tên:</strong> {o.shippingAddress.fullName}</span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span><strong className="text-gray-700">SĐT:</strong> {o.shippingAddress.phone}</span>
                                  </li>
                                  <li className="flex items-start gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                    <span className="break-words">
                                      <strong className="text-gray-700">Địa chỉ:</strong> {o.shippingAddress.street}, {o.shippingAddress.ward}, {o.shippingAddress.district}, {o.shippingAddress.city}
                                    </span>
                                  </li>
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-bold text-gray-700 border-b border-gray-200 pb-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-wider mb-2.5">
                                  <Truck className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                                  <span>Vận Chuyển & Thanh Toán</span>
                                </h4>
                                <ul className="space-y-2 text-gray-600 text-[11px]">
                                  <li className="flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span>
                                      <strong className="text-gray-700">Vận chuyển:</strong> {o.shippingMethod === 'express' ? 'Hỏa tốc' : o.shippingMethod === 'saver' ? 'Tiết kiệm' : 'Tiêu chuẩn'} 
                                      <span className="text-gray-400 ml-1">({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.shippingFee)})</span>
                                    </span>
                                  </li>
                                  <li className="flex items-center gap-1.5">
                                    <Coins className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span>
                                      <strong className="text-gray-700">Thanh toán:</strong> {o.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Thanh toán COD'}
                                    </span>
                                  </li>
                                  {o.voucherCode && (
                                    <li className="flex items-center gap-1.5">
                                      <Tag className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                      <span>
                                        <strong className="text-gray-700">Mã voucher:</strong> <span className="text-[#059669] font-bold bg-emerald-50 px-1 rounded">{o.voucherCode}</span> 
                                        <span className="text-red-500 font-semibold ml-1">(-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.discountAmount)})</span>
                                      </span>
                                    </li>
                                  )}
                                </ul>
                              </div>

                              <div className="pt-2.5 border-t border-gray-200 text-right">
                                <span className="text-[10px] text-gray-400 block uppercase font-bold mb-0.5">Tổng thanh toán:</span>
                                <span className="text-base font-extrabold text-[#059669] flex items-center justify-end gap-1">
                                  <Coins className="w-4.5 h-4.5 text-[#059669] shrink-0" />
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(o.finalAmount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Action buttons footer inside the card */}
                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-3 border-t border-gray-100 gap-3">
                          <div className="text-[11px] text-gray-400 font-medium">
                            * Vui lòng liên lạc và xử lý đóng gói hàng hóa trước khi bàn giao cho đơn vị vận chuyển.
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
                            {/* Pending State actions */}
                            {o.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerConfirm(
                                      'Xác nhận gửi hàng',
                                      'Xác nhận chuyển trạng thái đơn hàng sang ĐANG GIAO HÀNG?',
                                      () => updateOrderStatus(o.id, 'shipping')
                                    );
                                  }}
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all cursor-pointer w-full sm:w-auto min-h-[38px]"
                                >
                                  <Truck className="w-4 h-4 shrink-0" />
                                  <span>Xác nhận gửi hàng</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerConfirm(
                                      'Hủy đơn hàng',
                                      `Bạn có chắc chắn muốn HỦY đơn hàng ${o.id}?`,
                                      () => updateOrderStatus(o.id, 'cancelled')
                                    );
                                  }}
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs uppercase tracking-wide transition-all cursor-pointer w-full sm:w-auto min-h-[38px]"
                                >
                                  <XCircle className="w-4 h-4 shrink-0" />
                                  <span>Hủy đơn</span>
                                </button>
                              </>
                            )}

                            {/* Shipping State actions */}
                            {o.status === 'shipping' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerConfirm(
                                      'Giao thành công',
                                      `Xác nhận hoàn thành giao hàng thành công đơn hàng ${o.id}?`,
                                      () => updateOrderStatus(o.id, 'completed')
                                    );
                                  }}
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all cursor-pointer w-full sm:w-auto min-h-[38px]"
                                >
                                  <CheckCircle className="w-4 h-4 shrink-0" />
                                  <span>Giao thành công</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerConfirm(
                                      'Hủy đơn hàng',
                                      `Đơn hàng bị trả lại hoặc giao thất bại? Xác nhận HỦY đơn hàng ${o.id}?`,
                                      () => updateOrderStatus(o.id, 'cancelled')
                                    );
                                  }}
                                  className="flex items-center justify-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-bold text-xs uppercase tracking-wide transition-all cursor-pointer w-full sm:w-auto min-h-[38px]"
                                >
                                  <XCircle className="w-4 h-4 shrink-0" />
                                  <span>Giao thất bại / Hủy</span>
                                </button>
                              </>
                            )}

                            {/* Completed or Cancelled State */}
                            {(o.status === 'completed' || o.status === 'cancelled') && (
                              <span className="text-gray-400 text-xs font-semibold italic">
                                Đơn hàng đã hoàn tất vận hành và đóng sổ.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED CUSTOMERS (WEB SERVER DATA) */}
        {activeSubTab === 'users' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <div>
                <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#059669]" />
                  <span>Danh Sách Khách Hàng Đã Đăng Ký (Lưu tại Web Server)</span>
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  Dữ liệu tài khoản khách hàng đăng ký trực tuyến được lưu trữ an toàn trong tập tin cơ sở dữ liệu web server (`data/server-db.json`).
                </p>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
                Tổng cộng: {usersList.length} Tài khoản
              </div>
            </div>

            {usersLoading ? (
              <div className="text-center py-12 text-gray-400 text-xs animate-pulse">
                Đang tải danh sách tài khoản từ Web Server...
              </div>
            ) : usersList.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-500">Chưa có tài khoản khách hàng nào đăng ký.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-700">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Khách hàng</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Vai trò</th>
                        <th className="px-4 py-3">Ngày tạo tài khoản</th>
                        <th className="px-4 py-3 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-900 flex items-center gap-2.5">
                            {u.avatar ? (
                              <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center font-black">
                                {u.name ? u.name.charAt(0) : 'U'}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-gray-900">{u.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">ID: {u.id}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-600">{u.email}</td>
                          <td className="px-4 py-3">
                            {u.role === 'admin' ? (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Admin</span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Khách Hàng</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500">{u.createdAt || 'Mặc định'}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Hoạt động
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================= */}
      {/* 1. MODAL FORM: PRODUCT ADD & EDIT */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-100 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-gray-800 text-base">
                {editingProduct ? 'CẬP NHẬT SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI'}
              </h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* Bộ Sưu Tập Hình Ảnh (Tối đa 5 hình ảnh) */}
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Bộ Sưu Tập Hình Ảnh (Tối đa 5 hình ảnh)
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Ảnh đầu tiên sẽ là ảnh đại diện chính</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="flex flex-col space-y-1 bg-white p-2 border border-gray-100 rounded shadow-sm">
                      <span className="text-[10px] text-gray-400 font-bold">Hình {idx + 1} {idx === 0 ? '(Chính)' : ''}</span>
                      <div className="relative border border-gray-200 rounded overflow-hidden aspect-square bg-gray-50 flex items-center justify-center">
                        {prodImages[idx] ? (
                          <img 
                            src={prodImages[idx]} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.target as any).src = 'https://placehold.co/150?text=Error'; }} 
                            referrerPolicy="no-referrer" 
                          />
                        ) : (
                          <span className="text-gray-300 text-[10px]">Chưa nhập</span>
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="Dán link ảnh..."
                        value={prodImages[idx] || ''}
                        onChange={(e) => {
                          const newImgs = [...prodImages];
                          newImgs[idx] = e.target.value;
                          setProdImages(newImgs);
                          if (idx === 0) {
                            setProdImage(e.target.value); // Keep in sync
                          }
                        }}
                        className="w-full p-1 text-[10px] border border-gray-200 rounded outline-none focus:border-[#059669] text-gray-800"
                      />
                    </div>
                  ))}
                </div>

                {/* Quick Presets picker */}
                <div className="bg-white p-2.5 rounded border border-gray-100 mt-2">
                  <span className="text-[10px] font-bold text-gray-400 block mb-1.5 uppercase">Chọn nhanh hình mẫu cho Ảnh Chính (Hình 1):</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.label}
                        type="button"
                        onClick={() => {
                          setProdImage(img.url);
                          const newImgs = [...prodImages];
                          newImgs[0] = img.url;
                          setProdImages(newImgs);
                        }}
                        className={`px-2 py-1 text-[10px] font-semibold border rounded-md transition-all cursor-pointer ${
                          prodImage === img.url 
                            ? 'border-[#059669] bg-emerald-50 text-[#059669]' 
                            : 'border-gray-200 hover:bg-white text-gray-500'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video Sản Phẩm (Tối đa 1 video - tối đa 30s) */}
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Video Sản Phẩm (Tối đa 1 video)
                  </label>
                  <input
                    type="url"
                    placeholder="Link video trực tiếp .mp4 (ví dụ: https://...)"
                    value={prodVideo}
                    onChange={(e) => setProdVideo(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669] text-gray-800 bg-white"
                  />
                  <p className="text-[10px] text-gray-400">
                    Dán link video MP4 từ host/cloud để phát trực tiếp trong trang chi tiết.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Thời lượng (Tối đa 30s)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required={!!prodVideo}
                        value={prodVideoDuration}
                        onChange={(e) => setProdVideoDuration(Math.min(30, Math.max(1, Number(e.target.value) || 30)))}
                        className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669] text-gray-800 bg-white"
                      />
                      <span className="text-xs text-gray-500 font-bold">giây</span>
                    </div>
                  </div>
                  <div className="relative border border-gray-200 rounded overflow-hidden aspect-video bg-white flex items-center justify-center">
                    {prodVideo ? (
                      <div className="text-emerald-600 text-[10px] font-bold text-center p-1">
                        🎥 Video Sẵn Sàng<br/>
                        <span className="text-[9px] text-gray-400 font-normal">({prodVideoDuration} giây)</span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs text-center p-1">Chưa có video</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tên Sản Phẩm (Bắt buộc)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên sản phẩm chính xác, đầy đủ..."
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Giá Khuyến Mãi (VND) (Bắt buộc)</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 150000"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Giá Gốc Chưa Giảm (VND) (Tùy chọn)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 290000"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-blue-500" />
                    <span>Phân Loại Danh Mục (Bắt buộc)</span>
                  </label>
                  <select
                    required
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669] bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                    <span>Số Lượng Tồn Kho</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 100"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Nơi Bán (Tỉnh/Thành phố)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hà Nội, TP. Hồ Chí Minh..."
                    value={prodLocation}
                    onChange={(e) => setProdLocation(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669]"
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nhãn Đặc Trưng Cửa Hàng
                  </span>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodIsMall}
                        onChange={(e) => setProdIsMall(e.target.checked)}
                        className="accent-[#059669] w-4 h-4 cursor-pointer"
                      />
                      <span>Mall (Cam kết 100% Chính Hãng)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodIsFavorite}
                        onChange={(e) => setProdIsFavorite(e.target.checked)}
                        className="accent-orange-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Nhãn Yêu Thích+</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodIsFlashSale}
                        onChange={(e) => setProdIsFlashSale(e.target.checked)}
                        className="accent-red-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Kích Hoạt Flash Sale (Chạy Săn Deal)</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodIsBestSeller}
                        onChange={(e) => setProdIsBestSeller(e.target.checked)}
                        className="accent-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Sản Phẩm Bán Chạy</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodIsOnSale}
                        onChange={(e) => setProdIsOnSale(e.target.checked)}
                        className="accent-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Sản Phẩm Đang Giảm Giá</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Options Builder */}
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <Info className="w-4 h-4 text-[#059669]" />
                    <span>Thiết Lập Phân Loại Biến Thể (Màu sắc, kích cỡ, dung lượng...)</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Thêm các tùy chọn để khách hàng lựa chọn trước khi bấm Đặt Hàng.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập biến thể (e.g., Trắng - Size M, Màu Đỏ...)"
                    value={newOptionInput}
                    onChange={(e) => setNewOptionInput(e.target.value)}
                    className="flex-grow p-2 text-xs border border-gray-200 bg-white rounded outline-none focus:border-[#059669]"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                  />
                  <button
                    type="button"
                    onClick={addOption}
                    className="bg-[#059669] hover:bg-[#047857] text-white px-3.5 py-2 text-xs font-bold rounded cursor-pointer shrink-0 transition-colors"
                  >
                    Thêm
                  </button>
                </div>

                {prodOptions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prodOptions.map((opt) => (
                      <span 
                        key={opt}
                        className="bg-emerald-50 border border-emerald-100 text-[#059669] px-2.5 py-1 text-[11px] rounded font-bold flex items-center gap-1 animate-fade-in"
                      >
                        <span>{opt}</span>
                        <button
                          type="button"
                          onClick={() => removeOption(opt)}
                          className="text-emerald-700 hover:text-red-500 font-bold ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">Hiện tại chưa thiết lập phân loại biến thể đặc thù (Khách hàng sẽ mua mẫu mặc định).</p>
                )}
              </div>

              {/* Specifications Block */}
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Thông Số Sản Phẩm (Specs)</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Nhập các thuộc tính kỹ thuật chi tiết của sản phẩm để hiển thị ở mục thông tin.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="text-xs font-bold text-[#059669] hover:text-[#047857] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Thêm thuộc tính</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {prodSpecs.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center animate-fade-in">
                      <input
                        type="text"
                        placeholder="Thuộc tính (e.g. Chất liệu)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        className="w-1/3 p-2 text-xs border border-gray-200 bg-white rounded outline-none focus:border-[#059669] font-semibold"
                      />
                      <input
                        type="text"
                        placeholder="Giá trị (e.g. Inox 316, Cotton)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        className="flex-1 p-2 text-xs border border-gray-200 bg-white rounded outline-none focus:border-[#059669]"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(index)}
                        disabled={prodSpecs.length <= 1}
                        className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mô Tả Chi Tiết Sản Phẩm
                </label>
                <textarea
                  rows={4}
                  placeholder="Viết nội dung quảng bá, mô tả thông số kỹ thuật, hướng dẫn sử dụng chi tiết..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669] font-sans leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded transition-all cursor-pointer border border-gray-200"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  className="bg-[#059669] hover:bg-[#047857] text-white px-7 py-2.5 text-xs font-bold rounded shadow-md transition-all uppercase tracking-wider cursor-pointer"
                >
                  LƯU THÔNG TIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 2. MODAL FORM: CATEGORY ADD & EDIT */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-100 max-w-md w-full flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-gray-800 text-sm">
                {editingCategory ? 'CẬP NHẬT DANH MỤC' : 'THÊM DANH MỤC MỚI'}
              </h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mã ID Danh Mục (Bắt buộc)
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingCategory}
                  placeholder="e.g. fashion-unisex, tech-acc (viết liền không dấu)"
                  value={catId}
                  onChange={(e) => setCatId(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669] disabled:bg-gray-100 font-mono"
                />
                {!editingCategory && (
                  <p className="text-[9px] text-gray-400">ID được dùng làm mã định danh hệ thống, không thay đổi sau khi tạo.</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tên Danh Mục Hiển Thị (Bắt buộc)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thời Trang Unisex, Đồ Gia Dụng..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669]"
                />
              </div>

              {/* Icon selection drop down */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Chọn Icon Biểu Tượng (Lucide)
                </label>
                <div className="flex gap-3">
                  <select
                    value={catIconName}
                    onChange={(e) => setCatIconName(e.target.value)}
                    className="flex-1 p-2.5 text-xs border border-gray-200 rounded outline-none focus:border-[#059669] bg-white cursor-pointer"
                  >
                    {Object.keys(iconMap).map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  {/* Icon preview */}
                  <div className="w-10 h-10 border border-gray-200 rounded flex items-center justify-center bg-gray-50 text-[#059669]">
                    {React.createElement(iconMap[catIconName] || Shirt, { className: 'w-5 h-5' })}
                  </div>
                </div>
              </div>

              {/* Color scheme setup */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Màu Sắc Biểu Tượng (Theme)
                </label>
                <div className="grid grid-cols-5 gap-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setCatColor(color.class)}
                      className={`h-9 rounded border text-xs flex items-center justify-center cursor-pointer transition-all ${color.class} ${
                        catColor === color.class 
                          ? 'ring-2 ring-emerald-600 scale-105 border-transparent shadow-sm' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {React.createElement(iconMap[catIconName] || Shirt, { className: 'w-4 h-4' })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end space-x-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded transition-all cursor-pointer"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2 text-xs font-bold rounded shadow-md transition-all uppercase cursor-pointer"
                >
                  LƯU DANH MỤC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. CUSTOM DIALOG: CONFIRMATION */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-sm w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">{confirmDialog.title}</h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{confirmDialog.message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-md transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-md shadow-sm transition-all cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 4. CUSTOM DIALOG: ALERT */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-sm w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-sm">{alertDialog.title}</h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{alertDialog.message}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-md shadow-sm transition-all cursor-pointer"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
