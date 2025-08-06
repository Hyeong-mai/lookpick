import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { isAdmin, isUserLoggedIn, logOut } from "../../firebase/auth";

const HeaderContainer = styled.header`
  padding: 20px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[300]};
`;

const Nav = styled.nav`
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 90%;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 95%;
  }
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.theme.colors.primary};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const LoginButton = styled(Link)`
  padding: 8px 16px;
  background-color: transparent;
  color: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
  }
`;

const AddServiceButton = styled(Link)`
  padding: 4px 16px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
    border-color: ${(props) => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &::before {
    content: "+";
    font-size: 1.2rem;
    font-weight: bold;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileAddServiceButton = styled(Link)`
  display: none;
  padding: 12px 16px;
  text-decoration: none;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
  }

  &::before {
    content: "+ ";
    font-weight: bold;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const HamburgerIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  span {
    width: 100%;
    height: 2px;
    background-color: ${(props) => props.theme.colors.dark};
    border-radius: 1px;
  }
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  min-width: 200px;
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: ${(props) => props.theme.colors.dark};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
  }

  &:first-child {
    border-radius: ${(props) => props.theme.borderRadius.md}
      ${(props) => props.theme.borderRadius.md} 0 0;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.dark};
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
  }
`;

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");

    if (confirmed) {
      try {
        await logOut();
        setIsDropdownOpen(false); // 드롭다운 메뉴 닫기
        alert("로그아웃되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("로그아웃 실패:", error);
        alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">LookPick</Logo>

        {isUserLoggedIn() ? (
          <NavLinks>
            {!location.pathname.startsWith("/service-edit") && (
              <AddServiceButton to="/service-register">
                서비스 등록하기
              </AddServiceButton>
            )}
            <UserMenu>
              <UserButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <HamburgerIcon>
                  <span />
                  <span />
                  <span />
                </HamburgerIcon>
                <UserAvatar>홍</UserAvatar>
              </UserButton>
              <DropdownMenu isOpen={isDropdownOpen}>
                {!location.pathname.startsWith("/service-edit") && (
                  <MobileAddServiceButton
                    to="/service-register"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    서비스 등록하기
                  </MobileAddServiceButton>
                )}
                <DropdownItem
                  to="/mypage"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  마이 페이지
                </DropdownItem>
                {isAdmin() && (
                  <DropdownItem
                    to="/admin"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    관리자 페이지
                  </DropdownItem>
                )}
                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
              </DropdownMenu>
            </UserMenu>
          </NavLinks>
        ) : (
          <NavLinks>
            <AuthButtons>
              <LoginButton to="/login">로그인 / 회원가입</LoginButton>
            </AuthButtons>
          </NavLinks>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
