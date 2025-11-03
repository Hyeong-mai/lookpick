// 서비스 카테고리 상수
export const CATEGORIES = [
  { 
    id: "it", 
    name: "IT/개발/디자인", 
    image: "/image/category/it.png", 
    subcategories: [
      "웹·앱 개발",
      "소프트웨어 개발 · 유지보수",
      "인프라 · 보안 · 클라우드",
      "UI·UX 디자인 · 브랜딩",
      "영상·3D·애니메이션"
    ] 
  },
  { 
    id: "design", 
    name: "디자인/콘텐츠", 
    image: "/image/category/design.png", 
    subcategories: [
      "브랜드 디자인",
      "패키지 디자인",
      "영상 제작 · 편집",
      "콘텐츠 제작 · 기획",
      "일러스트 · 캐릭터"
    ] 
  },
  { 
    id: "logistics", 
    name: "물류/운송/창고", 
    image: "/image/category/wearhouse.png", 
    subcategories: [
      "국내 택배 · 화물 운송",
      "국제 물류 · 수출입 대행",
      "보관 · 창고 · 풀필먼트",
      "포장 · 배송 솔루션",
      "물류 시스템 · 재고 관리"
    ] 
  },
  { 
    id: "manufacturing", 
    name: "제조/생산/가공", 
    image: "/image/category/factory.png", 
    subcategories: [
      "금속 · 플라스틱 · 목재 가공",
      "전자 · 기계 부품 생산",
      "식품 · 화학 · 포장 제조",
      "OEM · ODM 생산 대행",
      "시제품 제작 · 3D프린팅"
    ] 
  },
  { 
    id: "infrastructure", 
    name: "설비/건설/유지보수", 
    image: "/image/category/construction.png", 
    subcategories: [
      "건축 · 인테리어 시공",
      "전기 · 기계 · 배관 설비",
      "공장 · 시설 유지보수",
      "환경 · 안전 관리",
      "냉난방 · 통신 · 보안 설비"
    ] 
  },
  { 
    id: "education", 
    name: "교육/컨설팅/인증", 
    image: "/image/category/education.png", 
    subcategories: [
      "기업 교육 · 직무 교육",
      "경영 · 전략 컨설팅",
      "IT · 기술 컨설팅",
      "특허 · 인증 · 법률 서비스",
      "인사 · 노무 · 회계 지원"
    ] 
  },
  { 
    id: "office", 
    name: "사무/문서/번역", 
    image: "/image/category/document.png", 
    subcategories: [
      "문서 작성 · 번역 · 통역",
      "인사 · 채용 대행",
      "회계 · 세무 · 법무",
      "고객센터 · 아웃소싱",
      "비즈니스 지원 · 관리"
    ] 
  },
  { 
    id: "advertising", 
    name: "광고/프로모션/행사", 
    image: "/image/category/ad.png", 
    subcategories: [
      "온·오프라인 광고 제작",
      "이벤트 · 전시 · 프로모션 대행",
      "인쇄물 · 판촉물 제작",
      "옥외광고 · 간판 설치",
      "모델 · 인플루언서"
    ] 
  },
  { 
    id: "machinery", 
    name: "기계·장비·산업재", 
    image: "/image/category/machine.png", 
    subcategories: [
      "산업용 기계 · 공구 · 장비",
      "전자 · 계측기기",
      "건설 · 중장비 임대",
      "자동화 설비 · 로봇 기술",
      "소모품 · 부품 유통"
    ] 
  },
  { 
    id: "lifestyle", 
    name: "생활/복지/기타 서비스", 
    image: "/image/category/welfare.png", 
    subcategories: [
      "청소 · 방역 · 시설관리",
      "복지 · 음식 · 식자재",
      "여행 · 숙박 · 행사 지원",
      "기타 전문 서비스"
    ] 
  }
];

// 카테고리 ID로 카테고리 찾기
export const getCategoryById = (categoryId) => {
  return CATEGORIES.find(cat => cat.id === categoryId);
};

// 카테고리 이름 가져오기
export const getCategoryName = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.name : '';
};

// 서브카테고리 목록 가져오기
export const getSubcategories = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.subcategories : [];
};

