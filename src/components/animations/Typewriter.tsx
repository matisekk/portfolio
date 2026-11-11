import { motion, useReducedMotion } from "motion/react";

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursor?: boolean;
}

const Typewriter = ({
  text,
  delay = 0,
  speed = 0.025,
  className = "",
  cursor = false,
}: TypewriterProps) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span aria-label={text}>
        {text.split("").map((character, index) => (
          <motion.span
            key={`${character}-${index}`}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.01,
              delay: delay + index * speed,
            }}
          >
            {character}
          </motion.span>
        ))}
      </span>

      {cursor && (
        <motion.span
          aria-hidden="true"
          className="ml-1 inline-block h-[1em] w-px translate-y-0.5 bg-(--accent)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            delay: delay + text.length * speed,
            duration: 0.9,
            repeat: 2,
            times: [0, 0.1, 0.6, 1],
          }}
        />
      )}
    </span>
  );
};

export default Typewriter;
