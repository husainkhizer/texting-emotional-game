import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { levels } from "../data/levels";
import { useGameStore, type ConversationEntry } from "../store/gameStore";

type LocalPhase =
  | "composing"
  | "you-typing"
  | "typewriting"
  | "sent"
  | "them-typing"
  | "them-responded";

function TypingIndicator({ side }: { side: "you" | "them" }) {
  return (
    <div className={`flex items-end gap-2 px-3 py-1 ${side === "you" ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-center gap-1 px-3.5 py-2.5 rounded-2xl ${
          side === "you"
            ? "rounded-br-sm bg-[#3b5bdb]"
            : "rounded-bl-sm bg-[#1c1c1e]"
        }`}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.18,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HistoryBubble({ entry }: { entry: ConversationEntry }) {
  const isYou = entry.role === "you";
  return (
    <motion.div
      className={`flex items-end gap-2 px-3 py-0.5 ${isYou ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
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

function ComposingBubble({
  text,
  displayWord,
  isWriting,
}: {
  text: string;
  displayWord: string;
  isWriting: boolean;
}) {
  const parts = text.split("___");
  return (
    <div className="flex items-end gap-2 px-3 py-0.5 justify-end">
      <motion.div
        className="max-w-[72%] px-3.5 py-2.5 text-[15px] leading-snug font-light bg-[#3b5bdb] text-white rounded-2xl rounded-br-sm"
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 0.2 }}
      >
        {isWriting && displayWord ? (
          <span>
            {parts[0]}
            <span>{displayWord}</span>
            <motion.span
              className="inline-block w-0.5 h-[1em] bg-white/80 align-middle ml-px"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            {parts[1]}
          </span>
        ) : (
          <span>
            {parts[0]}
            <motion.span
              className="inline-block min-w-[2rem] h-px bg-white/40 align-middle mx-0.5 relative top-[-2px]"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            {parts[1]}
          </span>
        )}
      </motion.div>
    </div>
  );
}

function SentBubble({ text }: { text: string }) {
  return (
    <motion.div
      className="flex items-end gap-2 px-3 py-0.5 justify-end"
      initial={{ scale: 0.96, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.22, ease: "backOut" }}
    >
      <div className="max-w-[72%] px-3.5 py-2.5 text-[15px] leading-snug font-light bg-[#3b5bdb] text-white rounded-2xl rounded-br-sm">
        {text}
      </div>
    </motion.div>
  );
}

export function GameScreen() {
  const { currentLevel, makeChoice, addToConversation, conversation } = useGameStore();
  const [localPhase, setLocalPhase] = useState<LocalPhase>("composing");
  const [displayLevel, setDisplayLevel] = useState(currentLevel);
  const [displayWord, setDisplayWord] = useState("");
  const [sentText, setSentText] = useState<string | null>(null);
  const [themResponse, setThemResponse] = useState<string | null>(null);

  const level = levels[displayLevel];
  const bottomRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const after = useCallback((fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay);
    timeoutsRef.current.push(t);
  }, []);

  useEffect(() => {
    clearTimeouts();
    setLocalPhase("composing");
    setDisplayWord("");
    setSentText(null);
    setThemResponse(null);
    setDisplayLevel(currentLevel);
    return () => clearTimeouts();
  }, [currentLevel, clearTimeouts]);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  }, [conversation, localPhase, sentText, themResponse]);

  const handleChoice = useCallback(
    (optionIndex: number) => {
      if (localPhase !== "composing") return;
      const option = level?.options[optionIndex];
      if (!option) return;

      setLocalPhase("you-typing");

      const youTypingDelay = 420;

      after(() => {
        setLocalPhase("typewriting");
      }, youTypingDelay);

      const word = option.text;
      const charDelay = 65;
      const chars = word.split("");

      chars.forEach((_, i) => {
        after(() => {
          setDisplayWord(word.slice(0, i + 1));
        }, youTypingDelay + i * charDelay);
      });

      const typewriterDone = youTypingDelay + chars.length * charDelay + 120;

      after(() => {
        const completedText = level!.text.replace("___", word);
        setSentText(completedText);
        setLocalPhase("sent");

        after(() => {
          addToConversation({ role: "you", text: completedText });

          const response = level!.response;

          if (response) {
            setLocalPhase("them-typing");
            after(() => {
              setThemResponse(response);
              setLocalPhase("them-responded");
              after(() => {
                addToConversation({ role: "them", text: response });
                setSentText(null);
                setThemResponse(null);
                makeChoice(optionIndex);
              }, 600);
            }, 1400);
          } else {
            after(() => {
              setSentText(null);
              makeChoice(optionIndex);
            }, 500);
          }
        }, 500);
      }, typewriterDone);
    },
    [localPhase, level, after, addToConversation, makeChoice]
  );

  if (!level) return null;

  const totalLevels = levels.length;
  const progress = (displayLevel + 1) / totalLevels;

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

        <div className="px-4 pb-3">
          <div className="h-px bg-white/6 w-full rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/25 rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div
        ref={threadRef}
        className="flex-1 overflow-y-auto py-4 space-y-0.5"
        style={{ scrollbarWidth: "none" }}
      >
        {conversation.map((entry, i) => (
          <HistoryBubble key={i} entry={entry} />
        ))}

        <AnimatePresence>
          {localPhase === "you-typing" && (
            <motion.div
              key="you-typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.22 }}
            >
              <TypingIndicator side="you" />
            </motion.div>
          )}

          {(localPhase === "composing" || localPhase === "typewriting") && (
            <motion.div
              key="composing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ComposingBubble
                text={level.text}
                displayWord={displayWord}
                isWriting={localPhase === "typewriting"}
              />
            </motion.div>
          )}

          {localPhase === "sent" && sentText && (
            <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SentBubble text={sentText} />
            </motion.div>
          )}

          {(localPhase === "them-typing" || localPhase === "them-responded") &&
            sentText && (
              <motion.div key="sent-persists" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SentBubble text={sentText} />
              </motion.div>
            )}

          {localPhase === "them-typing" && (
            <motion.div
              key="them-typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
            >
              <TypingIndicator side="them" />
            </motion.div>
          )}

          {localPhase === "them-responded" && themResponse && (
            <motion.div
              key="them-responded"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-end gap-2 px-3 py-0.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 mb-0.5" />
                <div className="max-w-[72%] px-3.5 py-2.5 text-[15px] leading-snug font-light bg-[#1c1c1e] text-white/90 rounded-2xl rounded-bl-sm">
                  {themResponse}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-2" />
      </div>

      <div className="flex-shrink-0">
        <AnimatePresence>
          {localPhase === "composing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28 }}
            >
              <div className="border-t border-white/8 bg-[#1c1c1e] flex">
                {level.options.map((option, i) => (
                  <motion.button
                    key={option.text}
                    onClick={() => handleChoice(i)}
                    className={`flex-1 h-11 flex items-center justify-center text-white/75 text-[14px] font-light active:bg-white/8 transition-colors duration-100 ${
                      i < level.options.length - 1 ? "border-r border-white/10" : ""
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    whileTap={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>

              <div className="bg-[#141414] px-2.5 pt-2.5 select-none pointer-events-none" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
                <div className="flex gap-1.5 mb-2 justify-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex-1 h-9 bg-[#2a2a2a] rounded-lg max-w-[36px]" />
                  ))}
                </div>
                <div className="flex gap-1.5 mb-2 justify-center px-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex-1 h-9 bg-[#2a2a2a] rounded-lg max-w-[36px]" />
                  ))}
                </div>
                <div className="flex gap-1.5 mb-2 items-center">
                  <div className="w-11 h-9 bg-[#1f1f1f] rounded-lg" />
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex-1 h-9 bg-[#2a2a2a] rounded-lg" />
                  ))}
                  <div className="w-11 h-9 bg-[#1f1f1f] rounded-lg" />
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className="w-11 h-9 bg-[#1f1f1f] rounded-lg" />
                  <div className="flex-1 h-9 bg-[#2a2a2a] rounded-lg" />
                  <div className="w-16 h-9 bg-[#3b5bdb]/60 rounded-lg" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
