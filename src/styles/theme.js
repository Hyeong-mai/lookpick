export const theme = {
  colors: {
    primary: "#000000",
    primaryDark: "#000000",
    secondary: "#333333",
    accent: "#666666",
    success: "#000000",
    warning: "#333333",
    error: "#000000",
    dark: "#000000",
    light: "#F5F5F5",
    white: "#FFFFFF",
    black: "#000000",
    gray: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
  },
  gradients: {
    primary: "rgba(0,0,0,0.8)",
    secondary: "linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 50%, #EEEEEE 100%)",
    dark: "linear-gradient(135deg, #000000 0%, #212121 50%, #424242 100%)",
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
