import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
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

const Title = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  color: black;
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
  color: ${(props) => props.textColor || props.theme.colors.white};
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
  color: ${(props) => props.theme.colors.gray[900]};
  margin: 0;
  // line-height: 1.7;
  max-width: 650px;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
  text-align: left;
  // background: rgba(255, 255, 255, 0.8);
  // padding: 30px;
  border-radius: 8px;

  // box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
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
  const [textColor, setTextColor] = useState('#ffffff'); // 기본값: 흰색
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.5)'); // 기본값: 검은색 그림자

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
    if (isLoggedIn) {
      navigate('/service-register');
    } else {
      navigate('/login');
    }
  };

  return (
    <MainContentWrapper>
      <Title textColor={textColor} shadowColor={shadowColor}>LookPick</Title>
      <Subtitle textColor={textColor} shadowColor={shadowColor}>귀사의 비즈니스를 가장 빠르게 알릴 수 있는 {<br />}B2B 검색·연결 플랫폼</Subtitle>
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
