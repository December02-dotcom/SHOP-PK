import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShippingAddress, Order } from '../types';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  BadgeCheck, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ClipboardCheck
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, activeVoucher, createOrder, setActiveTab } = useApp();

  // Prefilled address defaults for easy testing
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Lê Hoài Nam',
    phone: '0987654321',
    city: 'Thành phố Hà Nội',
    district: 'Quận Cầu Giấy',
    ward: 'Phường Dịch Vọng Hậu',
    street: 'Số 144 đường Xuân Thủy'
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'saver'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.city || !address.district || !address.ward || !address.street) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    const order = createOrder(address, shippingMethod, paymentMethod);
    setPlacedOrder(order);
  };

  const handleFinishCheckout = () => {
    onClose();
    setActiveTab('orders'); // Jump to simulated order history
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Shipping cost
  let shippingFee = 30000;
  if (shippingMethod === 'express') shippingFee = 55000;
  if (shippingMethod === 'saver') shippingFee = 15000;

  // Voucher calculation
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

  if (activeVoucher?.code === 'FRESESHIP') {
    discountAmount = Math.min(shippingFee, 25000);
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  // Success view
  if (placedOrder) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl p-6 md:p-8 text-center space-y-5 animate-fade-in my-auto">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Đặt Hàng Thành Công!</h2>
            <p className="text-xs text-gray-500 leading-normal">
              Cảm ơn quý khách đã tin tưởng và mua hàng tại PK ĐIỆN TỬ - CAMERA. Mã đơn hàng của bạn là <strong className="text-gray-800 font-bold">{placedOrder.id}</strong>.
            </p>
          </div>

          {/* Payment detail summary block */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-left text-xs text-gray-600 space-y-2.5">
            <p className="font-bold text-gray-800 border-b border-gray-200/60 pb-1.5 flex items-center gap-1">
              <ClipboardCheck className="w-4 h-4 text-[#059669]" />
              Chi Tiết Đơn Hàng
            </p>
            <div className="flex justify-between">
              <span>Người nhận hàng:</span>
              <strong className="text-gray-800 font-bold">{placedOrder.shippingAddress.fullName} ({placedOrder.shippingAddress.phone})</strong>
            </div>
            <div className="flex justify-between">
              <span>Địa chỉ giao hàng:</span>
              <span className="text-gray-800 font-semibold text-right max-w-[240px] truncate">
                {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.ward}, {placedOrder.shippingAddress.district}, {placedOrder.shippingAddress.city}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phương thức:</span>
              <span className="text-gray-800 font-semibold uppercase">{placedOrder.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản trực tiếp'}</span>
            </div>
            <div className="flex justify-between text-[#059669] font-bold text-sm pt-1.5 border-t border-gray-200/60">
              <span>Tổng thanh toán:</span>
              <span>{formatVND(placedOrder.finalAmount)}</span>
            </div>
          </div>

          {/* Bank Transfer Instructions if selected */}
          {placedOrder.paymentMethod === 'bank_transfer' && (
            <div className="bg-emerald-50 border border-dashed border-emerald-200 p-4 rounded-lg text-left text-[11px] text-gray-700 space-y-2">
              <p className="font-bold text-emerald-800 text-xs">Thông Tin Chuyển Khoản Ngân Hàng:</p>
              <p>Vui lòng chuyển khoản đúng số tiền để hệ thống xác nhận tự động:</p>
              <div className="grid grid-cols-2 gap-y-1 bg-white p-2 border border-emerald-100 rounded">
                <span>Ngân hàng:</span>
                <strong className="text-gray-800 font-semibold">MB Bank (Quân Đội)</strong>
                <span>Số tài khoản:</span>
                <strong className="text-gray-800 font-semibold">12345678910</strong>
                <span>Chủ tài khoản:</span>
                <strong className="text-gray-800 font-semibold">LE HOAI NAM</strong>
                <span>Nội dung chuyển khoản:</span>
                <strong className="text-[#059669] font-semibold">{placedOrder.id}</strong>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleFinishCheckout}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3 rounded-md font-bold text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer"
            >
              Xem Lịch Sử Đơn Hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-[#f5f5f5] w-full max-w-3xl rounded-lg shadow-2xl relative overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2 font-bold text-gray-800 text-sm">
            <ShoppingBag className="w-4 h-4 text-[#059669]" />
            <span>Thanh Toán Đơn Hàng</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handlePlaceOrderSubmit} className="overflow-y-auto max-h-[80vh] p-4 space-y-4">
          
          {/* Section 1: Address */}
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2.5">
              <MapPin className="w-4 h-4 text-[#059669]" />
              <span>Địa Chỉ Nhận Hàng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-500 font-medium">Họ và Tên người nhận</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#059669]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-500 font-medium">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={address.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#059669]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-500 font-medium">Tỉnh / Thành phố</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#059669]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-500 font-medium">Quận / Huyện</label>
                <input
                  type="text"
                  name="district"
                  required
                  value={address.district}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#059669]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-500 font-medium">Phường / Xã</label>
                <input
                  type="text"
                  name="ward"
                  required
                  value={address.ward}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#059669]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-500 font-medium">Số nhà, tên đường</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded outline-none focus:border-[#059669]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Carrier Options */}
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2.5">
              <Truck className="w-4 h-4 text-[#059669]" />
              <span>Đơn Vị Vận Chuyển</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Option Standard */}
              <label className={`p-3 border rounded-lg cursor-pointer flex flex-col justify-between transition-all ${
                shippingMethod === 'standard'
                  ? 'border-[#059669] bg-emerald-50/20 text-[#059669]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Vận chuyển Nhanh</span>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-[#059669] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">Nhận hàng trong 2-3 ngày làm việc thông thường.</p>
                <span className="font-bold mt-2.5">{formatVND(30000)}</span>
              </label>

              {/* Option Express */}
              <label className={`p-3 border rounded-lg cursor-pointer flex flex-col justify-between transition-all ${
                shippingMethod === 'express'
                  ? 'border-[#059669] bg-emerald-50/20 text-[#059669]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Hỏa Tốc (Grab/Aha)</span>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="accent-[#059669] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">Nhận hàng ngay lập tức trong vòng 2 giờ đồng hồ.</p>
                <span className="font-bold mt-2.5">{formatVND(55000)}</span>
              </label>

              {/* Option Saver */}
              <label className={`p-3 border rounded-lg cursor-pointer flex flex-col justify-between transition-all ${
                shippingMethod === 'saver'
                  ? 'border-[#059669] bg-emerald-50/20 text-[#059669]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Tiết Kiệm (Bưu Điện)</span>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'saver'}
                    onChange={() => setShippingMethod('saver')}
                    className="accent-[#059669] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">Nhận hàng từ 4-6 ngày, tiết kiệm tối đa cước phí.</p>
                <span className="font-bold mt-2.5">{formatVND(15000)}</span>
              </label>
            </div>
          </div>

          {/* Section 3: Non-payment methods options */}
          <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2.5">
              <CreditCard className="w-4 h-4 text-[#059669]" />
              <span>Phương Thức Thanh Toán</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className={`p-3 border rounded-lg cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#059669] bg-emerald-50/20 text-[#059669]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Thanh toán khi nhận hàng (COD)</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#059669] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">Hỗ trợ thanh toán tiền mặt trực tiếp cho shipper khi nhận được hàng.</p>
              </label>

              <label className={`p-3 border rounded-lg cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'bank_transfer'
                  ? 'border-[#059669] bg-emerald-50/20 text-[#059669]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Chuyển khoản trực tiếp</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="accent-[#059669] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">Nhận thông tin MB Bank MB-247 và thanh toán online trước.</p>
              </label>
            </div>
          </div>

          {/* Section 4: Cost Breakdowns */}
          <div className="bg-white p-4 rounded-lg shadow-sm text-xs text-gray-600 space-y-2.5">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider pb-2 border-b border-gray-100">
              Chi Tiết Thanh Toán
            </h3>
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span className="font-semibold text-gray-800">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-gray-800">{formatVND(shippingFee)}</span>
            </div>
            {activeVoucher && (
              <div className="flex justify-between text-[#059669]">
                <span>Mã giảm giá đã áp dụng ({activeVoucher.code}):</span>
                <span className="font-semibold">-{formatVND(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#059669] font-black text-sm pt-2 border-t border-gray-100">
              <span>Tổng thanh toán cuối cùng:</span>
              <span>{formatVND(finalTotal)}</span>
            </div>
          </div>

          {/* Place order trigger */}
          <div className="pt-2 text-right">
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] text-white px-8 py-3.5 rounded font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Xác Nhận Đặt Hàng (Xử Lý COD)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
