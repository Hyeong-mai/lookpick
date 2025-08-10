import React from "react";
import styled from "styled-components";
import AdminPagination from "./AdminPagination";

const ContentSection = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
`;

const ContentHeader = styled.div`
  padding: 20px;
  background: ${(props) => props.theme.colors.gray[50]};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ContentTitle = styled.h2`
  font-size: 1.3rem;
  color: ${(props) => props.theme.colors.dark};

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const ContentCount = styled.span`
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ContentList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const ItemContainer = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 20px;
  align-items: center;

  &:hover {
    background: ${(props) => props.theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
    align-items: stretch;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }
`;

const ItemInfo = styled.div`
  @media (max-width: 768px) {
    order: 1;
  }
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 4px;
  }
`;

const ItemMeta = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.gray[600]};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    gap: 12px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    gap: 8px;
    flex-direction: column;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  align-self: flex-start;
  background: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#FEF3C7";
      case "approved":
        return "#D1FAE5";
      case "rejected":
        return "#FEE2E2";
      default:
        return props.theme.colors.gray[200];
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "pending":
        return "#92400E";
      case "approved":
        return "#065F46";
      case "rejected":
        return "#991B1B";
      default:
        return props.theme.colors.gray[600];
    }
  }};

  @media (max-width: 768px) {
    order: 2;
    align-self: flex-start;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 3px 8px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    order: 3;
    gap: 6px;
    width: 100%;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &.approve {
    background: #10b981;
    color: white;
    &:hover {
      background: #059669;
    }
  }

  &.reject {
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
  }

  &.delete {
    background: #6b7280;
    color: white;
    &:hover {
      background: #4b5563;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 6px 8px;
  }
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const AdminPostsList = ({
  filteredPosts,
  postFilter,
  itemsPerPage,
  formatDate,
  getStatusText,
  openModal,
  updatePostStatus,
  deletePost,
  postCurrentPage,
  postTotalCount,
  handlePostPageChange,
}) => {
  return (
    <ContentSection>
      <ContentHeader>
        <ContentTitle>게시물 목록</ContentTitle>
        <ContentCount>
          {filteredPosts.length}개 (페이지당 {itemsPerPage}개)
        </ContentCount>
      </ContentHeader>

      <ContentList>
        {filteredPosts.length === 0 ? (
          <EmptyMessage>
            {postFilter === "all"
              ? "게시물이 없습니다."
              : `${getStatusText(postFilter)} 게시물이 없습니다.`}
          </EmptyMessage>
        ) : (
          filteredPosts.map((post) => (
            <ItemContainer key={post.id}>
              <ItemInfo>
                <ItemTitle>{post.serviceName || "제목 없음"}</ItemTitle>
                <ItemMeta>
                  <span>작성자: {post.companyName || post.userEmail}</span>
                  <span>등록일: {formatDate(post.createdAt)}</span>
                  <span>카테고리: {post.categories?.join(", ") || "없음"}</span>
                </ItemMeta>
              </ItemInfo>

              <StatusBadge status={post.status}>
                {getStatusText(post.status)}
              </StatusBadge>

              <ActionButtons>
                <ActionButton
                  className="approve"
                  onClick={() => openModal("post", post)}
                  style={{ background: "#6366f1", color: "white" }}
                >
                  자세히 보기
                </ActionButton>
                {post.status === "pending" && (
                  <>
                    <ActionButton
                      className="approve"
                      onClick={() => updatePostStatus(post.id, "approved")}
                    >
                      승인
                    </ActionButton>
                    <ActionButton
                      className="reject"
                      onClick={() => updatePostStatus(post.id, "rejected")}
                    >
                      거절
                    </ActionButton>
                  </>
                )}
                {post.status === "approved" && (
                  <ActionButton
                    className="reject"
                    onClick={() => updatePostStatus(post.id, "rejected")}
                  >
                    거절
                  </ActionButton>
                )}
                {post.status === "rejected" && (
                  <ActionButton
                    className="approve"
                    onClick={() => updatePostStatus(post.id, "approved")}
                  >
                    승인
                  </ActionButton>
                )}
                <ActionButton
                  className="delete"
                  onClick={() => deletePost(post.id, post.userId)}
                >
                  삭제
                </ActionButton>
              </ActionButtons>
            </ItemContainer>
          ))
        )}
      </ContentList>

      <AdminPagination
        currentPage={postCurrentPage}
        totalCount={postTotalCount}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePostPageChange}
      />
    </ContentSection>
  );
};

export default AdminPostsList;
