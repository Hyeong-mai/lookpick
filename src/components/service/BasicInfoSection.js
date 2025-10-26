import React, { useEffect } from "react";
import styled from "styled-components";

/* eslint-disable no-unused-vars */
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
    
    @media (max-width: 768px) {
      padding: 14px;
      font-size: 16px;
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

const PricingOptionsContainer = styled.div`
  margin-top: 15px;
  
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const PricingOptionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 12px;
    padding: 12px;
  }
`;

const OptionNameInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 14px;

  &:focus {
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
                ${(props) => props.theme.gradients.primary} border-box;
    outline: none;
    box-shadow: 0 0 0 2px rgba(115, 102, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }
`;

const OptionPriceInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 14px;

  &:focus {
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
                ${(props) => props.theme.gradients.primary} border-box;
    outline: none;
    box-shadow: 0 0 0 2px rgba(115, 102, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }
`;

const RemoveButton = styled.button`
  padding: 10px;
  background-color: ${(props) => props.theme.colors.danger || "#EF4444"};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover {
    background-color: ${(props) => props.theme.colors.danger || "#DC2626"};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
    min-width: 48px;
    align-self: flex-start;
  }
`;

const AddOptionButton = styled.button`
  padding: 12px 20px;
  background: ${(props) => props.disabled ? props.theme.colors.gray[300] : props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    transform: ${(props) => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${(props) => props.disabled ? 'none' : '0 4px 15px rgba(115, 102, 255, 0.3)'};
  }
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 16px;
    margin-top: 12px;
    width: 100%;
  }
`;

const OptionCountInfo = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.colors.gray[600]};
  margin-bottom: 10px;
  text-align: right;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
    text-align: left;
  }
`;

const AddressSearchContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

const AddressInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 16px;
  transition: border-color 0.2s ease;
  background-color: ${(props) => props.theme.colors.gray[50]};
  color: ${(props) => props.theme.colors.gray[600]};
  cursor: not-allowed;

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    background-color: ${(props) => props.theme.colors.gray[50]};
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.gray[400]};
  }
`;

const AddressSearchButton = styled.button`
  padding: 12px 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(115, 102, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 20px;
    font-size: 16px;
  }
`;

const AddressPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: none;
`;

const AddressPopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  height: 80%;
  max-height: 600px;
  background: white;

  box-shadow: ${(props) => props.theme.shadows.xl};
  z-index: 10000;
  display: none;
`;

const AddressPopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
`;

const AddressPopupTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};
`;

const AddressPopupCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[500]};
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
    color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const AddressPopupContent = styled.div`
  height: calc(100% - 80px);
  overflow: hidden;
`;

const LogoUploadContainer = styled.div`
  margin-top: 15px;
`;

const LogoUploadArea = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => props.hasFile ? props.theme.colors.gray[50] : 'white'};

  &.has-file {
    border-style: solid;
    border-color: ${(props) => props.theme.colors.primary};
    background: white;
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.gray[50]};
  }

  input[type="file"] {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const LogoPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  // padding: 12px;
  // background-color: ${(props) => props.theme.colors.gray[50]};
  // border-radius: ${(props) => props.theme.borderRadius.md};
  // border: 1px solid ${(props) => props.theme.colors.gray[200]};
  text-align: center;
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  border: 2px solid ${(props) => props.theme.colors.gray[200]};
`;

const LogoInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const LogoFileName = styled.div`
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: 500;
  color: ${(props) => props.theme.colors.gray[900]};
`;

const LogoFileSize = styled.div`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[600]};
`;

const LogoActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const LogoActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.primary {
    background: ${(props) => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${(props) => props.theme.colors.primaryDark};
    }
  }

  &.secondary {
    background: ${(props) => props.theme.colors.gray[100]};
    color: ${(props) => props.theme.colors.gray[700]};

    &:hover {
      background: ${(props) => props.theme.colors.gray[200]};
    }
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: ${(props) => props.theme.fontSize.base};
    min-width: 80px;
  }
`;

const BasicInfoSection = ({ 
  formData, 
  handleInputChange, 
  handleUrlBlur,
  handleAddPricingOption,
  handleRemovePricingOption,
  handlePricingOptionChange,
  handleCompanyLogoUpload,
  handleCompanyLogoRemove
}) => {
  // 가격 입력 시 콤마 자동 추가 함수 (숫자만 허용)
  const handlePriceChange = (index, value) => {
    // 숫자만 허용 (콤마 제거 후 숫자만 추출)
    const numbersOnly = value.replace(/[^\d]/g, "");

    // 빈 문자열이면 그대로 반환
    if (numbersOnly === "") {
      handlePricingOptionChange(index, "price", "");
      return;
    }

    // 숫자에 콤마 추가
    const formattedValue = numbersOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    handlePricingOptionChange(index, "price", formattedValue);
  };

  // 카카오 주소 검색 API 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 주소 검색 함수
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        width: '100%',
        height: '100%',
        maxSuggestItems: 5,
        showMoreHName: true,
        hideMapBtn: false,
        hideEngBtn: false,
        alwaysShowEngAddr: false,
        submitMode: false,
        useBanner: false,
        theme: {
          bgColor: '#FFFFFF',
          searchBgColor: '#F8F9FA',
          contentBgColor: '#FFFFFF',
          pageBgColor: '#FFFFFF',
          textColor: '#333333',
          queryTextColor: '#222222',
          postcodeTextColor: '#FA4256',
          emphTextColor: '#008BD3',
          outlineColor: '#E0E0E0'
        },
        oncomplete: function(data) {
          // 주소 정보를 조합
          let fullAddr = '';
          let extraAddr = '';

          // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            fullAddr = data.roadAddress;
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
            fullAddr = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
          if(data.userSelectedType === 'R'){
            //법정동명이 있을 경우 추가한다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
              extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraAddr !== ''){
              extraAddr = ' (' + extraAddr + ')';
            }
            // 조합된 참고항목을 해당 필드에 넣는다.
            fullAddr += extraAddr;
          }

          // 선택된 주소를 폼에 입력
          handleInputChange({
            target: {
              name: 'serviceRegion',
              value: fullAddr
            }
          });

          // 팝업 닫기
          handleCloseAddressPopup();
        }
      }).embed(document.getElementById('address-search-content'));
      
      // 팝업 표시
      document.getElementById('address-popup').style.display = 'block';
      document.getElementById('address-overlay').style.display = 'block';
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 팝업 닫기 함수
  const handleCloseAddressPopup = () => {
    document.getElementById('address-popup').style.display = 'none';
    document.getElementById('address-overlay').style.display = 'none';
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
        <label>서비스 담당자 정보 *</label>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "15px", 
          marginBottom: "15px" 
        }}>
          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "5px", display: "block" }}>
              담당자 이름
            </label>
            <input
              type="text"
              name="contactName"
              placeholder="담당자 이름을 입력하세요"
              value={formData.contactName || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "5px", display: "block" }}>
              직급
            </label>
            <input
              type="text"
              name="contactPosition"
              placeholder="예: 대표, 팀장, 과장"
              value={formData.contactPosition || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "15px" 
        }}>
          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "5px", display: "block" }}>
              전화번호
            </label>
            <input
              type="tel"
              name="contactPhone"
              placeholder="예: 010-1234-5678"
              value={formData.contactPhone || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "5px", display: "block" }}>
              이메일
            </label>
            <input
              type="email"
              name="contactEmail"
              placeholder="예: contact@company.com"
              value={formData.contactEmail || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </FormGroup>
      <FormGroup>
        <label>기업 소재지 *</label>
        <AddressSearchContainer>
          <AddressInput
            type="text"
            name="serviceRegion"
            placeholder="주소 검색 버튼을 클릭하여 주소를 선택하세요"
            value={formData.serviceRegion}
            onChange={handleInputChange}
            required
            readOnly
          />
          <AddressSearchButton
            type="button"
            onClick={handleAddressSearch}
          >
            주소 검색
          </AddressSearchButton>
        </AddressSearchContainer>
      </FormGroup>

      <FormGroup>
        <label>회사 로고</label>
        <LogoUploadContainer>
          <LogoUploadArea 
            hasFile={!!(formData.companyLogoFile || formData.companyLogo)}
            className={(formData.companyLogoFile || formData.companyLogo) ? 'has-file' : ''}
            onClick={() => document.getElementById('company-logo-input').click()}
          >
            <input
              id="company-logo-input"
              type="file"
              accept="image/*"
              onChange={handleCompanyLogoUpload}
            />
            {(formData.companyLogoFile || formData.companyLogo) ? (
              <div style={{ 
                padding: '16px', 
                background: '#f8fafc', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                    회사 로고
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    {formData.companyLogoFile ? 
                      `${formData.companyLogoFile.name} (${(formData.companyLogoFile.size / 1024).toFixed(1)} KB)` :
                      '기존 로고 파일'
                    }
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('company-logo-input').click();
                    }}
                  >
                    변경
                  </button>
                  <button 
                    type="button"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompanyLogoRemove();
                    }}
                  >
                    제거
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>📷</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                  회사 로고 업로드
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                  PNG, JPG, GIF 파일만 가능 (최대 2MB)
                </div>
              </div>
            )}
          </LogoUploadArea>
        </LogoUploadContainer>
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
          <PricingOptionsContainer>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <label style={{ fontWeight: "600" }}>
                가격 옵션
              </label>
              <OptionCountInfo>
                {formData.pricingOptions.length}/5 (최소 1개, 최대 5개)
              </OptionCountInfo>
            </div>
            {formData.pricingOptions.map((option, index) => (
              <PricingOptionItem key={index}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                  gap: "15px", 
                  alignItems: "end" 
                }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#6B7280", marginBottom: "5px", display: "block" }}>
                      옵션명
                    </label>
                    <OptionNameInput
                      type="text"
                      placeholder="예: 기본 패키지, 프리미엄 패키지"
                      value={option.name}
                      onChange={(e) => handlePricingOptionChange(index, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#6B7280", marginBottom: "5px", display: "block" }}>
                      가격 (원) - 부가세 포함
                    </label>
                    <OptionPriceInput
                      type="text"
                      placeholder="예: 150000"
                      value={option.price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemovePricingOption(index)}
                    disabled={formData.pricingOptions.length === 1}
                    title={formData.pricingOptions.length === 1 ? "최소 1개의 옵션이 필요합니다" : "옵션 제거"}
                  >
                    ✕
                  </RemoveButton>
                </div>
              </PricingOptionItem>
            ))}
            <AddOptionButton
              type="button"
              onClick={handleAddPricingOption}
              disabled={formData.pricingOptions.length >= 5}
              title={formData.pricingOptions.length >= 5 ? "최대 5개의 옵션만 추가할 수 있습니다" : "옵션 추가"}
            >
              + 옵션 추가
            </AddOptionButton>
          </PricingOptionsContainer>
        )}
      </FormGroup>

      {/* 주소 검색 팝업 */}
      <AddressPopupOverlay id="address-overlay" onClick={handleCloseAddressPopup} />
      <AddressPopupContainer id="address-popup">
        <AddressPopupHeader>
          <AddressPopupTitle>주소 검색</AddressPopupTitle>
          <AddressPopupCloseButton onClick={handleCloseAddressPopup}>
            ✕
          </AddressPopupCloseButton>
        </AddressPopupHeader>
        <AddressPopupContent>
          <div id="address-search-content" style={{ width: '100%', height: '100%' }}></div>
        </AddressPopupContent>
      </AddressPopupContainer>
    </FormSection>
  );
};

export default BasicInfoSection;
