const express = require('express');
const session = require('express-session');
const axios = require("axios");
const bodyParser = require('body-parser');
const urlencode = require('urlencode');
const cors = require('cors');
const url = require('url');

// Firebase Admin SDK
const admin = require('firebase-admin');

// 환경 변수 로드
require('dotenv').config();

// Firebase Functions 환경에서는 NODE_ENV가 설정되지 않을 수 있으므로
// Firebase Functions 환경 감지로 프로덕션 판단
const isProduction = process.env.NODE_ENV === 'production' || process.env.FUNCTIONS_EMULATOR || process.env.FIREBASE_CONFIG;

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
    try {
        // 서비스 계정 키 파일이 있는 경우 사용
        const serviceAccount = require('./serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: 'lookpick-d1f95'
        });
        console.log('Firebase Admin SDK 초기화 완료 (서비스 계정 키 사용)');
    } catch (error) {
        // 서비스 계정 키 파일이 없는 경우 기본 인증 사용
        console.log('서비스 계정 키 파일을 찾을 수 없습니다. 기본 인증을 사용합니다.');
        try {
            admin.initializeApp({
                projectId: 'lookpick-d1f95'
            });
            console.log('Firebase Admin SDK 초기화 완료 (기본 인증)');
        } catch (initError) {
            console.log('Firebase Admin SDK 초기화 실패:', initError.message);
            console.log('Firestore 기능을 사용할 수 없습니다.');
        }
    }
}

/* 암호화 라이브러리 mok_Key_Manager */
let mobileOK;
try {
    mobileOK= require("./mok_Key_Manager_v1.0.3.js"); 
} catch (error)  {
    console.log('mok_Key_Manager 파일의 경로가 올바르지 않습니다.');
}
/* 1. express 서버 설정 */
const app = express();

/* 1-1 포트(port) 설정 */
const port = 4000 ;

/* 1-2 CORS 설정 */
/* 모든 URL에 대한 CORS 허용 */
/* app.use(cors()); */

/* 특정 URL에 대한 CORS 허용 */
let corsOptions = {
    origin: isProduction 
        ? ['https://www.lookpick.co.kr', 'https://lookpick.co.kr']
        : 'http://localhost:3001',
    credentials: true
}
app.use(cors(corsOptions));

/* 1-3 루트(root)패키지의 정적파일을 읽기위한 설정 */
app.use(express.static('./'));

/* 1-4 Content-type : plain-text 설정 */
app.use(bodyParser.text());

/* 1-5 request-body 데이터 urlencode 설정 */
app.use(bodyParser.urlencoded({ extended: true }));

/* 1-6 본인확인 Node.js 서버 실행 */
app.listen(port, () => {
    console.log(`App listening at Port : ${port}`);
});

/* 2. 본인확인 인증결과 경로설정 */
/* 2-1 본인확인 인증결과 MOKResult API 요청 URL */
// Firebase Functions v2에서는 환경 변수 사용
const MOK_RESULT_REQUEST_URL = isProduction 
    ? 'https://cert.mobile-ok.com/gui/service/v1/result/request'  // 운영
    : 'https://scert.mobile-ok.com/gui/service/v1/result/request';  // 개발

/* 2-1 본인확인 Node.js서버 매핑 URL */
const requestUri = '/mok/mok_std_request';  // mok 인증 요청 URI  
const resultUri = '/mok/mok_std_result';  // mok 결과 요청 URI

// MOK 서버 초기화 로그는 keyPath와 password 정의 후에 출력

/* 2-3 결과 수신 후 전달 URL 설정 - "https://" 포함한 URL 입력 */
/* 결과 전달 URL 내에 개인정보 포함을 절대 금지합니다.*/
const resultUrl = isProduction 
    ? 'https://us-central1-lookpick-d1f95.cloudfunctions.net/mokApi/mok/mok_std_result'
    : 'http://localhost:4000/mok/mok_std_result'; 

/* 3. 본인확인 서비스 API 설정 */
/* 3-1 키파일 경로(본인확인 키정보파일 Path)설정 */
/* 키파일은 반드시 서버의 안전한 로컬경로에 별도 저장. 웹URL 경로에 파일이 있을경우 키파일이 외부에 노출될 수 있음 주의 */
const keyPath = isProduction 
    ? './keys/production/mok_keyInfo.dat'  // 운영 환경
    : './keys/development/mok_keyInfo.dat';  // 개발 환경
/* 3-2 키파일 비밀번호(본인확인 키파일 패스워드)설정 */
const password = isProduction 
    ? 'lookpick99!'  // 운영 환경 비밀번호
    : 'lookpick99!';  // 개발 환경 비밀번호 (현재 동일)

// MOK 키 관리자 초기화 및 디버깅
if (mobileOK) {
    try {
        console.log('MOK 키 관리자 초기화 시작...');
        console.log('키 파일 경로:', keyPath);
        console.log('비밀번호:', password);
        
        mobileOK.keyInit(keyPath, password);
        console.log('MOK 키 관리자 초기화 성공');
        
        console.log('MOK 서버 초기화:', {
            NODE_ENV: process.env.NODE_ENV,
            FUNCTIONS_EMULATOR: process.env.FUNCTIONS_EMULATOR,
            FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
            isProduction,
            MOK_RESULT_REQUEST_URL: MOK_RESULT_REQUEST_URL,
            keyPath,
            password: password ? '설정됨' : '설정되지 않음'
        });
        
        // Service ID 확인
        const serviceId = mobileOK.getServiceId();
        console.log('MOK Service ID:', serviceId);
        
        if (!serviceId) {
            console.error('MOK Service ID가 null입니다!');
        }
        
        // RSA 암호화 테스트
        const testData = 'test';
        const encrypted = mobileOK.RSAEncrypt(testData);
        console.log('RSA 암호화 테스트:', encrypted ? '성공' : '실패');
        
    } catch (error) {
        console.error('MOK 키 관리자 초기화 실패:', error);
    }
} else {
    console.error('MOK 키 관리자 라이브러리를 로드할 수 없습니다!');
}

// 이용기관 거래ID생성시 이용기관별 유일성 보장을 위해 설정, 이용기관식별자는 이용기관코드 영문자로 반드시 수정
const clientPrefix = "MOK";     // 8자이내 영대소문자,숫자 (예) MOK, TESTCOKR

/* 본인확인 표준창 인증요청 함수 예제 */
app.post(requestUri, (req, res) => {
    console.log('=== MOK 인증 요청 시작 ===');
    
    try {
        /* 1. 본인확인-표준창 거래요청정보 생성  */

        /* 1.1 이용기관 거래ID 생성, 20자 이상 40자 이내 이용기관 고유 트랜잭션ID (예시) 이용기관식별자+UUID, ...  */
        // - 본인확인-표준창 거래ID 는 유일한 값이어야 하며 기 사용한 거래ID가 있는 경우 오류 발생 
        // - 이용기관이 고유식별 ID로 유일성을 보장할 경우 고객이 이용하는 ID사용 가능 
        let sampleClientTxId = clientPrefix + uuid();
        console.log('생성된 거래 ID:', sampleClientTxId);

        /* 1.2 인증 결과 검증을 위한 거래 ID 세션 저장 */
        // 동일한 세션내 요청과 결과가 동일한지 확인 및 인증결과 재사용 방지처리, 응답결과 처리 시 필수 구현
        // 세션 내 거래ID를 저장하여 검증하는 방법은 권고 사항이며, 이용기관 저장매체(DB 등)에 저장하여 검증 가능

        /* 1.3 본인확인-표준창 거래요청정보 생성  */
        const clientTxId = sampleClientTxId + "|" + getCurrentDate();
        console.log('최종 거래 ID:', clientTxId);

        /* 1.4 본인확인-표준창 거래요청정보 암호화 */
        const encClientTxId = mobileOK.RSAEncrypt(clientTxId);
        console.log('암호화된 거래 ID:', encClientTxId ? '암호화 성공' : '암호화 실패');

        // Service ID 확인
        const serviceId = mobileOK.getServiceId();
        console.log('Service ID:', serviceId);

        /* 1.5 본인확인-표준창 거래요청정보 설정 */
        const authRequestObject = {
            /* 본인확인 서비스 용도 */
            /* 01001 : 회원가입, 01002 : 정보변경, 01003 : ID찾기, 01004 : 비밀번호찾기, 01005 : 본인확인용, 01007 : 상품구매/결제, 01999 : 기타 */
            'usageCode' : '01001'
            /* 본인확인 서비스 ID */  
            , 'serviceId' : serviceId
            /* 암호화된 본인확인 거래 요청 정보 */
            , 'encryptReqClientInfo' : encClientTxId
            /* 이용상품 코드 */
            /* 이용상품 코드, telcoAuth : 휴대폰본인확인 (SMS인증시 인증번호 발송 방식 "SMS")*/
            /* 이용상품 코드, telcoAuth-LMS : 휴대폰본인확인 (SMS인증시 인증번호 발송 방식 "LMS")*/
            , 'serviceType' : 'telcoAuth'
            /* 본인확인 결과 타입 */
            /* 본인확인 결과 타입, "MOKToken"  : 개인정보 응답결과를 이용기관 서버에서 본인확인 서버에 요청하여 수신 후 처리 */
            , 'retTransferType' : 'MOKToken'
            /* 본인확인 결과 수신 URL */
            , 'returnUrl' : resultUrl
        };

        console.log('인증 요청 객체:', authRequestObject);

        /* 1.6 거래 요청 정보 JSON 반환 */
        res.send(JSON.stringify(authRequestObject));
        
    } catch (error) {
        console.error('MOK 인증 요청 처리 중 오류:', error);
        res.status(500).send(JSON.stringify({ error: '인증 요청 처리 중 오류가 발생했습니다.' }));
    }
})

/* 본인확인 표준창 인증결과 함수 예제 */
// GET 방식으로도 처리 (MOK 서버에서 GET으로 호출)
app.get(resultUri, async (req, res) => {
    console.log('MOK 인증 결과 수신 (GET):', req.query);
    
    // 리다이렉트 루프 방지: status 파라미터가 있으면 오류 페이지로 리다이렉트
    if (req.query.status) {
        console.log('오류 상태 감지, 리다이렉트 루프 방지:', req.query);
        const redirectUrl = url.format({
            pathname: isProduction 
                ? "https://us-central1-lookpick-d1f95.cloudfunctions.net/mokApi/signup"
                : "http://localhost:3001/signup",
            query: {
                "mokAuth": "false",
                "error": req.query.message || "본인인증 중 오류가 발생했습니다."
            }
        });
        return res.redirect(redirectUrl);
    }
    
    // GET 파라미터를 POST body 형태로 변환
    req.body = req.query;
    
    // POST 핸들러와 동일한 로직 사용
    return handleMokResult(req, res);
});

// MOK 결과 처리 함수
async function handleMokResult(req, res) {
    try {
        console.log('MOK 인증 결과 수신:', req.body);
        console.log('요청 메서드:', req.method);
        console.log('요청 헤더:', req.headers);
        
        /* 1. 본인확인 결과 타입 설정 */
        const resultRequestString = req.body;
        console.log('요청 바디 상세:', {
            body: resultRequestString,
            hasData: !!resultRequestString.data,
            dataType: typeof resultRequestString.data,
            dataValue: resultRequestString.data,
            keys: Object.keys(resultRequestString || {})
        });
        
        // MOK는 다양한 방식으로 데이터를 전달할 수 있음
        let mokData = null;
        
        // 1. POST 방식에서 data 필드로 전달
        if (resultRequestString && resultRequestString.data) {
            mokData = resultRequestString.data;
        }
        // 2. POST 방식에서 직접 전달
        else if (resultRequestString && typeof resultRequestString === 'string') {
            mokData = resultRequestString;
        }
        // 3. GET 방식에서 쿼리 파라미터로 전달
        else if (req.query && req.query.data) {
            mokData = req.query.data;
        }
        
        if (!mokData) {
            console.error('MOK 결과 데이터를 찾을 수 없습니다:', {
                body: resultRequestString,
                query: req.query,
                method: req.method
            });
            return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('결과 데이터가 없습니다.')}`);
        }
        
        const resultRequestJson = urlencode.decode(mokData);
        console.log('디코딩된 JSON:', resultRequestJson);
        
        let resultRequestObject;
        try {
            resultRequestObject = JSON.parse(resultRequestJson);
        } catch (parseError) {
            console.error('JSON 파싱 오류:', parseError);
            console.error('파싱 시도한 데이터:', resultRequestJson);
            return res.redirect(`${resultUrl}?status=failed&message=${encodeURIComponent('결과 데이터 파싱 오류')}`);
        }

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
            // Firebase Admin SDK가 초기화되었는지 확인
            if (admin.apps.length === 0) {
                console.log('Firebase Admin SDK가 초기화되지 않았습니다. 세션 검증을 건너뜁니다.');
                // Firebase 없이도 인증 성공 처리
                console.log('MOK 인증 성공 - 세션 검증 건너뜀');
            } else {
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
            }
        } catch (e) {
            console.error('세션 검증 실패:', e);
            // Firebase 오류가 있어도 인증은 성공으로 처리
            console.log('Firebase 오류로 인한 세션 검증 실패, 하지만 인증은 성공으로 처리');
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
        // 콜백 방식에서는 JSON 데이터 직접 반환
        // console.log('MOK 인증 성공, 콜백 처리:', { data });
        // res.send(data);

        /* 7.2 : 페이지 이동(Redirect) : callback 무 */
        /* 7.2-1 이동페이지(Redirect Page) 설정 */
        // redirect 방식에서는 회원가입 페이지로 리다이렉트
        const redirectUrl = url.format({
            pathname: isProduction 
                ? "https://us-central1-lookpick-d1f95.cloudfunctions.net/mokApi/signup"
                : "http://localhost:3001/signup",
            query: {
                "mokAuth": "true",
                "userName": userName,
                "userPhone": userPhone,
                "userBirthday": userBirthday,
                "userGender": userGender,
                "ci": ci,
                "di": di
            }
        });
        console.log('리다이렉트 URL:', redirectUrl);
        res.redirect(redirectUrl);

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
}

app.post(resultUri, handleMokResult);

// 회원가입 페이지 리다이렉트 처리
app.get('/signup', (req, res) => {
    console.log('회원가입 페이지 리다이렉트:', req.query);
    
    // 실제 회원가입 페이지로 리다이렉트
    const signupUrl = isProduction 
        ? "https://www.lookpick.co.kr/signup"
        : "http://localhost:3001/signup";
    
    // 쿼리 파라미터 유지하면서 리다이렉트
    const redirectUrl = url.format({
        pathname: signupUrl,
        query: req.query
    });
    
    res.redirect(redirectUrl);
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

/* 8. Express 앱 export (Firebase Functions용) */
module.exports = app;

/* 8-1. 로컬 개발용 서버 시작 (환경변수로 구분) */
if (!isProduction && !process.env.FUNCTIONS_EMULATOR && !process.env.FIREBASE_CONFIG) {
    app.listen(port, () => {
        console.log(`MOK API server listening on http://localhost:${port}`);
        console.log(`MOK request endpoint: http://localhost:${port}/mok/mok_std_request`);
        console.log(`MOK result endpoint: http://localhost:${port}/mok/mok_std_result`);
    });
}
