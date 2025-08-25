import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { isAdmin, isUserLoggedIn, logOut } from "../../firebase/auth";

const HeaderContainer = styled.header`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[300]};
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Nav = styled.nav`
  width: 100%;
  max-width: ${(props) => props.theme.container.desktop};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing.md};

`;

const Logo = styled(Link)`
  font-size: ${(props) => props.theme.fontSize["2xl"]};
  font-weight: bold;
  text-decoration: none;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
 
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
  
  ${(props) => props.theme.media.mobile} {
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const LoginButton = styled(Link)`
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: ${(props) => props.theme.fontSize.sm};
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(115, 102, 255, 0.3);
  }
  
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
    font-size: ${(props) => props.theme.fontSize.xs};
  }
`;

const AddServiceButton = styled(Link)`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize.sm};
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  }

  &::before {
    content: "+";
    font-size: 1.2rem;
    font-weight: bold;
  }

  ${(props) => props.theme.media.tablet} {
    display: none;
  }
`;

const MobileAddServiceButton = styled(Link)`
  display: none;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  text-decoration: none;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  font-size: ${(props) => props.theme.fontSize.sm};

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
    background: ${(props) => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &::before {
    content: "+ ";
    font-weight: bold;
  }
  
  ${(props) => props.theme.media.tablet} {
    display: block;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.xs};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  background: none;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
  
  ${(props) => props.theme.media.mobile} {
    // padding: ${(props) => props.theme.spacing.xs};
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
  
  ${(props) => props.theme.media.mobile} {
    width: 18px;
    height: 18px;
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
  font-size: ${(props) => props.theme.fontSize.xs};
  color: white;
  
  ${(props) => props.theme.media.mobile} {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${(props) => props.theme.spacing.xs};
  background: white;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.shadows.md};
  min-width: 200px;
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  
  ${(props) => props.theme.media.mobile} {
    min-width: 180px;
    right: -10px;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  text-decoration: none;
  color: ${(props) => props.theme.colors.dark};
  transition: background-color 0.2s ease;
  font-size: ${(props) => props.theme.fontSize.sm};

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
  }

  &:first-child {
    border-radius: ${(props) => props.theme.borderRadius.md}
      ${(props) => props.theme.borderRadius.md} 0 0;
  }
  
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.theme.spacing.sm};
    font-size: ${(props) => props.theme.fontSize.xs};
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  text-align: left;
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.dark};
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: ${(props) => props.theme.fontSize.sm};
  
  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
  }
  
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.theme.spacing.sm};
    font-size: ${(props) => props.theme.fontSize.xs};
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
