import { supabase } from '../lib/supabase';
import { TripCourse, CourseItem, Place } from '../types';
import { initialActiveCourseItems } from '../mock/mockData';

let inMemoryActiveItems: CourseItem[] = [];

function isUuid(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function formatTotalDuration(items: CourseItem[]): string {
  const totalMinutes = items.reduce((acc, item) => acc + (item.stayDurationMinutes || 60), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0 && mins > 0) {
    return `총 ${hours}시간 ${mins}분`;
  } else if (hours > 0) {
    return `총 ${hours}시간`;
  } else {
    return `총 ${mins}분`;
  }
}

function formatTripCreatedAt(createdAtStr?: string): string {
  if (!createdAtStr) return '방금 전';
  const d = new Date(createdAtStr);
  if (isNaN(d.getTime())) return '방금 전';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 60 * 1000) return '방금 전';
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 1000))}분 전`;
  if (diffMs < 24 * 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 60 * 1000))}시간 전`;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function mapTripToCourse(trip: any, user: any, items: any[]): TripCourse {
  const sortedRawItems = [...(items || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const courseItems: CourseItem[] = sortedRawItems.map((raw, idx) => {
    const snap = raw.place_snapshot || {};
    return {
      id: raw.id || `ti_${idx}`,
      placeId: raw.place_id || snap.id || `place_${idx}`,
      place: {
        id: raw.place_id || snap.id || `place_${idx}`,
        name: raw.place_name || snap.name || '방문 장소',
        category: snap.category || '포토스팟',
        area: snap.area || trip.area || '부산 광안리/해운대',
        address: snap.address || '부산광역시',
        image:
          snap.image ||
          'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop&q=80',
        description: snap.description || '',
        tags: Array.isArray(snap.tags) ? snap.tags : [],
        stayDurationMinutes: raw.stay_duration_minutes ?? snap.stayDurationMinutes ?? 60,
        highlightPill: snap.highlightPill,
        isMustVisit: Boolean(raw.is_must_visit ?? snap.isMustVisit ?? false),
      },
      order: raw.sort_order ?? idx + 1,
      startTime: raw.start_time || '14:00',
      endTime: raw.end_time || '15:00',
      stayDurationMinutes: raw.stay_duration_minutes ?? 60,
      highlightTag: raw.highlight_tag || snap.highlightPill || undefined,
      transitToNext: raw.transit_to_next || undefined,
      isMustVisit: Boolean(raw.is_must_visit ?? false),
      isLocked: Boolean(raw.is_locked ?? false),
    };
  });

  const authorName = user?.user_metadata?.nickname || user?.user_metadata?.name || '내 일정';
  const authorAvatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.avatar ||
    '';

  return {
    id: trip.id,
    title: trip.title || '나만의 부산 여행 코스',
    subtitle: '내 저장 코스',
    area: trip.area || '부산 광안리/해운대',
    author: {
      id: trip.owner_id || user?.id || 'me',
      name: authorName,
      avatar: authorAvatar,
      isVerifiedLocal: false,
      badgeText: '내 일정',
    },
    tags: courseItems.map(i => i.place.name),
    totalDuration: formatTotalDuration(courseItems),
    estimatedSteps: courseItems.length * 2200,
    forkCount: 0,
    bookmarkCount: 1,
    reviewCount: 0,
    rating: 5.0,
    coverImage:
      courseItems[0]?.place.image ||
      'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop&q=80',
    items: courseItems,
    isPublic: Boolean(trip.is_public),
    createdAt: formatTripCreatedAt(trip.created_at),
    optimizationMode: (trip.optimization_mode as 'ai_experience' | 'min_distance') || 'ai_experience',
  };
}

export const tripService = {
  async getActiveCourseItems(): Promise<CourseItem[]> {
    return [...inMemoryActiveItems];
  },

  clearActiveCourseItems(): void {
    inMemoryActiveItems = [];
  },

  async addPlaceToCourse(place: Place): Promise<CourseItem[]> {
    const nextOrder = inMemoryActiveItems.length + 1;
    const newItem: CourseItem = {
      id: `ci_${Date.now()}`,
      placeId: place.id,
      place,
      order: nextOrder,
      startTime: '20:30',
      endTime: '21:30',
      stayDurationMinutes: place.stayDurationMinutes || 60,
      transitToNext: {
        type: 'walk',
        durationMinutes: 10,
        description: '도보 이동',
      },
    };
    inMemoryActiveItems = [...inMemoryActiveItems, newItem];
    return [...inMemoryActiveItems];
  },

  async removeCourseItem(itemId: string): Promise<CourseItem[]> {
    inMemoryActiveItems = inMemoryActiveItems
      .filter(item => item.id !== itemId)
      .map((item, index) => ({
        ...item,
        order: index + 1,
      }));
    return [...inMemoryActiveItems];
  },

  async moveCourseItem(index: number, direction: 'up' | 'down'): Promise<CourseItem[]> {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= inMemoryActiveItems.length) {
      return [...inMemoryActiveItems];
    }
    const copy = [...inMemoryActiveItems];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    inMemoryActiveItems = copy.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    return [...inMemoryActiveItems];
  },

  async replaceCourseWithForked(course: TripCourse): Promise<CourseItem[]> {
    inMemoryActiveItems = course.items.map((item, idx) => ({
      ...item,
      id: `ci_forked_${idx}_${Date.now()}`,
      order: idx + 1,
    }));
    return [...inMemoryActiveItems];
  },

  async saveCurrentCourse(
    title: string, 
    area: string = '부산 광안리/해운대',
    isPublic: boolean = false,
    sourceImportTripId?: string | null
  ): Promise<TripCourse> {
    // 3. 먼저 supabase.auth.getUser()로 로그인 사용자를 가져온다.
    // 로그인 사용자가 없으면 "로그인이 필요합니다" 오류를 발생시킨다.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.');
    }

    // 4. public.trips에 insert
    const { data: tripData, error: tripError } = await supabase
      .from('trips')
      .insert({
        owner_id: user.id,
        title: title || '나만의 부산 여행 코스',
        area: area || '부산 광안리/해운대',
        status: isPublic ? 'published' : 'completed',
        optimization_mode: 'ai_experience',
        is_public: Boolean(isPublic),
      })
      .select('id, created_at, title, area, owner_id, status, optimization_mode, is_public')
      .single();

    if (tripError || !tripData) {
      throw new Error(tripError?.message || '코스 저장 중 오류가 발생했습니다.');
    }

    // 5. trips insert 후 생성된 실제 id를 반환받는다.
    const tripId = tripData.id;

    // 6. 현재 activeCourseItems를 public.trip_items에 한 번에 insert한다.
    if (inMemoryActiveItems.length > 0) {
      const itemsToInsert = inMemoryActiveItems.map((item, idx) => ({
        trip_id: tripId,
        item_type: 'place',
        place_id: item.placeId,
        place_name: item.place.name,
        sort_order: item.order ?? idx + 1,
        start_time: item.startTime || null,
        end_time: item.endTime || null,
        stay_duration_minutes: item.stayDurationMinutes || 60,
        is_must_visit: item.isMustVisit !== undefined ? item.isMustVisit : Boolean(item.place.isMustVisit || false),
        is_locked: item.isLocked !== undefined ? item.isLocked : false,
        place_snapshot: item.place,
        transit_to_next: item.transitToNext || null,
      }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from('trip_items')
        .insert(itemsToInsert)
        .select('*');

      if (itemsError) {
        // 7. trip_items 저장에 실패하면 방금 생성한 trips 행을 삭제하고 오류를 반환한다.
        await supabase.from('trips').delete().eq('id', tripId);
        throw new Error(itemsError.message || '코스 세부 항목 저장에 실패했습니다.');
      }

      // 가져온 코스 출처가 있는 경우 course_imports 테이블에 생성된 imported_trip_id 연결 기록
      if (sourceImportTripId && isUuid(sourceImportTripId)) {
        try {
          await supabase.from('course_imports').insert({
            source_trip_id: sourceImportTripId,
            imported_trip_id: tripId,
            imported_by: user.id,
          });
        } catch (importErr) {
          console.warn('course_imports link error:', importErr);
        }
      }

      // 만약 공개 코스인 경우 course_posts에도 추가
      if (isPublic) {
        try {
          const firstPlaceImg = inMemoryActiveItems[0]?.place.image;
          await supabase.from('course_posts').insert({
            trip_id: tripId,
            owner_id: user.id,
            title: title || '나만의 부산 여행 코스',
            description: `${area} 추천 코스`,
            cover_image_url: firstPlaceImg || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            visibility: 'public',
            published_at: new Date().toISOString(),
          });
        } catch (postErr) {
          console.warn('course_posts insert warning:', postErr);
        }
      }

      return mapTripToCourse(tripData, user, insertedItems || itemsToInsert);
    }

    if (isPublic) {
      try {
        await supabase.from('course_posts').insert({
          trip_id: tripId,
          owner_id: user.id,
          title: title || '나만의 부산 여행 코스',
          description: `${area} 추천 코스`,
          cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          visibility: 'public',
          published_at: new Date().toISOString(),
        });
      } catch (postErr) {
        console.warn('course_posts insert warning:', postErr);
      }
    }

    return mapTripToCourse(tripData, user, []);
  },

  /**
   * '일정에 추가' 기능:
   * 1. trips 및 trip_items는 이 단계에서 절대 생성하지 않음 (저장 버튼 누를 때만 생성)
   * 2. 원본 코스를 수정하지 않고 장소/순서를 조립 작업 메모리(activeCourseItems)로 로드
   * 3. 가져온 사실을 course_imports 테이블에 기록
   */
  async importCourseToBuilder(sourceTripId: string, courseSnapshot?: TripCourse | null): Promise<CourseItem[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.');
    }

    let itemsToLoad: CourseItem[] = [];

    // 1. UUID이고 Supabase trip_items에 원본 데이터가 있다면 조회
    if (isUuid(sourceTripId)) {
      try {
        const { data: origItems } = await supabase
          .from('trip_items')
          .select('*')
          .eq('trip_id', sourceTripId)
          .order('sort_order', { ascending: true });

        if (origItems && origItems.length > 0) {
          const dummyTrip = { area: courseSnapshot?.area || '부산' };
          const mapped = mapTripToCourse(dummyTrip, user, origItems);
          itemsToLoad = mapped.items;
        }
      } catch (fetchErr) {
        console.warn('Failed to fetch origItems from trip_items:', fetchErr);
      }
    }

    // 2. snapshot이 있거나 위에서 못 가져온 경우 snapshot 사용
    if (itemsToLoad.length === 0 && courseSnapshot?.items && courseSnapshot.items.length > 0) {
      itemsToLoad = courseSnapshot.items;
    }

    // 3. 고유한 독립 ID를 가진 아이템으로 복제 (원본 코스와 완전히 독립 관리)
    const clonedItems: CourseItem[] = itemsToLoad.map((item, idx) => ({
      ...item,
      id: `ci_imported_${idx}_${Date.now()}`,
      order: idx + 1,
    }));

    inMemoryActiveItems = [...clonedItems];

    // 4. 가져온 사실을 course_imports 테이블에 기록
    if (isUuid(sourceTripId)) {
      try {
        await supabase
          .from('course_imports')
          .insert({
            source_trip_id: sourceTripId,
            imported_by: user.id,
          });
      } catch (importLogErr) {
        console.warn('course_imports log note:', importLogErr);
      }
    }

    return [...inMemoryActiveItems];
  },

  async importCourse(sourceTripId: string, courseSnapshot?: TripCourse | null): Promise<TripCourse> {
    const items = await this.importCourseToBuilder(sourceTripId, courseSnapshot);
    const { data: { user } } = await supabase.auth.getUser();
    const dummyTrip = {
      id: `draft_${Date.now()}`,
      title: courseSnapshot?.title || '가져온 코스',
      area: courseSnapshot?.area || '부산',
      owner_id: user?.id,
    };
    return mapTripToCourse(dummyTrip, user, items);
  },

  async getMyCourses(): Promise<TripCourse[]> {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return [];
    }

    // 1차: join query 시도
    const { data: joinedData, error: joinedError } = await supabase
      .from('trips')
      .select(`
        *,
        trip_items (*)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (!joinedError && Array.isArray(joinedData)) {
      return joinedData.map(t => mapTripToCourse(t, user, t.trip_items || []));
    }

    // Fallback: 2단계 쿼리
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (tripsError || !trips || trips.length === 0) {
      return [];
    }

    const tripIds = trips.map(t => t.id);
    const { data: tripItems } = await supabase
      .from('trip_items')
      .select('*')
      .in('trip_id', tripIds)
      .order('sort_order', { ascending: true });

    const itemsByTripId: Record<string, any[]> = {};
    (tripItems || []).forEach(item => {
      if (!itemsByTripId[item.trip_id]) {
        itemsByTripId[item.trip_id] = [];
      }
      itemsByTripId[item.trip_id].push(item);
    });

    return trips.map(t => mapTripToCourse(t, user, itemsByTripId[t.id] || []));
  },
};
