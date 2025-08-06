# Firebase 설정 가이드

## 📋 개요

LookPick 애플리케이션에서 Firebase를 사용하여 인증, 데이터베이스, 파일 저장소를 관리합니다.

## 🚀 Firebase 프로젝트 설정

### 1. Firebase 콘솔에서 프로젝트 생성

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "LookPick")
4. Google Analytics 설정 (선택사항)

### 2. 웹 앱 등록

1. 프로젝트 개요 페이지에서 웹 아이콘(</>)을 클릭
2. 앱 닉네임 입력 (예: "LookPick Web")
3. Firebase Hosting 설정 (선택사항)
4. Firebase SDK 설정 정보 복사

### 3. 환경 변수 설정

1. 프로젝트 루트에 `.env` 파일 생성
2. `.env.example` 파일을 참고하여 실제 Firebase 설정값 입력

```bash
# .env 파일 생성
cp .env.example .env
```

```env
# Firebase 설정 - 실제 값으로 변경
REACT_APP_FIREBASE_API_KEY=실제_API_키
REACT_APP_FIREBASE_AUTH_DOMAIN=프로젝트명.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=실제_프로젝트_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=프로젝트명.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=실제_메시지_발신자_ID
REACT_APP_FIREBASE_APP_ID=실제_앱_ID
```

## 🔥 Firebase 서비스 설정

### 1. Authentication 설정

1. Firebase 콘솔 → Authentication → 시작하기
2. Sign-in method → 이메일/비밀번호 활성화
3. 승인된 도메인에 localhost 추가

### 2. Firestore Database 설정

1. Firebase 콘솔 → Firestore Database → 데이터베이스 만들기
2. 보안 규칙 모드 선택:
   - 테스트 모드: 개발 시 사용
   - 프로덕션 모드: 배포 시 사용

#### 기본 보안 규칙 (개발용)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 서비스 데이터
    match /services/{document} {
      allow read: if resource.data.status == 'active';
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

### 3. Storage 설정

1. Firebase 콘솔 → Storage → 시작하기
2. 보안 규칙 설정

#### Storage 보안 규칙

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 사용자별 폴더 접근 제한
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 서비스 이미지는 읽기 허용
    match /services/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📁 폴더 구조

```
src/
├── firebase/
│   ├── config.js          # Firebase 초기화 설정
│   ├── auth.js            # 인증 관련 함수
│   ├── firestore.js       # Firestore 데이터베이스 함수
│   └── storage.js         # Storage 파일 업로드 함수
├── contexts/
│   └── AuthContext.js     # 인증 컨텍스트
└── ...
```

## 🔧 주요 함수들

### 인증 (auth.js)

- `signUp(email, password, userInfo)` - 회원가입
- `signIn(email, password)` - 로그인
- `logOut()` - 로그아웃
- `getUserInfo(userId)` - 사용자 정보 조회

### 데이터베이스 (firestore.js)

- `createService(serviceData, userId)` - 서비스 등록
- `getUserServices(userId)` - 사용자별 서비스 목록
- `getAllServices()` - 모든 활성 서비스 목록
- `updateService(serviceId, serviceData)` - 서비스 수정
- `deleteService(serviceId)` - 서비스 삭제

### 파일 저장소 (storage.js)

- `uploadFile(file, path)` - 단일 파일 업로드
- `uploadMultipleFiles(files, userId, serviceId)` - 다중 파일 업로드
- `uploadBusinessCertificate(file, userId)` - 사업자등록증 업로드
- `deleteFile(filePath)` - 파일 삭제

## 🔒 데이터 구조

### users 컬렉션

```javascript
{
  name: string,
  email: string,
  phone: string,
  companyName: string,
  businessNumber: string,
  representative: string,
  companyAddress: string,
  establishmentDate: string,
  businessType: string,
  businessField: string,
  managerName: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### services 컬렉션

```javascript
{
  serviceName: string,
  companyWebsite: string,
  price: string,
  isPricingOptional: boolean,
  serviceRegion: string,
  serviceDescription: string,
  categories: array,
  tags: array,
  files: array,
  freePostContent: string,
  userId: string,
  status: string, // 'pending', 'active', 'rejected'
  views: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🚀 배포 준비사항

### 1. 보안 규칙 업데이트

- Firestore와 Storage 보안 규칙을 프로덕션 환경에 맞게 수정

### 2. 환경 변수 설정

- 배포 환경에서 환경 변수 설정
- `.env` 파일은 Git에 포함하지 않음

### 3. 도메인 승인

- Firebase Authentication 승인된 도메인에 실제 도메인 추가

## 🛠️ 개발 시 주의사항

1. **보안**: API 키는 환경 변수로 관리
2. **비용**: Storage 사용량과 Firestore 읽기/쓰기 횟수 모니터링
3. **백업**: 중요한 데이터는 정기적으로 백업
4. **테스트**: Firebase Emulator를 사용한 로컬 개발 환경 구축 권장

## 📞 문의 및 지원

Firebase 관련 문제가 발생할 경우:

1. [Firebase 문서](https://firebase.google.com/docs) 참조
2. [Firebase 지원 센터](https://firebase.google.com/support) 문의
3. 개발팀 내부 문의
