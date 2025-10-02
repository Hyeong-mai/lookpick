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
  
  &:nth-child(odd) {
    transform: translateY(20px);
  }
  
  &:nth-child(even) {
    transform: translateY(-20px);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    transform: translateY(0px);
  }
  
  @media (max-width: 768px) {
    &:nth-child(odd),
    &:nth-child(even) {
      transform: translateY(0px);
    }
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
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin: 0;
`;

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0;
  line-height: 1.4;
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  flex: 1;
  padding: 0 10px;
`;

const ProgressDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.filled ? props.theme.colors.black : props.theme.colors.gray[300]};
  transition: all 0.3s ease;
  border: 3px solid white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  flex: 1;
  max-width: 24px;
`;



const Section2 = () => {
  return (
    <Section2Container>
      <HeaderSection>
        <SectionTitle>왜 LookPick인가요?</SectionTitle>
        <SectionSubtitle>수많은 서비스 중에서 LookPick을 선택해야 하는 이유를 확인해보세요</SectionSubtitle>
      </HeaderSection>
      
      <FeaturesSection>
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>B2B 특화</FeatureTitle>
              <FeatureDescription>제조, IT, 물류, 디자인 등 기업 간 거래 중심 업종 강화</FeatureDescription>
              <ProgressDots>
                <ProgressDot filled={true} />
                <ProgressDot filled={false} />
                <ProgressDot filled={false} />
                <ProgressDot filled={false} />
              </ProgressDots>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>다양한 등록 가능</FeatureTitle>
              <FeatureDescription>법인·개인사업자 등 모두 등록 가능</FeatureDescription>
              <ProgressDots>
                <ProgressDot filled={true} />
                <ProgressDot filled={true} />
                <ProgressDot filled={false} />
                <ProgressDot filled={false} />
              </ProgressDots>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>체계적 분류</FeatureTitle>
              <FeatureDescription>대·중·소 업종 분류로 빠른 탐색과 매칭 지원</FeatureDescription>
              <ProgressDots>
                <ProgressDot filled={true} index={0} />
                <ProgressDot filled={true} index={1} />
                <ProgressDot filled={true} index={2} />
                <ProgressDot filled={false} index={3} />
              </ProgressDots>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>차별화된 혜택</FeatureTitle>
              <FeatureDescription>계약시 수수료 부담이 없어 기업의 매출은 100% 기업에게</FeatureDescription>
              <ProgressDots>
                <ProgressDot filled={true} index={0} />
                <ProgressDot filled={true} index={1} />
                <ProgressDot filled={true} index={2} />
                <ProgressDot filled={true} index={3} />
              </ProgressDots>
            </FeatureContent>
          </FeatureItem>
        </FeatureList>
      </FeaturesSection>
    </Section2Container>
  );
};

export default Section2;
