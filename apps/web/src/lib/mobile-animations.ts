import type { Transition, Variants } from "motion/react";

export const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
} satisfies Transition;

export const gentleSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 0.8,
} satisfies Transition;

export const snappySpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
  mass: 0.8,
} satisfies Transition;

export const slideInRight: Variants = {
  initial: { x: "100%", opacity: 0.8 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0.8 },
};

export const slideOutRight: Variants = {
  initial: { x: 0, opacity: 1 },
  animate: { x: "100%", opacity: 0.8 },
  exit: { x: 0, opacity: 1 },
};

export const slideUp: Variants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
};

export const slideDown: Variants = {
  initial: { y: "-100%" },
  animate: { y: 0 },
  exit: { y: "-100%" },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const pageTransition: Variants = {
  initial: { x: "30%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-30%", opacity: 0 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export const tapScale = {
  whileTap: { scale: 0.97 },
  transition: snappySpring,
};
