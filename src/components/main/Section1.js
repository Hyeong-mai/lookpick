import styled from "styled-components";

const Section1Container = styled.div`
  width: 100%;
  padding: 80px 100px;
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
  color: #555;
  margin: 0 0 50px 0;
  font-weight: 400;
  line-height: 1.4;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: center;
  gap: 15px;
  padding: 30px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(115, 102, 255, 0.3);
  }
`;

const GridIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.theme.gradients.primary};
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GridTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`;

const GridContent = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const Section1 = () => {
  return (
    <Section1Container>
      <SectionTitle>서비스 특징</SectionTitle>
      <SectionSubtitle>LookPick이 제공하는 다양한 서비스들을 확인해보세요</SectionSubtitle>
      <SectionGrid>
        <GridItem>
          <GridIcon></GridIcon>
          <GridTitle>빠른 속도</GridTitle>
          <GridContent>초고속 매칭 시스템</GridContent>
        </GridItem>
        <GridItem>
          <GridIcon></GridIcon>
          <GridTitle>보안 강화</GridTitle>
          <GridContent>엄격한 보안 검증</GridContent>
        </GridItem>
        <GridItem>
          <GridIcon></GridIcon>
          <GridTitle>프리미엄</GridTitle>
          <GridContent>최고 품질 서비스</GridContent>
        </GridItem>
        <GridItem>
          <GridIcon></GridIcon>
          <GridTitle>글로벌</GridTitle>
          <GridContent>전 세계 서비스</GridContent>
        </GridItem>
        <GridItem>
          <GridIcon></GridIcon>
          <GridTitle>실시간</GridTitle>
          <GridContent>24시간 업데이트</GridContent>
        </GridItem>
        <GridItem>
          <GridIcon></GridIcon>
          <GridTitle>정확성</GridTitle>
          <GridContent>AI 기반 추천</GridContent>
        </GridItem>
      </SectionGrid>
    </Section1Container>
  );
};

export default Section1;
