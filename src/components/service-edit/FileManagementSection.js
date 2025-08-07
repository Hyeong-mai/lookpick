import React from "react";
import styled from "styled-components";

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
}) => {
  return (
    <FormSection>
      <SectionTitle>이미지 및 자료 관리</SectionTitle>

      {/* 기존 파일들 */}
      {formData.existingFiles.length > 0 && (
        <FormGroup>
          <label>기존 파일들</label>
          <ExistingFilesList>
            {formData.existingFiles.map((file, index) => (
              <ExistingFileItem key={index}>
                <span>📎 {file.name}</span>
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
            <small>이미지 파일, PDF 지원</small>
          </label>
        </FileUploadArea>

        {/* 새로 추가할 파일들 */}
        <NewFilesList>
          {formData.newFiles.map((file, index) => (
            <NewFileItem key={index}>
              <span>📎 {file.name} (새 파일)</span>
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
    </FormSection>
  );
};

export default FileManagementSection;
