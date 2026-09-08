import { TripCourse, CourseComment } from '../types';
import { mockCourses, mockComments, mockCurrentUser } from '../mock/mockData';

let inMemoryCourses: TripCourse[] = [...mockCourses];
let inMemoryComments: CourseComment[] = [...mockComments];

export const communityService = {
  async getCourses(tagFilter?: string, sortBy?: 'popular' | 'latest'): Promise<TripCourse[]> {
    let result = [...inMemoryCourses];
    if (tagFilter && tagFilter !== '전체 보기' && tagFilter !== '전체') {
      result = result.filter(c => 
        c.tags.some(t => t.includes(tagFilter)) || 
        c.title.includes(tagFilter) ||
        (c.subtitle && c.subtitle.includes(tagFilter))
      );
    }
    if (sortBy === 'latest') {
      // sort by id or creation
      return result;
    }
    // Default: popular (by forkCount + bookmarkCount)
    return result.sort((a, b) => (b.forkCount + b.bookmarkCount) - (a.forkCount + a.bookmarkCount));
  },

  async getCourseById(id: string): Promise<TripCourse | null> {
    const found = inMemoryCourses.find(c => c.id === id);
    return found ? { ...found } : null;
  },

  async toggleLikeCourse(id: string, liked: boolean): Promise<TripCourse> {
    const idx = inMemoryCourses.findIndex(c => c.id === id);
    if (idx !== -1) {
      const course = inMemoryCourses[idx];
      const delta = liked ? 1 : -1;
      const updated = {
        ...course,
        bookmarkCount: Math.max(0, course.bookmarkCount + delta)
      };
      inMemoryCourses[idx] = updated;
      return updated;
    }
    throw new Error('Course not found');
  },

  async publishCourseToCommunity(courseId: string): Promise<TripCourse> {
    const idx = inMemoryCourses.findIndex(c => c.id === courseId);
    if (idx !== -1) {
      inMemoryCourses[idx].isPublic = true;
      return inMemoryCourses[idx];
    }
    throw new Error('Course not found');
  },

  async getComments(courseId: string): Promise<CourseComment[]> {
    return inMemoryComments.filter(c => c.courseId === courseId);
  },

  async addComment(courseId: string, content: string): Promise<CourseComment> {
    const newComment: CourseComment = {
      id: `comm_${Date.now()}`,
      courseId,
      author: {
        id: mockCurrentUser.id,
        name: mockCurrentUser.name,
        avatar: mockCurrentUser.avatar
      },
      content,
      createdAt: '방금 전',
      likes: 0,
      isLiked: false
    };
    inMemoryComments = [newComment, ...inMemoryComments];
    return newComment;
  }
};
