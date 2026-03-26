import { useEffect, useRef, useState } from "react";

interface AxisScores {
  honesty: number;
  vulnerability: number;
  closeness: number;
  timing: number;
  agency: number;
}

const AXIS_META = [
  { key: "honesty" as keyof AxisScores, label: "Honesty", low: "Guarded", high: "Direct" },
  { key: "vulnerability" as keyof AxisScores, label: "Vulnerability", low: "Protected", high: "Open" },
  { key: "closeness" as keyof AxisScores, label: "Closeness", low: "Apart", high: "Together" },
  { key: "timing" as keyof AxisScores, label: "Timing", low: "Late", high: "Present" },
  { key: "agency" as keyof AxisScores, label: "Agency", low: "Passive", high: "Active" },
];

const ARCHETYPES: { name: string; axes: AxisScores }[] = [
  { name: "The Open Letter",         axes: { honesty: 5, vulnerability: 5, closeness: 5, timing: 0, agency: 0 } },
  { name: "The One Who Said It",     axes: { honesty: 5, vulnerability: 4, closeness: 1, timing: 0, agency: 0 } },
  { name: "The Witness",             axes: { honesty: 5, vulnerability: -3, closeness: 0, timing: 0, agency: 0 } },
  { name: "The Half-Truth",          axes: { honesty: -3, vulnerability: 4, closeness: 0, timing: 0, agency: 0 } },
  { name: "The Quiet One",           axes: { honesty: -3, vulnerability: -3, closeness: 0, timing: 0, agency: 0 } },
  { name: "The One Who Showed Up",   axes: { honesty: 0, vulnerability: 0, closeness: 4, timing: 0, agency: 4 } },
  { name: "The Late Realizer",       axes: { honesty: 0, vulnerability: 0, closeness: 4, timing: -4, agency: -4 } },
  { name: "The One Left Waiting",    axes: { honesty: 0, vulnerability: 0, closeness: 0, timing: -4, agency: -4 } },
  { name: "The One Who Stayed",      axes: { honesty: 0, vulnerability: 4, closeness: 4, timing: 0, agency: 0 } },
  { name: "The One Who Walked Away", axes: { honesty: 0, vulnerability: -3, closeness: -4, timing: 0, agency: 4 } },
  { name: "The One Who Left Quietly",axes: { honesty: 0, vulnerability: -3, closeness: -4, timing: 0, agency: 0 } },
  { name: "The One Who Tried",       axes: { honesty: 0, vulnerability: 0, closeness: 0, timing: 3, agency: 4 } },
  { name: "The Dreamer",             axes: { honesty: 0, vulnerability: 4, closeness: 0, timing: 0, agency: -4 } },
  { name: "The Pragmatist",          axes: { honesty: 0, vulnerability: -3, closeness: 0, timing: 0, agency: 4 } },
  { name: "The In-Between",          axes: { honesty: 1, vulnerability: 1, closeness: 1, timing: 0, agency: 0 } },
];

function getArchetype(axes: AxisScores): string {
  const { honesty, vulnerability, closeness, timing, agency } = axes;
  const highHonesty = honesty >= 3;
  const lowHonesty = honesty <= -2;
  const highVuln = vulnerability >= 3;
  const lowVuln = vulnerability <= -2;
  const highClose = closeness >= 3;
  const lowClose = closeness <= -3;
  const lateTiming = timing <= -3;
  const earlyTiming = timing >= 2;
  const highAgency = agency >= 3;
  const lowAgency = agency <= -3;

  if (highHonesty && highVuln && highClose) return "The Open Letter";
  if (highHonesty && highVuln) return "The One Who Said It";
  if (highHonesty && lowVuln) return "The Witness";
  if (lowHonesty && highVuln) return "The Half-Truth";
  if (lowHonesty && lowVuln) return "The Quiet One";
  if (highAgency && highClose) return "The One Who Showed Up";
  if (lowAgency && lateTiming && highClose) return "The Late Realizer";
  if (lowAgency && lateTiming) return "The One Left Waiting";
  if (highClose && highVuln) return "The One Who Stayed";
  if (lowClose && lowVuln && highAgency) return "The One Who Walked Away";
  if (lowClose && lowVuln) return "The One Who Left Quietly";
  if (earlyTiming && highAgency) return "The One Who Tried";
  if (lateTiming && lowAgency) return "The Late Realizer";
  if (highVuln && lowAgency) return "The Dreamer";
  if (highAgency && lowVuln) return "The Pragmatist";
  return "The In-Between";
}

function openingLine(axes: AxisScores): string {
  const { honesty, vulnerability, closeness } = axes;
  if (honesty >= 3) return "You didn't look away. Even when the truth was uncomfortable, you reached for it.";
  if (honesty <= -2) return "You chose your words carefully — maybe too carefully. Some things stayed unspoken.";
  if (vulnerability >= 3) return "You let yourself feel it. That takes more courage than most people realize.";
  if (closeness >= 3) return "You kept moving toward, even when moving toward was the harder choice.";
  if (closeness <= -3) return "You kept distance. Maybe that was protection. Maybe it was habit.";
  return "You sat with it. The tension between what you felt and what you said.";
}

function insightLine(axes: AxisScores): string {
  const { timing, agency, vulnerability, honesty } = axes;
  if (timing <= -3 && agency <= -2) return "You moved slowly — waiting, holding, hoping things would resolve themselves. They rarely do.";
  if (timing >= 2 && agency >= 2) return "You knew when to act, and you acted. That clarity isn't as common as people think.";
  if (agency <= -3) return "You kept waiting for a sign, a word, a first move from the other side. That's not weakness — but it is a pattern.";
  if (agency >= 3) return "You made the calls. You didn't wait to be invited. Whatever happened, it happened on your terms.";
  if (vulnerability >= 3 && honesty >= 2) return "You were willing to be seen — fully, honestly. That kind of openness changes conversations.";
  if (vulnerability <= -2 && honesty <= -1) return "You kept the real thing just out of reach. Close enough to feel, far enough to deny.";
  return "You held both things at once — the wanting and the withholding, the courage and the caution.";
}

function tensionLine(axes: AxisScores): string {
  const { honesty, closeness, agency, timing, vulnerability } = axes;
  const contrasts: string[] = [];
  if (honesty > 1 && closeness < -1) contrasts.push("honest but guarded");
  if (closeness > 2 && agency < -1) contrasts.push("wanting connection but waiting for permission");
  if (honesty < -1 && vulnerability > 1) contrasts.push("feeling deeply but speaking carefully");
  if (timing < -2 && agency > 1) contrasts.push("capable but late");
  if (timing > 1 && closeness < -1) contrasts.push("present but pulling away");
  if (contrasts.length === 0) return "The tension lives here: between what you knew and what you chose to do with it.";
  if (contrasts.length === 1) return `The tension lives here: ${contrasts[0]}. That gap is what this was.`;
  return `The tension lives here: ${contrasts[0]}, and ${contrasts[1]}. That gap is what this was.`;
}

function closingLine(axes: AxisScores): string {
  const { closeness, agency, honesty } = axes;
  if (honesty >= 3 && closeness >= 2) return "Whatever came next, you were fully present. That matters, even when it doesn't feel like it does.";
  if (closeness <= -3 || agency <= -3) return "Some things don't get resolved. They just become part of the story you carry.";
  if (agency >= 3) return "You showed up. That's rarer than it sounds, and more important than you know.";
  if (honesty <= -2) return "The unsaid things don't disappear. They just find other ways to make themselves known.";
  return "Next time — and there will be a next time — you'll know a little more about how you move through this.";
}

function generateReflection(axes: AxisScores) {
  return {
    archetype: getArchetype(axes),
    paragraph: [openingLine(axes), insightLine(axes), tensionLine(axes), closingLine(axes)].join(" "),
  };
}

const MAX = 10;

function AxisBar({ axis, axes, delay }: { axis: typeof AXIS_META[number]; axes: AxisScores; delay: number }) {
  const raw = axes[axis.key];
  const clamped = Math.max(-MAX, Math.min(MAX, raw));
  const pct = (Math.abs(clamped) / MAX) * 50;
  const positive = clamped >= 0;

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ color: "rgba(255,255,255,0.22)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {axis.label}
      </span>
      <div style={{ position: "relative", height: "2px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", background: "rgba(255,255,255,0.10)", transform: "translateX(-50%)" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            borderRadius: "2px",
            background: positive ? "rgba(99,120,255,0.7)" : "rgba(255,255,255,0.25)",
            ...(positive ? { left: "50%" } : { right: "50%" }),
            width: `${width}%`,
            transition: "width 0.7s ease-out",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "9px", color: !positive && pct > 5 ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.16)" }}>
          {axis.low}
        </span>
        <span style={{ fontSize: "9px", color: positive && pct > 5 ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.16)" }}>
          {axis.high}
        </span>
      </div>
    </div>
  );
}

function ReflectionCard({ axes, index }: { axes: AxisScores; index: number }) {
  const { archetype, paragraph } = generateReflection(axes);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        padding: "40px 24px 32px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Your reflection
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "9px", letterSpacing: "0.1em" }}>
            #{index}
          </span>
        </div>

        <p style={{ color: "#fff", fontSize: "20px", fontWeight: 300, lineHeight: 1.25, letterSpacing: "-0.01em", margin: 0 }}>
          {archetype}
        </p>

        <p style={{ color: "rgba(255,255,255,0.52)", fontSize: "13px", fontWeight: 300, lineHeight: 1.65, margin: 0 }}>
          {paragraph}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 14px" }}>
          How you moved
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {AXIS_META.map((axis, i) => (
            <AxisBar key={axis.key} axis={axis} axes={axes} delay={300 + i * 80} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
        <div style={{
          border: "1px solid rgba(255,255,255,0.09)",
          padding: "14px",
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          Save as image
        </div>
        <div style={{
          padding: "14px",
          textAlign: "center",
          color: "rgba(255,255,255,0.22)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          Play again
        </div>
      </div>
    </div>
  );
}

export function ArchetypePreview() {
  const params = new URLSearchParams(window.location.search);
  const n = Math.max(1, Math.min(15, parseInt(params.get("n") || "1", 10)));
  const entry = ARCHETYPES[n - 1];

  return <ReflectionCard axes={entry.axes} index={n} />;
}
