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
  border-bottom: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              ${(props) => props.theme.gradients.primary} border-box;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  margin-top: 10px;
`;

const CategoryItem = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid
    ${(props) =>
      props.isSelected
        ? 'transparent'
        : props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.isSelected 
      ? `linear-gradient(white, white) padding-box, ${props.theme.gradients.primary} border-box`
      : 'white'};

  &:hover {
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
                ${(props) => props.theme.gradients.primary} border-box;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
  }

  .category-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .subcategories {
    font-size: 0.8rem;
    color: ${(props) => props.theme.colors.gray[600]};
    margin-left: 24px;
    line-height: 1.4;
  }
`;

const SubcategoryItem = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.isSelected 
      ? props.theme.colors.primary[50]
      : 'transparent'};
  border: 1px solid ${(props) =>
    props.isSelected 
      ? props.theme.colors.primary[200]
      : 'transparent'};

  &:hover {
    background: ${(props) => props.theme.colors.primary[50]};
    border: 1px solid ${(props) => props.theme.colors.primary[200]};
  }

  input[type="checkbox"] {
    width: 14px;
    height: 14px;
    margin: 0;
  }

  span {
    font-size: 0.8rem;
    color: ${(props) => props.theme.colors.dark};
  }
`;

const CategorySection = ({ formData, handleCategoryChange, handleSubcategoryChange, categories }) => {
  return (
    <FormSection>
      <SectionTitle>카테고리 선택 (1개) 및 세부 분야 선택 (최대 5개)</SectionTitle>

      <CategoryGrid>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            isSelected={formData.categories.includes(category.id)}
          >
            <div className="category-name">
              <input
                type="checkbox"
                checked={formData.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              <span>{category.name}</span>
            </div>
            {category.subcategories && formData.categories.includes(category.id) && (
              <div className="subcategories">
                <div style={{ marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#6B7280' }}>
                  세부 분야 선택: ({formData.subcategories.length}/5)
                </div>
                {category.subcategories.map((subcategory, index) => {
                  const subcategoryKey = `${category.id}:${subcategory}`;
                  const isSelected = formData.subcategories.includes(subcategoryKey);
                  
                  return (
                    <SubcategoryItem
                      key={index}
                      isSelected={isSelected}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSubcategoryChange(category.id, subcategory)}
                        disabled={
                          !isSelected && formData.subcategories.length >= 5
                        }
                      />
                      <span>{subcategory}</span>
                    </SubcategoryItem>
                  );
                })}
              </div>
            )}
          </CategoryItem>
        ))}
      </CategoryGrid>
    </FormSection>
  );
};

export default CategorySection;
