import { CourseItem } from '../types';

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
  }
};
