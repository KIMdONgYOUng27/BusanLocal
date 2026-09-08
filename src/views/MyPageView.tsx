import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bookmark, 
  GitFork, 
  Edit3, 
  Award, 
  LogOut, 
  Settings, 
  ChevronRight, 
  Clock, 
  MapPin, 
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

export const MyPageView: React.FC = () => {
  const { 
    currentUser, 
    allCourses, 
    savedCourseIds, 
    logout, 
    navigate, 
    openForkModal,
    setSelectedCourseForDetail,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'saved' | 'created'>('saved');

  const savedCourses = allCourses.filter(c => savedCourseIds.includes(c.id));
  const createdCourses = allCourses.filter(c => c.author.name === (currentUser?.name || '수진'));

  const handlePreview = (course: any) => {
    setSelectedCourseForDetail(course);
    navigate('course_detail', { courseId: course.id });
  };

  return (
    <div className="flex flex-col w-full pb-28 p-4 space-y-4">
      {/* Profile Card */}
      <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw13gQPDSpIuMEhG0s5k64vRtDKjl-AuuA8QQMf04bclN6uEl9A-fiF7sXWRo3uhmdnLKokoT4GX1jfJNGfS-yuOfhQx4XIyDMavMkR76Q8Cu1qajmj3P8n8_f4z_fM1Xz51u_n41MgnUGWt5XnFTZjTM-GqlAUlU7g3tqoHWpVUEx8hqf48w2OB9EWgfFfEOodZNwXhYorjjS0f9SETZg40M9PvnYJepgzjet92VQdqWyDeRphExgMg'}
              alt={currentUser?.name || '유저'}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#45C7F2] shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-[#183B4E]">{currentUser?.name || '수진'}</h1>
                <span className="px-2 py-0.2 rounded-full bg-[#E6EEFF] text-[#006781] text-[10px] font-bold">
                  {currentUser?.badgeText || '해변 산책러'}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">{currentUser?.email}</p>
            </div>
          </div>

          <button
            onClick={() => showToast('프로필 편집 창')}
            className="p-2 text-[#64748B] hover:text-[#183B4E] rounded-full hover:bg-[#F8FAFC]"
            aria-label="설정"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
          {currentUser?.bio || '주말마다 부산 구석구석 숨은 힐링 스팟을 찾아 떠나는 주말 여행자입니다 🌊'}
        </p>

        {/* User Activity Stats */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center border-t border-[#F1F5F9]">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#183B4E]">{savedCourses.length}</span>
            <span className="text-[10px] text-[#64748B]">저장한 코스</span>
          </div>
          <div className="flex flex-col border-x border-[#E2E8F0]">
            <span className="text-sm font-bold text-[#006781]">{currentUser?.forkedCount || 8}</span>
            <span className="text-[10px] text-[#64748B]">포크된 횟수</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#183B4E]">{createdCourses.length}</span>
            <span className="text-[10px] text-[#64748B]">작성한 코스</span>
          </div>
        </div>
      </div>

      {/* Creator Badge Progress Banner */}
      <div className="p-3.5 rounded-2xl bg-[#F3E3C3] border border-[#E2E8F0] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#685D44]" />
            <span className="text-xs font-bold text-[#183B4E]">공식 로컬 크리에이터 뱃지 도전</span>
          </div>
          <span className="text-[11px] font-bold text-[#685D44]">8 / 10회</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden">
          <div className="h-full bg-[#006781] rounded-full" style={{ width: '80%' }} />
        </div>
        <span className="text-[10px] text-[#685D44]">
          내가 만든 코스가 2회 더 복사되면 <strong>'인증 로컬'</strong> 마크를 획득합니다!
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#F1F5F9] rounded-2xl">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'saved' ? 'bg-[#FFFFFF] text-[#183B4E] shadow-xs' : 'text-[#64748B]'
          }`}
        >
          저장 코스 ({savedCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('created')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'created' ? 'bg-[#FFFFFF] text-[#183B4E] shadow-xs' : 'text-[#64748B]'
          }`}
        >
          내가 만든 코스 ({createdCourses.length})
        </button>
      </div>

      {/* Course Cards List */}
      <div className="space-y-3">
        {activeTab === 'saved' ? (
          savedCourses.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-dashed border-[#E2E8F0]">
              <p className="text-xs text-[#64748B]">저장된 코스가 없습니다.</p>
              <button
                onClick={() => navigate('community')}
                className="mt-3 px-4 py-2 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold"
              >
                추천 코스 둘러보기
              </button>
            </div>
          ) : (
            savedCourses.map(course => (
              <div
                key={course.id}
                onClick={() => handlePreview(course)}
                className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 hover:border-[#45C7F2] cursor-pointer"
              >
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-[#183B4E] truncate">{course.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-1">
                    <span>{course.totalDuration}</span>
                    <span>·</span>
                    <span>포크 {course.forkCount}회</span>
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    openForkModal(course);
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold shrink-0"
                >
                  조립
                </button>
              </div>
            ))
          )
        ) : (
          createdCourses.length === 0 ? (
            <div className="p-8 text-center bg-[#FFFFFF] rounded-2xl border border-dashed border-[#E2E8F0]">
              <p className="text-xs text-[#64748B]">아직 직접 만든 코스가 없습니다.</p>
              <button
                onClick={() => navigate('plan')}
                className="mt-3 px-4 py-2 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold"
              >
                새 코스 조립하기
              </button>
            </div>
          ) : (
            createdCourses.map(course => (
              <div
                key={course.id}
                onClick={() => handlePreview(course)}
                className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 hover:border-[#45C7F2] cursor-pointer"
              >
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-[#183B4E] truncate">{course.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-1">
                    <span className="text-[#006781] font-bold">{course.isPublic ? '커뮤니티 공개중' : '비공개'}</span>
                    <span>·</span>
                    <span>{course.items.length}개 스팟</span>
                  </div>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    navigate('plan');
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[#183B4E] text-[11px] font-bold shrink-0"
                >
                  수정
                </button>
              </div>
            ))
          )
        )}
      </div>

      {/* Logout button */}
      <div className="pt-4">
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-xs text-[#F24D4D] font-bold flex items-center justify-center gap-1.5 hover:bg-[#FEE2E2]/30 active:scale-98 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  );
};
