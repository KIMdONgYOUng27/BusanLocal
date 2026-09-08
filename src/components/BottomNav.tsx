import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, MapPin, MessageSquare, User } from 'lucide-react';
import { NavTab } from '../types';

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasBadge?: boolean;
}

const navItems: NavItemConfig[] = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'plan', label: '코스 조립', icon: MapPin },
  { id: 'discover', label: '경험 발견', icon: Compass, hasBadge: true },
  { id: 'community', label: '코스 피드', icon: MessageSquare },
  { id: 'mypage', label: '마이', icon: User }
];

export const BottomNav: React.FC = () => {
  const { activeTab, navigate } = useApp();

  return (
    <nav 
      aria-label="하단 내비게이션"
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#FFFFFF]/95 backdrop-blur-xl border-t border-[#E2E8F0] shadow-[0_-2px_12px_rgba(24,59,78,0.06)] max-w-[430px] mx-auto"
    >
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`group relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] h-full transition-all duration-150 active:scale-95 ${
                isActive ? 'text-[#183B4E] font-bold' : 'text-[#64748B] hover:text-[#183B4E]'
              }`}
              type="button"
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon Container with active rounded background */}
              <div 
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors duration-200 relative ${
                  isActive ? 'bg-[#45C7F2]' : 'bg-transparent group-hover:bg-[#F1F5F9]'
                }`}
              >
                <Icon 
                  className={`w-[21px] h-[21px] transition-transform group-active:scale-90 ${
                    isActive ? 'text-[#006781]' : 'text-[#64748B]'
                  }`} 
                />
                {item.hasBadge && (
                  <span className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-[#F24D4D] border border-white" />
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] tracking-tight mt-0.5 font-medium leading-none">
                {item.label}
              </span>

              {/* Bottom Dot Indicator */}
              <span 
                className={`absolute bottom-1 w-1 h-1 rounded-full bg-[#45C7F2] transition-transform duration-200 ${
                  isActive ? 'scale-100' : 'scale-0'
                }`} 
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
