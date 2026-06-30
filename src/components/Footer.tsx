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
  const { setActiveTab } = useApp();

  return (
    <footer id="main-footer" className="bg-gray-950 text-gray-300 text-xs mt-16 border-t border-gray-800">
      {/* Upper Footer Benefits */}
      <div className="border-b border-gray-800 bg-gray-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">GIAO HÀNG SIÊU TỐC</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Đặt hàng nhận ngay trong vòng 2-4 ngày trên toàn quốc.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% CHÍNH HÃNG</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Cam kết các thiết bị & phụ kiện camera chính hãng uy tín.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">7 NGÀY ĐỔI TRẢ</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Bảo hành lỗi 1 đổi 1 nhanh chóng nếu có lỗi nhà sản xuất.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 border border-emerald-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">HỖ TRỢ 24/7 TẬN TÂM</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Liên hệ hotline hoặc Chat trực tiếp để được tư vấn kĩ thuật.</p>
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
          <h4 className="font-bold text-sm text-white uppercase tracking-wider border-l-2 border-emerald-500 pl-2">HỖ TRỢ KHÁCH HÀNG</h4>
          <ul className="space-y-2 text-[11px] text-gray-400">
            <li><a href="#help" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> Trung Tâm Trợ Giúp</a></li>
            <li><a href="#shipping" className="hover:text-emerald-400 transition-colors">Chính Sách Vận Chuyển</a></li>
            <li><a href="#return" className="hover:text-emerald-400 transition-colors">Chính Sách Trả Hàng & Hoàn Tiền</a></li>
            <li><a href="#warranty" className="hover:text-emerald-400 transition-colors">Chính Sách Bảo Hành Thiết Bị</a></li>
            <li><a href="#buyer-protection" className="hover:text-emerald-400 transition-colors">Cẩm Nang Mua Hàng An Toàn</a></li>
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
