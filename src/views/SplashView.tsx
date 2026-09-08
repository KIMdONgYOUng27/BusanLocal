import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, ArrowRight } from 'lucide-react';

export const SplashView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between items-center px-6 py-12 bg-gradient-to-b from-[#183B4E] via-[#006781] to-[#183B4E] text-[#FFFFFF] min-h-[780px]">
      <div className="w-full flex justify-end">
        <button 
          onClick={() => navigate('home')}
          className="text-xs text-white/70 hover:text-white px-3 py-1 rounded-full bg-white/10"
        >
          둘러보기
        </button>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 max-w-xs">
        <div className="w-20 h-20 rounded-3xl bg-[#45C7F2] text-[#183B4E] flex items-center justify-center shadow-2xl animate-bounce">
          <Compass className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-[#BAEAFF]/20 text-[#45C7F2] text-xs font-bold tracking-widest uppercase">
            LocalFlow Busan
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            부산의 완벽한 하루를<br />
            <span className="text-[#45C7F2]">내 일정으로 복사</span>하세요
          </h1>
        </div>
        <p className="text-xs text-white/75 leading-relaxed">
          실시간 드론쇼와 일몰 골든타임, 로컬 검증 핫플레이스 동선까지 1초 만에 스마트 조립!
        </p>
      </div>

      <div className="w-full space-y-2.5 max-w-xs">
        <button
          onClick={() => navigate('login')}
          className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
        >
          <span>로그인하고 시작하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate('signup')}
          className="w-full h-12 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/15 active:scale-98 transition-all border border-white/20"
        >
          간편 회원가입
        </button>
      </div>
    </div>
  );
};
