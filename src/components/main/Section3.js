import styled, { keyframes } from "styled-components";
import { useState } from "react";

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
`;

const Section3Container = styled.div`
  width: 100%;
  padding: 80px 100px;
  background-color: ${(props) => props.theme.colors.white};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 1024px) {
    padding: 60px 40px;
  }
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const InfoContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    gap: 6px;
  }
`;

const InfoText = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.gray[600]};
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const InfoIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: white;
  font-weight: bold;
  animation: ${bounce} 2s infinite;
  
  &:hover {
    background: ${(props) => props.theme.colors.gray[600]};
    transform: scale(1.1);
    animation-play-state: paused;
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }
`;

const InfoTooltip = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 20px;
  max-width: 350px;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(-10px)'};
  text-align: left;
  
  @media (max-width: 768px) {
    top: 50px;
    right: -50px;
    max-width: 300px;
    padding: 15px;
  }
`;

const TooltipTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 15px 0;
  text-align: center;
`;

const TooltipList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TooltipItem = styled.li`
  margin-bottom: 12px;
  line-height: 1.4;
`;

const TooltipItemTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  display: block;
  margin-bottom: 4px;
  
  &:before {
    content: '●';
    color: ${(props) => props.theme.colors.gray[400]};
    margin-right: 8px;
  }
`;

const TooltipItemContent = styled.span`
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.gray[600]};
  display: block;
  padding-left: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0 0 50px 0;
  font-weight: 400;
  line-height: 1.4;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SubscriptionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const SubscriptionCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 25px 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  gap: 30px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.isPopular ? 'rgba(115, 102, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  ${props => props.isPopular && `
    border-color: ${props.theme.gradients.primary};
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  `}
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 30px;
    gap: 20px;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  transform: rotate(15deg);
`;

const CardLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 200px;
`;

const CardCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 150px;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 800;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const PlanPeriod = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #555;
  
  &:before {
    content: '✓';
    color: #4CAF50;
    font-weight: bold;
    font-size: 1rem;
  }
`;

const SubscribeButton = styled.button`
  padding: 12px 25px;
  font-size: 1rem;
  background: ${(props) => props.isPopular ? props.theme.gradients.primary : 'transparent'};
  color: ${(props) => props.isPopular ? 'white' : '#333'};
  border: 2px solid ${(props) => props.isPopular ? 'transparent' : '#333'};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    background: ${(props) => props.isPopular ? props.theme.gradients.primary : '#333'};
    color: white;
  }
`;

const Section3 = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <Section3Container>
      
      <InfoContainer>
        <InfoText>등록 기업의 혜택</InfoText>
        <InfoIcon 
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >
          i
        </InfoIcon>
      </InfoContainer>
      
      <InfoTooltip isVisible={isTooltipVisible}>
        <TooltipTitle>등록 기업의 혜택</TooltipTitle>
        <TooltipList>
          <TooltipItem>
            <TooltipItemTitle>시장 선점 기회</TooltipItemTitle>
            <TooltipItemContent>초기 사전등록 기업은 카테고리 무료 상위 노출 혜택 제공</TooltipItemContent>
          </TooltipItem>
          <TooltipItem>
            <TooltipItemTitle>매출 확대</TooltipItemTitle>
            <TooltipItemContent>새로운 거래처 발굴 및 신규 고객 유입</TooltipItemContent>
          </TooltipItem>
          <TooltipItem>
            <TooltipItemTitle>검색 최적화 지원</TooltipItemTitle>
            <TooltipItemContent>플랫폼 내 검색뿐만 아니라 외부 검색까지 노출</TooltipItemContent>
          </TooltipItem>
          <TooltipItem>
            <TooltipItemTitle>지속적 노출 효과</TooltipItemTitle>
            <TooltipItemContent>단순 광고가 아닌, 검색 기반으로 꾸준한 접근 발생</TooltipItemContent>
          </TooltipItem>
          <TooltipItem>
            <TooltipItemTitle>간편 등록 & 관리</TooltipItemTitle>
            <TooltipItemContent>별도 개발 없이 기업 계정만으로 서비스 등록 가능</TooltipItemContent>
          </TooltipItem>
          <TooltipItem>
            <TooltipItemTitle>온라인 영업 채널 확장</TooltipItemTitle>
            <TooltipItemContent>기존 영업망에 더해, 새로운 디지털 채널 확보</TooltipItemContent>
          </TooltipItem>
        </TooltipList>
      </InfoTooltip>
      
      <SectionTitle>구독 플랜</SectionTitle>
      <SectionSubtitle>초기 사전등록 기업만 누릴 수 있는 무료 상위 노출 혜택과
      브랜드 선점 효과를 지금 확보하세요</SectionSubtitle>
      
      <SubscriptionGrid>
        <SubscriptionCard>
          <CardLeft>
            <PlanName>Basic</PlanName>
            <PlanPrice>
              ₩9,900
              <PlanPeriod>/월</PlanPeriod>
            </PlanPrice>
          </CardLeft>
          <CardCenter>
            <FeatureList>
              <FeatureItem>기본 서비스 검색</FeatureItem>
              <FeatureItem>이메일 알림</FeatureItem>
              <FeatureItem>기본 고객 지원</FeatureItem>
              <FeatureItem>광고 포함</FeatureItem>
            </FeatureList>
          </CardCenter>
          <CardRight>
            <SubscribeButton>시작하기</SubscribeButton>
          </CardRight>
        </SubscriptionCard>
        
        <SubscriptionCard isPopular={true}>
          <PopularBadge>인기</PopularBadge>
          <CardLeft>
            <PlanName>Pro</PlanName>
            <PlanPrice>
              ₩19,900
              <PlanPeriod>/월</PlanPeriod>
            </PlanPrice>
          </CardLeft>
          <CardCenter>
            <FeatureList>
              <FeatureItem>무제한 서비스 검색</FeatureItem>
              <FeatureItem>우선순위 매칭</FeatureItem>
              <FeatureItem>24/7 고객 지원</FeatureItem>
              <FeatureItem>광고 제거</FeatureItem>
              <FeatureItem>개인화 추천</FeatureItem>
              <FeatureItem>고급 분석 도구</FeatureItem>
            </FeatureList>
          </CardCenter>
          <CardRight>
            <SubscribeButton isPopular={true}>시작하기</SubscribeButton>
          </CardRight>
        </SubscriptionCard>
        
        <SubscriptionCard>
          <CardLeft>
            <PlanName>Enterprise</PlanName>
            <PlanPrice>
              ₩49,900
              <PlanPeriod>/월</PlanPeriod>
            </PlanPrice>
          </CardLeft>
          <CardCenter>
            <FeatureList>
              <FeatureItem>모든 Pro 기능</FeatureItem>
              <FeatureItem>전담 매니저</FeatureItem>
              <FeatureItem>맞춤형 솔루션</FeatureItem>
              <FeatureItem>API 접근</FeatureItem>
              <FeatureItem>화이트 라벨</FeatureItem>
              <FeatureItem>우선 지원</FeatureItem>
            </FeatureList>
          </CardCenter>
          <CardRight>
            <SubscribeButton>문의하기</SubscribeButton>
          </CardRight>
        </SubscriptionCard>
      </SubscriptionGrid>
    </Section3Container>
  );
};

export default Section3;
