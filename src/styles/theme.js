export const theme = {
  colors: {
    primary: "#FF6B6B",
    primaryDark: "#FF4F4F",
    secondary: "#4ECDC4",
    accent: "#45B7D1",
    success: "#96CEB4",
    warning: "#FECA57",
    error: "#FF9FF3",
    dark: "#2F3542",
    light: "#F1F2F6",
    white: "#FFFFFF",
    gray: {
      50: "#F8F9FA",
      100: "#F8F9FA",
      200: "#E9ECEF",
      300: "#DEE2E6",
      400: "#CED4DA",
      500: "#ADB5BD",
      600: "#6C757D",
      700: "#495057",
      800: "#343A40",
      900: "#212529",
    },
  },
  gradients: {
    primary: "linear-gradient(135deg, rgb(73, 126, 233) 0%, rgb(190, 94, 237) 50%, rgb(240, 117, 199) 100%)",
  },
  breakpoints: {
    xs: "320px",
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    large: "1200px",
    xl: "1440px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    round: "50px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    md: "0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)",
    lg: "0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)",
    xl: "0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)",
  },
  // 반응형 유틸리티 함수들
  media: {
    xs: `@media (max-width: ${480 - 1}px)`,
    mobile: `@media (max-width: ${768 - 1}px)`,
    tablet: `@media (max-width: ${1024 - 1}px)`,
    desktop: `@media (min-width: ${1024}px)`,
    large: `@media (min-width: ${1200}px)`,
    xl: `@media (min-width: ${1440}px)`,
  },
  // 컨테이너 최대 너비
  container: {
    xs: "100%",
    mobile: "100%",
    tablet: "720px",
    desktop: "960px",
    large: "1140px",
    xl: "1320px",
  },
  // 폰트 크기 스케일
  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem",  // 36px
    "5xl": "3rem",     // 48px
    "6xl": "3.75rem",  // 60px
  },
  // 간격 스케일
  gap: {
    xs: "0.5rem",     // 8px
    sm: "1rem",       // 16px
    md: "1.5rem",     // 24px
    lg: "2rem",       // 32px
    xl: "3rem",       // 48px
    "2xl": "4rem",    // 64px
  },
};
