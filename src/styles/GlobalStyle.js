import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
    
    @media (max-width: 480px) {
      font-size: 13px;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  ul, li {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* 반응형 컨테이너 */
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 0 1rem;
    
    @media (min-width: 768px) {
      max-width: 720px;
      padding: 0 1.5rem;
    }
    
    @media (min-width: 1024px) {
      max-width: 960px;
      padding: 0 2rem;
    }
    
    @media (min-width: 1200px) {
      max-width: 1140px;
      padding: 0 2rem;
    }
    
    @media (min-width: 1440px) {
      max-width: 1320px;
      padding: 0 2rem;
    }
  }

  /* 반응형 그리드 시스템 */
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
  }

  .col {
    flex: 1;
    padding: 0 0.5rem;
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
    .row {
      flex-direction: column;
    }
  }

  /* 반응형 유틸리티 클래스 */
  .d-none { display: none !important; }
  .d-block { display: block !important; }
  .d-flex { display: flex !important; }
  .d-grid { display: grid !important; }

  .text-center { text-align: center !important; }
  .text-left { text-align: left !important; }
  .text-right { text-align: right !important; }

  .w-100 { width: 100% !important; }
  .h-100 { height: 100% !important; }

  .m-0 { margin: 0 !important; }
  .p-0 { padding: 0 !important; }

  /* 반응형 숨김/표시 */
  @media (max-width: 768px) {
    .d-desktop { display: none !important; }
    .d-mobile { display: block !important; }
  }

  @media (min-width: 769px) {
    .d-mobile { display: none !important; }
    .d-desktop { display: block !important; }
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* 포커스 스타일 */
  *:focus {
    outline: 2px solid #4ECDC4;
    outline-offset: 2px;
  }

  /* 터치 디바이스 최적화 */
  @media (hover: none) and (pointer: coarse) {
    button, a {
      min-height: 44px;
      min-width: 44px;
    }
  }
`;
