import React from "react";
import styled from "styled-components";

/* eslint-disable no-unused-vars */
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
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: right center;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 100%;
    min-width: 100%;
    max-width: auto;
  }
`;

const PreviewHeader = styled.div`
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
   color: white;
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

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
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
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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

const ThumbnailImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
`;

const CompanyLogoImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  background-color: ${(props) => props.theme.colors.gray[50]};
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  padding: 4px 12px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ServicePreview = ({
  formData,
  categories,
  isPreviewExpanded,
  handlePreviewToggle,
}) => {
  return (
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
        {(formData.thumbnailFile || formData.thumbnail) && (
          <PreviewSection>
            <h4>썸네일</h4>
            <div style={{ 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0',
              fontSize: '0.9rem',
              color: '#374151'
            }}>
              {formData.thumbnailFile ? 
                `${formData.thumbnailFile.name} (${(formData.thumbnailFile.size / 1024).toFixed(1)} KB)` :
                '기존 썸네일 파일'
              }
            </div>
          </PreviewSection>
        )}

        {(formData.companyLogoFile || formData.companyLogo) && (
          <PreviewSection>
            <h4>회사 로고</h4>
            <div style={{ 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: '6px', 
              border: '1px solid #e2e8f0',
              fontSize: '0.9rem',
              color: '#374151'
            }}>
              {formData.companyLogoFile ? 
                `${formData.companyLogoFile.name} (${(formData.companyLogoFile.size / 1024).toFixed(1)} KB)` :
                '기존 로고 파일'
              }
            </div>
          </PreviewSection>
        )}

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
          <p>{formData.serviceRegion || "서비스 지역이 여기에 표시됩니다"}</p>
        </PreviewSection>

        {(formData.contactName || formData.contactPosition || formData.contactPhone || formData.contactEmail) && (
          <PreviewSection>
            <h4>담당자 정보</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.9rem" }}>
              {formData.contactName && (
                <div>
                  <strong>이름:</strong> {formData.contactName}
                </div>
              )}
              {formData.contactPosition && (
                <div>
                  <strong>직급:</strong> {formData.contactPosition}
                </div>
              )}
              {formData.contactPhone && (
                <div>
                  <strong>전화번호:</strong> {formData.contactPhone}
                </div>
              )}
              {formData.contactEmail && (
                <div>
                  <strong>이메일:</strong> {formData.contactEmail}
                </div>
              )}
            </div>
          </PreviewSection>
        )}

        <PreviewSection>
          <h4>설명</h4>
          <p>
            {formData.serviceDescription || "서비스 설명이 여기에 표시됩니다"}
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

        {(formData.existingFiles.length > 0 ||
          formData.newFiles.length > 0) && (
          <PreviewSection>
            <h4>첨부 파일</h4>
            <div>
              {formData.existingFiles.map((file, index) => (
                <p
                  key={`existing-${index}`}
                  style={{ margin: "4px 0", fontSize: "0.85rem" }}
                >
                  📎 {file.name}
                </p>
              ))}
              {formData.newFiles.map((file, index) => (
                <p
                  key={`new-${index}`}
                  style={{
                    margin: "4px 0",
                    fontSize: "0.85rem",
                    color: "#3B82F6",
                  }}
                >
                  📎 {file.name} (새 파일)
                </p>
              ))}
            </div>
          </PreviewSection>
        )}

        {formData.freePostContent && (
          <PreviewSection>
            <h4>무료 서비스 종료 시 표시 내용</h4>
            <p>{formData.freePostContent}</p>
          </PreviewSection>
        )}
      </ExpandedPreviewContent>
    </PreviewContainer>
  );
};

export default ServicePreview;
