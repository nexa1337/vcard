import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
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

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);
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
          className={`absolute rounded-full border border-fuchsia-500/50 mix-blend-screen transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 ${
            isHovering ? 'w-12 h-12 bg-fuchsia-500/10 scale-110' : 'w-8 h-8'
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
        {/* Inner Dot */}
        <div
          className={`absolute rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.8)] transition-all duration-150 -translate-x-1/2 -translate-y-1/2 ${
            isHovering ? 'w-1 h-1 opacity-50' : 'w-2 h-2 opacity-100'
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      </div>
    </>
  );
}
