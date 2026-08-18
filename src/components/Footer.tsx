import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  HelpCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageSquare,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setActivePolicyModal } = useApp();

  return (
    <footer id="main-footer" className="bg-gray-950 text-gray-300 text-xs mt-16 border-t border-gray-800">
      {/* Upper Footer Benefits */}
      <div className="border-b border-gray-800 bg-gray-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <button
            type="button"
            onClick={() => setActivePolicyModal('shipping')}
            className="flex items-center space-x-3 text-left hover:bg-gray-800/40 p-2 rounded-xl transition-all cursor-pointer"
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>GIAO HÀNG SIÊU TỐC</span>
              </h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Xem chính sách vận chuyển & cước phí 63 tỉnh.</p>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setActivePolicyModal('sales')}
            className="flex items-center space-x-3 text-left hover:bg-gray-800/40 p-2 rounded-xl transition-all cursor-pointer"
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>100% CHÍNH HÃNG</span>
              </h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Cam kết chất lượng & nguồn gốc từ chính hãng.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActivePolicyModal('warranty')}
            className="flex items-center space-x-3 text-left hover:bg-gray-800/40 p-2 rounded-xl transition-all cursor-pointer"
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>7 NGÀY ĐỔI TRẢ</span>
              </h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Lỗi 1 đổi 1 nhanh chóng theo quy định bảo hành.</p>
            </div>
          </button>

          <div className="flex items-center space-x-3 p-2">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">HỖ TRỢ 24/7 TẬN TÂM</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Hotline 1900 6789 & Chat trực tiếp kĩ thuật viên.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-[#059669] text-white p-1.5 rounded-lg shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-white">PK ĐIỆN TỬ - CAMERA</span>
          </div>
          <p className="text-gray-400 leading-relaxed text-[11px]">
            Chuyên cung cấp sỉ và lẻ các thiết bị điện tử thông minh, camera giám sát chất lượng cao, thiết bị mạng và các loại phụ kiện công nghệ chính hãng hàng đầu tại Việt Nam.
          </p>
          <div className="pt-2">
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kết Nối Với Chúng Tôi</span>
            <div className="flex items-center space-x-3">
              <a href="#facebook" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#instagram" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Hỗ Trợ Khách Hàng */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">CHÍNH SÁCH & QUY ĐỊNH</h4>
          <ul className="space-y-2 text-[11px] text-gray-400">
            <li>
              <button 
                type="button"
                onClick={() => setActivePolicyModal('sales')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>📜</span>
                <span>Chính Sách Bán Hàng & Quy Định Mua Hàng</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => setActivePolicyModal('shipping')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>🚚</span>
                <span>Chính Sách Vận Chuyển & Giao Nhận Toàn Quốc</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => setActivePolicyModal('warranty')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
              >
                <span>🛡️</span>
                <span>Chính Sách Bảo Hành & Đổi Trả (1-Đổi-1)</span>
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => setActivePolicyModal('sales')}
                className="hover:text-emerald-400 transition-colors text-left cursor-pointer flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Trung Tâm Trợ Giúp & Hướng Dẫn Mua Hàng</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Liên Hệ */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">THÔNG TIN LIÊN HỆ</h4>
          <ul className="space-y-2.5 text-[11px] text-gray-400">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Số 123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Hotline hỗ trợ: <strong className="text-emerald-400">1900 6789</strong> (8:00 - 21:00)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Email liên hệ: <strong className="text-gray-300 hover:text-emerald-400 cursor-pointer">support@pkdtcamera.vn</strong></span>
            </li>
          </ul>
        </div>

        {/* Col 4: Danh Mục Nổi Bật */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">SẢN PHẨM PHÂN PHỐI</h4>
          <ul className="space-y-2 text-[11px] text-gray-400">
            <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Camera Giám Sát Gia Đình</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Thiết Bị Điện Tử Thông Minh</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Phụ Kiện Điện Thoại & Laptop</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Cáp Sạc & Củ Sạc Đa Năng</span></li>
            <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Đầu Ghi & Thẻ Nhớ Camera Chuyên Dụng</span></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom copyright */}
      <div className="border-t border-gray-800 py-6 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] gap-4">
          <div>
            &copy; {new Date().getFullYear()} PK ĐIỆN TỬ - CAMERA. Tất cả quyền lợi được bảo lưu. Bản quyền thuộc về PK ĐIỆN TỬ - CAMERA.
          </div>
          <div className="flex space-x-4">
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Điều khoản dịch vụ</span>
            <span>&bull;</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Chính sách bảo mật</span>
            <span>&bull;</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Quản lý Cookie</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
