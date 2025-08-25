import styled from "styled-components";

const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.gap.xl};
  z-index: 2;
  text-align: center;
  max-width: ${(props) => props.theme.container.desktop};
  padding: 0 ${(props) => props.theme.spacing.md};
  margin: 0 auto;
  
  ${(props) => props.theme.media.tablet} {
    max-width: ${(props) => props.theme.container.tablet};
    gap: ${(props) => props.theme.gap.lg};
    padding: 0 ${(props) => props.theme.spacing.sm};
  }
  
  ${(props) => props.theme.media.mobile} {
    max-width: 100%;
    gap: ${(props) => props.theme.gap.md};
    padding: 0 ${(props) => props.theme.spacing.xs};
  }
`;

const PreRegisterBadge = styled.div`
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  border-radius: 30px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              ${(props) => props.theme.gradients.primary} border-box;
  color: #333;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 700;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
    font-size: ${(props) => props.theme.fontSize.xs};
  }
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSize["6xl"]};
  font-weight: 800;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
  
  ${(props) => props.theme.media.tablet} {
    font-size: ${(props) => props.theme.fontSize["5xl"]};
  }
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize["4xl"]};
  }
`;

const Subtitle = styled.p`
  font-size: ${(props) => props.theme.fontSize.xl};
  color: #555;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
  max-width: 600px;
  
  ${(props) => props.theme.media.tablet} {
    font-size: ${(props) => props.theme.fontSize.lg};
    max-width: 500px;
  }
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.base};
    max-width: 100%;
  }
`;

const Button = styled.button`
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.xl};
  font-size: ${(props) => props.theme.fontSize.lg};
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(115, 102, 255, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  ${(props) => props.theme.media.tablet} {
    padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
    font-size: ${(props) => props.theme.fontSize.base};
  }
  
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
    font-size: ${(props) => props.theme.fontSize.sm};
    width: 100%;
    max-width: 280px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: ${(props) => props.theme.gap.xl};
  margin-top: ${(props) => props.theme.gap.xl};
  
  ${(props) => props.theme.media.tablet} {
    gap: ${(props) => props.theme.gap.lg};
    margin-top: ${(props) => props.theme.gap.lg};
  }
  
  ${(props) => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${(props) => props.theme.gap.md};
    margin-top: ${(props) => props.theme.gap.md};
  }
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md};
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-width: 180px;
  flex: 1;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }
  
  ${(props) => props.theme.media.tablet} {
    min-width: 160px;
    padding: ${(props) => props.theme.spacing.sm};
  }
  
  ${(props) => props.theme.media.mobile} {
    min-width: 100%;
    padding: ${(props) => props.theme.spacing.md};
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 700;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.base};
  }
`;

const FeatureContent = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: #666;
  margin: 0;
  line-height: 1.4;
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.xs};
  }
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
