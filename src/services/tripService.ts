import { supabase } from '../lib/supabase';
import { TripCourse, CourseItem, Place } from '../types';
import { initialActiveCourseItems } from '../mock/mockData';

let inMemoryActiveItems: CourseItem[] = [...initialActiveCourseItems];

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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBw13gQPDSpIuMEhG0s5k64vRtDKjl-AuuA8QQMf04bclN6uEl9A-fiF7sXWRo3uhmdnLKokoT4GX1jfJNGfS-yuOfhQx4XIyDMavMkR76Q8Cu1qajmj3P8n8_f4z_fM1Xz51u_n41MgnUGWt5XnFTZjTM-GqlAUlU7g3tqoHWpVUEx8hqf48w2OB9EWgfFfEOodZNwXhYorjjS0f9SETZg40M9PvnYJepgzjet92VQdqWyDeRphExgMg';

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

  async saveCurrentCourse(title: string, area: string = '부산 광안리/해운대'): Promise<TripCourse> {
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
        status: 'completed',
        optimization_mode: 'ai_experience',
        is_public: false,
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

      return mapTripToCourse(tripData, user, insertedItems || itemsToInsert);
    }

    return mapTripToCourse(tripData, user, []);
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
