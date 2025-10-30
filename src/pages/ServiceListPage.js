import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { collection, query, orderBy, getDocs, limit, startAfter, where } from "firebase/firestore";
import { db } from "../firebase/config";
import PostModal from "../components/mypage/PostModal";

/* eslint-disable no-unused-vars */
const ServiceListContainer = styled.div`
  min-height: 100vh;
//   background-color: #f8fafc;
`;

const Header = styled.div`
  background: white;
  color: #0f172a;
  padding: 40px 0;
  border-bottom: 1px solid #e2e8f0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -0.025em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const CategoryTab = styled.button`
  background: ${props => props.active ? '#f0f9ff' : '#f8fafc'};
  color: ${props => props.active ? '#0ea5e9' : '#64748b'};
  border: 1px solid ${props => props.active ? '#0ea5e9' : '#e2e8f0'};
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f0f9ff;
    color: #0ea5e9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  font-size: 1rem;
  background: white;
  color: #374151;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px 18px 14px 45px;
    font-size: 0.9rem;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.2rem;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 16px;
    font-size: 1.1rem;
  }
`;

const MainContent = styled.div`
   max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  display: grid;
  grid-template-columns: 280px 1px 1fr;
  gap: 0;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    gap: 20px;
  }
`;

const Divider = styled.div`
  background: #e2e8f0;
  height: 100vh;
  min-height: 100vh;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Sidebar = styled.div`
  background: white;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 30px;

  @media (max-width: 1024px) {
    position: static;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
`;

const SubcategorySection = styled.div`
  margin-bottom: 32px;
`;

const SubcategoryTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

const SubcategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubcategoryItem = styled.button`
  background: ${props => props.active ? '#f0f9ff' : 'transparent'};
  color: ${props => props.active ? '#0ea5e9' : '#6b7280'};
  border: 1px solid ${props => props.active ? '#0ea5e9' : 'transparent'};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
    color: #374151;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
`;

const ServiceContent = styled.div`
  background: white;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ServiceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: visible;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  gap: 0;
  height: 300px;
  position: relative;
  z-index: 1;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    height: auto;
    min-height: auto;
  }
`;

const ServiceThumbnail = styled.div`
  width: 40%;
  height: 300px;
  display: block;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  transition: width 0.3s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    margin: 0;
    padding: 0;
    vertical-align: top;
  }

  ${ServiceCard}:hover & {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
    
    img {
      height: 100%;
    }
    
    ${ServiceCard}:hover & {
      width: 100%;
    }
  }
`;

const ServiceCardContent = styled.div`
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  z-index: 2;
  transition: padding 0.3s ease;

  ${ServiceCard}:hover & {
    flex: 1;

    justify-content: space-between;
    width: 100%;
    overflow-y: auto;
  }

  @media (max-width: 768px) {
    overflow: visible;
    overflow-y: visible;
  }
`;

// Removed unused component
const _ServiceDetails = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  opacity: 0;
  transform: translateY(10px);
  border-radius: 16px;
  z-index: 3;
  gap: 16px;
`;

// Removed unused component
const _DetailItem = styled.li`
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  
  &::before {
    content: "•";
    color: #667eea;
    font-weight: bold;
    margin-right: 8px;
  }
`;

// Removed unused component
const _DetailButton = styled.button`
  background: #000000;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;

  &:hover {
    background: #333333;
    transform: translateY(-1px);
  }
`;

const ServiceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CompanyLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  background: white;

  ${ServiceCard}:hover & {
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ServiceTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const ServiceDescription = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.3;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${ServiceCard}:hover & {
    -webkit-line-clamp: unset;
    display: block;
  }

  @media (max-width: 768px) {
    -webkit-line-clamp: 3;
  }
`;

const ServiceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const MetaTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const DetailedPricing = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  flex-wrap: wrap;
  width: 100%;
  max-height: 0;
  overflow: hidden;

  ${ServiceCard}:hover & {
    max-height: 500px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    max-height: none;
    overflow: visible;
  }
`;

const PricingOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;

  flex: 1;
  min-width: 0;

`;

const PricingName = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  text-align: center;
`;

const PricingPrice = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
`;

// Removed unused component
const _AdditionalInfo = styled.div`
  display: none;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;

  ${ServiceCard}:hover & {
    display: flex;
  }
`;

// Removed unused component
const _InfoRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Removed unused component
const _InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
//   border-left: 3px solid #000000;
`;

// Removed unused component
const _InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2px;
`;

// Removed unused component
const _InfoValue = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  word-break: break-all;
`;

// Removed unused component
const _Tag = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ServiceFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: auto;
`;

// Removed unused component
const _ServiceRegion = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
`;

const ServicePrice = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  margin-left: auto;

  ${ServiceCard}:hover & {
    display: none;
  }
`;

const DetailButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  position: absolute;
  right: -100px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  opacity: 0;

  .service-card-wrapper:hover & {
    opacity: 1;
    animation: bounce 1s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(-50%) translateX(0);
    }
    50% {
      transform: translateY(-50%) translateX(10px);
    }
  }

  span {
    font-size: 1.2rem;
  }
`;

// Removed unused component
const _ViewButton = styled.button`
  background: #333333;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  display: none;

  ${ServiceCard}:hover & {
    display: block;
  }

  &:hover {
    background: #555555;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const LoadMoreButton = styled.button`
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
  display: block;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #374151;
  }

  p {
    font-size: 1rem;
    margin-bottom: 0;
  }
`;

const ServiceListPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    region: '',
    sortBy: 'createdAt'
  });
  const [searchQuery, setSearchQuery] = useState('');
  // 환경변수에서 관리자 UID 불러오기 (빌드 시점에 포함됨)
  const ADMIN_UID = process.env.REACT_APP_ADMIN_UID || '9TpvLL3ufjRDvfNmWjqMloSbETg1';

  // 관리자 UID 조회
  // useEffect(() => {
  //   const fetchAdminUid = async () => {
  //     const usersRef = collection(db, "users");
  //     const q = query(usersRef, where("email", "==", "admin@gmail.com"));
  //     const querySnapshot = await getDocs(q);
  //     if (!querySnapshot.empty) {
  //       setAdminUid(querySnapshot.docs[0].id);
  //     }
  //   };
  //   fetchAdminUid();
  // }, []);

  // 카테고리 데이터
  const categories = [
    { 
      id: "software", 
      name: "개발/소프트웨어/IT", 
      image: "/image/category/it.png", 
      subcategories: [
        "소프트웨어 개발 / 앱·웹 개발",
        "클라우드 · 서버 · 네트워크 구축",
        "데이터 분석 · 인공지능(AI)",
        "IT 유지보수 · 기술 아웃소싱",
        "보안 · 시스템 통합(SI)"
      ] 
    },
    { 
      id: "design", 
      name: "디자인/콘텐츠/마케팅", 
      image: "/image/category/design.png", 
      subcategories: [
        "브랜드 · 그래픽 디자인",
        "웹·UI/UX 디자인",
        "영상 · 사진 · 모션그래픽",
        "디지털 마케팅 · 광고 대행",
        "콘텐츠 제작 · 카피라이팅"
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

  // 지역 옵션
  const regionOptions = [
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

  // 서비스 목록 로드
  const loadServices = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setServices([]);
        setLastDoc(null);
        setHasMore(true);
      }

      let servicesQuery = query(
        collection(db, "services"),
        where("status", "==", "approved"),
        orderBy(filters.sortBy, "desc")
      );

      // 카테고리 필터는 클라이언트 사이드에서 처리 (Firestore 인덱스 없이 처리)
      // 지역 필터는 클라이언트 사이드에서 처리 (부분 문자열 포함 검색)

      // 페이지네이션
      if (isLoadMore && lastDoc) {
        servicesQuery = query(servicesQuery, startAfter(lastDoc));
      }
      servicesQuery = query(servicesQuery, limit(12));

      const querySnapshot = await getDocs(servicesQuery);
      const newServices = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const serviceData = {
          id: doc.id,
          serviceName: data.serviceName,
          companyWebsite: data.companyWebsite,
          companyLogo: data.companyLogo || null,
          price: data.price,
          pricingOptions: data.pricingOptions || [],
          isPricingOptional: data.isPricingOptional,
          serviceRegion: data.serviceRegion,
          serviceDescription: data.serviceDescription,
          categories: data.categories || [],
          subcategories: data.subcategories || [],
          tags: data.tags || [],
          files: data.files || [],
          thumbnail: data.thumbnail || null,
          uploadMethod: data.uploadMethod || "upload",
          directContent: data.directContent || "",
          freePostContent: data.freePostContent,
          contactName: data.contactName || "",
          contactPosition: data.contactPosition || "",
          contactPhone: data.contactPhone || "",
          contactEmail: data.contactEmail || "",
          status: data.status || "pending",
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString()
            : "Unknown",
          views: data.views || 0,
          userId: data.userId,
        };

        // 카테고리 필터 적용
        let passesCategoryFilter = true;
        if (filters.category && serviceData.categories && serviceData.categories.length > 0) {
          passesCategoryFilter = serviceData.categories.includes(filters.category);
        }

        // 서브카테고리 필터 적용
        let passesSubcategoryFilter = true;
        if (filters.subcategory && serviceData.subcategories && serviceData.subcategories.length > 0) {
          // subcategory는 "categoryId:subcategoryName" 형식으로 저장되어 있음
          const subcategoryKey = filters.category ? `${filters.category}:${filters.subcategory}` : filters.subcategory;
          passesSubcategoryFilter = serviceData.subcategories.some(sub => sub === subcategoryKey);
        }

        // 지역 필터 적용 (포함 검색)
        let passesRegionFilter = true;
        if (filters.region && serviceData.serviceRegion) {
          passesRegionFilter = serviceData.serviceRegion.includes(filters.region);
        }

        // 검색 필터 적용
        let passesSearchFilter = true;
        if (searchQuery.trim()) {
          const searchLower = searchQuery.toLowerCase();
          passesSearchFilter = 
            serviceData.serviceName.toLowerCase().includes(searchLower) ||
            serviceData.serviceDescription.toLowerCase().includes(searchLower) ||
            serviceData.serviceRegion.toLowerCase().includes(searchLower) ||
            serviceData.categories.some(cat => cat.toLowerCase().includes(searchLower));
        }

        if (passesCategoryFilter && passesSubcategoryFilter && passesRegionFilter && passesSearchFilter) {
          newServices.push(serviceData);
        }
      });

      // *** 아래가 핵심 정렬 코드 ***
      let reorderedServices = newServices;
      if (ADMIN_UID) {
        const adminServices = newServices.filter(s => s.userId === ADMIN_UID);
        const normalServices = newServices.filter(s => s.userId !== ADMIN_UID);
        reorderedServices = [...adminServices, ...normalServices];
      }

      if (isLoadMore) {
        setServices(prev => [...prev, ...reorderedServices]);
      } else {
        setServices(reorderedServices);
      }

      // 페이지네이션 상태 업데이트
      if (querySnapshot.docs.length < 12) {
        setHasMore(false);
      } else {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

    } catch (error) {
      console.error("서비스 목록 로드 실패:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId,
      subcategory: '' // 카테고리 변경 시 서브카테고리 초기화
    }));
  };

  // 서브카테고리 변경 핸들러
  const handleSubcategoryChange = (subcategory) => {
    setFilters(prev => ({
      ...prev,
      subcategory: subcategory
    }));
  };

  // 검색 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 더 보기 버튼 클릭
  const handleLoadMore = () => {
    loadServices(true);
  };

  // 서비스 카드 클릭
  const handleServiceClick = (service) => {
    navigate(`/service/${service.id}`);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedPost(null);
    setModalType(null);
  };

  // 초기 로드 및 필터 변경 시 재로드
  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]);

  return (
    <ServiceListContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle>서비스 목록</HeaderTitle>
          
          <SearchSection>
            <SearchContainer>
              <SearchIcon>🔍</SearchIcon>
              <SearchInput
                type="text"
                placeholder="서비스명, 설명, 지역, 카테고리로 검색..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </SearchContainer>
          </SearchSection>

          <CategoryTabs>
            <CategoryTab 
              active={!filters.category}
              onClick={() => handleCategoryChange('')}
            >
              전체
            </CategoryTab>
            {categories.map(category => (
              <CategoryTab
                key={category.id}
                active={filters.category === category.id}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </CategoryTab>
            ))}
          </CategoryTabs>
        </HeaderContent>
      </Header>

      <MainContent>
        <Sidebar>
          <SidebarTitle>필터</SidebarTitle>
          
          {/* 서브카테고리 섹션 */}
          {filters.category && (
            <SubcategorySection>
              <SubcategoryTitle>세부 분야</SubcategoryTitle>
              <SubcategoryList>
                <SubcategoryItem
                  active={!filters.subcategory}
                  onClick={() => handleSubcategoryChange('')}
                >
                  전체
                </SubcategoryItem>
                {categories.find(cat => cat.id === filters.category)?.subcategories.map(subcategory => (
                  <SubcategoryItem
                    key={subcategory}
                    active={filters.subcategory === subcategory}
                    onClick={() => handleSubcategoryChange(subcategory)}
                  >
                    {subcategory}
                  </SubcategoryItem>
                ))}
              </SubcategoryList>
            </SubcategorySection>
          )}

          {/* 지역 필터 */}
          <FilterSection>
            <FilterTitle>지역</FilterTitle>
            <FilterGroup>
              <FilterSelect
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                {regionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          </FilterSection>

          {/* 정렬 필터 */}
          <FilterSection>
            <FilterTitle>정렬</FilterTitle>
            <FilterGroup>
              <FilterSelect
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="createdAt">최신순</option>
                <option value="views">조회수순</option>
                <option value="serviceName">이름순</option>
              </FilterSelect>
            </FilterGroup>
          </FilterSection>
        </Sidebar>

        <Divider />

        <ServiceContent>

        {loading ? (
          <LoadingSpinner>서비스를 불러오는 중...</LoadingSpinner>
        ) : services.length === 0 ? (
          <EmptyState>
            <h3>등록된 서비스가 없습니다</h3>
            <p>다른 필터를 시도해보세요.</p>
          </EmptyState>
        ) : (
          <>
            <ServiceGrid>
              {services.map((service) => (
                <div key={service.id} className="service-card-wrapper" style={{ position: 'relative' }}>
                <ServiceCard onClick={() => handleServiceClick(service)}>
                  <ServiceThumbnail>
                    {service.thumbnail ? (
                      <img
                        src={service.thumbnail.url || service.thumbnail}
                        alt={service.serviceName}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '3rem', color: '#9ca3af' }}>🛠️</div>
                    )}
                  </ServiceThumbnail>
                  
                  <ServiceCardContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <ServiceTitleContainer>
                        {service.companyLogo && (
                          <CompanyLogo
                            src={service.companyLogo.url || service.companyLogo}
                            alt="회사 로고"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <ServiceTitle>{service.serviceName}</ServiceTitle>
                      </ServiceTitleContainer>
                      
                      <ServiceMeta>
                        <MetaRow>
                          {service.serviceRegion && (
                            <MetaTag>{service.serviceRegion}</MetaTag>
                          )}
                          {/* 관리자 서비스가 아닌 경우만 카테고리/서브카테고리 노출 */}
                          {service.userId !== ADMIN_UID && (
                            <>
                              {service.categories && service.categories.map((cat, index) => (
                                <MetaTag key={`cat-${index}`}>{cat}</MetaTag>
                              ))}
                            </>
                          )}
                        </MetaRow>
                        <MetaRow>
                          {/* 관리자 서비스가 아닌 경우만 서브카테고리 노출 */}
                          {service.userId !== ADMIN_UID && (
                            <>
                              {service.subcategories && service.subcategories.map((sub, index) => (
                                <MetaTag key={`sub-${index}`}>{sub.split(':')[1]}</MetaTag>
                              ))}
                            </>
                          )}
                          {service.tags && service.tags.slice(0, 3).map((tag, index) => (
                            <MetaTag key={`tag-${index}`}>#{tag}</MetaTag>
                          ))}
                        </MetaRow>
                      </ServiceMeta>
                      <ServiceDescription>
                        {service.serviceDescription || '서비스 설명이 없습니다.'}
                      </ServiceDescription>
                    </div>
                   

                    <ServiceFooter>
                      <ServicePrice>
                        {service.pricingOptions && service.pricingOptions.length > 0 ? (
                          `${service.pricingOptions[0].price || '문의'}원부터`
                        ) : (
                          service.price ? `${service.price}원` : '문의'
                        )}
                      </ServicePrice>
                    </ServiceFooter>

                    <DetailedPricing>
                      {service.pricingOptions && service.pricingOptions.length > 0 ? (
                        service.pricingOptions.map((option, index) => (
                          <PricingOption key={index}>
                            <PricingName>{option.name}</PricingName>
                            <PricingPrice>{option.price.toLocaleString()}원</PricingPrice>
                          </PricingOption>
                        ))
                      ) : (
                        <PricingOption>
                          <PricingName>기본 가격</PricingName>
                          <PricingPrice>{service.price || '문의'}원</PricingPrice>
                        </PricingOption>
                      )}
                    </DetailedPricing>

                  </ServiceCardContent>
                </ServiceCard>
                
                <DetailButton>
                  자세히 보기<span>›</span>
                </DetailButton>
                </div>
              ))}

            </ServiceGrid>

            {hasMore && (
              <LoadMoreButton
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? '로딩 중...' : '더 보기'}
              </LoadMoreButton>
            )}
          </>
        )}
        </ServiceContent>
      </MainContent>

      {/* 모달 */}
      {modalType && selectedPost && (
        <PostModal
          modalType={modalType}
          selectedPost={selectedPost}
          closeModal={closeModal}
        />
      )}
    </ServiceListContainer>
  );
};

export default ServiceListPage;




