import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
import { 
  Flame, 
  BadgeCheck, 
  Bookmark, 
  Edit3, 
  Search, 
  SlidersHorizontal, 
  Zap, 
  Heart, 
  ChevronRight, 
  ArrowRight, 
  Share2, 
  GitFork, 
  Clock, 
  Footprints, 
  Umbrella, 
  MessageSquare, 
  ChevronDown
} from 'lucide-react';
import { TripCourse } from '../types';

export const CommunityFeedView: React.FC = () => {
  const { 
    currentUser,
    allCourses, 
    openForkModal, 
    savedCourseIds, 
    toggleBookmarkCourse, 
    showToast,
    navigate,
    setSelectedCourseForDetail 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'ranking' | 'editor' | 'saved' | 'created'>('ranking');
  const [selectedTheme, setSelectedTheme] = useState('✨ 전체 보기');
  const [searchKeyword, setSearchKeyword] = useState('');

  const themes = [
    '✨ 전체 보기',
    '👩‍❤️‍👨 연인과 데이트',
    '☔ 비 오는 날',
    '🎒 혼자 여행',
    '🌃 야간/야경 코스',
    '👟 뚜벅이 대중교통'
  ];

  const top1Course = allCourses.find(c => c.id === 'course_top1') || allCourses[0];

  // Filter courses based on subtab and theme
  let displayedCourses = allCourses.filter(c => c.id !== 'course_top1');

  if (activeSubTab === 'saved') {
    displayedCourses = allCourses.filter(c => savedCourseIds.includes(c.id));
  } else if (activeSubTab === 'created') {
    displayedCourses = allCourses.filter(
      c => Boolean(currentUser && (c.author.id === currentUser.id || (c.author.id === 'me' && c.author.name === currentUser.name)))
    );
  }

  if (searchKeyword.trim()) {
    displayedCourses = displayedCourses.filter(c => 
      c.title.includes(searchKeyword) || c.tags.some(t => t.includes(searchKeyword))
    );
  }

  const handleCardClick = (course: TripCourse) => {
    setSelectedCourseForDetail(course);
    navigate('community_course_detail', { courseId: course.id });
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Sub Navigation Tabs (Sticky Top-16) */}
      <div className="w-full bg-[#FFFFFF] px-4 py-2 border-b border-[#E2E8F0] shadow-2xs sticky top-16 z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveSubTab('ranking')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-transform active:scale-95 flex items-center gap-1 ${
              activeSubTab === 'ranking'
                ? 'bg-[#183B4E] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#45C7F2]" />
            인기 코스 랭킹
          </button>

          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-transform active:scale-95 flex items-center gap-1 ${
              activeSubTab === 'editor'
                ? 'bg-[#183B4E] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            <BadgeCheck className="w-3.5 h-3.5 text-[#64748B]" />
            에디터 픽
          </button>

          <button
            onClick={() => setActiveSubTab('saved')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-transform active:scale-95 flex items-center gap-1 ${
              activeSubTab === 'saved'
                ? 'bg-[#183B4E] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#64748B]" />
            내 저장 코스
          </button>

          <button
            onClick={() => setActiveSubTab('created')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-transform active:scale-95 flex items-center gap-1 ${
              activeSubTab === 'created'
                ? 'bg-[#183B4E] text-[#FFFFFF] shadow-xs'
                : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#64748B]" />
            내가 만든 코스
          </button>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Search Bar & Theme Filter Chips */}
        <div className="flex flex-col gap-2.5">
          <div className="relative w-full flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#94A3B8]" />
            <input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="어떤 취향의 부산 여행을 복사할까요?"
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#FFFFFF] text-xs text-[#183B4E] placeholder-[#94A3B8] border border-[#E2E8F0] shadow-xs outline-none focus:border-[#45C7F2]"
            />
            <button 
              type="button"
              onClick={() => showToast('상세 취향 필터가 적용되었습니다')}
              className="absolute right-2.5 p-1 text-[#64748B] hover:text-[#183B4E]"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {themes.map(theme => {
              const isSelected = selectedTheme === theme;
              return (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#183B4E] text-[#FFFFFF] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#475569] border border-[#E2E8F0]'
                  }`}
                >
                  {theme}
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlight Banner: TOP 1 Course */}
        {activeSubTab === 'ranking' && (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-[#FFFFFF] border border-[#E2E8F0] flex flex-col">
            {/* Image Backdrop */}
            <div 
              className="relative w-full h-48 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url('${top1Course.coverImage}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#183B4E] via-[#183B4E]/40 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-[#45C7F2] text-[#183B4E] text-[10px] font-extrabold flex items-center gap-1 shadow-xs">
                  <Zap className="w-3 h-3 fill-[#183B4E]" />
                  이번 주 가장 많이 복사된 코스
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#183B4E]/80 text-[#FFFFFF] text-[10px] font-bold backdrop-blur-xs">
                  TOP 1
                </span>
              </div>

              {/* Heart Button */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  toggleBookmarkCourse(top1Course.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#F24D4D] shadow-xs active:scale-90 transition-transform"
              >
                <Heart className={`w-4 h-4 ${savedCourseIds.includes(top1Course.id) ? 'fill-[#F24D4D]' : ''}`} />
              </button>

              {/* Headline */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-col text-white">
                <h2 className="text-[17px] font-bold text-white leading-tight drop-shadow-sm">
                  {top1Course.title}
                </h2>
              </div>
            </div>

            {/* Creator & Social Metrics Block */}
            <div className="p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    src={top1Course.author.avatar}
                    alt={top1Course.author.name}
                    className="w-7 h-7 shadow-xs border border-[#E2E8F0]"
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#183B4E]">{top1Course.author.name}</span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-[#F3E3C3] text-[#685D44] text-[10px] font-bold">
                      인증 로컬
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#64748B] text-[11px]">
                  <span className="flex items-center gap-0.5 text-[#F24D4D]">
                    <Bookmark className="w-3 h-3 fill-[#F24D4D]" />
                    {top1Course.bookmarkCount}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-[#006781]">
                    <GitFork className="w-3 h-3" />
                    {top1Course.forkCount}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-[#685D44]">
                    <MessageSquare className="w-3 h-3" />
                    {top1Course.reviewCount}
                  </span>
                </div>
              </div>

              {/* Route Nodes Mini Display */}
              <div className="p-2 rounded-xl bg-[#F8FAFC] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar text-[#475569] text-[11px] border border-[#E2E8F0]">
                <span className="shrink-0 font-medium">민락수변 젤라또</span>
                <ChevronRight className="w-3 h-3 text-[#94A3B8] shrink-0" />
                <span className="shrink-0 font-medium">광안리 패들보드</span>
                <ChevronRight className="w-3 h-3 text-[#94A3B8] shrink-0" />
                <span className="shrink-0 font-medium">오션뷰 테라스 횟집</span>
                <ChevronRight className="w-3 h-3 text-[#94A3B8] shrink-0" />
                <span className="shrink-0 text-[#006781] font-bold">광안리 드론쇼</span>
              </div>

              {/* Main Fork CTA */}
              <button
                type="button"
                onClick={() => openForkModal(top1Course)}
                className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all hover:bg-[#5BD4FF]"
              >
                <GitFork className="w-4 h-4 text-[#183B4E]" />
                <span>내 일정 가져오기</span>
              </button>
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <h3 className="text-sm font-bold text-[#183B4E]">커뮤니티 검증 추천 코스</h3>
            <p className="text-[11px] text-[#64748B]">실제 동선 소요시간과 도보 수 검증 완료</p>
          </div>
          <button 
            type="button"
            onClick={() => showToast('정렬: 최신순')}
            className="px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[11px] text-[#475569] flex items-center gap-1 border border-[#E2E8F0]"
          >
            <span>최신순</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Course Cards Feed */}
        <div className="flex flex-col gap-3">
          {displayedCourses.map(course => {
            const isBookmarked = savedCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                onClick={() => handleCardClick(course)}
                className="w-full rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs hover:border-[#45C7F2] transition-all p-3.5 flex flex-col gap-2.5 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {course.tags[0] && (
                        <span className="px-2 py-0.2 rounded-full bg-[#F1E1C1] text-[#221B07] text-[10px] font-bold">
                          {course.tags[0]}
                        </span>
                      )}
                      {course.tags[1] && (
                        <span className="px-2 py-0.2 rounded-full bg-[#F8FAFC] text-[#64748B] text-[10px] border border-[#E2E8F0]">
                          {course.tags[1]}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-[#183B4E] leading-snug truncate">
                      {course.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleBookmarkCourse(course.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-[#F8FAFC] transition-colors shrink-0"
                  >
                    <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-[#F24D4D] text-[#F24D4D]' : 'text-[#64748B]'}`} />
                  </button>
                </div>

                {/* Course Meta Info */}
                <div className="flex items-center gap-2 text-[#64748B] text-[11px]">
                  <span className="flex items-center gap-1 text-[#183B4E] font-semibold">
                    <Clock className="w-3 h-3 text-[#006781]" />
                    {course.totalDuration}
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3 h-3 text-[#685D44]" />
                    예상 도보: {course.estimatedSteps.toLocaleString()}보
                  </span>
                  <span>|</span>
                  <span>포크 {course.forkCount}회</span>
                </div>

                {/* Route Badges Ribbon */}
                <div className="p-1.5 rounded-xl bg-[#F8FAFC] flex items-center gap-1 overflow-x-auto no-scrollbar text-[11px] border border-[#E2E8F0]">
                  {course.tags.slice(2, 6).map((tag, tIdx) => (
                    <React.Fragment key={tag}>
                      <span className="px-2 py-0.5 rounded bg-white shadow-2xs text-[#183B4E] shrink-0 font-medium text-[10px] border border-[#E2E8F0]">
                        {tag}
                      </span>
                      {tIdx < 3 && <ArrowRight className="w-3 h-3 text-[#94A3B8] shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Creator row & CTA */}
                <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-1.5">
                    <UserAvatar
                      src={course.author.avatar}
                      alt={course.author.name}
                      className="w-6 h-6 border border-[#E2E8F0]"
                    />
                    <span className="text-[11px] text-[#64748B] truncate">{course.author.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      openForkModal(course);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-2xs"
                  >
                    <GitFork className="w-3 h-3" />
                    <span>코스 가져오기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Incentive Banner */}
        <div className="w-full p-3.5 rounded-2xl bg-[#E6EEFF] border border-[#BAEAFF] flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#006781] shrink-0 shadow-2xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#183B4E]">내가 만든 코스를 공유해보세요!</div>
              <div className="text-[10px] text-[#475569]">다른 여행자가 10회 복사 시 로컬 뱃지 지급 🎁</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('plan')}
            className="px-3 py-1.5 rounded-full bg-[#183B4E] text-white text-[11px] font-bold shrink-0 active:scale-95"
          >
            코스 등록
          </button>
        </div>
      </div>
    </div>
  );
};
