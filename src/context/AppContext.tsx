import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppScreen, NavTab, User, CourseItem, TripCourse, EventItem, Place } from '../types';
import { authService, getFriendlyAuthErrorMessage } from '../services/authService';
import { tripService } from '../services/tripService';
import { analyticsService } from '../services/analyticsService';
import { mockCourses, mockEvents } from '../mock/mockData';

interface AppContextType {
  currentScreen: AppScreen;
  activeTab: NavTab;
  screenParams: Record<string, any>;
  navigate: (screen: AppScreen, params?: Record<string, any>) => void;
  currentUser: User | null;
  activeCourseItems: CourseItem[];
  savedCourseIds: string[];
  savedEventIds: string[];
  toastMessage: string | null;
  forkModalCourse: TripCourse | null;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  showToast: (msg: string) => void;
  addPlaceToCourse: (place: Place) => void;
  removeCourseItem: (itemId: string) => void;
  moveCourseItem: (index: number, direction: 'up' | 'down') => void;
  toggleBookmarkCourse: (courseId: string) => void;
  toggleBookmarkEvent: (eventId: string) => void;
  openForkModal: (course: TripCourse) => void;
  closeForkModal: () => void;
  confirmForkCourse: (course: TripCourse, replacedWithAlternative?: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  allCourses: TripCourse[];
  saveNewCourse: (title: string) => Promise<boolean>;
  selectedEventForDetail: EventItem | null;
  setSelectedEventForDetail: (event: EventItem | null) => void;
  selectedCourseForDetail: TripCourse | null;
  setSelectedCourseForDetail: (course: TripCourse | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [activeTab, setActiveTabState] = useState<NavTab>('home');
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeCourseItems, setActiveCourseItems] = useState<CourseItem[]>([]);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(['course_top1']);
  const [savedEventIds, setSavedEventIds] = useState<string[]>(['event_drone']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [forkModalCourse, setForkModalCourse] = useState<TripCourse | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('부산 광안리/해운대');
  const [allCourses, setAllCourses] = useState<TripCourse[]>(mockCourses);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(mockEvents[0]);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<TripCourse | null>(mockCourses[0]);

  const loadMyCourses = async () => {
    try {
      const myCourses = await tripService.getMyCourses();
      if (myCourses && myCourses.length > 0) {
        setAllCourses(prev => {
          const myCourseIds = new Set(myCourses.map(c => c.id));
          const mockFiltered = prev.filter(c => !myCourseIds.has(c.id));
          return [...myCourses, ...mockFiltered];
        });
        setSavedCourseIds(prev => {
          const combined = new Set([...prev, ...myCourses.map(c => c.id)]);
          return Array.from(combined);
        });
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Initial load
    tripService.getActiveCourseItems().then(items => {
      setActiveCourseItems(items);
    });

    // Initial auth check
    authService.getCurrentUser().then(user => {
      if (user) {
        setCurrentUser(user);
        loadMyCourses();
      }
    });

    // Listen to Supabase auth state changes
    const subscription = authService.onAuthStateChange(user => {
      setCurrentUser(user);
      if (user) {
        loadMyCourses();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 8. 화면이 실제로 바뀔 때 screen_view를 비동기로 기록
    analyticsService.track('screen_view', {
      screenName: currentScreen,
    }).catch(() => {});
  }, [currentScreen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const navigate = (screen: AppScreen, params: Record<string, any> = {}) => {
    setScreenParams(params);
    setCurrentScreen(screen);

    // Sync tab when navigating to a top-level tab screen
    if (screen === 'home') setActiveTabState('home');
    else if (screen === 'plan') setActiveTabState('plan');
    else if (screen === 'discover') setActiveTabState('discover');
    else if (screen === 'community') setActiveTabState('community');
    else if (screen === 'mypage') setActiveTabState('mypage');
  };

  const addPlaceToCourse = async (place: Place) => {
    const updated = await tripService.addPlaceToCourse(place);
    setActiveCourseItems(updated);
    showToast(`'${place.name}' 코스에 추가되었습니다`);
    analyticsService.track('place_added_to_course', {
      screenName: currentScreen,
      resourceType: 'place',
      resourceId: place.id,
      metadata: { placeName: place.name },
    }).catch(() => {});
  };

  const removeCourseItem = async (itemId: string) => {
    const updated = await tripService.removeCourseItem(itemId);
    setActiveCourseItems(updated);
    showToast('장소가 코스에서 삭제되었습니다');
    analyticsService.track('place_removed_from_course', {
      screenName: currentScreen,
      resourceType: 'course_item',
      resourceId: itemId,
    }).catch(() => {});
  };

  const moveCourseItem = async (index: number, direction: 'up' | 'down') => {
    const updated = await tripService.moveCourseItem(index, direction);
    setActiveCourseItems(updated);
    analyticsService.track('course_item_moved', {
      screenName: currentScreen,
      resourceType: 'course_item',
      metadata: { index, direction },
    }).catch(() => {});
  };

  const toggleBookmarkCourse = (courseId: string) => {
    setSavedCourseIds(prev => {
      const exists = prev.includes(courseId);
      if (exists) {
        showToast('저장 코스에서 삭제되었습니다');
        analyticsService.track('course_unbookmarked', {
          screenName: currentScreen,
          resourceType: 'course',
          resourceId: courseId,
        }).catch(() => {});
        return prev.filter(id => id !== courseId);
      } else {
        showToast('내 저장 코스에 추가되었습니다 ⭐');
        analyticsService.track('course_bookmarked', {
          screenName: currentScreen,
          resourceType: 'course',
          resourceId: courseId,
        }).catch(() => {});
        return [...prev, courseId];
      }
    });
  };

  const toggleBookmarkEvent = (eventId: string) => {
    setSavedEventIds(prev => {
      const exists = prev.includes(eventId);
      if (exists) {
        showToast('이벤트 저장이 취소되었습니다');
        analyticsService.track('event_unbookmarked', {
          screenName: currentScreen,
          resourceType: 'event',
          resourceId: eventId,
        }).catch(() => {});
        return prev.filter(id => id !== eventId);
      } else {
        showToast('이벤트가 저장되었습니다 ⭐');
        analyticsService.track('event_bookmarked', {
          screenName: currentScreen,
          resourceType: 'event',
          resourceId: eventId,
        }).catch(() => {});
        return [...prev, eventId];
      }
    });
  };

  const openForkModal = (course: TripCourse) => {
    setForkModalCourse(course);
  };

  const closeForkModal = () => {
    setForkModalCourse(null);
  };

  const confirmForkCourse = async (course: TripCourse, replacedWithAlternative: boolean = false) => {
    const updated = await tripService.replaceCourseWithForked(course);
    setActiveCourseItems(updated);
    closeForkModal();
    showToast(
      replacedWithAlternative
        ? '🎉 대체 스팟이 반영되어 [코스 조립]으로 복제되었습니다!'
        : '🎉 코스가 [코스 조립]으로 성공적으로 복제되었습니다!'
    );
    navigate('plan');
    analyticsService.track('course_imported', {
      screenName: currentScreen,
      resourceType: 'course',
      resourceId: course.id,
      metadata: { courseTitle: course.title, replacedWithAlternative },
    }).catch(() => {});
  };

  const saveNewCourse = async (title: string): Promise<boolean> => {
    try {
      await tripService.saveCurrentCourse(title, selectedArea);
      await loadMyCourses();
      showToast('코스가 성공적으로 저장되었습니다 🎉');
      navigate('mypage');
      analyticsService.track('course_saved', {
        screenName: currentScreen,
        resourceType: 'course',
        metadata: { title, area: selectedArea },
      }).catch(() => {});
      return true;
    } catch (err: any) {
      let message = err?.message || '코스 저장 중 오류가 발생했습니다.';
      if (message === '로그인이 필요합니다.') {
        message = '로그인이 필요합니다. 먼저 로그인해주세요.';
      }
      showToast(message);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { user, error } = await authService.login(email, password);
    if (error) {
      showToast(getFriendlyAuthErrorMessage(error));
      return false;
    }
    if (user) {
      setCurrentUser(user);
      showToast(`${user.name}님 환영합니다!`);
      await loadMyCourses();
      navigate('home');
      analyticsService.track('login_succeeded', {
        screenName: 'login',
        resourceType: 'auth',
        resourceId: user.id,
      }).catch(() => {});
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const { user, needsEmailVerification, error } = await authService.signup(name, email, password);
    if (error) {
      showToast(getFriendlyAuthErrorMessage(error));
      return false;
    }

    if (needsEmailVerification) {
      showToast('인증 이메일을 확인해주세요');
      navigate('login');
      return true;
    }

    if (user) {
      setCurrentUser(user);
      showToast(`${user.name}님 가입을 축하드립니다!`);
      navigate('home');
      return true;
    }

    showToast('회원가입이 완료되었습니다. 로그인해주세요.');
    navigate('login');
    return true;
  };

  const logout = async () => {
    const { error } = await authService.logout();
    if (error) {
      showToast(getFriendlyAuthErrorMessage(error));
    }
    setCurrentUser(null);
    showToast('로그아웃 되었습니다');
    navigate('login');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        activeTab,
        screenParams,
        navigate,
        currentUser,
        activeCourseItems,
        savedCourseIds,
        savedEventIds,
        toastMessage,
        forkModalCourse,
        selectedArea,
        setSelectedArea,
        showToast,
        addPlaceToCourse,
        removeCourseItem,
        moveCourseItem,
        toggleBookmarkCourse,
        toggleBookmarkEvent,
        openForkModal,
        closeForkModal,
        confirmForkCourse,
        login,
        signup,
        logout,
        allCourses,
        saveNewCourse,
        selectedEventForDetail,
        setSelectedEventForDetail,
        selectedCourseForDetail,
        setSelectedCourseForDetail
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
