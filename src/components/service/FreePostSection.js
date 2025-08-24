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
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.1);
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

const FreePostSection = ({ formData, handleInputChange }) => {
  return (
    <FormSection>
      <SectionTitle>무료 서비스 종료 시 게시글</SectionTitle>

      <FormGroup>
        <label>유료 서비스 종료 후 표시될 내용</label>
        <textarea
          name="freePostContent"
          placeholder="유료 서비스가 종료된 후에도 고객에게 보여줄 기본 정보를 입력하세요"
          value={formData.freePostContent}
          onChange={handleInputChange}
        />
      </FormGroup>
    </FormSection>
  );
};

export default FreePostSection;
