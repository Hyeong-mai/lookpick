import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const FooterContainer = styled.footer`
  padding: ${(props) => props.theme.spacing.xxl} ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.xl};
  background-color: white;
  border-top: 1px solid ${(props) => props.theme.colors.gray[300]};
  color: black;
  margin-top: auto;
  
  ${(props) => props.theme.media.tablet} {
    padding: ${(props) => props.theme.spacing.xl} ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
  }
  
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.theme.spacing.lg} ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  }
`;

const FooterContent = styled.div`
  // max-width: ${(props) => props.theme.container.large};
  margin: 0 auto;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${(props) => props.theme.gap.xl};
  margin-bottom: ${(props) => props.theme.gap.xl};

  ${(props) => props.theme.media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${(props) => props.theme.gap.lg};
    margin-bottom: ${(props) => props.theme.gap.lg};
  }
  
  ${(props) => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${(props) => props.theme.gap.md};
    margin-bottom: ${(props) => props.theme.gap.md};
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  color: black;
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  margin-bottom: ${(props) => props.theme.spacing.md};
  padding-bottom: ${(props) => props.theme.spacing.xs};
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.base};
    margin-bottom: ${(props) => props.theme.spacing.sm};
  }
`;

const FooterLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  font-size: ${(props) => props.theme.fontSize.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.xs};
    margin-bottom: ${(props) => props.theme.spacing.xs};
  }
`;

const CompanyInfo = styled.div`
  line-height: 1.6;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const InfoItem = styled.p`
  margin-bottom: ${(props) => props.theme.spacing.xs};
  font-size: ${(props) => props.theme.fontSize.sm};
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.xs};
  }
`;


const FooterBottom = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.gray[300]};
  padding-top: ${(props) => props.theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing.md};

  ${(props) => props.theme.media.tablet} {
    gap: ${(props) => props.theme.spacing.sm};
  }
  
  ${(props) => props.theme.media.mobile} {
    flex-direction: column;
    text-align: center;
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const Copyright = styled.p`
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: ${(props) => props.theme.fontSize.sm};
  margin: 0;
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.xs};
    line-height: 1.4;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  flex-wrap: wrap;

  ${(props) => props.theme.media.tablet} {
    gap: ${(props) => props.theme.spacing.sm};
  }
  
  ${(props) => props.theme.media.mobile} {
    justify-content: center;
    gap: ${(props) => props.theme.spacing.sm};
  }
`;

const LegalLink = styled(Link)`
  color: ${(props) => props.theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${(props) => props.theme.fontSize.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize.xs};
  }
`;

const StructuredData = styled.script``;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  ${(props) => props.theme.media.mobile} {
    padding: 24px;
    margin: 16px;
  }
`;

const ModalTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.xl};
  font-weight: 600;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.gray[900]};
  text-align: center;
`;

const ModalText = styled.p`
  font-size: ${(props) => props.theme.fontSize.base};
  color: ${(props) => props.theme.colors.gray[700]};
  line-height: 1.6;
  margin-bottom: 24px;
  text-align: center;
`;

const EmailButton = styled.button`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary} 0%, ${(props) => props.theme.colors.secondary} 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled.button`
  background: transparent;
  color: ${(props) => props.theme.colors.gray[600]};
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: 8px;
  padding: 12px 24px;
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${(props) => props.theme.colors.gray[50]};
    border-color: ${(props) => props.theme.colors.gray[400]};
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 섹션으로 스크롤하는 함수 (Header와 동일)
  const scrollToSection = (sectionId) => {
    // 메인페이지가 아닌 경우 메인페이지로 이동
    if (location.pathname !== '/') {
      navigate('/');
      // 페이지 이동 후 스크롤을 위해 약간의 지연
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // 메인페이지인 경우 바로 스크롤
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleInquiryClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:kimmc@lookpick.co.kr';
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LookPick",
    description:
      "전문 서비스 플랫폼 - 다양한 분야의 전문가들과 연결되어 최적의 서비스를 찾아보세요",
    url: "https://lookpick.com",
    logo: "https://lookpick.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-10-3682-1146",
      contactType: "customer service",
      availableLanguage: "Korean",
    },
    sameAs: [
      "https://www.facebook.com/lookpick",
      "https://www.instagram.com/lookpick",
      "https://www.linkedin.com/company/lookpick",
      "https://blog.lookpick.com",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "용인시 만현로 67번길 19",
      addressLocality: "용인시",
      addressCountry: "KR",
    },
  };

  return (
    <>
      <StructuredData
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FooterContainer role="contentinfo">
        <FooterContent>
          <FooterTop>
            {/* 회사 정보 */}
            <FooterSection>
              <SectionTitle>LookPick</SectionTitle>
              <CompanyInfo>
                <InfoItem>
                  <strong>전문 서비스 플랫폼</strong>
                </InfoItem>
                <InfoItem>
                  다양한 분야의 전문가들과 연결되어
                  <br />
                  최적의 서비스를 찾아보세요
                </InfoItem>
             
              </CompanyInfo>


            </FooterSection>

            {/* 서비스 링크 */}
            <FooterSection>
              <SectionTitle>서비스</SectionTitle>
                <FooterLink to="/services">서비스 목록</FooterLink>
              <FooterLink to="#" onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}>서비스 특징</FooterLink>
              <FooterLink to="#" onClick={(e) => {
                e.preventDefault();
                scrollToSection('categories');
              }}>서비스 카테고리</FooterLink>
              <FooterLink to="#" onClick={(e) => {
                e.preventDefault();
                scrollToSection('pricing');
              }}>구독 플랜</FooterLink>
            </FooterSection>

            {/* 고객 지원 */}
            <FooterSection>
              <SectionTitle>고객 지원</SectionTitle>
              <FooterLink to="/" onClick={handleInquiryClick}>문의하기</FooterLink>
            </FooterSection>

            {/* 회사 정보 */}
            <FooterSection>
              <SectionTitle>연락처</SectionTitle>
              <InfoItem>
                  <strong>대표번호:</strong> 010-3682-1146
                </InfoItem>
                <InfoItem>
                  <strong>이메일:</strong> kimmc@lookpick.co.kr
                </InfoItem>
                <InfoItem>
                  <strong>주소:</strong> 경기도 용인시 만현로 67번길 19
                </InfoItem>
            </FooterSection>
          </FooterTop>

          <FooterBottom>
            <Copyright>
              &copy; {currentYear} LookPick. All rights reserved. |
              사업자등록번호: 663-40-01505 
            </Copyright>

            <LegalLinks>
              <LegalLink to="/terms">이용약관</LegalLink>
              <LegalLink to="/privacy">개인정보처리방침</LegalLink>
            </LegalLinks>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>

      {/* 문의하기 모달 */}
      {isModalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>문의하기</ModalTitle>
            <ModalText>
              문의사항이 있으시면 아래 버튼을 클릭하여<br />
              이메일로 연락해 주세요.
            </ModalText>
            <EmailButton onClick={handleEmailClick}>
              이메일 보내기 (kimmc@lookpick.co.kr)
            </EmailButton>
            <CloseButton onClick={handleCloseModal}>
              닫기
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

    </>
  );
};

export default Footer;
