import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  getEmbeddableGoogleDriveUrl, 
  getExternalGoogleDriveUrl, 
  POLICY_DEFAULT_FALLBACKS 
} from '../utils/googleDrive';
import { 
  X, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  CheckCircle2, 
  HelpCircle,
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { activePolicyModal, setActivePolicyModal, warehouse } = useApp();
  const [activeTab, setActiveTab] = useState<'sales' | 'shipping' | 'warranty'>(activePolicyModal || 'sales');
  const [iframeKey, setIframeKey] = useState(0);
  const [viewMode, setViewMode] = useState<'embed' | 'doc'>('embed');

  // Keep internal tab in sync if activePolicyModal changes
  React.useEffect(() => {
    if (activePolicyModal) {
      setActiveTab(activePolicyModal);
    }
  }, [activePolicyModal]);

  if (!activePolicyModal) return null;

  const getPolicyUrl = (tab: 'sales' | 'shipping' | 'warranty') => {
    if (tab === 'sales') return warehouse.salesPolicyUrl;
    if (tab === 'shipping') return warehouse.shippingPolicyUrl;
    if (tab === 'warranty') return warehouse.warrantyPolicyUrl;
    return '';
  };

  const rawUrl = getPolicyUrl(activeTab);
  const embedUrl = getEmbeddableGoogleDriveUrl(rawUrl);
  const externalUrl = getExternalGoogleDriveUrl(rawUrl);
  const fallbackData = POLICY_DEFAULT_FALLBACKS[activeTab];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-gray-100 max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <FileText className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>VĂN BẢN CHÍNH SÁCH & QUY ĐỊNH CỬA HÀNG</span>
              </h2>
              <p className="text-[11px] text-emerald-100/90 font-normal">
                Tài liệu chính thức nhúng trực tiếp từ Google Drive của PK ĐIỆN TỬ - CAMERA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                title="Mở tài liệu trên tab mới của Google Drive"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-bold text-white transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở trên Google Drive</span>
              </a>
            )}
            <button
              onClick={() => setActivePolicyModal(null)}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/20 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Policy Tab Navigators */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 pt-2.5 gap-2 overflow-x-auto shrink-0">
          
          {/* Tab 1: Sales Policy */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('sales');
              setIframeKey((k) => k + 1);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'sales'
                ? 'bg-white border-[#059669] text-[#059669] shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/70'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Chính Sách Bán Hàng</span>
          </button>

          {/* Tab 2: Shipping Policy */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('shipping');
              setIframeKey((k) => k + 1);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'shipping'
                ? 'bg-white border-[#059669] text-[#059669] shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/70'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Chính Sách Vận Chuyển</span>
          </button>

          {/* Tab 3: Warranty Policy */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('warranty');
              setIframeKey((k) => k + 1);
            }}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'warranty'
                ? 'bg-white border-[#059669] text-[#059669] shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/70'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Chính Sách Bảo Hành & Đổi Trả</span>
          </button>
        </div>

        {/* View mode toggle bar (Embed view vs Document view) */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Chế độ hiển thị:</span>
            <button
              type="button"
              onClick={() => setViewMode('embed')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'embed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Xem tài liệu Google Drive
            </button>
            <button
              type="button"
              onClick={() => setViewMode('doc')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                viewMode === 'doc'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              Văn bản tóm tắt chuẩn
            </button>
          </div>

          <div className="flex items-center gap-2">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline flex items-center gap-1 font-bold text-[11px]"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Mở toàn màn hình</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => setIframeKey((k) => k + 1)}
              title="Tải lại tài liệu"
              className="p-1 text-gray-400 hover:text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Document Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fafafa]">
          {viewMode === 'embed' && embedUrl ? (
            <div className="h-[60vh] sm:h-[65vh] w-full rounded-xl border border-gray-200 overflow-hidden bg-white shadow-inner relative flex flex-col">
              <iframe
                key={iframeKey}
                src={embedUrl}
                title={fallbackData.title}
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>
          ) : (
            /* Formatted Document fallback */
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Văn Bản Cam Kết Ban Hành Từ PK ĐIỆN TỬ - CAMERA</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {fallbackData.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-normal">
                  {fallbackData.subtitle}
                </p>
              </div>

              <div className="space-y-5 text-gray-700 text-xs sm:text-sm leading-relaxed">
                {fallbackData.sections.map((sec, idx) => (
                  <div key={idx} className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-2">
                    <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      {sec.heading}
                    </h4>
                    <p className="text-gray-600 whitespace-pre-line text-xs pl-4 leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Note / Help Banner */}
              <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-900">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block mb-0.5">Hỗ trợ giải đáp thắc mắc 24/7</strong>
                  <span>
                    Nếu bạn có bất kỳ câu hỏi nào về các điều khoản hoặc cần hỗ trợ bảo hành khẩn cấp, vui lòng liên hệ Hotline <strong className="font-bold">1900 6789</strong> hoặc nhấn vào khung Chat trực tuyến ở góc dưới màn hình.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-gray-400 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Chính sách áp dụng trên toàn bộ hệ thống cửa hàng & kênh phân phối trực tuyến</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-700 rounded-lg font-bold text-center transition-all flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Xem trên Drive</span>
              </a>
            )}
            <button
              onClick={() => setActivePolicyModal(null)}
              className="flex-1 sm:flex-none px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-all shadow-sm cursor-pointer text-center"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
