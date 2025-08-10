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

const BasicInfoSection = ({ formData, handleInputChange, handleUrlBlur }) => {
  // 가격 입력 시 콤마 자동 추가 함수 (숫자만 허용)
  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    // 숫자만 허용 (콤마 제거 후 숫자만 추출)
    const numbersOnly = value.replace(/[^\d]/g, "");

    // 빈 문자열이면 그대로 반환
    if (numbersOnly === "") {
      handleInputChange({
        target: {
          name,
          value: "",
        },
      });
      return;
    }

    // 숫자에 콤마 추가
    const formattedValue = numbersOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 기존 handleInputChange 호출
    handleInputChange({
      target: {
        name,
        value: formattedValue,
      },
    });
  };

  return (
    <FormSection>
      <SectionTitle>기본 정보</SectionTitle>

      <FormGroup>
        <label>서비스명 *</label>
        <input
          type="text"
          name="serviceName"
          placeholder="제공할 서비스의 이름을 입력하세요"
          value={formData.serviceName}
          onChange={handleInputChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>업체 웹사이트</label>
        <input
          type="text"
          name="companyWebsite"
          placeholder="업체 홈페이지 주소"
          value={formData.companyWebsite}
          onChange={handleInputChange}
          onBlur={handleUrlBlur}
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
              placeholder="예: 150000 (숫자만 입력)"
              value={formData.price}
              onChange={handlePriceChange}
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
