import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
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
    myCourses,
    savedCourseIds, 
    logout, 
    navigate, 
    openForkModal,
    setSelectedCourseForDetail,
    publishCourse,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'saved' | 'created'>('saved');

  // 1. '저장한 코스': saved_courses에 찜/저장한 코스만 표시
  const savedCourses = allCourses.filter(c => savedCourseIds.includes(c.id));

  // 2. '내가 만든 코스': '내 코스 저장'을 통해 trips 테이블에 생성된 내 코스만 표시
  const createdCourses = myCourses.length > 0
    ? myCourses
    : allCourses.filter(
        c => currentUser && (c.author.id === currentUser.id || (c.author.id === 'me' && c.author.name === currentUser.name))
      );

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
            <UserAvatar
              src={currentUser?.avatar}
              alt={currentUser?.name || '유저'}
              className="w-14 h-14 border-2 border-[#45C7F2] shadow-xs"
              iconClassName="w-7 h-7 text-[#64748B]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-[#183B4E]">{currentUser?.name || '부산여행자'}</h1>
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
          {currentUser?.bio || '부산 구석구석을 여행하는 여행자입니다 🌊'}
        </p>

        {/* User Activity Stats */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center border-t border-[#F1F5F9]">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#183B4E]">{savedCourses.length}</span>
            <span className="text-[10px] text-[#64748B]">저장한 코스</span>
          </div>
          <div className="flex flex-col border-x border-[#E2E8F0]">
            <span className="text-sm font-bold text-[#006781]">{currentUser?.forkedCount || 0}</span>
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
                  className="px-3 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold shrink-0 hover:bg-[#5BD4FF] active:scale-95 transition-all"
                >
                  일정에 추가
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
                    <span 
                      onClick={e => {
                        if (!course.isPublic) {
                          e.stopPropagation();
                          publishCourse(course.id);
                        }
                      }}
                      className={`font-bold ${course.isPublic ? 'text-[#006781]' : 'text-[#64748B] hover:text-[#006781] underline cursor-pointer'}`}
                    >
                      {course.isPublic ? '커뮤니티 공개중' : '비공개 (공개하기)'}
                    </span>
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
