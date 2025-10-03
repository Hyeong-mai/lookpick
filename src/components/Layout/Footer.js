import React from "react";
import { Link } from "react-router-dom";
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
             
              </CompanyInfo>


            </FooterSection>

            {/* 서비스 링크 */}
            <FooterSection>
              <SectionTitle>서비스</SectionTitle>
              <FooterLink to="/">홈</FooterLink>
              <FooterLink to="/">전체 서비스</FooterLink>
              <FooterLink to="/">서비스 등록</FooterLink>
            </FooterSection>

            {/* 고객 지원 */}
            <FooterSection>
              <SectionTitle>고객 지원</SectionTitle>
              <FooterLink to="/">문의하기</FooterLink>
            </FooterSection>

            {/* 회사 정보 */}
            <FooterSection>
              <SectionTitle>연락처</SectionTitle>
              <InfoItem>
                  <strong>대표번호:</strong> 010-3682-1146
                </InfoItem>
                <InfoItem>
                  <strong>이메일:</strong> support@lookpick.com
                </InfoItem>
                <InfoItem>
                  <strong>주소:</strong> 경기도 용인시 만현로 67번길 19
                </InfoItem>
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
