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
    setSelectedCategory
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
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveTab('admin')}
            className={`hover:opacity-80 cursor-pointer flex items-center space-x-1 px-1.5 py-0.5 rounded transition-all ${
              activeTab === 'admin' ? 'bg-white/25 font-bold shadow-inner' : ''
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kênh Người Bán (Quản Lý)</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="hover:opacity-80 cursor-pointer flex items-center space-x-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Thông Báo</span>
          </span>
          <span className="hover:opacity-80 cursor-pointer flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Tiếng Việt</span>
          </span>
          <span className="w-[1px] h-3 bg-white/30"></span>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`hover:opacity-80 cursor-pointer flex items-center space-x-1 px-1.5 py-0.5 rounded ${activeTab === 'orders' ? 'bg-white/20' : ''}`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="font-medium">Lịch Sử Mua Hàng</span>
          </button>
          
          <span className="w-[1px] h-3 bg-white/30"></span>
          <div className="flex items-center space-x-1 hover:opacity-95 cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">Khách Hàng</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between gap-4">
        {/* Shop Logo */}
        <div onClick={resetHome} className="flex items-center space-x-2 cursor-pointer select-none shrink-0">
          <div className="bg-white text-[#059669] p-1.5 md:p-2 rounded-xl shadow-inner transform hover:scale-105 transition-all">
            <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base md:text-lg font-black tracking-wider uppercase">PK ĐIỆN TỬ - CAMERA</span>
            <span className="text-[9px] font-medium text-white/90 tracking-widest pl-0.5">UY TÍN - CHẤT LƯỢNG - GIÁ TỐT</span>
          </div>
        </div>

        {/* Search Bar & Trends */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="bg-white p-1 rounded-sm shadow-sm flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm phụ kiện điện tử, camera chính hãng..."
              className="flex-grow px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2 rounded-sm transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
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
