import styled from "styled-components";

const Section3Container = styled.div`
  width: 100%;
  padding: 80px 20px;
  background-color: ${(props) => props.theme.colors.white};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1000px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SubscriptionCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${(props) => props.isPopular ? 'rgba(115, 102, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  }
  
  ${props => props.isPopular && `
    border-color: ${props.theme.gradients.primary};
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  `}
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

const PlanName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
`;

const PlanPeriod = styled.span`
  font-size: 1rem;
  color: #666;
  font-weight: 400;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  font-size: 1rem;
  color: #555;
  
  &:before {
    content: '✓';
    color: #4CAF50;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const SubscribeButton = styled.button`
  padding: 15px 30px;
  font-size: 1.1rem;
  background: ${(props) => props.isPopular ? props.theme.gradients.primary : 'transparent'};
  color: ${(props) => props.isPopular ? 'white' : '#333'};
  border: 2px solid ${(props) => props.isPopular ? 'transparent' : '#333'};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-top: auto;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    background: ${(props) => props.isPopular ? props.theme.gradients.primary : '#333'};
    color: white;
  }
`;

const Section3 = () => {
  return (
    <Section3Container>
      <SectionTitle>구독 플랜</SectionTitle>
      <SectionSubtitle>당신의 필요에 맞는 최적의 구독 플랜을 선택하세요</SectionSubtitle>
      
      <SubscriptionGrid>
        <SubscriptionCard>
          <PlanName>Basic</PlanName>
          <PlanPrice>
            ₩9,900
            <PlanPeriod>/월</PlanPeriod>
          </PlanPrice>
          <FeatureList>
            <FeatureItem>기본 서비스 검색</FeatureItem>
            <FeatureItem>이메일 알림</FeatureItem>
            <FeatureItem>기본 고객 지원</FeatureItem>
            <FeatureItem>광고 포함</FeatureItem>
          </FeatureList>
          <SubscribeButton>시작하기</SubscribeButton>
        </SubscriptionCard>
        
        <SubscriptionCard isPopular={true}>
          <PopularBadge>인기</PopularBadge>
          <PlanName>Pro</PlanName>
          <PlanPrice>
            ₩19,900
            <PlanPeriod>/월</PlanPeriod>
          </PlanPrice>
          <FeatureList>
            <FeatureItem>무제한 서비스 검색</FeatureItem>
            <FeatureItem>우선순위 매칭</FeatureItem>
            <FeatureItem>24/7 고객 지원</FeatureItem>
            <FeatureItem>광고 제거</FeatureItem>
            <FeatureItem>개인화 추천</FeatureItem>
            <FeatureItem>고급 분석 도구</FeatureItem>
          </FeatureList>
          <SubscribeButton isPopular={true}>시작하기</SubscribeButton>
        </SubscriptionCard>
        
        <SubscriptionCard>
          <PlanName>Enterprise</PlanName>
          <PlanPrice>
            ₩49,900
            <PlanPeriod>/월</PlanPeriod>
          </PlanPrice>
          <FeatureList>
            <FeatureItem>모든 Pro 기능</FeatureItem>
            <FeatureItem>전담 매니저</FeatureItem>
            <FeatureItem>맞춤형 솔루션</FeatureItem>
            <FeatureItem>API 접근</FeatureItem>
            <FeatureItem>화이트 라벨</FeatureItem>
            <FeatureItem>우선 지원</FeatureItem>
          </FeatureList>
          <SubscribeButton>문의하기</SubscribeButton>
        </SubscriptionCard>
      </SubscriptionGrid>
    </Section3Container>
  );
};

export default Section3;
