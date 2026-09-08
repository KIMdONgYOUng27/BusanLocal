import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        showToast('');
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, showToast]);

  if (!toastMessage) return null;

  return (
    <div 
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 bottom-20 z-50 pointer-events-none flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#183B4E] text-[#FFFFFF] text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[90vw]"
    >
      <CheckCircle2 className="w-4 h-4 text-[#45C7F2] shrink-0" />
      <span className="truncate">{toastMessage}</span>
    </div>
  );
};
