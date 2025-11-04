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
  background: #d1fae5;
  color: #065f46;

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

const VerificationBadge = styled.span`
  padding: 4px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 8px;
  
  ${(props) => {
    if (props.status === 'verified') {
      return `
        background: #D1FAE5;
        color: #065F46;
      `;
    } else if (props.status === 'pending') {
      return `
        background: #FEF3C7;
        color: #92400E;
      `;
    } else if (props.status === 'rejected') {
      return `
        background: #FEE2E2;
        color: #991B1B;
      `;
    } else {
      return `
        background: #F3F4F6;
        color: #6B7280;
      `;
    }
  }}

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 4px;
    display: inline-block;
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
                <ItemTitle>
                  {user.name || "이름 없음"}
                  <VerificationBadge status={
                    user.verificationStatus || 
                    ((user.businessRegistration || user.businessCertificateUrl) ? 'pending' : 'not_submitted')
                  }>
                    {user.verificationStatus === 'verified' && '인증 완료'}
                    {user.verificationStatus === 'pending' && '승인 대기'}
                    {user.verificationStatus === 'rejected' && '반려됨'}
                    {/* 파일이 있지만 status 없으면 승인 대기 */}
                    {!user.verificationStatus && (user.businessRegistration || user.businessCertificateUrl) && '승인 대기'}
                    {/* 진짜 미제출: status가 not_submitted이거나 (status 없고 파일도 없음) */}
                    {(user.verificationStatus === 'not_submitted' || (!user.verificationStatus && !user.businessRegistration && !user.businessCertificateUrl)) && '미제출'}
                  </VerificationBadge>
                </ItemTitle>
                <ItemMeta>
                  <span>이메일: {user.email}</span>
                  <span>회사: {user.companyName || "없음"}</span>
                  <span>전화번호: {user.phone || "없음"}</span>
                  <span>가입일: {formatDate(user.createdAt)}</span>
                  {(user.businessRegistration || user.businessCertificateUrl) && (
                    <span style={{ color: '#059669', fontWeight: '600' }}>
                      사업자등록증 제출됨
                    </span>
                  )}
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
