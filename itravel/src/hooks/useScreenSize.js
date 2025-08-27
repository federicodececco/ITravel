import { useState, useEffect } from 'react';

export function useScreenSize(delay = 150) {
  const [screenSize, setScreenSize] = useState(() => {
    return { width: window.innerWidth, height: window.innerHeight };
  });

  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, delay);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return screenSize;
}

export function useIsMobile() {
  const { width } = useScreenSize();
  return width <= 768;
}

export function useIsTablet() {
  const { width } = useScreenSize();
  return width > 768 && width < 1024;
}

export function useIsDesktop() {
  const { width } = useScreenSize();
  return width >= 1024;
}

export function useBreakpoint(
  breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
) {
  const { width } = useScreenSize();

  return {
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
    isDesktop: width >= breakpoints.desktop,
    width,
  };
}
