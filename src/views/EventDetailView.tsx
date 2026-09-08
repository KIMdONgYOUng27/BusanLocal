import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  Bookmark, 
  MapPin, 
  Clock, 
  Ticket, 
  Sparkles, 
  PlusCircle, 
  Share2,
  Check
} from 'lucide-react';

export const EventDetailView: React.FC = () => {
  const { 
    selectedEventForDetail, 
    navigate, 
    addPlaceToCourse, 
    savedEventIds, 
    toggleBookmarkEvent,
    showToast 
  } = useApp();

  if (!selectedEventForDetail) {
    return (
      <div className="p-8 text-center">
        <p className="text-xs text-[#64748B]">선택된 이벤트가 없습니다.</p>
        <button 
          onClick={() => navigate('discover')}
          className="mt-3 px-4 py-2 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold"
        >
          이벤트 목록으로
        </button>
      </div>
    );
  }

  const event = selectedEventForDetail;
  const isBookmarked = savedEventIds.includes(event.id);

  const handleAddToCourse = () => {
    addPlaceToCourse({
      id: `place_ev_${event.id}`,
      name: event.title,
      category: '문화예술',
      area: event.area,
      address: event.address,
      image: event.image,
      description: event.subtitle,
      tags: event.badges,
      stayDurationMinutes: 40
    });
    showToast(`'${event.title}' 코스에 성공적으로 추가되었습니다!`);
    navigate('plan');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFF] min-h-[780px] pb-28">
      {/* Cover Backdrop */}
      <div className="relative w-full h-60 bg-[#183B4E]">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] via-black/30 to-transparent" />

        {/* Floating Top Nav Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate('discover')}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-all"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('링크 복사 완료')}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-95"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleBookmarkEvent(event.id)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-95"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#F24D4D] text-[#F24D4D]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="px-2.5 py-0.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[10px] font-bold">
            {event.category}
          </span>
          <h1 className="text-xl font-bold text-white mt-1.5 leading-snug">
            {event.title}
          </h1>
          <p className="text-xs text-white/80 mt-0.5">{event.subtitle}</p>
        </div>
      </div>

      {/* Detail Content */}
      <div className="p-4 flex flex-col gap-4">
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#183B4E]">
            <Clock className="w-4 h-4 text-[#006781] shrink-0" />
            <div>
              <span className="font-bold">{event.dateStr}</span>
              <span className="text-[#64748B] ml-1.5">({event.timeRange})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#183B4E]">
            <MapPin className="w-4 h-4 text-[#006781] shrink-0" />
            <span>{event.address}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#183B4E]">
            <Ticket className="w-4 h-4 text-[#006781] shrink-0" />
            <span>{event.isFree ? '무료 관람 (사전 예약 불필요)' : event.ticketInfo || '유료 관람'}</span>
          </div>
        </div>

        {/* AI Insight Note */}
        <div className="p-3.5 rounded-2xl bg-[#E6EEFF] border border-[#BAEAFF] flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-[#006781] shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-[#183B4E]">AI 동선 추천 인사이트</div>
            <p className="text-[11px] text-[#475569] mt-0.5 leading-relaxed">
              {event.smartInsertionNote}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md px-4 py-2.5 border-t border-[#E2E8F0] shadow-[0_-4px_16px_rgba(24,59,78,0.08)] max-w-[430px] mx-auto">
        <button
          onClick={handleAddToCourse}
          className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-[#5BD4FF]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>현재 내 코스에 추가하기</span>
        </button>
      </div>
    </div>
  );
};
