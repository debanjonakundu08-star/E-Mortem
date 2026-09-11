import React, { useEffect, useRef } from "react";

export default function CursorReactiveBackdrop() {
  const containerRef = useRef(null);
  const posRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });

  useEffect(() => {
    let animId;

    const handleMouseMove = (e) => {
      // Normalize from -1 to 1 based on viewport center
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      posRef.current.targetX = x;
      posRef.current.targetY = y;
    };

    const animate = () => {
      const p = posRef.current;
      // Spring lerp interpolation (smooth dampening)
      p.currentX += (p.targetX - p.currentX) * 0.04;
      p.currentY += (p.targetY - p.currentY) * 0.04;

      if (containerRef.current) {
        const xOffset = p.currentX * 35; // 35px max parallax
        const yOffset = p.currentY * 35;
        containerRef.current.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div ref={containerRef} className="absolute inset-[-60px] transition-transform duration-75 ease-out will-change-transform">
        {/* Teal Glow Orb */}
        <div className="absolute top-[8%] left-[12%] w-[420px] h-[420px] rounded-full bg-teal-500/10 dark:bg-teal-500/[0.07] blur-[120px]" />
        {/* Cyan Ambient Orb */}
        <div className="absolute top-[42%] right-[10%] w-[480px] h-[480px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/[0.06] blur-[140px]" />
        {/* Subtle Violet / Amber Balance Orb */}
        <div className="absolute bottom-[10%] left-[28%] w-[520px] h-[520px] rounded-full bg-indigo-500/[0.07] dark:bg-amber-500/[0.04] blur-[160px]" />
      </div>

      {/* Subtle Ambient Radial Mask overlay for texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.06),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.08),rgba(10,14,23,0))]" />
    </div>
  );
}
