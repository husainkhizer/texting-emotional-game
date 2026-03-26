import { motion } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { generateReflection } from "../engine/reflection";
import { AxisChart } from "../components/AxisChart";
import { ConversationCard } from "../components/ConversationCard";

export function ReflectionScreen() {
  const { axes, conversation, resetGame } = useGameStore();
  const reflection = useMemo(() => generateReflection(axes), [axes]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = async () => {
    const text = `"${reflection.archetype}"\n\n${reflection.paragraph}\n\n— Last Message`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000000",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "last-message.png";
      a.click();
    } catch {
      try {
        const text = `"${reflection.archetype}"\n\n${reflection.paragraph}\n\n— Last Message`;
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard instead");
      } catch {
        showToast("Could not save image");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-black px-6 py-14 overflow-y-auto">
      {toast && (
        <motion.div
          className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white/70 text-xs tracking-wide rounded-full border border-white/10"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {toast}
        </motion.div>
      )}

      <ConversationCard
        ref={cardRef}
        conversation={conversation}
        archetype={reflection.archetype}
      />

      <motion.div
        className="flex-1 flex flex-col max-w-sm mx-auto w-full gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
        >
          <motion.h2
            className="text-white/30 text-[9px] tracking-[0.2em] uppercase font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your reflection
          </motion.h2>

          <motion.p
            className="text-white text-[21px] font-light leading-tight tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {reflection.archetype}
          </motion.p>

          <motion.p
            className="text-white/55 text-[14px] font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {reflection.paragraph}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <p className="text-white/20 text-[9px] tracking-[0.18em] uppercase mb-4">
            How you moved
          </p>
          <AxisChart axes={axes} />
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <button
            onClick={handleSaveImage}
            disabled={saving}
            className="w-full py-4 text-white/50 text-sm tracking-widest uppercase border border-white/10 hover:border-white/25 hover:text-white/70 transition-all duration-300 font-light disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save as image"}
          </button>
          <button
            onClick={handleShare}
            className="w-full py-4 text-white/35 text-sm tracking-widest uppercase border border-white/[0.06] hover:border-white/15 hover:text-white/55 transition-all duration-300 font-light"
          >
            Share
          </button>
          <button
            onClick={resetGame}
            className="w-full py-4 text-white/20 text-sm tracking-widest uppercase hover:text-white/40 transition-all duration-300 font-light"
          >
            Play again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
