import type { PropsWithChildren } from "react";

import { motion, useReducedMotion } from "motion/react";

interface FadeInProps extends PropsWithChildren {
  delay?: number;
  className?: string;
  x?: number;
  y?: number;
  duration?: number;
}

const FadeIn = ({
  children,
  delay = 0,
  className = "",
  x = 0,
  y = 8,
  duration = 0.45,
}: FadeInProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? {
              opacity: 1,
              x: 0,
              y: 0,
            }
          : {
              opacity: 0,
              x,
              y,
            }
      }
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
