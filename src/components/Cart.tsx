import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Ticket, ShieldCheck, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { VOUCHERS } from '../data';

interface CartProps {
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    activeVoucher,
    applyVoucher,
    removeVoucher,
    setActiveTab
  } = useApp();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [voucherSuccess, setVoucherSuccess] = useState<string | null>(null);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;

    const res = applyVoucher(voucherInput);
    if (res.success) {
      setVoucherSuccess(res.message);
      setVoucherError(null);
      setVoucherInput('');
    } else {
      setVoucherError(res.message);
      setVoucherSuccess(null);
    }
  };

  const selectSuggestedVoucher = (code: string) => {
    const res = applyVoucher(code);
    if (res.success) {
      setVoucherSuccess(res.message);
      setVoucherError(null);
    } else {
      setVoucherError(res.message);
      setVoucherSuccess(null);
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Voucher discount calculation
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

  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <Trash2 className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Giỏ hàng của bạn còn trống</h2>
        <p className="text-sm text-gray-500 max-w-sm">Hãy quay lại trang chủ PK ĐIỆN TỬ - CAMERA và lấp đầy giỏ hàng của bạn bằng những sản phẩm tuyệt vời nhé!</p>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded font-semibold text-sm transition-all shadow-md cursor-pointer"
        >
          TIẾP TỤC MUA SẮM
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
        <button onClick={() => setActiveTab('home')} className="hover:text-[#059669] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang chủ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-12">
        {/* Left: Items list column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            {/* Store title group */}
            <div className="flex items-center space-x-2.5 pb-4 border-b border-gray-100">
              <input type="checkbox" defaultChecked className="accent-[#059669] w-4 h-4 cursor-pointer" />
              <span className="bg-[#047857] text-white font-extrabold text-[9px] uppercase px-1.5 py-0.2 rounded-xs">
                Mall
              </span>
              <span className="font-bold text-gray-800 text-sm">Gian Hàng PK ĐIỆN TỬ - CAMERA Chính Hãng</span>
            </div>

            {/* Cart items */}
            <div className="divide-y divide-gray-100">
              {cart.map((item) => {
                const rowTotal = item.product.price * item.quantity;
                return (
                  <div key={item.product.id + (item.selectedOption || '')} className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Item Checkbox & Image */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto shrink-0">
                      <input type="checkbox" defaultChecked className="accent-[#059669] w-4 h-4 cursor-pointer" />
                      <div className="w-20 h-20 rounded border border-gray-100 overflow-hidden bg-gray-50 relative">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>

                    {/* Item Description & Options */}
                    <div className="flex-grow flex-1 space-y-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-[#059669] cursor-pointer">
                        {item.product.name}
                      </h4>
                      {item.selectedOption && (
                        <p className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded inline-block">
                          Phân loại: <strong>{item.selectedOption}</strong>
                        </p>
                      )}
                    </div>

                    {/* Quantity Selector & Prices */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0">
                      {/* Price per unit */}
                      <div className="text-right sm:text-left">
                        <span className="text-gray-400 line-through text-[10px] block">
                          {item.product.originalPrice ? formatVND(item.product.originalPrice) : ''}
                        </span>
                        <span className="text-gray-700 font-bold text-xs">
                          {formatVND(item.product.price)}
                        </span>
                      </div>

                      {/* Quantity adjuster */}
                      <div className="flex items-center border border-gray-200 rounded text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedOption)}
                          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-semibold min-w-[30px] text-center text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedOption)}
                          className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Row Total */}
                      <span className="text-[#059669] font-bold text-xs sm:text-sm min-w-[85px] text-right">
                        {formatVND(rowTotal)}
                      </span>

                      {/* Delete item button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedOption)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-full cursor-pointer hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shop security guidelines */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg text-xs text-emerald-800 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Mọi giao dịch mua hàng tại đây đều được đảm bảo an toàn tuyệt đối, thanh toán trực tiếp khi nhận hàng COD thuận tiện.</span>
          </div>
        </div>

        {/* Right: Payment Summaries Column */}
        <div className="space-y-4">
          {/* Voucher Input Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h4 className="text-gray-800 font-bold text-sm flex items-center gap-1.5 pb-3 border-b border-gray-50">
              <Ticket className="w-4 h-4 text-[#059669]" />
              <span>Voucher Khuyến Mãi</span>
            </h4>

            {/* Form */}
            <form onSubmit={handleApplyVoucher} className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Nhập mã giảm giá..."
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-200 text-xs rounded uppercase outline-none focus:border-[#059669]"
              />
              <button
                type="submit"
                className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer transition-colors shrink-0"
              >
                Áp Dụng
              </button>
            </form>

            {/* Messages */}
            {voucherError && <p className="text-red-500 text-[11px] font-semibold mt-2">{voucherError}</p>}
            {voucherSuccess && <p className="text-emerald-600 text-[11px] font-semibold mt-2">{voucherSuccess}</p>}

            {/* Active code description display */}
            {activeVoucher && (
              <div className="mt-3.5 bg-emerald-50 border border-dashed border-emerald-200 p-2.5 rounded-sm flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#059669] flex items-center gap-1">
                    Đã áp dụng: {activeVoucher.code}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">{activeVoucher.description}</p>
                </div>
                <button
                  onClick={removeVoucher}
                  className="text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer hover:underline"
                >
                  Xóa
                </button>
              </div>
            )}

            {/* Quick list of available vouchers */}
            <div className="mt-4 pt-3.5 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Voucher Có Sẵn Cho Bạn:</p>
              <div className="space-y-2 mt-2 max-h-[160px] overflow-y-auto">
                {VOUCHERS.map((v) => {
                  const isApplied = activeVoucher?.code === v.code;
                  return (
                    <div 
                      key={v.code}
                      onClick={() => selectSuggestedVoucher(v.code)}
                      className={`p-2 rounded text-left border cursor-pointer transition-all flex justify-between items-center ${
                        isApplied 
                          ? 'border-[#059669] bg-emerald-50/20' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#059669]">{v.code}</span>
                          <span className="text-[10px] font-medium bg-emerald-50 text-[#059669] px-1 rounded">Săn Deal</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{v.description}</p>
                      </div>

                      {isApplied ? (
                        <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center text-white shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing breakdowns */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-xs text-gray-600 space-y-3">
            <h4 className="text-gray-800 font-bold text-sm pb-2 border-b border-gray-50">
              Tóm Tắt Đơn Hàng
            </h4>

            <div className="flex justify-between items-center">
              <span>Tổng số lượng sản phẩm:</span>
              <span className="font-semibold text-gray-800">{totalCartItems}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Tổng giá trị hàng hóa:</span>
              <span className="font-semibold text-gray-800">{formatVND(subtotal)}</span>
            </div>

            {activeVoucher && (
              <div className="flex justify-between items-center text-[#059669]">
                <span>Giảm giá từ Voucher ({activeVoucher.code}):</span>
                <span>-{formatVND(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="font-bold text-sm text-gray-800">Tạm tính:</span>
              <span className="text-[#059669] font-black text-lg">
                {formatVND(finalTotal)}
              </span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onCheckout}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3.5 rounded font-bold text-sm shadow-md hover:shadow-lg transition-all text-center uppercase tracking-wider cursor-pointer"
            >
              Tiến Hành Đặt Hàng
            </button>

            <p className="text-[10px] text-gray-400 text-center leading-normal">
              Bằng việc tiến hành đặt hàng, quý khách đồng ý rằng trang web này không xử lý thanh toán trực tuyến mà sử dụng COD hoặc chuyển khoản ngân hàng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
