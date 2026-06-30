import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Zap } from 'lucide-react';

export const FlashSale: React.FC = () => {
  const { products, setSelectedProduct } = useApp();

  // Filter flash sale products
  const flashSaleProducts = products.filter((p) => p.isFlashSale);

  // Countdown state: 2 hours 14 mins 30 secs initial
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 14,
    seconds: 30
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer to simulate endless flash sales
          return { hours: 2, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (flashSaleProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Flash Sale Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-[#059669] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
          <div className="flex items-center space-x-2.5">
            {/* Zap logo with glowing pulse */}
            <div className="bg-yellow-400 p-1.5 rounded-full animate-pulse text-emerald-700">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h2 className="text-xl md:text-2xl font-black italic tracking-wider uppercase">
              FLASH SALE
            </h2>
            
            {/* Countdown timer */}
            <div className="flex items-center space-x-1.5 ml-2">
              <span className="bg-gray-900 text-white font-bold text-sm px-2 py-1 rounded min-w-[28px] text-center">
                {formatNumber(timeLeft.hours)}
              </span>
              <span className="font-bold text-yellow-400">:</span>
              <span className="bg-gray-900 text-white font-bold text-sm px-2 py-1 rounded min-w-[28px] text-center">
                {formatNumber(timeLeft.minutes)}
              </span>
              <span className="font-bold text-yellow-400">:</span>
              <span className="bg-gray-900 text-white font-bold text-sm px-2 py-1 rounded min-w-[28px] text-center">
                {formatNumber(timeLeft.seconds)}
              </span>
            </div>
          </div>
          
          <div className="text-xs md:text-sm font-semibold opacity-90 cursor-pointer hover:underline self-end sm:self-auto">
            Xem Tất Cả Săn Deal Sốc &rsaquo;
          </div>
        </div>

        {/* Scrollable list */}
        <div className="p-4 flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 py-6">
          {flashSaleProducts.map((product) => {
            const salePrice = product.price;
            const original = product.originalPrice || (product.price * 1.5);
            
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex-shrink-0 w-[160px] md:w-[185px] bg-white rounded border border-gray-100 hover:border-emerald-400 p-2 cursor-pointer transition-all duration-300 hover:shadow-lg relative group"
              >
                {/* Image & Discount Badge */}
                <div className="relative aspect-square overflow-hidden rounded bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {product.discount && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-[#059669] text-[10px] md:text-xs font-black px-1.5 py-1 rounded-bl-sm flex flex-col items-center">
                      <span>-{product.discount}%</span>
                      <span className="text-[7px] text-gray-900 uppercase font-bold">GIẢM</span>
                    </div>
                  )}
                  {product.isMall && (
                    <span className="absolute top-1.5 left-1.5 bg-[#047857] text-white font-extrabold text-[8px] uppercase px-1 rounded-sm">
                      Mall
                    </span>
                  )}
                </div>

                {/* Pricing & Sales Bar */}
                <div className="mt-3 flex flex-col">
                  {/* Title (truncated to 1 line) */}
                  <h3 className="text-xs font-medium text-gray-800 truncate mb-1 group-hover:text-[#059669]">
                    {product.name}
                  </h3>

                  {/* Prices */}
                  <div className="flex flex-col">
                    <span className="text-emerald-600 font-extrabold text-sm md:text-base">
                      {formatVND(salePrice)}
                    </span>
                    <span className="text-gray-400 line-through text-[10px] md:text-xs">
                      {formatVND(original)}
                    </span>
                  </div>

                  {/* Fire Progress Bar */}
                  <div className="mt-2.5 relative bg-emerald-100 h-4 rounded-full overflow-hidden flex items-center justify-center">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
                      style={{ width: `${product.flashSaleProgress || 70}%` }}
                    />
                    
                    <span className="absolute z-10 text-[9px] text-white font-extrabold uppercase flex items-center gap-0.5 drop-shadow-sm">
                      <Flame className="w-2.5 h-2.5 fill-current text-yellow-300" />
                      {product.flashSaleProgress && product.flashSaleProgress > 85 ? 'Sắp cháy hàng' : `Đã bán ${(product.flashSaleProgress || 70)}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
