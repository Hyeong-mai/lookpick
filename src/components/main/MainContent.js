import styled from "styled-components";

const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
`;

const PreRegisterBadge = styled.div`
  padding: 12px 24px;
  border-radius: 30px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              ${(props) => props.theme.gradients.primary} border-box;
  color: #333;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: #555;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const Button = styled.button`
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
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(115, 102, 255, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const Row = styled.div`
  display: flex;
  gap: 50px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 180px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const FeatureContent = styled.p`
  font-size: 0.95rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const MainContent = () => {
  return (
    <MainContentWrapper>
      <PreRegisterBadge>사전등록 오픈</PreRegisterBadge>
      <Title>LookPick</Title>
      <Subtitle>최고의 서비스를 찾고 제공하는 플랫폼</Subtitle>
      <Button>시작하기</Button>
      <Row>
        <FeatureItem>
          <FeatureTitle>빠른 매칭</FeatureTitle>
          <FeatureContent>AI 기반 서비스 추천</FeatureContent>
        </FeatureItem>
        <FeatureItem>
          <FeatureTitle>안전한 거래</FeatureTitle>
          <FeatureContent>검증된 서비스 제공업체</FeatureContent>
        </FeatureItem>
        <FeatureItem>
          <FeatureTitle>24/7 지원</FeatureTitle>
          <FeatureContent>언제든 도움을 받으세요</FeatureContent>
        </FeatureItem>
      </Row>
    </MainContentWrapper>
  );
};

export default MainContent;
