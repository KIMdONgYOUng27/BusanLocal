import React from 'react';
import { AppProvider, useApp, PROTECTED_SCREENS } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { ForkRevalidationModal } from './components/ForkRevalidationModal';

// Views
import { SplashView } from './views/SplashView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import { HomeView } from './views/HomeView';
import { PlanCourseBuilderView } from './views/PlanCourseBuilderView';
import { CourseResultView } from './views/CourseResultView';
import { CourseDetailView } from './views/CourseDetailView';
import { DiscoverEventsView } from './views/DiscoverEventsView';
import { EventDetailView } from './views/EventDetailView';
import { CommunityFeedView } from './views/CommunityFeedView';
import { CommunityCourseDetailView } from './views/CommunityCourseDetailView';
import { MyPageView } from './views/MyPageView';

const AppContent: React.FC = () => {
  const { currentScreen, currentUser, isAuthLoading } = useApp();

  // 앱이 처음 실행되면 Supabase 세션 확인이 끝날 때까지 SplashView 또는 로딩 화면 표시
  if (isAuthLoading || currentScreen === 'splash') {
    return (
      <div className="w-full min-h-screen bg-[#E2E8F0]/30 flex justify-center items-start">
        <div className="w-full max-w-[430px] min-h-screen bg-[#F8FAFF] relative flex flex-col shadow-2xl overflow-x-hidden border-x border-[#E2E8F0]">
          <SplashView />
          <Toast />
        </div>
      </div>
    );
  }

  // Full-screen auth flows
  if (currentScreen === 'login') {
    return (
      <div className="w-full min-h-screen bg-[#E2E8F0]/30 flex justify-center items-start">
        <div className="w-full max-w-[430px] min-h-screen bg-[#F8FAFF] relative flex flex-col shadow-2xl overflow-x-hidden border-x border-[#E2E8F0]">
          <LoginView />
          <Toast />
        </div>
      </div>
    );
  }
  if (currentScreen === 'signup') {
    return (
      <div className="w-full min-h-screen bg-[#E2E8F0]/30 flex justify-center items-start">
        <div className="w-full max-w-[430px] min-h-screen bg-[#F8FAFF] relative flex flex-col shadow-2xl overflow-x-hidden border-x border-[#E2E8F0]">
          <SignupView />
          <Toast />
        </div>
      </div>
    );
  }

  // 보호된 화면 이중 방어: currentUser가 없으면 보호된 화면을 렌더링하지 않고 LoginView 표시
  if (!currentUser && PROTECTED_SCREENS.includes(currentScreen)) {
    return (
      <div className="w-full min-h-screen bg-[#E2E8F0]/30 flex justify-center items-start">
        <div className="w-full max-w-[430px] min-h-screen bg-[#F8FAFF] relative flex flex-col shadow-2xl overflow-x-hidden border-x border-[#E2E8F0]">
          <LoginView />
          <Toast />
        </div>
      </div>
    );
  }

  // App screens with standard shell
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeView />;
      case 'plan':
        return <PlanCourseBuilderView />;
      case 'course_result':
        return <CourseResultView />;
      case 'course_detail':
        return <CourseDetailView />;
      case 'discover':
        return <DiscoverEventsView />;
      case 'event_detail':
        return <EventDetailView />;
      case 'community':
        return <CommunityFeedView />;
      case 'community_course_detail':
        return <CommunityCourseDetailView />;
      case 'mypage':
        return <MyPageView />;
      default:
        return <HomeView />;
    }
  };

  const showHeader = !['course_result', 'course_detail', 'event_detail', 'community_course_detail'].includes(currentScreen);
  const showBottomNav = Boolean(currentUser && !['splash', 'login', 'signup'].includes(currentScreen));

  return (
    <div className="w-full min-h-screen bg-[#E2E8F0]/30 flex justify-center items-start">
      <div className="w-full max-w-[430px] min-h-screen bg-[#F8FAFF] relative flex flex-col shadow-2xl overflow-x-hidden border-x border-[#E2E8F0]">
        {showHeader && <Header />}
        
        <main className={`flex-1 flex flex-col ${showHeader ? 'pt-16' : ''}`}>
          {renderScreen()}
        </main>

        {showBottomNav && <BottomNav />}

        {/* Global Modals & Notifications */}
        <ForkRevalidationModal />
        <Toast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
