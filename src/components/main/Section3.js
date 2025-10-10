import styled from "styled-components";
import { useState } from "react";

const Section3Container = styled.div`
  width: 100%;
  padding: 80px 100px;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 1024px) {
    padding: 60px 40px;
  }
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    margin-bottom: 40px;
  }
`;


const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 20px 0;
  line-height: 1.2;
  text-align: left;
  
  @media (max-width: 1024px) {
    font-size: 2rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    text-align: center;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0 0 0 0;
  line-height: 1.5;
  text-align: left;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }
`;

const PricingSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const SubscriptionGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 100px;
  width: 100%;
  justify-content: center;
  align-items: stretch;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const SubscriptionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 25px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  gap: 20px;
  flex: 1;
  max-width: 400px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.isPopular ? 'rgba(115, 102, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  ${props => props.isPopular && `
    border-color: ${props.theme.gradients.primary};
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  `}
  
  @media (max-width: 1024px) {
    max-width: none;
  }
  
  @media (max-width: 768px) {
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

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: center;
  width: 100%;
`;

const CardFeatures = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: auto;
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
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
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

const PricingModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const PricingModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  transform: ${props => props.isVisible ? 'scale(1)' : 'scale(0.9)'};
  transition: all 0.3s ease;
`;

const PricingTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 30px 0;
`;

const PricingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const PricingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${(props) => props.theme.gradients.primary};
    background: rgba(59, 130, 246, 0.05);
  }
`;

const PricingItemLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const PricingItemPrice = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${(props) => props.theme.gradients.primary};
`;

const CloseButton = styled.button`
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

const Section3 = () => {
  const [isPricingModalVisible, setIsPricingModalVisible] = useState(false);

  return (
    <Section3Container id="pricing">
      
      {/* <InfoContainer>
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
      </InfoTooltip> */}
      
      <HeaderSection>
        <SectionTitle>구독 플랜</SectionTitle>
        <SectionSubtitle>초기 사전등록 기업만 누릴 수 있는 무료 상위 노출 혜택과
        브랜드 선점 효과를 지금 확보하세요</SectionSubtitle>
      </HeaderSection>
      
      <PricingSection>
        <SubscriptionGrid>
        <SubscriptionCard>
          <CardHeader>
            <PlanName>무료</PlanName>
            <PlanPrice>
              ₩0
              <PlanPeriod>/월</PlanPeriod>
            </PlanPrice>
          </CardHeader>
          <CardFeatures>
            <FeatureList>
              <FeatureItem>기업 기본 정보 등록(회사명, 연락처, 카테고리 등)</FeatureItem>
              <FeatureItem>서비스 제품 1건 등록 가능</FeatureItem>
              <FeatureItem>사진 첨부 1장 제한</FeatureItem>
              <FeatureItem>기본 노출</FeatureItem>
            </FeatureList>
          </CardFeatures>
          <CardFooter>
            <SubscribeButton>무료 시작</SubscribeButton>
          </CardFooter>
        </SubscriptionCard>
        
        <SubscriptionCard isPopular={true}>
          <PopularBadge>인기</PopularBadge>
          <CardHeader>
            <PlanName>Pro</PlanName>
            <PlanPrice>
              기업별 상이
              <PlanPeriod>/월</PlanPeriod>
            </PlanPrice>
          </CardHeader>
          <CardFeatures>
            <FeatureList>
              <FeatureItem>서비스 등록 5건까지 가능<br />(이후 초과 시 추가 Premium 결제)</FeatureItem> 
              <FeatureItem>사진,PDF 첨부</FeatureItem>
              <FeatureItem>자동 견척 요청 기능</FeatureItem>
              <FeatureItem>상위 노출 보장</FeatureItem>
              <FeatureItem>고객 채팅 기능</FeatureItem>
              <FeatureItem>데이터 리포트 제공</FeatureItem>
              <FeatureItem>맞춤 리드 추천</FeatureItem>
            </FeatureList>
          </CardFeatures>
          <CardFooter>
            <SubscribeButton 
              isPopular={true}
              onClick={() => setIsPricingModalVisible(true)}
            >
              구독하기
            </SubscribeButton>
          </CardFooter>
        </SubscriptionCard>
        
        {/* <BenefitsCard>
          <CardHeader>
            <BenefitsTitle>등록 기업의 혜택</BenefitsTitle>
            <BenefitsSubtitle>초기 사전등록 기업만 누릴 수 있는 특별 혜택</BenefitsSubtitle>
          </CardHeader>
          <CardFeatures>
            <BenefitsList>
              <BenefitsItem>시장 선점 기회 - 카테고리 무료 상위 노출</BenefitsItem>
              <BenefitsItem>매출 확대 - 새로운 거래처 발굴</BenefitsItem>
              <BenefitsItem>검색 최적화 지원 - 외부 검색까지 노출</BenefitsItem>
              <BenefitsItem>지속적 노출 효과 - 검색 기반 접근</BenefitsItem>
              <BenefitsItem>간편 등록 & 관리 - 별도 개발 없이 등록</BenefitsItem>
              <BenefitsItem>온라인 영업 채널 확장</BenefitsItem>
            </BenefitsList>
          </CardFeatures>
        </BenefitsCard> */}
        </SubscriptionGrid>
      </PricingSection>
      
      <PricingModal 
        isVisible={isPricingModalVisible}
        onClick={() => setIsPricingModalVisible(false)}
      >
        <PricingModalContent 
          isVisible={isPricingModalVisible}
          onClick={(e) => e.stopPropagation()}
        >
          <PricingTitle>Pro 플랜 가격</PricingTitle>
          <PricingList>
            <PricingItem>
              <PricingItemLabel>중소기업</PricingItemLabel>
              <PricingItemPrice>월 49,000원</PricingItemPrice>
            </PricingItem>
            <PricingItem>
              <PricingItemLabel>중견기업</PricingItemLabel>
              <PricingItemPrice>월 199,000원</PricingItemPrice>
            </PricingItem>
            <PricingItem>
              <PricingItemLabel>대기업</PricingItemLabel>
              <PricingItemPrice>월 399,000원</PricingItemPrice>
            </PricingItem>
          </PricingList>
          <CloseButton onClick={() => setIsPricingModalVisible(false)}>
            확인
          </CloseButton>
        </PricingModalContent>
      </PricingModal>
    </Section3Container>
  );
};

export default Section3;
