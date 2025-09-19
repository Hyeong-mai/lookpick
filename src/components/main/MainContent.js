import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  text-align: center;
  padding: 60px 20px;
  margin: 0 auto;
  width: 100%;
  min-height: calc(100vh - 120px);
  position: relative;
  
  @media (max-width: 1024px) {
    padding: 50px 20px;
    min-height: calc(100vh - 100px);
    gap: 35px;
  }
  
  @media (max-width: 768px) {
    gap: 30px;
    padding: 40px 16px;
    min-height: calc(100vh - 80px);
  }
`;

const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
  line-height: 1.1;
  animation: ${fadeInUp} 0.8s ease-out;
  letter-spacing: -0.02em;
  
  @media (max-width: 1024px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.4;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  font-weight: 500;
  max-width: 700px;
  
  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Description = styled.div`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.gray[500]};
  margin: 0;
  line-height: 1.7;
  max-width: 650px;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
  text-align: left;
  background: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 8px;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  @media (max-width: 1024px) {
    font-size: 1rem;
    padding: 25px;
    max-width: 600px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 20px;
    text-align: center;
    border-left: none;
    border-top: 4px solid ${(props) => props.theme.colors.gray[300]};
  }
`;

const Button = styled.button`
  padding: 18px 40px;
  font-size: 1.1rem;
  background: ${(props) => props.theme.colors.black};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: ${(props) => props.theme.colors.gray[800]};
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
  }
`;

const ScrollDownContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${fadeInUp} 0.8s ease-out 1s both;
  
  @media (max-width: 768px) {
    bottom: 20px;
  }
`;


const ScrollDownIcon = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${(props) => props.theme.colors.gray[400]};
  border-radius: 50%;
  position: relative;
  animation: ${bounce} 2s infinite;
  
  &::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-color: ${(props) => props.theme.colors.gray[400]};
    border-radius: 50%;
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    
    &::after {
      top: 4px;
      width: 4px;
      height: 4px;
    }
  }
`;

const MainContent = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleStartClick = () => {
    if (isLoggedIn) {
      navigate('/service-register');
    } else {
      navigate('/login');
    }
  };

  return (
    <MainContentWrapper>
      <Title>LookPick</Title>
      <Subtitle>귀사의 비즈니스를 가장 빠르게 알릴 수 있는 B2B 검색·연결 플랫폼</Subtitle>
      <Description>
      "귀사의 고객은 지금도 새로운 파트너를 찾고 있습니다.
우리 플랫폼은 기업이 제공하는 서비스와 제품을 한눈에 확인할 수 있는 B2B 검색
허브입니다.
{<br />}
초기에는 사전 등록 기업 중심으로 운영되며,
지금 등록하시면 상위 노출·시장 선점 효과를 통해 경쟁사보다 앞서 고객을 확보할 수
있습니다.
"
      </Description>
      <Button onClick={handleStartClick}>시작하기</Button>
      
      <ScrollDownContainer>
        <ScrollDownIcon />
      </ScrollDownContainer>
    </MainContentWrapper>
  );
};

export default MainContent;
