import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { updateDoc, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../core/firebase/config";
import { getCurrentUser } from "../../../core/firebase/auth";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { auth } from "../../../core/firebase/config";
import { uploadFile } from "../../../core/firebase/storage";
import { useNavigate } from "react-router-dom";

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

const DeleteAccountButton = styled.button`
  padding: 12px 24px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #fecaca;
    border-color: #f87171;
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

const FileUploadSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 2px dashed ${(props) => props.theme.colors.gray[300]};
`;

const FileUploadTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 12px;
`;

const FileUploadBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadButton = styled.label`
  display: inline-block;
  padding: 12px 24px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

const FileInfo = styled.div`
  padding: 12px;
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.dark};
`;

const FileStatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 8px;
  
  ${(props) => {
    if (props.status === 'verified') {
      return `
        background: #D1FAE5;
        color: #065F46;
      `;
    } else if (props.status === 'pending') {
      return `
        background: #FEF3C7;
        color: #92400E;
      `;
    } else {
      return `
        background: #FEE2E2;
        color: #991B1B;
      `;
    }
  }}
`;

const CustomSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelectButton = styled.button`
  width: 100%;
  padding: 12px;
  padding-right: 35px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 16px;
  background: white;
  color: ${props => props.hasValue ? '#000000' : props.theme.colors.gray[400]};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${(props) => props.theme.colors.gray[400]};
  }

  &:focus {
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
                ${(props) => props.theme.gradients.primary} border-box;
    outline: none;
    box-shadow: 0 0 0 3px rgba(73, 126, 233, 0.1);
  }

  &::after {
    content: "";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%) rotate(${props => props.isOpen ? '-135deg' : '45deg'});
    width: 5px;
    height: 5px;
    border-right: 2px solid ${(props) => props.theme.colors.gray[500]};
    border-bottom: 2px solid ${(props) => props.theme.colors.gray[500]};
    transition: transform 0.2s ease;
  }
`;

const CustomSelectDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const CustomSelectOption = styled.div`
  padding: 12px;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#f0f0f0' : 'white'};
  color: #000000;
  font-size: 16px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f8f8f8;
  }

  &:first-child {
    border-radius: ${(props) => props.theme.borderRadius.md} ${(props) => props.theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${(props) => props.theme.borderRadius.md} ${(props) => props.theme.borderRadius.md};
  }
`;

const ProfileSection = ({ userInfo, setUserInfo, isSaving, setIsSaving, showNotification }) => {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [businessFile, setBusinessFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false,
    match: false
  });

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handleSelectToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleSelectOption = (name, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setOpenDropdown(null);
  };

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

  const handleSaveClick = () => {
    // 저장 버튼 클릭 시 비밀번호 확인 모달 표시
    setShowConfirmPasswordModal(true);
  };

  const handleConfirmPasswordSubmit = async () => {
    if (!confirmPassword) {
      showNotification("오류", "비밀번호를 입력해주세요.", "error");
      return;
    }

    setIsConfirming(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        showNotification("오류", "사용자 정보를 찾을 수 없습니다.", "error");
        return;
      }

      // 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(user.email, confirmPassword);
      await reauthenticateWithCredential(user, credential);

      // 비밀번호 확인 성공 - 정보 저장 진행
      setShowConfirmPasswordModal(false);
      setConfirmPassword('');
      await handleSave();
    } catch (error) {
      console.error("비밀번호 확인 실패:", error);
      
      let errorMessage = "비밀번호가 올바르지 않습니다.";
      if (error.code === "auth/wrong-password") {
        errorMessage = "비밀번호가 올바르지 않습니다.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "비밀번호가 올바르지 않습니다.";
      }
      
      showNotification("오류", errorMessage, "error");
    } finally {
      setIsConfirming(false);
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

      const userDocRef = doc(db, "users", currentUser.uid);
      
      // 문서 존재 여부 확인
      const userDocSnap = await getDoc(userDocRef);
      
      const userData = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        companyName: userInfo.companyName,
        businessNumber: userInfo.businessNumber,
        representative: userInfo.representative,
        companyAddress: userInfo.companyAddress,
        businessType: userInfo.businessType,
        businessField: userInfo.businessField,
        managerName: userInfo.managerName,
        updatedAt: new Date(),
      };

      if (userDocSnap.exists()) {
        // 문서가 존재하면 업데이트
        await updateDoc(userDocRef, userData);
      } else {
        // 문서가 없으면 생성
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date(),
        });
      }

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
          verificationStatus: userInfo.verificationStatus,
          businessRegistration: userInfo.businessRegistration,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
      }

      showNotification("저장 완료", "계정 정보가 성공적으로 저장되었습니다.", "success");
    } catch (error) {
      console.error("사용자 정보 저장 실패:", error);
      showNotification("오류", "정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showNotification("오류", "파일 크기는 10MB 이하여야 합니다.", "error");
        return;
      }
      
      // 파일 형식 체크
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showNotification("오류", "JPG, PNG, PDF 파일만 업로드 가능합니다.", "error");
        return;
      }
      
      setBusinessFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!businessFile) {
      showNotification("오류", "파일을 선택해주세요.", "error");
      return;
    }

    setIsUploadingFile(true);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        showNotification("오류", "사용자 정보를 찾을 수 없습니다.", "error");
        return;
      }

      // Storage에 파일 업로드
      const fileUrl = await uploadFile(
        businessFile,
        `business-verification/${currentUser.uid}/${Date.now()}_${businessFile.name}`
      );

      // Firestore 업데이트
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        businessRegistration: fileUrl,
        verificationStatus: 'pending',
        verificationUploadedAt: new Date(),
      });

      // 로컬 상태 업데이트
      setUserInfo(prev => ({
        ...prev,
        businessRegistration: fileUrl,
        verificationStatus: 'pending'
      }));

      // 로컬 스토리지 업데이트
      const authData = JSON.parse(localStorage.getItem("authData"));
      if (authData && authData.userInfo) {
        authData.userInfo.businessRegistration = fileUrl;
        authData.userInfo.verificationStatus = 'pending';
        localStorage.setItem("authData", JSON.stringify(authData));
      }

      setBusinessFile(null);
      showNotification(
        "업로드 완료", 
        "사업자등록증이 업로드되었습니다. 관리자 승인 후 인증이 완료됩니다.", 
        "success"
      );
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      showNotification("오류", "파일 업로드 중 오류가 발생했습니다.", "error");
    } finally {
      setIsUploadingFile(false);
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

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = async () => {
    const confirmMessage = "정말로 회원 탈퇴를 하시겠습니까?\n\n" +
      "⚠️ 주의사항:\n" +
      "- 모든 개인 정보가 삭제됩니다.\n" +
      "- 작성한 게시물은 삭제되지 않습니다.\n" +
      "- 이 작업은 되돌릴 수 없습니다.\n\n" +
      "계속하려면 '확인'을 클릭하세요.";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDeletingAccount(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        showNotification("오류", "사용자 정보를 찾을 수 없습니다.", "error");
        return;
      }

      // 1. Firestore에서 사용자 데이터 삭제
      await deleteDoc(doc(db, "users", user.uid));

      // 2. Firebase Authentication에서 계정 삭제
      await deleteUser(user);

      // 3. 로그아웃 및 홈으로 이동
      showNotification("탈퇴 완료", "회원 탈퇴가 완료되었습니다.", "success");
      
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      
      let errorMessage = "회원 탈퇴 중 오류가 발생했습니다.";
      
      if (error.code === "auth/requires-recent-login") {
        errorMessage = "보안을 위해 다시 로그인 후 시도해주세요.";
      }
      
      showNotification("오류", errorMessage, "error");
    } finally {
      setIsDeletingAccount(false);
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
          <label htmlFor="companyName">
            회사명
            {userInfo.verificationStatus === 'verified' && (
              <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: '8px' }}>
                (인증 완료로 변경 불가)
              </span>
            )}
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={userInfo.companyName}
            onChange={handleInputChange}
            disabled={userInfo.verificationStatus === 'verified'}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="businessNumber">
            사업자등록번호
            <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: '8px' }}>
              (변경 불가)
            </span>
          </label>
          <input
            type="text"
            id="businessNumber"
            name="businessNumber"
            value={userInfo.businessNumber}
            disabled
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="representative">
            대표자명
            {userInfo.verificationStatus === 'verified' && (
              <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: '8px' }}>
                (인증 완료로 변경 불가)
              </span>
            )}
          </label>
          <input
            type="text"
            id="representative"
            name="representative"
            value={userInfo.representative}
            onChange={handleInputChange}
            disabled={userInfo.verificationStatus === 'verified'}
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
          <label htmlFor="businessType">기업 분야</label>
          <CustomSelectWrapper data-dropdown>
            <CustomSelectButton
              type="button"
              onClick={() => handleSelectToggle('businessType')}
              isOpen={openDropdown === 'businessType'}
              hasValue={!!userInfo.businessType}
            >
              {userInfo.businessType 
                ? {
                    software: '개발 / 소프트웨어 / IT',
                    design: '디자인 / 콘텐츠 / 마케팅',
                    logistics: '물류 / 운송 / 창고',
                    manufacturing: '제조 / 생산 / 가공',
                    infrastructure: '설비 / 건설 / 유지보수',
                    education: '교육 / 컨설팅 / 인증',
                    office: '사무 / 문서 / 번역',
                    advertising: '광고 / 프로모션 / 행사',
                    machinery: '기계 / 장비 / 산업재',
                    lifestyle: '생활 / 복지 / 기타 서비스',
                    '제조업': '제조업',
                    '서비스업': '서비스업',
                    '도소매업': '도소매업',
                    '건설업': '건설업',
                    'IT/소프트웨어': 'IT/소프트웨어',
                    '교육': '교육',
                    '의료/보건': '의료/보건',
                    '금융/보험': '금융/보험',
                    '기타': '기타'
                  }[userInfo.businessType] || userInfo.businessType
                : '기업 분야를 선택하세요'
              }
            </CustomSelectButton>
            <CustomSelectDropdown isOpen={openDropdown === 'businessType'}>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'software')}
                isSelected={userInfo.businessType === 'software'}
              >
                개발 / 소프트웨어 / IT
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'design')}
                isSelected={userInfo.businessType === 'design'}
              >
                디자인 / 콘텐츠 / 마케팅
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'logistics')}
                isSelected={userInfo.businessType === 'logistics'}
              >
                물류 / 운송 / 창고
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'manufacturing')}
                isSelected={userInfo.businessType === 'manufacturing'}
              >
                제조 / 생산 / 가공
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'infrastructure')}
                isSelected={userInfo.businessType === 'infrastructure'}
              >
                설비 / 건설 / 유지보수
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'education')}
                isSelected={userInfo.businessType === 'education'}
              >
                교육 / 컨설팅 / 인증
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'office')}
                isSelected={userInfo.businessType === 'office'}
              >
                사무 / 문서 / 번역
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'advertising')}
                isSelected={userInfo.businessType === 'advertising'}
              >
                광고 / 프로모션 / 행사
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'machinery')}
                isSelected={userInfo.businessType === 'machinery'}
              >
                기계 / 장비 / 산업재
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessType', 'lifestyle')}
                isSelected={userInfo.businessType === 'lifestyle'}
              >
                생활 / 복지 / 기타 서비스
              </CustomSelectOption>
            </CustomSelectDropdown>
          </CustomSelectWrapper>
        </FormGroup>
        <FormGroup>
          <label htmlFor="businessField">기업 구분</label>
          <CustomSelectWrapper data-dropdown>
            <CustomSelectButton
              type="button"
              onClick={() => handleSelectToggle('businessField')}
              isOpen={openDropdown === 'businessField'}
              hasValue={!!userInfo.businessField}
            >
              {userInfo.businessField 
                ? {
                    large: '대기업',
                    medium: '중견기업',
                    small: '중소기업',
                    startup: '스타트업',
                    individual: '개인사업자'
                  }[userInfo.businessField] || userInfo.businessField
                : '기업 구분을 선택하세요'
              }
            </CustomSelectButton>
            <CustomSelectDropdown isOpen={openDropdown === 'businessField'}>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessField', '')}
                isSelected={!userInfo.businessField}
              >
                기업 구분을 선택하세요
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessField', 'large')}
                isSelected={userInfo.businessField === 'large'}
              >
                대기업
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessField', 'medium')}
                isSelected={userInfo.businessField === 'medium'}
              >
                중견기업
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessField', 'small')}
                isSelected={userInfo.businessField === 'small'}
              >
                중소기업
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessField', 'startup')}
                isSelected={userInfo.businessField === 'startup'}
              >
                스타트업
              </CustomSelectOption>
              <CustomSelectOption
                onClick={() => handleSelectOption('businessField', 'individual')}
                isSelected={userInfo.businessField === 'individual'}
              >
                개인사업자
              </CustomSelectOption>
            </CustomSelectDropdown>
          </CustomSelectWrapper>
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
      
      {/* 사업자등록증 업로드 섹션 */}
      {(!userInfo.verificationStatus || userInfo.verificationStatus === 'not_submitted') && (
        <FileUploadSection>
          <FileUploadTitle>기업 인증 (사업자등록증)</FileUploadTitle>
          <FileUploadBox>
            <FileInput
              type="file"
              id="businessFileInput"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />
            <FileUploadButton htmlFor="businessFileInput">
              파일 선택 (JPG, PNG, PDF)
            </FileUploadButton>
            {businessFile && (
              <FileInfo>
                선택된 파일: {businessFile.name} ({(businessFile.size / 1024).toFixed(2)} KB)
              </FileInfo>
            )}
            {businessFile && (
              <SaveButton 
                onClick={handleFileUpload} 
                disabled={isUploadingFile}
                style={{ marginTop: '12px' }}
              >
                {isUploadingFile ? "업로드 중..." : "업로드"}
              </SaveButton>
            )}
          </FileUploadBox>
        </FileUploadSection>
      )}

      {/* 인증 상태 표시 */}
      {userInfo.verificationStatus && userInfo.verificationStatus !== 'not_submitted' && (
        <FileUploadSection>
          <FileUploadTitle>
            기업 인증 상태
            <FileStatusBadge status={userInfo.verificationStatus}>
              {userInfo.verificationStatus === 'verified' && '인증 완료'}
              {userInfo.verificationStatus === 'pending' && '승인 대기 중'}
              {userInfo.verificationStatus === 'rejected' && '반려됨'}
            </FileStatusBadge>
          </FileUploadTitle>
          {userInfo.verificationStatus === 'verified' && (
            <FileInfo>기업 인증이 완료되었습니다. 모든 서비스를 이용하실 수 있습니다.</FileInfo>
          )}
          {userInfo.verificationStatus === 'pending' && (
            <FileInfo>사업자등록증 검토 중입니다. 승인까지 1-2 영업일이 소요될 수 있습니다.</FileInfo>
          )}
          {userInfo.verificationStatus === 'rejected' && (
            <>
              <FileInfo>제출하신 사업자등록증이 반려되었습니다. 다시 업로드해주세요.</FileInfo>
              <FileUploadBox style={{ marginTop: '16px' }}>
                <FileInput
                  type="file"
                  id="businessFileInputRetry"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                />
                <FileUploadButton htmlFor="businessFileInputRetry">
                  파일 재선택 (JPG, PNG, PDF)
                </FileUploadButton>
                {businessFile && (
                  <FileInfo>
                    선택된 파일: {businessFile.name} ({(businessFile.size / 1024).toFixed(2)} KB)
                  </FileInfo>
                )}
                {businessFile && (
                  <SaveButton 
                    onClick={handleFileUpload} 
                    disabled={isUploadingFile}
                    style={{ marginTop: '12px' }}
                  >
                    {isUploadingFile ? "업로드 중..." : "재업로드"}
                  </SaveButton>
                )}
              </FileUploadBox>
            </>
          )}
        </FileUploadSection>
      )}
      
      <ButtonGroup>
        <SaveButton onClick={handleSaveClick} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장"}
        </SaveButton>
        <PasswordButton onClick={() => setShowPasswordModal(true)}>
          비밀번호 변경
        </PasswordButton>
        <DeleteAccountButton onClick={handleDeleteAccount} disabled={isDeletingAccount}>
          {isDeletingAccount ? "처리 중..." : "회원 탈퇴"}
        </DeleteAccountButton>
      </ButtonGroup>

      {/* 비밀번호 확인 모달 (정보 저장용) */}
      {showConfirmPasswordModal && (
        <ModalOverlay onClick={() => setShowConfirmPasswordModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>비밀번호 확인</ModalTitle>
            
            <ModalFormGroup>
              <label htmlFor="confirmPasswordForSave">
                정보 변경을 위해 비밀번호를 입력해주세요 *
              </label>
              <input
                type="password"
                id="confirmPasswordForSave"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="현재 비밀번호를 입력하세요"
                autoComplete="current-password"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmPasswordSubmit();
                  }
                }}
              />
            </ModalFormGroup>

            <ModalButtonGroup>
              <ModalButton onClick={() => {
                setShowConfirmPasswordModal(false);
                setConfirmPassword('');
              }}>
                취소
              </ModalButton>
              <ModalButton 
                variant="primary" 
                onClick={handleConfirmPasswordSubmit}
                disabled={isConfirming}
              >
                {isConfirming ? "확인 중..." : "확인"}
              </ModalButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

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
