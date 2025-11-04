import React from 'react';
import { CATEGORIES } from '../../../../shared/constants';
import {
  Header,
  HeaderContent,
  HeaderTitle,
  SearchSection,
  SearchContainer,
  SearchInput,
  SearchIcon,
  CategoryTabs,
  CategoryTab,
} from '../../styles/ServiceListPage.styles';

/**
 * 서비스 목록 헤더 (검색 및 카테고리 탭)
 */
const ServiceListHeader = ({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <Header>
      <HeaderContent>
        <HeaderTitle>서비스 목록</HeaderTitle>
        
        <SearchSection>
          <SearchContainer>
            <SearchIcon><ion-icon name="search-outline"></ion-icon></SearchIcon>
            <SearchInput
              type="text"
              placeholder="서비스명, 설명, 지역, 카테고리로 검색..."
              value={searchQuery}
              onChange={onSearchChange}
            />
          </SearchContainer>
        </SearchSection>

        <CategoryTabs>
          <CategoryTab 
            active={!selectedCategory}
            onClick={() => onCategoryChange('')}
          >
            전체
          </CategoryTab>
          {CATEGORIES.map(category => (
            <CategoryTab
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </CategoryTab>
          ))}
        </CategoryTabs>
      </HeaderContent>
    </Header>
  );
};

export default ServiceListHeader;

