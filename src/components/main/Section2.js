import styled from "styled-components";

const Section2Container = styled.div`
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

const FeaturesSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  
  @media (max-width: 1024px) {
    gap: 25px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  transition: all 0.3s ease;
  min-height: 120px;
  aspect-ratio: 2/3;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
    border-color: ${(props) => props.theme.colors.gray[300]};
  }
`;

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${(props) => props.theme.colors.black};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;

  position: relative;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
  z-index: 1;
`;

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.4;
  z-index: 1;
`;

const FeatureImageWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  border-radius: 12px;
  
  /* 위쪽으로 페이드아웃 그라데이션 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, 
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 40%,
      rgba(255, 255, 255, 0.7) 70%,
      rgba(255, 255, 255, 0.95) 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const FeatureImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
  transition: opacity 0.4s ease, filter 0.3s ease, transform 0.3s ease;
  
  /* 이미지 화질 개선 */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  filter: contrast(1.05) saturate(1.1) brightness(1.02);
  
  ${FeatureItem}:hover & {
    opacity: 0.5;
    transform: scale(1.05);
  }
`;



const Section2 = () => {
  const handleImageLoad = (e) => {
    e.target.classList.add('loaded');
  };

  return (
    <Section2Container>
      <HeaderSection>
        <SectionTitle>LookPick의 핵심 기능</SectionTitle>
        {/* <SectionSubtitle>수많은 서비스 중에서 LookPick을 선택해야 하는 이유를 확인해보세요</SectionSubtitle> */}
      </HeaderSection>
      
      <FeaturesSection>
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>1</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>스마트 검색 엔진</FeatureTitle>
              <FeatureDescription>AI 기반 알고리즘을 통해 연관성 높은 기업과 유사 서비스를 자동 추천합니다.
              지도 기반 검색을 통해 인근 업체도 한눈에 확인할 수 있습니다.</FeatureDescription>
            </FeatureContent>
            <FeatureImageWrapper>
              <FeatureImage 
                src="/image/whiy/why1.png" 
                alt="스마트 검색 엔진" 
                loading="lazy" 
                onLoad={handleImageLoad} 
              />
            </FeatureImageWrapper>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>2</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>간편 견적 시스템</FeatureTitle>
              <FeatureDescription>복잡한 과정 없이 플랫폼 내 자동 견적 생성 기능을 통해 손쉽게 견적 송부가 가능합니다.
              고객은 시간을 절약하고 업체는 효율적인 리드 관리가 가능합니다.</FeatureDescription>
            </FeatureContent>
            <FeatureImageWrapper>
              <FeatureImage 
                src="/image/whiy/why2.png" 
                alt="간편 견적 시스템" 
                loading="lazy" 
                onLoad={handleImageLoad} 
              />
            </FeatureImageWrapper>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>3</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>실시간 상담 채팅
              </FeatureTitle>
              <FeatureDescription>간단한 문의부터 협업 논의까지, 실시간 채팅으로 빠르게 소통하세요.
              전화나 이메일 없이 즉시 연결되어 영업 기회를 놓치지 않습니다.</FeatureDescription>
            </FeatureContent>
            <FeatureImageWrapper>
              <FeatureImage 
                src="/image/whiy/why3.png" 
                alt="실시간 상담 채팅" 
                loading="lazy" 
                onLoad={handleImageLoad} 
              />
            </FeatureImageWrapper>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>4</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>모든 산업 카테고리</FeatureTitle>
              <FeatureDescription>제조부터 IT, 디자인, 물류까지 모든 산업의 카테고리가 존재합니다.
              새로운 서비스도 손쉽게 등록되고 검색될 수 있습니다.</FeatureDescription>
            </FeatureContent>
            <FeatureImageWrapper>
              <FeatureImage 
                src="/image/whiy/why4.png" 
                alt="모든 산업 카테고리" 
                loading="lazy" 
                onLoad={handleImageLoad} 
              />
            </FeatureImageWrapper>
          </FeatureItem>
        </FeatureList>
      </FeaturesSection>
    </Section2Container>
  );
};

export default Section2;
