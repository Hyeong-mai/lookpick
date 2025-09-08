import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { isAdmin, isUserLoggedIn, logOut } from "../../firebase/auth";

const HeaderContainer = styled.header`
  padding: ${props => props.isScrolled ? '8px' : '20px'};
  display: flex;
  justify-content: center;
  align-items: center;

  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: ${props => props.isScrolled 
    ? '0 2px 1px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)' 
    : '0 2px 4px rgba(0, 0, 0, 0.08)'};
`;

const Nav = styled.nav`
  width: 100%;
  // max-width: ${(props) => props.theme.container.desktop};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing.md};

`;

const Logo = styled(Link)`
  font-size: ${props => props.isScrolled ? props.theme.fontSize.lg : props.theme.fontSize["3xl"]};
  font-weight: bold;
  text-decoration: none;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  align-items: center;
  
  ${(props) => props.theme.media.mobile} {
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const MainNavLinks = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.lg};
  align-items: center;
  
  ${(props) => props.theme.media.tablet} {
    display: none;
  }
`;

const NavMenuItem = styled(Link)`
  color: ${(props) => props.theme.colors.gray[700]};
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: 700;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.black};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
`;

const RightSideMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
`;

const IconButton = styled.button`
  width: 30px;
  height: 30px;


  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.black};
    background-color: ${(props) => props.theme.colors.gray[50]};
  }
`;

const SearchIcon = styled.div`
  width: 15px;
  height: 15px;
  border: 2px solid ${(props) => props.theme.colors.black};
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    right: -3px;
    width: 8px;
    height: 2px;
    background-color: ${(props) => props.theme.colors.gray[600]};
    transform: rotate(45deg);
  }
`;

const MenuIcon = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  span {
    width: 100%;
    height: 2px;
    background-color: ${(props) => props.theme.colors.black};
    border-radius: 1px;
  }
`;

const SubHeaderContainer = styled.div`
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  padding: 12px 0;
`;

const SubHeaderNav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing.md};

  margin: 0 auto;
`;

const SubHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.lg};
`;

const SubHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const SubHeaderMenuItem = styled.div`
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.black};
  }
`;

const SubHeaderLoginButton = styled(Link)`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.colors.black};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[800]};
    transform: translateY(-1px);
  }
`;

const SubHeaderSignupButton = styled(Link)`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
  background: transparent;
  color: ${(props) => props.theme.colors.black};
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.black};
    color: white;
    transform: translateY(-1px);
  }
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
  background-color: ${(props) => props.theme.colors.black};
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
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50); // 50px 이상 스크롤되면 헤더 크기 변경
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      <HeaderContainer isScrolled={isScrolled}>
        <Nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Logo to="/" isScrolled={isScrolled}>LookPick</Logo>
            
            <MainNavLinks>
              <NavMenuItem to="#" onClick={(e) => e.preventDefault()}>
                서비스 찾기
              </NavMenuItem>
              <NavMenuItem to="#" onClick={(e) => e.preventDefault()}>
                카테고리
              </NavMenuItem>
              <NavMenuItem to="#" onClick={(e) => e.preventDefault()}>
                인기 서비스
              </NavMenuItem>
              <NavMenuItem to="#" onClick={(e) => e.preventDefault()}>
                고객지원
              </NavMenuItem>
            </MainNavLinks>
          </div>
          <NavLinks>
              <RightSideMenu>
                <IconButton onClick={(e) => e.preventDefault()}>
                  <SearchIcon />
                </IconButton>
                <IconButton onClick={(e) => e.preventDefault()}>
                  <MenuIcon>
                    <span />
                    <span />
                    <span />
                  </MenuIcon>
                </IconButton>
              </RightSideMenu>
              
            </NavLinks>
        </Nav>
      </HeaderContainer>

      {/* 서브 헤더 */}
      <SubHeaderContainer>
        <SubHeaderNav>
          <SubHeaderLeft>
            <SubHeaderMenuItem onClick={(e) => e.preventDefault()}>
              전체 서비스
            </SubHeaderMenuItem>
            <SubHeaderMenuItem onClick={(e) => e.preventDefault()}>
              신규 서비스
            </SubHeaderMenuItem>
            <SubHeaderMenuItem onClick={(e) => e.preventDefault()}>
              추천 서비스
            </SubHeaderMenuItem>
            <SubHeaderMenuItem onClick={(e) => e.preventDefault()}>
              할인 서비스
            </SubHeaderMenuItem>
          </SubHeaderLeft>
          
          <SubHeaderRight>
            {!isUserLoggedIn() && location.pathname !== '/' && (
              <>
                <SubHeaderLoginButton to="/login">
                  로그인
                </SubHeaderLoginButton>
                <SubHeaderSignupButton to="/signup">
                  회원가입
                </SubHeaderSignupButton>
              </>
            )}
          </SubHeaderRight>
        </SubHeaderNav>
      </SubHeaderContainer>
    </>
  );
};

export default Header;
