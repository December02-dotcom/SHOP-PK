import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X, Send, Store, HelpCircle } from 'lucide-react';

export const ShopChat: React.FC = () => {
  const { chatOpen, setChatOpen, chatMessages, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    sendChatMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed bottom-16 right-4 md:bottom-6 md:right-6 z-40 select-none font-sans">
      {/* Floating Chat Bubble */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center space-x-1.5 cursor-pointer relative group"
        >
          <MessageCircle className="w-6 h-6 fill-current animate-pulse" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-500 ease-out text-xs font-bold whitespace-nowrap">
            Chat với Shop Mall
          </span>
          {/* Notification ping */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-white border border-[#059669] rounded-full flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
        </button>
      )}

      {/* Chat Box Container */}
      {chatOpen && (
        <div className="bg-white w-[310px] sm:w-[350px] h-[400px] md:h-[450px] rounded-lg shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="bg-[#059669] p-3 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <h4 className="font-bold text-xs flex items-center gap-1">
                  Chăm sóc khách hàng
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
                </h4>
                <span className="text-[10px] opacity-80">PK Điện Tử - Camera • Trực tuyến</span>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full text-white/95 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Suggestions/Prompts */}
          <div className="bg-gray-50 px-3 py-1.5 flex gap-1.5 overflow-x-auto text-[10px] text-gray-500 border-b border-gray-100 shrink-0 select-none">
            {['Hỏi về phí ship?', 'Hỏi chọn size?', 'Voucher ưu đãi?'].map((q) => (
              <button
                key={q}
                onClick={() => sendChatMessage(q.replace('?', ''))}
                className="bg-white border border-gray-200 hover:border-[#059669] px-2 py-1 rounded-full whitespace-nowrap cursor-pointer hover:text-[#059669] transition-colors shrink-0 font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50/50">
            {chatMessages.map((msg, idx) => {
              const isShop = msg.sender === 'shop';
              return (
                <div
                  key={idx}
                  className={`flex ${isShop ? 'justify-start' : 'justify-end'} items-end gap-2 text-xs`}
                >
                  {isShop && (
                    <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 text-[10px]">
                      <Store className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="flex flex-col space-y-0.5 max-w-[75%]">
                    <div className={`p-2.5 rounded-lg ${
                      isShop 
                        ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-sm font-medium' 
                        : 'bg-[#059669] text-white rounded-br-none shadow-sm font-semibold'
                    } leading-relaxed break-words`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-400 self-end px-1">{msg.time}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSend} className="p-2 bg-white border-t border-gray-100 flex items-center shrink-0">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-3 py-2 text-xs border border-gray-100 rounded-sm outline-none focus:border-[#059669]/60 bg-gray-50 placeholder-gray-400"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-[#059669] hover:bg-[#047857] text-white rounded-sm cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
