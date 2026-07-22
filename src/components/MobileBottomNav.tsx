import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingCart, Clock, Store, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, currentUser, setAuthModalOpen } = useApp();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 md:hidden shadow-lg">
      <div className="flex items-center justify-around text-[10px] font-medium text-gray-600">
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-full py-1 transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-[#059669] font-bold scale-105' : 'hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Trang Chủ</span>
        </button>

        {/* Cart Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center justify-center w-full py-1 transition-all relative cursor-pointer ${
            activeTab === 'cart' ? 'text-[#059669] font-bold scale-105' : 'hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-bold text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalCartItems > 99 ? '99+' : totalCartItems}
              </span>
            )}
          </div>
          <span>Giỏ Hàng</span>
        </button>

        {/* Orders Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center w-full py-1 transition-all cursor-pointer ${
            activeTab === 'orders' ? 'text-[#059669] font-bold scale-105' : 'hover:text-gray-900'
          }`}
        >
          <Clock className="w-5 h-5 mb-0.5" />
          <span>Đơn Hàng</span>
        </button>

        {/* User / Auth Tab */}
        {currentUser ? (
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center w-full py-1 transition-all cursor-pointer ${
              activeTab === 'admin' ? 'text-[#059669] font-bold scale-105' : 'hover:text-gray-900'
            }`}
          >
            <Store className="w-5 h-5 mb-0.5" />
            <span>Quản Lý</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="flex flex-col items-center justify-center w-full py-1 transition-all cursor-pointer text-[#059669] font-bold"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Đăng Nhập</span>
          </button>
        )}
      </div>
    </nav>
  );
};
