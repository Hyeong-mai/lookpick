import React, { Component } from 'react';

class mok_redirect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: null,
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        // URL 파라미터에서 데이터 확인 (리다이렉트 방식)
        const urlParams = new URLSearchParams(window.location.search);
        const redirectData = urlParams.get('data');
        const status = urlParams.get('status');
        
        console.log('MOK 리다이렉트 페이지 로드:', { 
            redirectData: redirectData ? '있음' : '없음', 
            status,
            currentUrl: window.location.href 
        });
        
        if (redirectData) {
            try {
                const parsedData = JSON.parse(redirectData);
                this.setState({
                    resultData: parsedData,
                    isLoading: false
                });
                console.log('MOK 리다이렉트 결과:', parsedData);
                
                // 부모 컴포넌트에 결과 전달 (팝업인 경우)
                if (window.opener && window.opener.handleMokResult) {
                    window.opener.handleMokResult(parsedData);
                    // 팝업 창 닫기
                    setTimeout(() => {
                        window.close();
                    }, 1000);
                } else if (window.parent && window.parent.handleMokResult) {
                    window.parent.handleMokResult(parsedData);
                }
            } catch (error) {
                this.setState({
                    resultData: redirectData,
                    isLoading: false,
                    error: '데이터 파싱 오류'
                });
                console.error('MOK 결과 파싱 오류:', error);
            }
        } else if (status === 'success') {
            // 성공 상태만 있고 데이터가 없는 경우
            this.setState({
                resultData: { message: '본인확인 성공', status: 'success' },
                isLoading: false
            });
        } else {
            // POST 요청으로 받은 데이터 처리 (팝업 방식)
            this.handlePostData();
        }
    }

    handlePostData = () => {
        // POST 요청으로 받은 데이터를 처리하는 로직
        // 실제로는 MOK 서버에서 POST로 전송된 데이터를 처리해야 함
        const script = document.createElement('script');
        const resultData = document.createTextNode(
            "// POST 데이터 처리 로직" +
            "if (window.opener && window.opener.handleMokResult) {" +
                "window.opener.handleMokResult({ message: 'MOK 인증 완료' });" +
                "window.close();" +
            "} else {" +
                "document.querySelector('#result').value = 'MOK 인증이 완료되었습니다.';" +
            "}"
        );

        script.appendChild(resultData);
        document.body.appendChild(script);
        
        this.setState({ isLoading: false });
    }

    render() {
        const { resultData, isLoading, error } = this.state;
        
        if (isLoading) {
            return (
                <main style={{ padding: '20px', textAlign: 'center' }}>
                    <div>본인확인 결과를 처리 중입니다...</div>
                </main>
            );
        }

        return (
            <main style={{ padding: '20px' }}>
                <div>
                    <h2>본인확인 결과</h2>
                    <div>
                        <textarea 
                            id="result" 
                            rows="20" 
                            cols="80"
                            placeholder="본인확인 결과가 여기에 표시됩니다..."
                            value={resultData ? JSON.stringify(resultData, null, 4) : (error || '결과 없음')}
                            readOnly
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '12px'
                            }}
                        />
                    </div>
                    {resultData && (
                        <div style={{ marginTop: '20px' }}>
                            <button 
                                onClick={() => {
                                    if (window.opener) {
                                        window.close();
                                    } else {
                                        window.history.back();
                                    }
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                닫기
                            </button>
                        </div>
                    )}
                </div>
            </main>
        )
    }
}

export default mok_redirect;
