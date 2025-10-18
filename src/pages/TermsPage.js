import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";

const TermsContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.gray[50]};
  padding: 40px 20px;
`;

const TermsContent = styled.div`
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

const TermsTitle = styled.h1`
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

const TermsText = styled.div`
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

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>서비스 이용약관 - LookPick</title>
        <meta name="description" content="LookPick 서비스 이용약관" />
      </Helmet>
      
      <TermsContainer>
        <TermsContent>
          <TermsTitle>서비스 이용약관</TermsTitle>
          <TermsText>
            <h3>제1조 (목적)</h3>
            <p>이 약관은 ㈜룩픽(이하 '회사')이 제공하는 룩픽(LOOKPICK) 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
            
            <h3>제2조 (용어 정의)</h3>
            <ul>
              <li>'회원'이라 함은 본 약관에 동의하고 회사의 서비스를 이용하는 자를 말합니다.</li>
              <li>'서비스'라 함은 회사가 제공하는 플랫폼을 통해 제공되는 온라인 정보제공, 정기 구독, 결제, 사업 관련 데이터 관리 등의 제반 서비스를 의미합니다.</li>
            </ul>
            
            <h3>제3조 (회원가입)</h3>
            <ul>
              <li>회원은 회사가 요청하는 필수 정보를 제공해야 하며, 허위 정보를 제공할 수 없습니다.</li>
              <li>회사는 내부 기준에 따라 가입을 승인하거나, 부적절한 정보로 판단될 경우 가입을 제한할 수 있습니다.</li>
            </ul>
            
            <h3>제4조 (서비스의 제공 및 변경)</h3>
            <ul>
              <li>회사는 회원에게 데이터 관리, 정보 열람, 정기 구독형 기능 등을 제공합니다.</li>
              <li>회사는 서비스 개선 및 운영상 필요에 따라 일부 서비스를 변경할 수 있습니다.</li>
            </ul>
            
            <h3>제5조 (결제 및 환불)</h3>
            <ul>
              <li>결제는 외부 PG사를 통해 처리되며, 회원은 PG사 정책에 따라 결제 절차를 진행합니다.</li>
              <li>정기 결제 서비스의 해지는 다음 결제일 하루 전까지 가능하며, 이미 결제된 금액은 환불되지 않습니다(단, 서비스 장애 등 회사 귀책 사유 시 예외 적용).</li>
            </ul>
            
            <h3>제6조 (회원의 의무)</h3>
            <ul>
              <li>회원은 서비스 이용 시 법령 및 본 약관을 준수해야 합니다.</li>
              <li>타인의 정보 도용, 불법 복제, 시스템 해킹 등은 금지됩니다.</li>
            </ul>
            
            <h3>제7조 (서비스 중단 및 면책)</h3>
            <ul>
              <li>시스템 점검, 천재지변 등 불가피한 사유로 서비스가 중단될 수 있습니다.</li>
              <li>회사는 회원의 귀책사유로 인한 손해에 대해서는 책임을 지지 않습니다.</li>
            </ul>
            
            <h3>제8조 (약관의 변경)</h3>
            <p>회사는 법령 변경 또는 서비스 개선을 위해 약관을 개정할 수 있으며, 변경 시 사전 공지합니다.</p>
          </TermsText>
        </TermsContent>
      </TermsContainer>
    </>
  );
};

export default TermsPage;
