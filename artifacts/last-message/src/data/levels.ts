export type Axis = "honesty" | "vulnerability" | "closeness" | "timing" | "agency";

export interface AxisWeights {
  honesty?: number;
  vulnerability?: number;
  closeness?: number;
  timing?: number;
  agency?: number;
}

export interface Option {
  text: string;
  weights: AxisWeights;
}

export interface Level {
  id: number;
  text: string;
  options: Option[];
  sender: "them" | "you";
  delay?: number;
  response?: string | null;
}

export const levels: Level[] = [
  {
    id: 1,
    text: "Hey. I know this is a little ___ out of nowhere.",
    sender: "you",
    delay: 900,
    response: "i mean. hey.",
    options: [
      { text: "random", weights: { honesty: -1, vulnerability: -1 } },
      { text: "weird", weights: { honesty: 1, vulnerability: 1 } },
      { text: "much", weights: { vulnerability: 2, closeness: 1 } },
      { text: "late", weights: { timing: -2, honesty: 1 } },
    ],
  },
  {
    id: 2,
    text: "I've been ___ to reach out for a while now.",
    sender: "you",
    delay: 800,
    response: "how long is a while",
    options: [
      { text: "wanting", weights: { honesty: 1, timing: -1 } },
      { text: "meaning", weights: { timing: -2, agency: -1 } },
      { text: "hesitant", weights: { vulnerability: 1, agency: -1 } },
      { text: "afraid", weights: { vulnerability: 2, honesty: 2 } },
    ],
  },
  {
    id: 3,
    text: "I'm not even sure I know what I'm trying to ___.",
    sender: "you",
    delay: 1000,
    response: null,
    options: [
      { text: "say", weights: { honesty: 1 } },
      { text: "fix", weights: { agency: 2, honesty: 1 } },
      { text: "explain", weights: { honesty: -1, agency: 1 } },
      { text: "ask for", weights: { vulnerability: 1, closeness: 1 } },
    ],
  },
  {
    id: 4,
    text: "I just know I've been ___ about how things ended.",
    sender: "you",
    delay: 900,
    response: "you could've just said something",
    options: [
      { text: "thinking", weights: { honesty: 1, timing: -1 } },
      { text: "feeling bad", weights: { honesty: 1, vulnerability: 1 } },
      { text: "bothered", weights: { honesty: 1, agency: -1 } },
      { text: "hung up on it", weights: { honesty: 2, vulnerability: 2, closeness: 1 } },
    ],
  },
  {
    id: 5,
    text: "I know. I kept ___ myself there'd be a better moment.",
    sender: "you",
    delay: 1000,
    response: "was there ever one?",
    options: [
      { text: "telling", weights: { honesty: 1, timing: -1 } },
      { text: "convincing", weights: { honesty: 2, timing: -1, vulnerability: 1 } },
      { text: "promising", weights: { honesty: 1, agency: -1, timing: -2 } },
      { text: "reassuring", weights: { honesty: -1, agency: -1, timing: -1 } },
    ],
  },
  {
    id: 6,
    text: "There wasn't. And I think part of me ___ that.",
    sender: "you",
    delay: 1000,
    response: null,
    options: [
      { text: "knew", weights: { honesty: 2, agency: 1 } },
      { text: "felt", weights: { honesty: 1, vulnerability: 2 } },
      { text: "ignored", weights: { honesty: 2, agency: -1 } },
      { text: "didn't want to see", weights: { honesty: 1, vulnerability: 1, agency: -2 } },
    ],
  },
  {
    id: 7,
    text: "You deserved something more ___ than what I gave you.",
    sender: "you",
    delay: 900,
    response: "yeah, you're not wrong",
    options: [
      { text: "honest", weights: { honesty: 2, vulnerability: 1 } },
      { text: "consistent", weights: { closeness: 1, agency: 1 } },
      { text: "intentional", weights: { agency: 2, honesty: 1 } },
      { text: "real", weights: { honesty: 2, vulnerability: 2, closeness: 1 } },
    ],
  },
  {
    id: 8,
    text: "The truth is, I think I was ___ the whole time.",
    sender: "you",
    delay: 1100,
    response: null,
    options: [
      { text: "scared", weights: { vulnerability: 2, honesty: 2 } },
      { text: "confused", weights: { honesty: 1, vulnerability: 1 } },
      { text: "holding back", weights: { honesty: 1, closeness: -1 } },
      { text: "somewhere else", weights: { honesty: -1, closeness: -2 } },
    ],
  },
  {
    id: 9,
    text: "Not of you. Of what it would ___ if I let it.",
    sender: "you",
    delay: 1000,
    response: "i figured that out eventually",
    options: [
      { text: "mean", weights: { honesty: 2, vulnerability: 2 } },
      { text: "cost", weights: { honesty: 1, agency: 1 } },
      { text: "become", weights: { honesty: 1, vulnerability: 1 } },
      { text: "change", weights: { honesty: 1, vulnerability: 1, timing: -1 } },
    ],
  },
  {
    id: 10,
    text: "I think that's ___ things stayed the way they did.",
    sender: "you",
    delay: 900,
    response: null,
    options: [
      { text: "why", weights: { honesty: 2, agency: -1 } },
      { text: "how", weights: { honesty: 1, agency: -2 } },
      { text: "part of why", weights: { honesty: 1, vulnerability: 1, agency: -1 } },
      { text: "the reason", weights: { honesty: 2, agency: -1 } },
    ],
  },
  {
    id: 11,
    text: "That wasn't ___ on my part.",
    sender: "you",
    delay: 900,
    response: "no. it wasn't.",
    options: [
      { text: "fair", weights: { honesty: 2, vulnerability: 1, closeness: 1 } },
      { text: "honest", weights: { honesty: 2, vulnerability: 1 } },
      { text: "enough", weights: { honesty: 1, vulnerability: 2, closeness: 1 } },
      { text: "right", weights: { honesty: 2, agency: 1 } },
    ],
  },
  {
    id: 12,
    text: "I don't really know what I'm asking for by ___ this.",
    sender: "you",
    delay: 1000,
    response: null,
    options: [
      { text: "saying", weights: { honesty: 2, vulnerability: 1 } },
      { text: "sending", weights: { honesty: 1, vulnerability: 2 } },
      { text: "telling you", weights: { honesty: 1, closeness: 1 } },
      { text: "doing", weights: { honesty: -1, vulnerability: -1 } },
    ],
  },
  {
    id: 13,
    text: "Maybe nothing. Maybe I just needed you to ___.",
    sender: "you",
    delay: 1100,
    response: "i'm glad you did",
    options: [
      { text: "know", weights: { honesty: 2, vulnerability: 1, closeness: 1 } },
      { text: "hear it", weights: { vulnerability: 2, closeness: 1 } },
      { text: "understand", weights: { honesty: 1, closeness: 1 } },
      { text: "have this", weights: { closeness: 2, vulnerability: 1 } },
    ],
  },
  {
    id: 14,
    text: "There were things I ___ I'd never actually say.",
    sender: "you",
    delay: 900,
    response: "tell me one",
    options: [
      { text: "thought", weights: { honesty: 1, vulnerability: 1 } },
      { text: "assumed", weights: { honesty: 1, agency: -1 } },
      { text: "knew", weights: { honesty: 2, vulnerability: 1 } },
      { text: "was sure", weights: { honesty: 1, agency: -1, vulnerability: 1 } },
    ],
  },
  {
    id: 15,
    text: "That I ___ you.",
    sender: "you",
    delay: 1200,
    response: null,
    options: [
      { text: "missed", weights: { closeness: 2, vulnerability: 2, timing: -1 } },
      { text: "thought about", weights: { closeness: 1, vulnerability: 1 } },
      { text: "was glad I knew", weights: { closeness: 2, vulnerability: 2, honesty: 2 } },
      { text: "cared about", weights: { closeness: 1, honesty: 1 } },
    ],
  },
];
