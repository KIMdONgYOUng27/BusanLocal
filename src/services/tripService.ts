import { TripCourse, CourseItem, Place } from '../types';
import { mockCourses, initialActiveCourseItems, mockCurrentUser } from '../mock/mockData';

let inMemoryActiveItems: CourseItem[] = [...initialActiveCourseItems];
let inMemoryCourses: TripCourse[] = [...mockCourses];

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
        description: '도보 이동'
      }
    };
    inMemoryActiveItems = [...inMemoryActiveItems, newItem];
    return [...inMemoryActiveItems];
  },

  async removeCourseItem(itemId: string): Promise<CourseItem[]> {
    inMemoryActiveItems = inMemoryActiveItems
      .filter(item => item.id !== itemId)
      .map((item, index) => ({
        ...item,
        order: index + 1
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
      order: idx + 1
    }));
    return [...inMemoryActiveItems];
  },

  async saveCurrentCourse(title: string, area: string = '부산 광안리/해운대'): Promise<TripCourse> {
    const newCourse: TripCourse = {
      id: `course_${Date.now()}`,
      title: title || '나만의 부산 감성 당일 코스',
      subtitle: '커뮤니티 검증 완료 코스',
      area,
      author: {
        id: mockCurrentUser.id,
        name: mockCurrentUser.name,
        avatar: mockCurrentUser.avatar,
        isVerifiedLocal: false,
        badgeText: '내 일정'
      },
      tags: inMemoryActiveItems.map(item => item.place.name),
      totalDuration: '총 5시간 20분',
      estimatedSteps: 7600,
      forkCount: 1,
      bookmarkCount: 1,
      reviewCount: 0,
      rating: 5.0,
      coverImage: inMemoryActiveItems[0]?.place.image || 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop&q=80',
      items: [...inMemoryActiveItems],
      isPublic: false,
      createdAt: '방금 전',
      optimizationMode: 'ai_experience'
    };
    inMemoryCourses = [newCourse, ...inMemoryCourses];
    return newCourse;
  },

  async replaceCourseWithForked(course: TripCourse): Promise<CourseItem[]> {
    inMemoryActiveItems = course.items.map((item, idx) => ({
      ...item,
      id: `ci_forked_${idx}_${Date.now()}`,
      order: idx + 1
    }));
    return [...inMemoryActiveItems];
  }
};
