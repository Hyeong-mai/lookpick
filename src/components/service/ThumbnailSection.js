import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

/* eslint-disable no-unused-vars */
const ThumbnailSectionContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray[900]};
  margin-bottom: 16px;
`;

const SectionDescription = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[600]};
  margin-bottom: 20px;
  line-height: 1.5;
`;

const UploadArea = styled.div`
  border: 2px dashed ${(props) => props.theme.colors.gray[300]};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => props.theme.colors.gray[50]};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary}10;
  }

  &.has-image {
    border-style: solid;
    border-color: ${(props) => props.theme.colors.primary};
    background: white;
  }
  
  @media (max-width: 768px) {
    padding: 30px 15px;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: ${(props) => props.theme.colors.gray[400]};
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 40px;
    margin-bottom: 12px;
  }
`;

const UploadText = styled.div`
  font-size: ${(props) => props.theme.fontSize.base};
  color: ${(props) => props.theme.colors.gray[700]};
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[500]};
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  text-align: center;
`;

const PreviewImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid ${(props) => props.theme.colors.gray[200]};
`;

const PreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const PreviewName = styled.div`
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: 500;
  color: ${(props) => props.theme.colors.gray[900]};
`;

const PreviewSize = styled.div`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.colors.gray[600]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: ${(props) => props.theme.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.primary {
    background: ${(props) => props.theme.colors.primary};
    color: white;

    &:hover {
      background: ${(props) => props.theme.colors.primaryDark};
    }
  }

  &.secondary {
    background: ${(props) => props.theme.colors.gray[100]};
    color: ${(props) => props.theme.colors.gray[700]};

    &:hover {
      background: ${(props) => props.theme.colors.gray[200]};
    }
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: ${(props) => props.theme.fontSize.base};
    min-width: 80px;
  }
`;

const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.fontSize.sm};
  margin-top: 8px;
`;

const ThumbnailSection = ({ formData, handleInputChange }) => {
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // 기존 썸네일이 있으면 미리보기에 표시
  useEffect(() => {
    if (formData.thumbnail && !formData.thumbnailFile) {
      setPreviewImage(formData.thumbnail);
    }
  }, [formData.thumbnail, formData.thumbnailFile]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 즉시 로컬 미리보기 표시
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('FileReader 성공:', e.target.result.substring(0, 50) + '...');
      const dataURL = e.target.result;
      
      // 데이터 URL 유효성 검사
      if (dataURL && dataURL.startsWith('data:image/')) {
        // 미리보기 이미지 설정
        setPreviewImage(dataURL);
      } else {
        console.error('유효하지 않은 데이터 URL:', dataURL);
        setError('이미지 파일 형식이 올바르지 않습니다.');
      }
    };
    reader.onerror = () => {
      console.error('FileReader 에러');
      setError('이미지 파일을 읽을 수 없습니다.');
    };
    reader.readAsDataURL(file);

    // 파일 저장 (나중에 업로드용)
    setSelectedFile(file);

    // formData에 파일 정보 저장 (서비스 등록 시 사용)
    handleInputChange({
      target: {
        name: 'thumbnailFile',
        value: file
      }
    });
  };

  const handleRemoveThumbnail = () => {
    handleInputChange({
      target: {
        name: 'thumbnailFile',
        value: null
      }
    });
    // 기존 썸네일도 제거
    handleInputChange({
      target: {
        name: 'thumbnail',
        value: null
      }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreviewImage(null);
    setSelectedFile(null);
    setError("");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ThumbnailSectionContainer>
      <SectionTitle>서비스 썸네일</SectionTitle>
      <SectionDescription>
        서비스를 대표하는 이미지를 업로드해주세요. 고객들이 서비스를 쉽게 인식할 수 있도록 도와줍니다.
      </SectionDescription>

      <UploadArea 
        className={(formData.thumbnailFile || formData.thumbnail) ? 'has-image' : ''}
        onClick={() => fileInputRef.current?.click()}
      >
        {(formData.thumbnailFile || formData.thumbnail) ? (
          <div style={{ 
            padding: '16px', 
            background: '#f8fafc', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                썸네일 이미지
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                {formData.thumbnailFile ? 
                  `${formData.thumbnailFile.name} (${formatFileSize(formData.thumbnailFile.size)})` :
                  '기존 썸네일 파일'
                }
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                변경
              </button>
              <button 
                type="button"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveThumbnail();
                }}
              >
                제거
              </button>
            </div>
          </div>
        ) : (
          <>
            <UploadText>썸네일 이미지 업로드</UploadText>
            <UploadSubtext>
              JPG, PNG, GIF 파일 (최대 5MB)
            </UploadSubtext>
          </>
        )}
      </UploadArea>

      <FileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ThumbnailSectionContainer>
  );
};

export default ThumbnailSection;
