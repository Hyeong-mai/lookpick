import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CategoryContainer = styled.div`
  padding: ${(props) => props.theme.spacing.xxl} 0;
`;

const CategoryTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: ${(props) => props.theme.spacing.xxl};
  font-weight: bold;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: 2rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 1.8rem;
    margin-bottom: ${(props) => props.theme.spacing.xl};
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${(props) => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spacing.md};

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${(props) => props.theme.spacing.lg};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${(props) => props.theme.spacing.md};
  }
`;

const CategoryCard = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const CategoryIcon = styled.div`
  height: 120px;
  background: linear-gradient(
    135deg,
    ${(props) => props.color1} 0%,
    ${(props) => props.color2} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 100px;
    font-size: 2.5rem;
  }
`;

const CategoryContent = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  text-align: center;

  h3 {
    font-size: 1.3rem;
    color: ${(props) => props.theme.colors.dark};
    margin-bottom: ${(props) => props.theme.spacing.sm};
    font-weight: 600;
  }

  p {
    color: ${(props) => props.theme.colors.gray[600]};
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: ${(props) => props.theme.spacing.md};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: ${(props) => props.theme.spacing.md};

    h3 {
      font-size: 1.1rem;
    }

    p {
      font-size: 0.8rem;
    }
  }
`;

const CategoryList = () => {
  const navigate = useNavigate();

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
      name: "글램핑",
      description: "편안함과 자연을 동시에 즐기는 글램핑 체험입니다.",
      icon: "🏯",
      color1: "#A8E6CF",
      color2: "#B8F0D6",
    },
    {
      id: 8,
      name: "모텔",
      description: "편리한 접근성과 합리적인 가격의 모텔입니다.",
      icon: "🏯",
      color1: "#FFD93D",
      color2: "#FFE066",
    },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
  };

  return (
    <CategoryContainer>
      <CategoryTitle>카테고리</CategoryTitle>
      <CategoryGrid>
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            onClick={() => handleCategoryClick(category)}
          >
            <CategoryIcon color1={category.color1} color2={category.color2}>
              {category.icon}
            </CategoryIcon>
            <CategoryContent>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </CategoryContent>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </CategoryContainer>
  );
};

export default CategoryList;
