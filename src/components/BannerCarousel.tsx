import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift, Sparkles, Percent, Truck } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  gradient: string;
  icon: React.ReactNode;
  term: string;
}

export const BannerCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Đại Tiệc Siêu Sale 7.7',
      subtitle: 'Xả Kho Đồng Giá Chỉ Từ 77K - Voucher Giảm Tới 50%',
      badge: 'HOT DEAL',
      gradient: 'from-[#047857] to-[#10b981]',
      icon: <Percent className="w-16 h-16 opacity-20 text-white absolute -right-4 -bottom-4" />,
      term: 'Duy nhất hôm nay từ 0H - 24H'
    },
    {
      id: 2,
      title: 'Miễn Phí Vận Chuyển Toàn Quốc',
      subtitle: 'Đơn hàng từ 99K - Nhận ngay Voucher FREESHIP 25K',
      badge: 'FRESESHIP EXTRA',
      gradient: 'from-[#11998e] to-[#38ef7d]',
      icon: <Truck className="w-16 h-16 opacity-20 text-white absolute -right-4 -bottom-4" />,
      term: 'Áp dụng cho mọi hình thức vận chuyển'
    },
    {
      id: 3,
      title: 'Mua Sắm Thảnh Thơi - Không Cần Thanh Toán',
      subtitle: 'Đặt Hàng Nhận COD Hoặc Chuyển Khoản Trực Tiếp Tiện Lợi',
      badge: 'TRẢI NGHIỆM TIỆN LỢI',
      gradient: 'from-[#0f766e] via-[#0d9488] to-[#2dd4bf]',
      icon: <Gift className="w-16 h-16 opacity-20 text-white absolute -right-4 -bottom-4" />,
      term: 'Không yêu cầu thẻ tín dụng hay ví điện tử'
    },
    {
      id: 4,
      title: 'Shop Mall Cam Kết Chính Hãng 100%',
      subtitle: 'Hoàn Tiền Gấp Đôi Nếu Phát Hiện Hàng Giả - Bảo Hành 1 Đổi 1',
      badge: 'BRAND MALL',
      gradient: 'from-[#064e3b] via-[#059669] to-[#34d399]',
      icon: <Sparkles className="w-16 h-16 opacity-20 text-white absolute -right-4 -bottom-4" />,
      term: 'Đóng gói chuẩn quy trình an toàn 100%'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-7xl mx-auto px-4 mt-4">
      {/* Main Slider (2 cols on large screen) */}
      <div className="lg:col-span-2 relative h-[220px] md:h-[260px] rounded-lg overflow-hidden group shadow">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full p-6 md:p-10 flex flex-col justify-between transition-opacity duration-700 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            } bg-gradient-to-r ${slide.gradient} text-white`}
          >
            {slide.icon}
            
            {/* Slide Top Badge */}
            <div>
              <span className="bg-white/20 text-white font-bold text-[10px] md:text-xs tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                {slide.badge}
              </span>
            </div>

            {/* Slide Middle Description */}
            <div className="my-2">
              <h2 className="text-xl md:text-3xl font-black leading-tight tracking-tight drop-shadow-md">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base font-medium opacity-90 mt-1 md:mt-2">
                {slide.subtitle}
              </p>
            </div>

            {/* Slide Footer */}
            <div className="flex justify-between items-center text-[11px] md:text-xs opacity-75">
              <span>{slide.term}</span>
              <span className="font-semibold">MUA NGAY &rarr;</span>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/15 hover:bg-black/35 text-white p-1.5 md:p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/15 hover:bg-black/35 text-white p-1.5 md:p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === current ? 'bg-white w-5' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side Static Promo Banners (1 col on large screen) */}
      <div className="hidden lg:grid grid-rows-2 gap-3 h-[260px]">
        <div className="rounded-lg bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] p-4 text-white flex flex-col justify-between shadow relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-15">
            <Gift className="w-20 h-20" />
          </div>
          <span className="bg-yellow-400 text-gray-900 font-bold text-[9px] px-2 py-0.5 rounded uppercase self-start">
            QUÀ TẶNG KHỦNG
          </span>
          <div>
            <h4 className="font-bold text-sm leading-tight">Quà Tặng Tri Ân Đơn Đầu Tiên</h4>
            <p className="text-xs opacity-80 mt-1">Nhiều phụ kiện xinh xắn đi kèm hoàn toàn FREE</p>
          </div>
          <span className="text-[11px] font-semibold">Khám phá ngay &rarr;</span>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-[#059669] to-[#86efac] p-4 text-white flex flex-col justify-between shadow relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-15">
            <Percent className="w-20 h-20" />
          </div>
          <span className="bg-white text-emerald-700 font-bold text-[9px] px-2 py-0.5 rounded uppercase self-start">
            SIÊU CHÍNH HÃNG
          </span>
          <div>
            <h4 className="font-bold text-sm leading-tight">PKDT Mall Brand Day</h4>
            <p className="text-xs opacity-80 mt-1">Giảm trực tiếp 10% đơn hàng, bảo hành cực dễ</p>
          </div>
          <span className="text-[11px] font-semibold">Xem khuyến mãi &rarr;</span>
        </div>
      </div>
    </div>
  );
};
