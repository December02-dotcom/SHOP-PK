import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShippingAddress, Order, BankAccount } from '../types';
import { 
  calculateShippingEstimate, 
  VN_PROVINCES, 
  DEFAULT_BANK_ACCOUNTS, 
  getVietQRUrl 
} from '../utils/shipping';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ShoppingBag,
  ClipboardCheck,
  Building2,
  Zap,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, activeVoucher, createOrder, setActiveTab, warehouse } = useApp();

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
  const [selectedBankIndex, setSelectedBankIndex] = useState<number>(0);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Real-time Dynamic Shipping Calculation based on Warehouse and Destination
  const shippingEstimate = useMemo(() => {
    return calculateShippingEstimate(warehouse, address, subtotal, shippingMethod);
  }, [warehouse, address, subtotal, shippingMethod]);

  const shippingFee = shippingEstimate.selectedFee;
  const originalShippingFee = shippingEstimate.originalFee;

  // Auto-switch away from express if not allowed for distance
  React.useEffect(() => {
    if (shippingMethod === 'express' && !shippingEstimate.expressAllowed) {
      setShippingMethod('standard');
    }
  }, [shippingEstimate.expressAllowed, shippingMethod]);

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

  // Bank accounts list from warehouse config (max 3)
  const bankAccounts: BankAccount[] = useMemo(() => {
    if (warehouse.bankAccounts && warehouse.bankAccounts.length > 0) {
      return warehouse.bankAccounts;
    }
    return DEFAULT_BANK_ACCOUNTS;
  }, [warehouse.bankAccounts]);

  const activeBank = bankAccounts[selectedBankIndex] || bankAccounts[0];

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.city || !address.district || !address.ward || !address.street) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder(address, shippingMethod, paymentMethod);
      setPlacedOrder(order);
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishCheckout = () => {
    onClose();
    setActiveTab('orders'); // Jump to order history
  };

  // Success view
  if (placedOrder) {
    const successBank = activeBank;
    const qrSuccessUrl = successBank.qrImageUrl?.trim() 
      ? successBank.qrImageUrl 
      : getVietQRUrl(successBank.bankCode, successBank.accountNumber, successBank.accountHolder, placedOrder.finalAmount, placedOrder.id);

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5 sm:p-7 text-center space-y-4 animate-fade-in my-auto border border-gray-100">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-tight">Đặt Hàng Thành Công!</h2>
            <p className="text-xs text-gray-500 leading-normal">
              Mã đơn hàng: <strong className="text-emerald-700 font-extrabold text-sm">{placedOrder.id}</strong>
            </p>
          </div>

          {/* Payment and Shipping detail summary block */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 text-left text-xs text-gray-600 space-y-2">
            <p className="font-bold text-gray-800 border-b border-gray-200 pb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-[#059669]" />
                Chi Tiết Đơn Hàng & Vận Chuyển
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                {placedOrder.status === 'pending' ? 'Chờ xác nhận' : placedOrder.status}
              </span>
            </p>

            <div className="flex justify-between">
              <span>Người nhận:</span>
              <strong className="text-gray-800 font-bold">{placedOrder.shippingAddress.fullName} ({placedOrder.shippingAddress.phone})</strong>
            </div>

            <div className="flex justify-between">
              <span>Địa chỉ:</span>
              <span className="text-gray-800 font-semibold text-right max-w-[220px] truncate">
                {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.ward}, {placedOrder.shippingAddress.district}, {placedOrder.shippingAddress.city}
              </span>
            </div>

            {/* Warehouse origin & route summary */}
            {placedOrder.warehouseOrigin && (
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-emerald-900 font-bold">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    Kho xuất: {placedOrder.warehouseOrigin.name}
                  </span>
                  <span>~{placedOrder.shippingDistanceKm} km</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Hình thức: {placedOrder.shippingMethod === 'express' ? 'Hỏa Tốc (2H)' : placedOrder.shippingMethod === 'saver' ? 'Tiết Kiệm' : 'Nhanh (Tiêu Chuẩn)'}</span>
                  <span>Dự kiến: {placedOrder.estimatedDelivery}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <span>Thanh toán:</span>
              <span className="text-gray-800 font-semibold uppercase">{placedOrder.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản trực tiếp'}</span>
            </div>

            <div className="flex justify-between text-[#059669] font-bold text-sm pt-2 border-t border-gray-200">
              <span>Tổng thanh toán:</span>
              <span>{formatVND(placedOrder.finalAmount)}</span>
            </div>
          </div>

          {/* Bank Transfer Instructions & Dynamic QR Code if selected */}
          {placedOrder.paymentMethod === 'bank_transfer' && (
            <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-blue-50/40 border border-emerald-200 p-4 rounded-xl text-left space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  Quét Mã QR Chuyển Khoản Ngân Hàng 24/7
                </p>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Xác nhận tự động
                </span>
              </div>

              {/* Bank Selector tabs on Success screen if multiple accounts exist */}
              {bankAccounts.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {bankAccounts.map((b, idx) => (
                    <button
                      key={b.id || idx}
                      type="button"
                      onClick={() => setSelectedBankIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedBankIndex === idx 
                          ? 'bg-emerald-700 text-white shadow-sm' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {b.bankName}
                    </button>
                  ))}
                </div>
              )}

              {/* QR Image and Detail Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-white p-3 rounded-xl border border-emerald-100">
                {/* QR Code */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                    <img
                      src={qrSuccessUrl}
                      alt={`QR ${successBank.bankName}`}
                      className="w-32 h-32 object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as any).src = 'https://placehold.co/200?text=VietQR';
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1">Quét bằng mọi App Ngân Hàng</span>
                </div>

                {/* Account info with Copy buttons */}
                <div className="sm:col-span-2 space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Ngân hàng thụ hưởng:</span>
                    <strong className="text-gray-800 font-bold text-xs">{successBank.bankName}</strong>
                    {successBank.branch && <span className="text-[10px] text-gray-400 block">{successBank.branch}</span>}
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Số tài khoản:</span>
                      <strong className="text-emerald-700 font-mono font-extrabold text-sm">{successBank.accountNumber}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(successBank.accountNumber, 'success_stk')}
                      className="p-1.5 text-gray-500 hover:text-emerald-700 rounded bg-white border border-gray-200 hover:border-emerald-300 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    >
                      {copiedKey === 'success_stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'success_stk' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 block">Chủ tài khoản:</span>
                    <strong className="text-gray-800 uppercase font-bold text-xs">{successBank.accountHolder}</strong>
                  </div>

                  <div className="flex items-center justify-between bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Nội dung chuyển khoản (Bắt buộc):</span>
                      <strong className="text-emerald-800 font-mono font-black text-xs">{placedOrder.id}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(placedOrder.id, 'success_memo')}
                      className="p-1.5 text-emerald-700 hover:text-emerald-900 rounded bg-white border border-emerald-200 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    >
                      {copiedKey === 'success_memo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'success_memo' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleFinishCheckout}
              className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
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
      <div className="bg-[#f8f9fa] w-full max-w-3xl rounded-2xl shadow-2xl relative overflow-hidden flex flex-col my-auto border border-gray-100">
        
        {/* Header */}
        <div className="bg-white px-5 py-3.5 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2 font-bold text-gray-800 text-sm">
            <ShoppingBag className="w-4 h-4 text-[#059669]" />
            <span>Thanh Toán Đơn Hàng & Ước Lượng Phí Giao Hàng</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handlePlaceOrderSubmit} className="overflow-y-auto max-h-[82vh] p-4 sm:p-5 space-y-4">
          
          {/* Dynamic Warehouse Origin & Route Calculation Banner */}
          <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#059669]" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Tuyến Giao Hàng Từ Kho
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {shippingEstimate.regionLabel}
              </span>
            </div>

            {/* Visual Route Flow */}
            <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-emerald-50/70 p-3 rounded-lg border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-gray-500 font-medium">🏬 Kho xuất hàng (Admin set):</span>
                <p className="font-bold text-gray-800">{warehouse.name}</p>
                <p className="text-[11px] text-gray-500">{warehouse.district}, {warehouse.city}</p>
              </div>

              <div className="flex sm:flex-col items-center justify-center gap-1 sm:gap-0 px-2 py-1 bg-white sm:bg-transparent rounded border sm:border-0 border-emerald-100 text-center w-full sm:w-auto">
                <span className="text-[11px] font-extrabold text-emerald-700">~{shippingEstimate.distanceKm} km</span>
                <ArrowRight className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] text-gray-400">khoảng cách địa lý</span>
              </div>

              <div className="space-y-0.5 text-left sm:text-right">
                <span className="text-[10px] text-gray-500 font-medium">📍 Điểm nhận hàng của khách:</span>
                <p className="font-bold text-gray-800">{address.city || 'Chưa chọn tỉnh thành'}</p>
                <p className="text-[11px] text-gray-500">{address.district || 'Chọn quận/huyện bên dưới'}</p>
              </div>
            </div>

            {shippingEstimate.isFreeShip && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 p-2 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Đơn hàng từ {formatVND(warehouse.freeShipThreshold)}: Tự động miễn phí ship (giảm cước)!</span>
              </div>
            )}
          </div>

          {/* Section 1: Customer Address */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
              <MapPin className="w-4 h-4 text-[#059669]" />
              <span>1. Thông Tin Người Nhận & Địa Chỉ Giao Hàng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-600 font-bold">Họ và tên người nhận *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-600 font-bold">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={address.phone}
                  onChange={handleInputChange}
                  placeholder="0987654321"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-medium"
                />
              </div>

              {/* Province Selector */}
              <div className="space-y-1">
                <label className="text-gray-600 font-bold">Tỉnh / Thành phố *</label>
                <select
                  name="city"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-medium bg-white cursor-pointer"
                >
                  <option value="">-- Chọn Tỉnh / Thành Phố --</option>
                  {VN_PROVINCES.map((prov) => (
                    <option key={prov.name} value={prov.name}>
                      {prov.name} ({prov.region === 'North' ? 'Miền Bắc' : prov.region === 'Central' ? 'Miền Trung' : 'Miền Nam'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-600 font-bold">Quận / Huyện *</label>
                <input
                  type="text"
                  name="district"
                  required
                  value={address.district}
                  onChange={handleInputChange}
                  placeholder="Quận Cầu Giấy"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-600 font-bold">Phường / Xã *</label>
                <input
                  type="text"
                  name="ward"
                  required
                  value={address.ward}
                  onChange={handleInputChange}
                  placeholder="Phường Dịch Vọng Hậu"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-600 font-bold">Số nhà, tên đường chi tiết *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  placeholder="Số 144 đường Xuân Thủy"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Carrier Options */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#059669]" />
                <span>2. Chọn Phương Thức Vận Chuyển</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-medium">Cước tính theo khoảng cách</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Option 1: Standard */}
              <label className={`p-3.5 border rounded-xl cursor-pointer flex flex-col justify-between transition-all relative ${
                shippingMethod === 'standard'
                  ? 'border-[#059669] bg-emerald-50/30 ring-1 ring-[#059669]'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <div>
                  <div className="flex items-center justify-between font-bold text-gray-800">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      Giao Nhanh
                    </span>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-[#059669] cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>Dự kiến: {shippingEstimate.estimatedDeliveryTimes.standard}</span>
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Cước phí:</span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {formatVND(shippingEstimate.rates.standard)}
                  </span>
                </div>
              </label>

              {/* Option 2: Express (2H) */}
              <label className={`p-3.5 border rounded-xl flex flex-col justify-between transition-all relative ${
                !shippingEstimate.expressAllowed
                  ? 'opacity-50 border-gray-200 bg-gray-50 cursor-not-allowed'
                  : shippingMethod === 'express'
                  ? 'border-purple-600 bg-purple-50/30 ring-1 ring-purple-600 cursor-pointer'
                  : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
              }`}>
                <div>
                  <div className="flex items-center justify-between font-bold text-gray-800">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-purple-600" />
                      Hỏa Tốc (2H)
                    </span>
                    <input
                      type="radio"
                      name="shipping"
                      disabled={!shippingEstimate.expressAllowed}
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-purple-600 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>
                      {shippingEstimate.expressAllowed 
                        ? shippingEstimate.estimatedDeliveryTimes.express 
                        : `Chỉ hỗ trợ cự ly ≤ ${warehouse.expressMaxDistanceKm || 35}km`}
                    </span>
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Cước phí:</span>
                  {shippingEstimate.expressAllowed && shippingEstimate.rates.express ? (
                    <span className="font-extrabold text-purple-700 text-sm">
                      {formatVND(shippingEstimate.rates.express)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-500 font-bold">Không khả dụng</span>
                  )}
                </div>
              </label>

              {/* Option 3: Saver */}
              <label className={`p-3.5 border rounded-xl cursor-pointer flex flex-col justify-between transition-all relative ${
                shippingMethod === 'saver'
                  ? 'border-teal-600 bg-teal-50/30 ring-1 ring-teal-600'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <div>
                  <div className="flex items-center justify-between font-bold text-gray-800">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-teal-600" />
                      Tiết Kiệm
                    </span>
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'saver'}
                      onChange={() => setShippingMethod('saver')}
                      className="accent-teal-600 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>Dự kiến: {shippingEstimate.estimatedDeliveryTimes.saver}</span>
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Cước phí:</span>
                  <span className="font-extrabold text-teal-700 text-sm">
                    {formatVND(shippingEstimate.rates.saver)}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method with Bank Transfer & QR Code Integration */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2.5">
              <CreditCard className="w-4 h-4 text-[#059669]" />
              <span>3. Phương Thức Thanh Toán</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className={`p-3.5 border rounded-xl cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#059669] bg-emerald-50/20 ring-1 ring-[#059669]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
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
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                  Kiểm tra hàng rồi thanh toán tiền mặt trực tiếp cho shipper khi nhận hàng.
                </p>
              </label>

              <label className={`p-3.5 border rounded-xl cursor-pointer flex flex-col justify-between transition-all ${
                paymentMethod === 'bank_transfer'
                  ? 'border-[#059669] bg-emerald-50/20 ring-1 ring-[#059669]'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Chuyển khoản trực tiếp (Quét QR 24/7)</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="accent-[#059669] cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                  Quét mã VietQR nhận hàng ưu tiên và hệ thống xác nhận thanh toán tự động.
                </p>
              </label>
            </div>

            {/* Bank Transfer Interactive QR Box inside form */}
            {paymentMethod === 'bank_transfer' && (
              <div className="mt-3 p-4 bg-gradient-to-br from-emerald-50/80 via-teal-50/30 to-blue-50/30 rounded-xl border border-emerald-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    Chọn Tài Khoản & Quét Mã QR Chuyển Khoản:
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {bankAccounts.length} Tài khoản khả dụng
                  </span>
                </div>

                {/* Account Selection Tabs (up to 3) */}
                {bankAccounts.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {bankAccounts.map((b, idx) => (
                      <button
                        key={b.id || idx}
                        type="button"
                        onClick={() => setSelectedBankIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedBankIndex === idx 
                            ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{b.bankName}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Bank Details & QR Display */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                      <img
                        src={activeBank.qrImageUrl?.trim() ? activeBank.qrImageUrl : getVietQRUrl(activeBank.bankCode, activeBank.accountNumber, activeBank.accountHolder, finalTotal, 'DH_DON_HANG')}
                        alt={`QR ${activeBank.bankName}`}
                        className="w-32 h-32 object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as any).src = 'https://placehold.co/200?text=VietQR';
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1">Mã QR tự động cập nhật số tiền</span>
                  </div>

                  <div className="sm:col-span-2 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Ngân hàng:</span>
                      <strong className="text-gray-800 font-bold">{activeBank.bankName}</strong>
                      {activeBank.branch && <span className="text-[10px] text-gray-400 block">{activeBank.branch}</span>}
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Số tài khoản:</span>
                        <strong className="text-emerald-700 font-mono font-extrabold text-sm">{activeBank.accountNumber}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(activeBank.accountNumber, 'form_stk')}
                        className="p-1.5 text-gray-500 hover:text-emerald-700 rounded bg-white border border-gray-200 hover:border-emerald-300 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                      >
                        {copiedKey === 'form_stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'form_stk' ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block">Tên chủ tài khoản:</span>
                      <strong className="text-gray-800 uppercase font-bold">{activeBank.accountHolder}</strong>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
                      <span className="text-gray-500">Số tiền cần chuyển:</span>
                      <strong className="text-emerald-700 font-black text-sm">{formatVND(finalTotal)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Cost Breakdowns */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm text-xs text-gray-600 space-y-2.5">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider pb-2 border-b border-gray-100">
              Chi Tiết Thanh Toán
            </h3>
            
            <div className="flex justify-between">
              <span>Tổng tiền hàng ({cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm):</span>
              <span className="font-semibold text-gray-800">{formatVND(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span>Phí vận chuyển ước tính (~{shippingEstimate.distanceKm} km):</span>
                <span className="text-[10px] text-gray-400 block font-normal">
                  Kho xuất: {warehouse.name}
                </span>
              </div>
              <div className="text-right">
                {shippingEstimate.isFreeShip ? (
                  <div>
                    <span className="line-through text-gray-400 text-[11px] mr-1">{formatVND(originalShippingFee)}</span>
                    <span className="font-bold text-emerald-600">{formatVND(shippingFee)}</span>
                  </div>
                ) : (
                  <span className="font-semibold text-gray-800">{formatVND(shippingFee)}</span>
                )}
              </div>
            </div>

            {shippingEstimate.isFreeShip && (
              <div className="flex justify-between text-emerald-600 text-[11px]">
                <span>Ưu đãi Miễn phí vận chuyển:</span>
                <span className="font-bold">-{formatVND(originalShippingFee - shippingFee)}</span>
              </div>
            )}

            {activeVoucher && (
              <div className="flex justify-between text-[#059669]">
                <span>Mã voucher giảm giá ({activeVoucher.code}):</span>
                <span className="font-bold">-{formatVND(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#059669] font-black text-sm pt-2.5 border-t border-gray-100">
              <span>Tổng thanh toán cuối cùng:</span>
              <span className="text-base">{formatVND(finalTotal)}</span>
            </div>
          </div>

          {/* Place order trigger */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo mật thông tin thanh toán & cam kết chính hãng 100%</span>
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
