import { useEffect, useReducer, useRef, useState } from "react";
import {
  DEFAULT_OSCILLATOR,
  MAX_GAIN,
  SMOOTH_IN_INTERVAL,
  SMOOTH_OUT_INTERVAL,
} from "../constants";
import { noteToIndex } from "../pitches";
import { FrequencyState, Note, SetOptions } from "../types";
import { getNoteFrequenciesInitialState, reducer } from "./MusicNotesReducer";

type UseKeyboardProps = SetOptions & {
  initialFrequencyStates?: FrequencyState[];
  audioContext?: AudioContext;
};

export const useMusicNotes = ({
  initialFrequencyStates,
  oscillator: defaultOscillator = DEFAULT_OSCILLATOR,
  gain: defaultMaxGain = MAX_GAIN,
  smoothInInterval: initialSmoothInInterval = SMOOTH_IN_INTERVAL,
  smoothOutInterval: initialSmoothOutInterval = SMOOTH_OUT_INTERVAL,
  audioContext,
}: UseKeyboardProps = {}) => {
  const [smoothInInterval, setSmoothInInterval] = useState(
    initialSmoothInInterval
  );
  const [smoothOutInterval, setSmoothOutInterval] = useState(
    initialSmoothOutInterval
  );
  const [gain, setGain] = useState(defaultMaxGain);
  const [oscillator, setOscillator] = useState(defaultOscillator);

  const [frequenciesState, setFrequenciesState] = useReducer(
    reducer,
    initialFrequencyStates ||
      getNoteFrequenciesInitialState({
        oscillator,
        gain,
      })
  );

  const audioContextRef = useRef<AudioContext>();
  const oscillatorNodesRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  useEffect(() => {
    const DefinedAudioContext =
      window.AudioContext ||
      ("webkitAudioContext" in window && window.webkitAudioContext);

    // Create an AudioContext and connect an oscillator and gain node to it
    const ctx = audioContext || new DefinedAudioContext();
    const oscNodes = frequenciesState.map(() => ctx.createOscillator());
    const gainNodes = frequenciesState.map(() => ctx.createGain());

    oscNodes.forEach((oscNode, i) => {
      const frequencyState = frequenciesState[i];
      if (frequencyState) {
        oscNode.frequency.value = frequencyState.hz;
        // set the osc type
        oscNode.type = frequencyState.oscillator || oscillator;
      }

      const currentGainNode = gainNodes[i];
      if (currentGainNode) {
        oscNode.connect(currentGainNode);
        currentGainNode.connect(ctx.destination);
      }
    });

    // Store references to the nodes and the context
    oscillatorNodesRef.current = oscNodes;
    gainNodesRef.current = gainNodes;
    audioContextRef.current = ctx;
    ctx.suspend();

    return () => {
      ctx.close();
    };
  }, []);

  const init = () => {
    audioContextRef.current?.resume();
    gainNodesRef.current.forEach((gainNode) =>
      gainNode.gain.setTargetAtTime(0, 0, 0)
    );
  };

  useEffect(() => {
    init();
  }, []);

  const stopAll = () => {
    frequenciesState.forEach((frequencyState, i) => {
      if (frequencyState.touched) {
        oscillatorNodesRef.current[i]?.stop();
      }
    });

    audioContextRef.current?.suspend();
    setFrequenciesState({ key: "ALL", type: "stop" });
  };

  // Start the oscillator if it's playing for the first time,
  // then set the gain to the max
  const start = (note: Note) => {
    const noteIndex = noteToIndex(note);
    const frequencyState = frequenciesState[noteIndex];

    if (frequencyState?.playing === false) {
      if (frequencyState.touched === false)
        oscillatorNodesRef.current[noteIndex]?.start();

      gainNodesRef.current[noteIndex]?.gain.setTargetAtTime(
        gain,
        0,
        smoothInInterval
      );

      setFrequenciesState({ key: note, type: "play" });
    }
  };

  // Mute the oscillator if it's playing
  const stop = (note: Note) => {
    const noteIndex = noteToIndex(note);
    const frequencyState = frequenciesState[noteIndex];

    if (frequencyState?.playing === true) {
      gainNodesRef.current[noteIndex]?.gain.setTargetAtTime(
        0,
        0,
        smoothOutInterval
      );

      setFrequenciesState({ key: note, type: "stop" });
    }
  };

  const set = ({
    oscillator,
    gain,
    smoothInInterval,
    smoothOutInterval,
  }: SetOptions) => {
    if (oscillator) {
      oscillatorNodesRef.current.forEach(
        (oscNode) => (oscNode.type = oscillator)
      );
      setOscillator(oscillator);
    }

    if (gain) {
      setGain(gain);
    }

    if (smoothInInterval) {
      setSmoothInInterval(smoothInInterval);
    }

    if (smoothOutInterval) {
      setSmoothOutInterval(smoothOutInterval);
    }

    setFrequenciesState({
      type: "set",
      values: { oscillator, gain, smoothInInterval, smoothOutInterval },
    });
  };

  return {
    start,
    stop,
    stopAll,
    set,
    state: frequenciesState,
  };
};

export type UseMusicNotes = ReturnType<typeof useMusicNotes>;
