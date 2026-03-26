import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore, type ConversationEntry } from "../store/gameStore";

type EndingPhase = "thread" | "typing" | "seen" | "reflection";

function HistoryBubble({ entry, index }: { entry: ConversationEntry; index: number }) {
  const isYou = entry.role === "you";
  return (
    <motion.div
      className={`flex items-end gap-2 px-3 py-0.5 ${isYou ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
    >
      {!isYou && (
        <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 mb-0.5" />
      )}
      <div
        className={`max-w-[72%] px-3.5 py-2.5 text-[15px] leading-snug font-light ${
          isYou
            ? "bg-[#3b5bdb] text-white rounded-2xl rounded-br-sm"
            : "bg-[#1c1c1e] text-white/90 rounded-2xl rounded-bl-sm"
        }`}
      >
        {entry.text}
      </div>
    </motion.div>
  );
}

export function EndingScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const conversation = useGameStore((s) => s.conversation);
  const [step, setStep] = useState<EndingPhase>("thread");

  useEffect(() => {
    const t1 = setTimeout(() => setStep("typing"), 1200);
    const t2 = setTimeout(() => setStep("seen"), 3000);
    const t3 = setTimeout(() => setStep("reflection"), 5500);
    const t4 = setTimeout(() => setPhase("reflection"), 5900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [setPhase]);

  return (
    <div className="h-screen w-full flex flex-col bg-black overflow-hidden">
      <div className="flex-shrink-0 bg-black/95 backdrop-blur-sm border-b border-white/6">
        <div className="flex items-center gap-3 px-4 pt-12 pb-3">
          <button className="text-white/40 p-1 -ml-1">
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
              <path d="M9 1L1.5 8.5L9 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex flex-col items-center flex-1">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-0.5">
              <span className="text-white/50 text-xs font-medium">A</span>
            </div>
            <span className="text-white text-[13px] font-medium">Alex</span>
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-0.5" style={{ scrollbarWidth: "none" }}>
        {conversation.map((entry, i) => (
          <HistoryBubble key={i} entry={entry} index={i} />
        ))}

        <div className="py-2" />

        <AnimatePresence mode="wait">
          {step === "typing" && (
            <motion.div
              key="typing"
              className="flex items-end gap-2 px-3 py-0.5 justify-start"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.35 }}
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0" />
              <div className="flex items-center gap-1 px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-[#1c1c1e]">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/50"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {(step === "seen" || step === "reflection") && (
            <motion.div
              key="seen"
              className="flex flex-col items-end px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === "reflection" ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-white/25 text-[12px] font-light tracking-wide">
                  Seen 2:14 AM
                </span>
                <div className="w-3 h-3 rounded-full border border-white/25 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-8" />
      </div>
    </div>
  );
}
