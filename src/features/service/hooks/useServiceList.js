import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, getDocs, limit, startAfter, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../core/firebase/config';

/**
 * 서비스 목록 로딩 및 필터링을 담당하는 커스텀 훅
 */
export const useServiceList = (initialFilters = {}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    region: '',
    sortBy: 'createdAt',
    ...initialFilters
  });
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 서비스 목록 로드
   */
  const loadServices = useCallback(async (isLoadMore = false) => {
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

      // 페이지네이션
      if (isLoadMore && lastDoc) {
        servicesQuery = query(servicesQuery, startAfter(lastDoc));
      }

      servicesQuery = query(servicesQuery, limit(12));

      const querySnapshot = await getDocs(servicesQuery);
      const newServices = [];

      // 각 서비스의 유저 인증 상태 조회
      const servicePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const serviceData = { id: docSnapshot.id, ...docSnapshot.data() };
        
        // 기본값 설정
        serviceData.userVerificationStatus = 'not_verified';
        
        // 유저의 인증 상태 조회
        if (serviceData.userId) {
          try {
            const userDocRef = doc(db, "users", serviceData.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              serviceData.userVerificationStatus = userData.verificationStatus || 'not_verified';
            }
          } catch (error) {
            console.error("사용자 정보 조회 실패:", error);
          }
        }
        
        return serviceData;
      });

      const allServices = await Promise.all(servicePromises);

      allServices.forEach((serviceData) => {
        // 카테고리 필터 적용
        let passesCategoryFilter = true;
        if (filters.category && serviceData.categories && serviceData.categories.length > 0) {
          passesCategoryFilter = serviceData.categories.includes(filters.category);
        }

        // 서브카테고리 필터 적용
        let passesSubcategoryFilter = true;
        if (filters.subcategory && serviceData.subcategories && serviceData.subcategories.length > 0) {
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

      // 어드민 게시물을 최상단에 고정, 그 다음 인증된 기업, 마지막으로 일반 서비스
      const ADMIN_UID = process.env.REACT_APP_ADMIN_UID;
      const adminServices = newServices.filter(s => s.userId === ADMIN_UID);
      const verifiedServices = newServices.filter(s => s.userVerificationStatus === 'verified' && s.userId !== ADMIN_UID);
      const normalServices = newServices.filter(s => s.userVerificationStatus !== 'verified' && s.userId !== ADMIN_UID);
      const reorderedServices = [...adminServices, ...verifiedServices, ...normalServices];

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
  }, [filters, searchQuery, lastDoc]);

  /**
   * 필터 변경 핸들러
   */
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  /**
   * 카테고리 변경 핸들러
   */
  const handleCategoryChange = useCallback((categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId,
      subcategory: '' // 카테고리 변경 시 서브카테고리 초기화
    }));
  }, []);

  /**
   * 서브카테고리 변경 핸들러
   */
  const handleSubcategoryChange = useCallback((subcategory) => {
    setFilters(prev => ({
      ...prev,
      subcategory: subcategory
    }));
  }, []);

  /**
   * 검색 핸들러
   */
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  /**
   * 더 보기 버튼 클릭
   */
  const handleLoadMore = useCallback(() => {
    loadServices(true);
  }, [loadServices]);

  /**
   * 필터 변경 시 자동 로드
   */
  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]);

  return {
    services,
    loading,
    loadingMore,
    hasMore,
    filters,
    searchQuery,
    handleFilterChange,
    handleCategoryChange,
    handleSubcategoryChange,
    handleSearchChange,
    handleLoadMore,
  };
};

