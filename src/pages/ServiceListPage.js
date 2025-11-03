import React from "react";
import { useNavigate } from "react-router-dom";
import PostModal from "../components/mypage/PostModal";

// Features
import { useServiceList } from "../features/service/hooks/useServiceList";
import ServiceListHeader from "../features/service/components/list/ServiceListHeader";
import ServiceFilterSidebar from "../features/service/components/list/ServiceFilterSidebar";
import ServiceCard from "../features/service/components/list/ServiceCard";

// Styles
import {
  ServiceListContainer,
  MainContent,
  Divider,
  ServiceContent,
  ServiceGrid,
  LoadMoreButton,
  LoadingSpinner,
  EmptyState,
} from "../features/service/styles/ServiceListPage.styles";

/**
 * 서비스 목록 페이지
 * - 서비스 검색, 필터링, 페이지네이션 기능
 */
const ServiceListPage = () => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [modalType, setModalType] = React.useState(null);

  // 서비스 목록 로직 (커스텀 훅)
  const {
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
  } = useServiceList();

  /**
   * 서비스 카드 클릭 핸들러
   */
  const handleServiceClick = (service) => {
    navigate(`/service/${service.id}`);
  };

  /**
   * 모달 닫기
   */
  const closeModal = () => {
    setSelectedPost(null);
    setModalType(null);
  };

  return (
    <ServiceListContainer>
      {/* 헤더: 검색 및 카테고리 탭 */}
      <ServiceListHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={filters.category}
        onCategoryChange={handleCategoryChange}
      />

      <MainContent>
        {/* 사이드바: 필터 */}
        <ServiceFilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSubcategoryChange={handleSubcategoryChange}
        />

        <Divider />

        {/* 서비스 목록 */}
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
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={handleServiceClick}
                  />
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
