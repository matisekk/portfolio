import { motion, useReducedMotion } from "motion/react";

interface AnimatedDividerProps {
  delay?: number;
  className?: string;
}

const AnimatedDivider = ({ delay = 0, className = "" }: AnimatedDividerProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? {
              scaleX: 1,
              opacity: 1,
            }
          : {
              scaleX: 0,
              opacity: 0,
            }
      }
      animate={{
        scaleX: 1,
        opacity: 1,
      }}
      transition={{
        duration: 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`origin-left ${className}`}
    />
  );
};

export default AnimatedDivider;
