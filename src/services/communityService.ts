import { TripCourse, CourseComment } from '../types';
import { mockCourses, mockComments } from '../mock/mockData';
import { supabase } from '../lib/supabase';

let inMemoryCourses: TripCourse[] = [...mockCourses];
let inMemoryComments: CourseComment[] = [...mockComments];

export function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export const communityService = {
  /**
   * Supabase course_posts와 trips, trip_items, profiles를 조인/결합하여
   * 공개 커뮤니티 코스를 조회하고 기존 mockCourses와 함께 반환합니다.
   */
  async getPublicCourses(): Promise<TripCourse[]> {
    try {
      // 1. visibility = 'public'인 course_posts 조회 (published_at 최신순)
      const { data: posts, error: postsError } = await supabase
        .from('course_posts')
        .select('*')
        .eq('visibility', 'public')
        .order('published_at', { ascending: false, nullsFirst: false });

      if (postsError || !posts || posts.length === 0) {
        return [...inMemoryCourses];
      }

      const tripIds = posts.map(p => p.trip_id).filter(Boolean);
      const ownerIds = Array.from(new Set(posts.map(p => p.owner_id).filter(Boolean)));
      const postIds = posts.map(p => p.id);

      // 2. trips 조회
      const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .in('id', tripIds);

      // 3. trip_items 조회
      const { data: tripItems } = await supabase
        .from('trip_items')
        .select('*')
        .in('trip_id', tripIds)
        .order('sort_order', { ascending: true });

      // 4. profiles 조회
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_url, home_region')
        .in('id', ownerIds);

      // 5. course_likes 개수 조회
      const { data: likes } = await supabase
        .from('course_likes')
        .select('post_id');

      const tripsMap = new Map<string, any>((trips || []).map(t => [t.id, t]));
      const profilesMap = new Map<string, any>((profiles || []).map(p => [p.id, p]));
      
      const itemsByTripId = new Map<string, any[]>();
      (tripItems || []).forEach(item => {
        const list = itemsByTripId.get(item.trip_id) || [];
        list.push(item);
        itemsByTripId.set(item.trip_id, list);
      });

      const likesCountByPostId = new Map<string, number>();
      (likes || []).forEach(l => {
        likesCountByPostId.set(l.post_id, (likesCountByPostId.get(l.post_id) || 0) + 1);
      });

      const realCourses: TripCourse[] = posts.map(post => {
        const trip = tripsMap.get(post.trip_id) || {};
        const profile = profilesMap.get(post.owner_id) || {};
        const items = (itemsByTripId.get(post.trip_id) || []).map((ti, idx) => ({
          id: ti.id,
          placeId: ti.place_id,
          place: ti.place_snapshot || {
            id: ti.place_id,
            name: ti.place_name,
            description: '',
            category: '카페/디저트',
            stayDurationMinutes: ti.stay_duration_minutes || 60,
            tags: [],
            rating: 4.8,
            reviewCount: 120,
            address: '부산',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          },
          order: ti.sort_order ?? idx + 1,
          startTime: ti.start_time || '10:00',
          endTime: ti.end_time || '11:00',
          stayDurationMinutes: ti.stay_duration_minutes || 60,
          transitToNext: ti.transit_to_next,
          isMustVisit: ti.is_must_visit,
          isLocked: ti.is_locked,
        }));

        const totalMins = items.reduce((acc, it) => acc + (it.stayDurationMinutes || 60), 0);
        const hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        const totalDuration = hours > 0 ? `${hours}시간 ${mins > 0 ? `${mins}분` : ''}`.trim() : `${mins}분`;

        return {
          id: trip.id || post.trip_id,
          postId: post.id,
          title: post.title || trip.title || '부산 추천 코스',
          subtitle: post.description || `${trip.area || '부산'} 여행 코스`,
          area: trip.area || '부산',
          author: {
            id: post.owner_id,
            name: profile.nickname || '부산 로컬',
            avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            isVerifiedLocal: true,
            badgeText: '인증 로컬',
          },
          tags: ['#추천코스', `#${trip.area || '부산'}`],
          totalDuration: totalDuration || '4시간',
          estimatedSteps: items.length * 2100,
          forkCount: 0,
          bookmarkCount: likesCountByPostId.get(post.id) || 0,
          reviewCount: 0,
          coverImage: post.cover_image_url || items[0]?.place?.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          items,
          isPublic: true,
          createdAt: post.published_at ? new Date(post.published_at).toLocaleDateString('ko-KR') : '방금 전',
          optimizationMode: trip.optimization_mode || 'ai_experience',
        };
      });

      // mockCourses 중 realCourses와 id가 중복되지 않는 것 결합
      const realIds = new Set(realCourses.map(c => c.id));
      const filteredMock = inMemoryCourses.filter(c => !realIds.has(c.id));
      return [...realCourses, ...filteredMock];
    } catch (err) {
      console.error('getPublicCourses error:', err);
      return [...inMemoryCourses];
    }
  },

  async getCourses(tagFilter?: string, sortBy?: 'popular' | 'latest'): Promise<TripCourse[]> {
    let result = await this.getPublicCourses();
    if (tagFilter && tagFilter !== '전체 보기' && tagFilter !== '전체') {
      result = result.filter(c => 
        c.tags.some(t => t.includes(tagFilter)) || 
        c.title.includes(tagFilter) ||
        (c.subtitle && c.subtitle.includes(tagFilter))
      );
    }
    if (sortBy === 'latest') {
      return result;
    }
    // Default: popular
    return result.sort((a, b) => (b.forkCount + b.bookmarkCount) - (a.forkCount + a.bookmarkCount));
  },

  async getCourseById(id: string): Promise<TripCourse | null> {
    const all = await this.getPublicCourses();
    const found = all.find(c => c.id === id || c.postId === id);
    return found ? { ...found } : null;
  },

  /**
   * 사용자가 자신의 저장 코스를 커뮤니티에 공개
   */
  async publishCourseToCommunity(
    courseId: string,
    title?: string,
    description?: string,
    coverImageUrl?: string
  ): Promise<TripCourse> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!isUuid(courseId)) {
      // Mock 코스인 경우 인메모리 플래그 업데이트
      const idx = inMemoryCourses.findIndex(c => c.id === courseId);
      if (idx !== -1) {
        inMemoryCourses[idx].isPublic = true;
        return inMemoryCourses[idx];
      }
      throw new Error('코스를 찾을 수 없습니다.');
    }

    // 1. 본인 소유의 실제 DB 코스 확인
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', courseId)
      .eq('owner_id', user.id)
      .single();

    if (tripError || !trip) {
      throw new Error('본인 소유의 코스만 공개할 수 있습니다.');
    }

    // 2. trips.is_public = true, status = 'published' 변경
    const { error: tripUpdateError } = await supabase
      .from('trips')
      .update({
        is_public: true,
        status: 'published',
      })
      .eq('id', courseId)
      .eq('owner_id', user.id);

    if (tripUpdateError) {
      throw new Error(tripUpdateError.message || '코스 공개 상태 변경에 실패했습니다.');
    }

    // 3. course_posts에 insert 또는 upsert
    const postTitle = title || trip.title || '나만의 부산 여행 코스';
    const postDesc = description || `${trip.area || '부산'} 여행 코스`;
    const postCover = coverImageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';

    const { data: existingPost } = await supabase
      .from('course_posts')
      .select('id')
      .eq('trip_id', courseId)
      .maybeSingle();

    if (existingPost) {
      const { error: postUpdateError } = await supabase
        .from('course_posts')
        .update({
          title: postTitle,
          description: postDesc,
          cover_image_url: postCover,
          visibility: 'public',
          published_at: new Date().toISOString(),
        })
        .eq('id', existingPost.id);

      if (postUpdateError) {
        throw new Error(postUpdateError.message || '게시글 업데이트에 실패했습니다.');
      }
    } else {
      const { error: postInsertError } = await supabase
        .from('course_posts')
        .insert({
          trip_id: courseId,
          owner_id: user.id,
          title: postTitle,
          description: postDesc,
          cover_image_url: postCover,
          visibility: 'public',
          published_at: new Date().toISOString(),
        });

      if (postInsertError) {
        throw new Error(postInsertError.message || '게시글 생성에 실패했습니다.');
      }
    }

    const updated = await this.getCourseById(courseId);
    if (!updated) {
      throw new Error('공개 코스 정보를 불러오지 못했습니다.');
    }
    return updated;
  },

  /**
   * 좋아요 토글
   */
  async toggleLikeCourse(courseIdOrPostId: string, liked: boolean): Promise<{ isLiked: boolean; likeCount: number; postId?: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!isUuid(courseIdOrPostId)) {
      // Mock 코스 처리
      const idx = inMemoryCourses.findIndex(c => c.id === courseIdOrPostId);
      if (idx !== -1) {
        const delta = liked ? 1 : -1;
        inMemoryCourses[idx].bookmarkCount = Math.max(0, inMemoryCourses[idx].bookmarkCount + delta);
        return { isLiked: liked, likeCount: inMemoryCourses[idx].bookmarkCount };
      }
      return { isLiked: liked, likeCount: liked ? 1 : 0 };
    }

    // 실제 post_id 찾기
    let targetPostId = courseIdOrPostId;
    const { data: postByTrip } = await supabase
      .from('course_posts')
      .select('id')
      .eq('trip_id', courseIdOrPostId)
      .maybeSingle();

    if (postByTrip) {
      targetPostId = postByTrip.id;
    }

    if (liked) {
      // 중복 방지 체크 후 insert
      const { data: existingLike } = await supabase
        .from('course_likes')
        .select('post_id')
        .eq('post_id', targetPostId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingLike) {
        const { error: insertError } = await supabase
          .from('course_likes')
          .insert({
            post_id: targetPostId,
            user_id: user.id,
          });
        if (insertError) {
          throw new Error(insertError.message || '좋아요 저장에 실패했습니다.');
        }
      }
    } else {
      const { error: deleteError } = await supabase
        .from('course_likes')
        .delete()
        .eq('post_id', targetPostId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw new Error(deleteError.message || '좋아요 취소에 실패했습니다.');
      }
    }

    // 최신 좋아요 수 조회
    const { count } = await supabase
      .from('course_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', targetPostId);

    return {
      isLiked: liked,
      likeCount: count || 0,
      postId: targetPostId,
    };
  },

  /**
   * 해당 게시글의 좋아요 상태 및 개수 조회
   */
  async getLikeStatus(courseIdOrPostId: string): Promise<{ isLiked: boolean; likeCount: number; postId?: string }> {
    if (!isUuid(courseIdOrPostId)) {
      const c = inMemoryCourses.find(item => item.id === courseIdOrPostId);
      return { isLiked: false, likeCount: c?.bookmarkCount || 0 };
    }

    let targetPostId = courseIdOrPostId;
    const { data: postByTrip } = await supabase
      .from('course_posts')
      .select('id')
      .eq('trip_id', courseIdOrPostId)
      .maybeSingle();

    if (postByTrip) {
      targetPostId = postByTrip.id;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { count } = await supabase
      .from('course_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', targetPostId);

    let isLiked = false;
    if (user) {
      const { data: likeRecord } = await supabase
        .from('course_likes')
        .select('post_id')
        .eq('post_id', targetPostId)
        .eq('user_id', user.id)
        .maybeSingle();
      isLiked = Boolean(likeRecord);
    }

    return {
      isLiked,
      likeCount: count || 0,
      postId: targetPostId,
    };
  },

  /**
   * 댓글 목록 조회 (created_at 오름차순, profiles 결합)
   */
  async getComments(courseId: string): Promise<CourseComment[]> {
    if (!isUuid(courseId)) {
      return inMemoryComments.filter(c => c.courseId === courseId);
    }

    let targetPostId = courseId;
    const { data: postByTrip } = await supabase
      .from('course_posts')
      .select('id')
      .eq('trip_id', courseId)
      .maybeSingle();

    if (postByTrip) {
      targetPostId = postByTrip.id;
    }

    const { data: comments, error } = await supabase
      .from('course_comments')
      .select('*')
      .eq('post_id', targetPostId)
      .order('created_at', { ascending: true });

    if (error || !comments) {
      return [];
    }

    const userIds = Array.from(new Set(comments.map(c => c.user_id).filter(Boolean)));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .in('id', userIds);

    const profilesMap = new Map<string, any>((profiles || []).map(p => [p.id, p]));

    return comments.map(c => {
      const profile = profilesMap.get(c.user_id) || {};
      return {
        id: c.id,
        courseId,
        userId: c.user_id,
        author: {
          id: c.user_id,
          name: profile.nickname || '여행자',
          avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        content: c.content,
        createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString('ko-KR') : '방금 전',
        likes: 0,
        isLiked: false,
      };
    });
  },

  /**
   * 댓글 등록 (1~1000자, 공백제거, 빈 댓글 방지)
   */
  async addComment(courseId: string, content: string): Promise<CourseComment> {
    const trimmed = (content || '').trim();
    if (!trimmed) {
      throw new Error('댓글 내용을 입력해주세요.');
    }
    if (trimmed.length > 1000) {
      throw new Error('댓글은 1000자 이하로 작성해주세요.');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('로그인이 필요합니다.');
    }

    let authorName = user.user_metadata?.nickname || user.user_metadata?.name || user.email?.split('@')[0] || '부산여행자';
    let authorAvatar = user.user_metadata?.avatar_url || user.user_metadata?.avatar || '';

    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('nickname, avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      if (prof) {
        if (prof.nickname) authorName = prof.nickname;
        if (prof.avatar_url) authorAvatar = prof.avatar_url;
      }
    } catch {
      // ignore
    }

    if (!isUuid(courseId)) {
      // Mock 코스 댓글 추가
      const newComment: CourseComment = {
        id: `comm_${Date.now()}`,
        courseId,
        userId: user.id,
        author: {
          id: user.id,
          name: authorName,
          avatar: authorAvatar,
        },
        content: trimmed,
        createdAt: '방금 전',
        likes: 0,
        isLiked: false,
      };
      inMemoryComments = [newComment, ...inMemoryComments];
      return newComment;
    }

    let targetPostId = courseId;
    const { data: postByTrip } = await supabase
      .from('course_posts')
      .select('id')
      .eq('trip_id', courseId)
      .maybeSingle();

    if (postByTrip) {
      targetPostId = postByTrip.id;
    }

    const { data: insertedComment, error: commentError } = await supabase
      .from('course_comments')
      .insert({
        post_id: targetPostId,
        user_id: user.id,
        content: trimmed,
      })
      .select()
      .single();

    if (commentError || !insertedComment) {
      throw new Error(commentError?.message || '댓글 등록에 실패했습니다.');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    return {
      id: insertedComment.id,
      courseId,
      userId: user.id,
      author: {
        id: user.id,
        name: profile?.nickname || user.user_metadata?.nickname || user.user_metadata?.name || '여행자',
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
      },
      content: trimmed,
      createdAt: '방금 전',
      likes: 0,
      isLiked: false,
    };
  },

  /**
   * 본인 댓글 삭제
   */
  async deleteComment(commentId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    if (isUuid(commentId)) {
      const { error } = await supabase
        .from('course_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message || '댓글 삭제에 실패했습니다.');
      }
    } else {
      inMemoryComments = inMemoryComments.filter(c => c.id !== commentId);
    }
  },
};
