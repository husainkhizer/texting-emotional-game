import { motion } from "framer-motion";
import { AXIS_META } from "../engine/reflection";
import type { AxisScores } from "../store/gameStore";

interface Props {
  axes: AxisScores;
}

const MAX = 10;

export function AxisChart({ axes }: Props) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {AXIS_META.map((axis, i) => {
        const raw = axes[axis.key];
        const clamped = Math.max(-MAX, Math.min(MAX, raw));
        const pct = (Math.abs(clamped) / MAX) * 50;
        const positive = clamped >= 0;

        return (
          <div key={axis.key} className="flex flex-col gap-1.5">
            <span className="text-white/25 text-[9px] tracking-[0.18em] uppercase">
              {axis.label}
            </span>

            <div className="relative h-[2px] bg-white/[0.06] rounded-full">
              <div
                className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10"
                style={{ transform: "translateX(-50%)" }}
              />
              <motion.div
                className="absolute top-0 bottom-0 rounded-full"
                style={{
                  background: positive
                    ? "rgba(99,120,255,0.7)"
                    : "rgba(255,255,255,0.25)",
                  ...(positive ? { left: "50%" } : { right: "50%" }),
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  delay: 0.4 + i * 0.08,
                  duration: 0.7,
                  ease: "easeOut",
                }}
              />
            </div>

            <div className="flex justify-between">
              <span
                className="text-[10px] font-light transition-opacity duration-300"
                style={{
                  color: !positive && pct > 5
                    ? "rgba(255,255,255,0.45)"
                    : "rgba(255,255,255,0.18)",
                }}
              >
                {axis.low}
              </span>
              <span
                className="text-[10px] font-light transition-opacity duration-300"
                style={{
                  color: positive && pct > 5
                    ? "rgba(255,255,255,0.45)"
                    : "rgba(255,255,255,0.18)",
                }}
              >
                {axis.high}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
