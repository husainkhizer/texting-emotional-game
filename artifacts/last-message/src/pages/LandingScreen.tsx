import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { useEffect, useState } from "react";

const fragments = [
  "I should have said",
  "maybe we were",
  "I kept hoping",
  "the truth is",
  "that last night",
  "I still think",
  "maybe I wanted",
  "I didn't know",
];

function BackgroundFragment({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const x = Math.random() * 80 + 5;
  const y = Math.random() * 80 + 5;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    const hide = setTimeout(() => setVisible(false), delay + 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hide);
    };
  }, [delay]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute pointer-events-none text-white/8 text-sm font-light tracking-wider select-none"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LandingScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const [fragSet, setFragSet] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFragSet((n) => n + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {fragments.map((text, i) => (
          <BackgroundFragment
            key={`${fragSet}-${i}`}
            text={text}
            delay={i * 400}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-3">
          <motion.h1
            className="text-4xl font-light tracking-widest text-white uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Last Message
          </motion.h1>
          <motion.p
            className="text-sm text-white/45 tracking-wide max-w-xs font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Complete the message.
            <br />
            See what it says about you.
          </motion.p>
        </div>

        <motion.button
          onClick={startGame}
          className="mt-4 px-10 py-3.5 border border-white/20 text-white/70 text-sm tracking-widest uppercase hover:text-white hover:border-white/40 transition-all duration-300 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          whileTap={{ scale: 0.97 }}
        >
          Play
        </motion.button>
      </motion.div>

      <motion.p
        className="absolute bottom-8 text-white/20 text-xs tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        No wrong answers.
      </motion.p>
    </div>
  );
}
