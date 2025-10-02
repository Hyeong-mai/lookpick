import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../contexts/AuthContext";
import { isAdmin, logOut } from "../../firebase/auth";

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
    ? '0 0px 1px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)' 
    : '0 2px 4px rgba(0, 0, 0, 0.08)'};
  
  @media (max-width: 768px) {
    padding: ${props => props.isScrolled ? '6px' : '12px'};
  }
`;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
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
  
  @media (max-width: 768px) {
    font-size: ${props => props.isScrolled ? props.theme.fontSize.base : props.theme.fontSize.xl};
  }
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
  width: 100%;
  display: block;
  
  @media (max-width: 768px) {
    padding: 8px 0;
    background-color: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
  }
  
  @media (min-width: 1025px) {
    display: ${props => props.isMainPage ? 'none' : 'block'};
  }
`;

const SubHeaderNav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${(props) => props.theme.spacing.md};
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SubHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const SubHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 12px;
  cursor: pointer;
  padding: 2px 0;
  margin-top: 2px;
  text-decoration: underline;
  
  &:hover {
    color: ${(props) => props.theme.colors.black};
  }
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const ServiceRegisterLink = styled(Link)`
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSize.xs};
  font-weight: 600;
  padding: 6px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(115, 102, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 14px;
    font-weight: 700;
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
  display: inline-block;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[800]};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
    background: #000;
    color: white;
    border: none;
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
  display: inline-block;

  &:hover {
    background-color: ${(props) => props.theme.colors.black};
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
    background: transparent;
    color: #000;
    border: 1px solid #000;
  }
`;

const MobileDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const MobileMenuContainer = styled.div`
  position: relative;
  display: ${props => props.isMainPage ? 'none' : 'block'};
  
  @media (max-width: 1024px) {
    display: ${props => props.isLoggedIn ? 'block' : 'none'};
  }
`;

const MobileDropdownItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  color: ${(props) => props.theme.colors.black};
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[100]};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const UserWelcomeText = styled.div`
  color: ${(props) => props.theme.colors.black};
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  position: absolute;
  right: 40px;
  top: 50%;
  background: white;
  border: 2px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: 25px;
  padding: 8px 16px;
  min-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  gap: 8px;
  z-index: 1001;
  animation: ${props => props.isVisible ? fadeIn : fadeOut} 0.3s ease-out forwards;
  transform: translateY(-50%);
  
  @media (max-width: 768px) {
    right: 35px;
    min-width: 200px;
    padding: 6px 12px;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  background: transparent;
  
  &::placeholder {
    color: ${(props) => props.theme.colors.gray[500]};
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const SearchCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${(props) => props.theme.colors.gray[500]};
  font-size: 16px;
  
  &:hover {
    color: ${(props) => props.theme.colors.black};
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAuth();

  // 유저 표시 이름을 가져오는 함수
  const getUserDisplayName = (email) => {
    if (!email) return '사용자';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId) => {
    // 메인페이지가 아닌 경우 메인페이지로 이동
    if (location.pathname !== '/') {
      navigate('/');
      // 페이지 이동 후 스크롤을 위해 약간의 지연
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // 이미 메인페이지인 경우 바로 스크롤
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50); // 50px 이상 스크롤되면 헤더 크기 변경
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 햄버거 메뉴 토글 핸들러
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logOut();
      // 로그아웃 후 메인 페이지로 이동
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 검색창 토글 핸들러
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // 검색창 닫기 핸들러
  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  // 메뉴 및 검색창 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
      if (isSearchOpen && !event.target.closest('.search-container')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isSearchOpen]);

  return (
    <>
      <HeaderContainer isScrolled={isScrolled}>
        <Nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Logo to="/" isScrolled={isScrolled}>LookPick</Logo>
            
            <MainNavLinks>
              <NavMenuItem to="#" onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}>
                서비스 특징
              </NavMenuItem>
              <NavMenuItem to="#" onClick={(e) => {
                e.preventDefault();
                scrollToSection('categories');
              }}>
                서비스 카테고리
              </NavMenuItem>
              <NavMenuItem to="#" onClick={(e) => {
                e.preventDefault();
                scrollToSection('pricing');
              }}>
                구독 플랜
              </NavMenuItem>
            </MainNavLinks>
          </div>
          <NavLinks>
            <RightSideMenu>
              {/* <MobileAuthButtons>
                {!isUserLoggedIn() && (
                  <>
                    <MobileLoginButton to="/login">
                      로그인
                    </MobileLoginButton>
                    <MobileSignupButton to="/signup">
                      회원가입
                    </MobileSignupButton>
                  </>
                )}
              </MobileAuthButtons> */}
              <SearchContainer className="search-container">
                <IconButton onClick={handleSearchToggle}>
                  <SearchIcon />
                </IconButton>
                <SearchInputWrapper isVisible={isSearchOpen}>
                  <SearchInput
                    type="text"
                    placeholder="서비스나 기업을 검색해보세요..."
                    autoFocus={isSearchOpen}
                  />
                  <SearchCloseButton onClick={handleSearchClose}>
                    ×
                  </SearchCloseButton>
                </SearchInputWrapper>
              </SearchContainer>
              <MobileMenuContainer className="mobile-menu-container" isMainPage={location.pathname === '/'} isLoggedIn={isLoggedIn}>
                <IconButton onClick={handleMobileMenuToggle}>
                  <MenuIcon>
                    <span />
                    <span />
                    <span />
                  </MenuIcon>
                </IconButton>
                
                <MobileDropdownMenu isOpen={isMobileMenuOpen}>
                  <MobileDropdownItem to="/mypage" onClick={() => setIsMobileMenuOpen(false)}>
                    마이 페이지
                  </MobileDropdownItem>
                  <MobileDropdownItem to="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                    서비스 찾기
                  </MobileDropdownItem>
                  <MobileDropdownItem to="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                    카테고리
                  </MobileDropdownItem>
                  <MobileDropdownItem to="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                    인기 서비스
                  </MobileDropdownItem>
                  <MobileDropdownItem to="#" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}>
                    고객지원
                  </MobileDropdownItem>
                  {isAdmin() && (
                    <MobileDropdownItem to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      관리자 페이지
                    </MobileDropdownItem>
                  )}
                </MobileDropdownMenu>
              </MobileMenuContainer>
            </RightSideMenu>
          </NavLinks>
        </Nav>
      </HeaderContainer>

      {/* 서브 헤더 */}
      <SubHeaderContainer isMainPage={location.pathname === '/'}>
        <SubHeaderNav>
          <SubHeaderLeft>
            {isLoggedIn && (
              <UserInfoContainer>
                <UserWelcomeText>
                  {getUserDisplayName(currentUser?.email)}님, 환영합니다!
                </UserWelcomeText>
                <LogoutButton onClick={handleLogout}>
                  로그아웃
                </LogoutButton>
              </UserInfoContainer>
            )}
          </SubHeaderLeft>
          
          <SubHeaderRight>
            {!isLoggedIn ? (
              <>
                <SubHeaderLoginButton to="/login">
                  로그인
                </SubHeaderLoginButton>
                <SubHeaderSignupButton to="/signup">
                  회원가입
                </SubHeaderSignupButton>
              </>
            ) : (
              <ServiceRegisterLink to="/service-register">
                서비스 등록
              </ServiceRegisterLink>
            )}
          </SubHeaderRight>
        </SubHeaderNav>
      </SubHeaderContainer>
    </>
  );
};

export default Header;