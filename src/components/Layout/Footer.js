import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const FooterContainer = styled.footer`
  padding: 60px 20px 30px;
  background-color: ${(props) => props.theme.colors.gray[900]};
  color: ${(props) => props.theme.colors.gray[300]};
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};
  padding-bottom: 8px;
`;

const FooterLink = styled(Link)`
  color: ${(props) => props.theme.colors.gray[300]};
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ExternalLink = styled.a`
  color: ${(props) => props.theme.colors.gray[300]};
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CompanyInfo = styled.div`
  line-height: 1.6;
  margin-bottom: 20px;
`;

const InfoItem = styled.p`
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.gray[700]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${(props) => props.theme.colors.gray[700]};
  padding-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: ${(props) => props.theme.colors.gray[400]};
  font-size: 0.9rem;
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LegalLink = styled(Link)`
  color: ${(props) => props.theme.colors.gray[400]};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const StructuredData = styled.script``;

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
                <InfoItem>
                  <strong>대표번호:</strong> 010-3682-1146
                </InfoItem>
                <InfoItem>
                  <strong>이메일:</strong> support@lookpick.com
                </InfoItem>
                <InfoItem>
                  <strong>주소:</strong> 경기도 용인시 만현로 67번길 19
                </InfoItem>
              </CompanyInfo>

              <SocialLinks>
                <SocialLink
                  href="https://www.facebook.com/lookpick"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="페이스북"
                >
                  📘
                </SocialLink>
                <SocialLink
                  href="https://www.instagram.com/lookpick"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="인스타그램"
                >
                  📷
                </SocialLink>
                <SocialLink
                  href="https://www.linkedin.com/company/lookpick"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="링크드인"
                >
                  💼
                </SocialLink>
                <SocialLink
                  href="https://blog.lookpick.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="블로그"
                >
                  📝
                </SocialLink>
              </SocialLinks>
            </FooterSection>

            {/* 서비스 링크 */}
            <FooterSection>
              <SectionTitle>서비스</SectionTitle>
              <FooterLink to="/">홈</FooterLink>
              <FooterLink to="/services">전체 서비스</FooterLink>
              <FooterLink to="/categories/디자인">디자인</FooterLink>
              <FooterLink to="/categories/개발">개발</FooterLink>
              <FooterLink to="/categories/마케팅">마케팅</FooterLink>
              <FooterLink to="/categories/번역">번역</FooterLink>
              <FooterLink to="/categories/컨설팅">컨설팅</FooterLink>
              <FooterLink to="/service-register">서비스 등록</FooterLink>
            </FooterSection>

            {/* 고객 지원 */}
            <FooterSection>
              <SectionTitle>고객 지원</SectionTitle>
              <FooterLink to="/help">도움말</FooterLink>
              <FooterLink to="/faq">자주 묻는 질문</FooterLink>
              <FooterLink to="/contact">문의하기</FooterLink>
              <FooterLink to="/guide/buyer">구매자 가이드</FooterLink>
              <FooterLink to="/guide/seller">판매자 가이드</FooterLink>
              <FooterLink to="/safety">안전 거래</FooterLink>
              <FooterLink to="/dispute">분쟁 해결</FooterLink>
            </FooterSection>

            {/* 회사 정보 */}
            <FooterSection>
              <SectionTitle>회사</SectionTitle>
              <FooterLink to="/about">회사 소개</FooterLink>
              <FooterLink to="/careers">채용 정보</FooterLink>
              <FooterLink to="/press">보도자료</FooterLink>
              <FooterLink to="/partners">파트너십</FooterLink>
              <ExternalLink
                href="https://blog.lookpick.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                블로그
              </ExternalLink>
              <FooterLink to="/sitemap">사이트맵</FooterLink>
            </FooterSection>
          </FooterTop>

          <FooterBottom>
            <Copyright>
              &copy; {currentYear} LookPick. All rights reserved. |
              사업자등록번호: 663-40-01505 | 통신판매업신고: 2024-서울강남-1234
            </Copyright>

            <LegalLinks>
              <LegalLink to="/terms">이용약관</LegalLink>
              <LegalLink to="/privacy">개인정보처리방침</LegalLink>
              <LegalLink to="/cookies">쿠키 정책</LegalLink>
              <LegalLink to="/legal">법적 고지</LegalLink>
            </LegalLinks>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>
    </>
  );
};

export default Footer;
