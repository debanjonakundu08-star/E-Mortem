import React, { useRef, useState, useCallback } from "react";

export default function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  scale = 1.015,
  glare = true,
  ...props
}) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
  });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: "transform 0.1s ease-out"
      });

      if (glare) {
        setGlarePos({
          x: Math.round((x / rect.width) * 100),
          y: Math.round((y / rect.height) * 100),
          opacity: 1
        });
      }
    },
    [maxTilt, scale, glare]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
    });
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [glare]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`relative will-change-transform transform-gpu ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Specular Spotlight Glare */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(20, 184, 166, 0.10), transparent 70%)`
          }}
        />
      )}
    </div>
  );
}
