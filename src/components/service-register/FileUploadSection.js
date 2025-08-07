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

const FileUploadSection = ({
  formData,
  handleFileUpload,
  handleFileRemove,
}) => {
  return (
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
              <span>📎 {file.name}</span>
              <button
                type="button"
                onClick={() => handleFileRemove(index)}
                title="파일 제거"
              >
                ×
              </button>
            </FileItem>
          ))}
        </UploadedFilesList>
      </FormGroup>
    </FormSection>
  );
};

export default FileUploadSection;
