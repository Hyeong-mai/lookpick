import React, { Component } from 'react';

class mok_redirect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: '',
            status: '',
            error: null
        };
    }

    componentDidMount() {
        console.log('MOK 리다이렉트 페이지 로드됨');
        console.log('현재 URL:', window.location.href);
        console.log('URL 파라미터:', window.location.search);
        
        // URL 파라미터에서 데이터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        const statusParam = urlParams.get('status');
        
        console.log('data 파라미터:', dataParam);
        console.log('status 파라미터:', statusParam);
        
        if (dataParam) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(dataParam));
                console.log('파싱된 데이터:', parsedData);
                this.setState({
                    resultData: JSON.stringify(parsedData, null, 4),
                    status: statusParam || 'unknown'
                });
            } catch (error) {
                console.error('데이터 파싱 오류:', error);
                console.log('원본 데이터:', dataParam);
                this.setState({
                    resultData: dataParam,
                    status: statusParam || 'unknown',
                    error: error.message
                });
            }
        } else {
            console.log('data 파라미터가 없습니다.');
            this.setState({
                resultData: '데이터가 없습니다.',
                status: statusParam || 'no_data'
            });
        }
    }

    render() {
        return (
            <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <div>
                    <h1>MOK 인증 결과</h1>
                    <div style={{ marginBottom: '20px' }}>
                        <strong>상태:</strong> {this.state.status}
                    </div>
                    {this.state.error && (
                        <div style={{ marginBottom: '20px', color: 'red' }}>
                            <strong>오류:</strong> {this.state.error}
                        </div>
                    )}
                    <div>
                        <strong>결과 데이터:</strong>
                        <textarea 
                            value={this.state.resultData}
                            readOnly
                            rows="20" 
                            cols="80"
                            style={{ 
                                width: '100%', 
                                marginTop: '10px',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '12px'
                            }}
                        />
                    </div>
                </div>
            </main>
        )
    }
}

export default mok_redirect;
