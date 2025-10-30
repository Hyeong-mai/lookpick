import React, { useState } from "react";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { getCurrentUser } from "../../firebase/auth";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../../firebase/config";

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  border-bottom: 2px solid ${(props) => props.theme.colors.gray[200]};
  padding-bottom: 10px;
  color: ${(props) => props.theme.colors.dark};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    transition: all 0.3s ease;

    &:focus {
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(73, 126, 233, 0.1);
    }

    &:disabled {
      background-color: ${(props) => props.theme.colors.gray[100]};
      cursor: not-allowed;
    }
  }

  select {
    width: 100%;
    padding: 12px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    background-color: white;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:focus {
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(73, 126, 233, 0.1);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 12px 24px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.md};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const PasswordButton = styled.button`
  padding: 12px 24px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
    transform: translateY(-2px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.dark};
`;

const ModalFormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    transition: all 0.3s ease;

    &:focus {
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(73, 126, 233, 0.1);
    }
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: #000000;
    color: white;
    
    &:hover {
      background: #1a1a1a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    &:disabled {
      background: #d1d5db;
      cursor: not-allowed;
      transform: none;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const PasswordValidationBox = styled.div`
  margin-top: 10px;
  padding: 12px;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 10px;
    margin-top: 8px;
  }
`;

const ValidationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: ${(props) => props.isValid ? '#10B981' : '#6B7280'};
  margin-bottom: 6px;
  transition: all 0.2s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    gap: 6px;
    margin-bottom: 5px;
  }
`;

const ValidationIconSmall = styled.span`
  font-size: 1rem;
  font-weight: bold;
  
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 0.9rem;
  }
`;

const ProfileSection = ({ userInfo, setUserInfo, isSaving, setIsSaving, showNotification }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false,
    match: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));

    // 비밀번호 실시간 유효성 검사
    if (name === "newPassword") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        match: value === passwordData.confirmPassword && value.length > 0
      });
    }

    // 비밀번호 확인 실시간 검사
    if (name === "confirmPassword") {
      setPasswordValidation(prev => ({
        ...prev,
        match: value === passwordData.newPassword && value.length > 0
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        showNotification("오류", "사용자 정보를 찾을 수 없습니다.", "error");
        return;
      }

      console.log("사용자 정보 업데이트 시도:", userInfo);

      // Firestore에 사용자 정보 업데이트
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: userInfo.name,
        phone: userInfo.phone,
        companyName: userInfo.companyName,
        businessNumber: userInfo.businessNumber,
        representative: userInfo.representative,
        companyAddress: userInfo.companyAddress,
        businessType: userInfo.businessType,
        businessField: userInfo.businessField,
        managerName: userInfo.managerName,
        updatedAt: new Date(),
      });

      // 로컬 스토리지의 사용자 정보도 업데이트
      const authData = JSON.parse(localStorage.getItem("authData"));
      if (authData && authData.userInfo) {
        authData.userInfo = {
          ...authData.userInfo,
          name: userInfo.name,
          phone: userInfo.phone,
          companyName: userInfo.companyName,
          businessNumber: userInfo.businessNumber,
          representative: userInfo.representative,
          companyAddress: userInfo.companyAddress,
          businessType: userInfo.businessType,
          businessField: userInfo.businessField,
          managerName: userInfo.managerName,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
      }

      console.log("사용자 정보 업데이트 완료");
      showNotification("저장 완료", "계정 정보가 성공적으로 저장되었습니다.", "success");
    } catch (error) {
      console.error("사용자 정보 저장 실패:", error);
      showNotification("오류", "정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    // 유효성 검사
    if (!passwordData.currentPassword) {
      showNotification("오류", "현재 비밀번호를 입력해주세요.", "error");
      return;
    }

    if (!passwordData.newPassword) {
      showNotification("오류", "새 비밀번호를 입력해주세요.", "error");
      return;
    }

    // 비밀번호 강도 검증
    if (passwordData.newPassword.length < 8) {
      showNotification("오류", "비밀번호는 최소 8자 이상이어야 합니다.", "error");
      return;
    }

    // 대문자 포함 확인
    if (!/[A-Z]/.test(passwordData.newPassword)) {
      showNotification("오류", "비밀번호에 대문자가 최소 1개 이상 포함되어야 합니다.", "error");
      return;
    }

    // 소문자 포함 확인
    if (!/[a-z]/.test(passwordData.newPassword)) {
      showNotification("오류", "비밀번호에 소문자가 최소 1개 이상 포함되어야 합니다.", "error");
      return;
    }

    // 특수문자 포함 확인
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)) {
      showNotification("오류", "비밀번호에 특수문자가 최소 1개 이상 포함되어야 합니다.", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("오류", "새 비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    setIsChangingPassword(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        showNotification("오류", "사용자 정보를 찾을 수 없습니다.", "error");
        return;
      }

      // 현재 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // 비밀번호 변경
      await updatePassword(user, passwordData.newPassword);

      showNotification("변경 완료", "비밀번호가 성공적으로 변경되었습니다.", "success");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      
      let errorMessage = "비밀번호 변경 중 오류가 발생했습니다.";
      if (error.code === "auth/wrong-password") {
        errorMessage = "현재 비밀번호가 올바르지 않습니다.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "보안을 위해 다시 로그인 후 시도해주세요.";
      }
      
      showNotification("오류", errorMessage, "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <SectionTitle>계정 설정</SectionTitle>
      <FormGrid>
        <FormGroup>
          <label htmlFor="name">이름 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            disabled
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="phone">전화번호</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="companyName">회사명</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={userInfo.companyName}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="businessNumber">사업자등록번호</label>
          <input
            type="text"
            id="businessNumber"
            name="businessNumber"
            value={userInfo.businessNumber}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="representative">대표자명</label>
          <input
            type="text"
            id="representative"
            name="representative"
            value={userInfo.representative}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="companyAddress">회사주소</label>
          <input
            type="text"
            id="companyAddress"
            name="companyAddress"
            value={userInfo.companyAddress}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="businessType">업종</label>
          <select
            id="businessType"
            name="businessType"
            value={userInfo.businessType}
            onChange={handleInputChange}
          >
            <option value="">업종을 선택하세요</option>
            <option value="제조업">제조업</option>
            <option value="서비스업">서비스업</option>
            <option value="도소매업">도소매업</option>
            <option value="건설업">건설업</option>
            <option value="IT/소프트웨어">IT/소프트웨어</option>
            <option value="교육">교육</option>
            <option value="의료/보건">의료/보건</option>
            <option value="금융/보험">금융/보험</option>
            <option value="기타">기타</option>
          </select>
        </FormGroup>
        <FormGroup>
          <label htmlFor="businessField">사업분야</label>
          <input
            type="text"
            id="businessField"
            name="businessField"
            value={userInfo.businessField}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="managerName">담당자명</label>
          <input
            type="text"
            id="managerName"
            name="managerName"
            value={userInfo.managerName}
            onChange={handleInputChange}
          />
        </FormGroup>
      </FormGrid>
      
      <ButtonGroup>
        <SaveButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장"}
        </SaveButton>
        <PasswordButton onClick={() => setShowPasswordModal(true)}>
          비밀번호 변경
        </PasswordButton>
      </ButtonGroup>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <ModalOverlay onClick={() => setShowPasswordModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>비밀번호 변경</ModalTitle>
            
            <ModalFormGroup>
              <label htmlFor="currentPassword">현재 비밀번호 *</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="현재 비밀번호를 입력하세요"
                autoComplete="current-password"
              />
            </ModalFormGroup>

            <ModalFormGroup>
              <label htmlFor="newPassword">새 비밀번호 * (8자 이상, 대소문자+특수문자 포함)</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="새 비밀번호를 입력하세요"
                autoComplete="new-password"
              />
              {passwordData.newPassword && (
                <PasswordValidationBox>
                  <ValidationItem isValid={passwordValidation.length}>
                    <ValidationIconSmall>{passwordValidation.length ? '✓' : '○'}</ValidationIconSmall>
                    <span>8자 이상</span>
                  </ValidationItem>
                  <ValidationItem isValid={passwordValidation.uppercase}>
                    <ValidationIconSmall>{passwordValidation.uppercase ? '✓' : '○'}</ValidationIconSmall>
                    <span>대문자 포함</span>
                  </ValidationItem>
                  <ValidationItem isValid={passwordValidation.lowercase}>
                    <ValidationIconSmall>{passwordValidation.lowercase ? '✓' : '○'}</ValidationIconSmall>
                    <span>소문자 포함</span>
                  </ValidationItem>
                  <ValidationItem isValid={passwordValidation.special}>
                    <ValidationIconSmall>{passwordValidation.special ? '✓' : '○'}</ValidationIconSmall>
                    <span>특수문자 포함</span>
                  </ValidationItem>
                </PasswordValidationBox>
              )}
            </ModalFormGroup>

            <ModalFormGroup>
              <label htmlFor="confirmPassword">새 비밀번호 확인 *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="새 비밀번호를 다시 입력하세요"
                autoComplete="new-password"
              />
              {passwordData.confirmPassword && (
                <PasswordValidationBox>
                  <ValidationItem isValid={passwordValidation.match}>
                    <ValidationIconSmall>{passwordValidation.match ? '✓' : '○'}</ValidationIconSmall>
                    <span>비밀번호 일치</span>
                  </ValidationItem>
                </PasswordValidationBox>
              )}
            </ModalFormGroup>

            <ModalButtonGroup>
              <ModalButton onClick={() => setShowPasswordModal(false)}>
                취소
              </ModalButton>
              <ModalButton 
                variant="primary" 
                onClick={handlePasswordSubmit}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default ProfileSection;
