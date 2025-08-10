import React from "react";
import styled from "styled-components";

const PaginationSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 16px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 12px;
    flex-direction: column;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  background: ${(props) =>
    props.active ? props.theme.colors.primary : "white"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.dark)};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    font-size: 0.85rem;
    min-width: 36px;
  }
`;

const PaginationInfo = styled.div`
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 0.9rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    order: 2;
    width: 100%;
  }
`;

const AdminPagination = ({
  currentPage,
  totalCount,
  itemsPerPage,
  handlePageChange,
}) => {
  const currentTotalPages = Math.ceil(totalCount / itemsPerPage);

  console.log(`🔢 AdminPagination 렌더링:`, {
    currentPage,
    totalCount,
    itemsPerPage,
    currentTotalPages,
  });

  if (currentTotalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(currentTotalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handleClick = (page) => {
    console.log(
      `🖱️ AdminPagination 클릭: 페이지 ${page} (현재: ${currentPage})`
    );
    if (handlePageChange && typeof handlePageChange === "function") {
      handlePageChange(page);
    } else {
      console.error("❌ handlePageChange가 함수가 아닙니다:", handlePageChange);
    }
  };

  return (
    <PaginationSection>
      <PaginationControls>
        <PaginationButton
          onClick={() => handleClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </PaginationButton>

        {startPage > 1 && (
          <>
            <PaginationButton onClick={() => handleClick(1)}>
              1
            </PaginationButton>
            {startPage > 2 && <span>...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <PaginationButton
            key={page}
            active={page === currentPage}
            onClick={() => handleClick(page)}
          >
            {page}
          </PaginationButton>
        ))}

        {endPage < currentTotalPages && (
          <>
            {endPage < currentTotalPages - 1 && <span>...</span>}
            <PaginationButton onClick={() => handleClick(currentTotalPages)}>
              {currentTotalPages}
            </PaginationButton>
          </>
        )}

        <PaginationButton
          onClick={() => handleClick(currentPage + 1)}
          disabled={currentPage === currentTotalPages}
        >
          다음
        </PaginationButton>
      </PaginationControls>

      <PaginationInfo>
        {currentPage} / {currentTotalPages} 페이지 (총 {totalCount}개)
      </PaginationInfo>
    </PaginationSection>
  );
};

export default AdminPagination;
