import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getCurrentUser, isUserLoggedIn } from "../firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadMultipleFiles, deleteFile } from "../firebase/storage";

// Service Register & Edit 컴포넌트들 import (공통 사용)
import BasicInfoSection from "../components/service/BasicInfoSection";
import ServiceDescriptionSection from "../components/service/ServiceDescriptionSection";
import CategorySection from "../components/service/CategorySection";
import FreePostSection from "../components/service/FreePostSection";

// Service Edit 컴포넌트들 import
import FileManagementSection from "../components/service-edit/FileManagementSection";
import ServicePreview from "../components/service-edit/ServicePreview";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.dark};
  text-align: center;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 1.1rem;
  margin-bottom: 40px;
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isPreviewExpanded ? "1fr 800px" : "1fr 400px"};
  gap: 40px;
  transition: grid-template-columns 0.3s ease;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  div {
    transition: all 0.3s ease;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.gray[500]};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[600]};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: ${(props) => props.theme.colors.gray[600]};

  h3 {
    margin-bottom: 10px;
  }
`;

const ServiceEditPage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: "",
    companyWebsite: "",
    price: "",
    isPricingOptional: false,
    serviceRegion: "",
    serviceDescription: "",
    categories: [],
    tags: [],
    existingFiles: [], // 기존 파일들
    newFiles: [], // 새로 추가할 파일들
    filesToDelete: [], // 삭제할 기존 파일들
    freePostContent: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const categories = [
    { id: "hotel", name: "호텔/리조트" },
    { id: "pension", name: "펜션/민박" },
    { id: "guesthouse", name: "게스트하우스" },
    { id: "camping", name: "캠핑/글램핑" },
    { id: "motel", name: "모텔" },
    { id: "experience", name: "체험/액티비티" },
    { id: "food", name: "맛집/카페" },
    { id: "transportation", name: "교통/렌터카" },
  ];

  // 서비스 데이터 로드
  useEffect(() => {
    const loadServiceData = async () => {
      if (!isUserLoggedIn()) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      if (!serviceId) {
        alert("유효하지 않은 서비스 ID입니다.");
        navigate("/mypage");
        return;
      }

      try {
        console.log("서비스 데이터 로드 중:", serviceId);

        const serviceDoc = await getDoc(doc(db, "services", serviceId));

        if (!serviceDoc.exists()) {
          alert("서비스를 찾을 수 없습니다.");
          navigate("/mypage");
          return;
        }

        const serviceData = serviceDoc.data();
        const currentUser = getCurrentUser();

        // 소유자 확인
        if (serviceData.userId !== currentUser?.uid) {
          alert("이 서비스를 수정할 권한이 없습니다.");
          navigate("/mypage");
          return;
        }

        // 폼 데이터 설정
        setFormData({
          serviceName: serviceData.serviceName || "",
          companyWebsite: serviceData.companyWebsite || "",
          price: serviceData.price || "",
          isPricingOptional: serviceData.isPricingOptional || false,
          serviceRegion: serviceData.serviceRegion || "",
          serviceDescription: serviceData.serviceDescription || "",
          categories: serviceData.categories || [],
          tags: serviceData.tags || [],
          existingFiles: serviceData.files || [],
          newFiles: [],
          filesToDelete: [],
          freePostContent: serviceData.freePostContent || "",
        });

        console.log("서비스 데이터 로드 완료:", serviceData);
      } catch (error) {
        console.error("서비스 데이터 로드 실패:", error);
        alert("서비스 데이터를 불러오는데 실패했습니다.");
        navigate("/mypage");
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceData();
  }, [serviceId, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : prev.categories.length < 3
        ? [...prev.categories, categoryId]
        : prev.categories;

      return { ...prev, categories: newCategories };
    });
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (
        formData.tags.length < 10 &&
        !formData.tags.includes(tagInput.trim())
      ) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setTagInput("");
      }
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // 기존 파일 삭제 표시
  const handleExistingFileRemove = (fileToRemove) => {
    setFormData((prev) => ({
      ...prev,
      existingFiles: prev.existingFiles.filter(
        (file) => file.url !== fileToRemove.url
      ),
      filesToDelete: [...prev.filesToDelete, fileToRemove],
    }));
  };

  // 새 파일 추가
  const handleNewFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...files],
    }));
  };

  // 새 파일 제거
  const handleNewFileRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handlePreviewToggle = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로그인 상태 확인
    if (!isUserLoggedIn()) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      navigate("/login");
      return;
    }

    // 필수 필드 검증
    if (!formData.serviceName.trim()) {
      alert("서비스명을 입력해주세요.");
      return;
    }

    if (!formData.serviceDescription.trim()) {
      alert("서비스 설명을 입력해주세요.");
      return;
    }

    if (formData.categories.length === 0) {
      alert("최소 1개의 카테고리를 선택해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      console.log("서비스 수정 시작...");

      const currentUser = getCurrentUser();

      if (!currentUser) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 삭제할 파일들 처리
      for (const fileToDelete of formData.filesToDelete) {
        try {
          await deleteFile(fileToDelete.path || fileToDelete.url);
          console.log("파일 삭제 완료:", fileToDelete.name);
        } catch (error) {
          console.warn("파일 삭제 실패 (무시됨):", fileToDelete.name, error);
        }
      }

      // 새 파일 업로드
      let newFileUrls = [];
      if (formData.newFiles.length > 0) {
        console.log("새 파일 업로드 중...");
        const uploadResult = await uploadMultipleFiles(
          formData.newFiles,
          `services/${currentUser.uid}/${serviceId}`
        );
        newFileUrls = uploadResult.map((result) => ({
          name: result.name,
          url: result.url,
          type: result.type || "unknown",
          path: result.path,
        }));
        console.log("새 파일 업로드 완료:", newFileUrls);
      }

      // 최종 파일 목록 (기존 파일 + 새 파일)
      const finalFiles = [...formData.existingFiles, ...newFileUrls];

      // Firestore에 서비스 정보 업데이트
      const updateData = {
        // 기본 정보
        serviceName: formData.serviceName.trim(),
        companyWebsite: formData.companyWebsite.trim() || null,
        price: formData.isPricingOptional ? null : formData.price.trim(),
        isPricingOptional: formData.isPricingOptional,
        serviceRegion: formData.serviceRegion.trim(),
        serviceDescription: formData.serviceDescription.trim(),

        // 분류 정보
        categories: formData.categories,
        tags: formData.tags,

        // 파일 정보
        files: finalFiles,

        // 추가 정보
        freePostContent: formData.freePostContent.trim() || null,

        // 업데이트 타임스탬프
        updatedAt: serverTimestamp(),
      };

      console.log("Firestore에 서비스 업데이트 중...");
      await updateDoc(doc(db, "services", serviceId), updateData);

      console.log("서비스 수정 완료:", serviceId);
      alert("서비스가 성공적으로 수정되었습니다!");

      // 마이페이지로 이동
      navigate("/mypage");
    } catch (error) {
      console.error("서비스 수정 실패:", error);

      let errorMessage = "서비스 수정 중 오류가 발생했습니다.";

      if (error.code === "permission-denied") {
        errorMessage = "권한이 없습니다. 로그인 상태를 확인해주세요.";
      } else if (error.code === "storage/unauthorized") {
        errorMessage = "파일 업로드 권한이 없습니다.";
      } else if (error.message) {
        errorMessage = `오류: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm("수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.")
    ) {
      navigate("/mypage");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <h3>서비스 정보를 불러오는 중...</h3>
          <p>잠시만 기다려주세요.</p>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>서비스 수정</PageTitle>
      <PageSubtitle>서비스 정보를 수정하세요</PageSubtitle>

      <FormContainer isPreviewExpanded={isPreviewExpanded}>
        <div>
          <form onSubmit={handleSubmit}>
            <BasicInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <ServiceDescriptionSection
              formData={formData}
              handleInputChange={handleInputChange}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleTagAdd={handleTagAdd}
              handleTagRemove={handleTagRemove}
            />

            <CategorySection
              formData={formData}
              handleCategoryChange={handleCategoryChange}
              categories={categories}
            />

            <FileManagementSection
              formData={formData}
              handleExistingFileRemove={handleExistingFileRemove}
              handleNewFileUpload={handleNewFileUpload}
              handleNewFileRemove={handleNewFileRemove}
            />

            <FreePostSection
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <ButtonContainer>
              <CancelButton type="button" onClick={handleCancel}>
                취소
              </CancelButton>
              <SaveButton type="submit" disabled={isSaving}>
                {isSaving ? "저장 중..." : "변경사항 저장"}
              </SaveButton>
            </ButtonContainer>
          </form>
        </div>

        <ServicePreview
          formData={formData}
          categories={categories}
          isPreviewExpanded={isPreviewExpanded}
          handlePreviewToggle={handlePreviewToggle}
        />
      </FormContainer>
    </PageContainer>
  );
};

export default ServiceEditPage;
