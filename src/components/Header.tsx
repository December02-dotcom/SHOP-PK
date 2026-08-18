import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ShoppingCart, 
  Bell, 
  HelpCircle, 
  Globe, 
  Store, 
  PhoneCall,
  User,
  History,
  Ticket
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    cart, 
    activeTab, 
    setActiveTab,
    setSelectedCategory,
    currentUser,
    setAuthModalOpen,
    logout
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    setSelectedCategory(null); // Clear category filter when searching
    setActiveTab('home');
  };

  const handleTagClick = (tag: string) => {
    setInputVal(tag);
    setSearchQuery(tag);
    setSelectedCategory(null);
    setActiveTab('home');
  };

  const resetHome = () => {
    setInputVal('');
    setSearchQuery('');
    setSelectedCategory(null);
    setActiveTab('home');
  };

  return (
    <header className="bg-gradient-to-b from-[#059669] to-[#047857] text-white text-xs sticky top-0 z-50 shadow-md">
      {/* Top Navbar - Icon Only / Icon Optimized */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center border-b border-white/10 text-white">
        {/* Left Side: Seller / Store channel icon */}
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={() => setActiveTab('admin')}
            title="Kênh Người Bán (Quản Lý)"
            className={`p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center ${
              activeTab === 'admin' ? 'bg-white/25 ring-1 ring-white/40' : ''
            }`}
          >
            <Store className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Quick Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            type="button"
            title="Thông Báo"
            className="p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button 
            type="button"
            title="Ngôn Ngữ (Tiếng Việt)"
            className="p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center"
          >
            <Globe className="w-4 h-4" />
          </button>

          <span className="w-[1px] h-3.5 bg-white/30"></span>

          <button 
            type="button"
            onClick={() => setActiveTab('orders')}
            title="Lịch Sử Mua Hàng"
            className={`p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center ${
              activeTab === 'orders' ? 'bg-white/25 ring-1 ring-white/40' : ''
            }`}
          >
            <History className="w-4 h-4" />
          </button>

          <span className="w-[1px] h-3.5 bg-white/30"></span>

          {/* User Account / Auth Icon */}
          {currentUser ? (
            <div className="relative group">
              <button 
                type="button"
                title={currentUser.name}
                className="flex items-center space-x-1 p-1 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover border border-white/50" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>

              {/* Hover Dropdown Menu */}
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block w-48 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 text-gray-800 text-xs">
                  <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/80">
                    <p className="font-bold text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  
                  {currentUser.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('admin')}
                      className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Trang Quản Lý</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5 text-gray-500" />
                    <span>Đơn Hàng Của Tôi</span>
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 border-t border-gray-100 cursor-pointer"
                  >
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              title="Đăng Nhập / Đăng Ký"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center"
            >
              <User className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between gap-4">
        {/* Shop Logo */}
        <div onClick={resetHome} className="flex items-center space-x-2 cursor-pointer select-none shrink-0">
          <div className="bg-white text-[#059669] p-1 md:p-1.5 rounded-xl shadow-inner transform hover:scale-105 transition-all">
            <img 
              src="https://genqrcode.com/embedded?style=5&inner_eye_style=1&outer_eye_style=4&logo=009949094d7bb4eb8963a416813fca0f&color=%232664a6FF&background_color=%23ffffffFF&inner_eye_color=%230965c8&outer_eye_color=%23145722&imageformat=svg&language=vn&frame_style=0&frame_text=&frame_text_icon_color=%238e4848&frame_text_icon=user-regular&frame_color=%23000000&frame_background_color=%23FFFFFF&frame_text_color=%23FFFFFF&invert_colors=false&gradient_style=1&gradient_color_start=%230b650d&gradient_color_end=%230470c3&gradient_start_offset=5&gradient_end_offset=95&stl_type=1&logo_remove_background=true&stl_size=100&stl_qr_height=1.5&stl_base_height=2&stl_include_stands=false&stl_qr_magnet_type=3&stl_qr_magnet_count=0&type=0&text=Ph%E1%BB%A5%20Ki%E1%BB%87n%20%C4%90i%E1%BB%87n%20T%E1%BB%AD%20-%20Camera%0A0706010948%0Apkdientu-camera.com%0Ashopee.vn%2Fphukien_dientu_camera&width=500&height=500&bordersize=2" 
              alt="Logo PK ĐIỆN TỬ - CAMERA" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain rounded" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base md:text-lg font-black tracking-wider uppercase">PK ĐIỆN TỬ - CAMERA</span>
            <span className="text-[9px] font-medium text-white/90 tracking-widest pl-0.5">UY TÍN - CHẤT LƯỢNG - GIÁ TỐT</span>
          </div>
        </div>

        {/* Search Bar & Trends */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="bg-white p-1 rounded-lg shadow-sm flex items-center border border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-300">
            <input
              type="text"
              placeholder="Tìm kiếm phụ kiện điện tử, camera chính hãng..."
              className="flex-grow px-3 py-1.5 md:py-2 text-xs md:text-sm text-gray-800 placeholder-gray-400 outline-none w-full"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#059669] hover:bg-[#047857] text-white px-4 md:px-6 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1 font-bold text-xs"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
          </form>
        </div>

        {/* Shopping Cart Icon with Badge */}
        <div className="relative shrink-0 pr-2">
          <button
            onClick={() => setActiveTab('cart')}
            className="p-2.5 text-white hover:text-white/80 transition-colors relative cursor-pointer"
            id="cart-button"
          >
            <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 bg-white text-[#059669] border border-[#059669] font-bold text-[10px] md:text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center shadow-md animate-bounce">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
