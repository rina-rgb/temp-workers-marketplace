import { useState, useEffect } from 'react';
import { Fab, Zoom, useTheme, useMediaQuery } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';

interface BackToTopButtonProps {
  threshold?: number;
  targetRef?: React.RefObject<HTMLElement>;
  containerPosition?: 'fixed' | 'absolute';
}

const BackToTopButton = ({ threshold = 200, targetRef, containerPosition = 'fixed' }: BackToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const actualThreshold = isMobile ? 20 : threshold;

  const scrollElement = targetRef?.current ?? null;

  useEffect(() => {
    const updateVisibility = () => {
      const scrollTop = scrollElement
        ? scrollElement.scrollTop
        : window.pageYOffset || document.documentElement.scrollTop;

      setIsVisible(scrollTop > actualThreshold);
    };

    const scrollTarget: HTMLElement | Window = scrollElement ?? window;

    updateVisibility();

    scrollTarget.addEventListener('scroll', updateVisibility, { passive: true });
    return () => {
      scrollTarget.removeEventListener('scroll', updateVisibility);
    };
  }, [scrollElement, actualThreshold]);


  const scrollToTop = () => {
    const element = targetRef?.current;

    if (element) {
      element.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Zoom in={isVisible} timeout={300}>
      <Fab
        color="primary"
        size="medium"
        aria-label="scroll back to top"
        onClick={scrollToTop}
        sx={{
          position: containerPosition,
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 1000,
          boxShadow: 3,
          '&:hover': {
            transform: 'scale(1.1)',
            transition: 'transform 0.2s ease-in-out'
          }
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
};

export default BackToTopButton;
