import React from "react";
import styled from "styled-components";

const Sidebar = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 20px;
  height: fit-content;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    padding: 12px 0;
    border-radius: 8px;
    overflow-x: auto;

    /* 가로 스크롤바 스타일링 */
    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f3f4;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.gradients.primary}60;
      border-radius: 3px;

      &:hover {
        background: ${(props) => props.theme.gradients.primary}80;
      }
    }
  }
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: flex;
    gap: 8px;
    padding: 0 12px;
    min-width: max-content;
  }
`;

const MenuItem = styled.li`
  margin-bottom: 10px;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin-bottom: 0;
    flex-shrink: 0;
  }
`;

const MenuButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background: ${(props) =>
    props.active ? props.theme.gradients.primary : "transparent"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.dark)};
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    background: ${(props) =>
      props.active ? props.theme.gradients.primary : props.theme.colors.gray[100]};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    white-space: nowrap;
    padding: 10px 16px;
    text-align: center;
    min-width: 120px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.85rem;
    min-width: 100px;
  }
`;

const MyPageSidebar = ({ activeTab, setActiveTab, menuItems }) => {
  return (
    <Sidebar>
      <SidebarMenu>
        {menuItems.map((item) => (
          <MenuItem key={item.id}>
            <MenuButton
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </MenuButton>
          </MenuItem>
        ))}
      </SidebarMenu>
    </Sidebar>
  );
};

export default MyPageSidebar;
