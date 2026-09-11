import React, { useRef, useState, useCallback } from "react";

export default function MagneticButton({
  children,
  className = "",
  strength = 0.28,
  onClick,
  ...props
}) {
  const btnRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setPosition({ x: deltaX, y: deltaY });
    },
    [strength]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `translate3d(${position.x.toFixed(1)}px, ${position.y.toFixed(1)}px, 0)`,
        transition: isHovered
          ? "transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)"
          : "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
      className={`inline-block will-change-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
