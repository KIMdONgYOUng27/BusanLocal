import { User, Place, EventItem, TripCourse, CourseItem, CourseComment, DateOption } from '../types';

export const mockCurrentUser: User = {
  id: 'user_sujin',
  name: '수진',
  email: 'sujin.busan@localflow.kr',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw13gQPDSpIuMEhG0s5k64vRtDKjl-AuuA8QQMf04bclN6uEl9A-fiF7sXWRo3uhmdnLKokoT4GX1jfJNGfS-yuOfhQx4XIyDMavMkR76Q8Cu1qajmj3P8n8_f4z_fM1Xz51u_n41MgnUGWt5XnFTZjTM-GqlAUlU7g3tqoHWpVUEx8hqf48w2OB9EWgfFfEOodZNwXhYorjjS0f9SETZg40M9PvnYJepgzjet92VQdqWyDeRphExgMg',
  role: 'traveler',
  badgeText: '해변 산책러',
  isVerifiedLocal: false,
  bio: '주말마다 부산 구석구석 숨은 힐링 스팟을 찾아 떠나는 주말 여행자입니다 🌊',
  savedCount: 14,
  forkedCount: 8,
  createdCount: 3,
};

export const mockPlaces: Place[] = [
  {
    id: 'place_haeundae',
    name: '해운대 해변 & 구남로 산책',
    category: '포토스팟',
    area: '해운대/송정',
    address: '해운대구 우동 해운대해변로 264',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop&q=80',
    description: '도심과 푸른 해변이 이어지는 부산 대표 명소 워킹 로드',
    tags: ['포토스팟', '카페탐방', '해변산책'],
    stayDurationMinutes: 90,
    highlightPill: '광안대교 뷰',
  },
  {
    id: 'place_cheongsapo',
    name: '청사포 감성 카페 & 다릿돌전망대',
    category: '카페탐방',
    area: '해운대/송정',
    address: '해운대구 중동 청사포로 128번길',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtXDs32YFVJclzQ2roWOAjzOYEzAhJoNWJWzAGiSku-4i_L-RqF4eid6WhHtte4-ZESJ-OaFuRZbRaWk2_1n9-eTvEI_gN_0E2HAVI_uskLAPtmMmdLyp1EiE-1kN60SxWulI61-vWFKbz83cd5GBl7s17qW6ZCeta13P3iQXX4INdgBU_rg5Ih2OEghtisUqrqLdkGZSECxXQQyMxTGE4IbtLSQJorsROAAXlXYD-d6Zay-67irL-zQ',
    description: '해안 절경 스카이워크 감상 후 루프탑 오션뷰 티타임',
    tags: ['일몰조망', '루프탑', '다릿돌전망대'],
    stayDurationMinutes: 100,
    highlightPill: '17:30 일몰 조망',
  },
  {
    id: 'place_millac',
    name: '밀락더마켓 복합문화공간',
    category: '미식',
    area: '광안리/수영',
    address: '수영구 민락수변로 17번길 56',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPdrfxHVqV0R2H5wVKkgvTgkKPRV4mphEGT251iCKYzb9z57NHWRR7uCCqBGQcoSGU7EkMIrnH9vIXKo-aD6NwqkSe7kiM7uWDDmqUacWiAmhayQXegNe29KnFjZzUgCMC2iM_i7LJAEIBm12Xti4IOJ52jaOuu5QnfaD-3WxuMMYltmMlugHlCtgdcz9mpd9lTB7736omRxNIM6xemLPEI9VdyXsLkHm0KgZph0j1Zuw_CZPuxeMDTw',
    description: '스탠드 계단 오션뷰와 트렌디한 로컬 그로서리 & 저녁 식사',
    tags: ['미식 & 식음료', '스트리트패션', '수제맥주'],
    stayDurationMinutes: 60,
    highlightPill: '계단식 오션뷰',
  },
  {
    id: 'place_drone_show',
    name: '광안리 M 드론 라이트쇼',
    category: '문화예술',
    area: '광안리/수영',
    address: '수영구 광안해변로 219 백사장 일원',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6P1pU4OTFp9GLdHPHfDzkgDFgHS0KJgKJl3Fxguu-66Zun91naervvTgSKY7T2Lz1jpez2FrzEHuR1VIPbLvcEBZrwNnhPE0rqeQl1j5k7H0w3cSm4ymxWn_3h77dxqZzx93lTw74YePVL9Ff64yIp508s-JiVtUhZT9xUZ7ZYZCVDwGGyaodZs6i-KTPbiMBIt4S9poKIExKp3YBUR8W2O-jRmvlIvt3jIBaK1wZPh4ISII8pilYGw',
    description: '광안대교 밤바다를 수놓는 700대 드론의 3D 미디어 아트',
    tags: ['야간특별이벤트', '19:30정시', '무료관람'],
    stayDurationMinutes: 40,
    highlightPill: '19:30 쇼 시작',
  },
  {
    id: 'place_f1963',
    name: 'F1963 복합문화공간',
    category: '문화예술',
    area: '광안리/수영',
    address: '수영구 구락로 123 (망미동)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMtkAXrhKPlUUQrwD2dgoerbuPaF1m5x4Q59RQ2whxuH2hwAXRSAlZD7ZahXrWe-iBBDmuHdqXax6ZnlbnSXu4nGAucc9yKkxr5KwGE-0jPQfzqryY5IEd-JcSJHP4Ma_dpIHhwqOZwE0WT85C4GcuxJydgaIZfgkrHwT0nQ3Y72pc_2yjx0uJkBxZxIAd173FPDv_kHob-cYWgr9HCj91S4pjOUtoAA5pZnmfweZp9ZSDMf1xtqtwmw',
    description: '와이어 공장에서 문화 예술 공간으로 재탄생한 대형 복합단지',
    tags: ['전시', '테라로사', '중정가든'],
    stayDurationMinutes: 80,
  },
  {
    id: 'place_dongbaek',
    name: '동백섬 둘레길 & 누리마루',
    category: '산책로',
    area: '해운대/송정',
    address: '해운대구 우동 동백로 116',
    image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=600&auto=format&fit=crop&q=80',
    description: '울창한 동백나무 숲과 기암괴석, 등대전망대가 어우러진 해안 산책로',
    tags: ['해안산책', '누리마루', '피톤치드'],
    stayDurationMinutes: 60,
  },
  {
    id: 'place_kangkangee',
    name: '깡깡이 예술마을 선착장',
    category: '액티비티',
    area: '영도/남포',
    address: '영도구 대평동 대평북로 36',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-xczpUQaRo27stolR4VrlmEwfpqPRVNBsTke-zJDkJhfuamP0ffbd-NeRqrxfegDjKe1SGfA8rlAyv4UdvGU7P3A8yoZOXV1lnyQ73IXYAwgFhm1nc2sJeX8nmrNV02M7CM-SsJGtkrUq0227RpqyJ8hdu2EiLP27qZrlm3dFm1_AbLxIfi8NbycDRluUdEfjrs7sSLBiG4vDcX-NtZuJ2BYWrnBh-FZc6YJ_gO_BJSoJEoovPVOr_g',
    description: '부산 수리조선 역사가 깃든 항구와 노을 요트 투어',
    tags: ['선셋투어', '바다마을', '로컬체험'],
    stayDurationMinutes: 90,
  },
  {
    id: 'place_jeonpo',
    name: '전포 카페거리 & 소품샵',
    category: '카페탐방',
    area: '전포/서면',
    address: '부산진구 전포대로 209번길 일원',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    description: '개성 넘치는 스페셜티 커피 전문점과 아기자기한 독립 소품샵 골목',
    tags: ['감성카페', '소품샵', '디저트'],
    stayDurationMinutes: 70,
  }
];

export const mockEvents: EventItem[] = [
  {
    id: 'event_drone',
    title: '광안리 M 드론 라이트쇼',
    subtitle: '광안리 해변 특화 공연',
    category: '축제·야간',
    area: '광안리/수영',
    address: '광안리 해변 일원 (민락타운 인근)',
    dateStr: '9월 19일 (토)',
    timeRange: '19:30 ~ 20:00 (30분간)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6P1pU4OTFp9GLdHPHfDzkgDFgHS0KJgKJl3Fxguu-66Zun91naervvTgSKY7T2Lz1jpez2FrzEHuR1VIPbLvcEBZrwNnhPE0rqeQl1j5k7H0w3cSm4ymxWn_3h77dxqZzx93lTw74YePVL9Ff64yIp508s-JiVtUhZT9xUZ7ZYZCVDwGGyaodZs6i-KTPbiMBIt4S9poKIExKp3YBUR8W2O-jRmvlIvt3jIBaK1wZPh4ISII8pilYGw',
    isFree: true,
    badges: ['야간 하이라이트', '코스 삽입 최적'],
    smartInsertionNote: '현재 18:30 민락회타운 식사 후 바로 이어지는 완벽한 힐링 루트입니다.',
    proximityMinutes: 12,
  },
  {
    id: 'event_millac_popup',
    title: '밀락더마켓 영웨이브 팝업',
    subtitle: '복합문화공간 로컬 F&B',
    category: '팝업·플리마켓',
    area: '광안리/수영',
    address: '민락수변로 17번길 56',
    dateStr: '상시 운영 (이번 주말 한정 혜택)',
    timeRange: '12:00 ~ 22:00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPdrfxHVqV0R2H5wVKkgvTgkKPRV4mphEGT251iCKYzb9z57NHWRR7uCCqBGQcoSGU7EkMIrnH9vIXKo-aD6NwqkSe7kiM7uWDDmqUacWiAmhayQXegNe29KnFjZzUgCMC2iM_i7LJAEIBm12Xti4IOJ52jaOuu5QnfaD-3WxuMMYltmMlugHlCtgdcz9mpd9lTB7736omRxNIM6xemLPEI9VdyXsLkHm0KgZph0j1Zuw_CZPuxeMDTw',
    isFree: true,
    badges: ['팝업스토어', '도보 5분 가능'],
    smartInsertionNote: '부산 로컬 스트리트 패션 브랜드와 수제 맥주 페어링 팝업 부스 진행 중',
    proximityMinutes: 0,
  },
  {
    id: 'event_f1963_media',
    title: 'F1963 가을 미디어아트 특별전',
    subtitle: '망미동 복합문화단지',
    category: '전시·공연',
    area: '광안리/수영',
    address: '수영구 구락로 123 (차량 15분)',
    dateStr: '9월 10일 ~ 10월 31일',
    timeRange: '10:00 ~ 18:00 (입장마감 17:00)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMtkAXrhKPlUUQrwD2dgoerbuPaF1m5x4Q59RQ2whxuH2hwAXRSAlZD7ZahXrWe-iBBDmuHdqXax6ZnlbnSXu4nGAucc9yKkxr5KwGE-0jPQfzqryY5IEd-JcSJHP4Ma_dpIHhwqOZwE0WT85C4GcuxJydgaIZfgkrHwT0nQ3Y72pc_2yjx0uJkBxZxIAd173FPDv_kHob-cYWgr9HCj91S4pjOUtoAA5pZnmfweZp9ZSDMf1xtqtwmw',
    isFree: false,
    ticketInfo: '사전발권 권장 · 성인 15,000원',
    badges: ['실내/전시', '일정 충돌 주의'],
    smartInsertionNote: '현재 등록된 17:00 이후 요트투어 일정과 동선이 겹칠 수 있습니다. 15시 이전 배치를 추천합니다.',
    proximityMinutes: 20,
    isConflictRisk: true,
    conflictReason: '현재 등록된 17:00 이후 요트투어 일정과 겹칩니다.',
    replacementProposal: {
      title: '청사포 스카이워크 감성 산책',
      description: '도보 이동거리 동일 · 사전예약 불필요'
    }
  },
  {
    id: 'event_kangkangee_boat',
    title: '깡깡이 선셋 요트 보트투어',
    subtitle: '영도 바다마을 유람',
    category: '로컬체험',
    area: '영도/남포',
    address: '영도구 대평로 깡깡이예술마을 선착장',
    dateStr: '매일 (주말 잔여 3석)',
    timeRange: '17:00 ~ 18:30 (석양 타임)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-xczpUQaRo27stolR4VrlmEwfpqPRVNBsTke-zJDkJhfuamP0ffbd-NeRqrxfegDjKe1SGfA8rlAyv4UdvGU7P3A8yoZOXV1lnyQ73IXYAwgFhm1nc2sJeX8nmrNV02M7CM-SsJGtkrUq0227RpqyJ8hdu2EiLP27qZrlm3dFm1_AbLxIfi8NbycDRluUdEfjrs7sSLBiG4vDcX-NtZuJ2BYWrnBh-FZc6YJ_gO_BJSoJEoovPVOr_g',
    isFree: false,
    ticketInfo: '사전예약 필수 · 1인 28,000원',
    badges: ['로컬체험', '사전예약 필수'],
    smartInsertionNote: '해질녘 노을과 수리조선소 풍경을 바다 위에서 누리는 프라이빗 코스',
    proximityMinutes: 35,
  }
];

export const initialActiveCourseItems: CourseItem[] = [
  {
    id: 'ci_1',
    placeId: 'place_haeundae',
    place: mockPlaces[0],
    order: 1,
    startTime: '14:00',
    endTime: '15:30',
    stayDurationMinutes: 90,
    transitToNext: {
      type: 'bus',
      durationMinutes: 18,
      description: '해운대역 141번 탑승',
    }
  },
  {
    id: 'ci_2',
    placeId: 'place_cheongsapo',
    place: mockPlaces[1],
    order: 2,
    startTime: '16:10',
    endTime: '17:50',
    stayDurationMinutes: 100,
    highlightTag: '일몰 골든타임',
    transitToNext: {
      type: 'taxi',
      durationMinutes: 22,
      description: '광안대교 방면',
      cost: '약 8,500원'
    }
  },
  {
    id: 'ci_3',
    placeId: 'place_millac',
    place: mockPlaces[2],
    order: 3,
    startTime: '18:20',
    endTime: '19:20',
    stayDurationMinutes: 60,
    transitToNext: {
      type: 'walk',
      durationMinutes: 5,
      description: '민락수변공원 데크길'
    }
  },
  {
    id: 'ci_4',
    placeId: 'place_drone_show',
    place: mockPlaces[3],
    order: 4,
    startTime: '19:30',
    endTime: '20:10',
    stayDurationMinutes: 40,
    highlightTag: '야간 특별 이벤트'
  }
];

export const mockCourses: TripCourse[] = [
  {
    id: 'course_top1',
    title: '광안리 드론쇼 & 오션뷰 선셋 완벽 하루 코스',
    subtitle: '이번 주 가장 많이 복사된 코스 TOP 1',
    area: '부산 광안리/해운대',
    author: {
      id: 'author_minwoo',
      name: '부산로컬_민우',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8xKJIpv64YIX8B9V_wZpgF1O2_AsMkzri89OQboVWi4U1h75p1j_NnVkbo8JJUguCSyPQA_vvrM4OgLjW4jg6yh5ggxG9QNDXY5lrMD9z9vUYf197nzTbpfo9_dS6gDEWkM-ufZmLaXmnA4rIv8KWWKI0KkVwqBuupYP1TwPY74Npu3yMM9MGOZIWbl21gpGlSR-OGAqlLuRrahp5CNVbOHvgaYtmw4VIs4TQMIhm7fvsBHaaqonUWg',
      isVerifiedLocal: true,
      badgeText: '인증 로컬'
    },
    tags: ['민락수변 젤라또', '광안리 패들보드', '오션뷰 테라스 횟집', '광안리 드론쇼'],
    totalDuration: '총 5시간 20분',
    estimatedSteps: 7800,
    forkCount: 1192,
    bookmarkCount: 2840,
    reviewCount: 142,
    rating: 4.95,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6P1pU4OTFp9GLdHPHfDzkgDFgHS0KJgKJl3Fxguu-66Zun91naervvTgSKY7T2Lz1jpez2FrzEHuR1VIPbLvcEBZrwNnhPE0rqeQl1j5k7H0w3cSm4ymxWn_3h77dxqZzx93lTw74YePVL9Ff64yIp508s-JiVtUhZT9xUZ7ZYZCVDwGGyaodZs6i-KTPbiMBIt4S9poKIExKp3YBUR8W2O-jRmvlIvt3jIBaK1wZPh4ISII8pilYGw',
    items: initialActiveCourseItems,
    isPublic: true,
    createdAt: '2일 전',
    optimizationMode: 'ai_experience'
  },
  {
    id: 'course_haeundae_essential',
    title: '부산 처음 오는 친구를 위한 광안리·해운대 에센셜',
    subtitle: '도보 수와 실제 동선 소요시간 검증 완료',
    area: '부산 광안리/해운대',
    author: {
      id: 'author_sancheck',
      name: '달맞이_산책러',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0NzDgYc2us2XIekZEtEfOSbZhMx6MyR_kb4ncylX5Arruv9cACKycrgSZegkLTvgwQ6FjJoGs7LTIGfDxDfuHh9fcTvgfly51c0s0WzSxan_zOqfpsxWdU_OAL2Kp1vZ6zFe1sk-_AJ-am0pN65XsaTd6GMH5HKCio689fEoc2IdDKACldt71-MGzQR6HRWIHIlVjF86LQP-C09QKHzltc0fSonPNLK9Iy3PXee4ceACVGUHIItYlRg',
      isVerifiedLocal: true,
      badgeText: '초보가이드'
    },
    tags: ['#초보필독', '당일치기', '해운대 해변', '청사포 다릿돌', '밀락더마켓', '드론쇼'],
    totalDuration: '총 6시간 30분',
    estimatedSteps: 8400,
    forkCount: 841,
    bookmarkCount: 1650,
    reviewCount: 94,
    rating: 4.88,
    coverImage: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop&q=80',
    items: initialActiveCourseItems,
    isPublic: true,
    createdAt: '3일 전'
  },
  {
    id: 'course_rainy_indoor',
    title: '비 오는 날에도 완벽한 부산 실내 감성 투어',
    subtitle: '실내 중심 동선 (비 100% 회피)',
    area: '부산 수영/센텀',
    author: {
      id: 'author_art_suyeong',
      name: '아트투어_수영',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaeU4B0d_rUERpEi3bjg7U3IliepugcOxDRu2mxmONXpACupIImQI1Uzy0eHU4tlN2mLKawCJiQwOaTAevOLeM-cG0wq4Mx749w4--qSapsFPTviFgnnVBpkzbhHwvP_WZqqyTSNmmWswr9mY4kWOKOaZ3_JWiOUcQJwgVcDKHhvsGN_tgnMqYGjUOSZzADVe8yVh1LUaeiRUUQB9V7V81jt8uXlujjF2ebEF_U6VgG1ii-Z28v5pTXg',
      isVerifiedLocal: true,
      badgeText: '전시큐레이터'
    },
    tags: ['#우천안심', '실내 힐링', 'F1963 복합문화', '센텀 신세계 스파', '마린시티 실내 다이닝'],
    totalDuration: '총 5시간',
    estimatedSteps: 4200,
    forkCount: 520,
    bookmarkCount: 980,
    reviewCount: 52,
    rating: 4.82,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMtkAXrhKPlUUQrwD2dgoerbuPaF1m5x4Q59RQ2whxuH2hwAXRSAlZD7ZahXrWe-iBBDmuHdqXax6ZnlbnSXu4nGAucc9yKkxr5KwGE-0jPQfzqryY5IEd-JcSJHP4Ma_dpIHhwqOZwE0WT85C4GcuxJydgaIZfgkrHwT0nQ3Y72pc_2yjx0uJkBxZxIAd173FPDv_kHob-cYWgr9HCj91S4pjOUtoAA5pZnmfweZp9ZSDMf1xtqtwmw',
    items: [
      {
        id: 'ci_r1',
        placeId: 'place_f1963',
        place: mockPlaces[4],
        order: 1,
        startTime: '13:00',
        endTime: '15:00',
        stayDurationMinutes: 120,
        transitToNext: {
          type: 'subway',
          durationMinutes: 15,
          description: '센텀시티역 이동'
        }
      },
      {
        id: 'ci_r2',
        placeId: 'place_millac',
        place: mockPlaces[2],
        order: 2,
        startTime: '15:30',
        endTime: '18:00',
        stayDurationMinutes: 150,
      }
    ],
    isPublic: true,
    createdAt: '5일 전'
  },
  {
    id: 'course_couple_2d1n',
    title: '부산 처음 오는 연인과 1박 2일',
    subtitle: '데이트 & 로컬 맛집 인기 1위',
    area: '해운대 · 광안리',
    author: {
      id: 'author_sujin',
      name: '수진',
      avatar: mockCurrentUser.avatar,
      isVerifiedLocal: false,
    },
    tags: ['해운대 브런치', '동백섬 산책', '요트선셋투어', '광안리 와인'],
    totalDuration: '총 5시간 30분',
    estimatedSteps: 9100,
    forkCount: 932,
    bookmarkCount: 1410,
    reviewCount: 68,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=600&auto=format&fit=crop&q=80',
    items: initialActiveCourseItems,
    isPublic: true,
    createdAt: '1주일 전'
  }
];

export const mockComments: CourseComment[] = [
  {
    id: 'comm_1',
    courseId: 'course_top1',
    author: {
      id: 'u_1',
      name: '제주도민_현지',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    content: '광안리 드론쇼 명당 자리 꿀팁 덕분에 가족들이랑 인생 사진 찍었어요! 도보 시간도 딱 맞았습니다.',
    createdAt: '3시간 전',
    likes: 18,
    isLiked: false
  },
  {
    id: 'comm_2',
    courseId: 'course_top1',
    author: {
      id: 'u_2',
      name: '부산토박이_준수',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    content: '청사포에서 일몰 보고 광안리 넘어가는 타이밍이 진짜 예술이네요. 로컬이 봐도 인정하는 동선입니다 👍',
    createdAt: '어제',
    likes: 24,
    isLiked: true
  }
];

export const mockDateOptions: DateOption[] = [
  {
    dayOfWeek: '토요일',
    dateStr: '9월 21일',
    hasEventChange: false,
    note: '드론쇼 정상 운영'
  },
  {
    dayOfWeek: '목요일 (평일)',
    dateStr: '9월 26일',
    hasEventChange: true,
    note: '드론쇼 휴무 · 대체 제안'
  },
  {
    dayOfWeek: '토요일',
    dateStr: '9월 28일',
    hasEventChange: false,
    note: '드론쇼 정상 운영'
  }
];
