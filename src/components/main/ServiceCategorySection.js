import styled from "styled-components";
import { useState } from "react";

const CategorySectionContainer = styled.div`
  width: 100%;
  padding: 80px 100px;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  overflow: visible;
  
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

const CategoryGridSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: visible;
  padding-bottom: 40px;
  min-height: 300px;
`;

const CategoryTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 20px 0;
  text-align: left;
  line-height: 1.2;
  
  @media (max-width: 1024px) {
    font-size: 2rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    text-align: center;
  }
`;

const CategoryDescription = styled.p`
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

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: minmax(120px, auto);
  gap: 20px;
  overflow: visible;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(100px, auto);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(80px, auto);
  }
`;

const CategoryCard = styled.div`


  border-radius: 16px;
  padding: 20px 12px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: visible;
  z-index: ${(props) => props.isExpanded ? 10 : 1};
  
  /* 그리드 확장 애니메이션 */
  grid-column: ${(props) => props.isExpanded ? 'span 2' : 'span 1'};
  grid-row: ${(props) => props.isExpanded ? 'span 2' : 'span 1'};
  
  /* 부드러운 트랜지션 */
  transition: 
    grid-column 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    grid-row 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    border-color 0.3s ease,
    box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background 0.3s ease;
  
  box-shadow: ${(props) => props.isExpanded 
    ? '0 25px 50px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    opacity: ${(props) => props.isExpanded ? 1 : 0};
    transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border-radius: 14px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;

    border-radius: 18px;
    opacity: ${(props) => props.isExpanded ? 1 : 0};
    z-index: -1;
    transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  &:hover {
    

    transform: ${(props) => props.isExpanded ? 'none' : 'translateY(-2px)'};
    box-shadow: ${(props) => props.isExpanded 
      ? '0 25px 50px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
      : '0 8px 20px rgba(59, 130, 246, 0.15)'};
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px 10px;
    grid-column: ${(props) => props.isExpanded ? 'span 2' : 'span 1'};
    grid-row: ${(props) => props.isExpanded ? 'span 2' : 'span 1'};
  }
`;

const CategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: ${(props) => props.isExpanded ? 'scale(1.15) rotate(8deg)' : 'scale(1) rotate(0deg)'};
  box-shadow: ${(props) => props.isExpanded 
    ? '0 8px 20px rgba(59, 130, 246, 0.3)' 
    : '0 2px 8px rgba(59, 130, 246, 0.2)'};
  
  ${CategoryCard}:hover & {
    transform: ${(props) => props.isExpanded ? 'scale(1.15) rotate(8deg)' : 'scale(1.1) rotate(5deg)'};
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  }
`;

const CategoryName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(props) => props.isExpanded ? '#3b82f6' : props.theme.colors.gray[800]};
  line-height: 1.3;
  margin: 0 0 8px 0;
  position: relative;
  z-index: 1;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: ${(props) => props.isExpanded ? 'scale(1.05)' : 'scale(1)'};
`;

const CategoryCount = styled.div`
  font-size: 0.7rem;
  color: ${(props) => props.theme.colors.gray[600]};
  font-weight: 500;
  background: ${(props) => props.theme.colors.gray[100]};
  padding: 4px 8px;
  border-radius: 12px;
  display: inline-block;
  position: relative;
  z-index: 1;
`;

const SubcategoriesContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) => props.theme.colors.white};
  padding: 20px;
  z-index: 1;
  opacity: ${(props) => props.isVisible ? 1 : 0};
  visibility: ${(props) => props.isVisible ? 'visible' : 'hidden'};
  transform: ${(props) => props.isVisible 
    ? 'translateY(0) scale(1)' 
    : 'translateY(20px) scale(0.95)'};
  pointer-events: ${(props) => props.isVisible ? 'auto' : 'none'};
  display: ${(props) => props.isVisible ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 0 0 16px 16px;
`;

const SubcategoryList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  height: 100%;
`;

const SubcategoryItem = styled.div`
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.gray[700]};
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-align: center;
  border-radius: 8px;
  position: relative;
  background: ${(props) => props.theme.colors.gray[50]};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transform: translateY(0);
  
  &:hover {
    color: #3b82f6;
    font-weight: 600;
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
`;

const ServiceCategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ServiceEditPage에서 가져온 카테고리 데이터 (아이콘 포함)
  const categories = [
    { id: "software", name: "개발 / 소프트웨어 / IT", icon: "💻", subcategories: ["소프트웨어 개발", "시스템·네트워크 구축", "보안·클라우드", "데이터/AI·컨설팅"] },
    { id: "design", name: "디자인 / 콘텐츠 / 마케팅", icon: "🎨", subcategories: ["그래픽·브랜딩", "웹·앱 디자인", "영상·미디어 제작", "마케팅·광고 대행"] },
    { id: "logistics", name: "물류 / 운송 / 창고", icon: "🚚", subcategories: ["택배·화물 운송", "물류대행(3PL)", "창고 임대·보관", "국제 물류"] },
    { id: "manufacturing", name: "제조 / 생산 / 가공", icon: "🏭", subcategories: ["제품 설계·개발", "부품 제작·조립", "시제품·소량 생산", "대량 생산·OEM·ODM"] },
    { id: "infrastructure", name: "설비 / 건설 / 유지보수", icon: "🏗️", subcategories: ["전기·통신 설비", "건축·인테리어", "설비 유지보수", "안전·환경 관리"] },
    { id: "education", name: "교육 / 컨설팅 / 인증", icon: "📚", subcategories: ["직무·기업 교육", "경영·전략 컨설팅", "법률·특허·지식재산", "인증·품질 관리"] },
    { id: "office", name: "사무 / 문서 / 번역", icon: "📄", subcategories: ["인쇄·출판", "문서 작성·디자인", "번역·통역", "사무지원 서비스"] },
    { id: "advertising", name: "광고 / 프로모션 / 행사", icon: "📢", subcategories: ["광고·캠페인 집행", "홍보물·판촉물 제작", "행사·프로모션 기획", "디지털 광고"] },
    { id: "machinery", name: "기계 / 장비 / 산업재", icon: "⚙️", subcategories: ["산업 장비", "공구·부품", "장비 임대·유지보수", "측정·시험 장비"] },
    { id: "lifestyle", name: "생활 / 복지 / 기타 서비스", icon: "🌟", subcategories: ["청소·방역", "사무실 관리·식음료 납품", "복리후생·대행 서비스", "기타 서비스"] }
  ];

  // 랜덤 카운트 생성 (실제로는 API에서 가져올 데이터)
  const getRandomCount = () => Math.floor(Math.random() * 500) + 50;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      <CategorySectionContainer>
        <HeaderSection>
          <CategoryTitle>서비스 카테고리</CategoryTitle>
          <CategoryDescription>다양한 업종의 전문 업체들을 카테고리별로 확인해보세요</CategoryDescription>
        </HeaderSection>
        
        <CategoryGridSection>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                onClick={() => handleCategoryClick(category.id)}
                isExpanded={selectedCategory === category.id}
              >
                <CategoryIcon isExpanded={selectedCategory === category.id}>{category.icon}</CategoryIcon>
                <CategoryName isExpanded={selectedCategory === category.id}>{category.name}</CategoryName>
                <CategoryCount>{getRandomCount()}개 업체</CategoryCount>
                <SubcategoriesContainer isVisible={selectedCategory === category.id}>
                  <SubcategoryList>
                    {category.subcategories.map((subcategory, index) => (
                      <SubcategoryItem key={index}>
                        {subcategory}
                      </SubcategoryItem>
                    ))}
                  </SubcategoryList>
                </SubcategoriesContainer>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </CategoryGridSection>
      </CategorySectionContainer>
    </>
  );
};

export default ServiceCategorySection;
