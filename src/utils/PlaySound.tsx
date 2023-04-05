import { useState } from "react";
import { MAX_OCTAVE, notes } from "./constants";
import { FrequencyState, useKeyboard, useFrequency } from "./hooks";
import { noteToFrequency, noteToIndex } from "./pitches";
import { BaseNoteOctave } from "./types";

const oscillatorValues = ["sine", "sawtooth", "square", "triangle"] as const;
type OscillatorType = typeof oscillatorValues[number];
const isOscillatorType = (value: string): value is OscillatorType =>
	oscillatorValues.includes(value as OscillatorType);

export default function Keyboard() {
	const { start, stop } = useKeyboard();

	const octaves = 1;
	const keys = [...Array(MAX_OCTAVE).keys()].flatMap((octave) =>
		notes.map((note) => `${note}${octave}` satisfies BaseNoteOctave),
	);

	const displayKeys = keys.map((key) => {
		return (
			<button
				id={key}
				className="rounded-xl bg-black w-16 h-16 text-gray-300"
				onMouseDown={() => start(key)}
				onMouseUp={() => stop(key)}
			>
				{key}
			</button>
		);
	});

	return (
		<div className="flex rounded-xl bg-white p-4 gap-4 flex-wrap m-4 w-6/12 justify-center">
			{displayKeys}
		</div>
	);
}
