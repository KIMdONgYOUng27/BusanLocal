import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Calendar, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  PartyPopper, 
  Copy, 
  ChevronRight, 
  Clock, 
  Bookmark, 
  Star, 
  Plus, 
  Check, 
  GitFork 
} from 'lucide-react';
import { mockCourses, mockEvents } from '../mock/mockData';

export const HomeView: React.FC = () => {
  const { 
    currentUser, 
    navigate, 
    showToast, 
    openForkModal, 
    addPlaceToCourse, 
    allCourses, 
    setSelectedEventForDetail,
    setSelectedCourseForDetail 
  } = useApp();

  const handleAddEventToRoute = (eventTitle: string, eventId: string) => {
    const foundEvent = mockEvents.find(e => e.id === eventId);
    if (foundEvent) {
      addPlaceToCourse({
        id: `place_event_${foundEvent.id}`,
        name: foundEvent.title,
        category: '문화예술',
        area: foundEvent.area,
        address: foundEvent.address,
        image: foundEvent.image,
        description: foundEvent.subtitle,
        tags: foundEvent.badges,
        stayDurationMinutes: 40
      });
    } else {
      showToast(`'${eventTitle}' 코스 보관함에 담김!`);
    }
  };

  const handlePreviewCourse = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId) || allCourses[0];
    setSelectedCourseForDetail(course);
    navigate('course_detail', { courseId });
  };

  return (
    <div className="flex flex-col w-full pb-6 space-y-6 pt-2">
      {/* Top Greeting & Context Bar */}
      <section className="px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6EEFF] text-[#006781] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#45C7F2] animate-pulse" />
              실시간 로컬 큐레이션 ON
            </span>
            <h1 className="text-[22px] font-extrabold text-[#183B4E] tracking-tight">
              안녕하세요, {currentUser?.name || '수진'}님! 👋
            </h1>
            <p className="text-xs text-[#475569]">
              이번 주말 부산에서 뭐 하지?
            </p>
          </div>

          {/* Weather Widget */}
          <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#DCE9FF] shadow-xs">
            <Sun className="w-6 h-6 text-[#183B4E]" />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#45C7F2] text-[#183B4E] text-[10px] font-bold shadow-xs">
              24°
            </span>
          </div>
        </div>

        {/* Quick Date/Zone Trigger */}
        <div className="mt-3.5 flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Calendar className="w-4 h-4 text-[#006781] shrink-0" />
            <span className="text-xs font-bold text-[#183B4E] truncate">
              9월 19일 (토) · 광안리·해운대 권역
            </span>
          </div>
          <button 
            onClick={() => showToast('권역 및 날짜 설정 창이 열립니다')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F1F5F9] text-[#64748B] text-[11px] font-medium active:scale-95 transition-all"
          >
            <span>변경</span>
            <SlidersHorizontal className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* AI Smart Recommendation Hero Banner */}
      <section className="px-4">
        <div className="relative overflow-hidden rounded-3xl bg-[#F3E3C3] text-[#183B4E] shadow-sm p-4.5 border border-[#E2E8F0]">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#45C7F2]/25 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#006781] text-[#FFFFFF] text-[11px] font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-[#45C7F2]" />
                AI 코스 인텔리전스
              </span>
              <span className="text-[11px] text-[#183B4E]/80 font-bold">D-DAY 한정</span>
            </div>

            <div>
              <h2 className="text-[17px] font-bold text-[#183B4E] leading-snug">
                9/19 광안리 드론쇼 당일! ✨<br />
                인파 피하는 갓벽 동선
              </h2>
              <p className="text-[12px] text-[#183B4E]/80 mt-1">
                해변가 카페 좌석 확보부터 옥상 뷰포인트까지 3.4km 최단 도보
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={() => navigate('plan')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#183B4E] text-[#FFFFFF] text-xs font-bold shadow-sm active:scale-98 transition-all hover:bg-[#233144]"
              >
                <span>동선 코스짜기</span>
                <ArrowRight className="w-4 h-4 text-[#45C7F2]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Action Grid (3 Column) */}
      <section className="px-4">
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => navigate('plan')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs active:scale-95 transition-all text-center"
          >
            <div className="w-11 h-11 rounded-full bg-[#E6EEFF] flex items-center justify-center mb-1.5 group-hover:bg-[#45C7F2] transition-colors">
              <MapPin className="w-5 h-5 text-[#006781]" />
            </div>
            <span className="text-xs font-bold text-[#183B4E] leading-tight">코스 만들기</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">D.I.Y 조립</span>
          </button>

          <button
            onClick={() => navigate('discover')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs active:scale-95 transition-all text-center"
          >
            <div className="w-11 h-11 rounded-full bg-[#F3E3C3] flex items-center justify-center mb-1.5 group-hover:bg-[#F1E1C1] transition-colors">
              <PartyPopper className="w-5 h-5 text-[#685D44]" />
            </div>
            <span className="text-xs font-bold text-[#183B4E] leading-tight">팝업 & 축제</span>
            <span className="text-[10px] text-[#F24D4D] font-bold mt-0.5">실시간 14개</span>
          </button>

          <button
            onClick={() => navigate('community')}
            className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs active:scale-95 transition-all text-center"
          >
            <div className="w-11 h-11 rounded-full bg-[#E6EEFF] flex items-center justify-center mb-1.5 group-hover:bg-[#45C7F2] transition-colors">
              <Copy className="w-5 h-5 text-[#006781]" />
            </div>
            <span className="text-xs font-bold text-[#183B4E] leading-tight">인기 코스</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">Top 50</span>
          </button>
        </div>
      </section>

      {/* Section: DISCOVER Live Carousel */}
      <section className="flex flex-col space-y-2.5">
        <div className="px-4 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F24D4D] animate-ping" />
              <span className="text-[10px] font-extrabold text-[#F24D4D] uppercase tracking-wider">
                DISCOVER NOW
              </span>
            </div>
            <h2 className="text-[17px] font-bold text-[#183B4E] mt-0.5">
              지금 부산 날짜 한정 경험
            </h2>
          </div>
          <button
            onClick={() => navigate('discover')}
            className="text-xs text-[#64748B] flex items-center gap-0.5 font-medium hover:text-[#183B4E]"
          >
            <span>전체보기</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex overflow-x-auto gap-3 px-4 no-scrollbar snap-x snap-mandatory">
          {/* Card 1: Drone Show */}
          <article className="snap-start shrink-0 w-[240px] rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
            <div className="relative h-32 w-full overflow-hidden bg-[#183B4E]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmbVo1wJreNYHUTZKdis3NCHguLdr2s6rZoaAkInGGIONaMyCR8qDw3fhP93SzJs_i7tAq_RA0z_pXur6ovxsJTIAaLwWn1iwN0jS0wEEyOBH7OsglJL8QkDRLDJibsoVtBnq9d89VU2SgGstMu1z__jZ9-o3jVsUlwDPyd9atVVKZX_CH3XzvbIGAz_qY9_4Ph-7jDgy34nQIO2aDwekYDuBgYoyHLHGC4X297EF90myvj5q2airMKA"
                alt="광안리 M 드론 라이트쇼"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#F24D4D] text-white text-[10px] font-bold">
                잔여 3일
              </span>
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                19:30 - 20:00
              </span>
            </div>
            <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
              <div>
                <div className="flex items-center gap-1 text-[#64748B] text-[11px] mb-0.5">
                  <MapPin className="w-3 h-3 text-[#006781]" />
                  <span className="truncate">광안리 해수욕장 백사장</span>
                </div>
                <h3 className="text-xs font-bold text-[#183B4E] truncate">
                  광안리 M 드론 라이트쇼
                </h3>
                <p className="text-[11px] text-[#475569] line-clamp-1 mt-0.5">
                  가을 맞이 스페셜 테마 비행 & 음악 연출
                </p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#006781] font-bold">무료 관람</span>
                <button
                  onClick={() => handleAddEventToRoute('광안리 M 드론 라이트쇼', 'event_drone')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold active:scale-95 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>코스담기</span>
                </button>
              </div>
            </div>
          </article>

          {/* Card 2: Flea Market */}
          <article className="snap-start shrink-0 w-[240px] rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
            <div className="relative h-32 w-full overflow-hidden bg-[#183B4E]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFi5BmWLZf9Yz0vT3Wwj7roGn_nK5-gTVotMEZu6mIZujAnuUxJn8AMpDg09blZVKzL0ak76QtP_JQ7Cp72L2iOtR62-wrvwi9QHcLpp4SKCpl_739PaWwVUkkaur6E6_l2JvP2lzk1nFFbU1JA9Ws2N44ySuQVVM9r3QAtwMX42Ov0lwTBaCmfiW-8_5lcMm0v41IW-3Tgn1boVCOy82YtaaFPfnoae8eygUwgJqxQEz6ljxj0x_RoA"
                alt="밀락더마켓 플리마켓"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#F3E3C3] text-[#183B4E] text-[10px] font-bold">
                이번 주말 한정
              </span>
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                14:00 - 21:00
              </span>
            </div>
            <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
              <div>
                <div className="flex items-center gap-1 text-[#64748B] text-[11px] mb-0.5">
                  <MapPin className="w-3 h-3 text-[#006781]" />
                  <span className="truncate">밀락더마켓 수변 스퀘어</span>
                </div>
                <h3 className="text-xs font-bold text-[#183B4E] truncate">
                  가을 로컬 플리마켓
                </h3>
                <p className="text-[11px] text-[#475569] line-clamp-1 mt-0.5">
                  부산 로컬 맥주 브루어리 & 디저트 마켓
                </p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#183B4E] font-bold">입장 무료</span>
                <button
                  onClick={() => handleAddEventToRoute('가을 로컬 플리마켓', 'event_millac_popup')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold active:scale-95 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>코스담기</span>
                </button>
              </div>
            </div>
          </article>

          {/* Card 3: Coastal Train */}
          <article className="snap-start shrink-0 w-[240px] rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs overflow-hidden flex flex-col">
            <div className="relative h-32 w-full overflow-hidden bg-[#183B4E]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtXDs32YFVJclzQ2roWOAjzOYEzAhJoNWJWzAGiSku-4i_L-RqF4eid6WhHtte4-ZESJ-OaFuRZbRaWk2_1n9-eTvEI_gN_0E2HAVI_uskLAPtmMmdLyp1EiE-1kN60SxWulI61-vWFKbz83cd5GBl7s17qW6ZCeta13P3iQXX4INdgBU_rg5Ih2OEghtisUqrqLdkGZSECxXQQyMxTGE4IbtLSQJorsROAAXlXYD-d6Zay-67irL-zQ"
                alt="청사포 해변열차"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#006781] text-white text-[10px] font-bold">
                선셋 골든아워
              </span>
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium">
                17:30 출발 예약
              </span>
            </div>
            <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
              <div>
                <div className="flex items-center gap-1 text-[#64748B] text-[11px] mb-0.5">
                  <MapPin className="w-3 h-3 text-[#006781]" />
                  <span className="truncate">해운대 블루라인파크</span>
                </div>
                <h3 className="text-xs font-bold text-[#183B4E] truncate">
                  청사포 해변열차 투어
                </h3>
                <p className="text-[11px] text-[#475569] line-clamp-1 mt-0.5">
                  노을 속 감성 오션뷰 & 조개구이 골목 연계
                </p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#183B4E] font-bold">잔여 8매</span>
                <button
                  onClick={() => handleAddEventToRoute('청사포 해변열차 투어', 'place_cheongsapo')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold active:scale-95 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>코스담기</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Section: SHARE Top Itineraries */}
      <section className="px-4 flex flex-col space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-[#006781] uppercase tracking-wider">
              COMMUNITY VERIFIED
            </span>
            <h2 className="text-[17px] font-bold text-[#183B4E] mt-0.5">
              이번 주 가장 많이 가져간 코스
            </h2>
          </div>
          <span className="text-[11px] text-[#64748B]">매시간 갱신</span>
        </div>

        {/* Course Card 1 */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#F3E3C3] text-[#183B4E] text-[10px] font-bold">
                  인기 1위
                </span>
                <span className="text-[11px] text-[#64748B]">데이트 & 로컬 맛집</span>
              </div>
              <h3 className="text-sm font-bold text-[#183B4E] truncate">
                부산 처음 오는 연인과 1박 2일
              </h3>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#183B4E] text-xs shrink-0 border border-[#E2E8F0]">
              <Star className="w-3.5 h-3.5 text-[#685D44] fill-[#685D44]" />
              <span className="font-bold">4.9</span>
              <span className="text-[#64748B] text-[11px]">(142)</span>
            </div>
          </div>

          {/* Mini-Timeline */}
          <div className="p-2.5 rounded-2xl bg-[#F8FAFC] flex items-center justify-between text-center overflow-x-auto no-scrollbar border border-[#E2E8F0]">
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#183B4E] text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">해운대 브런치</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#183B4E] text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">동백섬 산책</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#183B4E] text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">요트선셋투어</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#45C7F2] text-[#183B4E] flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">광안리 와인</span>
            </div>
          </div>

          {/* Meta & Action Row */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-2.5 text-[#64748B] text-[11px] shrink-0">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-[#006781]" />
                총 5시간 30분
              </span>
              <span className="flex items-center gap-0.5">
                <Bookmark className="w-3 h-3 text-[#F24D4D]" />
                932회
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handlePreviewCourse('course_couple_2d1n')}
                className="px-2.5 py-1.5 rounded-full bg-[#F1F5F9] text-[#183B4E] text-[11px] font-bold active:scale-95 transition-all"
              >
                미리보기
              </button>
              <button
                onClick={() => openForkModal(allCourses[0])}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold active:scale-95 transition-all shadow-xs"
              >
                <GitFork className="w-3 h-3" />
                <span>가져오기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Course Card 2 */}
        <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex flex-col space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#BAEAFF] text-[#004D62] text-[10px] font-bold">
                  축제 당일 추천
                </span>
                <span className="text-[11px] text-[#64748B]">알짜 뚜벅이 코스</span>
              </div>
              <h3 className="text-sm font-bold text-[#183B4E] truncate">
                광안리 행사 당일 알짜 동선
              </h3>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#183B4E] text-xs shrink-0 border border-[#E2E8F0]">
              <Star className="w-3.5 h-3.5 text-[#685D44] fill-[#685D44]" />
              <span className="font-bold">4.8</span>
              <span className="text-[#64748B] text-[11px]">(98)</span>
            </div>
          </div>

          {/* Mini-Timeline */}
          <div className="p-2.5 rounded-2xl bg-[#F8FAFC] flex items-center justify-between text-center overflow-x-auto no-scrollbar border border-[#E2E8F0]">
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#183B4E] text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">밀락더마켓</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#183B4E] text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">민락수변 뷰</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#183B4E] text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">드론쇼 관람</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <div className="flex flex-col items-center min-w-[58px]">
              <span className="w-5 h-5 rounded-full bg-[#45C7F2] text-[#183B4E] flex items-center justify-center text-[10px] font-bold">4</span>
              <span className="text-[10px] text-[#183B4E] mt-1 font-semibold truncate w-14">남천동 심야</span>
            </div>
          </div>

          {/* Meta & Action Row */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex items-center gap-2.5 text-[#64748B] text-[11px] shrink-0">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-[#006781]" />
                총 5시간 30분
              </span>
              <span className="flex items-center gap-0.5">
                <Bookmark className="w-3 h-3 text-[#F24D4D]" />
                932회
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handlePreviewCourse('course_top1')}
                className="px-2.5 py-1.5 rounded-full bg-[#F1F5F9] text-[#183B4E] text-[11px] font-bold active:scale-95 transition-all"
              >
                미리보기
              </button>
              <button
                onClick={() => openForkModal(allCourses[0])}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#45C7F2] text-[#183B4E] text-[11px] font-bold active:scale-95 transition-all shadow-xs"
              >
                <GitFork className="w-3 h-3" />
                <span>가져오기</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
