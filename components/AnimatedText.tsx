import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
};

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText = ({
  text,
  className = "text-2xl font-semibold tracking-wide",
}: AnimatedTextProps) => {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export default AnimatedText;
