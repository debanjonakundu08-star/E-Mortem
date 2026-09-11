import React, { useEffect, useRef } from "react";

/**
 * ParallaxElement
 * Gives decorative icons, badges, and score rings tangible 3D depth by gently
 * shifting with cursor movement relative to the screen.
 */
export default function ParallaxElement({
  children,
  depth = 12,
  className = "",
  style = {},
  ...props
}) {
  const elemRef = useRef(null);
  const posRef = useRef({ targetX: 0, targetY: 0, curX: 0, curY: 0 });

  useEffect(() => {
    let animId;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      posRef.current.targetX = normX * depth;
      posRef.current.targetY = normY * depth;
    };

    const update = () => {
      const p = posRef.current;
      p.curX += (p.targetX - p.curX) * 0.08;
      p.curY += (p.targetY - p.curY) * 0.08;

      if (elemRef.current) {
        elemRef.current.style.transform = `translate3d(${p.curX.toFixed(2)}px, ${p.curY.toFixed(2)}px, 0)`;
      }

      animId = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [depth]);

  return (
    <div
      ref={elemRef}
      className={`will-change-transform transform-gpu ${className}`}
      style={{ ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
