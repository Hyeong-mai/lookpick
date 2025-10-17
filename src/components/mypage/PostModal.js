import React from "react";
import styled from "styled-components";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { deleteServiceFiles } from "../../firebase/storage";
import NotificationModal from "../common/NotificationModal";
import { 
  deletePdfConversionService 
} from "../../services/pdfConverter";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes fadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(12px);
    }
  }
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 
    0 32px 64px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  max-width: ${(props) => props.width || "95vw"};
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  margin: 20px;
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.isScrolled ? '12px 20px 12px' : '12px 20px 12px'};
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
  backdrop-filter: blur(10px);
  transition: padding 0.3s ease;
  z-index: 100;

  h3 {
    margin: 0;
    color: #0f172a;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    transition: font-size 0.3s ease;
  }
`;

const CloseButton = styled.button`

  font-size:1.25rem;
  cursor: pointer;
  color: #64748b;


  width: ${props => props.isScrolled ? '36px' : '44px'};
  height: ${props => props.isScrolled ? '36px' : '44px'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;


  &:hover {



    transform: scale(1.05);

  }

  &:active {
    transform: scale(0.95);
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
  gap: 28px;
  padding: 40px;

  @media (max-width: 1200px) {
    gap: 40px;
    padding: 32px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
  }

  @media (max-width: 768px) {
    gap: 24px;
    padding: 20px;
  }

  @media (max-width: 480px) {
    gap: 20px;
    padding: 16px;
  }
`;

const ProductImageSection = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding: 20px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-height: 300px;
    order: 2;
  }
`;

const ProductInfoSection = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  padding: 20px 20px 0 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    max-height: 400px;
    order: 1;
  }
`;

const ProductTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
  line-height: 1.2;
  letter-spacing: -0.025em;

  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    height: 180px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    height: 160px;
    margin-bottom: 16px;
  }
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;

  .icon {
    font-size: 1rem;
    color: #94a3b8;
  }

  .label {
    font-weight: 600;
    color: #475569;
  }
`;

const PriceSection = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const Price = styled.div`
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;

  .currency {
    font-size: 1.5rem;
    margin-right: 4px;
    color: #64748b;
  }

  .period {
    font-size: 1rem;
    font-weight: 500;
    color: #64748b;
    margin-left: 8px;
  }
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
`;

const CategoryTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  
`;

const ProductDescription = styled.div`
  margin-bottom: 32px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .content {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #475569;
    padding: 20px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
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
      border-left: 4px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
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
      background: ${(props) => props.theme.gradients.primary};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ActionButtons = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 12px;
  padding: 20px;
  margin-top: 20px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProductActionButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  ${(props) =>
    props.variant === "primary"
      ? `
    background: #0f172a;
    color: white;
    border: none;
    
    &:hover {
      background: #1e293b;
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(15, 23, 42, 0.3);
    }
  `
      : `
    background: #ffffff;
    color: #475569;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
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
  const [isHeaderScrolled, setIsHeaderScrolled] = React.useState(false);
  const [thumbnailError, setThumbnailError] = React.useState(false);
  const [notificationModal, setNotificationModal] = React.useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    showCancel: false,
  });

  // 스크롤 감지를 위한 useEffect
  React.useEffect(() => {
    if (!modalType || !selectedPost) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsHeaderScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [modalType, selectedPost]);

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

  // PDF를 이미지로 변환하는 컴포넌트 (클라이언트 사이드 렌더링)
  const PDFToImages = ({ pdf }) => {
    const [pdfImages, setPdfImages] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      const convertPDF = async () => {
        try {
          setLoading(true);
          setError(null);

          console.log("PDF 클라이언트 변환 시작:", pdf.url);

          // pdfjs-dist를 동적으로 로드
          const pdfjsLib = await import('pdfjs-dist');
          
          // Worker 설정을 동일한 버전으로 처리
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

          // PDF 문서 로드
          const loadingTask = pdfjsLib.getDocument({
            url: pdf.url,
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
          });

          const pdfDoc = await loadingTask.promise;
          console.log('PDF 로딩 성공, 총 페이지:', pdfDoc.numPages);

          const images = [];

          // 각 페이지를 캔버스로 렌더링
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            // 캔버스 생성
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // 페이지 렌더링
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;

            // 캔버스를 데이터 URL로 변환
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

            images.push({
              pageNumber: pageNum,
              dataUrl: dataUrl,
              width: viewport.width,
              height: viewport.height,
            });

            console.log(`페이지 ${pageNum}/${pdfDoc.numPages} 변환 완료`);
          }

          setPdfImages(images);
          setLoading(false);
        } catch (err) {
          console.error("PDF 변환 실패:", err);
          setError(err);
          setLoading(false);
        }
      };

      if (pdf?.url) {
        convertPDF();
      } else {
        setLoading(false);
        setError(new Error('PDF URL이 없습니다.'));
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
          {pdfImages.length > 0 && (
            <div style={{ fontSize: "0.8rem", marginTop: "8px" }}>
              총 {pdfImages.length}페이지
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
              {pdf.name || "PDF 문서"} (변환 실패)
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
            <div style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}>
              PDF 이미지 변환 기능을 사용하려면
            </div>
            <div style={{ fontSize: "0.9rem", marginBottom: "16px" }}>
              Firebase Console에서 Storage CORS 설정이 필요합니다
            </div>
            <div style={{ fontSize: "0.8rem", marginBottom: "20px", color: "#9ca3af" }}>
              설정 방법: Firebase Console → Storage → Rules → CORS 설정 추가
            </div>
            <button
              onClick={() => openPDF(pdf)}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
              }}
            >
              새 탭에서 PDF 열기
            </button>
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
                alt={`${pdf.name || "PDF"} - 페이지 ${pageImage.pageNumber}`}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // 이미지 클릭 시 라이트박스로 표시
                  setLightboxImage({
                    url: pageImage.dataUrl,
                    name: `${pdf.name || "PDF"} - 페이지 ${pageImage.pageNumber}`,
                  });
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

        // PDF 변환 결과도 삭제
        try {
          await deletePdfConversionService(postId, selectedPost.userId);
          console.log("PDF 변환 결과도 삭제됨");
        } catch (pdfError) {
          console.warn("PDF 변환 결과 삭제 중 일부 오류:", pdfError);
        }
      }

      setNotificationModal({
        isOpen: true,
        title: "삭제 완료",
        message: "게시물이 성공적으로 삭제되었습니다.",
        type: "success",
        onConfirm: () => {
          closeModal();
          if (onDeleteSuccess) {
            onDeleteSuccess(selectedPost.id);
          }
        },
        showCancel: false,
      });

      // 부모 컴포넌트에 삭제 완료 알림
      if (onDeleteSuccess) {
        onDeleteSuccess(postId);
      }
    } catch (error) {
      console.error("게시물 삭제 실패:", error);
      setNotificationModal({
        isOpen: true,
        title: "오류 발생",
        message: "게시물 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
        onConfirm: null,
        showCancel: false,
      });
    }
  };

  if (modalType === "preview") {
    return (
      <>
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader isScrolled={isHeaderScrolled}>
              <h3>서비스 상세 정보</h3>
              <CloseButton isScrolled={isHeaderScrolled} onClick={closeModal}>×</CloseButton>
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
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                        aspectRatio: "4/3",
                        position: "relative",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 8px 25px -5px rgba(0, 0, 0, 0.1)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
                        e.currentTarget.style.transform = "translateY(0)";
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
                {console.log('썸네일 URL:', selectedPost.thumbnail)}
                {selectedPost.thumbnail && !thumbnailError && (
                  <ThumbnailImage
                    src={selectedPost.thumbnail.url || selectedPost.thumbnail}
                    alt="서비스 썸네일"
                    onClick={() => openLightbox({ 
                      url: selectedPost.thumbnail.url || selectedPost.thumbnail, 
                      name: selectedPost.thumbnail.name || "서비스 썸네일" 
                    })}
                    onError={(e) => {
                      console.error('썸네일 이미지 로드 실패:', selectedPost.thumbnail);
                      console.error('에러 이벤트:', e);
                      setThumbnailError(true);
                    }}
                    onLoad={() => {
                      console.log('썸네일 이미지 로드 성공:', selectedPost.thumbnail);
                      setThumbnailError(false);
                    }}
                  />
                )}
                {selectedPost.thumbnail && thumbnailError && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f8fafc',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    color: '#64748b'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🖼️</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>썸네일 로드 실패</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>이미지를 불러올 수 없습니다</div>
                  </div>
                )}
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
                  {/* 가격 옵션이 있는 경우 */}
                  {selectedPost.pricingOptions && selectedPost.pricingOptions.length > 0 ? (
                    <div>
                      <h3 style={{ 
                        fontSize: "1.25rem", 
                        fontWeight: "700", 
                        color: "#0f172a", 
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        가격 옵션
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {selectedPost.pricingOptions.map((option, index) => (
                          <div
                            key={index}
                            style={{
                              padding: "16px 20px",
                              background: "#ffffff",
                              borderRadius: "12px",
                              border: "1px solid #e2e8f0",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#cbd5e1";
                              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <span style={{ 
                              fontSize: "0.95rem", 
                              fontWeight: "600", 
                              color: "#475569" 
                            }}>
                              {option.name || `옵션 ${index + 1}`}
                            </span>
                            <span style={{ 
                              fontSize: "1.1rem", 
                              fontWeight: "700", 
                              color: "#0f172a"
                            }}>
                              {option.price ? `${option.price}원` : "문의"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* 기존 단일 가격 표시 */
                    <Price>
                      <span className="currency">₩</span>
                      {selectedPost.price || "문의"}
                      {selectedPost.price && <span className="period">원</span>}
                    </Price>
                  )}
                </PriceSection>

                {selectedPost.categories?.length > 0 && (
                  <CategoryTags>
                    {selectedPost.categories.map((categoryId, index) => {
                      // 카테고리 ID를 카테고리명으로 변환
                      const categoryNames = {
                        software: "개발 / 소프트웨어 / IT",
                        design: "디자인 / 콘텐츠 / 마케팅",
                        logistics: "물류 / 운송 / 창고",
                        manufacturing: "제조 / 생산 / 가공",
                        infrastructure: "설비 / 건설 / 유지보수",
                        education: "교육 / 컨설팅 / 인증",
                        office: "사무 / 문서 / 번역",
                        advertising: "광고 / 프로모션 / 행사",
                        machinery: "기계 / 장비 / 산업재",
                        lifestyle: "생활 / 복지 / 기타 서비스"
                      };
                      
                      const categoryName = categoryNames[categoryId] || categoryId;
                      
                      return (
                        <CategoryTag key={index}>{categoryName}</CategoryTag>
                      );
                    })}
                  </CategoryTags>
                )}

                {selectedPost.subcategories?.length > 0 && (
                  <CategoryTags>
                    <div style={{ 
                      fontSize: "0.9rem", 
                      fontWeight: "600", 
                      color: "#6B7280", 
                      marginBottom: "8px",
                      width: "100%"
                    }}>
                      세부 분야:
                    </div>
                    {selectedPost.subcategories.map((subcategoryKey, index) => {
                      // "categoryId:subcategoryName" 형식에서 서브카테고리명만 추출
                      const subcategoryName = subcategoryKey.includes(':') 
                        ? subcategoryKey.split(':')[1] 
                        : subcategoryKey;
                      
                      return (
                        <CategoryTag
                          key={index}
                          style={{
                            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                            color: "#16a34a",
                            borderColor: "#16a34a30",
                            fontSize: "0.85rem",
                            padding: "6px 12px"
                          }}
                        >
                          {subcategoryName}
                        </CategoryTag>
                      );
                    })}
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
                  <h3>서비스 설명</h3>
                  <div className="content">
                    {selectedPost.serviceDescription}
                  </div>
                </ProductDescription>

                {selectedPost.freePostContent && (
                  <ProductDescription>
                    <h3>추가 정보</h3>
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

                {/* ActionButtons를 ProductInfoSection 내부 하단에 고정 */}
                <ActionButtons>
                  <ProductActionButton variant="primary">
                    문의하기
                  </ProductActionButton>
                  <ProductActionButton>관심 표시</ProductActionButton>
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
          <ModalHeader isScrolled={isHeaderScrolled}>
            <h3>게시물 삭제</h3>
            <CloseButton isScrolled={isHeaderScrolled} onClick={closeModal}>×</CloseButton>
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

  return (
    <>
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={() => setNotificationModal(prev => ({ ...prev, isOpen: false }))}
        title={notificationModal.title}
        message={notificationModal.message}
        type={notificationModal.type}
        onConfirm={notificationModal.onConfirm}
        showCancel={notificationModal.showCancel}
      />
    </>
  );
};

export default PostModal;
