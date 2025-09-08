import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { isUserLoggedIn } from "../../firebase/auth";

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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50); // 50px 이상 스크롤되면 헤더 크기 변경
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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