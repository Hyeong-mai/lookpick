import styled from "styled-components";

const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
  padding: 60px 20px;
  margin: 0 auto;
  max-width: 800px;
  
  @media (max-width: 1024px) {
    padding: 50px 20px;
  }
  
  @media (max-width: 768px) {
    gap: 30px;
    padding: 40px 16px;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: 1024px) {
    font-size: 3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.5;
  max-width: 500px;
  
  @media (max-width: 1024px) {
    font-size: 1.125rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  padding: 16px 32px;
  font-size: 1rem;
  background: ${(props) => props.theme.colors.black};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  &:hover {
    background: ${(props) => props.theme.colors.gray[800]};
  }
  
  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 0.9rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  padding: 30px 20px;
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${(props) => props.theme.colors.gray[300]};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 12px 0;
`;

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.4;
`;

const MainContent = () => {
  return (
    <MainContentWrapper>
      <Title>LookPick</Title>
      <Subtitle>최고의 서비스를 찾고 제공하는 플랫폼</Subtitle>
      <Button>시작하기</Button>
      <FeaturesGrid>
        <FeatureCard>
          <FeatureTitle>빠른 매칭</FeatureTitle>
          <FeatureDescription>AI 기반 서비스 추천</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureTitle>안전한 거래</FeatureTitle>
          <FeatureDescription>검증된 서비스 제공업체</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureTitle>24/7 지원</FeatureTitle>
          <FeatureDescription>언제든 도움을 받으세요</FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>
    </MainContentWrapper>
  );
};

export default MainContent;
