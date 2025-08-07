import React from "react";
import styled from "styled-components";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { getCurrentUser } from "../../firebase/auth";

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
    transition: border-color 0.2s ease;

    &:focus {
      border-color: ${(props) => props.theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
      border-color: ${(props) => props.theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const ProfileSection = ({ userInfo, setUserInfo, isSaving, setIsSaving }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("사용자 정보를 찾을 수 없습니다.");
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
      alert("계정 정보가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("사용자 정보 저장 실패:", error);
      alert("정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
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
      <SaveButton onClick={handleSave} disabled={isSaving}>
        {isSaving ? "저장 중..." : "저장"}
      </SaveButton>
    </>
  );
};

export default ProfileSection;
