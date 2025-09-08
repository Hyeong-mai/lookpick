import React, { useState } from 'react';
import styled from 'styled-components';
import DreamSecurityAuthButton from '../components/DreamSecurityAuthButton';

const TestContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid #007bff;
`;

const Title = styled.h1`
  color: #007bff;
  margin: 0 0 10px 0;
  font-size: 24px;
`;

const SubTitle = styled.h2`
  color: #6c757d;
  margin: 0 0 15px 0;
  font-size: 18px;
`;

const InfoBox = styled.div`
  background: #e9ecef;
  padding: 15px;
  border-radius: 6px;
  margin: 10px 0;
  border-left: 4px solid #007bff;
`;

const UrlDisplay = styled.div`
  background: #fff;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
  margin: 10px 0;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const StatusBox = styled.div`
  background: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  padding: 15px;
  border-radius: 6px;
  margin: 20px 0;
  border: 1px solid ${props => props.success ? '#c3e6cb' : '#f5c6cb'};
`;

const MokTestPage = () => {
  const [authStatus, setAuthStatus] = useState('');
  const [authResult, setAuthResult] = useState(null);

  const handleAuthSuccess = (result) => {
    setAuthStatus('success');
    setAuthResult(result);
    console.log('본인확인 성공:', result);
  };

  const handleAuthError = (error) => {
    setAuthStatus('error');
    setAuthResult(error);
    console.error('본인확인 실패:', error);
  };

  return (
    <TestContainer>
      <Header>
        <Title>🔐 Dream Security 본인확인 테스트 페이지</Title>
        <SubTitle>MOK 표준창 연동 테스트</SubTitle>
        <InfoBox>
          <strong>테스트 목적:</strong> Dream Security에서 요청한 본인확인 표준창 연동 테스트
        </InfoBox>
      </Header>

      <InfoBox>
        <strong>📋 현재 페이지 정보:</strong>
        <UrlDisplay>
          <strong>현재 URL:</strong> {window.location.href}
        </UrlDisplay>
        <UrlDisplay>
          <strong>도메인:</strong> {window.location.hostname}
        </UrlDisplay>
        <UrlDisplay>
          <strong>포트:</strong> {window.location.port}
        </UrlDisplay>
        <UrlDisplay>
          <strong>프로토콜:</strong> {window.location.protocol}
        </UrlDisplay>
      </InfoBox>

      <InfoBox>
        <strong>🔗 서버 정보:</strong>
        <UrlDisplay>
          <strong>Firebase Function URL:</strong> https://mokapi-3fvo36t3iq-uc.a.run.app
        </UrlDisplay>
        <UrlDisplay>
          <strong>본인확인 요청 URL:</strong> https://mokapi-3fvo36t3iq-uc.a.run.app/mok/mok_std_request
        </UrlDisplay>
        <UrlDisplay>
          <strong>본인확인 결과 URL:</strong> https://mokapi-3fvo36t3iq-uc.a.run.app/mok/mok_std_result
        </UrlDisplay>
      </InfoBox>

      <ButtonContainer>
        <h3>📱 본인확인 테스트</h3>
        <p>아래 버튼을 클릭하여 본인확인 표준창을 테스트하세요.</p>
        <DreamSecurityAuthButton
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
          userId="test-user-123"
          email="test@lookpick.co.kr"
        />
      </ButtonContainer>

      {authStatus && (
        <StatusBox success={authStatus === 'success'}>
          <strong>
            {authStatus === 'success' ? '✅ 본인확인 성공!' : '❌ 본인확인 실패'}
          </strong>
          <br />
          {authResult && (
            <pre style={{ marginTop: '10px', fontSize: '12px' }}>
              {JSON.stringify(authResult, null, 2)}
            </pre>
          )}
        </StatusBox>
      )}

      <InfoBox>
        <strong>📸 스크린샷 가이드:</strong>
        <ul>
          <li>이 페이지 전체를 스크린샷으로 캡처</li>
          <li>본인확인 버튼 클릭 후 팝업창이 열린 상태 스크린샷</li>
          <li>브라우저 주소창이 보이도록 전체 화면 캡처</li>
          <li>개발자 도구 콘솔 로그도 함께 캡처</li>
        </ul>
      </InfoBox>
    </TestContainer>
  );
};

export default MokTestPage;
