import React, { useState, useEffect } from 'react';
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
  CustomSelectWrapper,
  CustomSelectButton,
  CustomSelectDropdown,
  CustomSelectOption,
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
  const [openDropdown, setOpenDropdown] = useState(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handleSelectToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleSelectOption = (filterType, value) => {
    onFilterChange(filterType, value);
    setOpenDropdown(null);
  };

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
          <CustomSelectWrapper data-dropdown>
            <CustomSelectButton
              type="button"
              onClick={() => handleSelectToggle('region')}
              isOpen={openDropdown === 'region'}
              hasValue={!!filters.region}
            >
              {REGIONS.find(r => r.value === filters.region)?.label || '전체'}
            </CustomSelectButton>
            <CustomSelectDropdown isOpen={openDropdown === 'region'}>
              {REGIONS.map(option => (
                <CustomSelectOption
                  key={option.value}
                  onClick={() => handleSelectOption('region', option.value)}
                  isSelected={filters.region === option.value}
                >
                  {option.label}
                </CustomSelectOption>
              ))}
            </CustomSelectDropdown>
          </CustomSelectWrapper>
        </FilterGroup>
      </FilterSection>

      {/* 정렬 필터 */}
      <FilterSection>
        <FilterTitle>정렬</FilterTitle>
        <FilterGroup>
          <CustomSelectWrapper data-dropdown>
            <CustomSelectButton
              type="button"
              onClick={() => handleSelectToggle('sortBy')}
              isOpen={openDropdown === 'sortBy'}
              hasValue={!!filters.sortBy}
            >
              {filters.sortBy === 'createdAt' && '최신순'}
              {filters.sortBy === 'views' && '조회수순'}
              {filters.sortBy === 'serviceName' && '이름순'}
            </CustomSelectButton>
            <CustomSelectDropdown isOpen={openDropdown === 'sortBy'}>
              <CustomSelectOption
                onClick={() => handleSelectOption('sortBy', 'createdAt')}
                isSelected={filters.sortBy === 'createdAt'}
              >
                최신순
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('sortBy', 'views')}
                isSelected={filters.sortBy === 'views'}
              >
                조회수순
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('sortBy', 'serviceName')}
                isSelected={filters.sortBy === 'serviceName'}
              >
                이름순
              </CustomSelectOption>
            </CustomSelectDropdown>
          </CustomSelectWrapper>
        </FilterGroup>
      </FilterSection>
    </Sidebar>
  );
};

export default ServiceFilterSidebar;

