import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xxl};
  min-height: 100vh;
`;

const BackButton = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primaryDark};
  }
`;

const CategoryHeader = styled.div`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.xxl};
`;

const CategoryIconLarge = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(
    135deg,
    ${(props) => props.color1} 0%,
    ${(props) => props.color2} 100%
  );
  border-radius: ${(props) => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  margin: 0 auto ${(props) => props.theme.spacing.xl};
  box-shadow: ${(props) => props.theme.shadows.lg};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 150px;
    height: 150px;
    font-size: 4rem;
  }
`;

const CategoryTitle = styled.h1`
  font-size: 3rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: ${(props) => props.theme.spacing.md};
  font-weight: bold;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const CategoryDescription = styled.p`
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.gray[600]};
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto ${(props) => props.theme.spacing.xxl};
`;

const ContentSection = styled.div`
  background: white;
  padding: ${(props) => props.theme.spacing.xxl};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: ${(props) => props.theme.spacing.lg};
  text-align: center;
`;

const PlaceholderContent = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.gray[500]};
  font-size: 1.1rem;
  padding: ${(props) => props.theme.spacing.xxl};
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
`;

const CategoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 카테고리 데이터 (실제로는 API에서 가져오거나 Context/Redux에서 관리)
  const categories = [
    {
      id: 1,
      name: "title",
      description: "description",
      icon: "🏨",
      color1: "#FF6B6B",
      color2: "#FF8E8E",
    },
    {
      id: 2,
      name: "title",
      description: "description",
      icon: "🏡",
      color1: "#4ECDC4",
      color2: "#6ED3D0",
    },
    {
      id: 3,
      name: "title",
      description: "description",
      icon: "🏖️",
      color1: "#45B7D1",
      color2: "#6BC5D8",
    },
    {
      id: 4,
      name: "title",
      description: "description",
      icon: "🏠",
      color1: "#96CEB4",
      color2: "#A8D4C2",
    },
    {
      id: 5,
      name: "title",
      description: "description",
      icon: "⛺",
      color1: "#FECA57",
      color2: "#FED766",
    },
    {
      id: 6,
      name: "title",
      description: "description",
      icon: "🏯",
      color1: "#FF9FF3",
      color2: "#FFB3F7",
    },
    {
      id: 7,
      name: "title",
      description: "description",
      icon: "🏯",
      color1: "#A8E6CF",
      color2: "#B8F0D6",
    },
    {
      id: 8,
      name: "title",
      description: "description",
      icon: "🏯",
      color1: "#FFD93D",
      color2: "#FFE066",
    },
  ];

  const category = categories.find((cat) => cat.id === parseInt(id));

  if (!category) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate("/")}>
          ← 메인으로 돌아가기
        </BackButton>
        <CategoryHeader>
          <CategoryTitle>카테고리를 찾을 수 없습니다</CategoryTitle>
          <CategoryDescription>
            존재하지 않는 카테고리입니다.
          </CategoryDescription>
        </CategoryHeader>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate("/")}>← 메인으로 돌아가기</BackButton>

      <CategoryHeader>
        <CategoryIconLarge color1={category.color1} color2={category.color2}>
          {category.icon}
        </CategoryIconLarge>
        <CategoryTitle>{category.name}</CategoryTitle>
        <CategoryDescription>{category.description}</CategoryDescription>
      </CategoryHeader>

      <ContentSection>
        <SectionTitle>추천 숙소</SectionTitle>
        <PlaceholderContent>
          {category.name} 카테고리의 추천 숙소들이 여기에 표시됩니다.
          <br />
          향후 숙소 목록, 필터링, 예약 기능 등을 추가할 수 있습니다.
        </PlaceholderContent>
      </ContentSection>

      <ContentSection>
        <SectionTitle>인기 지역</SectionTitle>
        <PlaceholderContent>
          {category.name} 관련 인기 여행지와 지역 정보가 표시됩니다.
        </PlaceholderContent>
      </ContentSection>

      <ContentSection>
        <SectionTitle>이용 팁</SectionTitle>
        <PlaceholderContent>
          {category.name} 이용 시 유용한 팁과 정보를 제공합니다.
        </PlaceholderContent>
      </ContentSection>
    </DetailContainer>
  );
};

export default CategoryDetailPage;
