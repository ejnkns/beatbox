import { notes, TRIADS } from "./constants";

export type BaseNote = typeof notes[number];
export type BaseNoteOctave = `${BaseNote}${number}`;

export type NoteData = {
	name: BaseNote;
	octave: number;
	cents: number;
};

export type TriadTypes = keyof typeof TRIADS;

export type TriadInput = {
	note1: NoteData;
	note2: NoteData;
	note3: NoteData;
};

export type TriadWithTypeInput = TriadInput & {
	type: TriadTypes;
};

export const isNoteData = (input: unknown): input is NoteData =>
	typeof input === "object" &&
	input !== null &&
	"name" in input &&
	typeof input.name === "string" &&
	"octave" in input &&
	typeof input.octave === "number" &&
	"cents" in input &&
	typeof input.cents === "number";

export const isBaseNote = (input: unknown): input is BaseNote =>
	typeof input === "string" && notes.includes(input as BaseNote);

export const isBaseNoteOctave = (input: unknown): input is BaseNoteOctave =>
	typeof input === "string" &&
	notes.includes(input.slice(0, -1) as BaseNote) &&
	!isNaN(parseInt(input.slice(-1)));
