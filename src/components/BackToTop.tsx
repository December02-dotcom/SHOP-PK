import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Quay lại đầu trang"
      aria-label="Quay lại đầu trang"
      className="fixed bottom-32 right-4 md:bottom-22 md:right-6 z-40 bg-white/95 backdrop-blur-sm text-[#059669] hover:bg-[#059669] hover:text-white p-2.5 sm:p-3 rounded-full shadow-xl border border-gray-200/80 hover:border-[#059669] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center group animate-fade-in"
    >
      <ChevronUp className="w-5 h-5 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="sr-only">Quay lại đầu trang</span>
    </button>
  );
};
