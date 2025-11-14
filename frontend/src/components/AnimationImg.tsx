import { AnimatePresence, motion } from "framer-motion";
import type { AnimationImgProps } from "../types/components/animationImg";

function AnimationImg ({ src, alt, className, uniqueKey, duration = 0.35 }: AnimationImgProps){
    return (
    <AnimatePresence mode="wait">
      <motion.img
        key={uniqueKey}
        src={src}
        alt={alt}
        className={className}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{
          duration,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </AnimatePresence>
  );
}

export default AnimationImg;