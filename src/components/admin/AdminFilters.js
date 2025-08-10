import React from "react";
import styled from "styled-components";

const FilterSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 20px;
    justify-content: center;
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

const AdminFilters = ({ filter, setFilter, stats }) => {
  return (
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
  );
};

export default AdminFilters;
