import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  getCurrentUser,
  getCurrentUserInfo,
  isUserLoggedIn,
} from "../firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadMultipleFiles, uploadFile } from "../firebase/storage";

// Service Register & Edit 컴포넌트들 import (공통 사용)
import BasicInfoSection from "../components/service/BasicInfoSection";
import ThumbnailSection from "../components/service/ThumbnailSection";
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
  background: ${(props) => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  
  > div:first-child {
    min-width: 0;
    transition: all 0.3s ease;
  }
  
  > div:last-child {
    min-width: 0;
    transition: all 0.3s ease;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 30px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const PromoModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

const PromoModalContent = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 36px 24px;
    max-width: 90%;
  }
`;

const PromoTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.black};
  margin: 0 0 16px 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PromoHighlight = styled.div`
  background: rgba(0,0,0,0.05);
  border-radius: 16px;
  color: black;
  padding: 20px;
  margin: 24px 0;
  
  h3 {
  color: black;
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  
  p {
    color: black;
    font-size: 1rem;
    margin: 0;
    opacity: 0.95;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    
    h3 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const PromoNote = styled.p`
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.gray[600]};
  margin: 16px 0 24px 0;
  line-height: 1.5;
`;

const PromoButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);

  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 14px;
  }
`;

const ServiceRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceName: "",
    companyWebsite: "",
    companyLogoFile: null,
    pricingOptions: [
      { name: "", price: "" }
    ],
    isPricingOptional: false,
    serviceRegion: "",
    serviceSummary: "",
    serviceDescription: "",
    categories: [],
    subcategories: [],
    tags: [],
    files: [],
    freePostContent: "",
    thumbnailFile: null,
    contactName: "",
    contactPosition: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("upload"); // 'upload' | 'write'
  const [directContent, setDirectContent] = useState("");
  const [showPromoModal, setShowPromoModal] = useState(false);
  // const [notificationModal, setNotificationModal] = useState({
  //   isOpen: false,
  //   title: "",
  //   message: "",
  //   type: "info",
  //   onConfirm: null,
  //   showCancel: false,
  // });

  const categories = [
    { 
      id: "software", 
      name: "개발/소프트웨어/IT",
      subcategories: [
        "소프트웨어 개발 / 앱·웹 개발",
        "클라우드 · 서버 · 네트워크 구축",
        "데이터 분석 · 인공지능(AI)",
        "IT 유지보수 · 기술 아웃소싱",
        "보안 · 시스템 통합(SI)"
      ]
    },
    { 
      id: "design", 
      name: "디자인/콘텐츠/마케팅",
      subcategories: [
        "브랜드 · 그래픽 디자인",
        "웹·UI/UX 디자인",
        "영상 · 사진 · 모션그래픽",
        "디지털 마케팅 · 광고 대행",
        "콘텐츠 제작 · 카피라이팅"
      ]
    },
    { 
      id: "logistics", 
      name: "물류/운송/창고",
      subcategories: [
        "국내 택배 · 화물 운송",
        "국제 물류 · 수출입 대행",
        "보관 · 창고 · 풀필먼트",
        "포장 · 배송 솔루션",
        "물류 시스템 · 재고 관리"
      ]
    },
    { 
      id: "manufacturing", 
      name: "제조/생산/가공",
      subcategories: [
        "금속 · 플라스틱 · 목재 가공",
        "전자 · 기계 부품 생산",
        "식품 · 화학 · 포장 제조",
        "OEM · ODM 생산 대행",
        "시제품 제작 · 3D프린팅"
      ]
    },
    { 
      id: "infrastructure", 
      name: "설비/건설/유지보수",
      subcategories: [
        "건축 · 인테리어 시공",
        "전기 · 기계 · 배관 설비",
        "공장 · 시설 유지보수",
        "환경 · 안전 관리",
        "냉난방 · 통신 · 보안 설비"
      ]
    },
    { 
      id: "education", 
      name: "교육/컨설팅/인증",
      subcategories: [
        "기업 교육 · 직무 교육",
        "경영 · 전략 컨설팅",
        "IT · 기술 컨설팅",
        "특허 · 인증 · 법률 서비스",
        "인사 · 노무 · 회계 지원"
      ]
    },
    { 
      id: "office", 
      name: "사무/문서/번역",
      subcategories: [
        "문서 작성 · 번역 · 통역",
        "인사 · 채용 대행",
        "회계 · 세무 · 법무",
        "고객센터 · 아웃소싱",
        "비즈니스 지원 · 관리"
      ]
    },
    { 
      id: "advertising", 
      name: "광고/프로모션/행사",
      subcategories: [
        "온·오프라인 광고 제작",
        "이벤트 · 전시 · 프로모션 대행",
        "인쇄물 · 판촉물 제작",
        "옥외광고 · 간판 설치",
        "모델 · 인플루언서"
      ]
    },
    { 
      id: "machinery", 
      name: "기계·장비·산업재",
      subcategories: [
        "산업용 기계 · 공구 · 장비",
        "전자 · 계측기기",
        "건설 · 중장비 임대",
        "자동화 설비 · 로봇 기술",
        "소모품 · 부품 유통"
      ]
    },
    { 
      id: "lifestyle", 
      name: "생활/복지/기타 서비스",
      subcategories: [
        "청소 · 방역 · 시설관리",
        "복지 · 음식 · 식자재",
        "여행 · 숙박 · 행사 지원",
        "기타 전문 서비스"
      ]
    },
  ];

  // 페이지 진입 시 프로모션 모달 표시
  useEffect(() => {
    setShowPromoModal(true);
  }, []);

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
      // 카테고리는 1개만 선택 가능
      const newCategories = prev.categories.includes(categoryId)
        ? [] // 이미 선택된 카테고리를 클릭하면 해제
        : [categoryId]; // 새로운 카테고리 선택 (기존 선택 해제)

      // 카테고리가 변경되면 모든 서브카테고리 제거
      const newSubcategories = [];

      return { 
        ...prev, 
        categories: newCategories,
        subcategories: newSubcategories
      };
    });
  };

  const handleSubcategoryChange = (categoryId, subcategory) => {
    setFormData((prev) => {
      const subcategoryKey = `${categoryId}:${subcategory}`;
      const newSubcategories = prev.subcategories.includes(subcategoryKey)
        ? prev.subcategories.filter((sub) => sub !== subcategoryKey)
        : prev.subcategories.length < 5
        ? [...prev.subcategories, subcategoryKey]
        : prev.subcategories; // 최대 5개 제한

      return { ...prev, subcategories: newSubcategories };
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

  // 가격 옵션 추가 (최대 5개)
  const handleAddPricingOption = () => {
    if (formData.pricingOptions.length < 5) {
      setFormData((prev) => ({
        ...prev,
        pricingOptions: [...prev.pricingOptions, { name: "", price: "" }],
      }));
    }
  };

  // 가격 옵션 제거
  const handleRemovePricingOption = (index) => {
    if (formData.pricingOptions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        pricingOptions: prev.pricingOptions.filter((_, i) => i !== index),
      }));
    }
  };

  // 가격 옵션 변경
  const handlePricingOptionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricingOptions: prev.pricingOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      ),
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

  // 회사 로고 업로드 핸들러
  const handleCompanyLogoUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('이미지 파일만 업로드 가능합니다. (PNG, JPG, GIF)');
      return;
    }

    // 파일 크기 검증 (2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`파일 크기가 너무 큽니다. (${fileSizeMB}MB) 최대 2MB까지 업로드 가능합니다.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      companyLogoFile: file,
    }));

    // 파일 input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = "";
  };

  // 회사 로고 제거 핸들러
  const handleCompanyLogoRemove = () => {
    setFormData((prev) => ({
      ...prev,
      companyLogoFile: null,
    }));
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
      const currentUser = getCurrentUser();
      const currentUserInfo = getCurrentUserInfo();

      if (!currentUser) {
        alert("사용자 정보를 찾을 수 없습니다.");
        return;
      }

      // 파일 업로드
      let fileUrls = [];
      if (formData.files.length > 0) {
        const uploadResult = await uploadMultipleFiles(
          formData.files,
          `services/${currentUser.uid}/${Date.now()}`
        );
        fileUrls = uploadResult.map((result) => ({
          name: result.name,
          url: result.url,
          type: result.type || "unknown",
        }));
      }

      // 썸네일 업로드
      let thumbnailUrl = null;
      if (formData.thumbnailFile) {
        thumbnailUrl = await uploadFile(
          formData.thumbnailFile,
          `thumbnails/${currentUser.uid}/${Date.now()}_${formData.thumbnailFile.name}`
        );
      }

      // 회사 로고 업로드
      let companyLogoUrl = null;
      if (formData.companyLogoFile) {
        companyLogoUrl = await uploadFile(
          formData.companyLogoFile,
          `company-logos/${currentUser.uid}/${Date.now()}_${formData.companyLogoFile.name}`
        );
      }

      // Firestore에 서비스 정보 저장
      const serviceData = {
        // 기본 정보
        serviceName: formData.serviceName.trim(),
        companyWebsite: formData.companyWebsite.trim() || null,
        pricingOptions: formData.isPricingOptional ? null : formData.pricingOptions.filter(option => option.name.trim() && option.price.trim()),
        isPricingOptional: formData.isPricingOptional,
        serviceRegion: formData.serviceRegion.trim(),
        serviceSummary: formData.serviceSummary.trim(),
        serviceDescription: formData.serviceDescription.trim(),

        // 담당자 정보
        contactName: formData.contactName.trim(),
        contactPosition: formData.contactPosition.trim(),
        contactPhone: formData.contactPhone.trim(),
        contactEmail: formData.contactEmail.trim(),

        // 분류 정보
        categories: formData.categories,
        subcategories: formData.subcategories,
        tags: formData.tags,

        // 파일 정보
        files: fileUrls,
        thumbnail: thumbnailUrl,
        companyLogo: companyLogoUrl,

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

      await addDoc(collection(db, "services"), serviceData);

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
    <>
      {showPromoModal && (
        <PromoModalOverlay>
          <PromoModalContent>
            <PromoTitle>사전 등록 안내</PromoTitle>
            {/* <PromoMessage>
              서비스는 한 개씩 등록 가능합니다.
            </PromoMessage> */}
            <PromoHighlight>
              {/* <h2>서비스 등록 규칙 안내</h2> */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px', color: '#333' }}>
                  게시글 등록 규칙
                </h3>
                <ul style={{ textAlign: 'left', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>서비스형 업체</strong>: 게시글 1건당 1개의 서비스를 등록할 수 있습니다.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>제품형 업체</strong>: 게시글 1건당 1종류의 제품군(동일 카테고리 내 제품)을 등록할 수 있습니다.
                  </li>
                </ul>
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  marginTop: '10px',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <strong>예시:</strong> '로봇' 제품군 내 다양한 모델은 한 게시글에 등록 가능하지만, 
                  '로봇'과 '모니터'는 별도 게시글로 등록해야 합니다.
                </div>
              </div>
              <p style={{ fontSize: '1rem', fontWeight: '500', color: '#007bff' }}>
                지금 등록하시면, 3개월간 프리미엄 혜택을 무료로 제공해드립니다.
              </p>
            </PromoHighlight>
            <PromoNote>
              * 서비스는 검토 후 승인됩니다.
            </PromoNote>
            <PromoButton onClick={() => setShowPromoModal(false)}>
              확인하고 등록하기
            </PromoButton>
          </PromoModalContent>
        </PromoModalOverlay>
      )}

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
              handleAddPricingOption={handleAddPricingOption}
              handleRemovePricingOption={handleRemovePricingOption}
              handlePricingOptionChange={handlePricingOptionChange}
              handleCompanyLogoUpload={handleCompanyLogoUpload}
              handleCompanyLogoRemove={handleCompanyLogoRemove}
            />

            <ThumbnailSection
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
              handleSubcategoryChange={handleSubcategoryChange}
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
    </>
  );
};

export default ServiceRegisterPage;
