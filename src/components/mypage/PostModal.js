import React from "react";
import styled from "styled-components";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { deleteServiceFiles } from "../../firebase/storage";

// PDF.js 라이브러리
import * as pdfjs from "pdfjs-dist";

// PDF.js Worker 설정 - 동적 버전 매칭
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
console.log("PDF.js 버전:", pdfjs.version);
console.log("Worker URL:", pdfjs.GlobalWorkerOptions.workerSrc);

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: ${(props) => props.theme.borderRadius.xl || "16px"};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.8);
  max-width: ${(props) => props.width || "90vw"};
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  margin: 20px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f3f4;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.colors.primary}60 0%,
      ${(props) => props.theme.colors.primary}80 100%
    );
    border-radius: 4px;

    &:hover {
      background: linear-gradient(
        135deg,
        ${(props) => props.theme.colors.primary}70 0%,
        ${(props) => props.theme.colors.primary}90 100%
      );
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.gray[50]} 0%,
    #f8fafc 100%
  );
  border-radius: ${(props) => props.theme.borderRadius.xl || "16px"}
    ${(props) => props.theme.borderRadius.xl || "16px"} 0 0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${(props) => props.theme.colors.primary}40 50%,
      transparent 100%
    );
  }

  h3 {
    margin: 0;
    color: ${(props) => props.theme.colors.dark};
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.colors.dark} 0%,
      #4a5568 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CloseButton = styled.button`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[600]};
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LightboxContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  animation: scaleIn 0.3s ease-out;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: ${(props) => props.theme.borderRadius.lg};
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }
`;

const LightboxClose = styled.button`
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 12px;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg) scale(1.1);
  }
`;

const LightboxInfo = styled.div`
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 16px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  backdrop-filter: blur(10px);
  text-align: center;

  h4 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const DeleteConfirmContainer = styled.div`
  text-align: center;
  padding: 20px 0;

  p {
    margin-bottom: 20px;
    font-size: 1.1rem;
  }

  .warning {
    color: #ef4444;
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const DeleteActionButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.variant === "danger"
      ? `
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;

  @media (max-width: 1200px) {
    gap: 32px;
    padding: 32px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 30px;
  }

  @media (max-width: 768px) {
    gap: 24px;
    padding: 24px;
  }

  @media (max-width: 480px) {
    gap: 20px;
    padding: 16px;
  }
`;

const ProductImageSection = styled.div`
  position: sticky;
  top: 20px;
  height: fit-content;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    position: static;
    order: 2;
  }
`;

const ProductInfoSection = styled.div`
  padding: 20px 0;
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  overflow-y: auto;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    position: static;
    padding: 0;
    max-height: none;
    overflow-y: visible;
    order: 1;
  }

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f3f4;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.colors.primary}60 0%,
      ${(props) => props.theme.colors.primary}80 100%
    );
    border-radius: 3px;

    &:hover {
      background: linear-gradient(
        135deg,
        ${(props) => props.theme.colors.primary}70 0%,
        ${(props) => props.theme.colors.primary}90 100%
      );
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 12px;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border-left: 4px solid ${(props) => props.theme.colors.primary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #4b5563;
  font-weight: 500;

  .icon {
    font-size: 1.1rem;
  }

  .label {
    font-weight: 600;
    color: #374151;
  }
`;

const PriceSection = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%);
  border-radius: 16px;
  border: 1px solid #e9d5ff;
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 8px;

  .currency {
    font-size: 1.8rem;
    margin-right: 4px;
  }

  .period {
    font-size: 1.2rem;
    font-weight: 500;
    color: #6b7280;
    margin-left: 8px;
  }
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
`;

const CategoryTag = styled.span`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary}15 0%,
    ${(props) => props.theme.colors.primary}25 100%
  );
  color: ${(props) => props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid ${(props) => props.theme.colors.primary}30;
`;

const ProductDescription = styled.div`
  margin-bottom: 32px;

  h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .content {
    font-size: 1rem;
    line-height: 1.7;
    color: #4b5563;
    padding: 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }

  /* React-Quill로 작성된 직접 콘텐츠 스타일 */
  .direct-content {
    font-family: "Arial", sans-serif;

    img {
      max-width: 100%;
      max-height: 400px;
      height: auto;
      border-radius: 8px;
      margin: 16px 0;
      display: block;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      object-fit: contain;
    }

    h1,
    h2,
    h3 {
      margin-top: 24px;
      margin-bottom: 12px;
      font-weight: 600;
      color: #111827;
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
      color: #374151;
    }

    ul,
    ol {
      margin: 12px 0;
      padding-left: 24px;
    }

    li {
      margin-bottom: 6px;
      color: #374151;
    }

    blockquote {
      border-left: 4px solid ${(props) => props.theme.colors.primary};
      margin: 16px 0;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 0 8px 8px 0;
      font-style: italic;
    }

    code {
      background: #f3f4f6;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: "Monaco", "Courier New", monospace;
      font-size: 0.9rem;
    }

    strong {
      font-weight: 600;
      color: #111827;
    }

    em {
      font-style: italic;
    }

    a {
      color: ${(props) => props.theme.colors.primary};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProductActionButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, #667eea 100%);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px ${props.theme.colors.primary}40;
    }
  `
      : `
    background: white;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primary}10;
    }
  `}
`;

const PostModal = ({
  modalType,
  selectedPost,
  closeModal,
  onDeleteSuccess,
}) => {
  const [lightboxImage, setLightboxImage] = React.useState(null);
  console.log(selectedPost);
  // 키보드 이벤트 핸들링
  React.useEffect(() => {
    if (!modalType || !selectedPost) return;

    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        if (lightboxImage) {
          setLightboxImage(null);
        } else {
          closeModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [modalType, selectedPost, lightboxImage, closeModal]);

  if (!modalType || !selectedPost) return null;

  // 미디어 파일 분리 (이미지와 PDF)
  const separateMediaFiles = (files) => {
    if (!files || !Array.isArray(files))
      return { images: [], pdfs: [], otherFiles: [] };

    const images = files.filter((file) => {
      const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();
      return (
        fileType &&
        [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "webp",
          "svg",
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
        ].some((format) => fileType.includes(format) || fileType === format)
      );
    });

    const pdfs = files.filter((file) => {
      const fileType = file.type || file.name?.split(".").pop()?.toLowerCase();
      return (
        fileType &&
        ["pdf", "application/pdf"].some(
          (format) => fileType.includes(format) || fileType === format
        )
      );
    });

    const otherFiles = files.filter(
      (file) => !images.includes(file) && !pdfs.includes(file)
    );

    return { images, pdfs, otherFiles };
  };

  const { images, pdfs, otherFiles } = separateMediaFiles(selectedPost.files);

  // directContent에서 이미지 추출하지 않고 업로드된 이미지만 사용
  const allImages = images;

  console.log("업로드된 이미지:", images.length); // 디버깅용
  console.log("전체 이미지:", allImages.length); // 디버깅용

  const openLightbox = (media) => {
    setLightboxImage(media);
  };

  const openPDF = (pdf) => {
    window.open(pdf.url, "_blank");
  };

  // PDF 페이지를 이미지로 변환하는 컴포넌트
  const PDFToImages = ({ pdf, pdfIndex }) => {
    const [pdfImages, setPdfImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [pageCount, setPageCount] = React.useState(0);

    React.useEffect(() => {
      const loadPDF = async () => {
        try {
          setLoading(true);
          setError(null);

          console.log("PDF 로딩 시작:", pdf.url);

          // Firebase Storage URL을 프록시를 통해 처리
          let pdfUrl = pdf.url;
          if (pdf.url.includes("firebasestorage.googleapis.com")) {
            // URL에서 Firebase Storage 부분을 제거하고 프록시 경로로 변경
            const urlParts = pdf.url.split("firebasestorage.googleapis.com");
            if (urlParts.length > 1) {
              pdfUrl = urlParts[1]; // 프록시를 통해 요청
              console.log("프록시 URL 사용:", pdfUrl);
            }
          }

          // PDF 문서 로드
          const loadingTask = pdfjs.getDocument({
            url: pdfUrl,
            httpHeaders: {
              Accept: "application/pdf",
            },
            withCredentials: false,
          });
          const pdfDoc = await loadingTask.promise;

          console.log("PDF 로딩 성공, 총 페이지:", pdfDoc.numPages);
          setPageCount(pdfDoc.numPages);

          const images = [];

          // 각 페이지를 이미지로 변환
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            try {
              const page = await pdfDoc.getPage(pageNum);
              const scale = 1.5; // 이미지 품질 조절
              const viewport = page.getViewport({ scale });

              // 캔버스 생성
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              // 페이지 렌더링
              const renderContext = {
                canvasContext: context,
                viewport: viewport,
              };

              await page.render(renderContext).promise;

              // 캔버스를 데이터 URL로 변환
              const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

              images.push({
                pageNum,
                dataUrl: imageDataUrl,
                width: viewport.width,
                height: viewport.height,
              });

              console.log(`페이지 ${pageNum}/${pdfDoc.numPages} 변환 완료`);
            } catch (pageError) {
              console.error(`페이지 ${pageNum} 변환 실패:`, pageError);
            }
          }

          setPdfImages(images);
          setLoading(false);
        } catch (err) {
          console.error("PDF 로딩 실패:", err);
          setError(err);
          setLoading(false);
        }
      };

      if (pdf?.url) {
        loadPDF();
      }
    }, [pdf]);

    if (loading) {
      return (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "40px 20px",
            textAlign: "center",
            background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
            color: "#dc2626",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📄</div>
          <div
            style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}
          >
            PDF 변환 중...
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
            {pdf.name || "PDF 문서"}
          </div>
          {pageCount > 0 && (
            <div style={{ fontSize: "0.8rem", marginTop: "8px" }}>
              총 {pageCount}페이지
            </div>
          )}
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            overflow: "hidden",
            background: "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#dc2626",
              }}
            >
              📄 {pdf.name || "PDF 문서"} (변환 실패)
            </div>
            <button
              onClick={() => openPDF(pdf)}
              style={{
                padding: "6px 12px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              새 탭에서 열기
            </button>
          </div>
          <div
            style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⚠️</div>
            <div>PDF 변환에 실패했습니다</div>
            <div style={{ fontSize: "0.8rem", marginTop: "4px" }}>
              새 탭에서 열기를 이용해주세요
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          overflow: "hidden",
          background: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ padding: "16px" }}>
          {pdfImages.map((pageImage, index) => (
            <div
              key={index}
              style={{
                marginBottom: index < pdfImages.length - 1 ? "16px" : "0",
                border: "1px solid #f1f5f9",
                borderRadius: "8px",
                overflow: "hidden",
                background: "white",
              }}
            >
              <img
                src={pageImage.dataUrl}
                alt={`${pdf.name || "PDF"} - 페이지 ${pageImage.pageNum}`}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  cursor: "pointer",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDeletePost = async (postId) => {
    if (!postId) return;

    try {
      console.log("게시물 삭제 시도:", postId);

      // Firestore에서 게시물 삭제
      await deleteDoc(doc(db, "services", postId));

      // Storage에서 파일들도 삭제 (userId 필요)
      if (selectedPost.userId) {
        try {
          await deleteServiceFiles(`services/${selectedPost.userId}/${postId}`);
          console.log("관련 파일들도 삭제됨");
        } catch (fileError) {
          console.warn("파일 삭제 중 일부 오류:", fileError);
        }
      }

      alert("게시물이 성공적으로 삭제되었습니다.");
      closeModal();

      // 부모 컴포넌트에 삭제 완료 알림
      if (onDeleteSuccess) {
        onDeleteSuccess(postId);
      }
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      alert("게시물 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  if (modalType === "preview") {
    return (
      <>
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>서비스 상세 정보</h3>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>

            <ProductContainer>
              {/* 좌측: 미디어 섹션 - 컬럼 형식으로 나열 */}
              <ProductImageSection>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* 이미지들 표시 */}
                  {allImages.map((image, index) => (
                    <div
                      key={`image-${index}`}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "white",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        aspectRatio: "4/3",
                        position: "relative",
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.name || `이미지 ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                          display: "block",
                        }}
                        onClick={() => openLightbox(image)}
                        onMouseOver={(e) => {
                          e.target.style.transform = "scale(1.02)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "scale(1)";
                        }}
                      />
                    </div>
                  ))}

                  {/* PDF들 표시 */}
                  {pdfs.map((pdf, index) => (
                    <PDFToImages
                      key={`pdf-${index}`}
                      pdf={pdf}
                      pdfIndex={index}
                    />
                  ))}

                  {/* 미디어가 없을 때 */}
                  {allImages.length === 0 &&
                    pdfs.length === 0 &&
                    !selectedPost.directContent && (
                      <div
                        style={{
                          border: "2px dashed #d1d5db",
                          borderRadius: "16px",
                          padding: "60px 20px",
                          textAlign: "center",
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                          color: "#6b7280",
                        }}
                      >
                        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
                          📁
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                          등록된 미디어가 없습니다
                        </div>
                      </div>
                    )}

                  {/* directContent HTML 렌더링 표시 */}
                  {selectedPost.directContent && (
                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        overflow: "hidden",
                        background: "white",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        marginTop:
                          allImages.length > 0 || pdfs.length > 0
                            ? "24px"
                            : "0",
                      }}
                    >
                      <div
                        className="direct-content"
                        style={{
                          padding: "24px",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: selectedPost.directContent,
                        }}
                      />
                    </div>
                  )}
                </div>
              </ProductImageSection>

              {/* 우측: 제품 정보 섹션 */}
              <ProductInfoSection>
                <ProductTitle>{selectedPost.serviceName}</ProductTitle>

                <ProductMeta>
                  <MetaItem>
                    <span className="label">등록일:</span>
                    <span>{selectedPost.createdAt}</span>
                  </MetaItem>
                  <MetaItem>
                    <span className="label">조회수:</span>
                    <span>{selectedPost.views}회</span>
                  </MetaItem>
                  <MetaItem>
                    <span className="label">지역:</span>
                    <span>{selectedPost.serviceRegion}</span>
                  </MetaItem>
                  {selectedPost.companyWebsite && (
                    <MetaItem>
                      <span className="label">웹사이트:</span>
                      <span>{selectedPost.companyWebsite}</span>
                    </MetaItem>
                  )}
                </ProductMeta>

                <PriceSection>
                  <Price>
                    <span className="currency">₩</span>
                    {selectedPost.price || "문의"}
                    {selectedPost.price && <span className="period">원</span>}
                  </Price>
                </PriceSection>

                {selectedPost.categories?.length > 0 && (
                  <CategoryTags>
                    {selectedPost.categories.map((category, index) => (
                      <CategoryTag key={index}>{category}</CategoryTag>
                    ))}
                  </CategoryTags>
                )}

                {selectedPost.tags?.length > 0 && (
                  <CategoryTags>
                    {selectedPost.tags.map((tag, index) => (
                      <CategoryTag
                        key={index}
                        style={{
                          background:
                            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                          color: "#0ea5e9",
                          borderColor: "#0ea5e930",
                        }}
                      >
                        #{tag}
                      </CategoryTag>
                    ))}
                  </CategoryTags>
                )}

                <ProductDescription>
                  <h3>📝 서비스 설명</h3>
                  <div className="content">
                    {selectedPost.serviceDescription}
                  </div>
                </ProductDescription>

                {selectedPost.freePostContent && (
                  <ProductDescription>
                    <h3>📋 추가 정보</h3>
                    <div className="content">
                      {selectedPost.freePostContent}
                    </div>
                  </ProductDescription>
                )}

                {/* 직접 작성 콘텐츠 표시 */}

                {otherFiles.length > 0 && (
                  <ProductDescription>
                    <h3>📎 기타 첨부 파일</h3>
                    <div className="content">
                      {otherFiles.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "8px 0",
                            borderBottom:
                              index < otherFiles.length - 1
                                ? "1px solid #e5e7eb"
                                : "none",
                          }}
                        >
                          📄 {file.name || `파일 ${index + 1}`}
                        </div>
                      ))}
                    </div>
                  </ProductDescription>
                )}

                <ActionButtons>
                  <ProductActionButton variant="primary">
                    💬 문의하기
                  </ProductActionButton>
                  <ProductActionButton>❤️ 관심 표시</ProductActionButton>
                </ActionButtons>
              </ProductInfoSection>
            </ProductContainer>
          </ModalContent>
        </ModalOverlay>

        {/* 라이트박스 - 모든 이미지 */}
        {lightboxImage && (
          <LightboxOverlay onClick={() => setLightboxImage(null)}>
            <LightboxContent onClick={(e) => e.stopPropagation()}>
              <LightboxClose onClick={() => setLightboxImage(null)}>
                ×
              </LightboxClose>

              <img
                src={lightboxImage.url}
                alt={lightboxImage.name || "이미지"}
              />

              <LightboxInfo>
                <h4>{lightboxImage.name || "이미지"}</h4>
                <p>클릭하여 닫기 • ESC 키로 나가기</p>
              </LightboxInfo>
            </LightboxContent>
          </LightboxOverlay>
        )}
      </>
    );
  }

  if (modalType === "delete") {
    return (
      <ModalOverlay onClick={closeModal}>
        <ModalContent width="400px" onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <h3>게시물 삭제</h3>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalHeader>
          <DeleteConfirmContainer>
            <p>
              정말로 "{selectedPost.serviceName}" 게시물을 삭제하시겠습니까?
            </p>
            <p className="warning">이 작업은 되돌릴 수 없습니다.</p>
            <ButtonGroup>
              <DeleteActionButton onClick={closeModal}>취소</DeleteActionButton>
              <DeleteActionButton
                variant="danger"
                onClick={() => handleDeletePost(selectedPost.id)}
              >
                삭제
              </DeleteActionButton>
            </ButtonGroup>
          </DeleteConfirmContainer>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return null;
};

export default PostModal;
