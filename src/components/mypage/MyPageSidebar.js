import React from "react";
import styled from "styled-components";

const Sidebar = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  padding: 20px;
  height: fit-content;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 10px;
`;

const MenuButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) =>
    props.active ? props.theme.colors.primary : "transparent"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.dark)};
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.gray[100]};
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
