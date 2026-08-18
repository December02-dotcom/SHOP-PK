import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { MOCK_REVIEWS } from '../data';
import { 
  X, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  Heart, 
  MessageSquare,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Store,
  CheckCircle2,
  Play
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const { addToCart, setActiveTab, setChatOpen, setActivePolicyModal } = useApp();
  
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [viewingVideo, setViewingVideo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>(
    product.options && product.options.length > 0 ? product.options[0] : ''
  );
  const [isLiked, setIsLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOption || undefined);
    triggerToast('Đã thêm sản phẩm vào Giỏ Hàng thành công!');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOption || undefined);
    setActiveTab('cart');
    onClose();
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenChat = () => {
    setChatOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-[#f5f5f5] w-full max-w-5xl rounded-lg shadow-2xl relative overflow-hidden flex flex-col my-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white px-6 py-3 rounded-md shadow-lg flex items-center space-x-2 text-sm border border-emerald-500/30 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Header Control */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="hover:text-[#059669] cursor-pointer">PK ĐIỆN TỬ - CAMERA</span>
            <span>&rsaquo;</span>
            <span className="hover:text-[#059669] cursor-pointer">Sản phẩm chi tiết</span>
            <span>&rsaquo;</span>
            <span className="text-gray-800 font-medium max-w-[150px] sm:max-w-[300px] truncate">{product.name}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-4 space-y-4">
          {/* Main Product Info Card */}
          <div className="bg-white p-4 rounded-md grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
            {/* Left: Gallery Column */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                {viewingVideo && product.video ? (
                  <video 
                    src={product.video} 
                    className="w-full h-full object-contain bg-black" 
                    controls 
                    autoPlay 
                    muted
                  />
                ) : (
                  <img
                    src={images[activeImgIdx]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                {/* Arrow Controls */}
                {!viewingVideo && images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImgIdx((prev) => (prev + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Favorite heart */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 cursor-pointer hover:scale-110 transition-transform"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Row */}
              {(images.length > 1 || product.video) && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {/* Video Thumbnail (if exists) */}
                  {product.video && (
                    <button
                      onClick={() => setViewingVideo(true)}
                      className={`relative w-16 h-16 rounded border overflow-hidden shrink-0 bg-slate-900 flex flex-col items-center justify-center cursor-pointer text-white transition-all ${
                        viewingVideo ? 'border-[#059669] ring-2 ring-[#059669]' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Play className="w-5 h-5 text-[#059669] fill-current" />
                      <span className="text-[9px] font-bold text-gray-200 mt-1">Video</span>
                      {product.videoDuration && (
                        <span className="absolute top-1 right-1 text-[8px] bg-black/50 px-1 rounded text-white">
                          {product.videoDuration}s
                        </span>
                      )}
                    </button>
                  )}

                  {/* Image Thumbnails */}
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImgIdx(idx);
                        setViewingVideo(false);
                      }}
                      className={`relative w-16 h-16 rounded border overflow-hidden shrink-0 bg-gray-50 cursor-pointer transition-all ${
                        !viewingVideo && idx === activeImgIdx ? 'border-[#059669] ring-2 ring-[#059669]' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Specs & Buy Options Column */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                {/* Title */}
                <h1 className="text-base sm:text-lg font-bold text-gray-800 leading-snug">
                  {product.isBestSeller && (
                    <span className="bg-orange-500 text-white font-black text-[10px] uppercase px-1.5 py-0.5 rounded-sm tracking-wider mr-2 align-middle">
                      Bán Chạy
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-red-500 text-white font-black text-[10px] uppercase px-1.5 py-0.5 rounded-sm tracking-wider mr-2 align-middle">
                      Giảm Sâu
                    </span>
                  )}
                  {product.name}
                </h1>

                {/* Rating & Sold count row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-gray-500 border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-base text-[#059669]">{product.rating}</span>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <span className="w-[1px] h-3 bg-gray-200"></span>
                  <span className="underline cursor-pointer hover:text-gray-800">
                    {product.reviewsCount} Đánh Giá
                  </span>
                  <span className="w-[1px] h-3 bg-gray-200"></span>
                  <span>Đã bán <strong className="text-gray-800 font-semibold">{product.sold}</strong> sản phẩm</span>
                </div>

                {/* Price Display */}
                <div className="bg-gray-50 p-4 rounded-md mt-4 flex items-center flex-wrap gap-3">
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      {formatVND(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-[#059669] font-black text-2xl sm:text-3xl">
                    {formatVND(product.price)}
                  </span>
                  {product.discount && (
                    <span className="bg-[#10b981] text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider scale-95">
                      GIẢM {product.discount}%
                    </span>
                  )}
                </div>

                {/* Shipping info */}
                <div className="mt-4 space-y-2.5 text-xs text-gray-700">
                  <div className="flex items-start">
                    <Truck className="w-4 h-4 text-emerald-500 shrink-0 mr-3 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-800">Miễn Phí Vận Chuyển Toàn Quốc</p>
                      <p className="text-gray-500">Bao ship 0Đ cho tất cả đơn hàng từ 99K áp dụng Voucher</p>
                    </div>
                  </div>
                </div>

                {/* Options Selection */}
                {product.options && product.options.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <span className="text-xs font-bold text-gray-600 block uppercase tracking-wider">
                      Chọn Phân Loại:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedOption(opt)}
                          className={`px-3 py-1.5 text-xs rounded font-medium border transition-all cursor-pointer ${
                            selectedOption === opt
                              ? 'border-[#059669] text-[#059669] bg-emerald-50/50 ring-1 ring-[#059669]'
                              : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity picker */}
                <div className="mt-5 flex items-center space-x-4">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Số Lượng:</span>
                  <div className="flex items-center border border-gray-200 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-bold border-r border-gray-200 text-gray-600 rounded-l cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm font-semibold min-w-[40px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 font-bold border-l border-gray-200 text-gray-600 rounded-r cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    Còn {product.stock} sản phẩm sẵn có
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border border-[#059669] bg-emerald-50 text-[#059669] hover:bg-emerald-100/50 py-3 rounded-sm font-semibold flex items-center justify-center space-x-2 transition-all text-sm cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#059669] hover:bg-[#047857] text-white py-3 rounded-sm font-semibold flex items-center justify-center space-x-1.5 shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
                >
                  <span>MUA NGAY</span>
                </button>
              </div>
            </div>
          </div>

          {/* Shop Warranty & Security (Clickable to view Google Drive embedded policies) */}
          <div className="bg-white p-4 rounded-md flex flex-wrap justify-between gap-4 text-xs text-gray-600 shadow-sm border-t-2 border-[#059669]/30">
            <button
              type="button"
              onClick={() => setActivePolicyModal('warranty')}
              className="flex items-center gap-1.5 hover:text-[#059669] transition-colors cursor-pointer text-left"
              title="Nhấn để xem văn bản chính sách bảo hành & đổi trả trên Google Drive"
            >
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span><strong>7 ngày miễn phí trả hàng</strong> - Hoàn tiền tức thì</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePolicyModal('sales')}
              className="flex items-center gap-1.5 hover:text-[#059669] transition-colors cursor-pointer text-left"
              title="Nhấn để xem cam kết chất lượng & chính sách bán hàng"
            >
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span><strong>Hàng chính hãng 100%</strong> - Đầy đủ giấy tờ</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePolicyModal('shipping')}
              className="flex items-center gap-1.5 hover:text-[#059669] transition-colors cursor-pointer text-left"
              title="Nhấn để xem chính sách vận chuyển & cước phí 63 tỉnh"
            >
              <Truck className="w-4 h-4 text-[#059669]" />
              <span><strong>Miễn phí vận chuyển</strong> - Đơn từ 500k</span>
            </button>
          </div>

          {/* Shop Profile section */}
          <div className="bg-white p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-[#059669] text-white font-extrabold flex items-center justify-center shadow">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1">
                  PK ĐIỆN TỬ - CAMERA Mall
                  <span className="bg-[#047857] text-white text-[9px] px-1 py-0.2 rounded uppercase">Yêu Thích+</span>
                </h4>
                <p className="text-xs text-gray-500">Hoạt động 5 phút trước | Hà Nội</p>
              </div>
            </div>

            <div className="flex gap-2.5 w-full md:w-auto">
              <button 
                onClick={handleOpenChat}
                className="flex-1 md:flex-none border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#059669]" />
                Chat Ngay
              </button>
              <button className="flex-1 md:flex-none border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                Xem Cửa Hàng
              </button>
            </div>
          </div>

          {/* Product Specifications & Detailed description */}
          <div className="bg-white p-4 rounded-md shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
                Chi Tiết Sản Phẩm
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex py-1.5 border-b border-gray-50">
                    <span className="w-36 text-gray-500">{key}</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
                Mô Tả Sản Phẩm
              </h3>
              <p className="mt-3 text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-3">
              Đánh Giá Sản Phẩm
            </h3>

            <div className="space-y-6 mt-4 divider-y divide-gray-100">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="text-xs flex gap-3 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  {/* User Avatar */}
                  <img
                    src={review.avatar}
                    alt={review.username}
                    className="w-10 h-10 rounded-full object-cover shadow-sm bg-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Review Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">{review.username}</span>
                      <span className="text-gray-400 text-[10px]">{review.date}</span>
                    </div>

                    {/* Star Rating bar */}
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-current' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>

                    {review.optionSelected && (
                      <p className="text-[10px] text-gray-500 font-medium">Phân loại: {review.optionSelected}</p>
                    )}

                    <p className="text-gray-700 leading-relaxed pt-1 font-medium">{review.comment}</p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {review.images.map((img, i) => (
                          <div key={i} className="w-16 h-16 rounded border overflow-hidden bg-gray-50">
                            <img src={img} alt="review" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Useful button */}
                    <div className="flex items-center space-x-4 pt-2.5 text-gray-400 text-[10px]">
                      <button className="flex items-center space-x-1 hover:text-gray-700 cursor-pointer">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Hữu ích ({review.likes})</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
