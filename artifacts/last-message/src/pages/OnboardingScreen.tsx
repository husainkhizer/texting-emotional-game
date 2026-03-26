import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";

const DEMO_OPTIONS = ["random", "weird", "much", "late"];

export function OnboardingScreen() {
  const setPhase = useGameStore((s) => s.setPhase);

  return (
    <div className="h-screen w-full flex flex-col bg-black">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm flex flex-col items-center gap-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="text-center">
            <p className="text-white/30 text-[11px] tracking-[0.2em] uppercase mb-2">
              how it works
            </p>
            <p className="text-white/60 text-[15px] font-light leading-relaxed">
              You're drafting a message to someone.
              <br />
              There's one word missing.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="max-w-[78%] px-4 py-3 bg-[#3b5bdb] text-white text-[15px] font-light rounded-2xl rounded-br-sm leading-snug">
                Hey. I know this is a little{" "}
                <motion.span
                  className="inline-block align-middle mx-0.5"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  <span className="inline-block w-8 h-px bg-white/60 relative top-[-2px]" />
                </motion.span>{" "}
                out of nowhere.
              </div>
            </motion.div>

            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <div className="flex border border-white/10 rounded-xl overflow-hidden bg-[#1c1c1e]">
                {DEMO_OPTIONS.map((word, i) => (
                  <div
                    key={word}
                    className={`flex-1 py-2.5 text-center text-[13px] text-white/55 font-light ${
                      i < DEMO_OPTIONS.length - 1 ? "border-r border-white/10" : ""
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <p className="text-white/60 text-[14px] font-light leading-relaxed">
              Tap a word to complete the message.
            </p>
            <p className="text-white/30 text-[13px] font-light leading-relaxed">
              15 messages. Each choice quietly shapes a reflection
              <br />
              about how you communicate.
            </p>
          </motion.div>

          <motion.button
            onClick={() => setPhase("playing")}
            className="mt-2 px-10 py-3.5 border border-white/20 text-white/70 text-sm tracking-widest uppercase hover:text-white hover:border-white/40 transition-all duration-300 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileTap={{ scale: 0.97 }}
          >
            Begin
          </motion.button>
        </motion.div>
      </div>

      <motion.p
        className="text-white/15 text-xs tracking-widest text-center"
        style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        No right answers.
      </motion.p>
    </div>
  );
}
