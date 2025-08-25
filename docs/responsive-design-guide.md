# LookPick 반응형 디자인 가이드

## 개요

이 문서는 LookPick 프로젝트의 반응형 디자인 시스템과 구현 방법을 설명합니다.

## 브레이크포인트

### 기본 브레이크포인트
- **xs**: 320px 이하 (초소형 모바일)
- **mobile**: 480px 이하 (모바일)
- **tablet**: 768px 이하 (태블릿)
- **desktop**: 1024px 이상 (데스크톱)
- **large**: 1200px 이상 (대형 데스크톱)
- **xl**: 1440px 이상 (초대형 데스크톱)

### 컨테이너 최대 너비
- **xs**: 100%
- **mobile**: 100%
- **tablet**: 720px
- **desktop**: 960px
- **large**: 1140px
- **xl**: 1320px

## 테마 시스템 활용

### 미디어 쿼리
```javascript
${(props) => props.theme.media.mobile} {
  // 모바일 스타일
}

${(props) => props.theme.media.tablet} {
  // 태블릿 스타일
}

${(props) => props.theme.media.desktop} {
  // 데스크톱 스타일
}
```

### 간격 시스템
```javascript
// spacing
xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px"

// gap
xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2rem", xl: "3rem", "2xl": "4rem"
```

### 폰트 크기
```javascript
xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", 
xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", 
"5xl": "3rem", "6xl": "3.75rem"
```

## 반응형 컴포넌트

### ResponsiveContainer
```javascript
import ResponsiveContainer from '../common/ResponsiveContainer';

<ResponsiveContainer>
  <h1>반응형 컨테이너</h1>
</ResponsiveContainer>
```

### ResponsiveGrid
```javascript
import ResponsiveGrid from '../common/ResponsiveGrid';

<ResponsiveGrid columns={3} tabletCols={2} mobileCols={1}>
  <ResponsiveGrid.Item>아이템 1</ResponsiveGrid.Item>
  <ResponsiveGrid.Item>아이템 2</ResponsiveGrid.Item>
  <ResponsiveGrid.Item>아이템 3</ResponsiveGrid.Item>
</ResponsiveGrid>
```

### ResponsiveButton
```javascript
import ResponsiveButton from '../common/ResponsiveButton';

<ResponsiveButton 
  variant="primary" 
  size="large"
  fullWidth
>
  버튼
</ResponsiveButton>
```

### ResponsiveImage
```javascript
import ResponsiveImage from '../common/ResponsiveImage';

<ResponsiveImage
  src="/image.jpg"
  alt="이미지"
  height="300px"
  mobileHeight="200px"
  hover
/>
```

## 반응형 훅

### useResponsive
```javascript
import useResponsive from '../hooks/useResponsive';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
};
```

## CSS 클래스 유틸리티

### 반응형 표시/숨김
```css
.d-mobile { display: block !important; }
.d-desktop { display: block !important; }

@media (max-width: 768px) {
  .d-desktop { display: none !important; }
}

@media (min-width: 769px) {
  .d-mobile { display: none !important; }
}
```

### 그리드 시스템
```css
.row {
  display: flex;
  flex-wrap: wrap;
}

.col-12 { flex: 0 0 100%; }
.col-6 { flex: 0 0 50%; }
.col-4 { flex: 0 0 33.333333%; }
.col-3 { flex: 0 0 25%; }

@media (max-width: 768px) {
  .col-md-12 { flex: 0 0 100%; }
  .col-md-6 { flex: 0 0 50%; }
}

@media (max-width: 480px) {
  .col-sm-12 { flex: 0 0 100%; }
  .row { flex-direction: column; }
}
```

## 모바일 최적화

### 터치 친화적 디자인
- 버튼과 링크의 최소 크기: 44px × 44px
- 터치 영역 간 적절한 간격 유지
- 스크롤 가능한 영역 명확히 표시

### 성능 최적화
- 이미지 lazy loading
- 불필요한 애니메이션 제거
- 터치 이벤트 최적화

## 테스트 방법

### 개발자 도구
- Chrome DevTools의 Device Toolbar 활용
- 다양한 화면 크기에서 테스트
- 실제 디바이스에서 테스트

### 주요 테스트 포인트
- 320px (초소형 모바일)
- 480px (모바일)
- 768px (태블릿)
- 1024px (데스크톱)
- 1200px (대형 데스크톱)
- 1440px (초대형 데스크톱)

## 모범 사례

### 1. 모바일 우선 접근법
```javascript
// 기본 스타일은 모바일용
const Component = styled.div`
  padding: 1rem;
  font-size: 1rem;
  
  // 태블릿 이상에서 스타일 변경
  ${(props) => props.theme.media.tablet} {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
`;
```

### 2. 일관된 간격 사용
```javascript
// 하드코딩된 값 대신 테마 값 사용
const Component = styled.div`
  margin: ${(props) => props.theme.spacing.md};
  gap: ${(props) => props.theme.gap.sm};
`;
```

### 3. 적절한 폰트 크기
```javascript
// 반응형 폰트 크기
const Title = styled.h1`
  font-size: ${(props) => props.theme.fontSize["4xl"]};
  
  ${(props) => props.theme.media.mobile} {
    font-size: ${(props) => props.theme.fontSize["2xl"]};
  }
`;
```

## 문제 해결

### 일반적인 문제들
1. **오버플로우**: `overflow-x: hidden` 사용
2. **터치 이벤트**: 적절한 크기와 간격 설정
3. **성능**: 불필요한 리렌더링 방지
4. **접근성**: 키보드 네비게이션 지원

### 디버깅 팁
- 브라우저 개발자 도구 활용
- 실제 디바이스에서 테스트
- 성능 모니터링 도구 사용
