import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, MapPin, ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart } = useApp();
  const [added, setAdded] = useState(false);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatSold = (sold: number) => {
    if (sold >= 1000) {
      return `Đã bán ${(sold / 1000).toFixed(1)}k`;
    }
    return `Đã bán ${sold}`;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultOpt = product.options && product.options.length > 0 ? product.options[0] : undefined;
    addToCart(product, 1, defaultOpt);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-md border border-gray-100 hover:border-[#059669]/60 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative group flex flex-col h-full overflow-hidden select-none"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden w-full shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          {product.isFavorite && (
            <span className="bg-[#10b981] text-white font-bold text-[9px] px-1.5 py-0.5 rounded-xs shadow-sm">
              Yêu thích
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded-xs tracking-wider shadow-sm">
              Bán Chạy
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-red-500 text-white font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded-xs tracking-wider shadow-sm">
              Giảm Sâu
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-0 right-0 bg-yellow-400 text-[#059669] text-[10px] md:text-xs font-black px-1.5 py-1.5 rounded-bl-sm flex flex-col items-center shadow-sm">
            <span>-{product.discount}%</span>
            <span className="text-[7.5px] text-gray-900 uppercase font-black tracking-wider">GIẢM</span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          {/* Title - truncated to 2 lines */}
          <h3 className="text-xs font-medium text-gray-800 leading-relaxed overflow-hidden text-ellipsis line-clamp-2 h-[36px] group-hover:text-[#059669] transition-colors mb-2">
            {product.name}
          </h3>

          {/* Tag labels like "Bao ship", "Hoàn xu 10%" */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.isBestSeller && (
              <span className="text-[9px] text-orange-600 bg-orange-50 border border-orange-200 font-bold px-1 rounded-sm uppercase tracking-wide">
                Bán chạy
              </span>
            )}
            {product.isOnSale && (
              <span className="text-[9px] text-red-600 bg-red-50 border border-red-200 font-bold px-1 rounded-sm uppercase tracking-wide">
                Đang giảm giá
              </span>
            )}
            <span className="text-[9px] text-[#26a69a] border border-[#26a69a] font-semibold px-1 rounded-sm uppercase tracking-wide">
              Bao Ship 0Đ
            </span>
            {product.price > 200000 && (
              <span className="text-[9px] text-emerald-600 border border-emerald-600 font-semibold px-1 rounded-sm uppercase tracking-wide">
                Gói Ưu Đãi
              </span>
            )}
          </div>
        </div>

        {/* Footer Area: Price, Sold, Location & Quick Add */}
        <div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[#059669] font-bold text-sm md:text-base">
              {formatVND(product.price)}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {formatSold(product.sold)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 text-[10px] text-gray-500">
            {/* Rating & Location */}
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-0.5">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-700">{product.rating}</span>
              </div>
              <div className="flex items-center space-x-0.5 max-w-[70px] truncate">
                <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                <span className="truncate">{product.location}</span>
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              title="Thêm nhanh vào giỏ hàng"
              className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                added 
                  ? 'bg-emerald-600 text-white scale-110' 
                  : 'bg-emerald-50 hover:bg-[#059669] text-[#059669] hover:text-white'
              }`}
            >
              {added ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
