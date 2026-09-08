import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ChevronDown, Bell, Check } from 'lucide-react';

export const Header: React.FC = () => {
  const { selectedArea, setSelectedArea, currentUser, navigate, showToast } = useApp();
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [hasUnreadAlert, setHasUnreadAlert] = useState(true);

  const areas = [
    '부산 광안리/해운대',
    '부산 영도/남포',
    '부산 전포/서면',
    '부산 기장/송정'
  ];

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setIsAreaDropdownOpen(false);
    showToast(`권역이 '${area}'(으)로 변경되었습니다`);
  };

  const handleBellClick = () => {
    setHasUnreadAlert(false);
    showToast('🔔 [광안리 드론쇼] 오늘 19:30 정시 비행 예정입니다');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-safe bg-[#ffffff]/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_1px_8px_rgba(24,59,78,0.05)] max-w-[430px] mx-auto">
      <div className="h-16 px-4 flex items-center justify-between gap-2">
        {/* Logo & Area Selector */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 text-left shrink-0 active:scale-95 transition-transform"
            aria-label="홈으로 이동"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6IRQS77Fp1DDKmlbTm-Dzmqpe4wS9SPWN55ESrmBM7lUOMaZVa8dmOLAa_SJIqWv3a9sH5KadO7rnGYBxZAIYafgnywTiQ6ZR35G_0s1pfOzEbNSxuCRnnpI6iBz19-zkPO0qAihOBfxu6Wb7ILg26kn4eZw11QZv7aYitIwgLMSSd6XJQA6y_VCmEEmGfQiuihisXGKCzp0kVGqIqPZVDUTwjbCV4WjjA6stW6jhrFZ7bPojRcyHWQ"
              alt="LocalFlow Busan"
              className="h-7 w-7 object-contain rounded-full bg-[#E6EEFF] p-0.5"
            />
          </button>

          <div className="flex flex-col min-w-0">
            <button 
              onClick={() => navigate('home')}
              className="text-left font-bold text-[17px] text-[#183B4E] leading-tight truncate tracking-tight"
            >
              LocalFlow Busan
            </button>

            {/* Area Pill trigger */}
            <div className="relative">
              <button
                onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                className="flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-[#F3E3C3] text-[#685D44] text-[11px] font-semibold active:scale-95 transition-transform"
                type="button"
                aria-haspopup="true"
                aria-expanded={isAreaDropdownOpen}
              >
                <MapPin className="w-3 h-3 text-[#183B4E]" />
                <span className="truncate max-w-[130px] text-[#183B4E] font-bold">{selectedArea}</span>
                <ChevronDown className="w-3 h-3 text-[#183B4E]" />
              </button>

              {isAreaDropdownOpen && (
                <div className="absolute top-7 left-0 w-48 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E2E8F0] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {areas.map(area => (
                    <button
                      key={area}
                      onClick={() => handleSelectArea(area)}
                      className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#F8FAFC] transition-colors ${
                        selectedArea === area ? 'text-[#006781] font-bold bg-[#E6EEFF]' : 'text-[#475569]'
                      }`}
                    >
                      <span>{area}</span>
                      {selectedArea === area && <Check className="w-3.5 h-3.5 text-[#006781]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleBellClick}
            className="w-11 h-11 flex items-center justify-center rounded-full text-[#183B4E] hover:bg-[#F1F5F9] active:scale-95 transition-all relative"
            aria-label="알림"
          >
            <Bell className="w-5 h-5 text-[#183B4E]" />
            {hasUnreadAlert && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F24D4D] animate-pulse" />
            )}
          </button>

          <button
            onClick={() => navigate('mypage')}
            className="w-11 h-11 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#45C7F2] active:scale-95 transition-all"
            aria-label="마이페이지 프로필"
          >
            <img
              src={currentUser?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw13gQPDSpIuMEhG0s5k64vRtDKjl-AuuA8QQMf04bclN6uEl9A-fiF7sXWRo3uhmdnLKokoT4GX1jfJNGfS-yuOfhQx4XIyDMavMkR76Q8Cu1qajmj3P8n8_f4z_fM1Xz51u_n41MgnUGWt5XnFTZjTM-GqlAUlU7g3tqoHWpVUEx8hqf48w2OB9EWgfFfEOodZNwXhYorjjS0f9SETZg40M9PvnYJepgzjet92VQdqWyDeRphExgMg'}
              alt={currentUser?.name || '프로필'}
              className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] shadow-xs"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
