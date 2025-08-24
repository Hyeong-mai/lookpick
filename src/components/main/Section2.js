import styled from "styled-components";

const Section2Container = styled.div`
  width: 100%;
  padding: 80px 100px;
  background-color: ${(props) => props.theme.colors.lightGray || '#f8f9fa'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 60px 20px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;

  margin-right: 80px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 40px;
    text-align: center;
  }
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
  color: #555;
  margin: 0 0 40px 0;
  font-weight: 400;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 40px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.theme.gradients.primary};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const ActionButton = styled.button`
  padding: 18px 40px;
  font-size: 1.3rem;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  align-self: flex-start;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(115, 102, 255, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    align-self: center;
  }
`;

const RightColumn = styled.div`
  flex: 1;

  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RightContent = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const RightTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
`;

const RightDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0;
  line-height: 1.6;
  text-align: center;
`;

const Section2 = () => {
  return (
    <Section2Container>
      <LeftColumn>
        <SectionTitle>왜 LookPick인가요?</SectionTitle>
        <SectionSubtitle>수많은 서비스 중에서 LookPick을 선택해야 하는 이유를 확인해보세요</SectionSubtitle>
        <FeatureList>
          <FeatureItem>
            <FeatureIcon></FeatureIcon>
            <FeatureContent>
              <FeatureTitle>신뢰할 수 있는 검증</FeatureTitle>
              <FeatureDescription>모든 서비스는 엄격한 검증 과정을 거칩니다</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon></FeatureIcon>
            <FeatureContent>
              <FeatureTitle>개인화된 추천</FeatureTitle>
              <FeatureDescription>AI가 당신의 니즈에 맞는 서비스를 추천합니다</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon></FeatureIcon>
            <FeatureContent>
              <FeatureTitle>투명한 가격</FeatureTitle>
              <FeatureDescription>숨겨진 비용 없이 명확한 가격을 제공합니다</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon></FeatureIcon>
            <FeatureContent>
              <FeatureTitle>24/7 고객 지원</FeatureTitle>
              <FeatureDescription>언제든지 전문가의 도움을 받을 수 있습니다</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
        </FeatureList>
        <ActionButton>자세히 알아보기</ActionButton>
      </LeftColumn>
      
      <RightColumn>
        <RightContent>
          <RightTitle>고객 만족도 98%</RightTitle>
          <RightDescription>
            LookPick을 이용한 고객들의 만족도가 압도적으로 높습니다. 
            우리는 지속적으로 서비스를 개선하여 더 나은 경험을 제공하기 위해 노력하고 있습니다.
          </RightDescription>
        </RightContent>
      </RightColumn>
    </Section2Container>
  );
};

export default Section2;
