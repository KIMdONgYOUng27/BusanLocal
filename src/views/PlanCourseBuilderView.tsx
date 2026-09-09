import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crosshair, 
  Plus, 
  Minus, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  Clock, 
  MapPin, 
  Camera, 
  Coffee, 
  Sun, 
  Utensils, 
  AlarmClock, 
  Bus, 
  Car, 
  Footprints, 
  X, 
  ArrowUp, 
  ArrowDown, 
  PlusCircle, 
  ArrowRight,
  GripVertical
} from 'lucide-react';
import { PlaceSearchModal } from '../components/PlaceSearchModal';

export const PlanCourseBuilderView: React.FC = () => {
  const { 
    activeCourseItems, 
    removeCourseItem, 
    moveCourseItem, 
    addPlaceToCourse, 
    navigate,
    showToast 
  } = useApp();

  const [isAiMode, setIsAiMode] = useState<boolean>(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(Math.max(0.8, prev + delta), 1.4));
    showToast(delta > 0 ? '지도 확대' : '지도 축소');
  };

  const handleLayerSwitch = () => {
    showToast('🗺️ 지도 레이어가 [로컬 감성 뷰]로 전환되었습니다');
  };

  const handleRecenter = () => {
    showToast('📍 현재 내 위치(광안리 해변)로 중심이 이동되었습니다');
  };

  const handleSaveSchedule = () => {
    navigate('course_result');
  };

  return (
    <div className="flex flex-col w-full relative pb-44">
      {/* Top Section: Interactive Map Canvas Area */}
      <div className="relative w-full h-[360px] overflow-hidden bg-[#DCE9FF]">
        {/* Map Backdrop */}
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-300"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkNh3QcjUZYfF5KXYQQfdFlK22qWyIyN98o8qhN5RQ4aXcq9Nul7VHB-5KyPOj8TtRu5JtZSF2mZ_bbKxJWSdF3vpIJK2YqeIDChFXciDdL740zmEaxRKRfXhjAac-glBvfbko-HvUd6Vf98KcZq8RUqtHLiqotomhwW-X4vNQi0Y6vhREvl_UI0GKIF3soUq_trY30etYELjXh0iZOiOqJUEmLkuJdEcsovj1Rtye6EF71R5HM6G3IA')`,
            transform: `scale(${zoomLevel})`
          }}
        />

        {/* Ambient Overlay for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#183B4E]/30 via-transparent to-[#F8F9FF] pointer-events-none" />

        {/* Floating Top Map HUD (Live Day/Weather & Recenter Pill) */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF]/95 shadow-md backdrop-blur-md border border-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-[#45C7F2] animate-ping" />
            <span className="text-[11px] text-[#183B4E] font-bold">
              실시간 조수 및 일몰 최적화 가동 중
            </span>
          </div>
          <button 
            type="button"
            onClick={handleRecenter}
            className="pointer-events-auto w-9 h-9 rounded-full bg-[#FFFFFF] shadow-md flex items-center justify-center text-[#183B4E] hover:bg-[#F8FAFC] active:scale-95 transition-transform border border-[#E2E8F0]"
            aria-label="현재 위치 재탐색"
          >
            <Crosshair className="w-4 h-4 text-[#183B4E]" />
          </button>
        </div>

        {/* Map Markers & Connecting Polyline Vector Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="busanRouteGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#45C7F2" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#006781" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#45C7F2" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            {/* Dynamic Route Path */}
            <path
              d="M 75 140 Q 140 100 200 90 T 270 205 T 120 235"
              fill="none"
              opacity="0.6"
              stroke="#FFFFFF"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M 75 140 Q 140 100 200 90 T 270 205 T 120 235"
              fill="none"
              stroke="url(#busanRouteGlow)"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          {/* Pin 1: Haeundae */}
          <div className="absolute top-[120px] left-[55px] pointer-events-auto flex flex-col items-center group cursor-pointer">
            <div className="px-2 py-0.5 rounded-full bg-[#183B4E] text-[#FFFFFF] text-[10px] font-bold shadow-md mb-0.5 whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#45C7F2]" />
              1. 해운대
            </div>
            <div className="w-6 h-6 rounded-full bg-[#183B4E] text-[#FFFFFF] flex items-center justify-center shadow-lg font-bold text-[11px]">
              1
            </div>
          </div>

          {/* Transit Time Pill 1 -> 2 */}
          <div className="absolute top-[80px] left-[132px] pointer-events-auto bg-[#FFFFFF] text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-[#E2E8F0]">
            <Bus className="w-3 h-3 text-[#006781]" />
            <span>18분</span>
          </div>

          {/* Pin 2: Cheongsapo */}
          <div className="absolute top-[70px] left-[180px] pointer-events-auto flex flex-col items-center group cursor-pointer">
            <div className="px-2 py-0.5 rounded-full bg-[#F3E3C3] text-[#685D44] text-[10px] font-bold shadow-md mb-0.5 whitespace-nowrap flex items-center gap-0.5 border border-[#E2E8F0]">
              <Sun className="w-3 h-3 text-[#685D44]" />
              일몰 17:30 청사포
            </div>
            <div className="w-6 h-6 rounded-full bg-[#183B4E] text-[#FFFFFF] flex items-center justify-center shadow-lg font-bold text-[11px]">
              2
            </div>
          </div>

          {/* Transit Time Pill 2 -> 3 */}
          <div className="absolute top-[138px] left-[220px] pointer-events-auto bg-[#FFFFFF] text-[#64748B] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-[#E2E8F0]">
            <Car className="w-3 h-3 text-[#006781]" />
            <span>22분</span>
          </div>

          {/* Pin 3: Millac */}
          <div className="absolute top-[185px] left-[250px] pointer-events-auto flex flex-col items-center group cursor-pointer">
            <div className="px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#183B4E] text-[10px] font-bold shadow-md mb-0.5 whitespace-nowrap border border-[#E2E8F0]">
              3. 밀락더마켓
            </div>
            <div className="w-6 h-6 rounded-full bg-[#183B4E] text-[#FFFFFF] flex items-center justify-center shadow-lg font-bold text-[11px]">
              3
            </div>
          </div>

          {/* Pin 4: Drone Show */}
          <div className="absolute top-[215px] left-[95px] pointer-events-auto flex flex-col items-center group cursor-pointer z-10">
            <div className="px-2.5 py-0.5 rounded-full bg-[#F1E1C1] text-[#183B4E] text-[10px] font-bold shadow-md mb-0.5 whitespace-nowrap flex items-center gap-1 animate-bounce border border-[#E2E8F0]">
              <Sparkles className="w-3 h-3 text-[#183B4E]" />
              <span>19:30 드론쇼</span>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-9 h-9 rounded-full bg-[#45C7F2]/40 animate-ping" />
              <div className="w-7 h-7 rounded-full bg-[#45C7F2] text-[#183B4E] flex items-center justify-center shadow-lg font-bold">
                <MapPin className="w-4 h-4 fill-[#183B4E]" />
              </div>
            </div>
          </div>
        </div>

        {/* Map Zoom & Layers Floating Toolbox */}
        <div className="absolute bottom-3 right-4 flex flex-col gap-1.5 z-10">
          <button 
            type="button"
            onClick={() => handleZoom(0.15)}
            className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#183B4E] hover:bg-[#FFFFFF] active:scale-90 transition-transform border border-[#E2E8F0]"
            aria-label="지도 확대"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => handleZoom(-0.15)}
            className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#183B4E] hover:bg-[#FFFFFF] active:scale-90 transition-transform border border-[#E2E8F0]"
            aria-label="지도 축소"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleLayerSwitch}
            className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#183B4E] hover:bg-[#FFFFFF] active:scale-90 transition-transform border border-[#E2E8F0]"
            aria-label="레이어 변경"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* A/B Route Controller (Experience-first vs Minimal Distance) */}
      <div className="px-4 -mt-4 relative z-20">
        <div className="bg-[#FFFFFF] rounded-2xl p-2.5 shadow-md border border-[#E2E8F0]">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F1F5F9] rounded-xl">
            {/* Tab 1: AI Experience Route */}
            <button
              type="button"
              onClick={() => {
                setIsAiMode(true);
                showToast('✨ AI 경험 최적 동선이 적용되었습니다');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg transition-all ${
                isAiMode 
                  ? 'bg-[#FFFFFF] shadow-sm text-[#183B4E] font-bold' 
                  : 'text-[#64748B] hover:text-[#183B4E]'
              }`}
            >
              <div className="flex items-center gap-1">
                <Sparkles className={`w-3.5 h-3.5 ${isAiMode ? 'text-[#006781]' : 'text-[#64748B]'}`} />
                <span className="text-xs">AI 경험 최적 동선</span>
              </div>
              <span className="text-[10px] text-[#64748B] mt-0.5">총 5시간 20분 · 이동 42분</span>
            </button>

            {/* Tab 2: Shortest Distance Route */}
            <button
              type="button"
              onClick={() => {
                setIsAiMode(false);
                showToast('⚠️ 최소 이동 동선: 드론쇼 관람 시간이 누락될 수 있습니다');
              }}
              className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg transition-all ${
                !isAiMode 
                  ? 'bg-[#FFFFFF] shadow-sm text-[#183B4E] font-bold' 
                  : 'text-[#64748B] hover:text-[#183B4E]'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs">최소 이동 동선</span>
              </div>
              <span className="text-[10px] text-[#F24D4D] mt-0.5 flex items-center gap-0.5 font-semibold">
                <AlertTriangle className="w-3 h-3" />
                드론쇼 관람 불가
              </span>
            </button>
          </div>

          {/* Active Route Story Pill */}
          <div className="mt-2 px-1 flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="px-2 py-0.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[10px] font-bold shrink-0">
                추천 경로
              </span>
              <p className="text-[11px] text-[#183B4E] font-medium truncate">
                해운대 → 청사포(일몰) → 광안...
              </p>
            </div>
            <button
              onClick={() => showToast('💡 일몰 시간(17:30)과 드론쇼 시작(19:30)을 결합한 최적 알고리즘')}
              className="text-[#006781] flex items-center text-[11px] font-bold shrink-0 ml-1 hover:underline"
            >
              최적화 기준
              <Info className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Itinerary Workspace */}
      <section className="mt-4 px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[17px] font-bold text-[#183B4E]">타임라인 일정</h2>
            <span className="text-xs text-[#64748B]">
              총 {activeCourseItems.length}개 스팟 · 5.4km
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#64748B] text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>14:00 시작</span>
          </div>
        </div>

        {/* Dynamic Timeline Nodes */}
        {activeCourseItems.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-dashed border-[#E2E8F0]">
            <p className="text-xs text-[#64748B]">코스에 담긴 장소가 없습니다.</p>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="mt-3 px-4 py-2 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold"
            >
              + 첫 번째 장소 추가
            </button>
          </div>
        ) : (
          activeCourseItems.map((item, index) => (
            <div key={item.id} className="flex flex-col">
              {/* Card */}
              <div className="relative bg-[#FFFFFF] rounded-2xl p-4 shadow-xs border border-[#E2E8F0] flex items-start gap-3 hover:shadow-sm transition-shadow">
                {/* Number Badge */}
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${
                    item.highlightTag ? 'bg-[#45C7F2] text-[#183B4E]' : 'bg-[#183B4E] text-[#FFFFFF]'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Spot Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#64748B] font-medium">
                      {item.startTime} - {item.endTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast(`'${item.place.name}' 체류 시간 변경 창`)}
                      className="text-[#64748B] hover:text-[#006781] flex items-center gap-0.5 text-[11px]"
                    >
                      체류 {item.stayDurationMinutes}분
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-[#183B4E] mt-0.5 truncate">
                    {item.place.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                    {item.place.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {item.highlightTag && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F3E3C3] text-[#685D44] text-[10px] font-bold border border-[#E2E8F0]">
                        {item.highlightTag}
                      </span>
                    )}
                    {item.place.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reorder and Delete Actions */}
                <div className="flex flex-col items-center justify-between self-stretch pl-1 gap-1">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveCourseItem(index, 'up')}
                      aria-label="위로 이동"
                      className={`p-1 rounded text-[#94A3B8] hover:text-[#183B4E] ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'active:scale-90'}`}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === activeCourseItems.length - 1}
                      onClick={() => moveCourseItem(index, 'down')}
                      aria-label="아래로 이동"
                      className={`p-1 rounded text-[#94A3B8] hover:text-[#183B4E] ${index === activeCourseItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'active:scale-90'}`}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCourseItem(item.id)}
                    aria-label="항목 삭제"
                    className="p-1 rounded text-[#94A3B8] hover:text-[#F24D4D] active:scale-90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transit Connector between nodes */}
              {index < activeCourseItems.length - 1 && item.transitToNext && (
                <div className="flex items-center my-1.5 pl-6 gap-2.5">
                  <div className="w-0.5 h-6 bg-[#CBD5E1]" />
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] text-[11px] border border-[#E2E8F0]">
                    {item.transitToNext.type === 'bus' && <Bus className="w-3 h-3 text-[#006781]" />}
                    {item.transitToNext.type === 'taxi' && <Car className="w-3 h-3 text-[#006781]" />}
                    {item.transitToNext.type === 'walk' && <Footprints className="w-3 h-3 text-[#006781]" />}
                    <span className="font-bold text-[#183B4E]">{item.transitToNext.durationMinutes}분</span>
                    <span className="text-[#64748B] truncate">{item.transitToNext.description}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Sticky Bottom Quick Action Toolbar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md px-4 py-2.5 border-t border-[#E2E8F0] shadow-[0_-4px_16px_rgba(24,59,78,0.08)] max-w-[430px] mx-auto">
        <div className="flex items-center gap-2">
          {/* Add Spot Button */}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-full bg-[#F1E1C1] text-[#183B4E] text-xs font-bold active:scale-95 transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#183B4E]" />
            <span>장소 추가</span>
          </button>

          {/* Save/Finalize Button */}
          <button
            type="button"
            onClick={handleSaveSchedule}
            className="flex-1 flex items-center justify-center gap-1.5 h-12 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold shadow-md hover:bg-[#5BD4FF] active:scale-98 transition-all"
          >
            <span>내 코스 저장</span>
            <ArrowRight className="w-4 h-4 text-[#183B4E]" />
          </button>
        </div>
      </div>

      {/* Place Search Modal */}
      <PlaceSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectPlace={addPlaceToCourse}
        alreadySelectedIds={activeCourseItems.map(i => i.placeId)}
      />
    </div>
  );
};
