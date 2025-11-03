// 지역 옵션 상수
export const REGIONS = [
  { value: '', label: '전체 지역' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
  { value: '인천', label: '인천' },
  { value: '부산', label: '부산' },
  { value: '대구', label: '대구' },
  { value: '광주', label: '광주' },
  { value: '대전', label: '대전' },
  { value: '울산', label: '울산' },
  { value: '세종', label: '세종' },
  { value: '강원', label: '강원' },
  { value: '충북', label: '충북' },
  { value: '충남', label: '충남' },
  { value: '전북', label: '전북' },
  { value: '전남', label: '전남' },
  { value: '경북', label: '경북' },
  { value: '경남', label: '경남' },
  { value: '제주', label: '제주' },
  { value: '전국', label: '전국' }
];

// 지역명으로 지역 찾기
export const getRegionByValue = (value) => {
  return REGIONS.find(region => region.value === value);
};

// 지역 레이블 가져오기
export const getRegionLabel = (value) => {
  const region = getRegionByValue(value);
  return region ? region.label : value;
};

