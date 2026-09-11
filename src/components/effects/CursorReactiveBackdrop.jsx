import React, { useEffect, useRef } from "react";

export default function CursorReactiveBackdrop() {
  const containerRef = useRef(null);
  const secondaryRef = useRef(null);
  const posRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0, secX: 0, secY: 0 });

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
      p.currentX += (p.targetX - p.currentX) * 0.045;
      p.currentY += (p.targetY - p.currentY) * 0.045;

      // Secondary layer with slightly different speed for true depth parallax
      p.secX += (p.targetX - p.secX) * 0.025;
      p.secY += (p.targetY - p.secY) * 0.025;

      if (containerRef.current) {
        const xOffset = p.currentX * 42; // 42px primary parallax
        const yOffset = p.currentY * 42;
        containerRef.current.style.transform = `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0)`;
      }

      if (secondaryRef.current) {
        const xSec = p.secX * -28; // -28px counter-depth parallax
        const ySec = p.secY * -28;
        secondaryRef.current.style.transform = `translate3d(${xSec.toFixed(1)}px, ${ySec.toFixed(1)}px, 0)`;
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
      {/* Primary Parallax Nebula (Electric Cyan & Neon Emerald) */}
      <div ref={containerRef} className="absolute inset-[-70px] will-change-transform">
        {/* Electric Cyan Glow Orb (Top-Left) */}
        <div className="absolute top-[6%] left-[8%] w-[480px] h-[480px] rounded-full bg-cyan-500/12 dark:bg-cyan-500/[0.09] blur-[130px] animate-pulse-glow" />

        {/* Neon Emerald Ambient Orb (Bottom-Left) */}
        <div className="absolute bottom-[8%] left-[18%] w-[440px] h-[440px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/[0.08] blur-[140px]" />
      </div>

      {/* Secondary Counter-Depth Nebula (Royal Violet & Vivid Teal) */}
      <div ref={secondaryRef} className="absolute inset-[-70px] will-change-transform">
        {/* Royal Violet / Purple Orb (Top-Right / Center) */}
        <div className="absolute top-[18%] right-[12%] w-[520px] h-[520px] rounded-full bg-violet-600/12 dark:bg-violet-600/[0.11] blur-[150px] animate-float-slow" />

        {/* Vivid Teal / Mint Orb (Bottom-Right) */}
        <div className="absolute bottom-[14%] right-[22%] w-[460px] h-[460px] rounded-full bg-teal-500/12 dark:bg-teal-500/[0.09] blur-[130px]" />
      </div>

      {/* Subtle Ambient Radial Mask overlay for texture and vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_-10%,rgba(6,182,212,0.06),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_90%_90%_at_50%_-10%,rgba(139,92,246,0.07),rgba(7,10,15,0))]" />
    </div>
  );
}
