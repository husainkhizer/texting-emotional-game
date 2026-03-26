import type { AxisScores } from "../store/gameStore";

export interface Reflection {
  archetype: string;
  paragraph: string;
}

export interface AxisMeta {
  key: keyof AxisScores;
  label: string;
  low: string;
  high: string;
}

export const AXIS_META: AxisMeta[] = [
  { key: "honesty", label: "Honesty", low: "Guarded", high: "Direct" },
  { key: "vulnerability", label: "Vulnerability", low: "Protected", high: "Open" },
  { key: "closeness", label: "Closeness", low: "Apart", high: "Together" },
  { key: "timing", label: "Timing", low: "Late", high: "Present" },
  { key: "agency", label: "Agency", low: "Passive", high: "Active" },
];

function dominant(axes: AxisScores): keyof AxisScores {
  let max: keyof AxisScores = "honesty";
  let maxVal = Math.abs(axes.honesty);
  for (const key of Object.keys(axes) as (keyof AxisScores)[]) {
    if (Math.abs(axes[key]) > maxVal) {
      maxVal = Math.abs(axes[key]);
      max = key;
    }
  }
  return max;
}

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
  if (honesty >= 3) {
    return "You didn't look away. Even when the truth was uncomfortable, you reached for it.";
  } else if (honesty <= -2) {
    return "You chose your words carefully — maybe too carefully. Some things stayed unspoken.";
  } else if (vulnerability >= 3) {
    return "You let yourself feel it. That takes more courage than most people realize.";
  } else if (closeness >= 3) {
    return "You kept moving toward, even when moving toward was the harder choice.";
  } else if (closeness <= -3) {
    return "You kept distance. Maybe that was protection. Maybe it was habit.";
  }
  return "You sat with it. The tension between what you felt and what you said.";
}

function insightLine(axes: AxisScores): string {
  const { timing, agency, vulnerability, honesty } = axes;
  if (timing <= -3 && agency <= -2) {
    return "You moved slowly — waiting, holding, hoping things would resolve themselves. They rarely do.";
  } else if (timing >= 2 && agency >= 2) {
    return "You knew when to act, and you acted. That clarity isn't as common as people think.";
  } else if (agency <= -3) {
    return "You kept waiting for a sign, a word, a first move from the other side. That's not weakness — but it is a pattern.";
  } else if (agency >= 3) {
    return "You made the calls. You didn't wait to be invited. Whatever happened, it happened on your terms.";
  } else if (vulnerability >= 3 && honesty >= 2) {
    return "You were willing to be seen — fully, honestly. That kind of openness changes conversations.";
  } else if (vulnerability <= -2 && honesty <= -1) {
    return "You kept the real thing just out of reach. Close enough to feel, far enough to deny.";
  }
  return "You held both things at once — the wanting and the withholding, the courage and the caution.";
}

function tensionLine(axes: AxisScores): string {
  const { honesty, closeness, agency, timing, vulnerability } = axes;
  const contrasts: string[] = [];

  if (honesty > 1 && closeness < -1) {
    contrasts.push("honest but guarded");
  }
  if (closeness > 2 && agency < -1) {
    contrasts.push("wanting connection but waiting for permission");
  }
  if (honesty < -1 && vulnerability > 1) {
    contrasts.push("feeling deeply but speaking carefully");
  }
  if (timing < -2 && agency > 1) {
    contrasts.push("capable but late");
  }
  if (timing > 1 && closeness < -1) {
    contrasts.push("present but pulling away");
  }

  if (contrasts.length === 0) {
    return "The tension lives here: between what you knew and what you chose to do with it.";
  }
  if (contrasts.length === 1) {
    return `The tension lives here: ${contrasts[0]}. That gap is what this was.`;
  }
  return `The tension lives here: ${contrasts[0]}, and ${contrasts[1]}. That gap is what this was.`;
}

function closingLine(axes: AxisScores): string {
  const { closeness, agency, honesty } = axes;
  if (honesty >= 3 && closeness >= 2) {
    return "Whatever came next, you were fully present. That matters, even when it doesn't feel like it does.";
  } else if (closeness <= -3 || agency <= -3) {
    return "Some things don't get resolved. They just become part of the story you carry.";
  } else if (agency >= 3) {
    return "You showed up. That's rarer than it sounds, and more important than you know.";
  } else if (honesty <= -2) {
    return "The unsaid things don't disappear. They just find other ways to make themselves known.";
  }
  return "Next time — and there will be a next time — you'll know a little more about how you move through this.";
}

export function generateReflection(axes: AxisScores): Reflection {
  const archetype = getArchetype(axes);
  const parts = [
    openingLine(axes),
    insightLine(axes),
    tensionLine(axes),
    closingLine(axes),
  ];
  const paragraph = parts.join(" ");
  return { archetype, paragraph };
}
