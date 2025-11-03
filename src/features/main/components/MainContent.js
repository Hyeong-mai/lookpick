import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/contexts/AuthContext";
import { useState, useEffect } from "react";

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
  align-items: flex-start;
  justify-content: center;
  gap: 40px;
  text-align: left;
  padding: 60px 40px;
  margin: 0 auto;
  width: 100%;
   min-height: calc(100vh - 80px);
  position: relative;
  background: linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)),
              url('/image/lookpick_backgroundImage1.jpeg') center/cover no-repeat;
  
  /* 배경 이미지 화질 개선 */
  background-attachment: fixed;
  image-rendering: -webkit-optimize-contrast;
  background-filter: contrast(1.05) brightness(1.02);
  
  /* 고품질 이미지 렌더링 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  
  @media (max-width: 1024px) {
    padding: 50px 30px;
    min-height: calc(100vh - 100px);
    gap: 35px;
    align-items: flex-start;
    text-align: left;
  }
  
  @media (max-width: 768px) {
    gap: 30px;
    padding: 40px 20px;
    min-height: calc(100vh - 80px);
    align-items: flex-start;
    text-align: left;
  }
`;

const GlassmorphismContainer = styled.div`
  /* 글래스모피즘 효과 */
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border: 1px solid rgba(255, 255, 255, 0.01);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.01);
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  
  /* 데스크톱 - 큰 화면 */
  @media (min-width: 1440px) {
    padding: 48px 56px;
    gap: 28px;
    max-width: 900px;
    border-radius: 24px;
  }
  
  /* 태블릿 - 가로 */
  @media (max-width: 1024px) {
    padding: 32px 36px;
    gap: 20px;
    max-width: 700px;
    border-radius: 18px;
  }
  
  /* 태블릿 - 세로 */
  @media (max-width: 768px) {
    padding: 24px 28px;
    gap: 18px;
    max-width: calc(100% - 40px);
    border-radius: 16px;
    margin: 0 20px;
  }
  
  /* 모바일 */
  @media (max-width: 480px) {
    padding: 20px;
    gap: 16px;
    border-radius: 12px;
    margin: 0 16px;
    max-width: calc(100% - 32px);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const LogoImage = styled.img`
  max-width: 100%;
  height: auto;
  width: 350px;
  animation: ${fadeInUp} 0.8s ease-out;
  object-fit: contain;
  
  @media (max-width: 1024px) {
    width: 300px;
  }
  
  @media (max-width: 768px) {
    width: 250px;
  }
  
  @media (max-width: 480px) {
    width: 200px;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color:black;
  margin: 0;
  line-height: 1.4;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  font-weight: 500;
  max-width: 700px;
  text-align: left;

  
  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.3;
    text-align: left;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.2;
  }
`;

const Description = styled.div`
  font-size: 1.1rem;
  color: ${(props) => props.theme.colors.gray[900]};
  margin: 0;
  line-height: 1.7;
  max-width: 650px;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
  text-align: left;
  
  .mobile-text {
    display: none;
  }
  
  @media (max-width: 1024px) {
    font-size: 1rem;
    max-width: 600px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.5;
    text-align: left;
    max-width: 100%;
    
    .desktop-text {
      display: none;
    }
    
    .mobile-text {
      display: block;
      text-align: left;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.4;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
  align-self: flex-start;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-self: center;
  }
`;

const Button = styled.button`
  padding: 18px 40px;
  font-size: 1.1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    padding: 16px 32px;
    font-size: 1rem;
    width: 100%;
  }
`;

const OutlineButton = styled(Button)`
  background: transparent;
  border: 2px solid rgba(0, 0, 0, 0.7);
  color: black;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 0, 0, 0.9);
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
    display: none;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    max-width: 90%;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[600]};
  transition: color 0.2s ease;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${(props) => props.theme.colors.black};
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 24px 0;
  padding-right: 40px;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BenefitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const BenefitIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${(props) => props.theme.colors.black};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
`;

const BenefitText = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 8px 0;
`;

const BenefitDescription = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${(props) => props.theme.colors.black};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(props) => props.theme.colors.gray[800]};
    transform: translateY(-2px);
  }
`;

const MainContent = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [textColor, setTextColor] = useState('#ffffff'); // 기본값: 흰색
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.5)'); // 기본값: 검은색 그림자
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 배경 이미지의 평균 밝기를 계산하는 함수
  const calculateBackgroundBrightness = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let totalBrightness = 0;
      let pixelCount = 0;
      
      // 샘플링하여 성능 최적화 (모든 픽셀 대신 일부만)
      for (let i = 0; i < data.length; i += 16) { // 4픽셀씩 건너뛰기
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // YUV 공식으로 밝기 계산
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
        totalBrightness += brightness;
        pixelCount++;
      }
      
      const averageBrightness = totalBrightness / pixelCount;
      
      // 밝기가 128보다 크면 어두운 텍스트, 작으면 밝은 텍스트
      if (averageBrightness > 128) {
        setTextColor('#000000'); // 검은색 텍스트
        setShadowColor('rgba(255, 255, 255, 0.5)'); // 흰색 그림자
      } else {
        setTextColor('#ffffff'); // 흰색 텍스트
        setShadowColor('rgba(0, 0, 0, 0.5)'); // 검은색 그림자
      }
    };
    
    img.src = '/image/lookpick_backgroundImage1.jpeg';
  };

  useEffect(() => {
    calculateBackgroundBrightness();
  }, []);

  const handleStartClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRegister = () => {
    setIsModalOpen(false);
    if (isLoggedIn) {
      navigate('/service-register');
    } else {
      navigate('/login');
    }
  };

  const handlePreview = () => {
    navigate('/services');
  };

  return (
    <>
      <MainContentWrapper>
        <GlassmorphismContainer>
          <LogoImage src="/logo/main_logo.png" alt="LookPick" />
          <Subtitle textColor={textColor} shadowColor={shadowColor}>귀사의 비즈니스를 가장 빠르게 알릴 수 있는 {<br />}B2B 검색·연결 플랫폼</Subtitle>
          <Description>
            <span className="desktop-text">
              "귀사의 고객은 지금도 새로운 파트너를 찾고 있습니다.
              우리 플랫폼은 기업이 제공하는 서비스와 제품을 한눈에 확인할 수 있는 B2B 검색
              허브입니다.
              {<br />}
              초기에는 사전 등록 기업 중심으로 운영되며,
              지금 등록하시면 상위 노출·시장 선점 효과를 통해 경쟁사보다 앞서 고객을 확보할 수
              있습니다.
              "
            </span>
            <span className="mobile-text">
              "기업 서비스를 한눈에 찾는 B2B 검색 허브
              {<br />}
              지금 등록하고 상위 노출 혜택을 받으세요"
            </span>
          </Description>
          <ButtonGroup>
            <OutlineButton onClick={handlePreview}>정식 서비스 미리보기</OutlineButton>
            <Button onClick={handleStartClick}>사전등록 혜택보기</Button>
          </ButtonGroup>
        </GlassmorphismContainer>
        
        <ScrollDownContainer>
          <ScrollDownIcon />
        </ScrollDownContainer>
      </MainContentWrapper>

      {isModalOpen && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={handleModalClose}>×</ModalCloseButton>
            <ModalTitle>사전 등록 혜택</ModalTitle>
            <BenefitList>
              <BenefitItem>
                <BenefitIcon>1</BenefitIcon>
                <BenefitText>
                  <BenefitTitle> 수수료 없는 플랫폼</BenefitTitle>
                  <BenefitDescription>
                  고객의 매출에 숟가락을 얹지 않습니다. 귀사의 매출을 100% 가져가세요.
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>2</BenefitIcon>
                <BenefitText>
                  <BenefitTitle>무료 홍보 기회</BenefitTitle>
                  <BenefitDescription>
                  초기 사전 등록 기업에게 무료 서비스 및 마케팅 지원을 제공합니다.
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>3</BenefitIcon>
                <BenefitText>
                  <BenefitTitle>상위 노출 기회</BenefitTitle>
                  <BenefitDescription>
                  플랫폼 초기 단계에서 등록하여 검색 결과 상단에 우선 노출됩니다.
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>4</BenefitIcon>
                <BenefitText>
                  <BenefitTitle>시장 선점 효과</BenefitTitle>
                  <BenefitDescription>
                  경쟁사보다 먼저 고객을 확보하고 업계에서 선도적 위치를 선점할 수 있습니다.
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitIcon>5</BenefitIcon>
                <BenefitText>
                  <BenefitTitle>맞춤형 고객 매칭</BenefitTitle>
                  <BenefitDescription>
                  귀사의 서비스를 필요로 하는 기업과 자동으로 연결해드립니다.
                  </BenefitDescription>
                </BenefitText>
              </BenefitItem>
            </BenefitList>
            <ModalButton onClick={handleRegister}>
              지금 바로 등록하기
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default MainContent;
