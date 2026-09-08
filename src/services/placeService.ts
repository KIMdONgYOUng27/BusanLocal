import { Place } from '../types';
import { mockPlaces } from '../mock/mockData';

export const placeService = {
  async getPlaces(area?: string, category?: string, keyword?: string): Promise<Place[]> {
    let result = [...mockPlaces];
    if (area && area !== '전체 권역') {
      result = result.filter(p => p.area.includes(area) || area.includes(p.area.split('/')[0]));
    }
    if (category && category !== '전체' && category !== '전체 보기') {
      result = result.filter(p => p.category === category || p.tags.some(t => t.includes(category)));
    }
    if (keyword && keyword.trim() !== '') {
      const q = keyword.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  },

  async getPlaceById(id: string): Promise<Place | null> {
    const found = mockPlaces.find(p => p.id === id);
    return found ? { ...found } : null;
  }
};
