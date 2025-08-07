import React from "react";
import styled from "styled-components";

const TabSection = styled.div`
  margin-bottom: 30px;
  display: flex;
  gap: 8px;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray[200]};
`;

const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${(props) =>
    props.active ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.gray[600])};
  border-radius: ${(props) => props.theme.borderRadius.sm}
    ${(props) => props.theme.borderRadius.sm} 0 0;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.gray[100]};
  }
`;

const AdminTabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <TabSection>
      <TabButton
        active={activeTab === "posts"}
        onClick={() => setActiveTab("posts")}
      >
        게시물 관리
      </TabButton>
      <TabButton
        active={activeTab === "users"}
        onClick={() => setActiveTab("users")}
      >
        회원 관리
      </TabButton>
    </TabSection>
  );
};

export default AdminTabNavigation;
