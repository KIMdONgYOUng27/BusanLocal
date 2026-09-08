import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  Bookmark, 
  GitFork, 
  Clock, 
  Footprints, 
  MapPin, 
  Share2, 
  Star,
  Bus,
  Car,
  Footprints as WalkIcon,
  CheckCircle2
} from 'lucide-react';

export const CourseDetailView: React.FC = () => {
  const { 
    selectedCourseForDetail, 
    allCourses, 
    navigate, 
    openForkModal, 
    savedCourseIds, 
    toggleBookmarkCourse,
    showToast 
  } = useApp();

  const course = selectedCourseForDetail || allCourses[0];
  const isBookmarked = savedCourseIds.includes(course.id);

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFF] min-h-[780px] pb-28">
      {/* Cover Backdrop with Hero Header */}
      <div className="relative w-full h-56 bg-[#183B4E]">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] via-[#183B4E]/40 to-transparent" />

        {/* Floating Top Nav Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate('community')}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-all"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('🔗 코스 공유 링크가 클립보드에 복사되었습니다')}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-all"
              aria-label="공유하기"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleBookmarkCourse(course.id)}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center active:scale-95 transition-all"
              aria-label="북마크"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#F24D4D] text-[#F24D4D]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Cover Bottom Meta */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="px-2.5 py-0.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[10px] font-bold">
            {course.area}
          </span>
          <h1 className="text-lg font-bold text-white mt-1.5 leading-snug drop-shadow-sm">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Course Info Card */}
      <div className="p-4 flex flex-col gap-4">
        {/* Author info & metrics */}
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={course.author.avatar}
              alt={course.author.name}
              className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#183B4E]">{course.author.name}</span>
                {course.author.isVerifiedLocal && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F3E3C3] text-[#685D44] font-bold">
                    인증 로컬
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#64748B]">코스 포크 {course.forkCount}회</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <span className="flex items-center gap-0.5 text-[#F24D4D] font-bold">
              <Bookmark className="w-3.5 h-3.5 fill-[#F24D4D]" />
              {course.bookmarkCount}
            </span>
            <span className="text-[#E2E8F0]">·</span>
            <span className="flex items-center gap-0.5 text-[#006781] font-bold">
              <GitFork className="w-3.5 h-3.5" />
              {course.forkCount}
            </span>
          </div>
        </div>

        {/* Timeline Itinerary Section */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-xs font-bold text-[#183B4E]">일정 타임라인 & 이동 경로</h2>
            <span className="text-[11px] text-[#64748B]">{course.totalDuration} · 도보 {course.estimatedSteps}보</span>
          </div>

          <div className="space-y-2">
            {course.items.map((item, idx) => (
              <div key={item.id} className="flex flex-col">
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#183B4E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>{item.startTime} - {item.endTime}</span>
                      <span>체류 {item.stayDurationMinutes}분</span>
                    </div>
                    <h3 className="text-xs font-bold text-[#183B4E] mt-0.5 truncate">{item.place.name}</h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">{item.place.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.place.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {idx < course.items.length - 1 && item.transitToNext && (
                  <div className="flex items-center my-1 pl-6 gap-2">
                    <div className="w-0.5 h-5 bg-[#CBD5E1]" />
                    <div className="flex items-center gap-1 text-[10px] text-[#64748B] px-2 py-0.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0]">
                      {item.transitToNext.type === 'bus' && <Bus className="w-3 h-3 text-[#006781]" />}
                      {item.transitToNext.type === 'taxi' && <Car className="w-3 h-3 text-[#006781]" />}
                      {item.transitToNext.type === 'walk' && <WalkIcon className="w-3 h-3 text-[#006781]" />}
                      <span>{item.transitToNext.durationMinutes}분 ({item.transitToNext.description})</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA Toolbar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md px-4 py-2.5 border-t border-[#E2E8F0] shadow-[0_-4px_16px_rgba(24,59,78,0.08)] max-w-[430px] mx-auto">
        <button
          onClick={() => openForkModal(course)}
          className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-[#5BD4FF]"
        >
          <GitFork className="w-4 h-4" />
          <span>내 일정으로 가져오기</span>
        </button>
      </div>
    </div>
  );
};
