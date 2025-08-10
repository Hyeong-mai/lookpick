import React, { useState } from "react";
import styled from "styled-components";
import WordEditorModal from "../service-register/WordEditorModal";

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

const MethodSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const MethodButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid
    ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
  background: ${(props) =>
    props.active ? props.theme.colors.primary : "white"};
  color: ${(props) => (props.active ? "white" : props.theme.colors.gray[700])};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) =>
      props.active
        ? props.theme.colors.primaryDark
        : "rgba(59, 130, 246, 0.05)"};
  }

  .icon {
    margin-right: 8px;
    font-size: 1.1rem;
  }
`;

const DirectWriteArea = styled.div`
  margin-top: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.gray[400]};
  }
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
`;

const ExistingFilesList = styled.div`
  margin-bottom: 15px;
`;

const ExistingFileItem = styled.div`
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

const NewFilesList = styled.div`
  margin-top: 15px;
`;

const NewFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: ${(props) => props.theme.colors.blue}20;
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

const FileManagementSection = ({
  formData,
  handleExistingFileRemove,
  handleNewFileUpload,
  handleNewFileRemove,
  directContent,
  handleDirectContentChange,
  uploadMethod,
  handleUploadMethodChange,
}) => {
  const [isWordEditorOpen, setIsWordEditorOpen] = useState(false);

  // 현재 이미지 개수 계산
  const getImageCount = () => {
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

    return existingImages.length + newImages.length;
  };

  // 파일 타입 아이콘 반환
  const getFileIcon = (file) => {
    const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();

    if (
      fileType &&
      (fileType.startsWith("image/") ||
        ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType))
    ) {
      return "🖼️";
    } else if (
      fileType &&
      (fileType === "application/pdf" || fileType === "pdf")
    ) {
      return "📄";
    }
    return "📎";
  };

  // 파일 크기 포맷팅
  const formatFileSize = (size) => {
    if (!size) return "";

    const kb = size / 1024;
    const mb = kb / 1024;

    if (mb >= 1) {
      return `(${mb.toFixed(1)}MB)`;
    } else {
      return `(${Math.round(kb)}KB)`;
    }
  };

  // Word 에디터 모달 열기
  const handleOpenWordEditor = () => {
    setIsWordEditorOpen(true);
  };

  // Word 에디터 모달 닫기
  const handleCloseWordEditor = () => {
    setIsWordEditorOpen(false);
  };

  // Word 에디터에서 저장된 내용 처리
  const handleWordEditorSave = (content) => {
    // HTML 내용을 직접 작성 내용으로 저장
    const event = {
      target: {
        value: content,
      },
    };
    handleDirectContentChange(event);

    // 업로드 방식을 'write'로 변경
    handleUploadMethodChange("write");
  };

  const currentImageCount = getImageCount();

  return (
    <FormSection>
      <SectionTitle>
        서비스 소개 자료
        {uploadMethod === "upload" && currentImageCount > 0 && (
          <small
            style={{
              fontSize: "0.9rem",
              fontWeight: "normal",
              color: "#6b7280",
              marginLeft: "12px",
            }}
          >
            (이미지 {currentImageCount}/3장)
          </small>
        )}
      </SectionTitle>

      {/* 업로드 방식 선택 버튼 */}
      <MethodSelector>
        <MethodButton
          type="button"
          active={uploadMethod === "upload"}
          onClick={() => handleUploadMethodChange("upload")}
        >
          <span className="icon">📎</span>
          파일 업로드
        </MethodButton>
        <MethodButton
          type="button"
          active={uploadMethod === "write"}
          onClick={handleOpenWordEditor}
        >
          <span className="icon">✍️</span>
          직접 작성하기
        </MethodButton>
      </MethodSelector>

      {/* 파일 업로드 섹션 */}
      {uploadMethod === "upload" && (
        <>
          {/* 기존 파일들 */}
          {formData.existingFiles.length > 0 && (
            <FormGroup>
              <label>기존 파일들</label>
              <ExistingFilesList>
                {formData.existingFiles.map((file, index) => (
                  <ExistingFileItem key={index}>
                    <span>
                      {getFileIcon(file)} {file.name}{" "}
                      {formatFileSize(file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleExistingFileRemove(file)}
                      title="파일 삭제"
                    >
                      ×
                    </button>
                  </ExistingFileItem>
                ))}
              </ExistingFilesList>
            </FormGroup>
          )}

          {/* 새 파일 추가 */}
          <FormGroup>
            <label>새 파일 추가</label>
            <FileUploadArea>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleNewFileUpload}
                id="new-file-upload"
              />
              <label htmlFor="new-file-upload">
                📎 파일을 선택하거나 여기로 드래그하세요
                <br />
                <small>이미지: 최대 3장 | PDF: 최대 2MB</small>
              </label>
            </FileUploadArea>

            {/* 새로 추가할 파일들 */}
            <NewFilesList>
              {formData.newFiles.map((file, index) => (
                <NewFileItem key={index}>
                  <span>
                    {getFileIcon(file)} {file.name} {formatFileSize(file.size)}{" "}
                    (새 파일)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleNewFileRemove(index)}
                    title="파일 제거"
                  >
                    ×
                  </button>
                </NewFileItem>
              ))}
            </NewFilesList>
          </FormGroup>
        </>
      )}

      {/* 직접 작성 섹션 - 작성된 내용 미리보기 */}
      {uploadMethod === "write" && (
        <FormGroup>
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            작성된 내용 미리보기
            <button
              type="button"
              onClick={handleOpenWordEditor}
              style={{
                padding: "6px 12px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              ✏️ 수정하기
            </button>
          </label>

          {directContent ? (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                minHeight: "150px",
                backgroundColor: "#f9fafb",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
              dangerouslySetInnerHTML={{ __html: directContent }}
            />
          ) : (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                minHeight: "150px",
                backgroundColor: "#f9fafb",
                color: "#6b7280",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              📝 "직접 작성하기" 버튼을 클릭하여 서비스 소개를 작성해주세요
            </div>
          )}
        </FormGroup>
      )}

      {/* Word 에디터 모달 */}
      <WordEditorModal
        isOpen={isWordEditorOpen}
        onClose={handleCloseWordEditor}
        content={directContent}
        onSave={handleWordEditorSave}
      />
    </FormSection>
  );
};

export default FileManagementSection;
