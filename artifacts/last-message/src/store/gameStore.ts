import { create } from "zustand";
import { levels, type AxisWeights } from "../data/levels";

export type GamePhase = "landing" | "onboarding" | "playing" | "ending" | "reflection";

export interface AxisScores {
  honesty: number;
  vulnerability: number;
  closeness: number;
  timing: number;
  agency: number;
}

export interface ChoiceRecord {
  levelId: number;
  chosenWord: string;
  weights: AxisWeights;
}

export interface ConversationEntry {
  role: "you" | "them";
  text: string;
}

interface GameState {
  phase: GamePhase;
  currentLevel: number;
  axes: AxisScores;
  choices: ChoiceRecord[];
  conversation: ConversationEntry[];
  setPhase: (phase: GamePhase) => void;
  startGame: () => void;
  makeChoice: (optionIndex: number) => void;
  addToConversation: (entry: ConversationEntry) => void;
  resetGame: () => void;
}

const initialAxes: AxisScores = {
  honesty: 0,
  vulnerability: 0,
  closeness: 0,
  timing: 0,
  agency: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  phase: "landing",
  currentLevel: 0,
  axes: { ...initialAxes },
  choices: [],
  conversation: [],

  setPhase: (phase) => set({ phase }),

  addToConversation: (entry) =>
    set((s) => ({ conversation: [...s.conversation, entry] })),

  startGame: () =>
    set({
      phase: "onboarding",
      currentLevel: 0,
      axes: { ...initialAxes },
      choices: [],
      conversation: [],
    }),

  makeChoice: (optionIndex: number) => {
    const state = get();
    const level = levels[state.currentLevel];
    if (!level) return;

    const option = level.options[optionIndex];
    if (!option) return;

    const newAxes = { ...state.axes };
    for (const [key, value] of Object.entries(option.weights)) {
      const axis = key as keyof AxisScores;
      newAxes[axis] = (newAxes[axis] || 0) + (value || 0);
    }

    const newChoice: ChoiceRecord = {
      levelId: level.id,
      chosenWord: option.text,
      weights: option.weights,
    };

    const nextLevel = state.currentLevel + 1;
    const isLast = nextLevel >= levels.length;

    set({
      axes: newAxes,
      choices: [...state.choices, newChoice],
      currentLevel: nextLevel,
      phase: isLast ? "ending" : "playing",
    });
  },

  resetGame: () =>
    set({
      phase: "landing",
      currentLevel: 0,
      axes: { ...initialAxes },
      choices: [],
      conversation: [],
    }),
}));
