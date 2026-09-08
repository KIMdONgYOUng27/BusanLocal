import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';

export const SignupView: React.FC = () => {
  const { signup, navigate } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signup(name, email);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFFFFF] min-h-[780px]">
      <div>
        <button
          onClick={() => navigate('login')}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#183B4E] hover:bg-[#F1F5F9]"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="mt-4 mb-8">
          <span className="text-xs font-bold text-[#006781] tracking-wider uppercase">Welcome</span>
          <h1 className="text-2xl font-extrabold text-[#183B4E] mt-1">회원가입</h1>
          <p className="text-xs text-[#64748B] mt-1">부산 로컬 여행의 새로운 흐름을 경험하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#183B4E]">닉네임</label>
            <div className="relative flex items-center">
              <UserIcon className="w-4 h-4 absolute left-3.5 text-[#94A3B8]" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="예: 부산갈매기"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#F8FAFC] text-xs text-[#183B4E] border border-[#E2E8F0] focus:outline-none focus:border-[#45C7F2]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#183B4E]">이메일</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-[#94A3B8]" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
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
                placeholder="6자리 이상 입력"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#F8FAFC] text-xs text-[#183B4E] border border-[#E2E8F0] focus:outline-none focus:border-[#45C7F2]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[#45C7F2] text-[#183B4E] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all hover:bg-[#5BD4FF]"
            >
              <span>{isLoading ? '가입 진행 중...' : '회원가입 완료'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      <div className="text-center py-4">
        <span className="text-xs text-[#64748B]">이미 계정이 있으신가요? </span>
        <button
          onClick={() => navigate('login')}
          className="text-xs font-bold text-[#006781] hover:underline"
        >
          로그인
        </button>
      </div>
    </div>
  );
};
