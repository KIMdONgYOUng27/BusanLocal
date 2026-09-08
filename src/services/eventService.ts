import { EventItem } from '../types';
import { mockEvents } from '../mock/mockData';

export const eventService = {
  async getEvents(area?: string, category?: string): Promise<EventItem[]> {
    let result = [...mockEvents];
    if (area && area !== '전체 권역') {
      result = result.filter(e => e.area.includes(area) || area.includes(e.area.split('/')[0]));
    }
    if (category && category !== '전체' && category !== '전체 보기') {
      result = result.filter(e => e.category === category || e.badges.some(b => b.includes(category)));
    }
    return result;
  },

  async getEventById(id: string): Promise<EventItem | null> {
    const found = mockEvents.find(e => e.id === id);
    return found ? { ...found } : null;
  }
};
