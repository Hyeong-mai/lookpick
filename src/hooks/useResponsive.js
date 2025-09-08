import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // 브레이크포인트 설정
      if (width < 480) {
        setBreakpoint('xs');
      } else if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else if (width < 1200) {
        setBreakpoint('desktop');
      } else if (width < 1440) {
        setBreakpoint('large');
      } else {
        setBreakpoint('xl');
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);
    
    // 클린업
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 편의 함수들
  const isMobile = breakpoint === 'mobile' || breakpoint === 'xs';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop' || breakpoint === 'large' || breakpoint === 'xl';
  const isSmallScreen = breakpoint === 'xs' || breakpoint === 'mobile';
  const isLargeScreen = breakpoint === 'large' || breakpoint === 'xl';

  return {
    screenSize,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
  };
};

export default useResponsive;

