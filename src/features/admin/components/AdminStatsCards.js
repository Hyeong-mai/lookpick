import React from "react";
import styled from "styled-components";

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.color || props.theme.colors.primary};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 6px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 4px;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.gray[600]};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const AdminStatsCards = ({ type, stats }) => {
  if (type === "posts") {
    return (
      <StatsSection>
        <StatCard>
          <StatNumber color="#3B82F6">{stats.total}</StatNumber>
          <StatLabel>전체 게시물</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#F59E0B">{stats.pending}</StatNumber>
          <StatLabel>대기중</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#10B981">{stats.approved}</StatNumber>
          <StatLabel>승인됨</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#EF4444">{stats.rejected}</StatNumber>
          <StatLabel>거절됨</StatLabel>
        </StatCard>
      </StatsSection>
    );
  }

  if (type === "users") {
    return (
      <StatsSection>
        <StatCard>
          <StatNumber color="#3B82F6">{stats.total}</StatNumber>
          <StatLabel>전체 회원</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#10B981">{stats.verified || 0}</StatNumber>
          <StatLabel>인증 완료</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#F59E0B">{stats.pending || 0}</StatNumber>
          <StatLabel>승인 대기</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#6B7280">{stats.notSubmitted || 0}</StatNumber>
          <StatLabel>미제출</StatLabel>
        </StatCard>
      </StatsSection>
    );
  }

  return null;
};

export default AdminStatsCards;
