"use client";

import { useEffect, useState } from "react";
import {
  LazyMotion,
  m,
  domAnimation,
  useMotionValue,
  useSpring,
} from "framer-motion";

export function Cursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 1200, mass: 0.5 };
  const cursorXSpring = useSpring(mouseX, springConfig);
  const cursorYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const moveCursor = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleTouchStart = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    timer = setTimeout(() => {
      const hasHoverCapability = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (hasHoverCapability) {
        setIsVisible(true);
      }

      window.addEventListener("mousemove", moveCursor);
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("mouseover", handleMouseOver);
    }, 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <LazyMotion features={domAnimation}>
      {/* Spotlight Cursor */}
      <m.div
        aria-hidden="true"
        className="fixed top-0 left-0 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference backdrop-grayscale backdrop-contrast-200"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          translateZ: 0,
          width: "32px",
          height: "32px",
          willChange: "transform",
        }}
        animate={{
          scale: isHovered ? 2.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      />
      <style jsx global>{`
        body,
        a,
        button {
          cursor: none !important;
        }
      `}</style>
    </LazyMotion>
  );
}
