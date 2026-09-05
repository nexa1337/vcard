import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const updatePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) setIsVisible(true);

      // Use requestAnimationFrame for smooth DOM updates
      if (outerRef.current && innerRef.current) {
        outerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        innerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null;
      
      setIsHovering(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', updateHoverState, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="pointer-events-none fixed inset-0 z-[9999] hidden [@media(pointer:fine)]:block transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {/* Outer Ring */}
        <div
          ref={outerRef}
          className={`absolute top-0 left-0 rounded-full border border-fuchsia-500/50 mix-blend-screen transition-colors duration-300 ease-out will-change-transform ${
            isHovering ? 'w-12 h-12 bg-fuchsia-500/10' : 'w-8 h-8'
          }`}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        {/* Inner Dot */}
        <div
          ref={innerRef}
          className={`absolute top-0 left-0 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.8)] transition-all duration-150 will-change-transform ${
            isHovering ? 'w-1 h-1 opacity-50' : 'w-2 h-2 opacity-100'
          }`}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </>
  );
}
