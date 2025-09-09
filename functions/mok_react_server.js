const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const session = require('express-session');
const axios = require("axios");
const bodyParser = require('body-parser');
const urlencode = require('urlencode');
const cors = require('cors');
const url = require('url');
const fs = require('fs');
const path = require('path');

// 환경 변수 로드
require('dotenv').config();

// 환경 변수 디버깅
console.log('환경 변수 로딩 확인:');
console.log('MOK_KEY_PASSWORD:', process.env.MOK_KEY_PASSWORD);
console.log('MOK_SERVICE_ID:', process.env.MOK_SERVICE_ID);
console.log('MOK_CLIENT_PREFIX:', process.env.MOK_CLIENT_PREFIX);
console.log('MOK_KEY_FILE_B64 길이:', process.env.MOK_KEY_FILE_B64 ? process.env.MOK_KEY_FILE_B64.length : '설정되지 않음');

/* 환경별 URL 설정 */
const ENV = process.env.NODE_ENV;
const IS_DEV = ENV === 'development' || process.env.FUNCTIONS_EMULATOR === 'true';

const FRONTEND_BASE = IS_DEV ? 'http://localhost:3001' : 'https://www.lookpick.co.kr';

const API_BASE = IS_DEV ? 'http://localhost:4000' : 'https://www.lookpick.co.kr';

console.log('환경 설정:', { ENV, IS_DEV, FRONTEND_BASE, API_BASE });

// Firebase Admin 초기화
admin.initializeApp();

/* 암호화 라이브러리 mok_Key_Manager */
let mobileOK;
try {
    mobileOK = require("./mok_Key_Manager_v1.0.3.js"); 
    console.log('mok_Key_Manager 로드 성공');
} catch (error)  {
    console.log('mok_Key_Manager 파일의 경로가 올바르지 않습니다.');
    mobileOK = null;
}

/* 1. express 서버 설정 */
const app = express();

/* 1-1 CORS 설정 */
/* 특정 URL에 대한 CORS 허용 */
let corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://www.lookpick.co.kr', 'https://lookpick.co.kr'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

/* 1-2 Content-type : plain-text 설정 */
app.use(bodyParser.text());

/* 1-3 request-body 데이터 urlencode 설정 */
app.use(bodyParser.urlencoded({ extended: true }));

/* 1-4 JSON 파싱 설정 */
app.use(bodyParser.json());

/* 2. 본인확인 인증결과 경로설정 */
/* 2-1 본인확인 인증결과 MOKResult API 요청 URL */
// const MOK_RESULT_REQUEST_URL = 'https://scert.mobile-ok.com/gui/service/v1/result/request';  // 개발
const MOK_RESULT_REQUEST_URL = 'https://cert.mobile-ok.com/gui/service/v1/result/request';  // 운영

/* 2-2 본인확인 Node.js서버 매핑 URL */
const requestUri = '/mok/mok_std_request';  // mok 인증 요청 URI  
const resultUri = '/mok/mok_std_result';  // mok 결과 요청 URI

/* 2-3 결과 수신 후 전달 URL 설정 - "https://" 포함한 URL 입력 */
/* 결과 전달 URL 내에 개인정보 포함을 절대 금지합니다.*/
const resultUrl = `${API_BASE}/mok/mok_std_result`; 

/* 3. 본인확인 서비스 API 설정 */
/* 3-1 키파일 경로(본인확인 키정보파일 Path)설정 */
/* 키파일은 반드시 서버의 안전한 로컬경로에 별도 저장. 웹URL 경로에 파일이 있을경우 키파일이 외부에 노출될 수 있음 주의 */
// const keyPath = path.join(__dirname, 'mok_keyInfo.dat'); // 보안상 제거

/* 3-2 키파일 비밀번호(본인확인 키파일 패스워드)설정 */  
const password = process.env.MOK_KEY_PASSWORD || 'lookpick99!';

// MOK 키 관리자 초기화 (환경별 분기 처리)
if (mobileOK) {
    try {
        console.log('MOK 키 관리자 초기화 시작...');
        
        
        const password = process.env.MOK_KEY_PASSWORD || 'lookpick99!';
        console.log('환경 변수 확인:');
        console.log('- MOK_KEY_PASSWORD:', password);
        console.log('- MOK_SERVICE_ID:', process.env.MOK_SERVICE_ID);
        console.log('- MOK_CLIENT_PREFIX:', process.env.MOK_CLIENT_PREFIX);

        
        if (!password) {
            throw new Error('MOK_KEY_PASSWORD 환경 변수가 설정되지 않았습니다.');
        }
        
        // 환경별 분기 처리
        if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
            // 로컬 개발 환경: 파일 직접 사용
            console.log('로컬 개발 환경 감지 - 키 파일 직접 사용');
            
            try {
                const keyPath = path.join(__dirname, 'mok_keyInfo.dat');
                console.log('키 파일 경로:', keyPath);
                console.log('키 파일 존재 여부:', require('fs').existsSync(keyPath));
                
                if (!require('fs').existsSync(keyPath)) {
                    throw new Error('로컬 키 파일을 찾을 수 없습니다. mok_keyInfo.dat 파일이 functions 폴더에 있는지 확인해주세요.');
                }
                
                // MOK 키 관리자 초기화
                console.log('키 관리자 초기화 시도...');
                mobileOK.keyInit(keyPath, password);
                console.log('MOK 키 관리자 초기화 성공 (로컬 파일 사용)');
                
            } catch (localError) {
                console.error('로컬 키 파일 초기화 실패:', localError);
                throw localError;
            }
            
        } else {
            // 프로덕션 환경: 환경 변수 사용
            console.log('프로덕션 환경 감지 - 환경 변수 사용');
            
            const keyFileBase64 = process.env.MOK_KEY_FILE_B64;
            if (!keyFileBase64) {
                throw new Error('MOK_KEY_FILE_B64 환경 변수가 설정되지 않았습니다.');
            }
            
            try {
                // base64 디코딩하여 임시 파일 생성
                const keyFileContent = Buffer.from(keyFileBase64, 'base64');
                const tempKeyPath = '/tmp/mok_keyInfo.dat';
                
                console.log('키 파일 디코딩 완료, 크기:', keyFileContent.length, 'bytes');
                
                // 임시 디렉토리에 키 파일 생성
                require('fs').writeFileSync(tempKeyPath, keyFileContent);
                console.log('임시 키 파일 생성 완료:', tempKeyPath);
                
                // MOK 키 관리자 초기화
                console.log('키 관리자 초기화 시도...');
                mobileOK.keyInit(tempKeyPath, password);
                console.log('MOK 키 관리자 초기화 성공 (환경 변수 사용)');
                
                // 임시 파일 삭제
                require('fs').unlinkSync(tempKeyPath);
                console.log('임시 키 파일 삭제 완료');
                
            } catch (prodError) {
                console.error('프로덕션 키 파일 초기화 실패:', prodError);
                throw prodError;
            }
        }
        
        // 키 로드 확인
        try {
            const serviceId = mobileOK.getServiceId();
            console.log('MOK Service ID 확인:', serviceId);
            
            if (!serviceId) {
                console.error('MOK Service ID가 null입니다. 키 파일에 문제가 있을 수 있습니다.');
            }
        } catch (serviceIdError) {
            console.error('MOK Service ID 확인 실패:', serviceIdError);
        }
        
        // 초기화 확인을 위한 테스트
        try {
            const testData = 'test';
            const encrypted = mobileOK.RSAEncrypt(testData);
            console.log('RSA 암호화 테스트 성공:', encrypted ? '암호화됨' : '암호화 실패');
            
            if (!encrypted) {
                console.error('RSA 암호화 결과가 null입니다. 키 파일 또는 비밀번호를 확인해주세요.');
            }
        } catch (testError) {
            console.error('RSA 암호화 테스트 실패:', testError);
        }
        
    } catch (error) {
        console.error('MOK 키 관리자 초기화 실패:', error);
        console.error('오류 상세:', error.message);
        console.error('오류 스택:', error.stack);
    }
} else {
    console.warn('MOK 키 관리자 초기화 건너뜀 - 키 파일 또는 라이브러리가 없음');
}

// 이용기관 거래ID생성시 이용기관별 유일성 보장을 위해 설정, 이용기관식별자는 이용기관코드 영문자로 반드시 수정
const clientPrefix = "MOK";     // 8자이내 영대소문자,숫자 (예) MOK, TESTCOKR

/* 본인확인 표준창 인증요청 함수 예제 */
app.post('/mok/mok_std_request', (req, res) => {
    try {
        console.log('MOK 인증 요청 시작 - MOK 공식 가이드 방식');
        
        /* 1. 본인확인-표준창 거래요청정보 생성  */

        /* 1.1 이용기관 거래ID 생성, 20자 이상 40자 이내 이용기관 고유 트랜잭션ID */
        const clientPrefix = process.env.MOK_CLIENT_PREFIX || 'MOK';
        let sampleClientTxId = clientPrefix + uuid();

        /* 1.2 인증 결과 검증을 위한 거래 ID 세션 저장 */
        // 동일한 세션내 요청과 결과가 동일한지 확인 및 인증결과 재사용 방지처리

        /* 1.3 본인확인-표준창 거래요청정보 생성  */
        const clientTxId = sampleClientTxId + "|" + getCurrentDate();

        /* 1.4 본인확인-표준창 거래요청정보 암호화 */
        let encClientTxId = '';
        if (mobileOK) {
    try {
        encClientTxId = mobileOK.RSAEncrypt(clientTxId);
                console.log('RSA 암호화 성공 - clientTxId:', clientTxId);
            } catch (error) {
                console.error('RSA 암호화 실패:', error);
                return res.status(500).send(JSON.stringify({
                    errorCode: '9999',
                    resultMsg: '암호화 처리 중 오류가 발생했습니다.'
                }));
            }
        } else {
            console.error('MOK 키 관리자가 초기화되지 않음');
            return res.status(500).send(JSON.stringify({
                errorCode: '9999',
                resultMsg: 'MOK 키 관리자 초기화 실패'
            }));
        }

        /* 1.5 본인확인-표준창 거래요청정보 설정 */
        // 요청 헤더에서 Origin을 확인하여 동적으로 returnUrl 설정
        const origin = req.headers.origin || req.headers.referer || req.headers.host;
        const userAgent = req.headers['user-agent'] || '';
        
        // 환경별 동적 returnUrl 설정
        let dynamicResultUrl = `${API_BASE}/mok/mok_std_result`;
        
        // 환경별 분기 처리 (더 안전한 방식)
        if (origin && origin.includes('localhost:3001')) {
            dynamicResultUrl = 'http://localhost:3001/mok/mok_std_result';
        } else if (origin && origin.includes('localhost:3000')) {
            dynamicResultUrl = 'http://localhost:3000/mok/mok_std_result';
        } else if (origin && origin.includes('lookpick.co.kr')) {
            dynamicResultUrl = 'https://www.lookpick.co.kr/mok/mok_std_result';
        }
        
        console.log('동적 returnUrl 설정:', { 
            origin, 
            referer: req.headers.referer,
            host: req.headers.host,
            userAgent: userAgent.substring(0, 100),
            dynamicResultUrl 
        });

    const authRequestObject = {
            /* 본인확인 서비스 용도 */
            /* 01001 : 회원가입, 01002 : 정보변경, 01003 : ID찾기, 01004 : 비밀번호찾기, 01005 : 본인확인용, 01007 : 상품구매/결제, 01999 : 기타 */
            'usageCode' : '01007',
            /* 본인확인 서비스 ID - 키 파일에서 읽은 값을 우선 사용 */  
            'serviceId' : mobileOK.getServiceId(),
            /* 암호화된 본인확인 거래 요청 정보 */
            'encryptReqClientInfo' : encClientTxId,
            /* 이용상품 코드 */
            /* 이용상품 코드, telcoAuth : 휴대폰본인확인 (SMS인증시 인증번호 발송 방식 "SMS")*/
            /* 이용상품 코드, telcoAuth-LMS : 휴대폰본인확인 (SMS인증시 인증번호 발송 방식 "LMS")*/
            'serviceType' : 'telcoAuth',
            /* 본인확인 결과 타입 */
            /* 본인확인 결과 타입, "MOKToken"  : 개인정보 응답결과를 이용기관 서버에서 본인확인 서버에 요청하여 수신 후 처리 */
            'retTransferType' : 'MOKToken',
            /* 본인확인 결과 수신 URL */
            'returnUrl' : dynamicResultUrl
        };

        console.log('MOK 인증 요청 객체 생성 완료:', {
            usageCode: authRequestObject.usageCode,
            serviceId: authRequestObject.serviceId,
            serviceType: authRequestObject.serviceType,
            retTransferType: authRequestObject.retTransferType,
            returnUrl: authRequestObject.returnUrl,
            clientTxId: clientTxId,
            encryptReqClientInfo: encClientTxId ? '암호화됨' : '암호화 실패'
        });

        /* 1.6 거래 요청 정보 JSON 반환 */
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(authRequestObject));

    } catch (error) {
        console.error('MOK 인증 요청 처리 중 오류:', error);
        res.status(500).send(JSON.stringify({
            errorCode: '9999',
            resultMsg: '서버 처리 중 오류가 발생했습니다.'
        }));
    }
});

/* 본인확인 표준창 인증결과 함수 예제 */
app.post(resultUri, async (req, res) => {
    try {
        console.log('MOK 인증 결과 수신:', req.body);
        
        /* 1. 본인확인 결과 타입 설정 */
        // raw body 확보 (text/plain 처리)
        const raw = typeof req.body === 'string' ? req.body : (
            typeof req.body?.data === 'string' ? `data=${req.body.data}` : ''
        );
        
        if (!raw) {
            console.error('빈 응답입니다:', req.body);
            return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('빈 응답입니다.')}`);
        }

        // URLSearchParams로 data=... 파라미터 꺼내기
        const params = new URLSearchParams(raw);
        const dataParam = params.get('data');
        
        if (!dataParam) {
            console.error('data 파라미터 없음:', raw);
            return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('data 파라미터 없음')}`);
        }

        // 모바일OK 특유의 이중 인코딩 대비
        const decodedOnce = urlencode.decode(dataParam);
        const resultRequestObject = JSON.parse(decodedOnce);

        console.log('파싱된 요청 객체:', resultRequestObject);

        /* 2. 본인확인 결과 타입별 결과 처리 */
        let encryptMOKResult;
        if (resultRequestObject.encryptMOKKeyToken != null) {
            /* 2.1 본인확인 결과 타입 : MOKToken */
            /* 2.1.1 본인확인 결과요청 입력정보 설정 */
            const authResultRequestObject = { encryptMOKKeyToken : resultRequestObject.encryptMOKKeyToken };

            /* 2.1.2 본인확인 결과요청 */
            const resultResponseObject = await sendPost(MOK_RESULT_REQUEST_URL, authResultRequestObject);
            
            try {
                if (typeof resultResponseObject == 'undefined') {
                    throw new Error('MOKException');
                }
            } catch(MOKException) {
                console.error('본인확인 서버통신(결과요청)에 실패했습니다.');
                return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('본인확인 서버통신에 실패했습니다.')}`);
            }

            encryptMOKResult = resultResponseObject.encryptMOKResult;

            /* 2.1.3 본인확인 결과요청 실패시 */
            if (resultResponseObject.resultCode != '2000') {
                console.log('본인확인 결과요청에 실패했습니다.');
                return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent(resultResponseObject.resultMsg || '본인확인 결과요청에 실패했습니다.')}`);
            }
        } else {
            console.error('본인확인 MOKToken 인증결과 응답이 없습니다.');
            return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('MOKToken 인증결과 응답이 없습니다.')}`);
        }

        // 'encryptMOKResult'가 없을 경우
        try {
            if (encryptMOKResult == null || encryptMOKResult == '' || typeof encryptMOKResult == 'undefined') {
                throw new Error('MOKException');
            }
        } catch (MOKException) {
            console.error('본인확인 MOKToken 가 없습니다.');
            return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('MOKToken이 없습니다.')}`);
        }

        // encryptMOKResult 복호화가 실패하는 경우
        let decryptMOKResultJson = null;
        try {
            if (mobileOK) {
                decryptMOKResultJson = mobileOK.getResult(encryptMOKResult);
            } else {
                // MOK 키 관리자가 없는 경우 기본값 사용
                decryptMOKResultJson = JSON.stringify({
                    userName: '사용자',
                    clientTxId: 'unknown',
                    userPhone: 'unknown',
                    resultCode: '0000'
                });
                console.warn('MOK 키 관리자가 없어 기본값 사용');
            }
        } catch(error) {
            console.error('본인확인 결과 복호화 오류:', error);
            return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('본인확인 결과 복호화 오류')}`);
        }

        /* 3. 본인확인 결과정보 변환 */
        /* 3-1 본인확인 결과정보 복호화 */
        const decryptMOKResultObject = JSON.parse(decryptMOKResultJson);

        /* 3-2 본인확인 결과정보 설정 */
        /* 사용자 이름 */
        let userName = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "userName")) {
            userName = decryptMOKResultObject.userName;
        }
        /* 이용기관 ID */
        let siteId = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "siteId")) {
            siteId = decryptMOKResultObject.siteId;
        }
        /* 이용기관 거래 ID */
        let clientTxId = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "clientTxId")) {
            clientTxId = decryptMOKResultObject.clientTxId;
        }
        /* 본인확인 거래 ID */
        let txId = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "txId")) {
            txId = decryptMOKResultObject.txId;
        }
        /* 서비스제공자(인증사업자) ID */
        let providerId = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "providerId")) {
            providerId = decryptMOKResultObject.providerId;
        }
        /* 이용 서비스 유형 */
        let serviceType = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "serviceType")) {
            serviceType = decryptMOKResultObject.serviceType;
        }
        /* 사용자 CI */
        let ci = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "ci")) {
            ci = decryptMOKResultObject.ci;
        }
        /* 사용자 DI */
        let di = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "di")) {
            di = decryptMOKResultObject.di;
        }
        /* 사용자 전화번호 */
        let userPhone = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "userPhone")) {
            userPhone = decryptMOKResultObject.userPhone;
        }
        /* 사용자 생년월일 */
        let userBirthday = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "userBirthday")) {
            userBirthday = decryptMOKResultObject.userBirthday;
        }
        /* 사용자 성별 (1: 남자, 2: 여자) */
        let userGender = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "userGender")) {
            userGender = decryptMOKResultObject.userGender;
        }
        /* 사용자 국적 (0: 내국인, 1: 외국인) */
        let userNation = '';
        if (Object.prototype.hasOwnProperty.call(decryptMOKResultObject, "userNation")) {
            userNation = decryptMOKResultObject.userNation;
        }
        /* 본인확인 인증 종류 */
        const reqAuthType = decryptMOKResultObject.reqAuthType;
        /* 본인확인 요청 시간 */
        const reqDate = decryptMOKResultObject.reqDate;
        /* 본인확인 인증 서버 */
        const issuer = decryptMOKResultObject.issuer;
        /* 본인확인 인증 시간 */
        const issueDate = decryptMOKResultObject.issueDate;

        console.log('복호화된 결과:', {
            userName, siteId, clientTxId, txId, providerId, serviceType,
            ci, di, userPhone, userBirthday, userGender, userNation,
            reqAuthType, reqDate, issuer, issueDate
        });

        /* 4. 수신결과 clientTxId 와 세션에 저장한 clientTxId 가 동일한지 비교(권고, 세션서버 및 DB등을 통한 검증) */
        /* 요청 세션검증 이용기관 구현 */
        try {
            const sessionDoc = await admin.firestore().collection('mok_auth_sessions').doc(clientTxId).get();
            if (!sessionDoc.exists) {
                console.error('세션을 찾을 수 없음:', clientTxId);
                return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('유효하지 않은 세션입니다.')}`);
            }

            // 세션 상태 업데이트
            await admin.firestore().collection('mok_auth_sessions').doc(clientTxId).update({
                status: 'success',
                userName: userName,
                userPhone: userPhone,
                ci: ci,
                di: di,
                completedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // 사용자 프로필 업데이트 (전화번호 인증 완료)
            const sessionData = sessionDoc.data();
            try {
                await admin.firestore().collection('users').doc(sessionData.userId).update({
                    phoneVerified: true,
                    mokVerified: true,
                    mokVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
                    userName: userName,
                    userPhone: userPhone
                });
                console.log('사용자 프로필 업데이트 성공');
            } catch (e) {
                console.warn('사용자 프로필 업데이트 실패:', e);
            }

        } catch (e) {
            console.error('세션 검증 실패:', e);
                         return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('세션 검증에 실패했습니다.')}`);
        }

        /* 검증정보 유효시간 검증 (검증결과 생성 후 10분 이내 검증 권고) */
        let oldDate = new Date(issueDate);
        oldDate = getOldTime(oldDate);

        const currentDate = getCurrentDate();

        if (oldDate < currentDate) {
            console.error('토큰 생성 10분 경과');
                         return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('토큰이 만료되었습니다.')}`);
        }

        /* 5. 이용기관 서비스 기능 처리 */
        // - 이용기관에서 수신한 개인정보 검증 확인 처리
        // - 이용기관에서 수신한 CI 확인 처리

        /* 6. 본인확인 결과 반환 */
        // 복호화된 개인정보는 DB보관 또는 세션보관하여 개인정보 저장시 본인확인에서 획득한 정보로 저장하도록 처리 필요
        // 개인정보를 웹브라우져에 전달할 경우 외부 해킹에 의해 유출되지 않도록 보안처리 필요

        let data = {
            'errorCode' : '2000'
            , 'resultMsg' : '성공'
            , 'data' : userName
        };

        /* 7. 본인확인 결과 응답 방식 */
        /* 7.1 : 팝업창(Pop-Up) : callback 유 */
        /* 7.1-1 팝업창(Pop-Up) 결과반환 */
        
        // 팝업 방식에서는 리다이렉트로 데이터 전송
        console.log('MOK 인증 성공, 리다이렉트 처리:', { dynamicResultUrl, data });
        
        // 프론트엔드 결과 페이지로 리다이렉트
        const referer = req.headers.referer || '';
        const host = req.headers.host || '';
        let frontendUrl = `${FRONTEND_BASE}/mok/redirect`;

        if (referer.includes('localhost:3001') || host.includes('localhost:3001')) {
            frontendUrl = 'http://localhost:3001/mok/redirect';
        } else if (referer.includes('localhost:3000') || host.includes('localhost:3000')) {
            frontendUrl = 'http://localhost:3000/mok/redirect';
        }
            
        res.redirect(`${frontendUrl}?data=${encodeURIComponent(JSON.stringify(data))}&status=success`);

        /* 7.2 : 페이지 이동(Redirect) : callback 무 */
        /* 7.2-1 이동페이지(Redirect Page) 설정 */
        // res.redirect(url.format({
        //     pathname:"https://이용기관 본인확인-표준창 인증요청 처리 (React)URL/mok/redirect",
        //     query: {
        //        "data": JSON.stringify(data),
        //      }
        //   }));

        } catch (error) {
            console.error('MOK 인증 결과 처리 오류:', error);
            res.redirect(`${resultUrl}?status=error&message=${encodeURIComponent('결과 처리 중 오류가 발생했습니다.')}`);
        }
});

// 테스트 함수
app.get('/test', (req, res) => {
    res.json({
        message: 'MOK 서버가 정상적으로 작동 중입니다.',
        timestamp: new Date().toISOString(),
        environment: {
            MOK_SERVICE_ID: process.env.MOK_SERVICE_ID || 'kimmc',
            MOK_CLIENT_PREFIX: process.env.MOK_CLIENT_PREFIX || 'MOK',
            MOK_APP_RETURN_URL: resultUrl,
            MOK_RESULT_REQUEST_URL: MOK_RESULT_REQUEST_URL,
            mobileOKLoaded: !!mobileOK,
            // keyFileExists: fs.existsSync(keyPath) // 보안상 제거
        }
    });
});

/* 거래 ID(uuid) 생성 예제 함수 */
function uuid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

        return v.toString(16);
    });
}

/* 본인확인 거래 ID(요청 시간) 생성 예제 함수 */
function getCurrentDate() {
    let newDate = new Date();
    newDate.toLocaleString('ko-kr');

    let year = newDate.getFullYear();
    let mon = newDate.getMonth() + 1;
    let date = newDate.getDate();

    let hour = newDate.getHours();
    let min = newDate.getMinutes();
    let sec = newDate.getSeconds();

    mon = mon < 10 ? `0${mon}` : `${mon}`;
    date = date < 10 ? `0${date}` : `${date}`;
    hour = hour < 10 ? `0${hour}` : `${hour}`;
    min = min < 10 ? `0${min}` : `${min}`;
    sec = sec < 10 ? `0${sec}` : `${sec}`;

    const reqDate = year + mon + date + hour + min + sec;

    return reqDate;
}

function getOldTime(oldTime) {
    let year = oldTime.getFullYear();
    let mon = oldTime.getMonth() + 1;
    let date = oldTime.getDate();

    let hour = oldTime.getHours();
    let min = oldTime.getMinutes()+ 10;
    let sec = oldTime.getSeconds();

    if (min >= 60) {
        min = min - 60;

        hour = hour + 1;
    }
    if (hour >= 24) {
        hour = hour - 24;

        date = date + 1;
    }
    if (date > new Date(year, mon, 0).getDate()) {
        date = date - (new Date(year, mon, 0).getDate());

        mon = mon + 1;
    }
    if (mon >= 13) {
        mon = mon - 12;

        year = year + 1;
    }

    mon = mon < 10 ? `0${mon}` : `${mon}`;
    date = date < 10 ? `0${date}` : `${date}`;
    hour = hour < 10 ? `0${hour}` : `${hour}`;
    min = min < 10 ? `0${min}` : `${min}`;
    sec = sec < 10 ? `0${sec}` : `${sec}`;

    const reqDate = year + mon + date + hour + min + sec;

    return reqDate;
}

/* 본인확인 서버 통신 예제 함수 */
async function sendPost(targetUrl, encryptMOKKeyToken) {
    try {
        let responseData = await axios ({
            method : 'post',
            url : targetUrl,
            data : encryptMOKKeyToken
        });

        return responseData.data;
    } catch (AxiosError) {
        console.log('본인확인 서버 통신URL이 잘 못 되었습니다.');
        console.error('Axios 에러:', AxiosError.message);
        return undefined;
    }
}

// Express 앱을 Firebase Functions로 내보내기
exports.mokApi = functions.https.onRequest(app);

// 기존 함수들도 유지 (하위 호환성)
exports.testFunction = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    
    res.json({
        message: '테스트 함수가 정상적으로 작동합니다.',
        timestamp: new Date().toISOString()
    });
});

exports.mokStdRequest = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    
    res.json({
        success: true,
        data: {
            message: '기존 mokStdRequest 함수가 호출되었습니다.'
        }
    });
});

exports.mokStdResult = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    
    res.json({
        message: '기존 mokStdResult 함수가 호출되었습니다.',
        body: req.body
    });
});

/* 8. 로컬 개발 서버 시작 */
// 개발 모드에서 로컬 서버 띄우기 (Firebase Functions와 별개)
if (IS_DEV) {
    const LOCAL_PORT = 4000;
    app.listen(LOCAL_PORT, () => {
        console.log(`Local API server listening on http://localhost:${LOCAL_PORT}`);
        console.log(`MOK request endpoint: http://localhost:${LOCAL_PORT}/mok/mok_std_request`);
        console.log(`MOK result endpoint: http://localhost:${LOCAL_PORT}/mok/mok_std_result`);
    });
}

