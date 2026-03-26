import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "./store/gameStore";
import { LandingScreen } from "./pages/LandingScreen";
import { OnboardingScreen } from "./pages/OnboardingScreen";
import { GameScreen } from "./pages/GameScreen";
import { EndingScreen } from "./pages/EndingScreen";
import { ReflectionScreen } from "./pages/ReflectionScreen";

function App() {
  const phase = useGameStore((s) => s.phase);

  return (
    <div className="min-h-screen w-full bg-black">
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingScreen />
          </motion.div>
        )}
        {phase === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <OnboardingScreen />
          </motion.div>
        )}
        {phase === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GameScreen />
          </motion.div>
        )}
        {phase === "ending" && (
          <motion.div
            key="ending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EndingScreen />
          </motion.div>
        )}
        {phase === "reflection" && (
          <motion.div
            key="reflection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ReflectionScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
