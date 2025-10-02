import styled from "styled-components";

const Section1Container = styled.div`
  width: 100%;
  padding: 80px 100px;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  
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

const FeaturesSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  width: 100%;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 15px;

  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  min-height: 180px;

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
    padding: 20px 15px;
    min-height: 160px;
  }
`;

const GridImage = styled.img`
  width: 100%;
  height: 150px;
  border-radius: 8px 8px 0 0;
  object-fit: cover;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    height: 120px;
  }
`;

const GridTextContainer = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const GridTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.01em;
  
  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const GridContent = styled.p`
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.4;
  font-weight: 400;
  
  @media (max-width: 1024px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Section1 = () => {
  return (
    <Section1Container id="features">
      <HeaderSection>
        <SectionTitle>서비스 특징</SectionTitle>
        <SectionSubtitle>LookPick이 제공하는 다양한 서비스들을 확인해보세요</SectionSubtitle>
      </HeaderSection>
      
      <FeaturesSection>
        <SectionGrid>
        <GridItem>
          <GridImage src="/image/service/service1.jpeg" alt="업체 통합 검색" />
          <GridTextContainer>
            <GridTitle>업체 통합 검색</GridTitle>
            <GridContent>산업/분야별 전문 업체를 한 곳에서 검색</GridContent>
          </GridTextContainer>
        </GridItem>
        <GridItem>
          <GridImage src="/image/service/service3.jpeg" alt="간편 견적 요청" />
          <GridTextContainer>
            <GridTitle>간편 견적 요청</GridTitle>
            <GridContent>가격 공개 가능한 견적에 대하여 자동 견적 송부 시스템
            제공(수수료 부담 없음)</GridContent>
          </GridTextContainer>
        </GridItem>
        
        <GridItem>
          <GridImage src="/image/service/service4.jpeg" alt="직접 컨택 방식" />
          <GridTextContainer>
            <GridTitle>직접 컨택 방식</GridTitle>
            <GridContent>결제·계약은 기업 간 직접 진행 (수수료 부담 없음)</GridContent>
          </GridTextContainer>
        </GridItem>
        <GridItem>
          <GridImage src="/image/service/service5.jpeg" alt="정보 구조화 제공" />
          <GridTextContainer>
            <GridTitle>정보 구조화 제공</GridTitle>
            <GridContent>홈페이지, 서비스, 포트폴리오 등 핵심 정보 한눈에</GridContent>
          </GridTextContainer>
        </GridItem>
       
        </SectionGrid>
      </FeaturesSection>
    </Section1Container>
  );
};

export default Section1;
