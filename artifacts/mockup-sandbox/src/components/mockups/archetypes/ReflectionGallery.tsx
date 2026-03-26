/**
 * ReflectionGallery — all 15 Last Message archetype outcomes in one scrollable page.
 * Each card shows: archetype title, reflection paragraph, axis chart bars.
 * Axis scores are hardcoded to reliably trigger each archetype's conditions.
 * URL: /__mockup/preview/archetypes/ReflectionGallery
 */
import { useEffect, useState } from "react";

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
  { name: "The Open Letter",          axes: { honesty: 5,  vulnerability: 5,  closeness: 5,  timing: 0,  agency: 0  } },
  { name: "The One Who Said It",      axes: { honesty: 5,  vulnerability: 4,  closeness: 1,  timing: 0,  agency: 0  } },
  { name: "The Witness",              axes: { honesty: 5,  vulnerability: -3, closeness: 0,  timing: 0,  agency: 0  } },
  { name: "The Half-Truth",           axes: { honesty: -3, vulnerability: 4,  closeness: 0,  timing: 0,  agency: 0  } },
  { name: "The Quiet One",            axes: { honesty: -3, vulnerability: -3, closeness: 0,  timing: 0,  agency: 0  } },
  { name: "The One Who Showed Up",    axes: { honesty: 0,  vulnerability: 0,  closeness: 4,  timing: 0,  agency: 4  } },
  { name: "The Late Realizer",        axes: { honesty: 0,  vulnerability: 0,  closeness: 4,  timing: -4, agency: -4 } },
  { name: "The One Left Waiting",     axes: { honesty: 0,  vulnerability: 0,  closeness: 0,  timing: -4, agency: -4 } },
  { name: "The One Who Stayed",       axes: { honesty: 0,  vulnerability: 4,  closeness: 4,  timing: 0,  agency: 0  } },
  { name: "The One Who Walked Away",  axes: { honesty: 0,  vulnerability: -3, closeness: -4, timing: 0,  agency: 4  } },
  { name: "The One Who Left Quietly", axes: { honesty: 0,  vulnerability: -3, closeness: -4, timing: 0,  agency: 0  } },
  { name: "The One Who Tried",        axes: { honesty: 0,  vulnerability: 0,  closeness: 0,  timing: 3,  agency: 4  } },
  { name: "The Dreamer",              axes: { honesty: 0,  vulnerability: 4,  closeness: 0,  timing: 0,  agency: -4 } },
  { name: "The Pragmatist",           axes: { honesty: 0,  vulnerability: -3, closeness: 0,  timing: 0,  agency: 4  } },
  { name: "The In-Between",           axes: { honesty: 1,  vulnerability: 1,  closeness: 1,  timing: 0,  agency: 0  } },
];

function getArchetype(axes: AxisScores): string {
  const { honesty, vulnerability, closeness, timing, agency } = axes;
  const highHonesty = honesty >= 3;
  const lowHonesty  = honesty <= -2;
  const highVuln    = vulnerability >= 3;
  const lowVuln     = vulnerability <= -2;
  const highClose   = closeness >= 3;
  const lowClose    = closeness <= -3;
  const lateTiming  = timing <= -3;
  const earlyTiming = timing >= 2;
  const highAgency  = agency >= 3;
  const lowAgency   = agency <= -3;

  if (highHonesty && highVuln && highClose) return "The Open Letter";
  if (highHonesty && highVuln)              return "The One Who Said It";
  if (highHonesty && lowVuln)               return "The Witness";
  if (lowHonesty  && highVuln)              return "The Half-Truth";
  if (lowHonesty  && lowVuln)               return "The Quiet One";
  if (highAgency  && highClose)             return "The One Who Showed Up";
  if (lowAgency   && lateTiming && highClose) return "The Late Realizer";
  if (lowAgency   && lateTiming)            return "The One Left Waiting";
  if (highClose   && highVuln)              return "The One Who Stayed";
  if (lowClose    && lowVuln && highAgency) return "The One Who Walked Away";
  if (lowClose    && lowVuln)               return "The One Who Left Quietly";
  if (earlyTiming && highAgency)            return "The One Who Tried";
  if (lateTiming  && lowAgency)             return "The Late Realizer";
  if (highVuln    && lowAgency)             return "The Dreamer";
  if (highAgency  && lowVuln)               return "The Pragmatist";
  return "The In-Between";
}

function openingLine(axes: AxisScores): string {
  if (axes.honesty >= 3)       return "You didn't look away. Even when the truth was uncomfortable, you reached for it.";
  if (axes.honesty <= -2)      return "You chose your words carefully — maybe too carefully. Some things stayed unspoken.";
  if (axes.vulnerability >= 3) return "You let yourself feel it. That takes more courage than most people realize.";
  if (axes.closeness >= 3)     return "You kept moving toward, even when moving toward was the harder choice.";
  if (axes.closeness <= -3)    return "You kept distance. Maybe that was protection. Maybe it was habit.";
  return "You sat with it. The tension between what you felt and what you said.";
}

function insightLine(axes: AxisScores): string {
  const { timing, agency, vulnerability, honesty } = axes;
  if (timing <= -3 && agency <= -2)     return "You moved slowly — waiting, holding, hoping things would resolve themselves. They rarely do.";
  if (timing >= 2  && agency >= 2)      return "You knew when to act, and you acted. That clarity isn't as common as people think.";
  if (agency <= -3)                     return "You kept waiting for a sign, a word, a first move from the other side. That's not weakness — but it is a pattern.";
  if (agency >= 3)                      return "You made the calls. You didn't wait to be invited. Whatever happened, it happened on your terms.";
  if (vulnerability >= 3 && honesty >= 2) return "You were willing to be seen — fully, honestly. That kind of openness changes conversations.";
  if (vulnerability <= -2 && honesty <= -1) return "You kept the real thing just out of reach. Close enough to feel, far enough to deny.";
  return "You held both things at once — the wanting and the withholding, the courage and the caution.";
}

function tensionLine(axes: AxisScores): string {
  const { honesty, closeness, agency, timing, vulnerability } = axes;
  const contrasts: string[] = [];
  if (honesty > 1 && closeness < -1)      contrasts.push("honest but guarded");
  if (closeness > 2 && agency < -1)       contrasts.push("wanting connection but waiting for permission");
  if (honesty < -1 && vulnerability > 1)  contrasts.push("feeling deeply but speaking carefully");
  if (timing < -2 && agency > 1)          contrasts.push("capable but late");
  if (timing > 1 && closeness < -1)       contrasts.push("present but pulling away");
  if (contrasts.length === 0) return "The tension lives here: between what you knew and what you chose to do with it.";
  if (contrasts.length === 1) return `The tension lives here: ${contrasts[0]}. That gap is what this was.`;
  return `The tension lives here: ${contrasts[0]}, and ${contrasts[1]}. That gap is what this was.`;
}

function closingLine(axes: AxisScores): string {
  const { closeness, agency, honesty } = axes;
  if (honesty >= 3 && closeness >= 2) return "Whatever came next, you were fully present. That matters, even when it doesn't feel like it does.";
  if (closeness <= -3 || agency <= -3) return "Some things don't get resolved. They just become part of the story you carry.";
  if (agency >= 3)    return "You showed up. That's rarer than it sounds, and more important than you know.";
  if (honesty <= -2)  return "The unsaid things don't disappear. They just find other ways to make themselves known.";
  return "Next time — and there will be a next time — you'll know a little more about how you move through this.";
}

function generateReflection(axes: AxisScores) {
  return {
    archetype: getArchetype(axes),
    paragraph: [openingLine(axes), insightLine(axes), tensionLine(axes), closingLine(axes)].join(" "),
  };
}

const MAX = 10;

function AxisBar({ axis, axes }: { axis: typeof AXIS_META[number]; axes: AxisScores }) {
  const raw = axes[axis.key];
  const clamped = Math.max(-MAX, Math.min(MAX, raw));
  const pct = (Math.abs(clamped) / MAX) * 50;
  const positive = clamped >= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ color: "rgba(255,255,255,0.22)", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {axis.label}
      </span>
      <div style={{ position: "relative", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", background: "rgba(255,255,255,0.10)", transform: "translateX(-50%)" }} />
        <div style={{
          position: "absolute", top: 0, bottom: 0, borderRadius: "2px",
          background: positive ? "rgba(99,120,255,0.7)" : "rgba(255,255,255,0.28)",
          ...(positive ? { left: "50%" } : { right: "50%" }),
          width: `${pct}%`,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "8px", color: !positive && pct > 5 ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.14)" }}>{axis.low}</span>
        <span style={{ fontSize: "8px", color: positive && pct > 5 ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.14)" }}>{axis.high}</span>
      </div>
    </div>
  );
}

function ArchetypeCard({ name, axes, index }: { name: string; axes: AxisScores; index: number }) {
  const { archetype, paragraph } = generateReflection(axes);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", width: "320px", flexShrink: 0 }}>
      {/* Label above the card — archetype name + index */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "0 4px 10px",
      }}>
        <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "9px", letterSpacing: "0.12em" }}>
          {index}.
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", fontWeight: 400, letterSpacing: "-0.01em" }}>
          {name}
        </span>
        {archetype !== name && (
          <span style={{ color: "rgba(255,80,80,0.55)", fontSize: "8px" }}>⚠</span>
        )}
      </div>

      {/* Card body — full ReflectionScreen UI */}
      <div style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Your reflection
          </span>
          <p style={{ color: "#fff", fontSize: "17px", fontWeight: 300, lineHeight: 1.25, letterSpacing: "-0.01em", margin: 0 }}>
            {archetype}
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
            {paragraph}
          </p>
        </div>

        <div>
          <p style={{ color: "rgba(255,255,255,0.16)", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 12px" }}>
            How you moved
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {AXIS_META.map(axis => (
              <AxisBar key={axis.key} axis={axis} axes={axes} />
            ))}
          </div>
        </div>

        {/* Action buttons — matching the full ReflectionScreen UI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          <div style={{
            border: "1px solid rgba(255,255,255,0.09)",
            padding: "10px",
            textAlign: "center",
            color: "rgba(255,255,255,0.35)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            borderRadius: "4px",
          }}>
            Save as image
          </div>
          <div style={{
            padding: "10px",
            textAlign: "center",
            color: "rgba(255,255,255,0.2)",
            fontSize: "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            Play again
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReflectionGallery() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      padding: "40px 32px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 300, letterSpacing: "-0.01em", margin: "0 0 6px" }}>
          All 15 Reflection Outcomes
        </h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: 0 }}>
          Last Message — emotional axis map. Each card is seeded with representative axes that trigger its archetype.
        </p>
      </div>

      {[0, 1, 2].map(row => (
        <div key={row} style={{ marginBottom: "40px" }}>
          <p style={{ color: "rgba(255,255,255,0.14)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>
            Row {row + 1} — archetypes {row * 5 + 1}–{row * 5 + 5}
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {ARCHETYPES.slice(row * 5, row * 5 + 5).map((entry, i) => (
              <div
                key={entry.name}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.5s ease ${(row * 5 + i) * 60}ms, transform 0.5s ease ${(row * 5 + i) * 60}ms`,
                }}
              >
                <ArchetypeCard
                  name={entry.name}
                  axes={entry.axes}
                  index={row * 5 + i + 1}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
