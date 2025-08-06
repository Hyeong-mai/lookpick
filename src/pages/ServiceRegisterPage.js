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
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};
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
      border-color: ${(props) => props.theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &::placeholder {
      color: ${(props) => props.theme.colors.gray[400]};
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const CategoryItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid
    ${(props) =>
      props.isSelected
        ? props.theme.colors.primary
        : props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) =>
    props.isSelected ? "rgba(59, 130, 246, 0.1)" : "white"};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
  }

  span {
    font-size: 0.9rem;
    color: ${(props) => props.theme.colors.dark};
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 4px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 120px;
`;

const FileUploadArea = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: rgba(59, 130, 246, 0.05);
  }

  input[type="file"] {
    display: none;
  }
`;

const UploadedFilesList = styled.div`
  margin-top: 15px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  margin-bottom: 8px;

  span {
    font-size: 0.9rem;
    color: ${(props) => props.theme.colors.dark};
  }

  button {
    background: none;
    border: none;
    color: ${(props) => props.theme.colors.danger || "#EF4444"};
    cursor: pointer;
    font-size: 1.2rem;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const PreviewContainer = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
  position: sticky;
  top: 20px;
  left: auto;
  right: auto;
  bottom: auto;
  width: ${(props) => (props.isExpanded ? "60vw" : "400px")};
  min-width: ${(props) => (props.isExpanded ? "500px" : "400px")};
  max-width: ${(props) => (props.isExpanded ? "none" : "400px")};
  height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: right center;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    min-width: 100%;
    max-width: auto;
  }
`;

const PreviewHeader = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const PreviewAddButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ExpandedPreviewContent = styled.div`
  padding: 20px;
  max-width: none;
  margin: 0;
  transition: padding 0.3s ease;
  opacity: 1;
  will-change: padding;
`;

const PreviewSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9rem;
    color: ${(props) => props.theme.colors.gray[600]};
    line-height: 1.5;
    margin: 0;
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
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
    }));
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
            {/* 기본 정보 */}
            <FormSection>
              <SectionTitle>기본 정보</SectionTitle>

              <FormGroup>
                <label>서비스/제품명 *</label>
                <input
                  type="text"
                  name="serviceName"
                  placeholder="고객에게 보여질 서비스명을 입력하세요"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>업체 홈페이지</label>
                <input
                  type="url"
                  name="companyWebsite"
                  placeholder="https://example.com"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                />
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
                  <>
                    <label>가격 정보</label>
                    <input
                      type="text"
                      name="price"
                      placeholder="예: 150,000원/박, 문의, 협의 등"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </>
                )}
              </FormGroup>

              <FormGroup>
                <label>서비스 가능 지역 *</label>
                <input
                  type="text"
                  name="serviceRegion"
                  placeholder="예: 서울 전체, 제주도, 부산 해운대구 등"
                  value={formData.serviceRegion}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </FormSection>

            {/* 서비스 설명 */}
            <FormSection>
              <SectionTitle>서비스 설명</SectionTitle>

              <FormGroup>
                <label>상세 설명 *</label>
                <textarea
                  name="serviceDescription"
                  placeholder="고객에게 어필할 수 있는 서비스의 특징, 장점, 제공 내용 등을 자세히 설명해주세요"
                  value={formData.serviceDescription}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>태그 (최대 10개)</label>
                <TagInput
                  type="text"
                  placeholder="태그 입력 후 Enter (예: 예시1, 예시2, 예시3)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagAdd}
                />
                <TagContainer>
                  {formData.tags.map((tag, index) => (
                    <Tag key={index}>
                      #{tag}
                      <button onClick={() => handleTagRemove(tag)}>×</button>
                    </Tag>
                  ))}
                </TagContainer>
              </FormGroup>
            </FormSection>

            {/* 카테고리 선택 */}
            <FormSection>
              <SectionTitle>카테고리 선택 (최대 3개)</SectionTitle>

              <CategoryGrid>
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    isSelected={formData.categories.includes(category.id)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      disabled={
                        !formData.categories.includes(category.id) &&
                        formData.categories.length >= 3
                      }
                    />
                    <span>{category.name}</span>
                  </CategoryItem>
                ))}
              </CategoryGrid>
            </FormSection>

            {/* 파일 업로드 */}
            <FormSection>
              <SectionTitle>이미지 및 자료 업로드</SectionTitle>

              <FormGroup>
                <label>이미지, PDF 파일 등</label>
                <FileUploadArea>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    📎 파일을 선택하거나 여기로 드래그하세요
                    <br />
                    <small>이미지 파일, PDF 지원</small>
                  </label>
                </FileUploadArea>

                <UploadedFilesList>
                  {formData.files.map((file, index) => (
                    <FileItem key={index}>
                      <span>{file.name}</span>
                      <button onClick={() => handleFileRemove(index)}>×</button>
                    </FileItem>
                  ))}
                </UploadedFilesList>
              </FormGroup>
            </FormSection>

            {/* 무료 게시글 */}
            <FormSection>
              <SectionTitle>무료 서비스 종료 시 게시글</SectionTitle>

              <FormGroup>
                <label>유료 서비스 종료 후 표시될 내용</label>
                <textarea
                  name="freePostContent"
                  placeholder="유료 서비스가 종료된 후에도 고객에게 보여줄 기본 정보를 입력하세요"
                  value={formData.freePostContent}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormSection>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "서비스 등록하기"}
            </SubmitButton>
          </form>
        </div>

        {/* 미리보기 */}
        <PreviewContainer isExpanded={isPreviewExpanded}>
          <PreviewHeader>
            <h3>미리보기</h3>
            <PreviewAddButton
              type="button"
              onClick={handlePreviewToggle}
              title={isPreviewExpanded ? "미리보기 축소" : "미리보기 확장"}
              isExpanded={isPreviewExpanded}
            >
              {isPreviewExpanded ? "−" : "+"}
            </PreviewAddButton>
          </PreviewHeader>
          <ExpandedPreviewContent isExpanded={isPreviewExpanded}>
            <PreviewSection>
              <h4>서비스명</h4>
              <p>{formData.serviceName || "서비스명이 여기에 표시됩니다"}</p>
            </PreviewSection>

            {formData.companyWebsite && (
              <PreviewSection>
                <h4>홈페이지</h4>
                <p>{formData.companyWebsite}</p>
              </PreviewSection>
            )}

            {!formData.isPricingOptional && formData.price && (
              <PreviewSection>
                <h4>가격</h4>
                <p>{formData.price}</p>
              </PreviewSection>
            )}

            <PreviewSection>
              <h4>서비스 지역</h4>
              <p>
                {formData.serviceRegion || "서비스 지역이 여기에 표시됩니다"}
              </p>
            </PreviewSection>

            <PreviewSection>
              <h4>설명</h4>
              <p>
                {formData.serviceDescription ||
                  "서비스 설명이 여기에 표시됩니다"}
              </p>
            </PreviewSection>

            {formData.categories.length > 0 && (
              <PreviewSection>
                <h4>카테고리</h4>
                <p>
                  {formData.categories
                    .map((id) => categories.find((c) => c.id === id)?.name)
                    .join(", ")}
                </p>
              </PreviewSection>
            )}

            {formData.tags.length > 0 && (
              <PreviewSection>
                <h4>태그</h4>
                <TagContainer>
                  {formData.tags.map((tag, index) => (
                    <Tag key={index}>#{tag}</Tag>
                  ))}
                </TagContainer>
              </PreviewSection>
            )}

            {formData.files.length > 0 && (
              <PreviewSection>
                <h4>첨부 파일</h4>
                <p>{formData.files.length}개 파일 업로드됨</p>
              </PreviewSection>
            )}
          </ExpandedPreviewContent>
        </PreviewContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default ServiceRegisterPage;
