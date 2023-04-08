import { NOTES, TRIADS } from "./constants";

export type BaseNote = (typeof NOTES)[number];
export type Note = `${BaseNote}${number}`;

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

export const OSCILLATORS = [
  "sine",
  "sawtooth",
  "square",
  "triangle",
] satisfies OscillatorType[];
export type Oscillator = (typeof OSCILLATORS)[number];

export const isOscillatorType = (value: unknown): value is Oscillator =>
  typeof value === "string" && OSCILLATORS.includes(value as Oscillator);

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
  typeof input === "string" && NOTES.includes(input as BaseNote);

export const isBaseNoteOctave = (input: unknown): input is Note =>
  typeof input === "string" &&
  NOTES.includes(input.slice(0, -1) as BaseNote) &&
  !isNaN(parseInt(input.slice(-1)));

export type FrequencyState = {
  oscillator: Oscillator;
  gain: number;
  hz: number;
  playing: boolean;
  touched: boolean;
};

export type SetOptions = {
  oscillator?: Oscillator;
  gain?: number;
  smoothInInterval?: number;
  smoothOutInterval?: number;
};
