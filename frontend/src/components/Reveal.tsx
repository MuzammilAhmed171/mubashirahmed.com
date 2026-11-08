import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type RevealDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "zoom"
  | "flip-up"
  | "fade"
  | "none";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
};

/** Fades and animates content smoothly using Framer Motion when scrolling into view. */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
  distance = 45,
  duration = 0.6,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  const getAnimationVariants = () => {
    if (prefersReduced) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
    }
    switch (direction) {
      case "left":
        return {
          initial: { opacity: 0, x: -distance },
          animate: { opacity: 1, x: 0 },
        };
      case "right":
        return {
          initial: { opacity: 0, x: distance },
          animate: { opacity: 1, x: 0 },
        };
      case "down":
        return {
          initial: { opacity: 0, y: -distance },
          animate: { opacity: 1, y: 0 },
        };
      case "scale":
      case "zoom":
        return {
          initial: { opacity: 0, scale: 0.92 },
          animate: { opacity: 1, scale: 1 },
        };
      case "flip-up":
        return {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
        };
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "none":
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
        };
      case "up":
      default:
        return {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const { initial, animate } = getAnimationVariants();

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: prefersReduced ? 0 : duration,
        delay: prefersReduced ? 0 : delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
