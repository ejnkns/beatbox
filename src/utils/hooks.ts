import React, { useEffect, useReducer, useRef, useState } from "react";
import { MAX_OCTAVE, notes } from "./constants";
import { noteToFrequency, noteToIndex } from "./pitches";
import { BaseNoteOctave } from "./types";

const SMOOTH_INTERVAL = 0.02;
const MAX_GAIN = 0.85;

export type FrequencyState = {
	oscillator?: "sine" | "square" | "sawtooth" | "triangle";
	gain?: number;
	hz: number;
	playing: boolean;
	touched: boolean;
};

const getKeyboardFrequenciesInitialState = (): FrequencyState[] => {
	const keys = [...Array(MAX_OCTAVE).keys()].flatMap((octave) =>
		notes.map((note) => `${note}${octave}` satisfies BaseNoteOctave),
	);

	return keys.map((key) => ({
		hz: noteToFrequency(key),
		gain: MAX_GAIN,
		oscillator: "sine",
		playing: false,
		touched: false,
	}));
};

type ReducerAction = {
	type: "play" | "stop";
	key: BaseNoteOctave | "ALL";
};
const reducer = (state: FrequencyState[], action: ReducerAction) => {
	const { type, key } = action;
	if (key === "ALL") {
		return state.map((frequencyState) => ({
			...frequencyState,
			playing: false,
		}));
	}
	const index = noteToIndex(key);
	const newState = [...state];
	const update = {
		...newState[index],
		hz: noteToFrequency(key),
		playing: type === "play",
		touched: true,
	};
	newState[index] = update;
	return newState;
};

export const useKeyboard = (initialFrequencyStates?: FrequencyState[]) => {
	// console.log(getKeyboardFrequenciesInitialState());
	const [frequenciesState, setFrequenciesState] = useReducer(
		reducer,
		initialFrequencyStates || getKeyboardFrequenciesInitialState(),
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
		const gainNodes = frequenciesState.map(() => {
			const gainNode = ctx.createGain();
			// gainNode.gain.setValueAtTime(0, ctx.currentTime);
			// console.log(gainNode.gain.value);
			return gainNode;
		});

		oscNodes.forEach((oscNode, i) => {
			const frequencyState = frequenciesState[i];
			if (frequencyState) oscNode.frequency.value = frequencyState.hz;
			const currentGainNode = gainNodes[i];
			if (currentGainNode) {
				oscNode.connect(currentGainNode);
				currentGainNode.connect(ctx.destination);
				// currentGainNode.gain.setValueAtTime(0, ctx.currentTime);
				// console.log(currentGainNode.gain.value);
			}
		});

		// Start the oscillators
		// oscNodes.forEach((oscNode) => oscNode.start());

		// Store references to the nodes and the context
		oscillatorNodesRef.current = oscNodes;
		gainNodesRef.current = gainNodes;
		audioContextRef.current = ctx;
		ctx.suspend();

		// Clean up function to run when the component using this hook unmounts
		return () => {
			ctx.close();
		};
	}, []);

	// Update the oscillator's frequency when the "hz" property changes
	// useEffect(() => {
	// 	oscillatorNodesRef.current.forEach((oscNode, i) => {
	// 		const frequency = frequenciesState[i];
	// 		oscNode.frequency.value = frequency?.hz || 440;
	// 	});
	// }, [frequenciesState]);

	const init = () => {
		audioContextRef.current?.resume();
	};

	useEffect(() => {
		init();
	}, []);

	const stopAll = () => {
		oscillatorNodesRef.current.forEach((oscNode) => oscNode.stop());
		audioContextRef.current?.suspend();
		setFrequenciesState({ key: "ALL", type: "stop" });
	};

	// Start the oscillator if it's playing for the first time,
	// then set the gain to the max value
	const start = (note: BaseNoteOctave) => {
		const noteIndex = noteToIndex(note);
		const frequencyState = frequenciesState[noteIndex];

		console.log({ note, noteIndex, frequencyState });

		if (note && frequencyState?.playing === false) {
			if (frequencyState.touched === false)
				oscillatorNodesRef.current[noteIndex]?.start();

			gainNodesRef.current[noteIndex]?.gain.setTargetAtTime(
				MAX_GAIN,
				audioContextRef.current?.currentTime || 0,
				SMOOTH_INTERVAL,
			);

			console.log(gainNodesRef.current[noteIndex]);

			setFrequenciesState({ key: note, type: "play" });
		}
	};

	// Mute the oscillator if it's playing
	const stop = (note: BaseNoteOctave) => {
		const noteIndex = noteToIndex(note);
		const frequencyState = frequenciesState[noteIndex];

		if (note && frequencyState?.playing === true) {
			gainNodesRef.current[noteIndex]?.gain.setTargetAtTime(
				0,
				audioContextRef.current?.currentTime || 0,
				SMOOTH_INTERVAL,
			);

			setFrequenciesState({ key: note, type: "stop" });
		}
	};

	console.log(frequenciesState[57]);
	console.log(gainNodesRef.current[57]?.gain.value);

	// Return the toggle, start, stop, and playing functions and values
	return { start, stop, stopAll, state: frequenciesState, init };
};

export const useFrequency = ({
	oscillator = "sine",
	gain = 1,
	hz,
}: FrequencyState) => {
	const [playing, setPlaying] = useState(false);
	const audioContext = useRef<AudioContext>();
	const oscillatorNode = useRef<OscillatorNode>();
	const gainNode = useRef<GainNode>();

	useEffect(() => {
		const AudioContext =
			window.AudioContext ||
			("webkitAudioContext" in window && window.webkitAudioContext);

		// Create an AudioContext and connect an oscillator and gain node to it
		const ctx = new AudioContext();
		const oscNode = ctx.createOscillator();
		const gainNode = ctx.createGain();

		oscNode.connect(gainNode);
		gainNode.connect(ctx.destination);

		// Start the oscillator
		oscNode.start();

		// Store references to the nodes and the context
		oscillatorNode.current = oscNode;
		if ("current" in gainNode) gainNode.current = gainNode;
		audioContext.current = ctx;
		ctx.suspend();

		// Clean up function to run when the component using this hook unmounts
		return () => {
			ctx.close();
		};
	}, []);

	// Update the oscillator's type when the "oscillator" property changes
	useEffect(() => {
		if (oscillatorNode.current) {
			oscillatorNode.current.type = oscillator;
		}
	}, [oscillator]);

	// Update the oscillator's frequency when the "hz" property changes
	useEffect(() => {
		if (oscillatorNode.current) {
			oscillatorNode.current.frequency.value = hz;
		}
	}, [hz]);

	// Update the gain node's gain value when the "gain" property changes
	useEffect(() => {
		if (gainNode.current) {
			gainNode.current.gain.value = gain;
		}
	}, [gain]);

	// Toggle the playing state of the oscillator
	const toggle = () => {
		if (playing) {
			audioContext.current?.suspend();
		} else {
			audioContext.current?.resume();
		}
		setPlaying((playing) => !playing);
	};

	// Start the oscillator if it's not already playing
	const start = () => {
		if (!playing) {
			audioContext.current?.resume();
		}
		setPlaying(true);
	};

	// Stop the oscillator if it's playing
	const stop = () => {
		if (playing) {
			audioContext.current?.suspend();
		}
		setPlaying(false);
	};

	// Return the toggle, start, stop, and playing functions and values
	return { toggle, start, stop, playing };
};
