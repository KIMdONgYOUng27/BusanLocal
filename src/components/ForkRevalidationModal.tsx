import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, AlertTriangle, X, Check, Sparkles, CheckCheck } from 'lucide-react';
import { mockDateOptions } from '../mock/mockData';

export const ForkRevalidationModal: React.FC = () => {
  const { forkModalCourse, closeForkModal, confirmForkCourse } = useApp();
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(1); // 목요일 9/26 기본 선택 (이벤트 변동 시연)
  const [replacementApplied, setReplacementApplied] = useState<boolean>(false);

  if (!forkModalCourse) return null;

  const currentOption = mockDateOptions[selectedDateIndex];
  const hasConflict = currentOption.hasEventChange && !replacementApplied;

  const handleApplyReplacement = () => {
    setReplacementApplied(true);
  };

  const handleConfirm = () => {
    confirmForkCourse(forkModalCourse, replacementApplied);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#183B4E]/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeForkModal}
    >
      <div 
        className="w-full max-w-[430px] bg-[#FFFFFF] rounded-t-3xl shadow-2xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-12 h-1 bg-[#E2E8F0] rounded-full self-center" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#BAEAFF] text-[#004D62] text-[11px] font-bold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              스마트 재검증 엔진
            </span>
            <h3 className="text-[17px] font-bold text-[#183B4E] mt-1.5 leading-snug">
              가져온 코스의 날짜를 변경하시겠습니까?
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 truncate">
              선택된 코스: {forkModalCourse.title}
            </p>
          </div>
          <button
            onClick={closeForkModal}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#183B4E] active:scale-95"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Travel Date Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[#183B4E] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#006781]" />
            여행 예정일 선택
          </label>
          <div className="grid grid-cols-3 gap-2">
            {mockDateOptions.map((opt, idx) => {
              const isSelected = selectedDateIndex === idx;
              return (
                <button
                  key={opt.dateStr}
                  type="button"
                  onClick={() => {
                    setSelectedDateIndex(idx);
                    if (idx !== 1) setReplacementApplied(false);
                  }}
                  className={`p-2.5 rounded-2xl text-center flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#183B4E] text-[#FFFFFF] shadow-md'
                      : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]'
                  }`}
                >
                  <span className={`text-[11px] font-normal ${isSelected ? 'text-white/80' : 'text-[#64748B]'}`}>
                    {opt.dayOfWeek}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#183B4E]'}`}>
                    {opt.dateStr}
                  </span>
                  <span 
                    className={`text-[10px] font-semibold ${
                      isSelected
                        ? opt.hasEventChange ? 'text-[#F1E1C1]' : 'text-[#45C7F2]'
                        : opt.hasEventChange ? 'text-[#F24D4D]' : 'text-[#006781]'
                    }`}
                  >
                    {opt.note}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conflict & Smart Replacement Alert Box */}
        {hasConflict ? (
          <div className="p-3.5 rounded-2xl bg-[#F3E3C3] text-[#183B4E] flex flex-col gap-3 border border-[#E2E8F0]">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-[#685D44] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <div className="text-xs font-bold text-[#183B4E]">
                  일정 내 운영되지 않는 스팟 발견
                </div>
                <p className="text-[12px] leading-relaxed text-[#183B4E]">
                  선택하신 <span className="font-bold underline">{currentOption.dateStr}({currentOption.dayOfWeek})</span>에는 정기 공연 휴무로 인해 <strong>'광안리 특별 드론쇼'</strong>가 운영되지 않습니다.
                </p>
              </div>
            </div>

            {/* System Proposed Replacement */}
            <div className="p-2.5 rounded-xl bg-[#FFFFFF] text-[#183B4E] flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-1.5 py-0.5 rounded bg-[#F1E1C1] text-[#221B07] text-[10px] font-bold shrink-0">
                  추천 대체
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">광안리 해변 버스킹 페스티벌</div>
                  <div className="text-[11px] text-[#64748B] truncate">도보 이동거리 동일 · 19:30 라이브 공연</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyReplacement}
                className="px-3 py-1.5 rounded-full bg-[#006781] text-[#FFFFFF] text-[11px] font-bold shrink-0 active:scale-95 shadow-xs"
              >
                대체 적용하기
              </button>
            </div>
          </div>
        ) : replacementApplied ? (
          /* Replacement Applied Success Notice */
          <div className="p-3 rounded-2xl bg-[#E6EEFF] text-[#183B4E] flex items-center gap-2.5 border border-[#BAEAFF]">
            <Check className="w-5 h-5 text-[#006781] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#183B4E]">코스 재검증 완료!</div>
              <div className="text-[11px] text-[#475569] truncate">
                대체 스팟('광안리 버스킹 페스티벌')이 반영되어 재검증되었습니다.
              </div>
            </div>
          </div>
        ) : (
          /* Normal Date Notice */
          <div className="p-3 rounded-2xl bg-[#E6EEFF] text-[#183B4E] flex items-center gap-2.5">
            <Check className="w-5 h-5 text-[#006781] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#183B4E]">일정 정상 검증 완료</div>
              <div className="text-[11px] text-[#475569]">
                모든 스팟과 이벤트가 정상 운영되는 날짜입니다.
              </div>
            </div>
          </div>
        )}

        {/* Action Footer Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={closeForkModal}
            className="flex-1 h-12 rounded-full bg-[#F1F5F9] text-[#183B4E] text-xs font-bold active:scale-95 transition-all"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-2 w-2/3 h-12 rounded-full bg-[#45C7F2] text-[#183B4E] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-[#5BD4FF]"
          >
            <CheckCheck className="w-4 h-4 text-[#183B4E]" />
            내 코스로 조립 완료
          </button>
        </div>
      </div>
    </div>
  );
};
