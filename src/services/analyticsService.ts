import { supabase } from '../lib/supabase';
import { CourseItem } from '../types';

export interface TrackParams {
  screenName?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  metadata?: Record<string, any>;
}

export const analyticsService = {
  calculateCourseStats(items: CourseItem[]): {
    totalMinutes: number;
    transitMinutes: number;
    totalSteps: number;
    spotCount: number;
    distanceKm: number;
  } {
    const spotCount = items.length;
    let stayMinutes = 0;
    let transitMinutes = 0;

    items.forEach(item => {
      stayMinutes += item.stayDurationMinutes || 60;
      if (item.transitToNext) {
        transitMinutes += item.transitToNext.durationMinutes;
      }
    });

    const totalMinutes = stayMinutes + transitMinutes;
    const distanceKm = Math.round((spotCount * 1.35) * 10) / 10;
    const totalSteps = Math.round(distanceKm * 1550);

    return {
      totalMinutes,
      transitMinutes,
      totalSteps,
      spotCount,
      distanceKm
    };
  },

  async track(
    eventName: string,
    params: TrackParams = {}
  ): Promise<void> {
    try {
      // 3. supabase.auth.getUser()로 현재 사용자 확인
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      // 5. 로그인 사용자가 없으면 오류를 발생시키지 말고 기록을 건너뛴다.
      if (authError || !user) {
        return;
      }

      const {
        screenName = null,
        resourceType = null,
        resourceId = null,
        metadata = {},
      } = params;

      // 9. metadata에는 비밀번호, 인증 토큰, anon key, 이메일, 댓글 전문을 절대 저장하지 않는다.
      const safeMetadata: Record<string, any> = {};
      if (metadata && typeof metadata === 'object') {
        const forbiddenKeys = [
          'password',
          'token',
          'access_token',
          'refresh_token',
          'anon_key',
          'apikey',
          'email',
          'comment',
          'content'
        ];
        for (const [key, value] of Object.entries(metadata)) {
          const lower = key.toLowerCase();
          const isForbidden = forbiddenKeys.some(f => lower.includes(f));
          if (!isForbidden) {
            safeMetadata[key] = value;
          }
        }
      }

      // 4. public.analytics_events에 insert
      await supabase.from('analytics_events').insert({
        user_id: user.id,
        event_name: eventName,
        screen_name: screenName ?? null,
        resource_type: resourceType ?? null,
        resource_id: resourceId ?? null,
        metadata: safeMetadata,
      });
    } catch {
      // 6. 분석 기록 실패 때문에 앱의 원래 기능이 실패하면 안 된다.
      // 기록 오류는 안전하게 처리하되 비밀번호, 토큰, 이메일을 console에 출력하지 않는다.
    }
  },
};
