import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { generateQuoteHTML, downloadQuoteAsPDF } from '../utils/quoteGenerator';

/* eslint-disable no-unused-vars */
const ServiceDetailContainer = styled.div`
  min-height: 100vh;
  background: white;
`;

const DetailContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: white;
`;

const Header = styled.div`
  background: ${props => props.thumbnailUrl ? 
    `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${props.thumbnailUrl}")` : 
    '#000000'
  };
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 40px 40px 20px 40px;
  color: white;

  @media (max-width: 768px) {
    padding: 24px 20px 16px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 16px 12px 16px;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const ServiceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const CompanyLogo = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  background: white;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const ServiceTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.025em;


  @media (max-width: 1024px) {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ServiceMeta = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const MetaTag = styled.span`
  color: white;
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const CategoryTags = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const CategoryTag = styled.span`
  background: rgba(59, 130, 246, 0.2);
  color: white;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  margin-right: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
`;

const SubcategoryTag = styled.span`
  background: rgba(16, 185, 129, 0.2);
  color: white;
  padding: 5px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 16px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  margin-right: 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
`;

const WebsiteButton = styled.a`
  background: #0f172a;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 28px;
  padding: 40px;
  height: auto;

  @media (max-width: 1200px) {
    gap: 40px;
    padding: 32px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 24px;
  }

  @media (max-width: 480px) {
    gap: 20px;
    padding: 16px;
  }
`;

const ProductImageSection = styled.div`
  height: auto;
  padding: 20px;
  background: #f8fafc;

  @media (max-width: 768px) {
    order: 2;
  }
`;

const StickyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
  background: white;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
  }
`;

const StickyLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  background: white;
  border-radius: 8px;
  border: 2px solid #e2e8f0;

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const StickyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const ProductInfoSection = styled.div`
  height: auto;
  padding: 20px 20px 0 20px;
  background: #ffffff;
  position: sticky;
  top: 40px;
  align-self: start;

  @media (max-width: 768px) {
    order: 1;
    position: static;
    top: auto;
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

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
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

    background: #ffffff;
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProductActionButton = styled.button`
  flex: 1;
  padding: 14px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: #0f172a;
    color: white;
    border: none;
    
    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #ef4444;
  font-size: 1.1rem;
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    bottom: 0;
    right: 0;
    border-radius: 0;
  }
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f172a;
  border-radius: 16px 16px 0 0;
`;

const ChatTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const PreparingMessage = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
`;

const PreparingDescription = styled.div`
  font-size: 0.9rem;
  color: #94a3b8;
`;

const QuoteModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

const QuoteModalContent = styled.div`
  background: white;
  border-radius: 0;
  padding: 40px 40px 0 40px;
  max-width: 800px;
  width: 100%;
  height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 24px 24px 0 24px;
    max-width: 95%;
    height: 95vh;
  }
`;

const QuoteModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
`;

const QuoteModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const QuoteCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const QuoteTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  
  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }
  
  th {
    background: #f8fafc;
    font-weight: 600;
    color: #0f172a;
    font-size: 0.9rem;
  }
  
  td {
    color: #475569;
    font-size: 0.95rem;
  }
  
  tr:last-child {
    font-weight: 700;
    color: #0f172a;
    
    td {
      border-bottom: 2px solid #0f172a;
      padding-top: 16px;
    }
  }
`;

const QuoteForm = styled.div`
  margin-top: 16px;
  
  label {
    display: block;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 6px;
    font-size: 0.9rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    margin-bottom: 12px;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
  
  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const QuoteButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 40px;
  border-top: 1px solid #e2e8f0;
  background: white;

  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px 24px;
  }
`;

const QuoteButton = styled.button`
  flex: 1;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${(props) => props.variant === 'primary' ? `
    background: #667eea;
    color: white;
    
    &:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  ` : props.variant === 'secondary' ? `
    background: #f8fafc;
    color: #0f172a;
    
    &:hover {
      background: #e2e8f0;
    }
  ` : `
    background: #0f172a;
    color: white;
    
    &:hover {
      background: #1e293b;
    }
  `}
`;

const ServiceDetailPage = ({ serviceId: propServiceId, isModal = false, onClose }) => {
  const { serviceId: paramServiceId } = useParams();
  const serviceId = propServiceId || paramServiceId; // prop 우선, 없으면 URL 파라미터 사용
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showQuotePreview, setShowQuotePreview] = useState(false);
  const [selectedQuoteOption, setSelectedQuoteOption] = useState(null);
  const [quoteFormData, setQuoteFormData] = useState({
    companyName: '',
    representative: '',
    email: '',
    phone: '',
    requirements: ''
  });
  const pdfCacheRef = React.useRef(new Map());
  const ADMIN_UID = process.env.REACT_APP_ADMIN_UID;

  const loadService = async () => {
    if (!serviceId) {
      setError('서비스 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      console.log('서비스 로드 시작:', serviceId);
      const serviceDoc = await getDoc(doc(db, 'services', serviceId));
      
      if (serviceDoc.exists()) {
        const serviceData = serviceDoc.data();
        console.log('서비스 데이터:', serviceData);
        
        // 서비스 작성자의 사용자 정보도 함께 로드
        let userInfo = null;
        if (serviceData.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', serviceData.userId));
            if (userDoc.exists()) {
              userInfo = userDoc.data();
              console.log('사용자 정보 로드 성공:', userInfo);
            }
          } catch (userErr) {
            console.error('사용자 정보 로드 실패:', userErr);
          }
        }
        
        setService({
          id: serviceDoc.id,
          ...serviceData,
          // 견적서에 필요한 공급자 정보 추가 (user 정보 우선)
          businessNumber: userInfo?.businessNumber || serviceData.businessNumber || '',
          representative: userInfo?.representative || serviceData.representative || '',
          companyAddress: userInfo?.companyAddress || serviceData.companyAddress || '',
          companyName: serviceData.companyName || userInfo?.companyName || '',
        });
      } else {
        setError('서비스를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('서비스 로드 실패:', err);
      setError('서비스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  const handleBack = () => {
    if (isModal && onClose) {
      onClose(); // 모달일 경우 onClose 콜백 호출
    } else {
      navigate(-1); // 일반 페이지일 경우 뒤로 가기
    }
  };

  const handleInquiryClick = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const handleQuoteRequest = (option) => {
    setSelectedQuoteOption(option);
    setShowQuoteModal(true);
  };

  const handleCloseQuoteModal = () => {
    setShowQuoteModal(false);
    setSelectedQuoteOption(null);
    setQuoteFormData({
      companyName: '',
      representative: '',
      email: '',
      phone: '',
      requirements: ''
    });
  };

  const handleQuoteFormChange = (e) => {
    const { name, value } = e.target;
    setQuoteFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const downloadPDF = () => {
    // 필수 입력 확인
    if (!quoteFormData.companyName || !quoteFormData.email || !quoteFormData.phone) {
      alert('회사명, 이메일, 전화번호는 필수 입력 항목입니다.');
      return;
    }

    const htmlContent = generateQuoteHTML(service, selectedQuoteOption, quoteFormData);
    downloadQuoteAsPDF(htmlContent, `${service.serviceName}_견적서`);
  };


  const handleSubmitQuote = () => {
    // 필수 입력 확인
    if (!quoteFormData.companyName || !quoteFormData.email || !quoteFormData.phone) {
      alert('회사명, 이메일, 전화번호는 필수 입력 항목입니다.');
      return;
    }

    console.log('견적서 미리보기 - service:', service);
    console.log('견적서 미리보기 - service.businessNumber:', service.businessNumber);
    console.log('견적서 미리보기 - service.representative:', service.representative);
    console.log('견적서 미리보기 - service.companyAddress:', service.companyAddress);

    // 견적서 미리보기 모달 열기
    setShowQuoteModal(false);
    setShowQuotePreview(true);
  };

  const handleCloseQuotePreview = () => {
    setShowQuotePreview(false);
  };

  const handleDownloadPDFFromPreview = () => {
    console.log('견적서 생성 - service 데이터:', service);
    console.log('견적서 생성 - selectedQuoteOption:', selectedQuoteOption);
    console.log('견적서 생성 - quoteFormData:', quoteFormData);
    const htmlContent = generateQuoteHTML(service, selectedQuoteOption, quoteFormData);
    downloadQuoteAsPDF(htmlContent, `${service.serviceName}_견적서`);
  };

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

    if (loading) {
      return (
        <ServiceDetailContainer>
          <DetailContent>
            <LoadingSpinner>서비스를 불러오는 중...</LoadingSpinner>
          </DetailContent>
        </ServiceDetailContainer>
      );
    }

  if (error) {
    return (
      <ServiceDetailContainer>
        <DetailContent>
          <ErrorMessage>
            <h2>오류 발생</h2>
            <p>{error}</p>
            <button onClick={handleBack}>뒤로 가기</button>
          </ErrorMessage>
        </DetailContent>
      </ServiceDetailContainer>
    );
  }

  if (!service) {
    return (
      <ServiceDetailContainer>
        <DetailContent>
          <ErrorMessage>
            <h2>서비스를 찾을 수 없습니다</h2>
            <p>요청하신 서비스가 존재하지 않습니다.</p>
            <button onClick={handleBack}>뒤로 가기</button>
          </ErrorMessage>
        </DetailContent>
      </ServiceDetailContainer>
    );
  }

  const { images, pdfs, otherFiles } = separateMediaFiles(service.files);
  const allImages = images;

  // PDF를 이미지로 변환하는 컴포넌트 (클라이언트 사이드 렌더링)
  const PDFToImages = React.memo(({ pdf, pdfCacheRef }) => {
    // PDF URL을 메모이제이션하여 안정적인 참조 유지
    const pdfUrl = React.useMemo(() => pdf?.url, [pdf?.url]);
    
    // 초기 상태를 캐시에서 가져오기
    const cachedImages = pdfUrl ? pdfCacheRef.current.get(pdfUrl) : null;
    const [pdfImages, setPdfImages] = React.useState(cachedImages || []);
    const [loading, setLoading] = React.useState(!cachedImages);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      // PDF URL이 실제로 변경되었을 때만 변환 시작
      if (!pdfUrl) {
        setLoading(false);
        setError(new Error('PDF URL이 없습니다.'));
        return;
      }

      // 캐시에서 이미지 데이터 가져오기
      const cachedData = pdfCacheRef.current.get(pdfUrl);
      if (cachedData) {
        console.log('PDF 캐시에서 로드:', pdfUrl);
        setPdfImages(cachedData);
        setLoading(false);
        return;
      }

      const convertPDF = async () => {
        try {
          setLoading(true);
          setError(null);

          console.log("PDF 클라이언트 변환 시작:", pdfUrl);

          // pdfjs-dist를 동적으로 로드
          const pdfjsLib = await import('pdfjs-dist');
          
          // Worker 설정을 동일한 버전으로 처리
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

          // PDF 문서 로드
          const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
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

          // 변환된 이미지를 캐시에 저장
          pdfCacheRef.current.set(pdfUrl, images);
          
          setPdfImages(images);
          setLoading(false);
        } catch (err) {
          console.error("PDF 변환 실패:", err);
          setError(err);
          setLoading(false);
        }
      };

      convertPDF();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdfUrl, pdfCacheRef]);

    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            textAlign: "center",
            color: "black",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "16px"
            }}
          />
          <div
            style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "8px" }}
          >
            PDF 로딩 중...
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
            {pdf.name || "PDF 문서"}
          </div>
          {pdfImages.length > 0 && (
            <div style={{ fontSize: "0.8rem", marginTop: "8px" }}>
              총 {pdfImages.length}페이지
            </div>
          )}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{
            border: "1px solid #e2e8f0",
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
              onClick={() => window.open(pdf.url, "_blank")}
              style={{
                padding: "6px 12px",
                background: "#dc2626",
                color: "white",
                border: "none",
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
            <button
              onClick={() => window.open(pdf.url, "_blank")}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                color: "white",
                border: "none",
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
              />
            </div>
          ))}
        </div>
      </div>
    );
  }, (prevProps, nextProps) => {
    // PDF URL이 동일하면 리렌더링하지 않음
    return prevProps.pdf?.url === nextProps.pdf?.url && 
           prevProps.pdfCacheRef === nextProps.pdfCacheRef;
  });

  return (
    <>
      {showChat && (
        <ChatContainer>
          <ChatHeader>
            <ChatTitle>문의하기</ChatTitle>
            <CloseButton onClick={handleCloseChat}>×</CloseButton>
          </ChatHeader>
          <ChatBody>
            <PreparingMessage>서비스 준비 중입니다</PreparingMessage>
            <PreparingDescription>
              곧 만나볼 수 있어요!
            </PreparingDescription>
          </ChatBody>
        </ChatContainer>
      )}

      {showQuoteModal && (
        <QuoteModalOverlay>
          <QuoteModalContent>
            <QuoteModalHeader>
              <QuoteModalTitle>견적 요청</QuoteModalTitle>
              <QuoteCloseButton onClick={handleCloseQuoteModal}>×</QuoteCloseButton>
            </QuoteModalHeader>

            <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '80px' }}>
              <QuoteTable>
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>서비스명</td>
                    <td>{service.serviceName}</td>
                  </tr>
                  <tr>
                    <td>옵션명</td>
                    <td>{selectedQuoteOption?.name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>가격</td>
                    <td>{selectedQuoteOption?.price ? `${selectedQuoteOption.price.toLocaleString()}원` : '문의'}</td>
                  </tr>
                </tbody>
              </QuoteTable>

              <QuoteForm>
                <label>회사명 *</label>
                <input
                  type="text"
                  name="companyName"
                  value={quoteFormData.companyName}
                  onChange={handleQuoteFormChange}
                  placeholder="회사명을 입력해주세요"
                  required
                />

                <label>대표자</label>
                <input
                  type="text"
                  name="representative"
                  value={quoteFormData.representative}
                  onChange={handleQuoteFormChange}
                  placeholder="대표자 이름을 입력해주세요"
                />

                <label>이메일 *</label>
                <input
                  type="email"
                  name="email"
                  value={quoteFormData.email}
                  onChange={handleQuoteFormChange}
                  placeholder="이메일을 입력해주세요"
                  required
                />

                <label>전화번호 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={quoteFormData.phone}
                  onChange={handleQuoteFormChange}
                  placeholder="전화번호를 입력해주세요"
                  required
                />

                <label>요청사항</label>
                <textarea
                  name="requirements"
                  value={quoteFormData.requirements}
                  onChange={handleQuoteFormChange}
                  placeholder="추가 요청사항이 있다면 작성해주세요"
                />
              </QuoteForm>

              <QuoteButtonGroup>
                <QuoteButton variant="primary" onClick={handleSubmitQuote}>
                  견적서 미리보기
                </QuoteButton>
              </QuoteButtonGroup>
            </div>
          </QuoteModalContent>
        </QuoteModalOverlay>
      )}

      {/* 견적서 미리보기 모달 */}
      {showQuotePreview && (
        <QuoteModalOverlay>
          <QuoteModalContent>
            <QuoteModalHeader>
              <QuoteModalTitle>견적서 미리보기</QuoteModalTitle>
              <QuoteCloseButton onClick={handleCloseQuotePreview}>×</QuoteCloseButton>
            </QuoteModalHeader>

            <div 
              style={{ 
                overflowY: 'auto', 
                flex: 1, 
                paddingBottom: '80px',
                background: '#f5f5f5'
              }}
              dangerouslySetInnerHTML={{ 
                __html: generateQuoteHTML(service, selectedQuoteOption, quoteFormData) 
              }}
            />

            <QuoteButtonGroup>
              <QuoteButton variant="primary" onClick={handleDownloadPDFFromPreview}>
                PDF 다운로드
              </QuoteButton>
              <QuoteButton onClick={handleCloseQuotePreview}>
                닫기
              </QuoteButton>
            </QuoteButtonGroup>
          </QuoteModalContent>
        </QuoteModalOverlay>
      )}
      
      <ServiceDetailContainer>
        <DetailContent>
          <Header thumbnailUrl={service.thumbnail?.url || service.thumbnail}>
          <BackButton onClick={handleBack}>
            ← 뒤로 가기
          </BackButton>
          
          <ServiceHeader>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                {service.companyLogo && (
                  <CompanyLogo
                    src={service.companyLogo.url || service.companyLogo}
                    alt="회사 로고"
                  />
                )}
                <ServiceTitle>
                  {service.serviceName}
                </ServiceTitle>
              </div>
              
              {/* 카테고리 및 태그 표시 */}
              <CategoryTags>
                {/* 관리자가 작성한 서비스가 아닐 때만 카테고리/서브카테고리 표시 */}
                {service.userId !== ADMIN_UID && (
                  <>
                    {/* 카테고리 섹션 */}
                    {service.categories?.length > 0 && (
                      <div>
                        {service.categories.map((categoryId, index) => {
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
                            <CategoryTag key={index}>
                              {categoryName}
                            </CategoryTag>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* 서브카테고리 섹션 */}
                    {service.subcategories?.length > 0 && (
                      <div>
                        {service.subcategories.map((subcategoryKey, index) => {
                          // "categoryId:subcategoryName" 형식에서 서브카테고리명만 추출
                          const subcategoryName = subcategoryKey.includes(':') 
                            ? subcategoryKey.split(':')[1] 
                            : subcategoryKey;
                          
                          return (
                            <SubcategoryTag key={index}>
                              {subcategoryName}
                            </SubcategoryTag>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
                
                {/* 태그 섹션 - admin 여부 상관없이 항상 표시 */}
                {service.tags && service.tags.length > 0 && (
                  <div>
                    {service.tags.map((tag, index) => (
                      <CategoryTag key={index}>
                        {tag}
                      </CategoryTag>
                    ))}
                  </div>
                )}
              </CategoryTags>
                  <ServiceMeta>
                 <MetaTag>
                   등록일: {service.createdAt ? new Date(service.createdAt.seconds * 1000).toLocaleDateString('ko-KR') : '정보 없음'}
                 </MetaTag>
                 <MetaTag>
                   조회수: {service.views || 0}회
                 </MetaTag>
                 <MetaTag>
                   지역: {service.serviceRegion}
                 </MetaTag>
               </ServiceMeta>
            </div>
          </ServiceHeader>
        </Header>

        <ProductContainer>
          {/* 좌측: 미디어 섹션 */}
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
                  />
                </div>
              ))}

              {/* PDF들 표시 */}
              {pdfs.map((pdf, index) => (
                <PDFToImages
                  key={`pdf-${index}`}
                  pdf={pdf}
                  pdfIndex={index}
                  pdfCacheRef={pdfCacheRef}
                />
              ))}

              {/* 직접 작성 콘텐츠 표시 */}
              {service.directContent && (
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    background: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    marginTop: allImages.length > 0 || pdfs.length > 0 ? "24px" : "0",
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
                      __html: service.directContent,
                    }}
                  />
                </div>
              )}

              {/* 미디어가 없을 때 표시 */}
              {allImages.length === 0 && pdfs.length === 0 && !service.directContent && (
                <div
                  style={{
                  
                    padding: "60px 20px",
                    textAlign: "center",

                    color: "#6b7280",
                  }}
                >
                  <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                    등록된 미디어가 없습니다
                  </div>
                </div>
              )}
            </div>
          </ProductImageSection>

            {/* 우측: 제품 정보 섹션 */}
            <ProductInfoSection>
              {/* 스티키 헤더 - 상시 표시 */}
              <StickyHeader>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {service.companyWebsite && (
                    <div style={{ marginBottom: 12, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                      <WebsiteButton
                        href={service.companyWebsite.startsWith('http') ? service.companyWebsite : `https://${service.companyWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ width: 'auto', maxWidth: '100%', background: 'transparent', padding: '0 8px', color: '#111', border: 'none', boxShadow: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        홈페이지 바로가기
                        <span style={{ display: 'flex', alignItems: 'center', marginLeft: 2, fontSize: '1.1em', color: '#111' }}>▶</span>
                      </WebsiteButton>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                    {service.companyLogo && (
                      <StickyLogo
                        src={service.companyLogo.url || service.companyLogo}
                        alt="회사 로고"
                      />
                    )}
                    <StickyTitle style={{ flexGrow: 1, minWidth: 0, wordBreak: 'break-all', whiteSpace: 'normal' }}>{service.serviceName}</StickyTitle>
                  </div>
                </div>
              </StickyHeader>
                       <ProductDescription>
              <h3>서비스 설명</h3>
              <div className="content">
                {service.serviceDescription}
              </div>
            </ProductDescription>
              {/* 가격 옵션 섹션 - 가장 중요 */}
              <PriceSection>
                {/* 가격 옵션이 있는 경우 */}
                {service.pricingOptions && service.pricingOptions.length > 0 ? (
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
                      가격 옵션 (부가세 미포함)
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                      {service.pricingOptions.map((option, index) => {
                        return (
                        <div
                          key={index}
                          className="pricing-card"
                          style={{
                            minHeight: "120px", // 추가: 카드 hover 시에도 높이 고정
                            padding: "16px 20px",
                            background: "#ffffff",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            textAlign: "center",
                            transition: "all 0.2s ease",
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#667eea";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.15)";
                            const nameElement = e.currentTarget.querySelector('.option-name');
                            const priceElement = e.currentTarget.querySelector('.option-price');
                            const textElement = e.currentTarget.querySelector('.request-text');
                            if (textElement) {
                              textElement.style.opacity = "1";
                              textElement.style.transform = "translate(-50%, -50%)";
                              textElement.style.height = "auto";
                            }
                            if (nameElement) {
                              nameElement.style.display = "none";
                            }
                            if (priceElement) {
                              priceElement.style.display = "none";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.boxShadow = "none";
                            const nameElement = e.currentTarget.querySelector('.option-name');
                            const priceElement = e.currentTarget.querySelector('.option-price');
                            const textElement = e.currentTarget.querySelector('.request-text');
                            if (textElement) {
                              textElement.style.opacity = "0";
                              textElement.style.transform = "translate(-50%, -30%)";
                              textElement.style.height = "0";
                            }
                            if (nameElement) {
                              nameElement.style.display = "block";
                            }
                            if (priceElement) {
                              priceElement.style.display = "block";
                            }
                          }}
                          onClick={() => handleQuoteRequest(option)}
                        >
                          <span 
                            className="option-name"
                            style={{ 
                              fontSize: "0.9rem", 
                              fontWeight: "600", 
                              color: "#475569"
                            }}
                          >
                            {option.name || `옵션 ${index + 1}`}
                          </span>
                          <span 
                            className="option-price"
                            style={{ 
                              fontSize: "1.2rem", 
                              fontWeight: "700", 
                              color: "#0f172a"
                            }}
                          >
                            {option.price ? `${option.price.toLocaleString()}원` : "문의"}
                          </span>
                          <div
                            className="request-text"
                            style={{
                              opacity: 0,
                              transform: "translate(-50%, -50%)",
                              transition: "all 0.2s ease",
                              fontSize: "1.1rem",
                              fontWeight: "700",
                              color: "#667eea",
                              height: "0",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              whiteSpace: "nowrap"
                            }}
                          >
                            견적 요청하기
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                ) : (
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
                      가격 (부가세 포함)
                    </h3>
                    <Price>
                      <span className="currency">₩</span>
                      {service.price ? service.price.toLocaleString() : "문의"}
                      {service.price && <span className="period">원</span>}
                    </Price>
                  </div>
                )}
              </PriceSection>
              
            {/* 서비스 설명 */}
   
              
            {/* 담당자 정보 표시 */}
            {(service.contactName || service.contactPosition || service.contactPhone || service.contactEmail) && (
              <div style={{
                marginBottom: "32px",
                padding: "20px",
                background: "#ffffff",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: "700", 
                  color: "#0f172a", 
                  marginBottom: "16px"
                }}>
                  담당자 정보
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {service.contactName && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9"
                    }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>
                        이름
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: "500", color: "#0f172a" }}>
                        {service.contactName}
                      </span>
                    </div>
                  )}
                  {service.contactPosition && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9"
                    }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>
                        직급
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: "500", color: "#0f172a" }}>
                        {service.contactPosition}
                      </span>
                    </div>
                  )}
                  {service.contactPhone && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9"
                    }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>
                        전화번호
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: "500", color: "#0f172a" }}>
                        {service.contactPhone}
                      </span>
                    </div>
                  )}
                  {service.contactEmail && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0"
                    }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>
                        이메일
                      </span>
                      <span style={{ fontSize: "0.95rem", fontWeight: "500", color: "#0f172a" }}>
                        {service.contactEmail}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {service.freePostContent && (
              <ProductDescription>
                <h3>추가 정보</h3>
                <div className="content">
                  {service.freePostContent}
                </div>
              </ProductDescription>
            )}

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
              <ProductActionButton variant="primary" onClick={handleInquiryClick}>
                문의하기
              </ProductActionButton>
              <ProductActionButton>관심 표시</ProductActionButton>
            </ActionButtons>
          </ProductInfoSection>
        </ProductContainer>
      </DetailContent>

      </ServiceDetailContainer>
    </>
  );
};

export default ServiceDetailPage;