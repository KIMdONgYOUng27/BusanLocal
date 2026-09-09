import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, navigate, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isLoading) return;
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      const msg = '이메일을 입력해주세요.';
      setErrorMessage(msg);
      showToast(msg);
      return;
    }
    if (!password) {
      const msg = '비밀번호를 입력해주세요.';
      setErrorMessage(msg);
      showToast(msg);
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(cleanEmail, password);
      if (!success) {
        setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.error('Login error in LoginView:', err);
      const msg = err?.message || '로그인 중 오류가 발생했습니다.';
      setErrorMessage(msg);
      showToast(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFFFFF] min-h-[780px]">
      <div>
        <button
          type="button"
          onClick={() => navigate('splash')}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#183B4E] hover:bg-[#F1F5F9]"
          title="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="mt-4 mb-8">
          <span className="text-xs font-bold text-[#006781] tracking-wider uppercase">Trip b Account</span>
          <h1 className="text-2xl font-extrabold text-[#183B4E] mt-1">로그인</h1>
          <p className="text-xs text-[#64748B] mt-1">나만의 부산 저장 코스와 뱃지를 확인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#183B4E]">이메일</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-[#94A3B8]" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="이메일 주소 입력"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#F8FAFC] text-xs text-[#183B4E] border border-[#E2E8F0] focus:outline-none focus:border-[#45C7F2]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#183B4E]">비밀번호</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3.5 text-[#94A3B8]" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#F8FAFC] text-xs text-[#183B4E] border border-[#E2E8F0] focus:outline-none focus:border-[#45C7F2]"
              />
            </div>
          </div>

          {/* Error Message Alert Box */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-xs font-medium leading-relaxed animate-in fade-in duration-150">
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all hover:bg-[#5BD4FF] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? '로그인 중...' : '로그인'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      <div className="text-center py-4">
        <span className="text-xs text-[#64748B]">아직 계정이 없으신가요? </span>
        <button
          onClick={() => navigate('signup')}
          className="text-xs font-bold text-[#006781] hover:underline"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};
