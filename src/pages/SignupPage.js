import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { signUp } from "../firebase/auth";
import { uploadBusinessCertificate } from "../firebase/storage";
import {
  validateBusinessNumber,
  validateBusiness,
} from "../services/businessValidation";
import MokStdRequest from "../mok_react_index";

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  // background-color: ${(props) => props.theme.colors.gray[50]};

  @media (max-width: 768px) {
    padding: 10px;
    align-items: flex-start;
    padding-top: 20px;
  }
`;

const SignupCard = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
  width: 100%;
  max-width: 800px;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 10px;
    border-radius: ${(props) => props.theme.borderRadius.md};
  }
`;

const SignupTitle = styled.h1`
  text-align: center;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.dark};
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
`;

const SignupSubtitle = styled.p`
  text-align: center;
  margin-bottom: 40px;
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const SectionTitle = styled.h3`
  color: ${(props) => props.theme.colors.dark};
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              ${(props) => props.theme.gradients.primary} border-box;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 12px;
    padding-bottom: 6px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    display: block;
    margin: 8px 0px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    font-size: 0.9rem;
  }

  input,
  select {
    width: 100%;
    padding: 14px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    transition: all 0.3s ease;

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
      padding: 12px;
      font-size: 16px; /* 모바일에서 줌 방지 */
    }
  }

  select {
    cursor: pointer;
  }
`;

const SelectWrapper = styled.div`
  position: relative;

  select {
    width: 100%;
    padding: 14px;
    padding-right: 45px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: white;
    transition: border-color 0.2s ease;

    &:focus {
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.1);
    }
  }

  &::after {
    content: "";
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 6px;
    height: 6px;
    border-right: 2px solid ${(props) => props.theme.colors.gray[500]};
    border-bottom: 2px solid ${(props) => props.theme.colors.gray[500]};
    pointer-events: none;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  select:focus + * {
    border-color: transparent;
  }

  &:hover::after {
    border-color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const VerifyButton = styled.button`
  /* width: 100%; */
  padding: 14px 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.85rem;
    min-width: 80px;
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  color: white;
  padding: 16px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
  box-shadow: ${(props) => props.theme.shadows.lg};
  min-width: 320px;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  }

  ${TooltipContainer}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  white-space: normal;
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  /* margin: 8px 0px; */
  color: white;
`;

const DocumentComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const DocumentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) =>
    props.isCorrect ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  border: 1px solid ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 50px;
  background-color: ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const DocumentLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  color: ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
`;

const StatusIcon = styled.div`
  font-size: 16px;
  color: ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
`;

const PhoneVerificationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PhoneInputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;

  input {
    flex: 1;
  }
`;

const StatusMessage = styled.div`
  font-size: 0.8rem;
  margin-top: 5px;
  color: ${(props) =>
    props.isSuccess
      ? props.theme.colors.success || "#10B981"
      : props.theme.colors.danger || "#EF4444"};
`;

// 카카오 주소 검색 관련 스타일드 컴포넌트
const AddressSearchContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
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

  @media (max-width: 768px) {
    width: 95%;
    height: 85%;
    max-height: 500px;
  }
`;

const AddressPopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const AddressPopupTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
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

  @media (max-width: 768px) {
    font-size: 20px;
    padding: 8px;
  }
`;

const AddressPopupContent = styled.div`
  height: calc(100% - 80px);
  overflow: hidden;
`;

const SignupButton = styled.button`
  padding: 16px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
    margin-top: 15px;
  }
`;

const SignupFooter = styled.div`
  text-align: center;
  margin-top: 30px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  a {
    background: ${(props) => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FileUploadGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileUploadContainer = styled.div`
  display: flex;
  /* gap: 10px; */
  align-items: end;
`;

const FileInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const HiddenFileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputDisplay = styled.div`
  width: 100%;
  padding: 10px;
  border: 2px dashed
    ${(props) =>
      props.hasFile
        ? 'transparent'
        : props.theme.colors.gray[300]};
  background: ${(props) =>
    props.hasFile
      ? `linear-gradient(white, white) padding-box, ${props.theme.gradients.primary} border-box`
      : 'transparent'};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.gray[100]
      : props.hasFile
      ? "rgba(59, 130, 246, 0.05)"
      : props.theme.colors.gray[50]};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.gray[400]
      : props.hasFile
      ? 'transparent'
      : props.theme.colors.gray[500]};
  background: ${(props) =>
    props.hasFile && !props.disabled
      ? props.theme.gradients.primary
      : 'transparent'};
  -webkit-background-clip: ${(props) => props.hasFile && !props.disabled ? 'text' : 'initial'};
  -webkit-text-fill-color: ${(props) => props.hasFile && !props.disabled ? 'transparent' : 'initial'};
  background-clip: ${(props) => props.hasFile && !props.disabled ? 'text' : 'initial'};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) =>
      props.disabled
        ? props.theme.colors.gray[300]
        : 'transparent'};
    background: ${(props) =>
      props.disabled
        ? props.theme.colors.gray[100]
        : `linear-gradient(white, white) padding-box, ${props.theme.gradients.primary} border-box`};
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
`;

const LabelWithHelp = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0px;
`;

const LabelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LabelRight = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  gap: 8px;
  color: ${(props) => props.theme.colors.gray[600]};
  cursor: pointer;
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    cursor: pointer;
  }
`;

const LabelText = styled.label`
  line-height: 1.5;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};
  font-size: 0.9rem;
`;

const HelpIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) => props.theme.gradients.primary};

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${(props) => props.theme.colors.white};
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(115, 102, 255, 0.3);
  }
`;

const HelpTooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  color: white;
  padding: 12px 16px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1001;
  box-shadow: ${(props) => props.theme.shadows.lg};
  min-width: 320px;

  white-space: normal;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  }

  ${HelpIcon}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // 기업 정보
    businessNumber: "",
    companyName: "",
    representative: "",
    companyAddress: "",
    establishmentDate: "",
    businessType: "",
    businessField: "",
    businessCertificate: null,

    // 담당자 정보
    managerName: "",
    phoneNumber: "",

    // 계정 정보
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [verificationStatus, setVerificationStatus] = useState({
    businessVerified: false,
    phoneVerified: false,
    fileUploaded: false,
    attachLater: false,
    businessValidated: false,
  });

  // 사업자진위확인 관련 상태 추가
  const [businessValidation, setBusinessValidation] = useState({
    isVerifying: false,
    result: null,
    error: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 카카오 주소 검색 스크립트 로드
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
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
          setFormData(prev => ({
            ...prev,
            companyAddress: fullAddr
          }));

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

  // 사업자진위확인 API 호출 함수
  const handleBusinessValidation = async () => {
    if (!formData.businessNumber) {
      alert("사업자 등록번호를 입력해주세요.");
      return;
    }

    setBusinessValidation({
      isVerifying: true,
      result: null,
      error: null,
    });

    try {
      // Mock API 호출 (개발/테스트용)
      // 실제 환경에서는 validateBusiness 함수를 사용
      const data = await validateBusiness(formData.businessNumber);
      console.log("data", data);
      if (data.success) {
        // 국세청에 등록되지 않은 사업자등록번호 체크
        if (
          data.data &&
          data.data.taxType === "국세청에 등록되지 않은 사업자등록번호입니다."
        ) {
          setBusinessValidation({
            isVerifying: false,
            result: null,
            error: "국세청에 등록되지 않은 사업자등록번호입니다.",
          });
          return;
        }

        setBusinessValidation({
          isVerifying: false,
          result: data.data,
          error: null,
        });

        setVerificationStatus((prev) => ({
          ...prev,
          businessValidated: true,
        }));

        // API에서 받은 정보로 폼 데이터 자동 채우기 (선택사항)
        if (data.data.companyName && !formData.companyName) {
          setFormData((prev) => ({
            ...prev,
            companyName: data.data.companyName,
          }));
        }
      } else {
        setBusinessValidation({
          isVerifying: false,
          result: null,
          error: data.message || "사업자 정보를 확인할 수 없습니다.",
        });
      }
    } catch (error) {
      console.error("사업자진위확인 API 오류:", error);
      setBusinessValidation({
        isVerifying: false,
        result: null,
        error:
          "사업자진위확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 사업자 등록번호가 변경되면 인증 결과 초기화
    if (name === "businessNumber") {
      setBusinessValidation({
        isVerifying: false,
        result: null,
        error: null,
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        businessCertificate: file,
      }));
      setVerificationStatus((prev) => ({ ...prev, fileUploaded: true }));
      console.log("파일 업로드:", file.name);
    }
  };

  const handleAttachLaterChange = (e) => {
    const isChecked = e.target.checked;
    setVerificationStatus((prev) => ({
      ...prev,
      attachLater: isChecked,
      fileUploaded: isChecked, // 나중에 첨부하기 체크 시 파일 업로드된 것으로 처리
    }));

    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        businessCertificate: null, // 파일 초기화
      }));
    }
  };

  // const handleBusinessVerification = () => {
  //   if (!formData.businessCertificate) {
  //     alert("사업자등록증명원을 먼저 첨부해주세요.");
  //     return;
  //   }
  //   // 사업자 등록번호 및 파일 검증 로직
  //   console.log("사업자 인증:", {
  //     businessNumber: formData.businessNumber,
  //     file: formData.businessCertificate,
  //   });
  //   setVerificationStatus((prev) => ({ ...prev, businessVerified: true }));
  // };

  // 휴대폰 본인인증 성공 콜백
  const handleAuthSuccess = (authData) => {
    console.log("본인인증 성공:", authData);
    
    // 인증된 정보로 폼 데이터 자동 채우기
    if (authData && authData.name) {
      setFormData((prev) => ({
        ...prev,
        managerName: authData.name,
      }));
    }
    
    // 휴대폰 번호도 인증된 번호로 설정 (인증 과정에서 사용된 번호)
    if (formData.phoneNumber) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: formData.phoneNumber, // 이미 입력된 번호 유지
      }));
    }
    
    setVerificationStatus((prev) => ({
      ...prev,
      phoneVerified: true,
    }));
    
    alert("본인인증이 완료되었습니다.");
  };

  // 휴대폰 본인인증 실패 콜백
  const handleAuthError = (error) => {
    console.error("본인인증 실패:", error);
    alert("본인인증에 실패했습니다. 다시 시도해주세요.");
  };

  // 인증번호 확인 함수 제거 (더 이상 사용하지 않음)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 사업자 인증 완료 여부 검증
    if (!businessValidation.result) {
      alert("사업자 인증을 먼저 완료해주세요.");
      return;
    }

    // 휴대폰 본인인증 완료 여부 검증
    if (!verificationStatus.phoneVerified) {
      alert("휴대폰 본인인증을 먼저 완료해주세요.");
      return;
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 강도 검증 (선택사항)
    if (formData.password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Firebase 회원가입 시작...");

      // 사업자등록증 파일 업로드 (나중에 첨부하기가 아닌 경우)
      let businessCertificateUrl = null;
      if (formData.businessCertificate && !verificationStatus.attachLater) {
        console.log("사업자등록증 업로드 중...");
        const uploadResult = await uploadBusinessCertificate(
          formData.businessCertificate,
          `temp_${Date.now()}` // 임시 사용자 ID
        );
        businessCertificateUrl = uploadResult.url;
        console.log("파일 업로드 완료:", uploadResult);
      }

      // Firebase 회원가입을 위한 사용자 정보 구성
      const userInfo = {
        name: formData.managerName,
        email: formData.email,
        phone: formData.phoneNumber,
        companyName: formData.companyName,
        businessNumber: formData.businessNumber,
        representative: formData.representative,
        companyAddress: formData.companyAddress,
        establishmentDate: formData.establishmentDate,
        businessType: formData.businessType,
        businessField: formData.businessField,
        managerName: formData.managerName,
        businessCertificateUrl: businessCertificateUrl,
        isDocumentPending: verificationStatus.attachLater,
        phoneVerified: verificationStatus.phoneVerified,
        businessValidated: !!businessValidation.result,
        businessValidationResult: businessValidation.result,
      };

      // Firebase 회원가입 실행
      console.log("Firebase 사용자 생성 중...");
      const user = await signUp(formData.email, formData.password, userInfo);

      console.log("회원가입 성공:", user);
      alert("회원가입이 성공적으로 완료되었습니다!");

      // 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);

      // Firebase 에러 메시지 한국어 변환
      let errorMessage = "회원가입 중 오류가 발생했습니다.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "이미 사용 중인 이메일 주소입니다.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "유효하지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "이메일/비밀번호 회원가입이 비활성화되어 있습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <script src="https://cert.ez-iok.com/stdauth/ds_auth_ptb/asset/js/ptb_ezauth_proc.js"></script>
      </Helmet>

      <SignupContainer>
        <SignupCard>
          <SignupTitle>사업자 회원가입</SignupTitle>
          <SignupSubtitle>
            LookPick 파트너로 등록하여 다양한 혜택을 누려보세요
          </SignupSubtitle>

          <SignupForm onSubmit={handleSubmit}>
            {/* 기업 정보 섹션 */}
            <div>
              <SectionTitle>기업 정보</SectionTitle>

              <FormGroup>
                <label>사업자 등록번호 *</label>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "end" }}
                >
                  <input
                    type="text"
                    name="businessNumber"
                    placeholder="사업자 등록번호를 입력하세요 (예: 123-45-67890)"
                    value={formData.businessNumber}
                    onChange={handleInputChange}
                    required
                    style={{ flex: 1 }}
                  />
                  <VerifyButton
                    type="button"
                    onClick={handleBusinessValidation}
                    disabled={
                      businessValidation.isVerifying ||
                      !formData.businessNumber ||
                      !validateBusinessNumber(formData.businessNumber)
                    }
                    style={{ minWidth: "100px" }}
                  >
                    {businessValidation.isVerifying ? "인증 중..." : "인증하기"}
                  </VerifyButton>
                </div>

                {/* 인증 결과 표시 */}
                {businessValidation.isVerifying && (
                  <StatusMessage style={{ marginTop: "8px" }}>
                    사업자 정보를 확인하고 있습니다...
                  </StatusMessage>
                )}

                {businessValidation.result && (
                  <StatusMessage isSuccess={true} style={{ marginTop: "8px" }}>
                    사업자 인증이 완료되었습니다.
                  </StatusMessage>
                )}

                {businessValidation.error && (
                  <StatusMessage style={{ marginTop: "8px" }}>
                    {businessValidation.error}
                  </StatusMessage>
                )}
              </FormGroup>

              <FormGroup>
                <LabelWithHelp>
                  <LabelLeft>
                    <LabelText>기업 인증 (사업자등록증) *</LabelText>
                  </LabelLeft>
                  <LabelRight>
                    <HelpIcon>
                      ?
                      <HelpTooltip>
                        <TooltipContent>
                          <TooltipTitle> 서류 제출 안내</TooltipTitle>

                          <div
                            style={{
                              fontSize: "0.75rem",
                              lineHeight: "1.5",
                              color: "#FED7D7",
                              marginBottom: "8px",
                            }}
                          >
                            <strong>나중에 첨부하기 선택 시:</strong>
                            <br />
                            • 서비스 출시 후 제품/서비스 노출 제한
                            <br />
                            • 예약 접수 및 결제 기능 비활성화
                            <br />• 파트너 인증 배지 미표시
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              lineHeight: "1.5",
                              color: "#D1FAE5",
                            }}
                          >
                            <strong>서류 제출 완료 시:</strong>
                            <br />
                            • 모든 서비스 기능 이용 가능
                            <br />• 우선 노출 및 인증 배지 제공
                          </div>
                        </TooltipContent>
                      </HelpTooltip>
                    </HelpIcon>
                    <LabelText>나중에 첨부하기</LabelText>
                    <input
                      type="checkbox"
                      checked={verificationStatus.attachLater}
                      onChange={handleAttachLaterChange}
                    />
                  </LabelRight>
                </LabelWithHelp>
                <FileUploadGroup>
                  <FileUploadContainer>
                    <FileInputWrapper>
                      <HiddenFileInput
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        disabled={verificationStatus.attachLater}
                      />
                      <FileInputDisplay
                        hasFile={!!formData.businessCertificate}
                        disabled={verificationStatus.attachLater}
                      >
                        <FileInfo>
                          {verificationStatus.attachLater
                            ? "나중에 첨부 예정"
                            : formData.businessCertificate
                            ? formData.businessCertificate.name
                            : "사업자등록증을 선택하세요 (PDF, JPG, PNG)"}
                        </FileInfo>
                      </FileInputDisplay>
                    </FileInputWrapper>
                    <TooltipContainer>
                      <Tooltip>
                        <TooltipContent>
                          <TooltipTitle>📋 필요 서류 안내</TooltipTitle>
                          <DocumentComparison>
                            <DocumentItem isCorrect={true}>
                              <DocumentIcon isCorrect={true}>📄</DocumentIcon>
                              <DocumentLabel isCorrect={true}>
                                사업자등록증명원
                              </DocumentLabel>
                              <StatusIcon isCorrect={true}>✅ 필요</StatusIcon>
                            </DocumentItem>
                            <DocumentItem isCorrect={false}>
                              <DocumentIcon isCorrect={false}>📋</DocumentIcon>
                              <DocumentLabel isCorrect={false}>
                                사업자등록증
                              </DocumentLabel>
                              <StatusIcon isCorrect={false}>❌ 불가</StatusIcon>
                            </DocumentItem>
                          </DocumentComparison>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              textAlign: "center",
                              marginTop: "4px",
                              color: "#D1D5DB",
                            }}
                          >
                            * 사업자등록증명원만 인증 가능합니다
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipContainer>
                  </FileUploadContainer>
                  {!verificationStatus.attachLater &&
                    verificationStatus.fileUploaded && (
                      <StatusMessage isSuccess={true}>
                        파일이 업로드되었습니다.
                      </StatusMessage>
                    )}
                  {verificationStatus.businessVerified && (
                    <StatusMessage isSuccess={true}>
                      기업인증이 완료되었습니다.
                    </StatusMessage>
                  )}
                </FileUploadGroup>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label>기업명 *</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="기업명을 입력하세요"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>대표자명 *</label>
                  <input
                    type="text"
                    name="representative"
                    placeholder="대표자명을 입력하세요"
                    value={formData.representative}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label>회사주소 *</label>
                <AddressSearchContainer>
                  <AddressInput
                    type="text"
                    name="companyAddress"
                    placeholder="주소 검색 버튼을 클릭하여 주소를 선택하세요"
                    value={formData.companyAddress}
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

              <FormRow>
                <FormGroup>
                  <label>기업 구분 *</label>
                  <SelectWrapper>
                    <select
                      name="businessField"
                      value={formData.businessField}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">기업 구분을 선택하세요</option>
                      <option value="large">대기업</option>
                      <option value="medium">중견기업</option>
                      <option value="small">중소기업</option>
                      <option value="startup">스타트업</option>
                      <option value="individual">개인사업자</option>
                    </select>
                  </SelectWrapper>
                </FormGroup>

                <FormGroup>
                  <label>기업 분야 *</label>
                  <SelectWrapper>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">기업 분야를 선택하세요</option>
                      <option value="software">개발 / 소프트웨어 / IT</option>
                      <option value="design">디자인 / 콘텐츠 / 마케팅</option>
                      <option value="logistics">물류 / 운송 / 창고</option>
                      <option value="manufacturing">제조 / 생산 / 가공</option>
                      <option value="infrastructure">설비 / 건설 / 유지보수</option>
                      <option value="education">교육 / 컨설팅 / 인증</option>
                      <option value="office">사무 / 문서 / 번역</option>
                      <option value="advertising">광고 / 프로모션 / 행사</option>
                      <option value="machinery">기계 / 장비 / 산업재</option>
                      <option value="lifestyle">생활 / 복지 / 기타 서비스</option>
                    </select>
                  </SelectWrapper>
                </FormGroup>
              </FormRow>

              {/* 사업자진위확인 섹션 삭제 */}
            </div>

            {/* 나머지 섹션들은 기존과 동일 */}
            {/* 담당자 정보 섹션 */}
            <div>
              <SectionTitle>담당자 정보</SectionTitle>

              <FormGroup>
                <label>담당자명 *</label>
                <input
                  type="text"
                  name="managerName"
                  placeholder="본인인증을 통해 자동으로 입력됩니다"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  required
                  disabled={true}
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#6B7280',
                    cursor: 'not-allowed'
                  }}
                />

              </FormGroup>

              <FormGroup>
                <label>전화번호 *</label>
                <PhoneVerificationGroup>
                  <PhoneInputGroup>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="본인인증을 통해 자동으로 입력됩니다"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                       disabled={true}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#6B7280',
                        cursor: 'not-allowed'
                      }}
                    />
                    <MokStdRequest
                      onAuthSuccess={handleAuthSuccess}
                      onAuthError={handleAuthError}
                      isVerified={verificationStatus.phoneVerified}
                      disabled={verificationStatus.phoneVerified}
                      userId={formData.email}
                      email={formData.email}
                    />
                  </PhoneInputGroup>

                  {verificationStatus.phoneVerified && (
                    <StatusMessage isSuccess={true}>
                      ✅ 휴대폰 본인인증이 완료되었습니다.
                    </StatusMessage>
                  )}

                  {/* 본인인증 안내 메시지 */}
                  {!verificationStatus.phoneVerified && (
                    <div style={{ 
                      fontSize: "0.8rem", 
                      color: "#6B7280", 
                      marginTop: "5px",
                      padding: "8px 12px",
                      backgroundColor: "#F3F4F6",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB"
                    }}>
                      📱 본인인증 버튼을 클릭하여 인증을 진행해주세요.
                    </div>
                  )}
                 
                </PhoneVerificationGroup>
              </FormGroup>
            </div>

            {/* 계정 정보 섹션 */}
            <div>
              <SectionTitle>계정 정보</SectionTitle>

              <FormRow>
                <FormGroup>
                  <label>이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>비밀번호 *</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label>비밀번호 확인 *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </div>

            <SignupButton
              type="submit"
              disabled={
                isSubmitting ||
                !formData.businessNumber ||
                !formData.companyName ||
                !formData.representative ||
                !formData.companyAddress ||
                !formData.businessField ||
                !formData.businessType ||
                !formData.managerName ||
                !verificationStatus.phoneVerified ||
                !businessValidation.result || // 사업자 인증 완료 조건 추가
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                (!verificationStatus.fileUploaded &&
                  !verificationStatus.attachLater)
              }
            >
              {isSubmitting
                ? "회원가입 처리 중..."
                : !businessValidation.result
                ? "사업자 인증을 먼저 완료해주세요"
                : "사업자 회원가입"}
            </SignupButton>

            {/* 사업자 인증 필수 안내 메시지 */}
            {!businessValidation.result && (
              <StatusMessage style={{ marginTop: "10px", textAlign: "center" }}>
                회원가입을 위해서는 사업자 인증이 필요합니다.
              </StatusMessage>
            )}
          </SignupForm>

          <SignupFooter>
            <p>
              이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </p>
          </SignupFooter>
        </SignupCard>

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
      </SignupContainer>
    </>
  );
};

export default SignupPage;
