import React from 'react';
import { CATEGORIES, REGIONS } from '../../../../shared/constants';
import {
  Sidebar,
  SidebarTitle,
  SubcategorySection,
  SubcategoryTitle,
  SubcategoryList,
  SubcategoryItem,
  FilterSection,
  FilterTitle,
  FilterGroup,
  FilterSelect,
} from '../../styles/ServiceListPage.styles';

/**
 * 서비스 필터 사이드바
 */
const ServiceFilterSidebar = ({
  filters,
  onFilterChange,
  onSubcategoryChange,
}) => {
  const selectedCategory = CATEGORIES.find(cat => cat.id === filters.category);

  return (
    <Sidebar>
      <SidebarTitle>필터</SidebarTitle>
      
      {/* 서브카테고리 섹션 */}
      {filters.category && selectedCategory && (
        <SubcategorySection>
          <SubcategoryTitle>세부 분야</SubcategoryTitle>
          <SubcategoryList>
            <SubcategoryItem
              active={!filters.subcategory}
              onClick={() => onSubcategoryChange('')}
            >
              전체
            </SubcategoryItem>
            {selectedCategory.subcategories.map(subcategory => (
              <SubcategoryItem
                key={subcategory}
                active={filters.subcategory === subcategory}
                onClick={() => onSubcategoryChange(subcategory)}
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
            onChange={(e) => onFilterChange('region', e.target.value)}
          >
            {REGIONS.map(option => (
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
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="createdAt">최신순</option>
            <option value="views">조회수순</option>
            <option value="serviceName">이름순</option>
          </FilterSelect>
        </FilterGroup>
      </FilterSection>
    </Sidebar>
  );
};

export default ServiceFilterSidebar;

