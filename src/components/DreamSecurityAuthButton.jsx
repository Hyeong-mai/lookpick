import React from 'react';
import styled from 'styled-components';

const AuthButton = styled.button`
  padding: 14px 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;
  min-width: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  ${props => props.isVerified && `
    background: #10B981;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}

  ${props => props.isProcessing && `
    background: #F59E0B;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}
`;

const DreamSecurityAuthButton = ({ 
  onAuthSuccess, 
  onAuthError, 
  isVerified = false,
  isProcessing = false,
  disabled = false,
  userId = null,
  email = null
}) => {
  const handleAuth = async () => {
    try {
      // 필수 파라미터 확인
      if (!userId || !email) {
        const errorMessage = '사용자 정보가 누락되었습니다.';
        console.error(errorMessage, { userId, email });
        if (onAuthError) {
          onAuthError(errorMessage);
        }
        return;
      }

      console.log('MOK 인증 요청 시작:', { userId, email });

      // HTTP Function 호출 - 환경에 따라 동적으로 URL 결정
      const isLocalhost = window.location.hostname === 'localhost';
      const functionUrl = isLocalhost 
        ? 'https://mokapi-3fvo36t3iq-uc.a.run.app/mok/mok_std_request'
        : 'https://mokapi-3fvo36t3iq-uc.a.run.app/mok/mok_std_request';
      
      console.log('요청 URL:', functionUrl);
      console.log('현재 도메인:', window.location.hostname);
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Referer': window.location.href,
        },
        body: JSON.stringify({
          userId: userId,
          email: email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('MOK 인증 요청 성공:', result);

      if (result.success && result.data) {
        const authRequestObject = result.data;

        // MOK 표준창 팝업 열기
        const authWindow = window.open(
          'about:blank',
          'DreamSecurityAuthPopup',
          'width=500,height=600,scrollbars=yes,resizable=yes,scrollbars=yes'
        );

        if (authWindow) {
          // MOK 표준창 연동을 위한 폼 생성 및 제출
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://scert.mobile-ok.com/gui/service/v1/auth'; // 운영 환경 URL
          
          console.log('MOK 표준창 요청 정보:', authRequestObject);

          // authRequestObject의 모든 필드를 hidden input으로 추가
          for (const key in authRequestObject) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = typeof authRequestObject[key] === 'object' 
              ? JSON.stringify(authRequestObject[key]) 
              : authRequestObject[key];
            form.appendChild(hiddenField);
          }

          // 폼을 팝업 창에 추가하고 제출
          authWindow.document.body.appendChild(form);
          form.submit();
          console.log('MOK 표준창 폼 제출 완료');

          // 팝업 상태 모니터링
          const checkPopup = setInterval(() => {
            if (authWindow.closed) {
              clearInterval(checkPopup);
              console.log('본인인증 팝업 닫힘');
              
              // 팝업이 닫히면 결과 확인
              // 결과는 Cloud Function의 mokStdResult에서 처리됨
              if (onAuthSuccess) {
                onAuthSuccess();
              }
            }
          }, 500);

          // 팝업 메시지 수신 (MOK에서 postMessage로 결과 전송 시)
          window.addEventListener('message', (event) => {
            console.log('메시지 수신:', event);
            
            if (event.origin === 'https://scert.mobile-ok.com') {
              console.log('MOK 인증 결과 수신:', event.data);
              if (onAuthSuccess) {
                onAuthSuccess(event.data);
              }
              authWindow.close();
            } else if (event.data && event.data.type) {
              // 로컬 결과 처리
              if (event.data.type === 'MOK_SUCCESS') {
                console.log('본인확인 성공:', event.data);
                if (onAuthSuccess) {
                  onAuthSuccess(event.data);
                }
              } else if (event.data.type === 'MOK_ERROR') {
                console.log('본인확인 실패:', event.data);
                if (onAuthError) {
                  onAuthError(event.data.data?.message || '본인확인에 실패했습니다.');
                }
              }
            }
          });

        } else {
          alert('팝업 차단으로 본인인증을 시작할 수 없습니다. 팝업 차단을 해제해주세요.');
          if (onAuthError) {
            onAuthError('팝업 차단');
          }
        }
      } else {
        throw new Error(result.error || '인증 요청 생성에 실패했습니다.');
      }

    } catch (error) {
      console.error('본인인증 HTTP Function 호출 에러:', error);
      const errorMessage = '본인인증 중 오류가 발생했습니다. 다시 시도해 주세요.';
      alert(errorMessage);
      if (onAuthError) {
        onAuthError(errorMessage);
      }
    }
  };

  return (
    <AuthButton
      onClick={handleAuth}
      disabled={disabled || isVerified || isProcessing}
      isVerified={isVerified}
      isProcessing={isProcessing}
    >
      {isVerified 
        ? "인증완료" 
        : isProcessing 
        ? "인증중..." 
        : "본인인증"}
    </AuthButton>
  );
};

export default DreamSecurityAuthButton;
