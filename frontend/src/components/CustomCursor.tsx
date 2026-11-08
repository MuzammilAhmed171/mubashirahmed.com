import { useEffect, useRef } from "react";

// ============================================================================
// CURSOR FOLLOWER CONFIGURATION
// ============================================================================
const DOT_OFFSET_X = 9;
const DOT_OFFSET_Y = 9;
const DOT_SIZE = 13;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      // Smooth follow
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${dotX - DOT_OFFSET_X}px, ${dotY - DOT_OFFSET_Y}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: "50%",
        backgroundColor: "#FFC107",
        border: "1.5px solid rgba(0, 0, 0, 0.75)",
        pointerEvents: "none",
        zIndex: 99999,
        willChange: "transform",
        transform: "translate3d(-100px, -100px, 0)",
      }}
    />
  );
}
