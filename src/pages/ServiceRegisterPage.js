import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getCurrentUser,
  getCurrentUserInfo,
  isUserLoggedIn,
} from "../firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadMultipleFiles } from "../firebase/storage";

// Service Register & Edit 컴포넌트들 import (공통 사용)
import BasicInfoSection from "../components/service/BasicInfoSection";
import ServiceDescriptionSection from "../components/service/ServiceDescriptionSection";
import CategorySection from "../components/service/CategorySection";
import FreePostSection from "../components/service/FreePostSection";

// Service Register 전용 컴포넌트들 import
import FileUploadSection from "../components/service-register/FileUploadSection";
import RegisterPreview from "../components/service-register/RegisterPreview";

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

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const ServiceRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: "",
    companyWebsite: "",
    price: "",
    isPricingOptional: false,
    serviceRegion: "",
    serviceDescription: "",
    categories: [],
    tags: [],
    files: [],
    freePostContent: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("upload"); // 'upload' | 'write'
  const [directContent, setDirectContent] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // URL 필드 blur 처리 (포커스가 벗어날 때)
  const handleUrlBlur = (e) => {
    const { name, value } = e.target;

    if (name === "companyWebsite" && value.trim()) {
      let processedUrl = value.trim();

      // 이미 프로토콜이 있는지 확인
      if (
        !processedUrl.startsWith("http://") &&
        !processedUrl.startsWith("https://")
      ) {
        // 프로토콜이 없으면 https:// 자동 추가
        processedUrl = `https://${processedUrl}`;

        setFormData((prev) => ({
          ...prev,
          [name]: processedUrl,
        }));
      }
    }
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    // 파일 검증 및 필터링
    const validFiles = [];
    const errors = [];

    // 현재 선택된 이미지 개수 확인
    const currentImages = formData.files.filter((file) => {
      const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();
      return (
        fileType &&
        (fileType.startsWith("image/") ||
          ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType))
      );
    });

    let imageCount = currentImages.length;

    for (const file of files) {
      const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();
      const isImage =
        fileType &&
        (fileType.startsWith("image/") ||
          ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType));
      const isPDF =
        fileType && (fileType === "application/pdf" || fileType === "pdf");

      // 중복 파일 체크
      const isDuplicate = formData.files.some(
        (existingFile) =>
          existingFile.name === file.name && existingFile.size === file.size
      );

      if (isDuplicate) {
        errors.push(`"${file.name}"은 이미 선택된 파일입니다.`);
        continue;
      }

      // 이미지 개수 제한 (3장)
      if (isImage) {
        if (imageCount >= 3) {
          errors.push(
            `이미지는 최대 3장까지만 업로드할 수 있습니다. "${file.name}"이 제외되었습니다.`
          );
          continue;
        }
        imageCount++;
      }

      // PDF 용량 제한 (2MB = 2,097,152 bytes)
      if (isPDF) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
          errors.push(
            `"${file.name}" (${fileSizeMB}MB)는 2MB를 초과합니다. PDF 파일은 2MB 이하만 업로드 가능합니다.`
          );
          continue;
        }
      }

      // 지원하는 파일 형식 체크
      if (!isImage && !isPDF) {
        errors.push(
          `"${file.name}"은 지원하지 않는 파일 형식입니다. 이미지 또는 PDF 파일만 업로드 가능합니다.`
        );
        continue;
      }

      validFiles.push(file);
    }

    // 에러 메시지 표시
    if (errors.length > 0) {
      alert(errors.join("\n\n"));
    }

    // 유효한 파일만 추가
    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...validFiles],
      }));

      if (errors.length === 0) {
        alert(`${validFiles.length}개의 파일이 성공적으로 추가되었습니다.`);
      }
    }

    // 파일 input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = "";
  };

  const handleFileRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handlePreviewToggle = () => {
    setIsPreviewExpanded(!isPreviewExpanded);
  };

  // 업로드 방식 변경 핸들러
  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);

    // 방식 변경 시 기존 데이터 유지 여부 확인
    if (method === "write" && formData.files.length > 0) {
      if (
        window.confirm(
          "직접 작성으로 변경하시겠습니까? 업로드된 파일들이 제거됩니다."
        )
      ) {
        setFormData((prev) => ({ ...prev, files: [] }));
      } else {
        return; // 변경 취소
      }
    } else if (method === "upload" && directContent.trim()) {
      if (
        window.confirm(
          "파일 업로드로 변경하시겠습니까? 작성된 내용이 제거됩니다."
        )
      ) {
        setDirectContent("");
      } else {
        return; // 변경 취소
      }
    }
  };

  // 직접 작성 내용 변경 핸들러
  const handleDirectContentChange = (e) => {
    setDirectContent(e.target.value);
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

    setIsSubmitting(true);

    try {
      console.log("서비스 등록 시작...");

      const currentUser = getCurrentUser();
      const currentUserInfo = getCurrentUserInfo();

      if (!currentUser) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 파일 업로드
      let fileUrls = [];
      if (formData.files.length > 0) {
        console.log("파일 업로드 중...");
        const uploadResult = await uploadMultipleFiles(
          formData.files,
          `services/${currentUser.uid}/${Date.now()}`
        );
        fileUrls = uploadResult.map((result) => ({
          name: result.name,
          url: result.url,
          type: result.type || "unknown",
        }));
        console.log("파일 업로드 완료:", fileUrls);
      }

      // Firestore에 서비스 정보 저장
      const serviceData = {
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
        files: fileUrls,

        // 업로드 방식 및 직접 작성 내용
        uploadMethod: uploadMethod,
        directContent: uploadMethod === "write" ? directContent.trim() : null,

        // 추가 정보
        freePostContent: formData.freePostContent.trim() || null,

        // 사용자 정보
        userId: currentUser.uid,
        userEmail: currentUser.email,
        companyName: currentUserInfo?.companyName || "",

        // 상태 정보
        status: "pending", // 검토중
        views: 0,

        // 타임스탬프
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("Firestore에 서비스 저장 중...");
      const docRef = await addDoc(collection(db, "services"), serviceData);

      console.log("서비스 등록 완료:", docRef.id);
      alert("서비스가 성공적으로 등록되었습니다! 검토 후 승인됩니다.");

      // 마이페이지로 이동
      navigate("/mypage");
    } catch (error) {
      console.error("서비스 등록 실패:", error);

      let errorMessage = "서비스 등록 중 오류가 발생했습니다.";

      if (error.code === "permission-denied") {
        errorMessage = "권한이 없습니다. 로그인 상태를 확인해주세요.";
      } else if (error.code === "storage/unauthorized") {
        errorMessage = "파일 업로드 권한이 없습니다.";
      } else if (error.message) {
        errorMessage = `오류: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>서비스 등록</PageTitle>
      <PageSubtitle>고객들에게 당신의 서비스를 소개하세요</PageSubtitle>

      <FormContainer isPreviewExpanded={isPreviewExpanded}>
        <div>
          <form onSubmit={handleSubmit}>
            <BasicInfoSection
              formData={formData}
              handleInputChange={handleInputChange}
              handleUrlBlur={handleUrlBlur}
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

            <FileUploadSection
              formData={formData}
              handleFileUpload={handleFileUpload}
              handleFileRemove={handleFileRemove}
              directContent={directContent}
              handleDirectContentChange={handleDirectContentChange}
              uploadMethod={uploadMethod}
              handleUploadMethodChange={handleUploadMethodChange}
            />

            <FreePostSection
              formData={formData}
              handleInputChange={handleInputChange}
            />

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "서비스 등록하기"}
            </SubmitButton>
          </form>
        </div>

        <RegisterPreview
          formData={formData}
          categories={categories}
          isPreviewExpanded={isPreviewExpanded}
          handlePreviewToggle={handlePreviewToggle}
        />
      </FormContainer>
    </PageContainer>
  );
};

export default ServiceRegisterPage;
