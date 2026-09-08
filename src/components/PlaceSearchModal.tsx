import React, { useState, useEffect } from 'react';
import { Place } from '../types';
import { placeService } from '../services/placeService';
import { Search, X, Plus, Star, MapPin, Check } from 'lucide-react';

interface PlaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
  alreadySelectedIds: string[];
}

export const PlaceSearchModal: React.FC<PlaceSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
  alreadySelectedIds
}) => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [places, setPlaces] = useState<Place[]>([]);
  const [mustVisitIds, setMustVisitIds] = useState<string[]>([]);

  const categories = ['전체', '포토스팟', '카페탐방', '미식', '문화예술', '액티비티'];

  useEffect(() => {
    if (isOpen) {
      placeService.getPlaces(undefined, selectedCategory, keyword).then(setPlaces);
    }
  }, [isOpen, keyword, selectedCategory]);

  if (!isOpen) return null;

  const toggleMustVisit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMustVisitIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#183B4E]/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[430px] bg-[#FFFFFF] rounded-t-3xl shadow-2xl p-5 flex flex-col gap-4 max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-[#E2E8F0] rounded-full self-center" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-bold text-[#183B4E]">코스에 담을 장소 추가</h3>
            <p className="text-xs text-[#64748B]">부산 명소와 로컬 핫플레이스를 검색해보세요</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#183B4E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-[#94A3B8]" />
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="장소 이름, 지역, 키워드 검색"
            className="w-full h-11 pl-9 pr-8 rounded-xl bg-[#F8FAFC] text-xs text-[#183B4E] placeholder-[#94A3B8] border border-[#E2E8F0] focus:outline-none focus:border-[#45C7F2] transition-colors"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-2.5 p-1 text-[#94A3B8] hover:text-[#183B4E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors active:scale-95 ${
                  isSelected
                    ? 'bg-[#183B4E] text-[#FFFFFF] shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Place List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
          {places.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8]">
              일치하는 장소를 찾을 수 없습니다.
            </div>
          ) : (
            places.map(place => {
              const isAdded = alreadySelectedIds.includes(place.id);
              const isMustVisit = mustVisitIds.includes(place.id);

              return (
                <div
                  key={place.id}
                  className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-3 hover:border-[#45C7F2] transition-colors"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#F1F5F9]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E6EEFF] text-[#006781]">
                        {place.category}
                      </span>
                      <span className="text-[11px] text-[#64748B] truncate">{place.area}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#183B4E] truncate">{place.name}</h4>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">{place.description}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={e => toggleMustVisit(place.id, e)}
                      title="Must-visit 장소로 지정"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
                        isMustVisit ? 'bg-[#F3E3C3] text-[#685D44]' : 'bg-[#F8FAFC] text-[#94A3B8] hover:text-[#685D44]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isMustVisit ? 'fill-[#685D44]' : ''}`} />
                    </button>

                    <button
                      disabled={isAdded}
                      onClick={() => {
                        onSelectPlace(place);
                        onClose();
                      }}
                      className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1 active:scale-95 transition-all ${
                        isAdded
                          ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                          : 'bg-[#45C7F2] text-[#183B4E] hover:bg-[#5BD4FF] shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>추가됨</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>담기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
