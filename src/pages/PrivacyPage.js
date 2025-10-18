import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";

const PrivacyContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.gray[50]};
  padding: 40px 20px;
`;

const PrivacyContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 20px;
    margin: 0 10px;
  }
`;

const PrivacyTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 30px;
  text-align: center;
  border-bottom: 2px solid ${(props) => props.theme.colors.primary};
  padding-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const PrivacyText = styled.div`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.gray[700]};
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    margin: 20px 0 10px 0;
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    margin: 15px 0 8px 0;
  }
  
  p {
    margin-bottom: 10px;
  }
  
  ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 5px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 0.85rem;
  }
  
  th, td {
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: ${(props) => props.theme.colors.gray[100]};
    font-weight: 600;
  }
  
  strong {
    color: ${(props) => props.theme.colors.dark};
  }
`;

const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>개인정보처리방침 - LookPick</title>
        <meta name="description" content="LookPick 개인정보처리방침" />
      </Helmet>
      
      <PrivacyContainer>
        <PrivacyContent>
          <PrivacyTitle>개인정보처리방침</PrivacyTitle>
          <PrivacyText>
            <h3>개인정보처리방침</h3>
            <p>㈜룩픽(이하 '회사')은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같이 처리방침을 수립하여 공개합니다.</p>
            
            <h4>1. 개인정보의 처리목적</h4>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
            <ul>
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 계약 이행</li>
              <li>결제 및 정기 구독 관리</li>
              <li>고객 상담 및 문의 처리</li>
              <li>마케팅 및 광고 활용</li>
            </ul>
            
            <h4>2. 개인정보의 처리 및 보유기간</h4>
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>수집 항목</th>
                  <th>보유 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>회원 정보</td>
                  <td>이름, 전화번호, 이메일, 사업자등록번호</td>
                  <td>회원 탈퇴 시까지</td>
                </tr>
                <tr>
                  <td>결제 정보</td>
                  <td>결제 내역, 결제 수단</td>
                  <td>전자상거래법에 따른 5년</td>
                </tr>
              </tbody>
            </table>
            
            <h4>3. 개인정보의 제3자 제공</h4>
            <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
            <ul>
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
            
            <h4>4. 개인정보의 안전성 확보조치</h4>
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
            <ul>
              <li>개인정보 암호화</li>
              <li>해킹 등에 대비한 기술적 대책</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>개인정보 처리시스템 등의 접근권한 관리</li>
            </ul>
          </PrivacyText>
        </PrivacyContent>
      </PrivacyContainer>
    </>
  );
};

export default PrivacyPage;
