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
  border-bottom: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              ${(props) => props.theme.gradients.primary} border-box;
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
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.1);
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

const EditorButton = styled.button`
  width: 100%;
  padding: 15px;
  border: 2px dashed ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: ${(props) => props.theme.colors.gray[50]};
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.gray[100]};
    color: ${(props) => props.theme.colors.primary};
  }

  &.has-content {
    border-style: solid;
    border-color: ${(props) => props.theme.colors.gray[400]};
    background: white;
  }
`;

const ContentPreview = styled.div`
  padding: 15px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background: white;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .content-preview {
    flex: 1;
    color: ${(props) => props.theme.colors.gray[700]};
    font-size: 14px;
    line-height: 1.5;
    max-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    &:empty::before {
      content: "내용이 없습니다";
      color: ${(props) => props.theme.colors.gray[400]};
      font-style: italic;
    }
  }

  .edit-button {
    margin-left: 15px;
    padding: 8px 16px;
    background: ${(props) => props.theme.gradients.primary};
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
`;

const FreePostSection = ({ formData, handleInputChange }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleEditorSave = (content) => {
    // formData 업데이트를 위한 이벤트 객체 생성
    const event = {
      target: {
        name: "freePostContent",
        value: content
      }
    };
    handleInputChange(event);
  };

  const hasContent = formData.freePostContent && formData.freePostContent.trim() !== "";

  return (
    <FormSection>
      <SectionTitle>무료 서비스 종료 시 게시글</SectionTitle>

      <FormGroup>
        <label>유료 서비스 종료 후 표시될 내용</label>
        
        {hasContent ? (
          <ContentPreview>
            <div 
              className="content-preview" 
              dangerouslySetInnerHTML={{ __html: formData.freePostContent }}
            />
            <button 
              className="edit-button" 
              onClick={() => setIsEditorOpen(true)}
            >
              수정
            </button>
          </ContentPreview>
        ) : (
          <EditorButton onClick={() => setIsEditorOpen(true)}>
            <span>유료 서비스가 종료된 후에도 고객에게 보여줄 기본 정보를 작성하세요</span>
            <span>📝</span>
          </EditorButton>
        )}
      </FormGroup>

      <WordEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        content={formData.freePostContent || ""}
        onSave={handleEditorSave}
      />
    </FormSection>
  );
};

export default FreePostSection;
