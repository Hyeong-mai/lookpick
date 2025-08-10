# 사업자진위확인 API 사용 가이드

## 개요

공공데이터포털의 사업자등록정보 진위확인 API를 사용하여 실시간으로 사업자 정보를 검증할 수 있습니다.

## API 키 발급

1. [공공데이터포털](https://www.data.go.kr) 회원가입 및 로그인
2. "사업자등록정보 진위확인" 서비스 신청
3. 승인 후 인코딩키와 디코딩키 발급받기

## 환경 변수 설정

`.env` 파일에 다음 환경 변수를 추가하세요:

```env
# 사업자진위확인 API (공공데이터포털)
REACT_APP_BUSINESS_API_ENCODING_KEY=발급받은_인코딩키
REACT_APP_BUSINESS_API_DECODING_KEY=발급받은_디코딩키
REACT_APP_BUSINESS_API_URL=https://api.odcloud.kr/api/nts-businessman/v1/status
```

## API 실제 요청 형식

공공데이터포털 API의 실제 요청 형식:

```javascript
var data = {
  businesses: [
    {
      b_no: "0000000000", // 사업자등록번호 (필수)
      start_dt: "20000101", // 개업일자 YYYYMMDD (필수)
      p_nm: "홍길동", // 대표자명 (필수)
      p_nm2: "", // 대표자명2 (선택)
      b_nm: "", // 상호명 (선택)
      corp_no: "", // 법인등록번호 (선택)
      b_sector: "", // 업종 (선택)
      b_type: "", // 업태 (선택)
      b_adr: "", // 주소 (선택)
    },
  ],
};
```

## API 필수 매개변수

공공데이터포털 API 명세에 따른 필수 매개변수:

1. **사업자등록번호(b_no)**: 숫자로 이루어진 10자리 값만 가능 ('-' 등의 기호 반드시 제거 후 호출)
2. **대표자성명(p_nm)**: 외국인 사업자의 경우에는 영문명 입력
3. **개업일자(start_dt)**:
   - YYYYMMDD 포맷의 날짜로 입력('-' 등의 기호 반드시 제거 후 호출)
   - 사업자등록증에 표기된 개업연월일 날짜로 입력

## 사용 방법

### 1. Mock 데이터 사용 (개발/테스트)

```javascript
import { mockBusinessValidation } from "../services/businessValidation";

const result = await mockBusinessValidation(
  "1234567890",
  "홍길동",
  "2020-01-01"
);
```

### 2. 실제 API 사용 (프로덕션)

```javascript
import { validateBusiness } from "../services/businessValidation";

const result = await validateBusiness("1234567890", "홍길동", "2020-01-01");
```

## 테스트 데이터

Mock API에서 사용할 수 있는 테스트 데이터:

- **사업자등록번호**: `123-45-67890` 또는 `1234567890`
- **대표자명**: 아무 이름 (예: "홍길동")
- **개업일자**: 아무 날짜 (예: "2020-01-01")
- **결과**: 성공 응답

다른 사업자등록번호를 입력하면 실패 응답을 받게 됩니다.

## API 응답 형식

### 성공 응답

```json
{
  "success": true,
  "data": {
    "businessNumber": "1234567890",
    "companyName": "(주)테스트",
    "representative": "홍길동",
    "businessStatus": "계속사업자",
    "businessType": "소프트웨어 개발업",
    "businessSector": "정보통신업",
    "establishmentDate": "20200101",
    "address": "서울특별시 강남구 테헤란로 123",
    "isValid": true
  }
}
```

### 실패 응답

```json
{
  "success": false,
  "message": "등록되지 않은 사업자등록번호이거나 입력한 정보가 일치하지 않습니다."
}
```

## 실제 API 응답 필드 설명

- **b_nm**: 상호명
- **b_stt**: 납세자상태 (계속사업자, 휴업자, 폐업자 등)
- **b_type**: 업태
- **b_sector**: 업종
- **b_adr**: 사업장주소
- **start_dt**: 개업일자

## CORS 문제 해결

클라이언트에서 직접 공공데이터포털 API를 호출할 경우 CORS 문제가 발생합니다.
프로덕션 환경에서는 다음 중 하나의 방법을 사용하세요:

1. **프록시 서버 구축**: Express.js 등으로 백엔드 프록시 서버 구현
2. **Firebase Functions 사용**: 서버리스 함수로 API 호출
3. **CORS Proxy 서비스**: 임시 개발용 (보안상 비추천)

## 주의사항

- API 키는 절대 클라이언트에 노출하지 마세요
- 일일 호출 한도를 확인하세요
- 사업자등록번호는 체크섬 검증을 통과해야 합니다
- 실제 운영 환경에서는 백엔드에서 API를 호출하세요
- 개업일자는 사업자등록증에 표기된 정확한 날짜를 입력해야 합니다

## 개발 모드에서 테스트

현재 `SignupPage`는 Mock API를 사용하도록 설정되어 있습니다.
실제 API를 테스트하려면 `handleBusinessValidation` 함수에서
`mockBusinessValidation` 대신 `validateBusiness`를 사용하세요.

```javascript
// Mock API 사용 (현재 설정)
const data = await mockBusinessValidation(
  formData.businessNumber,
  formData.representative,
  formData.establishmentDate
);

// 실제 API 사용 (프로덕션)
const data = await validateBusiness(
  formData.businessNumber,
  formData.representative,
  formData.establishmentDate
);
```

## SignupPage UI 개선사항

- 개업일자가 별도 필드로 분리되어 명확한 입력 요구사항 제시
- 사업자진위확인 섹션에서 위에서 입력한 모든 정보를 자동으로 표시
- 3개 필드(사업자등록번호, 대표자명, 개업일자)를 그리드 레이아웃으로 깔끔하게 배치
- 중앙 정렬된 진위확인 버튼으로 사용자 경험 개선
- 실제 API 응답에 맞는 상세 정보 표시 (상호명, 납세자상태, 업태, 업종, 사업장주소)
