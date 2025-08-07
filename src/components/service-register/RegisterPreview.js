import React from "react";
import styled from "styled-components";

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
`;

const RegisterPreview = ({
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

        {formData.files.length > 0 && (
          <PreviewSection>
            <h4>첨부 파일</h4>
            <div>
              {formData.files.map((file, index) => (
                <p key={index} style={{ margin: "4px 0", fontSize: "0.85rem" }}>
                  📎 {file.name}
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

export default RegisterPreview;
