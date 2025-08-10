import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.xl};
  width: 95vw;
  height: 95vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px 32px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => props.theme.colors.gray[50]};
  flex-shrink: 0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[500]};
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: ${(props) => props.theme.colors.gray[100]};
    color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const EditorContainer = styled.div`
  flex: 1;
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .quill {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .ql-toolbar {
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    background: ${(props) => props.theme.colors.gray[25]};
    padding: 12px 16px;
    flex-shrink: 0;

    .ql-picker-label {
      color: ${(props) => props.theme.colors.gray[700]};
    }

    .ql-stroke {
      stroke: ${(props) => props.theme.colors.gray[600]};
    }

    .ql-fill {
      fill: ${(props) => props.theme.colors.gray[600]};
    }

    button:hover,
    button:focus {
      color: ${(props) => props.theme.colors.primary};

      .ql-stroke {
        stroke: ${(props) => props.theme.colors.primary};
      }

      .ql-fill {
        fill: ${(props) => props.theme.colors.primary};
      }
    }

    .ql-active {
      color: ${(props) => props.theme.colors.primary};

      .ql-stroke {
        stroke: ${(props) => props.theme.colors.primary};
      }

      .ql-fill {
        fill: ${(props) => props.theme.colors.primary};
      }
    }
  }

  .ql-container {
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: 0 0 8px 8px;
    font-size: 14px;
    line-height: 1.6;
    font-family: "Arial", sans-serif;
    flex: 1;
    display: flex;
    flex-direction: column;

    &.ql-snow {
      border-top: none;
    }
  }

  .ql-editor {
    flex: 1;
    padding: 24px;
    overflow-y: auto;

    &.ql-blank::before {
      color: ${(props) => props.theme.colors.gray[400]};
      font-style: normal;
      left: 24px;
      right: 24px;
    }

    img {
      max-width: 100%;
      max-height: 400px;
      height: auto;
      border-radius: 8px;
      margin: 16px 0;
      display: block;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      object-fit: contain;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    h1,
    h2,
    h3 {
      margin-top: 24px;
      margin-bottom: 12px;
      font-weight: 600;
      color: ${(props) => props.theme.colors.dark};
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.3rem;
    }

    h3 {
      font-size: 1.1rem;
    }

    p {
      margin-bottom: 12px;
      color: ${(props) => props.theme.colors.gray[800]};
    }

    ul,
    ol {
      margin: 12px 0;
      padding-left: 24px;
    }

    li {
      margin-bottom: 6px;
      color: ${(props) => props.theme.colors.gray[800]};
    }

    blockquote {
      border-left: 4px solid ${(props) => props.theme.colors.primary};
      margin: 16px 0;
      padding: 12px 16px;
      background: ${(props) => props.theme.colors.gray[50]};
      border-radius: 0 8px 8px 0;
    }

    code {
      background: ${(props) => props.theme.colors.gray[100]};
      padding: 2px 4px;
      border-radius: 4px;
      font-family: "Monaco", "Courier New", monospace;
    }
  }

  .ql-tooltip {
    background: white;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ModalFooter = styled.div`
  padding: 16px 32px;
  border-top: 1px solid ${(props) => props.theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: ${(props) => props.theme.colors.gray[50]};
  flex-shrink: 0;
`;

const FooterButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background: ${props.theme.colors.primaryDark};
    }
  `
      : `
    background: white;
    color: ${props.theme.colors.gray[700]};
    border: 1px solid ${props.theme.colors.gray[300]};
    
    &:hover {
      background: ${props.theme.colors.gray[50]};
    }
  `}
`;

const WordEditorModal = ({ isOpen, onClose, content, onSave }) => {
  const [editorContent, setEditorContent] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const quillRef = useRef(null);

  // 모달이 열릴 때 body 스크롤 비활성화
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // 모달이 닫힐 때 스크롤 복원
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // content prop이 변경될 때만 에디터 내용 업데이트
  useEffect(() => {
    if (isOpen) {
      setEditorContent(content || "");
      // 에디터가 DOM에 마운트될 시간을 줌
      const timer = setTimeout(() => {
        setIsEditorReady(true);
      }, 100);

      return () => {
        clearTimeout(timer);
        setIsEditorReady(false);
      };
    } else {
      setIsEditorReady(false);
    }
  }, [content, isOpen]);

  // 이미지 리사이징 함수를 먼저 정의
  const resizeImage = useCallback((dataUrl, callback) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 최대 높이 설정 (400px)
      const maxHeight = 400;
      const maxWidth = 800; // 최대 너비도 설정

      let { width, height } = img;

      // 높이가 최대치를 초과하면 비율 유지하며 축소
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // 너비가 최대치를 초과하면 비율 유지하며 축소
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // 이미지 품질 향상을 위한 설정
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 캔버스에 리사이징된 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // 더 효율적인 압축 - WebP 지원시 WebP, 아니면 JPEG 70% 품질
      let resizedDataUrl;
      try {
        // WebP 지원 확인 후 사용 (더 효율적인 압축)
        resizedDataUrl = canvas.toDataURL("image/webp", 0.7);
        // WebP가 지원되지 않으면 fallback
        if (!resizedDataUrl.startsWith("data:image/webp")) {
          resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        }
      } catch (error) {
        // WebP 실패시 JPEG 사용
        resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      }

      console.log(
        `이미지 압축 완료: 원본 ${Math.round(
          dataUrl.length / 1024
        )}KB → 압축 ${Math.round(resizedDataUrl.length / 1024)}KB`
      );
      callback(resizedDataUrl);
    };

    img.onerror = () => {
      alert("이미지 처리 중 오류가 발생했습니다.");
      callback(null);
    };

    img.src = dataUrl;
  }, []);

  // 이미지 업로드 핸들러를 useCallback으로 메모이제이션
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", "false");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file && file.type.startsWith("image/")) {
        // 파일 크기 제한을 20MB로 증가 (리사이징 후 크기가 줄어들기 때문)
        if (file.size > 20 * 1024 * 1024) {
          alert("이미지 크기는 20MB 이하여야 합니다.");
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          // 이미지 리사이징 함수 호출
          resizeImage(reader.result, (resizedDataUrl) => {
            const quill = quillRef.current?.getEditor();
            if (quill && resizedDataUrl) {
              try {
                const range = quill.getSelection() || {
                  index: quill.getLength(),
                };
                quill.insertEmbed(range.index, "image", resizedDataUrl);
                quill.setSelection(range.index + 1);
              } catch (error) {
                console.warn("이미지 삽입 중 오류:", error);
              }
            }
          });
        };
        reader.onerror = () => {
          alert("이미지 업로드 중 오류가 발생했습니다.");
        };
        reader.readAsDataURL(file);
      }
    };
  }, [resizeImage]);

  // React-Quill 모듈 설정을 메모이제이션
  const modules = React.useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ color: [] }, { background: [] }],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  // React-Quill 포맷 설정
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
    "image",
    "color",
    "background",
  ];

  const handleSave = useCallback(() => {
    onSave(editorContent);
    onClose();
  }, [editorContent, onSave, onClose]);

  const handleContentChange = useCallback((content) => {
    setEditorContent(content);
  }, []);

  // 모달이 닫힐 때 정리
  const handleClose = useCallback(() => {
    setEditorContent("");
    setIsEditorReady(false);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <ModalContainer className="modal-container">
        <ModalHeader>
          <h2>📝 서비스 소개 작성</h2>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </ModalHeader>

        <ModalBody>
          <EditorContainer>
            {isEditorReady && (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editorContent}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                placeholder="여기에 서비스 소개를 작성해주세요..."
                bounds=".modal-container"
                preserveWhitespace={true}
              />
            )}
            {!isEditorReady && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                }}
              >
                <div>에디터를 로딩 중입니다...</div>
              </div>
            )}
          </EditorContainer>
        </ModalBody>

        <ModalFooter>
          <FooterButton onClick={handleClose}>취소</FooterButton>
          <FooterButton variant="primary" onClick={handleSave}>
            저장하기
          </FooterButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default WordEditorModal;
