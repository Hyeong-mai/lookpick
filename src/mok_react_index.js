import React, { Component } from 'react';

/* index.html에 설정을 안 할 시 react-helmet 다운 및 주석해제 */
// import {Helmet} from 'react-helmet';

class moK_react_index extends Component {
    componentDidMount() {
        // 인증결과 콜백함수 정의
        const script = document.createElement('script');
        const callbackCode = `
            function result(result) {
                try {
                    result = JSON.parse(result);
                    document.querySelector('#result').value = JSON.stringify(result, null, 4);
                    // 부모 컴포넌트에 결과 전달
                    if (window.parent && window.parent.handleMokResult) {
                        window.parent.handleMokResult(result);
                    }
                } catch (error) {
                    document.querySelector('#result').value = result;
                    // 에러 결과도 부모 컴포넌트에 전달
                    if (window.parent && window.parent.handleMokResult) {
                        window.parent.handleMokResult({ error: result });
                    }
                }
            }
        `;

        script.textContent = callbackCode;
        document.body.appendChild(script);
    }

    /* PC | 모바일 스크립트 인식 구분 */
    /* PC 스크립트 사용시 */
    mok_popup() {
        // MOK 표준창 호출 - MOK 공식 가이드에 따른 올바른 방식
        if (window.MOBILEOK) {
            // MOK 표준창은 단순히 URL만 호출하고, 서버에서 필요한 정보를 생성
            // 개발 환경에서는 Firebase Functions 직접 호출, 프로덕션에서는 등록된 도메인 사용
            // 프로덕션 환경 감지 (hostname 기반)
            const isProduction = window.location.hostname === 'www.lookpick.co.kr' || 
                                window.location.hostname === 'lookpick.co.kr' ||
                                window.location.hostname === 'lookpick-d1f95.web.app' ||
                                window.location.hostname.includes('lookpick');
            const requestUrl = isProduction 
                ? "https://us-central1-lookpick-d1f95.cloudfunctions.net/mokApi/mok/mok_std_request"
                : "http://localhost:4000/mok/mok_std_request";
                
                console.log('환경 감지:', { 
                    NODE_ENV: process.env.NODE_ENV,
                    hostname: window.location.hostname, 
                    port: window.location.port, 
                    href: window.location.href,
                    isProduction, 
                    requestUrl 
                });
            
            window.MOBILEOK.process(
                requestUrl, 
                "WB", 
                ""
            );
        } else {
            console.error('MOK 스크립트가 로드되지 않았습니다.');
            alert('본인인증 서비스를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
        }
    }

    // MOK 스크립트가 로드되지 않은 경우의 대체 처리
    async handleMokRequest() {
        const { userId, email } = this.props;
        
        try {
            // 개발 환경에서는 Firebase Functions 직접 호출, 프로덕션에서는 등록된 도메인 사용
            const requestUrl = window.location.hostname === 'localhost' 
                ? process.env.REACT_APP_FIREBASE_FUNCTION_URL || "https://mokapi-3fvo36t3iq-uc.a.run.app/mok/mok_std_request"
                : "https://www.lookpick.co.kr/mok/mok_std_request";
            
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, email })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success && result.data) {
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
                    // 테스트용 하드코딩 - cert URL 고정
                    const isProduction = true; // 테스트용으로 강제로 프로덕션 모드
                    form.action = 'https://cert.mobile-ok.com/gui/service/v1/auth';  // 운영 환경 URL 고정
                    
                    console.log('MOK 인증 URL:', { 
                        NODE_ENV: process.env.NODE_ENV,
                        hostname: window.location.hostname,
                        isProduction, 
                        action: form.action,
                        href: window.location.href,
                        protocol: window.location.protocol,
                        port: window.location.port
                    });

                    // authRequestObject의 모든 필드를 hidden input으로 추가
                    for (const key in result.data) {
                        const hiddenField = document.createElement('input');
                        hiddenField.type = 'hidden';
                        hiddenField.name = key;
                        hiddenField.value = typeof result.data[key] === 'object' 
                            ? JSON.stringify(result.data[key]) 
                            : result.data[key];
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
                            if (this.props.onAuthSuccess) {
                                this.props.onAuthSuccess();
                            }
                        }
                    }, 500);

                    // 팝업 메시지 수신 (MOK에서 postMessage로 결과 전송 시)
                    window.addEventListener('message', (event) => {
                        // 테스트용 하드코딩 - cert URL 고정
                        const isProduction = true; // 테스트용으로 강제로 프로덕션 모드
                        const allowedOrigins = ['https://cert.mobile-ok.com'];  // 운영 환경 고정
                        
                        console.log('postMessage 수신:', { 
                            NODE_ENV: process.env.NODE_ENV,
                            isProduction, 
                            origin: event.origin, 
                            allowedOrigins 
                        });
                        
                        if (allowedOrigins.includes(event.origin)) {
                            console.log('MOK 인증 결과 수신:', event.data);
                            if (this.props.onAuthSuccess) {
                                this.props.onAuthSuccess(event.data);
                            }
                            authWindow.close();
                        }
                    });

                } else {
                    alert('팝업 차단으로 본인인증을 시작할 수 없습니다. 팝업 차단을 해제해주세요.');
                    if (this.props.onAuthError) {
                        this.props.onAuthError('팝업 차단');
                    }
                }
            } else {
                throw new Error(result.error || '인증 요청 생성에 실패했습니다.');
            }

        } catch (error) {
            console.error('본인인증 요청 오류:', error);
            if (this.props.onAuthError) {
                this.props.onAuthError('본인인증 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        }
    }
    
    /* 모바일 스크립트 사용시 */
    // mok_move 사용시 mok_react_server(pathname 수정 후 사용)
    // mok_move() {
        // 모바일 전용서비스로 페이지 이동처리 또는 카카오 브라우져 등 새창으로 처리가 어려운, 환경 또는 브라우져에서 처리
        // window.MOBILEOK.process("https://us-central1-lookpick-d1f95.cloudfunctions.net/mokApi/mok/mok_std_request", "WB", "");
    // }

    render() {
        const { isVerified, disabled } = this.props;
        
        return (
            <main>
                {/* index.html에 설정을 안 할 시 주석해제 */}
                {/* <Helmet> */}
                    {/* 운영 */}
                    {/* <script src="https://cert.mobile-ok.com/resources/js/index.js"></script> */}
                    {/* 개발 */}
                    {/* <script src="https://scert.mobile-ok.com/resources/js/index.js"></script> */}
                {/* </Helmet>  */}
                <div>
                    <div>
                        <div>
                        <textarea id="result" rows="20" placeholder="본인확인 결과가 여기에 표시됩니다..." style={{display: 'none'}}></textarea>
                        </div>
                    </div>
                    <div>
                        <button 
                            onClick={this.mok_popup.bind(this)}
                            disabled={disabled || isVerified}
                            style={{
                                padding: '14px 20px',
                                background: isVerified ? '#10B981' : '#6366F1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: disabled || isVerified ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.3s ease',
                                minWidth: '120px'
                            }}
                        >
                            {isVerified ? "인증완료" : "본인인증"}
                        </button>
                    </div>
                    {/* <div> */}
                        {/* <button onClick={this.mok_move}>본인확인 시작(이동)</button> */}
                    {/* </div> */}
                </div>
            </main>
        )
    }
}

export default moK_react_index;
