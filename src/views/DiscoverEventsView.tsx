import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  SlidersHorizontal, 
  Check, 
  PartyPopper, 
  Star, 
  ArrowUpDown, 
  PlusCircle, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  ChevronRight,
  Info
} from 'lucide-react';
import { mockEvents } from '../mock/mockData';
import { EventItem } from '../types';

export const DiscoverEventsView: React.FC = () => {
  const { 
    addPlaceToCourse, 
    showToast, 
    navigate, 
    setSelectedEventForDetail 
  } = useApp();

  const [selectedArea, setSelectedArea] = useState('광안리/수영');
  const [selectedCategory, setSelectedCategory] = useState('축제·야간');
  const [addedEventIds, setAddedEventIds] = useState<string[]>([]);

  const areaList = ['전체 권역', '광안리/수영', '해운대/송정', '영도/남포'];
  const categoryList = ['전체', '축제·야간', '팝업·플리마켓', '전시·공연', '로컬체험'];

  const handleAddEvent = (event: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
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
    setAddedEventIds(prev => [...prev, event.id]);
    showToast(`'${event.title}' 코스에 추가되었습니다!`);
  };

  const handleCardClick = (event: EventItem) => {
    setSelectedEventForDetail(event);
    navigate('event_detail', { eventId: event.id });
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Contextual Filter Bar */}
      <section className="px-4 pt-2 pb-3 bg-[#F8FAFF] flex flex-col gap-2.5">
        {/* Date / Time Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button 
            type="button"
            onClick={() => showToast('여행 일자 선택')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FFFFFF] shadow-xs shrink-0 active:scale-95 transition-transform border border-[#E2E8F0]"
          >
            <Calendar className="w-3.5 h-3.5 text-[#006781]" />
            <span className="text-xs font-semibold text-[#183B4E]">9월 19일 (토)</span>
          </button>

          <button 
            type="button"
            onClick={() => showToast('동선 타임 윈도우 조절')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FFFFFF] shadow-xs shrink-0 active:scale-95 transition-transform border border-[#E2E8F0]"
          >
            <Clock className="w-3.5 h-3.5 text-[#006781]" />
            <span className="text-xs font-semibold text-[#183B4E]">14:00 ~ 22:00</span>
            <SlidersHorizontal className="w-3 h-3 text-[#64748B]" />
          </button>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#E6EEFF] text-[#003644] shrink-0 border border-[#BAEAFF]">
            <span className="w-2 h-2 rounded-full bg-[#006781] animate-pulse" />
            <span className="text-[10px] font-bold">내 동선 연동중</span>
          </div>
        </div>

        {/* Area Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {areaList.map(area => {
            const isSelected = selectedArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                  isSelected
                    ? 'bg-[#183B4E] text-white shadow-xs flex items-center gap-1'
                    : 'bg-[#FFFFFF] text-[#475569] border border-[#E2E8F0]'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{area}</span>
              </button>
            );
          })}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categoryList.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap active:scale-95 transition-all ${
                  isSelected
                    ? 'bg-[#F1E1C1] text-[#221B07] shadow-xs flex items-center gap-1'
                    : 'bg-[#FFFFFF] text-[#64748B] border border-[#E2E8F0]'
                }`}
              >
                {cat === '축제·야간' && <PartyPopper className="w-3 h-3 text-[#685D44]" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* AI Matching Insights Header */}
      <section className="px-4 py-2 flex items-center justify-between">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#45C7F2]" />
            <span className="text-[10px] text-[#006781] font-bold tracking-wider uppercase">
              AI Live Filtering
            </span>
          </div>
          <h2 className="text-[17px] font-bold text-[#183B4E] truncate">
            현재 내 일정에 쏙 들어가는 이벤트 <span className="text-[#006781] font-extrabold">14개</span>
          </h2>
        </div>
        <button 
          type="button"
          onClick={() => showToast('정렬: 동선 최적순')}
          className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-[#E6EEFF] text-[#006781] text-[11px] font-semibold shrink-0"
        >
          <span>동선 최적순</span>
          <ArrowUpDown className="w-3 h-3 ml-0.5" />
        </button>
      </section>

      {/* Event Discovery Feed */}
      <section className="px-4 py-2 flex flex-col gap-4">
        {mockEvents.map(event => {
          const isAdded = addedEventIds.includes(event.id);

          return (
            <article
              key={event.id}
              onClick={() => handleCardClick(event)}
              className="bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xs active:scale-[0.99] transition-all flex flex-col cursor-pointer"
            >
              {/* Media Tile */}
              <div className="relative w-full h-44 bg-[#183B4E] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E]/85 via-transparent to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                  {event.badges.map(b => (
                    <span
                      key={b}
                      className="px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/90 backdrop-blur-xs text-[#183B4E] text-[10px] font-bold shadow-xs"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Bottom Metadata Preview */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-[#BAEAFF] font-semibold">{event.subtitle}</span>
                    <h3 className="text-[17px] text-white font-bold truncate">{event.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-xs text-[10px] text-white shrink-0">
                    {event.isFree ? '무료 관람' : event.ticketInfo?.split('·')[0] || '입장권'}
                  </span>
                </div>
              </div>

              {/* Card Details Container */}
              <div className="p-3.5 flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-[#475569]">
                    <div className="flex items-center gap-1 font-bold text-[#183B4E]">
                      <Clock className="w-3.5 h-3.5 text-[#006781]" />
                      <span>{event.timeRange}</span>
                    </div>
                    <span className="text-[11px] text-[#F24D4D] font-medium">저녁 식사 직후 골든타임</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                      <span className="truncate text-[11px]">{event.address}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#E6EEFF] text-[10px] font-bold text-[#006781] shrink-0">
                      내 동선에서 +{event.proximityMinutes}분
                    </span>
                  </div>
                </div>

                {/* Smart Insertion Note or Warning */}
                {event.isConflictRisk ? (
                  <div className="p-2.5 rounded-xl bg-[#FEE2E2] border border-[#F24D4D]/20 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#F24D4D] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#F24D4D] font-medium leading-relaxed">
                      {event.smartInsertionNote}
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] flex items-center gap-2 border border-[#E2E8F0]">
                    <Sparkles className="w-4 h-4 text-[#45C7F2] shrink-0" />
                    <p className="text-[11px] text-[#475569] leading-snug">
                      {event.smartInsertionNote}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  type="button"
                  disabled={isAdded}
                  onClick={e => handleAddEvent(event, e)}
                  className={`w-full h-12 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all ${
                    isAdded
                      ? 'bg-[#F1F5F9] text-[#94A3B8]'
                      : 'bg-[#45C7F2] text-[#183B4E] hover:bg-[#5BD4FF]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>담김</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>코스 추가</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
