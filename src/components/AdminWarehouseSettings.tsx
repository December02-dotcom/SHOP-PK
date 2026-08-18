import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WarehouseConfig, ShippingAddress, BankAccount } from '../types';
import { 
  VN_PROVINCES, 
  PRESET_WAREHOUSES, 
  SUPPORTED_BANKS,
  DEFAULT_BANK_ACCOUNTS,
  calculateShippingEstimate, 
  findProvince,
  getVietQRUrl 
} from '../utils/shipping';
import { 
  Building2, 
  MapPin, 
  Truck, 
  Zap, 
  Coins, 
  Check, 
  RotateCcw, 
  Calculator, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  Sparkles,
  Phone,
  CreditCard,
  QrCode,
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  FileText,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { getEmbeddableGoogleDriveUrl } from '../utils/googleDrive';

export const AdminWarehouseSettings: React.FC = () => {
  const { warehouse, updateWarehouse } = useApp();

  const [form, setForm] = useState<WarehouseConfig>(() => ({
    ...warehouse,
    bankAccounts: warehouse.bankAccounts && warehouse.bankAccounts.length > 0 
      ? warehouse.bankAccounts 
      : DEFAULT_BANK_ACCOUNTS
  }));

  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Live test calculation state
  const [testProvince, setTestProvince] = useState<string>('TP. Hồ Chí Minh');
  const [testSubtotal, setTestSubtotal] = useState<number>(350000);
  const [testBankIndex, setTestBankIndex] = useState<number>(0);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Sync form when warehouse changes
  useEffect(() => {
    setForm({
      ...warehouse,
      bankAccounts: warehouse.bankAccounts && warehouse.bankAccounts.length > 0 
        ? warehouse.bankAccounts 
        : DEFAULT_BANK_ACCOUNTS
    });
    const matchedPreset = PRESET_WAREHOUSES.find(
      (p) => p.config.city === warehouse.city && p.config.district === warehouse.district
    );
    if (matchedPreset) {
      setSelectedPresetId(matchedPreset.id);
    } else {
      setSelectedPresetId('');
    }
  }, [warehouse]);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = PRESET_WAREHOUSES.find((p) => p.id === presetId);
    if (found) {
      setForm({ 
        ...found.config,
        bankAccounts: form.bankAccounts && form.bankAccounts.length > 0 
          ? form.bankAccounts 
          : DEFAULT_BANK_ACCOUNTS
      });
    }
  };

  const handleCityChange = (cityName: string) => {
    const matched = findProvince(cityName);
    setForm((prev) => ({
      ...prev,
      city: cityName,
      latitude: matched?.lat || prev.latitude,
      longitude: matched?.lng || prev.longitude
    }));
    setSelectedPresetId('');
  };

  // --- Bank Account Management Handlers (Max 3) ---
  const handleAddBankAccount = () => {
    const currentAccounts = form.bankAccounts || [];
    if (currentAccounts.length >= 3) {
      alert('Hệ thống cho phép cấu hình tối đa 3 tài khoản ngân hàng nhận tiền chuyển khoản!');
      return;
    }

    const newAcc: BankAccount = {
      id: 'bank_' + Date.now(),
      bankName: 'MB Bank (Quân Đội)',
      bankCode: 'MB',
      accountNumber: '',
      accountHolder: 'LE HOAI NAM',
      branch: 'Chi nhánh Hà Nội',
      qrImageUrl: '',
      isDefault: currentAccounts.length === 0
    };

    setForm((prev) => ({
      ...prev,
      bankAccounts: [...(prev.bankAccounts || []), newAcc]
    }));
  };

  const handleRemoveBankAccount = (index: number) => {
    const currentAccounts = [...(form.bankAccounts || [])];
    if (currentAccounts.length <= 1) {
      alert('Bạn cần duy trì ít nhất 1 tài khoản ngân hàng nhận thanh toán chuyển khoản!');
      return;
    }
    currentAccounts.splice(index, 1);
    // If we removed the default one, set the first one as default
    if (!currentAccounts.some(a => a.isDefault) && currentAccounts.length > 0) {
      currentAccounts[0].isDefault = true;
    }
    setForm((prev) => ({ ...prev, bankAccounts: currentAccounts }));
    if (testBankIndex >= currentAccounts.length) {
      setTestBankIndex(0);
    }
  };

  const handleBankAccountChange = (index: number, field: keyof BankAccount, value: any) => {
    const currentAccounts = [...(form.bankAccounts || [])];
    if (!currentAccounts[index]) return;

    if (field === 'bankCode') {
      const matched = SUPPORTED_BANKS.find(b => b.code === value);
      currentAccounts[index] = {
        ...currentAccounts[index],
        bankCode: value,
        bankName: matched ? `${matched.shortName}` : currentAccounts[index].bankName
      };
    } else if (field === 'accountHolder') {
      currentAccounts[index] = {
        ...currentAccounts[index],
        accountHolder: String(value).toUpperCase()
      };
    } else if (field === 'isDefault') {
      currentAccounts.forEach((acc, i) => {
        acc.isDefault = (i === index);
      });
    } else {
      currentAccounts[index] = {
        ...currentAccounts[index],
        [field]: value
      };
    }

    setForm((prev) => ({ ...prev, bankAccounts: currentAccounts }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateWarehouse(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Run live test estimate
  const sampleCustomerAddress: ShippingAddress = {
    fullName: 'Khách Hàng Thử Nghiệm',
    phone: '0987654321',
    city: testProvince,
    district: 'Trung Tâm',
    ward: 'Phường 1',
    street: '123 Đường Mẫu'
  };

  const testEstimate = calculateShippingEstimate(form, sampleCustomerAddress, testSubtotal, 'standard');
  const accountsList = form.bankAccounts && form.bankAccounts.length > 0 ? form.bankAccounts : DEFAULT_BANK_ACCOUNTS;
  const currentTestBank = accountsList[testBankIndex] || accountsList[0];

  const currentQRImage = currentTestBank.qrImageUrl?.trim() 
    ? currentTestBank.qrImageUrl 
    : getVietQRUrl(currentTestBank.bankCode, currentTestBank.accountNumber, currentTestBank.accountHolder, testSubtotal, 'DH987654');

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#059669]" />
            <span>Kho - Vận Chuyển - Thanh Toán</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
            Trung tâm thiết lập hợp nhất: Quản lý địa chỉ kho xuất hàng, biểu phí giao hàng động theo khoảng cách địa lý và tối đa 3 tài khoản ngân hàng nhận tiền chuyển khoản kèm mã QR thanh toán tức thì.
          </p>
        </div>

        {/* Quick Presets Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Kho mẫu:</span>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-white text-xs font-medium border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-[#059669] cursor-pointer"
          >
            <option value="">-- Tùy chỉnh kho riêng --</option>
            {PRESET_WAREHOUSES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Warehouse Details, Shipping Rates, & Payment Bank Accounts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Warehouse Location Details */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#059669]" />
                <span>1. Thông Tin Địa Chỉ Kho Xuất Hàng</span>
              </h3>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                Xuất Phát Điểm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-gray-700">Tên Kho Hàng / Điểm Phân Phối</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ví dụ: Kho Tổng Hà Nội - Hub Cầu Giấy"
                  className="w-full px-3 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl outline-none focus:border-[#059669] focus:bg-white text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Hotline / SĐT Kho</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0988.xxx.xxx"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl outline-none focus:border-[#059669] focus:bg-white text-gray-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Tỉnh / Thành Phố Của Kho</label>
                <select
                  value={form.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl outline-none focus:border-[#059669] focus:bg-white text-gray-800 font-medium cursor-pointer"
                >
                  {VN_PROVINCES.map((prov) => (
                    <option key={prov.name} value={prov.name}>
                      {prov.name} ({prov.region === 'North' ? 'Miền Bắc' : prov.region === 'Central' ? 'Miền Trung' : 'Miền Nam'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Quận / Huyện</label>
                <input
                  type="text"
                  required
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  placeholder="Ví dụ: Quận Cầu Giấy"
                  className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl outline-none focus:border-[#059669] focus:bg-white text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700">Phường / Xã</label>
                <input
                  type="text"
                  value={form.ward}
                  onChange={(e) => setForm({ ...form, ward: e.target.value })}
                  placeholder="Ví dụ: Phường Dịch Vọng Hậu"
                  className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl outline-none focus:border-[#059669] focus:bg-white text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-gray-700">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                <input
                  type="text"
                  required
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  placeholder="Ví dụ: Số 144 đường Xuân Thủy"
                  className="w-full px-3 py-2 bg-gray-50/60 border border-gray-200 rounded-xl outline-none focus:border-[#059669] focus:bg-white text-gray-800 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Rate Rules */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#059669]" />
                <span>2. Bảng Cước Phí Giao Hàng Động (Theo Tuyến Đường & Khoảng Cách)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Inner City */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-950">Nội Thành / Cùng Tỉnh</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">1-2 Ngày</span>
                </div>
                <p className="text-[10px] text-gray-500">Cùng tỉnh/thành với kho</p>
                <div className="pt-1">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.baseFeeInnerCity}
                    onChange={(e) => setForm({ ...form, baseFeeInnerCity: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg font-bold text-emerald-700 outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">= {formatVND(form.baseFeeInnerCity)}</span>
                </div>
              </div>

              {/* Inter Province Same Region */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-950">Liên Tỉnh Cùng Miền</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">2-3 Ngày</span>
                </div>
                <p className="text-[10px] text-gray-500">Khác tỉnh cùng khu vực</p>
                <div className="pt-1">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.baseFeeInterProvince}
                    onChange={(e) => setForm({ ...form, baseFeeInterProvince: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg font-bold text-blue-700 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">= {formatVND(form.baseFeeInterProvince)}</span>
                </div>
              </div>

              {/* Inter Region */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-950">Liên Miền (Bắc - Nam)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">3-4 Ngày</span>
                </div>
                <p className="text-[10px] text-gray-500">Khác vùng miền</p>
                <div className="pt-1">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={form.baseFeeInterRegion}
                    onChange={(e) => setForm({ ...form, baseFeeInterRegion: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg font-bold text-amber-700 outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">= {formatVND(form.baseFeeInterRegion)}</span>
                </div>
              </div>
            </div>

            {/* Express & Free Shipping policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-gray-100">
              <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2">
                <label className="flex items-center gap-2 font-bold text-purple-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.expressAvailable}
                    onChange={(e) => setForm({ ...form, expressAvailable: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  <span>Hỗ Trợ Giao Hỏa Tốc (2H)</span>
                </label>
                {form.expressAvailable && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[11px] text-gray-600 block">Cước hỏa tốc:</span>
                      <input
                        type="number"
                        step="1000"
                        value={form.expressBaseFee}
                        onChange={(e) => setForm({ ...form, expressBaseFee: Number(e.target.value) || 0 })}
                        className="w-full px-2 py-1 bg-white border border-purple-200 rounded font-bold text-purple-700 text-xs mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-600 block">Bán kính tối đa:</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={form.expressMaxDistanceKm}
                          onChange={(e) => setForm({ ...form, expressMaxDistanceKm: Number(e.target.value) || 35 })}
                          className="w-full px-2 py-1 bg-white border border-purple-200 rounded font-bold text-purple-700 text-xs"
                        />
                        <span className="text-gray-500 text-[11px] font-bold">km</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 space-y-2">
                <span className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Chính Sách Miễn Phí Vận Chuyển</span>
                </span>
                <div>
                  <span className="text-[11px] text-gray-600 block">Tự động miễn cước khi đơn hàng từ:</span>
                  <input
                    type="number"
                    step="50000"
                    value={form.freeShipThreshold}
                    onChange={(e) => setForm({ ...form, freeShipThreshold: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1 bg-white border border-teal-200 rounded font-bold text-teal-700 text-xs mt-1"
                  />
                  <span className="text-[10px] text-gray-400 block mt-0.5">= {formatVND(form.freeShipThreshold)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: PAYMENT BANK ACCOUNTS & QR CODES (MAX 3) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#059669]" />
                  <span>3. Tài Khoản Chuyển Khoản & Mã QR Thanh Toán (Tối đa 3 tài khoản)</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Khách hàng khi chọn hình thức "Chuyển khoản trực tiếp" sẽ quét mã QR của tài khoản này để thanh toán online tự động.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                  {form.bankAccounts?.length || 0} / 3 Tài khoản
                </span>
                <button
                  type="button"
                  onClick={handleAddBankAccount}
                  disabled={(form.bankAccounts?.length || 0) >= 3}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm tài khoản</span>
                </button>
              </div>
            </div>

            {/* Bank Accounts List Cards */}
            <div className="space-y-4">
              {form.bankAccounts && form.bankAccounts.length > 0 ? (
                form.bankAccounts.map((acc, index) => {
                  const calculatedQR = acc.qrImageUrl?.trim() 
                    ? acc.qrImageUrl 
                    : getVietQRUrl(acc.bankCode, acc.accountNumber, acc.accountHolder, 0, 'DH_MA_DON');

                  return (
                    <div 
                      key={acc.id || index}
                      className={`p-4 rounded-xl border transition-all ${
                        acc.isDefault 
                          ? 'border-emerald-300 bg-emerald-50/20 shadow-sm' 
                          : 'border-gray-200 bg-gray-50/50 hover:bg-white'
                      }`}
                    >
                      {/* Account Card Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-extrabold text-gray-800 text-xs">
                            {acc.bankName || 'Tài khoản ngân hàng'}
                          </span>
                          {acc.isDefault && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!acc.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleBankAccountChange(index, 'isDefault', true)}
                              className="text-[11px] text-gray-500 hover:text-emerald-600 font-semibold underline cursor-pointer"
                            >
                              Đặt làm mặc định
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveBankAccount(index)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa tài khoản này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Left 2 Cols: Form Inputs */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Bank Select */}
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Ngân Hàng *</label>
                            <select
                              value={acc.bankCode}
                              onChange={(e) => handleBankAccountChange(index, 'bankCode', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-semibold cursor-pointer"
                            >
                              {SUPPORTED_BANKS.map((b) => (
                                <option key={b.code} value={b.code}>
                                  {b.shortName} - {b.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Account Number */}
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Số Tài Khoản (STK) *</label>
                            <input
                              type="text"
                              required
                              placeholder="Ví dụ: 12345678910"
                              value={acc.accountNumber}
                              onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-mono font-bold text-gray-800"
                            />
                          </div>

                          {/* Account Holder */}
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Tên Chủ Tài Khoản (In Hoa) *</label>
                            <input
                              type="text"
                              required
                              placeholder="NGUYEN VAN A"
                              value={acc.accountHolder}
                              onChange={(e) => handleBankAccountChange(index, 'accountHolder', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#059669] font-bold text-gray-800 uppercase"
                            />
                          </div>

                          {/* Branch / Note */}
                          <div className="space-y-1">
                            <label className="font-bold text-gray-700">Chi Nhánh / Ghi Chú</label>
                            <input
                              type="text"
                              placeholder="Ví dụ: Chi nhánh Cầu Giấy, Hà Nội"
                              value={acc.branch || ''}
                              onChange={(e) => handleBankAccountChange(index, 'branch', e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#059669]"
                            />
                          </div>

                          {/* Custom QR URL Input */}
                          <div className="sm:col-span-2 space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-gray-700">
                                Link Hình Ảnh Mã QR (Tùy chọn)
                              </label>
                              <span className="text-[10px] text-emerald-600 font-medium">
                                *Nếu để trống, hệ thống sẽ tự động tạo mã VietQR chuẩn 24/7
                              </span>
                            </div>
                            <div className="relative">
                              <ImageIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                              <input
                                type="url"
                                placeholder="Dán link ảnh mã QR (hoặc để trống để dùng VietQR tự động)..."
                                value={acc.qrImageUrl || ''}
                                onChange={(e) => handleBankAccountChange(index, 'qrImageUrl', e.target.value)}
                                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#059669] text-xs text-gray-700"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Col: Instant QR Code Preview */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center space-y-2">
                          <div className="relative aspect-square w-28 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center p-1 shadow-inner">
                            {acc.accountNumber ? (
                              <img
                                src={calculatedQR}
                                alt={`QR ${acc.bankName}`}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as any).src = 'https://placehold.co/200?text=QR+Code';
                                }}
                              />
                            ) : (
                              <div className="text-gray-300 flex flex-col items-center">
                                <QrCode className="w-8 h-8" />
                                <span className="text-[9px] mt-1">Nhập STK để xem QR</span>
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 leading-tight">
                            <p className="font-bold text-gray-800">{acc.bankName || 'Ngân hàng'}</p>
                            <p className="font-mono font-semibold text-emerald-700">{acc.accountNumber || '---'}</p>
                            <p className="text-gray-400 truncate max-w-[120px]">{acc.accountHolder || 'CHỦ TÀI KHOẢN'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Chưa có tài khoản thanh toán nào.</p>
                  <button
                    type="button"
                    onClick={handleAddBankAccount}
                    className="mt-2 text-xs text-[#059669] font-bold hover:underline"
                  >
                    + Thêm tài khoản ngân hàng ngay
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: GOOGLE DRIVE POLICY LINKS */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-[#059669] rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    4. Nhúng Đường Link Google Drive (Chính Sách Cửa Hàng)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Dán đường link Google Docs, Sheets, PDF hoặc file Google Drive để nhúng văn bản chính sách trực tiếp
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Google Drive Embed
              </span>
            </div>

            {/* Instruction tip box */}
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-blue-800">
                <HelpCircle className="w-3.5 h-3.5" />
                Hướng dẫn lấy link chia sẻ công khai từ Google Drive:
              </p>
              <ol className="list-decimal list-inside text-[11px] text-blue-800/90 space-y-0.5 pl-1">
                <li>Mở file tài liệu trên Google Drive (Docs / PDF / Sheets).</li>
                <li>Nhấn nút <strong>Chia sẻ (Share)</strong> ở góc trên bên phải.</li>
                <li>Tại mục Quyền truy cập chung, chọn: <strong>Bất kỳ ai có đường liên kết (Anyone with the link)</strong> - Chế độ <strong>Người xem (Viewer)</strong>.</li>
                <li>Nhấn <strong>Sao chép đường liên kết (Copy link)</strong> và dán vào ô bên dưới.</li>
              </ol>
            </div>

            {/* Policy Inputs Grid */}
            <div className="space-y-4 text-xs">
              {/* 1. Chính sách bán hàng */}
              <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Chính Sách Bán Hàng (Google Drive URL)</span>
                  </label>
                  {form.salesPolicyUrl && (
                    <a
                      href={form.salesPolicyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Kiểm tra link</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://docs.google.com/document/d/... hoặc https://drive.google.com/file/d/..."
                  value={form.salesPolicyUrl || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, salesPolicyUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                />
                <p className="text-[10px] text-gray-400">
                  Quy định đặt hàng, xác nhận giao dịch, cam kết 100% chính hãng và bảo mật thông tin.
                </p>
              </div>

              {/* 2. Chính sách vận chuyển */}
              <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Chính Sách Vận Chuyển & Giao Nhận (Google Drive URL)</span>
                  </label>
                  {form.shippingPolicyUrl && (
                    <a
                      href={form.shippingPolicyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Kiểm tra link</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://docs.google.com/document/d/... hoặc https://drive.google.com/file/d/..."
                  value={form.shippingPolicyUrl || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, shippingPolicyUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                />
                <p className="text-[10px] text-gray-400">
                  Phạm vi giao hàng 63 tỉnh thành, biểu phí cự ly kho, điều kiện Freeship và đồng kiểm khi nhận.
                </p>
              </div>

              {/* 3. Chính sách bảo hành */}
              <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Chính Sách Bảo Hành & Đổi Trả Thiết Bị (Google Drive URL)</span>
                  </label>
                  {form.warrantyPolicyUrl && (
                    <a
                      href={form.warrantyPolicyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Kiểm tra link</span>
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://docs.google.com/document/d/... hoặc https://drive.google.com/file/d/..."
                  value={form.warrantyPolicyUrl || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, warrantyPolicyUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]"
                />
                <p className="text-[10px] text-gray-400">
                  Thời hạn bảo hành camera/phụ kiện, điều kiện đổi mới 1-đổi-1 trong 7 ngày và quy trình tiếp nhận.
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2">
              {savedSuccess && (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1.5 rounded-lg animate-fade-in">
                  <Check className="w-4 h-4" />
                  Đã lưu cấu hình Kho, Thanh Toán & Chính Sách thành công!
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu Cấu Hình Kho - Vận Chuyển - Chính Sách'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Interactive Shipping & QR Payment Simulator */}
        <div className="space-y-5">
          
          {/* Box 1: Live Shipping Preview */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-md space-y-4 border border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-emerald-400">
                <Calculator className="w-4 h-4" />
                <span>Mô Phỏng Cước Vận Chuyển</span>
              </h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                LIVE PREVIEW
              </span>
            </div>

            {/* Test Controls */}
            <div className="space-y-3 text-xs bg-gray-800/80 p-3.5 rounded-xl border border-gray-700">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium text-[11px]">Tỉnh / Thành phố khách nhận hàng:</label>
                <select
                  value={testProvince}
                  onChange={(e) => setTestProvince(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-xs font-semibold outline-none focus:border-emerald-400 cursor-pointer"
                >
                  {VN_PROVINCES.map((prov) => (
                    <option key={prov.name} value={prov.name}>{prov.name} ({prov.region})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium text-[11px]">Giá trị đơn hàng mẫu:</label>
                <input
                  type="number"
                  step="50000"
                  value={testSubtotal}
                  onChange={(e) => setTestSubtotal(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-gray-900 border border-gray-600 rounded-lg text-white text-xs font-bold outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-gray-800/90 rounded-xl p-3.5 space-y-2.5 text-xs border border-gray-700/80">
              <div className="flex items-center justify-between bg-gray-900/80 p-2.5 rounded-lg border border-gray-700">
                <div>
                  <p className="text-[10px] text-gray-400">Kho xuất</p>
                  <p className="font-bold text-emerald-400 truncate max-w-[100px]">{form.city}</p>
                </div>
                <div className="flex flex-col items-center px-1">
                  <span className="text-[10px] font-bold text-amber-400">~{testEstimate.distanceKm} km</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400">Khách nhận</p>
                  <p className="font-bold text-emerald-400 truncate max-w-[100px]">{testProvince}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center p-2 bg-gray-900/60 rounded-lg border border-gray-700/50">
                  <span className="text-gray-300">🚚 Giao Nhanh:</span>
                  <span className="font-bold text-emerald-400">{formatVND(testEstimate.rates.standard)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-900/60 rounded-lg border border-gray-700/50">
                  <span className="text-gray-300">⚡ Hỏa Tốc:</span>
                  {testEstimate.expressAllowed && testEstimate.rates.express ? (
                    <span className="font-bold text-purple-400">{formatVND(testEstimate.rates.express)}</span>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-semibold">Không hỗ trợ</span>
                  )}
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-900/60 rounded-lg border border-gray-700/50">
                  <span className="text-gray-300">📦 Tiết Kiệm:</span>
                  <span className="font-bold text-teal-400">{formatVND(testEstimate.rates.saver)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Live Payment QR Code Preview (What Customer Sees) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-gray-800">
                <QrCode className="w-4 h-4 text-[#059669]" />
                <span>Giao Diện Quét QR Khách Hàng Thấy</span>
              </h3>
            </div>

            {/* Account Switcher Tabs for Preview */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {accountsList.map((acc, idx) => (
                <button
                  key={acc.id || idx}
                  type="button"
                  onClick={() => setTestBankIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    testBankIndex === idx 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {acc.bankCode}
                </button>
              ))}
            </div>

            {/* QR Card Mockup */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-blue-50/40 p-4 rounded-xl border border-emerald-200/80 space-y-3 text-center">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-emerald-100 inline-block mx-auto">
                <img
                  src={currentQRImage}
                  alt="QR Code Preview"
                  className="w-40 h-40 object-contain mx-auto"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as any).src = 'https://placehold.co/200?text=VietQR';
                  }}
                />
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-emerald-900 text-sm">{currentTestBank.bankName}</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-gray-500 font-medium">STK:</span>
                  <span className="font-mono font-extrabold text-gray-900 text-sm">{currentTestBank.accountNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentTestBank.accountNumber, 'stk')}
                    className="p-1 text-gray-400 hover:text-emerald-600 rounded cursor-pointer"
                    title="Sao chép STK"
                  >
                    {copiedAccount === 'stk' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-600 font-semibold uppercase">{currentTestBank.accountHolder}</p>
                <div className="pt-2 border-t border-emerald-200/60 flex justify-between text-[11px]">
                  <span className="text-gray-500">Số tiền:</span>
                  <strong className="text-emerald-700 font-black">{formatVND(testSubtotal + testEstimate.rates.standard)}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Nội dung CK:</span>
                  <strong className="text-emerald-800 font-mono">DH987654</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
