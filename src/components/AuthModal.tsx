import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Mail, Lock, Phone, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register, setCurrentUser } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg('Đăng nhập thành công!');
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setError(res.message);
        }
      } else {
        const res = await register(name, email, phone, password);
        if (res.success) {
          setSuccessMsg('Đăng ký tài khoản thành công!');
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError('Đã có lỗi xảy ra kết nối Web Server. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setTab('login');
    setEmail('khachhang@gmail.com');
    setPassword('123456');
    setError(null);
  };

  const fillDemoAdmin = () => {
    setTab('login');
    setEmail('admin@pkdientu.vn');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100 transform transition-all scale-100">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#059669] to-[#047857] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
            <h3 className="text-xl font-extrabold tracking-tight">
              {tab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Khách Hàng'}
            </h3>
          </div>
          <p className="text-xs text-emerald-100">
            Tài khoản lưu trữ bảo mật trực tiếp trên Web Server
          </p>

          {/* Quick Tabs Switcher */}
          <div className="flex bg-emerald-950/20 p-1 rounded-xl mt-4 border border-emerald-400/30 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'login' ? 'bg-white text-[#059669] shadow-md' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'register' ? 'bg-white text-[#059669] shadow-md' : 'text-emerald-100 hover:text-white'
              }`}
            >
              Đăng Ký
            </button>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Họ và Tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#059669] outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {tab === 'login' ? 'Email / Tên đăng nhập / SĐT' : 'Địa chỉ Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder={tab === 'login' ? 'khachhang@gmail.com' : 'email@domain.com'}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#059669] outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  placeholder="0912345678"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#059669] outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-[#059669] outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>{tab === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-3 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 mb-2 font-medium">Bấm nhanh để thử nghiệm tài khoản mẫu:</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <UserCheck className="w-3 h-3" />
                <span>Khách Hàng Mẫu</span>
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded border border-amber-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Mẫu</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
