import { useEffect, useReducer, useRef } from "react";
import {
  DEFAULT_OSCILLATOR,
  MAX_GAIN,
  SMOOTH_IN_INTERVAL,
  SMOOTH_OUT_INTERVAL,
} from "../constants";
import { reducer, getNoteFrequenciesInitialState } from "../helpers";
import { noteToIndex } from "../pitches";
import { FrequencyState, Note, Oscillator } from "../types";

type UseKeyboardProps = {
  initialFrequencyStates?: FrequencyState[];
  oscillator?: Oscillator;
  maxGain?: number;
  smoothInInterval?: number;
  smoothOutInterval?: number;
};

export const useMusicNotes = (
  {
    initialFrequencyStates,
    oscillator: defaultOscillator = DEFAULT_OSCILLATOR,
    maxGain: defaultMaxGain = MAX_GAIN,
    smoothInInterval = SMOOTH_IN_INTERVAL,
    smoothOutInterval = SMOOTH_OUT_INTERVAL,
  }: UseKeyboardProps,
  depsArray: Array<unknown>
) => {
  const [frequenciesState, setFrequenciesState] = useReducer(
    reducer,
    initialFrequencyStates ||
      getNoteFrequenciesInitialState({
        oscillator: defaultOscillator,
        gain: defaultMaxGain,
      })
  );

  const audioContextRef = useRef<AudioContext>();
  const oscillatorNodesRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  useEffect(() => {
    const AudioContext =
      window.AudioContext ||
      ("webkitAudioContext" in window && window.webkitAudioContext);

    // Create an AudioContext and connect an oscillator and gain node to it
    const ctx = new AudioContext();
    const oscNodes = frequenciesState.map(() => ctx.createOscillator());
    const gainNodes = frequenciesState.map(() => ctx.createGain());

    oscNodes.forEach((oscNode, i) => {
      const frequencyState = frequenciesState[i];
      if (frequencyState) {
        oscNode.frequency.value = frequencyState.hz;
        // set the osc type
        oscNode.type = frequencyState.oscillator || defaultOscillator;
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
        defaultMaxGain,
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

  const set = (note: Note, oscillator: Oscillator) => {
    const noteIndex = noteToIndex(note);
    const oscNode = oscillatorNodesRef.current[noteIndex];

    if (oscNode) {
      oscNode.type = oscillator;
      setFrequenciesState({ type: "set", key: note, value: oscillator });
    }
  };

  const setAll = (oscillator: Oscillator) => {
    oscillatorNodesRef.current.forEach((oscNode) => {
      if (oscNode) {
        oscNode.type = oscillator;
        setFrequenciesState({ type: "set", value: oscillator });
      }
    });
  };

  return { start, stop, stopAll, set, setAll, state: frequenciesState };
};
