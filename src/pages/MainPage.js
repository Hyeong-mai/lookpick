
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signIn, saveAuthDataToStorage, logOut, isAdmin, getCurrentUser } from "../firebase/auth";
// import { isAdmin, isUserLoggedIn, logOut } from "../../firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import MainContent from "../components/main/MainContent";
import Section1 from "../components/main/Section1";
import Section2 from "../components/main/Section2";
import Section3 from "../components/main/Section3";
import ServiceCategorySection from "../components/main/ServiceCategorySection";

const MainContainer = styled.div`
  min-height: 100vh;
`;

const MainSection = styled.div`
// background-color: #000000;
height: 100vh;

`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 8fr 1px 2fr;
  // gap: 40px;
  margin: 0 auto;
  // padding: 0px 30px;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
    // padding: 0px 20px;
  }
  
  @media (max-width: 768px) {
    padding: 0px 16px;
  }
`;

const Divider = styled.div`
  background-color: ${(props) => props.theme.colors.gray[400]};
  height: 100%;
  width: 1px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const LeftContent = styled.div`
  min-height: 100vh;
`;

const StickySidebar = styled.div`
  position: sticky;
  top: 50px;
  height: fit-content;
  background: ${(props) => props.theme.colors.white};
  padding: 12px;
  margin: 0px 0;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const LoginForm = styled.form`
  margin-top: 0;
  padding-top: 0;
  
  @media (max-width: 768px) {
    margin-top: 0;
    padding-top: 0;
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
  flex-direction: column;
    gap: 12px;
    align-items: stretch;
    margin-bottom: 16px;
  }
`;

const FormTitle = styled.h4`
  font-size: ${(props) => props.theme.fontSize["2xl"]};
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
  
  @media (max-width: 768px) {
    text-align: center;
    font-size: ${(props) => props.theme.fontSize.xl};
  }
`;

const HeaderSignupButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  color: ${(props) => props.theme.colors.black};
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize.s};
  cursor: pointer;
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 12px;
    font-size: ${(props) => props.theme.fontSize.sm};
  }
`;

const ChevronIcon = styled.span`
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.colors.gray[500]};
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  color: ${(props) => props.theme.colors.gray[700]};
  margin-bottom: 6px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.black};
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.black};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.gray[400]};
  }
  
  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: ${(props) => props.theme.fontSize.base};
  }
`;

const FormButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${(props) => props.theme.colors.black};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[800]};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[400]};
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    font-size: ${(props) => props.theme.fontSize.base};
  }
`;

const SupportContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const SupportButton = styled.button`
  flex: 1;
  padding: 10px;
  background: transparent;
  color: ${(props) => props.theme.colors.gray[600]};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[50]};
    border-color: ${(props) => props.theme.colors.gray[300]};
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: ${(props) => props.theme.fontSize.base};
  }
`;

const InquiryButton = styled.button`
  flex: 1;
  padding: 10px;
  background: transparent;
  color: ${(props) => props.theme.colors.gray[600]};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  font-size: ${(props) => props.theme.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[50]};
    border-color: ${(props) => props.theme.colors.gray[300]};
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: ${(props) => props.theme.fontSize.base};
  }
`;

const UserInfo = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.black};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.xl};
  margin-bottom: 16px;
`;

const WelcomeText = styled.div`
  margin-bottom: 16px;
`;

const UserName = styled.h3`
  font-size: ${(props) => props.theme.fontSize.xl};
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 4px 0;
`;

const WelcomeMessage = styled.span`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[600]};
  font-weight: 400;
`;

const UserEmail = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0 0 12px 0;
`;

const UserStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${(props) => props.theme.colors.gray[200]};
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.colors.gray[600]};
`;

const UserMenu = styled.div`
  margin-top: 16px;
`;

const UserMenuItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  color: ${(props) => props.theme.colors.black};
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: all 0.2s ease;
  margin-bottom: 4px;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
  }
`;

const UserMenuDivider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.colors.gray[200]};
  margin: 12px 0;
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  color: ${(props) => props.theme.colors.gray[600]};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[50]};
    border-color: ${(props) => props.theme.colors.gray[300]};
  }
`;

const ServiceRegisterButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 14px;
  background: ${(props) => props.theme.colors.black};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.sm};
  text-align: center;
  margin-top: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[800]};
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    font-size: ${(props) => props.theme.fontSize.base};
  }
`;

const CategorySection = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.white};
`;

const MainPage = () => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useAuth();
  const [userStats, setUserStats] = useState({
    totalPosts: 0,
    pendingPosts: 0,
    approvedPosts: 0
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Firebase 로그인 시도...");
      const user = await signIn(loginForm.email, loginForm.password);

      console.log("로그인 성공:", user);

      // 로컬 스토리지에 토큰과 사용자 정보 저장
      const authData = await saveAuthDataToStorage(user);
      console.log("저장된 인증 데이터:", authData);

      // 메인 페이지 새로고침하여 로그인 상태 반영
      window.location.reload();
    } catch (error) {
      console.error("로그인 실패:", error);

      // Firebase 에러 메시지 한국어 변환
      let errorMessage = "로그인 중 오류가 발생했습니다.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "등록되지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "비밀번호가 올바르지 않습니다.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "유효하지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "비활성화된 계정입니다.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleSupportClick = () => {
    alert('고객지원 페이지로 이동합니다.');
  };

  const handleInquiryClick = () => {
    alert('상담문의 페이지로 이동합니다.');
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");

    if (confirmed) {
      try {
        await logOut();
        // setIsDropdownOpen(false); // 드롭다운 메뉴 닫기
        alert("로그아웃되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("로그아웃 실패:", error);
        alert("로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 유저 이름의 첫 글자를 가져오는 함수
  const getUserInitial = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  // 유저 표시 이름을 가져오는 함수
  const getUserDisplayName = (email) => {
    if (!email) return '사용자';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // 사용자 통계 로드
  const loadUserStats = useCallback(async () => {
    if (!isLoggedIn || !currentUser) return;

    try {
      const user = getCurrentUser();
      if (!user) return;

      // 전체 게시물 수
      const allPostsQuery = query(
        collection(db, "services"),
        where("userId", "==", user.uid)
      );
      const allPostsSnapshot = await getDocs(allPostsQuery);
      const totalPosts = allPostsSnapshot.size;

      // 심사중 게시물 수
      const pendingPostsQuery = query(
        collection(db, "services"),
        where("userId", "==", user.uid),
        where("status", "==", "pending")
      );
      const pendingPostsSnapshot = await getDocs(pendingPostsQuery);
      const pendingPosts = pendingPostsSnapshot.size;

      // 심사 완료 게시물 수
      const approvedPostsQuery = query(
        collection(db, "services"),
        where("userId", "==", user.uid),
        where("status", "==", "approved")
      );
      const approvedPostsSnapshot = await getDocs(approvedPostsQuery);
      const approvedPosts = approvedPostsSnapshot.size;

      setUserStats({
        totalPosts,
        pendingPosts,
        approvedPosts
      });
    } catch (error) {
      console.error("사용자 통계 로드 실패:", error);
    }
  }, [isLoggedIn, currentUser]);

  // 로그인 상태 변경시 통계 로드
  useEffect(() => {
    if (isLoggedIn) {
      loadUserStats();
    } else {
      setUserStats({
        totalPosts: 0,
        pendingPosts: 0,
        approvedPosts: 0
      });
    }
  }, [isLoggedIn, currentUser, loadUserStats]);

  return (
    <MainContainer>

      <ContentWrapper>

        <LeftContent>
          <MainSection>
            <MainContent />
          </MainSection>

          <CategorySection>
            {/* 카테고리 섹션 내용 */}
          </CategorySection>

          <Section1 />
          <Section2 />
          <ServiceCategorySection />
          <Section3 />
        </LeftContent>

        <Divider />

        <StickySidebar>
          {isLoggedIn ? (
            <>
              <UserInfo>
                <UserAvatar>
                  {getUserInitial(currentUser?.email)}
                </UserAvatar>
                <WelcomeText>
                  <UserName>
                    {getUserDisplayName(currentUser?.email)}
                    <WelcomeMessage>님, 환영합니다!</WelcomeMessage>
                  </UserName>
                </WelcomeText>
                <UserEmail>
                  {currentUser?.email}
                </UserEmail>
                <UserStats>
                  <StatItem>
                    <StatNumber>{userStats.totalPosts}</StatNumber>
                    <StatLabel>등록 서비스</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{userStats.pendingPosts}</StatNumber>
                    <StatLabel>심사중</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatNumber>{userStats.approvedPosts}</StatNumber>
                    <StatLabel>심사 완료</StatLabel>
                  </StatItem>
                </UserStats>
              </UserInfo>

              <UserMenu>
                <UserMenuItem to="/mypage">
                  마이 페이지
                </UserMenuItem>
                {/* <UserMenuItem to="#" onClick={(e) => e.preventDefault()}>
                  서비스 찾기
                </UserMenuItem>
                <UserMenuItem to="#" onClick={(e) => e.preventDefault()}>
                  카테고리
                </UserMenuItem>
                <UserMenuItem to="#" onClick={(e) => e.preventDefault()}>
                  인기 서비스
                </UserMenuItem>
                <UserMenuItem to="#" onClick={(e) => e.preventDefault()}>
                  고객지원
                </UserMenuItem> */}
                {isAdmin() && (
                  <UserMenuItem to="/admin">
                    관리자 페이지
                  </UserMenuItem>
                )}

                <UserMenuDivider />

                <ServiceRegisterButton to="/service-register">
                  서비스 등록하기
                </ServiceRegisterButton>

                <LogoutButton onClick={handleLogout}>
                  로그아웃
                </LogoutButton>
              </UserMenu>
            </>
          ) : (
            <LoginForm onSubmit={handleLogin}>
              <FormHeader>
                <FormTitle>로그인</FormTitle>
                <HeaderSignupButton type="button" onClick={handleSignupClick}>
                  회원가입
                  <ChevronIcon>›</ChevronIcon>
                </HeaderSignupButton>
              </FormHeader>

              <FormGroup>
                <FormLabel htmlFor="email">이메일</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="password">비밀번호</FormLabel>
                <FormInput
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </FormGroup>

              <FormButton type="submit" disabled={isLoading || !loginForm.email || !loginForm.password}>
                {isLoading ? '로그인 중...' : '로그인'}
              </FormButton>

              <SupportContainer>
                <SupportButton type="button" onClick={handleSupportClick}>
                  고객지원
                </SupportButton>
                <InquiryButton type="button" onClick={handleInquiryClick}>
                  상담문의
                </InquiryButton>
              </SupportContainer>
            </LoginForm>
          )}
        </StickySidebar>
      </ContentWrapper>
    </MainContainer>
  );
};

export default MainPage;
