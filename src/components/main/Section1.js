import styled from "styled-components";

const Section1Container = styled.div`
  width: 100%;
  padding: 80px 100px;
  background-color: ${(props) => props.theme.colors.white};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    padding: 60px 40px;
  }
  
  @media (max-width: 768px) {
    padding: 40px 20px;
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
  
  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.4rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0 0 50px 0;
  font-weight: 400;
  line-height: 1.4;
  max-width: 600px;
  
  @media (max-width: 1024px) {
    font-size: 1.25rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 0 0 40px 0;
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 1024px) {
    gap: 25px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 600px;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 20px;
  padding: 35px 25px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${(props) => props.theme.gradients.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 1);

    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
    padding: 30px 20px;
  }
`;



const GridTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const GridContent = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const Section1 = () => {
  return (
    <Section1Container>
      <SectionTitle>서비스 특징</SectionTitle>
      <SectionSubtitle>LookPick이 제공하는 다양한 서비스들을 확인해보세요</SectionSubtitle>
      <SectionGrid>
        <GridItem>
          {/* <GridIcon></GridIcon> */}
          <GridTitle>업체 통합 검색</GridTitle>
          <GridContent>산업/분야별 전문 업체를 한 곳에서 검색</GridContent>
        </GridItem>
        <GridItem>
          {/* <GridIcon></GridIcon> */}
          <GridTitle>간편 견적 요청</GridTitle>
          <GridContent>가격 공개 가능한 견적에 대하여 자동 견적 송부 시스템
          제공(수수료 부담 없음)</GridContent>
        </GridItem>
        
        <GridItem>
          {/* <GridIcon></GridIcon> */}
          <GridTitle>직접 컨택 방식</GridTitle>
          <GridContent>결제·계약은 기업 간 직접 진행 (수수료 부담 없음)</GridContent>
        </GridItem>
        <GridItem>
          {/* <GridIcon></GridIcon> */}
          <GridTitle>정보 구조화 제공</GridTitle>
          <GridContent>홈페이지, 서비스, 포트폴리오 등 핵심 정보 한눈에</GridContent>
        </GridItem>
       
      </SectionGrid>
    </Section1Container>
  );
};

export default Section1;
