import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signUp } from "../firebase/auth";
import { uploadBusinessCertificate } from "../firebase/storage";

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.gray[50]};
`;

const SignupCard = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
  width: 100%;
  max-width: 800px;
`;

const SignupTitle = styled.h1`
  text-align: center;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.dark};
  font-size: 2rem;
`;

const SignupSubtitle = styled.p`
  text-align: center;
  margin-bottom: 40px;
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 1rem;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const SectionTitle = styled.h3`
  color: ${(props) => props.theme.colors.dark};
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
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
      border-color: ${(props) => props.theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:hover::after {
    border-color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const VerifyButton = styled.button`
  padding: 14px 20px;
  background-color: ${(props) => props.theme.colors.secondary || "#6B7280"};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background-color 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.secondaryDark || "#4B5563"};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
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

const VerificationCodeGroup = styled.div`
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

const SignupButton = styled.button`
  padding: 16px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const SignupFooter = styled.div`
  text-align: center;
  margin-top: 30px;

  a {
    color: ${(props) => props.theme.colors.primary};
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
        ? props.theme.colors.primary
        : props.theme.colors.gray[300]};
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
      ? props.theme.colors.primary
      : props.theme.colors.gray[500]};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) =>
      props.disabled
        ? props.theme.colors.gray[300]
        : props.theme.colors.primary};
    background-color: ${(props) =>
      props.disabled
        ? props.theme.colors.gray[100]
        : "rgba(59, 130, 246, 0.05)"};
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
  background-color: ${(props) => props.theme.colors.primary};

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${(props) => props.theme.colors.white};
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  /* transition: background-color 0.2s ease; */

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
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
    businessCertificate: null, // 파일 추가

    // 담당자 정보
    managerName: "",
    phoneNumber: "",
    verificationCode: "",

    // 계정 정보
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [verificationStatus, setVerificationStatus] = useState({
    businessVerified: false,
    phoneVerified: false,
    codeSent: false,
    fileUploaded: false,
    attachLater: false, // 나중에 첨부하기 상태 추가
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handlePhoneVerification = () => {
    // 휴대폰 인증번호 발송 로직
    console.log("인증번호 발송:", formData.phoneNumber);
    setVerificationStatus((prev) => ({ ...prev, codeSent: true }));
  };

  const handleCodeVerification = () => {
    // 인증번호 확인 로직
    console.log("인증번호 확인:", formData.verificationCode);
    setVerificationStatus((prev) => ({ ...prev, phoneVerified: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
              <input
                type="text"
                name="businessNumber"
                placeholder="사업자 등록번호를 입력하세요 (예: 123-45-67890)"
                value={formData.businessNumber}
                onChange={handleInputChange}
                required
              />
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
                {/* {verificationStatus.attachLater && (
                  <StatusMessage isSuccess={true}>
                    ✓ 나중에 첨부하기로 설정되었습니다.
                  </StatusMessage>
                )} */}
                {!verificationStatus.attachLater &&
                  verificationStatus.fileUploaded && (
                    <StatusMessage isSuccess={true}>
                      ✓ 파일이 업로드되었습니다.
                    </StatusMessage>
                  )}
                {verificationStatus.businessVerified && (
                  <StatusMessage isSuccess={true}>
                    ✓ 기업인증이 완료되었습니다.
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
              <input
                type="text"
                name="companyAddress"
                placeholder="회사 주소를 입력하세요"
                value={formData.companyAddress}
                onChange={handleInputChange}
                required
              />
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
                    <option value="hotel">호텔/리조트</option>
                    <option value="pension">펜션/민박</option>
                    <option value="guesthouse">게스트하우스</option>
                    <option value="camping">캠핑/글램핑</option>
                    <option value="motel">모텔</option>
                    <option value="other">기타</option>
                  </select>
                </SelectWrapper>
              </FormGroup>
            </FormRow>
          </div>

          {/* 담당자 정보 섹션 */}
          <div>
            <SectionTitle>담당자 정보</SectionTitle>

            <FormGroup>
              <label>담당자명 *</label>
              <input
                type="text"
                name="managerName"
                placeholder="담당자명을 입력하세요"
                value={formData.managerName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>휴대폰 본인인증 *</label>
              <PhoneVerificationGroup>
                <PhoneInputGroup>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="휴대폰 번호를 입력하세요 (예: 010-1234-5678)"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <VerifyButton
                    type="button"
                    onClick={handlePhoneVerification}
                    disabled={!formData.phoneNumber}
                  >
                    인증번호 발송
                  </VerifyButton>
                </PhoneInputGroup>

                {verificationStatus.codeSent && (
                  <VerificationCodeGroup>
                    <input
                      type="text"
                      name="verificationCode"
                      placeholder="인증번호 6자리를 입력하세요"
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      maxLength="6"
                    />
                    <VerifyButton
                      type="button"
                      onClick={handleCodeVerification}
                      disabled={!formData.verificationCode}
                    >
                      인증확인
                    </VerifyButton>
                  </VerificationCodeGroup>
                )}

                {verificationStatus.phoneVerified && (
                  <StatusMessage isSuccess={true}>
                    ✓ 휴대폰 본인인증이 완료되었습니다.
                  </StatusMessage>
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
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              (!verificationStatus.fileUploaded &&
                !verificationStatus.attachLater)
            }
          >
            {isSubmitting ? "회원가입 처리 중..." : "사업자 회원가입"}
          </SignupButton>
        </SignupForm>

        <SignupFooter>
          <p>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </SignupFooter>
      </SignupCard>
    </SignupContainer>
  );
};

export default SignupPage;
