import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CategoryList } from './components/CategoryList';
import { FlashSale } from './components/FlashSale';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistory } from './components/OrderHistory';
import { ShopChat } from './components/ShopChat';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { SlidersHorizontal, Check, RefreshCw, Sparkles } from 'lucide-react';

const ShopContent: React.FC = () => {
  const {
    filteredProducts,
    selectedProduct,
    setSelectedProduct,
    activeTab,
    setActiveTab,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [showCheckout, setShowCheckout] = useState(false);

  // Sorting handlers
  const sortOptions: { label: string; value: typeof sortBy }[] = [
    { label: 'Phổ Biến', value: 'popular' },
    { label: 'Mới Nhất', value: 'latest' },
    { label: 'Bán Chạy', value: 'sold' }
  ];

  const handlePriceSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'asc') setSortBy('price-asc');
    if (val === 'desc') setSortBy('price-desc');
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-12 font-sans text-gray-800 antialiased">
      {/* Main Header */}
      <Header />

      {/* Main Container Views Switcher */}
      {activeTab === 'home' && (
        <main className="space-y-6">
          {/* Categories Grid */}
          <CategoryList />

          {/* Flash Sale Promo */}
          <FlashSale />

          {/* Today Discover Section */}
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="bg-white p-4 rounded-t-lg shadow-sm border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#059669] fill-current" />
                <h2 className="text-sm font-bold text-[#059669] uppercase tracking-wider">
                  GỢI Ý HÔM NAY
                </h2>
              </div>

              {/* Sorting Bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Sắp xếp theo:
                </span>

                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-4 py-2 rounded-sm font-semibold transition-all cursor-pointer ${
                      sortBy === opt.value
                        ? 'bg-[#059669] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}

                {/* Price selector dropdown */}
                <select
                  onChange={handlePriceSortChange}
                  value={sortBy.startsWith('price') ? (sortBy === 'price-asc' ? 'asc' : 'desc') : ''}
                  className={`px-3 py-2 border rounded-sm font-semibold outline-none cursor-pointer text-xs ${
                    sortBy.startsWith('price') ? 'border-[#059669] text-[#059669] bg-emerald-50/20' : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <option value="" disabled>Giá</option>
                  <option value="asc">Giá: Thấp đến Cao</option>
                  <option value="desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>

            {/* Product Feed Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-b-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-[#059669]">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-base font-bold text-gray-800">Không Tìm Thấy Sản Phẩm Phù Hợp</h3>
                <p className="text-xs text-gray-400 max-w-sm leading-normal">Shop rất tiếc vì hiện không có mặt hàng nào khớp hoàn toàn với tiêu chí tìm kiếm của bạn. Hãy thử đổi từ khóa khác nhé!</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2 rounded text-xs font-semibold shadow cursor-pointer transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {activeTab === 'cart' && (
        <Cart onCheckout={() => setShowCheckout(true)} />
      )}

      {activeTab === 'orders' && (
        <OrderHistory />
      )}

      {activeTab === 'admin' && (
        <AdminPanel />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Checkout Form Modal */}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
        />
      )}

      {/* Floating interactive Shop Chat */}
      <ShopChat />

      {/* Main Footer with Connections, Contact and Support */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ShopContent />
    </AppProvider>
  );
}
