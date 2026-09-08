import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppScreen, NavTab, User, CourseItem, TripCourse, EventItem, Place } from '../types';
import { authService } from '../services/authService';
import { tripService } from '../services/tripService';
import { mockCourses, mockCurrentUser, mockEvents } from '../mock/mockData';

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
  login: (email: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  logout: () => void;
  allCourses: TripCourse[];
  saveNewCourse: (title: string) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(mockCurrentUser);
  const [activeCourseItems, setActiveCourseItems] = useState<CourseItem[]>([]);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(['course_top1']);
  const [savedEventIds, setSavedEventIds] = useState<string[]>(['event_drone']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [forkModalCourse, setForkModalCourse] = useState<TripCourse | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('부산 광안리/해운대');
  const [allCourses, setAllCourses] = useState<TripCourse[]>(mockCourses);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(mockEvents[0]);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<TripCourse | null>(mockCourses[0]);

  useEffect(() => {
    // Initial load
    tripService.getActiveCourseItems().then(items => {
      setActiveCourseItems(items);
    });
  }, []);

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
  };

  const removeCourseItem = async (itemId: string) => {
    const updated = await tripService.removeCourseItem(itemId);
    setActiveCourseItems(updated);
    showToast('장소가 코스에서 삭제되었습니다');
  };

  const moveCourseItem = async (index: number, direction: 'up' | 'down') => {
    const updated = await tripService.moveCourseItem(index, direction);
    setActiveCourseItems(updated);
  };

  const toggleBookmarkCourse = (courseId: string) => {
    setSavedCourseIds(prev => {
      const exists = prev.includes(courseId);
      if (exists) {
        showToast('저장 코스에서 삭제되었습니다');
        return prev.filter(id => id !== courseId);
      } else {
        showToast('내 저장 코스에 추가되었습니다 ⭐');
        return [...prev, courseId];
      }
    });
  };

  const toggleBookmarkEvent = (eventId: string) => {
    setSavedEventIds(prev => {
      const exists = prev.includes(eventId);
      if (exists) {
        showToast('이벤트 저장이 취소되었습니다');
        return prev.filter(id => id !== eventId);
      } else {
        showToast('이벤트가 저장되었습니다 ⭐');
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
  };

  const saveNewCourse = async (title: string) => {
    const created = await tripService.saveCurrentCourse(title, selectedArea);
    setAllCourses(prev => [created, ...prev]);
    setSavedCourseIds(prev => [created.id, ...prev]);
    showToast('코스가 성공적으로 저장되었습니다 🎉');
    navigate('mypage');
  };

  const login = async (email: string) => {
    const user = await authService.login(email);
    setCurrentUser(user);
    showToast(`${user.name}님 환영합니다!`);
    navigate('home');
  };

  const signup = async (name: string, email: string) => {
    const user = await authService.signup(name, email);
    setCurrentUser(user);
    showToast(`${user.name}님 가입을 축하드립니다!`);
    navigate('home');
  };

  const logout = () => {
    authService.logout();
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
