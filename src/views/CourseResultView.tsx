import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  Sparkles, 
  Clock, 
  Footprints, 
  MapPin, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  ArrowRight,
  Edit3
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export const CourseResultView: React.FC = () => {
  const { activeCourseItems, saveNewCourse, navigate, showToast } = useApp();
  const [courseTitle, setCourseTitle] = useState('광안리 드론쇼 & 오션뷰 선셋 완벽 하루 코스');
  const [isPublic, setIsPublic] = useState(true);

  const stats = analyticsService.calculateCourseStats(activeCourseItems);

  const handleSave = () => {
    saveNewCourse(courseTitle);
  };

  const handleShareToCommunity = () => {
    showToast('🎉 코스가 커뮤니티에 공개되었습니다! (다른 여행자 복사 허용)');
    saveNewCourse(courseTitle);
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#F8FAFF] min-h-[780px] pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={() => navigate('plan')}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#183B4E] hover:bg-[#F1F5F9]"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-xs font-bold text-[#183B4E]">코스 완성 결과</span>
        <div className="w-10" />
      </div>

      {/* Success Hero Badge */}
      <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm flex flex-col items-center text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#E6EEFF] text-[#006781] flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-6 h-6 text-[#006781]" />
        </div>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#BAEAFF] text-[#004D62] text-[10px] font-bold">
            동선 검증 100% 완료
          </span>
          <h1 className="text-lg font-extrabold text-[#183B4E] mt-1">
            코스가 멋지게 조립되었습니다!
          </h1>
        </div>

        {/* Title Input */}
        <div className="w-full relative mt-1">
          <input
            type="text"
            value={courseTitle}
            onChange={e => setCourseTitle(e.target.value)}
            className="w-full px-3 py-2 text-center font-bold text-xs text-[#183B4E] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] focus:border-[#45C7F2] outline-none"
            placeholder="코스 제목을 입력하세요"
          />
          <Edit3 className="w-3.5 h-3.5 absolute right-3 top-3 text-[#94A3B8] pointer-events-none" />
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center shadow-2xs">
          <Clock className="w-4 h-4 text-[#006781] mx-auto mb-1" />
          <span className="text-[10px] text-[#64748B]">총 소요</span>
          <div className="text-xs font-bold text-[#183B4E] mt-0.5">
            {Math.floor(stats.totalMinutes / 60)}시간 {stats.totalMinutes % 60}분
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center shadow-2xs">
          <Footprints className="w-4 h-4 text-[#685D44] mx-auto mb-1" />
          <span className="text-[10px] text-[#64748B]">예상 도보</span>
          <div className="text-xs font-bold text-[#183B4E] mt-0.5">
            {stats.totalSteps.toLocaleString()}보
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-center shadow-2xs">
          <MapPin className="w-4 h-4 text-[#F24D4D] mx-auto mb-1" />
          <span className="text-[10px] text-[#64748B]">방문 스팟</span>
          <div className="text-xs font-bold text-[#183B4E] mt-0.5">
            {stats.spotCount}개소 ({stats.distanceKm}km)
          </div>
        </div>
      </div>

      {/* Spots Preview Sequence */}
      <div className="mt-4 flex-1">
        <h3 className="text-xs font-bold text-[#183B4E] mb-2 px-1">조립된 타임라인 요약</h3>
        <div className="space-y-2">
          {activeCourseItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-2.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 rounded-full bg-[#183B4E] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#183B4E] truncate">{item.place.name}</div>
                  <div className="text-[11px] text-[#64748B] truncate">{item.startTime} ~ {item.endTime} (체류 {item.stayDurationMinutes}분)</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F8FAFC] text-[#006781] border border-[#E2E8F0] shrink-0">
                {item.place.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Public Share Toggle */}
      <div className="mt-4 p-3 rounded-2xl bg-[#F3E3C3] border border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#685D44]" />
          <div>
            <div className="text-xs font-bold text-[#183B4E]">커뮤니티 공개 허용</div>
            <div className="text-[10px] text-[#685D44]">다른 여행자 10회 복사 시 로컬 뱃지 지급 🎁</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={e => setIsPublic(e.target.checked)}
          className="w-5 h-5 accent-[#006781] rounded cursor-pointer"
        />
      </div>

      {/* Action CTA Buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleSave}
          className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all hover:bg-[#5BD4FF]"
        >
          <Bookmark className="w-4 h-4" />
          <span>내 일정에 저장하기</span>
        </button>

        <button
          onClick={() => navigate('plan')}
          className="w-full h-11 rounded-full bg-[#F1F5F9] text-[#183B4E] text-xs font-bold active:scale-98 transition-all hover:bg-[#E2E8F0]"
        >
          타임라인 다시 수정
        </button>
      </div>
    </div>
  );
};
