import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 2rem 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`;

// const FooterLink = styled.a`
//   color: #fff;
//   text-decoration: none;
//   display: block;
//   margin-bottom: 0.5rem;

//   &:hover {
//     color: #007bff;
//   }
// `;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #555;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>회사 정보</h3>
          <p>주소: 용인시 수지구 만현로 67번길 19</p>
          <p>전화: 010-3682-1146</p>
          <p>이메일: kimmc@noppap.com</p>
        </FooterSection>

        <FooterSection>
          {/* <h3>바로가기</h3>
          <FooterLink href="/">홈</FooterLink>
          <FooterLink href="/about">회사소개</FooterLink>
          <FooterLink href="/products">제품소개</FooterLink> */}
        </FooterSection>

        <FooterSection>
          <h3>영업시간</h3>
          <p>평일: 09:00 - 18:00</p>
          <p>주말 및 공휴일: 휴무</p>
        </FooterSection>
      </FooterContent>

      <Copyright>
        <p>&copy; {new Date().getFullYear()} 룩픽. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
}

export default Footer;
