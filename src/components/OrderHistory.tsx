import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ArrowLeft, Calendar, FileText, CheckCircle2, RefreshCw, Building2, Truck } from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const { orders, setActiveTab } = useApp();

  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusBadge = (status: 'pending' | 'shipping' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-yellow-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
            Chờ xác nhận
          </span>
        );
      case 'shipping':
        return (
          <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
            Đang giao hàng
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
            Đã hoàn thành
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
            Đã hủy đơn
          </span>
        );
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Bạn chưa có đơn mua nào</h2>
        <p className="text-xs text-gray-500 max-w-sm">Mọi giao dịch đặt hàng bạn thực hiện trong phiên này sẽ xuất hiện tại đây để tiện theo dõi.</p>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-[#059669] hover:bg-[#047857] text-white px-5 py-2 rounded font-semibold text-xs tracking-wider uppercase shadow cursor-pointer"
        >
          Mua Sắm Ngay
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6 pb-12">
      {/* Header back */}
      <button 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#059669] mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Quay lại trang chủ</span>
      </button>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#059669]" />
          Lịch Sử Đơn Hàng ({orders.length})
        </h2>

        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-5 space-y-4">
            {/* Top row: Order ID, Date, status */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-50 pb-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-gray-800">Mã Đơn: #{order.id}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {order.date}
                </span>
              </div>
              <div className="self-start sm:self-auto">
                {getStatusBadge(order.status)}
              </div>
            </div>

            {/* List of items in order */}
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.product.id + (item.selectedOption || '')} className="py-3 flex items-start gap-3">
                  <div className="w-12 h-12 rounded border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-semibold text-gray-800 truncate">{item.product.name}</h4>
                    <p className="text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
                      {item.selectedOption && <span>Phân loại: <strong>{item.selectedOption}</strong></span>}
                      <span>Số lượng: x{item.quantity}</span>
                    </p>
                  </div>
                  <span className="text-gray-700 font-bold text-xs shrink-0 self-center">
                    {formatVND(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom summary and payment method info */}
            <div className="bg-gray-50/50 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-gray-600 border border-gray-100">
              <div className="space-y-1">
                <p>Thanh toán: <strong className="uppercase">{order.paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản MB Bank'}</strong></p>
                <p className="text-[11px] text-gray-500">
                  Người nhận: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone}) • {order.shippingAddress.city}
                </p>
                {order.warehouseOrigin && (
                  <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-emerald-600" />
                    <span>Kho xuất: {order.warehouseOrigin.name} ({order.warehouseOrigin.city}) • Tuyến ~{order.shippingDistanceKm} km {order.estimatedDelivery ? `(${order.estimatedDelivery})` : ''}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:items-end">
                <span className="text-gray-400 text-[10px]">Tổng thanh toán:</span>
                <span className="text-[#059669] font-black text-sm">{formatVND(order.finalAmount)}</span>
              </div>
            </div>

            {/* Delivery simulation indicator */}
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đơn hàng đang chờ xác nhận đóng gói. Shop sẽ liên hệ với bạn trong vòng 2 giờ.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
