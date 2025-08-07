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
`;

const ContentTitle = styled.h2`
  font-size: 1.3rem;
  color: ${(props) => props.theme.colors.dark};
`;

const ContentCount = styled.span`
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 0.9rem;
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
`;

const ItemInfo = styled.div``;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 8px;
`;

const ItemMeta = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.gray[600]};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  background: #d1fae5;
  color: #065f46;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

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
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const AdminUsersList = ({
  filteredUsers,
  itemsPerPage,
  formatDate,
  openModal,
  deleteUser,
  userCurrentPage,
  userTotalCount,
  handleUserPageChange,
}) => {
  return (
    <ContentSection>
      <ContentHeader>
        <ContentTitle>회원 목록</ContentTitle>
        <ContentCount>
          {filteredUsers.length}개 (페이지당 {itemsPerPage}개)
        </ContentCount>
      </ContentHeader>

      <ContentList>
        {filteredUsers.length === 0 ? (
          <EmptyMessage>회원이 없습니다.</EmptyMessage>
        ) : (
          filteredUsers.map((user) => (
            <ItemContainer key={user.id}>
              <ItemInfo>
                <ItemTitle>{user.name || "이름 없음"}</ItemTitle>
                <ItemMeta>
                  <span>이메일: {user.email}</span>
                  <span>회사: {user.companyName || "없음"}</span>
                  <span>전화번호: {user.phone || "없음"}</span>
                  <span>가입일: {formatDate(user.createdAt)}</span>
                </ItemMeta>
              </ItemInfo>

              <StatusBadge>활성</StatusBadge>

              <ActionButtons>
                <ActionButton
                  className="approve"
                  onClick={() => openModal("user", user)}
                  style={{ background: "#6366f1", color: "white" }}
                >
                  자세히 보기
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => deleteUser(user.id)}
                >
                  삭제
                </ActionButton>
              </ActionButtons>
            </ItemContainer>
          ))
        )}
      </ContentList>

      <AdminPagination
        currentPage={userCurrentPage}
        totalCount={userTotalCount}
        itemsPerPage={itemsPerPage}
        handlePageChange={handleUserPageChange}
      />
    </ContentSection>
  );
};

export default AdminUsersList;
