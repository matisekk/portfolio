import { motion, useReducedMotion } from "motion/react";

interface AnimatedStackProps {
  items: string[];
  delay?: number;
}

const AnimatedStack = ({ items, delay = 0 }: AnimatedStackProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex max-w-xl flex-wrap gap-x-6 gap-y-3">
      {items.map((technology, index) => (
        <motion.span
          key={technology}
          initial={
            reduceMotion
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {
                  opacity: 0,
                  y: 6,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            delay: reduceMotion ? 0 : delay + index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          data-sound-hover
          className="relative text-sm text-(--foreground-secondary) after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-(--accent) after:transition-[width] after:duration-300 hover:text-(--foreground) hover:after:w-full"
        >
          {technology}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedStack;
