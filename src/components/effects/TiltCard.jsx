import React, { useRef, useState, useCallback } from "react";

export default function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  tiltMaxAngle,
  scale = 1.012,
  glare = true,
  glareColor = "rgba(6, 182, 212, 0.12)",
  glowBorder = false,
  ...props
}) {
  const cardRef = useRef(null);
  const effectiveMaxTilt = tiltMaxAngle !== undefined ? tiltMaxAngle : maxTilt;

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
      const rotateX = ((y - centerY) / centerY) * -effectiveMaxTilt;
      const rotateY = ((x - centerX) / centerX) * effectiveMaxTilt;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: "transform 0.08s ease-out"
      });

      if (glare) {
        setGlarePos({
          x: Math.round((x / rect.width) * 100),
          y: Math.round((y / rect.height) * 100),
          opacity: 1
        });
      }
    },
    [effectiveMaxTilt, scale, glare]
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
      className={`relative will-change-transform transform-gpu transition-shadow duration-300 ${
        glowBorder ? "hover:shadow-glow-card-hover" : ""
      } ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Specular Spotlight Glare with iridescent tone */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 overflow-hidden z-10"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 300px at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 70%)`
          }}
        />
      )}
    </div>
  );
}
