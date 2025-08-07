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

const PricingToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  label {
    font-size: 0.9rem !important;
    margin-bottom: 0 !important;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;

const BasicInfoSection = ({ formData, handleInputChange }) => {
  return (
    <FormSection>
      <SectionTitle>기본 정보</SectionTitle>

      <FormGroup>
        <label>서비스/제품명 *</label>
        <input
          type="text"
          name="serviceName"
          placeholder="고객에게 보여질 서비스명을 입력하세요"
          value={formData.serviceName}
          onChange={handleInputChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>업체 홈페이지</label>
        <input
          type="url"
          name="companyWebsite"
          placeholder="https://example.com"
          value={formData.companyWebsite}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup>
        <PricingToggle>
          <input
            type="checkbox"
            name="isPricingOptional"
            checked={formData.isPricingOptional}
            onChange={handleInputChange}
          />
          <label>가격 정보 제공 안함</label>
        </PricingToggle>

        {!formData.isPricingOptional && (
          <>
            <label>가격 정보</label>
            <input
              type="text"
              name="price"
              placeholder="예: 150,000원/박, 문의, 협의 등"
              value={formData.price}
              onChange={handleInputChange}
            />
          </>
        )}
      </FormGroup>

      <FormGroup>
        <label>서비스 가능 지역 *</label>
        <input
          type="text"
          name="serviceRegion"
          placeholder="예: 서울 전체, 제주도, 부산 해운대구 등"
          value={formData.serviceRegion}
          onChange={handleInputChange}
          required
        />
      </FormGroup>
    </FormSection>
  );
};

export default BasicInfoSection;
