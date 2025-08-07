import React from "react";
import styled from "styled-components";

const FilterSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
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

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
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
