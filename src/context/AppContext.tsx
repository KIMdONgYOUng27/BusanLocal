import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppScreen, NavTab, User, CourseItem, TripCourse, EventItem, Place } from '../types';
import { authService, getFriendlyAuthErrorMessage } from '../services/authService';
import { tripService } from '../services/tripService';
import { communityService, isUuid } from '../services/communityService';
import { analyticsService } from '../services/analyticsService';
import { mockCourses, mockEvents } from '../mock/mockData';
import { supabase } from '../lib/supabase';

export const PROTECTED_SCREENS: AppScreen[] = [
  'home',
  'plan',
  'course_result',
  'course_detail',
  'discover',
  'event_detail',
  'community',
  'community_course_detail',
  'mypage',
];

interface AppContextType {
  isAuthLoading: boolean;
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
  toggleBookmarkCourse: (courseId: string) => Promise<void>;
  toggleBookmarkEvent: (eventId: string) => Promise<void>;
  openForkModal: (course: TripCourse) => void;
  closeForkModal: () => void;
  confirmForkCourse: (course: TripCourse, replacedWithAlternative?: boolean) => Promise<void>;
  publishCourse: (courseId: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  allCourses: TripCourse[];
  myCourses: TripCourse[];
  saveNewCourse: (title: string, isPublic?: boolean) => Promise<boolean>;
  selectedEventForDetail: EventItem | null;
  setSelectedEventForDetail: (event: EventItem | null) => void;
  selectedCourseForDetail: TripCourse | null;
  setSelectedCourseForDetail: (course: TripCourse | null) => void;
  refreshCommunity: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [activeTab, setActiveTabState] = useState<NavTab>('home');
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeCourseItems, setActiveCourseItems] = useState<CourseItem[]>([]);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [forkModalCourse, setForkModalCourse] = useState<TripCourse | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('부산 광안리/해운대');
  const [allCourses, setAllCourses] = useState<TripCourse[]>(mockCourses);
  const [myCourses, setMyCourses] = useState<TripCourse[]>([]);
  const [lastImportedSourceId, setLastImportedSourceId] = useState<string | null>(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(mockEvents[0]);
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<TripCourse | null>(mockCourses[0]);

  const loadCommunityCourses = async () => {
    try {
      const publicCourses = await communityService.getPublicCourses();
      setAllCourses(publicCourses);
    } catch {
      // ignore
    }
  };

  const loadMyCourses = async () => {
    try {
      const fetchedMyCourses = await tripService.getMyCourses();
      setMyCourses(fetchedMyCourses || []);
      if (fetchedMyCourses && fetchedMyCourses.length > 0) {
        setAllCourses(prev => {
          const myCourseIds = new Set(fetchedMyCourses.map(c => c.id));
          const mockFiltered = prev.filter(c => !myCourseIds.has(c.id));
          return [...fetchedMyCourses, ...mockFiltered];
        });
      }
    } catch {
      // ignore
    }
  };

  const loadSavedItems = async (userId: string) => {
    try {
      // 1. saved_events 복원
      const { data: savedEventsData } = await supabase
        .from('saved_events')
        .select('event_id')
        .eq('user_id', userId);

      if (savedEventsData) {
        setSavedEventIds(savedEventsData.map(r => r.event_id).filter(Boolean));
      }

      // 2. saved_courses 복원
      const { data: savedCoursesData } = await supabase
        .from('saved_courses')
        .select('trip_id, external_course_id, course_snapshot')
        .eq('user_id', userId);

      if (savedCoursesData) {
        setSavedCourseIds(
          savedCoursesData
            .map(r => r.trip_id || r.external_course_id)
            .filter(Boolean)
        );

        // 스냅샷이 있는 경우 allCourses에 없는 항목도 복원
        const snapshots = savedCoursesData
          .map(r => r.course_snapshot)
          .filter(Boolean) as TripCourse[];
        if (snapshots.length > 0) {
          setAllCourses(prev => {
            const existingIds = new Set(prev.map(c => c.id));
            const newOnes = snapshots.filter(s => s && s.id && !existingIds.has(s.id));
            return [...prev, ...newOnes];
          });
        }
      }
    } catch (err) {
      console.error('loadSavedItems error:', err);
    }
  };

  const refreshUserData = async (user: User) => {
    await Promise.all([
      loadMyCourses(),
      loadSavedItems(user.id),
      loadCommunityCourses(),
    ]);
  };

  useEffect(() => {
    let isMounted = true;

    // Public community courses load
    loadCommunityCourses();

    // Initial auth check with loading state
    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!isMounted) return;

        if (user) {
          setCurrentUser(user);
          await refreshUserData(user);
          // Only load active items if logged in
          const items = await tripService.getActiveCourseItems();
          if (isMounted) {
            setActiveCourseItems(items);
            setCurrentScreen('home');
            setActiveTabState('home');
          }
        } else {
          setCurrentUser(null);
          setSavedCourseIds([]);
          setSavedEventIds([]);
          setActiveCourseItems([]);
          if (isMounted) {
            setCurrentScreen('login');
          }
        }
      } catch (err) {
        console.error('Initial auth check error:', err);
        if (isMounted) {
          setCurrentUser(null);
          setSavedCourseIds([]);
          setSavedEventIds([]);
          setActiveCourseItems([]);
          setCurrentScreen('login');
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen to Supabase auth state changes
    const subscription = authService.onAuthStateChange(async user => {
      if (user) {
        setCurrentUser(user);
        await refreshUserData(user);
      } else {
        setCurrentUser(null);
        setSavedCourseIds([]);
        setSavedEventIds([]);
        setActiveCourseItems([]);
        tripService.clearActiveCourseItems();
        setAllCourses(mockCourses);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 화면 전환 시 screen_view 비동기 기록
    analyticsService.track('screen_view', {
      screenName: currentScreen,
    }).catch(() => {});
  }, [currentScreen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const navigate = (screen: AppScreen, params: Record<string, any> = {}) => {
    // 보호된 화면 접근 검사
    if (PROTECTED_SCREENS.includes(screen) && !currentUser) {
      showToast('로그인이 필요합니다');
      setCurrentScreen('login');
      return;
    }

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

  const toggleBookmarkCourse = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('로그인이 필요합니다');
      return;
    }

    const isCurrentlySaved = savedCourseIds.includes(courseId);

    if (isCurrentlySaved) {
      // 삭제 처리
      try {
        if (isUuid(courseId)) {
          const { error } = await supabase
            .from('saved_courses')
            .delete()
            .eq('user_id', user.id)
            .eq('trip_id', courseId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('saved_courses')
            .delete()
            .eq('user_id', user.id)
            .eq('external_course_id', courseId);
          if (error) throw error;
        }

        setSavedCourseIds(prev => prev.filter(id => id !== courseId));
        showToast('저장 코스에서 삭제되었습니다');
        analyticsService.track('course_unbookmarked', {
          screenName: currentScreen,
          resourceType: 'course',
          resourceId: courseId,
        }).catch(() => {});
      } catch (err: any) {
        showToast(err?.message || '코스 저장 취소 중 오류가 발생했습니다.');
      }
    } else {
      // 추가 처리
      try {
        const courseObj = allCourses.find(c => c.id === courseId) || null;
        if (isUuid(courseId)) {
          const { error } = await supabase
            .from('saved_courses')
            .insert({
              user_id: user.id,
              trip_id: courseId,
              course_snapshot: courseObj,
            });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('saved_courses')
            .insert({
              user_id: user.id,
              external_course_id: courseId,
              course_snapshot: courseObj,
            });
          if (error) throw error;
        }

        setSavedCourseIds(prev => [...prev, courseId]);
        showToast('내 저장 코스에 추가되었습니다 ⭐');
        analyticsService.track('course_bookmarked', {
          screenName: currentScreen,
          resourceType: 'course',
          resourceId: courseId,
        }).catch(() => {});
      } catch (err: any) {
        showToast(err?.message || '코스 저장 중 오류가 발생했습니다.');
      }
    }
  };

  const toggleBookmarkEvent = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('로그인이 필요합니다');
      return;
    }

    const isCurrentlySaved = savedEventIds.includes(eventId);

    if (isCurrentlySaved) {
      // 삭제 처리
      try {
        const { error } = await supabase
          .from('saved_events')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        if (error) throw error;

        setSavedEventIds(prev => prev.filter(id => id !== eventId));
        showToast('이벤트 저장이 취소되었습니다');
        analyticsService.track('event_unbookmarked', {
          screenName: currentScreen,
          resourceType: 'event',
          resourceId: eventId,
        }).catch(() => {});
      } catch (err: any) {
        showToast(err?.message || '이벤트 저장 취소 중 오류가 발생했습니다.');
      }
    } else {
      // 추가 처리
      try {
        const eventItem = mockEvents.find(e => e.id === eventId) || selectedEventForDetail || { id: eventId };
        const { error } = await supabase
          .from('saved_events')
          .insert({
            user_id: user.id,
            event_id: eventId,
            event_snapshot: eventItem,
          });

        if (error) throw error;

        setSavedEventIds(prev => [...prev, eventId]);
        showToast('이벤트가 저장되었습니다 ⭐');
        analyticsService.track('event_bookmarked', {
          screenName: currentScreen,
          resourceType: 'event',
          resourceId: eventId,
        }).catch(() => {});
      } catch (err: any) {
        showToast(err?.message || '이벤트 저장 중 오류가 발생했습니다.');
      }
    }
  };

  const openForkModal = (course: TripCourse) => {
    setForkModalCourse(course);
  };

  const closeForkModal = () => {
    setForkModalCourse(null);
  };

  const confirmForkCourse = async (course: TripCourse, replacedWithAlternative: boolean = false) => {
    try {
      // 1. 해당 코스의 장소와 순서를 코스 조립 화면의 작업 메모리로 불러옴 (trips/trip_items 생성 안 함)
      const items = await tripService.importCourseToBuilder(course.id, course);
      setActiveCourseItems(items);
      setLastImportedSourceId(course.id);
      closeForkModal();

      showToast(
        replacedWithAlternative
          ? '🎉 대체 스팟이 반영되어 [코스 조립]으로 불러왔습니다!'
          : '🎉 코스의 장소와 순서를 [코스 조립]으로 불러왔습니다!'
      );
      navigate('plan');

      analyticsService.track('course_imported', {
        screenName: currentScreen,
        resourceType: 'course',
        resourceId: course.id,
        metadata: { courseTitle: course.title, replacedWithAlternative },
      }).catch(() => {});
    } catch (err: any) {
      showToast(err?.message || '코스 가져오기에 실패했습니다.');
    }
  };

  const publishCourse = async (courseId: string): Promise<boolean> => {
    try {
      await communityService.publishCourseToCommunity(courseId);
      showToast('코스가 커뮤니티에 공개되었습니다! 🎉');
      await Promise.all([loadMyCourses(), loadCommunityCourses()]);
      analyticsService.track('course_published', {
        screenName: currentScreen,
        resourceType: 'course',
        resourceId: courseId,
      }).catch(() => {});
      return true;
    } catch (err: any) {
      showToast(err?.message || '코스 공개 중 오류가 발생했습니다.');
      return false;
    }
  };

  const saveNewCourse = async (title: string, isPublic: boolean = false): Promise<boolean> => {
    try {
      const savedCourse = await tripService.saveCurrentCourse(
        title, 
        selectedArea, 
        isPublic, 
        lastImportedSourceId
      );
      setLastImportedSourceId(null);
      await Promise.all([loadMyCourses(), loadCommunityCourses()]);
      showToast(
        isPublic
          ? '코스가 저장되고 커뮤니티에 공개되었습니다 🎉'
          : '코스가 성공적으로 저장되었습니다 🎉'
      );
      navigate('mypage');
      analyticsService.track('course_saved', {
        screenName: currentScreen,
        resourceType: 'course',
        resourceId: savedCourse.id,
        metadata: { title, area: selectedArea, isPublic },
      }).catch(() => {});

      if (isPublic) {
        analyticsService.track('course_published', {
          screenName: currentScreen,
          resourceType: 'course',
          resourceId: savedCourse.id,
          metadata: { title, area: selectedArea },
        }).catch(() => {});
      }
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
    try {
      const trimmedEmail = email.trim();
      const { user, error } = await authService.login(trimmedEmail, password);
      if (error) {
        showToast(getFriendlyAuthErrorMessage(error));
        return false;
      }
      if (user) {
        setCurrentUser(user);
        showToast(`${user.name}님 환영합니다!`);
        await refreshUserData(user);
        const items = await tripService.getActiveCourseItems();
        setActiveCourseItems(items);
        setCurrentScreen('home');
        setActiveTabState('home');
        analyticsService.track('login_succeeded', {
          screenName: 'login',
          resourceType: 'auth',
          resourceId: user.id,
        }).catch(() => {});
        return true;
      }
      showToast('이메일 또는 비밀번호가 올바르지 않습니다.');
      return false;
    } catch (err: any) {
      showToast(getFriendlyAuthErrorMessage(err));
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const { user, session, error, message } = await authService.signup(name.trim(), email.trim(), password);

      if (error || !user || !session) {
        const errorMsg = message || getFriendlyAuthErrorMessage(error);
        console.error('회원가입 실패:', error || errorMsg);
        showToast(errorMsg);
        return { success: false, message: errorMsg };
      }

      setCurrentUser(user);
      setSavedCourseIds([]);
      setSavedEventIds([]);
      setActiveCourseItems([]);
      tripService.clearActiveCourseItems();

      await refreshUserData(user);

      showToast('회원가입이 완료되었습니다');
      setCurrentScreen('home');
      setActiveTabState('home');

      analyticsService.track('signup_succeeded', {
        screenName: 'signup',
        resourceType: 'auth',
        resourceId: user.id,
      }).catch(() => {});
      return { success: true };
    } catch (err: any) {
      console.error('회원가입 예외:', err);
      const errorMsg = getFriendlyAuthErrorMessage(err);
      showToast(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = async () => {
    try {
      const { error } = await authService.logout();
      if (error) {
        showToast(getFriendlyAuthErrorMessage(error));
      }
    } catch (err: any) {
      showToast(getFriendlyAuthErrorMessage(err));
    } finally {
      setCurrentUser(null);
      setSavedCourseIds([]);
      setSavedEventIds([]);
      setActiveCourseItems([]);
      tripService.clearActiveCourseItems();
      setAllCourses(mockCourses);
      setSelectedEventForDetail(null);
      setSelectedCourseForDetail(null);
      showToast('로그아웃 되었습니다');
      setCurrentScreen('login');
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthLoading,
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
        publishCourse,
        login,
        signup,
        logout,
        allCourses,
        myCourses,
        saveNewCourse,
        selectedEventForDetail,
        setSelectedEventForDetail,
        selectedCourseForDetail,
        setSelectedCourseForDetail,
        refreshCommunity: loadCommunityCourses,
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
