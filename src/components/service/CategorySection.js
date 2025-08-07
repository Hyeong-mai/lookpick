import React from "react";
import styled from "styled-components";

const FormSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  margin-bottom: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const CategoryItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid
    ${(props) =>
      props.isSelected
        ? props.theme.colors.primary
        : props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.isSelected ? "rgba(59, 130, 246, 0.1)" : "white"};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
  }

  span {
    font-size: 0.9rem;
    color: ${(props) => props.theme.colors.dark};
  }
`;

const CategorySection = ({ formData, handleCategoryChange, categories }) => {
  return (
    <FormSection>
      <SectionTitle>카테고리 선택 (최대 3개)</SectionTitle>

      <CategoryGrid>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            isSelected={formData.categories.includes(category.id)}
          >
            <input
              type="checkbox"
              checked={formData.categories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              disabled={
                !formData.categories.includes(category.id) &&
                formData.categories.length >= 3
              }
            />
            <span>{category.name}</span>
          </CategoryItem>
        ))}
      </CategoryGrid>
    </FormSection>
  );
};

export default CategorySection;
