import React from "react";
import styled from "styled-components";

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.sm};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.color || props.theme.colors.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.gray[600]};
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
          <StatNumber color="#10B981">{stats.active}</StatNumber>
          <StatLabel>활성 회원</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#EF4444">{stats.suspended}</StatNumber>
          <StatLabel>정지 회원</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber color="#F59E0B">{stats.pending}</StatNumber>
          <StatLabel>승인 대기</StatLabel>
        </StatCard>
      </StatsSection>
    );
  }

  return null;
};

export default AdminStatsCards;
