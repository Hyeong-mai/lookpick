# 🔧 프로젝트 리팩토링 가이드

## 📋 개요

이 문서는 LookPick 프로젝트의 새로운 폴더 구조와 아키텍처를 설명합니다.

## 🎯 리팩토링 목표

1. **유지보수성 향상**: 관련 코드를 기능별로 그룹화
2. **코드 재사용성**: 공통 컴포넌트와 로직 분리
3. **가독성 개선**: 파일 크기 축소 및 명확한 구조
4. **확장성**: 새로운 기능 추가 용이

## 📁 새로운 폴더 구조

```
src/
├── features/                    # 기능별 모듈 (Feature-based architecture)
│   ├── service/                 # 서비스 관련 기능
│   │   ├── components/
│   │   │   ├── list/           # 서비스 목록 컴포넌트
│   │   │   │   ├── ServiceCard.js
│   │   │   │   ├── ServiceListHeader.js
│   │   │   │   └── ServiceFilterSidebar.js
│   │   │   ├── detail/         # 서비스 상세 컴포넌트
│   │   │   ├── form/           # 서비스 등록/수정 공통 컴포넌트
│   │   │   └── shared/         # 서비스 내 공통 컴포넌트
│   │   ├── hooks/
│   │   │   └── useServiceList.js  # 서비스 목록 로직
│   │   ├── styles/
│   │   │   ├── ServiceListPage.styles.js
│   │   │   └── ServiceCard.styles.js
│   │   └── utils/
│   │
│   ├── mypage/                  # 마이페이지 기능
│   │   ├── components/
│   │   │   ├── MyPageSidebar.js
│   │   │   ├── ProfileSection.js
│   │   │   ├── MyPostsList.js
│   │   │   └── PostModal.js
│   │   ├── hooks/
│   │   └── styles/
│   │
│   ├── admin/                   # 관리자 기능
│   │   ├── components/
│   │   │   ├── AdminTabNavigation.js
│   │   │   ├── AdminStatsCards.js
│   │   │   ├── AdminFilters.js
│   │   │   ├── AdminPostsList.js
│   │   │   ├── AdminUsersList.js
│   │   │   └── AdminModals.js
│   │   ├── hooks/
│   │   └── styles/
│   │
│   ├── auth/                    # 인증 기능
│   │   ├── components/
│   │   ├── hooks/
│   │   └── styles/
│   │
│   └── main/                    # 메인 페이지 기능
│       ├── components/
│       │   ├── MainContent.js
│       │   ├── Section1.js
│       │   ├── Section2.js
│       │   ├── Section3.js
│       │   └── ServiceCategorySection.js
│       └── styles/
│
├── shared/                      # 공유 리소스
│   ├── components/
│   │   ├── ui/                 # 재사용 가능한 UI 컴포넌트
│   │   │   ├── NotificationModal.js
│   │   │   ├── ResponsiveButton.js
│   │   │   ├── ResponsiveContainer.js
│   │   │   └── ResponsiveImage.js
│   │   └── layout/             # 레이아웃 컴포넌트
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       └── Layout.js
│   ├── hooks/
│   │   └── useResponsive.js
│   ├── utils/
│   │   ├── quoteGenerator.js
│   │   ├── rssGenerator.js
│   │   └── sitemapGenerator.js
│   ├── constants/
│   │   ├── categories.js       # 카테고리 상수
│   │   ├── regions.js          # 지역 상수
│   │   └── index.js
│   └── styles/
│       ├── GlobalStyle.js
│       └── theme.js
│
├── core/                        # 핵심 설정 및 인프라
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   └── storage.js
│   ├── contexts/
│   │   └── AuthContext.js
│   └── api/
│       ├── businessValidation.js
│       └── pdfConverter.js
│
└── pages/                       # 라우트 페이지 (얇은 레이어)
    ├── ServiceListPage.js       # ✨ 1304줄 → 133줄
    ├── ServiceDetailPage.js
    ├── ServiceRegisterPage.js
    ├── ServiceEditPage.js
    ├── MyPage.js
    ├── AdminPage.js
    ├── LoginPage.js
    ├── SignupPage.js
    └── MainPage.js
```

## 📊 개선 지표

### ServiceListPage 리팩토링
- **Before**: 1,304줄 (하나의 파일)
- **After**: 133줄 (페이지) + 분리된 컴포넌트들
- **개선율**: 약 90% 코드 감소

### 분리된 파일들
1. `useServiceList.js` (208줄) - 비즈니스 로직
2. `ServiceCard.js` (197줄) - 카드 컴포넌트
3. `ServiceListHeader.js` (55줄) - 헤더
4. `ServiceFilterSidebar.js` (89줄) - 필터
5. `ServiceListPage.styles.js` (341줄) - 레이아웃 스타일
6. `ServiceCard.styles.js` (334줄) - 카드 스타일

## 🔑 핵심 원칙

### 1. Feature-based Architecture
- 기능별로 코드를 그룹화
- 각 feature는 독립적으로 개발/테스트 가능
- 관련 코드가 한 곳에 모여 있어 유지보수 용이

### 2. 관심사의 분리 (Separation of Concerns)
```javascript
// ❌ Before: 모든 것이 한 파일에
const ServiceListPage = () => {
  // 1300줄의 코드...
  // 스타일, 로직, UI가 모두 섞여 있음
};

// ✅ After: 각각 분리
// 📄 useServiceList.js - 비즈니스 로직
// 📄 ServiceCard.js - UI 컴포넌트
// 📄 ServiceCard.styles.js - 스타일
// 📄 ServiceListPage.js - 페이지 조합
```

### 3. 계층 구조
```
pages (라우트)
  ↓
features (기능 모듈)
  ↓
shared (공통 리소스)
  ↓
core (핵심 인프라)
```

## 📖 사용 예시

### 1. 상수 사용
```javascript
// ✅ 새로운 방식
import { CATEGORIES, REGIONS } from '@/shared/constants';

// ❌ 기존 방식
const categories = [ /* 100줄의 하드코딩된 데이터 */ ];
```

### 2. Custom Hook 사용
```javascript
// ✅ 새로운 방식
import { useServiceList } from '@/features/service/hooks/useServiceList';

const ServiceListPage = () => {
  const {
    services,
    loading,
    filters,
    handleCategoryChange,
  } = useServiceList();
  
  // 간단한 UI 로직만
};
```

### 3. 컴포넌트 조합
```javascript
// ✅ 새로운 방식
import ServiceCard from '@/features/service/components/list/ServiceCard';
import ServiceListHeader from '@/features/service/components/list/ServiceListHeader';

// 작은 컴포넌트들을 조합하여 페이지 구성
```

## 🚀 다음 단계

### 완료 ✅
1. 새로운 폴더 구조 생성
2. ServiceListPage 리팩토링
3. 상수 분리 (categories, regions)
4. Core 설정 복사 (firebase, contexts)

### 진행 중 🔄
1. ServiceDetailPage 리팩토링
2. 나머지 페이지들 점진적 개선

### 예정 📋
1. TypeScript 마이그레이션 검토
2. 테스트 코드 작성
3. Storybook 도입
4. 성능 최적화

## 💡 컨벤션

### 파일 명명 규칙
- 컴포넌트: `PascalCase.js` (예: `ServiceCard.js`)
- 훅: `use + PascalCase.js` (예: `useServiceList.js`)
- 스타일: `*.styles.js` (예: `ServiceCard.styles.js`)
- 유틸: `camelCase.js` (예: `quoteGenerator.js`)
- 상수: `camelCase.js` (예: `categories.js`)

### Import 순서
```javascript
// 1. React 및 라이브러리
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Features
import { useServiceList } from '@/features/service/hooks/useServiceList';

// 3. Shared
import { CATEGORIES } from '@/shared/constants';

// 4. Core
import { db } from '@/core/firebase/config';

// 5. 스타일
import { Container } from './Component.styles';
```

## 🔧 마이그레이션 가이드

### 기존 코드 업데이트 방법

1. **기존 import 경로 유지**
   - `src/firebase/*` → 기존 코드는 그대로 사용 가능
   - `src/core/firebase/*` → 새로운 코드에서 사용

2. **점진적 마이그레이션**
   - 한 번에 모든 파일을 변경하지 않음
   - 새로운 기능 추가 시 새로운 구조 사용
   - 기존 기능 수정 시 점진적으로 리팩토링

3. **호환성 유지**
   - 기존 경로와 새로운 경로 모두 작동
   - 단계적으로 전환 가능

## 📞 문의

리팩토링 관련 질문이나 제안사항은 팀 채널로 문의해주세요.

