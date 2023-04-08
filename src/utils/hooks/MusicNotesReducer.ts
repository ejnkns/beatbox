import { noteToFrequency, noteToIndex } from "~/utils/pitches";
import { FrequencyState, Note, Oscillator, SetOptions } from "~/utils/types";
import { DEFAULT_OSCILLATOR, MAX_GAIN, MAX_OCTAVE, NOTES } from "../constants";

type ReducerAction =
  | {
      type: "play" | "stop";
      key: Note;
    }
  | {
      type: "stop";
      key: Note | "ALL";
    }
  | {
      type: "set";
      key?: Note;
      values: SetOptions;
    };
export const reducer = (state: FrequencyState[], action: ReducerAction) => {
  const { type, key } = action;

  if (type === "set") {
    const { values } = action;
    if (!key) {
      return state.map((frequencyState) => ({
        ...frequencyState,
        ...values,
      }));
    }

    const index = noteToIndex(key);
    const newState = [...state];
    const currentFrequencyState = newState[index];

    if (currentFrequencyState) {
      const update = {
        ...currentFrequencyState,
        ...values,
      };

      newState[index] = update;
    }
    return newState;
  }

  if (key === "ALL") {
    return state.map((frequencyState) => ({
      ...frequencyState,
      playing: false,
    }));
  }

  const index = noteToIndex(key);
  const newState = [...state];
  const currentFrequencyState = newState[index];

  if (currentFrequencyState) {
    const update = {
      ...currentFrequencyState,
      playing: type === "play",
      touched: true,
    };

    newState[index] = update;
  }
  return newState;
};

export const getNoteFrequenciesInitialState = ({
  oscillator = DEFAULT_OSCILLATOR,
  gain = MAX_GAIN,
}: {
  oscillator?: Oscillator;
  gain?: number;
}): FrequencyState[] => {
  const keys = [...Array(MAX_OCTAVE).keys()].flatMap((octave) =>
    NOTES.map((note) => `${note}${octave}` satisfies Note)
  );

  return keys.map((key) => ({
    hz: noteToFrequency(key),
    gain,
    oscillator,
    playing: false,
    touched: false,
  }));
};
