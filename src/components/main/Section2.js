import styled from "styled-components";

const Section2Container = styled.div`
  width: 100%;
  padding: 80px 20px;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    padding: 60px 40px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 40px 20px;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  margin-right: 60px;
  
  @media (max-width: 1024px) {
    margin-right: 40px;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 40px;
    text-align: center;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 20px 0;
  line-height: 1.2;
  
  @media (max-width: 1024px) {
    font-size: 2rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 0 0 40px 0;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
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

const ActionButton = styled.button`
  padding: 16px 32px;
  font-size: 1rem;
  background: ${(props) => props.theme.colors.black};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  align-self: flex-start;
  
  &:hover {
    background: ${(props) => props.theme.colors.gray[800]};
  }
  
  @media (max-width: 768px) {
    align-self: center;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  height: 100%;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const RightContent = styled.div`
  background: ${(props) => props.theme.colors.white};

  border-radius: 8px;
    height: 100%;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const RightTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 20px 0;
  text-align: center;
`;

const RightDescription = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.gray[600]};
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
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>B2B 특화</FeatureTitle>
              <FeatureDescription>제조, IT, 물류, 디자인 등 기업 간 거래 중심 업종 강화</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>다양한 등록 가능</FeatureTitle>
              <FeatureDescription>법인·개인사업자 등 모두 등록 가능</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>체계적 분류</FeatureTitle>
              <FeatureDescription>대·중·소 업종 분류로 빠른 탐색과 매칭 지원</FeatureDescription>
            </FeatureContent>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>✓</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>차별화된 혜택</FeatureTitle>
              <FeatureDescription>계약시 수수료 부담이 없어 기업의 매출은 100% 기업에게</FeatureDescription>
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
