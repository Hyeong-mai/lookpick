import React from "react";
import styled from "styled-components";

const FilterContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    justify-content: center;
  }
`;

const SearchSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 400px;
  padding: 10px 16px;
  border: 2px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.1);
  }
  
  &::placeholder {
    color: ${(props) => props.theme.colors.gray[400]};
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => props.theme.colors.gray[200]};
  color: ${(props) => props.theme.colors.gray[700]};
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${(props) => props.theme.colors.gray[300]};
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) =>
    props.active ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.primary)};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.85rem;
    flex: 1;
    min-width: 0;
    text-align: center;
  }
`;

const AdminFilters = ({ filter, setFilter, stats, searchTerm, setSearchTerm, onSearch, onClearSearch, searchPlaceholder }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <FilterContainer>
      <SearchSection>
        <SearchInput
          type="text"
          placeholder={searchPlaceholder || "서비스명, 회사명, 이메일로 검색..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <SearchButton onClick={onSearch}>검색</SearchButton>
        {searchTerm && (
          <ClearButton onClick={onClearSearch}>초기화</ClearButton>
        )}
      </SearchSection>
      
      <FilterSection>
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          전체
        </FilterButton>
        <FilterButton
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          대기중 ({stats.pending})
        </FilterButton>
        <FilterButton
          active={filter === "approved"}
          onClick={() => setFilter("approved")}
        >
          승인됨 ({stats.approved})
        </FilterButton>
        <FilterButton
          active={filter === "rejected"}
          onClick={() => setFilter("rejected")}
        >
          거절됨 ({stats.rejected})
        </FilterButton>
      </FilterSection>
    </FilterContainer>
  );
};

export default AdminFilters;
