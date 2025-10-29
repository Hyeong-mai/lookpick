import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getCurrentUser, isUserLoggedIn } from "../firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadMultipleFiles, deleteFile } from "../firebase/storage";

// Service Register & Edit 컴포넌트들 import (공통 사용)
import BasicInfoSection from "../components/service/BasicInfoSection";
import ThumbnailSection from "../components/service/ThumbnailSection";
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 16px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.md};
  }

  &:disabled {
    background: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[600]};
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.md};
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
    companyLogoFile: null,
    companyLogo: null, // 기존 로고 URL
    pricingOptions: [
      { name: "", price: "" }
    ],
    isPricingOptional: false,
    serviceRegion: "",
    serviceDescription: "",
    categories: [],
    subcategories: [],
    tags: [],
    existingFiles: [], // 기존 파일들
    newFiles: [], // 새로 추가할 파일들
    filesToDelete: [], // 삭제할 기존 파일들
    freePostContent: "",
    thumbnailFile: null,
    thumbnail: null, // 기존 썸네일 URL
    contactName: "",
    contactPosition: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("upload"); // 'upload' | 'write'
  const [directContent, setDirectContent] = useState("");

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
          companyLogoFile: null, // 새로 업로드할 로고 파일
          companyLogo: serviceData.companyLogo || null, // 기존 로고 URL
          pricingOptions: serviceData.pricingOptions || [{ name: "", price: "" }],
          isPricingOptional: serviceData.isPricingOptional || false,
          serviceRegion: serviceData.serviceRegion || "",
          serviceDescription: serviceData.serviceDescription || "",
          categories: serviceData.categories || [],
          subcategories: serviceData.subcategories || [],
          tags: serviceData.tags || [],
          existingFiles: serviceData.files || [],
          newFiles: [],
          filesToDelete: [],
          freePostContent: serviceData.freePostContent || "",
          thumbnailFile: null, // 새로 업로드할 썸네일 파일
          thumbnail: serviceData.thumbnail || null, // 기존 썸네일 URL
          contactName: serviceData.contactName || "",
          contactPosition: serviceData.contactPosition || "",
          contactPhone: serviceData.contactPhone || "",
          contactEmail: serviceData.contactEmail || "",
        });

        // 업로드 방식과 직접 작성 내용 설정
        setUploadMethod(serviceData.uploadMethod || "upload");
        setDirectContent(serviceData.directContent || "");

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

    // 파일 검증 및 필터링
    const validFiles = [];
    const errors = [];

    // 현재 이미지 개수 확인 (기존 파일 + 새 파일)
    const existingImages = formData.existingFiles.filter((file) => {
      const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();
      return (
        fileType &&
        (fileType.startsWith("image/") ||
          ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType))
      );
    });

    const newImages = formData.newFiles.filter((file) => {
      const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();
      return (
        fileType &&
        (fileType.startsWith("image/") ||
          ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType))
      );
    });

    let imageCount = existingImages.length + newImages.length;

    for (const file of files) {
      const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();
      const isImage =
        fileType &&
        (fileType.startsWith("image/") ||
          ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType));
      const isPDF =
        fileType && (fileType === "application/pdf" || fileType === "pdf");

      // 중복 파일 체크 (기존 파일과 새 파일 모두 확인)
      const isDuplicateInExisting = formData.existingFiles.some(
        (existingFile) =>
          existingFile.name === file.name && existingFile.size === file.size
      );

      const isDuplicateInNew = formData.newFiles.some(
        (newFile) => newFile.name === file.name && newFile.size === file.size
      );

      if (isDuplicateInExisting || isDuplicateInNew) {
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
        newFiles: [...prev.newFiles, ...validFiles],
      }));

      if (errors.length === 0) {
        alert(`${validFiles.length}개의 파일이 성공적으로 추가되었습니다.`);
      }
    }

    // 파일 input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = "";
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

  // 업로드 방식 변경 핸들러
  const handleUploadMethodChange = (method) => {
    setUploadMethod(method);

    // 방식 변경 시 기존 데이터 유지 여부 확인
    const hasFiles =
      formData.existingFiles.length > 0 || formData.newFiles.length > 0;

    if (method === "write" && hasFiles) {
      if (
        window.confirm(
          "직접 작성으로 변경하시겠습니까? 기존 파일들과 새로 추가한 파일들이 제거됩니다."
        )
      ) {
        setFormData((prev) => ({
          ...prev,
          existingFiles: [],
          newFiles: [],
          filesToDelete: [...prev.filesToDelete, ...prev.existingFiles],
        }));
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
      companyLogo: null, // 기존 로고도 제거
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

      // 썸네일 업로드
      let thumbnailUrl = null;
      if (formData.thumbnailFile) {
        console.log("썸네일 업로드 중...");
        const { uploadFile } = await import("../firebase/storage");
        thumbnailUrl = await uploadFile(
          formData.thumbnailFile,
          `thumbnails/${currentUser.uid}/${Date.now()}_${formData.thumbnailFile.name}`
        );
        console.log("썸네일 업로드 완료:", thumbnailUrl);
      }

      // 회사 로고 업로드
      let companyLogoUrl = null;
      if (formData.companyLogoFile) {
        console.log("회사 로고 업로드 중...");
        const { uploadFile } = await import("../firebase/storage");
        companyLogoUrl = await uploadFile(
          formData.companyLogoFile,
          `company-logos/${currentUser.uid}/${Date.now()}_${formData.companyLogoFile.name}`
        );
        console.log("회사 로고 업로드 완료:", companyLogoUrl);
      }

      // 최종 파일 목록 (기존 파일 + 새 파일)
      const finalFiles = [...formData.existingFiles, ...newFileUrls];

      // Firestore에 서비스 정보 업데이트
      const updateData = {
        // 기본 정보
        serviceName: formData.serviceName.trim(),
        companyWebsite: formData.companyWebsite.trim() || null,
        pricingOptions: formData.isPricingOptional ? null : formData.pricingOptions.filter(option => option.name.trim() && option.price.trim()),
        isPricingOptional: formData.isPricingOptional,
        serviceRegion: formData.serviceRegion.trim(),
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
        files: finalFiles,
        thumbnail: thumbnailUrl,
        companyLogo: companyLogoUrl,

        // 업로드 방식 및 직접 작성 내용
        uploadMethod: uploadMethod,
        directContent: uploadMethod === "write" ? directContent.trim() : null,

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

            <FileManagementSection
              formData={formData}
              handleExistingFileRemove={handleExistingFileRemove}
              handleNewFileUpload={handleNewFileUpload}
              handleNewFileRemove={handleNewFileRemove}
              directContent={directContent}
              handleDirectContentChange={handleDirectContentChange}
              uploadMethod={uploadMethod}
              handleUploadMethodChange={handleUploadMethodChange}
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
