import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ResultContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.gray[50]};
`;

const ResultCard = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const ResultTitle = styled.h1`
  color: ${(props) => props.theme.colors.dark};
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const ResultMessage = styled.p`
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 1.1rem;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const StatusIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${(props) => props.theme.colors.gray[200]};
  border-radius: 50%;
  border-top-color: ${(props) => props.theme.gradients.primary};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const AuthResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const token = params.get('token'); // Firebase Custom Token
    const message = params.get('message');

    // 처리 시간을 시뮬레이션하기 위한 지연
    setTimeout(() => {
      if (status === 'success' && token) {
        setResult({
          success: true,
          message: '본인인증이 성공적으로 완료되었습니다.',
          token: token
        });
        
        // TODO: 토큰으로 Firebase Auth에 로그인
        // import { getAuth, signInWithCustomToken } from 'firebase/auth';
        // const auth = getAuth();
        // signInWithCustomToken(auth, token)
        //   .then((userCredential) => {
        //     console.log('Firebase Custom Token 로그인 성공:', userCredential.user);
        //     navigate('/dashboard'); // 대시보드로 이동
        //   })
        //   .catch((error) => {
        //     console.error('Firebase Custom Token 로그인 실패:', error);
        //     navigate('/login');
        //   });
        
        // 임시로 3초 후 대시보드로 이동
        setTimeout(() => {
          alert('본인인증 및 로그인 성공!');
          navigate('/dashboard'); // 임시
        }, 3000);
        
      } else {
        const errorMessage = message || '알 수 없는 오류가 발생했습니다.';
        console.error('본인인증 실패:', errorMessage);
        setResult({
          success: false,
          message: `본인인증 실패: ${errorMessage}`,
          error: errorMessage
        });
        
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
      setIsProcessing(false);
    }, 2000); // 2초 지연

  }, [location, navigate]);

  if (isProcessing) {
    return (
      <ResultContainer>
        <ResultCard>
          <LoadingSpinner />
          <ResultTitle>본인인증 결과 처리 중</ResultTitle>
          <ResultMessage>
            인증 결과를 확인하고 있습니다.<br />
            잠시만 기다려주세요...
          </ResultMessage>
        </ResultCard>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer>
      <ResultCard>
        {result?.success ? (
          <>
            <StatusIcon>✅</StatusIcon>
            <ResultTitle>본인인증 성공!</ResultTitle>
            <ResultMessage>
              {result.message}<br />
              잠시 후 대시보드로 이동합니다.
            </ResultMessage>
          </>
        ) : (
          <>
            <StatusIcon>❌</StatusIcon>
            <ResultTitle>본인인증 실패</ResultTitle>
            <ResultMessage>
              {result?.message}<br />
              잠시 후 로그인 페이지로 이동합니다.
            </ResultMessage>
          </>
        )}
      </ResultCard>
    </ResultContainer>
  );
};

export default AuthResultPage;

