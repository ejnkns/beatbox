import { UseMusicNotes } from "~/utils/hooks/useMusicNotes";
import { isOscillatorType } from "~/utils/types";

export const useControls = (set: UseMusicNotes["set"]) => {
  const handleSetOscillator = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if ("value" in e.target && isOscillatorType(e.target.value)) {
      set({ oscillator: e.target.value });
    }
  };

  const handleSetSmoothInInterval = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if ("value" in e.target) {
      set({ smoothInInterval: parseFloat(e.target.value) });
    }
  };

  const handleSetSmoothOutInterval = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if ("value" in e.target) {
      set({ smoothOutInterval: parseFloat(e.target.value) });
    }
  };

  const handleSetGain = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ("value" in e.target) {
      set({ gain: parseFloat(e.target.value) });
    }
  };

  return {
    handleSetGain,
    handleSetOscillator,
    handleSetSmoothInInterval,
    handleSetSmoothOutInterval,
  };
};
