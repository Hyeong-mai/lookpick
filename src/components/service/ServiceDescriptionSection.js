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

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 12px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${(props) => props.theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: ${(props) => props.theme.colors.gray[400]};
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 4px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 120px;
`;

const ServiceDescriptionSection = ({
  formData,
  handleInputChange,
  tagInput,
  setTagInput,
  handleTagAdd,
  handleTagRemove,
}) => {
  return (
    <FormSection>
      <SectionTitle>서비스 설명</SectionTitle>

      <FormGroup>
        <label>상세 설명 *</label>
        <textarea
          name="serviceDescription"
          placeholder="고객에게 어필할 수 있는 서비스의 특징, 장점, 제공 내용 등을 자세히 설명해주세요"
          value={formData.serviceDescription}
          onChange={handleInputChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>태그 (최대 10개)</label>
        <TagInput
          type="text"
          placeholder="태그 입력 후 Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleTagAdd}
        />
        <TagContainer>
          {formData.tags.map((tag, index) => (
            <Tag key={index}>
              #{tag}
              <button type="button" onClick={() => handleTagRemove(tag)}>
                ×
              </button>
            </Tag>
          ))}
        </TagContainer>
      </FormGroup>
    </FormSection>
  );
};

export default ServiceDescriptionSection;
