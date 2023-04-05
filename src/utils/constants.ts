export const A4 = 440.0;
export const A4_INDEX = 57; // A4 is the 57th note in an array of notes from C0 to A9
export const notes = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
] as const;
export const OCTAVE_LENGTH = notes.length; // or more accurately, the number of notes in an octave
export const DEFAULT_OCTAVE = 4;
export const MAX_OCTAVE = 10;

export const MAJ_TRIADS = [
	[0, 3, 8],
	[0, 4, 7],
	[0, 5, 9],
];

export const MIN_TRIADS = [
	[0, 3, 7],
	[0, 4, 9],
	[0, 5, 8],
];

export const DIM_TRIADS = [
	[0, 3, 6],
	[0, 4, 8],
	[0, 5, 7],
];

export const AUG_TRIADS = [
	[0, 3, 8],
	[0, 4, 9],
	[0, 5, 10],
];

export const TRIADS = {
	major: MAJ_TRIADS,
	minor: MIN_TRIADS,
	diminished: DIM_TRIADS,
	augmented: AUG_TRIADS,
};
