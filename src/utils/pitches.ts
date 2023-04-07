import {
  A4,
  A4_INDEX,
  DEFAULT_OCTAVE,
  NOTES,
  OCTAVE_LENGTH,
  TRIADS,
} from "./constants";
import {
  BaseNote,
  Note,
  isBaseNote,
  isBaseNoteOctave,
  NoteData,
  TriadInput,
  TriadWithTypeInput,
} from "./types";

const isInFrequencyRange = (input: number) => {
  if (input < 27.5 || input > 14080) {
    return false;
  }
  return true;
};

export const frequencyToNote = (frequency: number): NoteData => {
  if (!isInFrequencyRange(frequency)) {
    throw new Error(
      `Frequency not in range between 27.5Hz (A0) and 14080Hz (A9).\ninput: ${frequency}Hz`
    );
  }

  const frequencyRatio = frequency / A4;
  const noteIndex = Math.round(
    (Math.log(frequencyRatio) / Math.log(2)) * OCTAVE_LENGTH + A4_INDEX
  );

  const octave = Math.floor(noteIndex / OCTAVE_LENGTH);
  const noteName = NOTES[noteIndex % OCTAVE_LENGTH];
  if (!noteName) throw new Error("Note name not found.");
  const cents = Math.round(
    (100 *
      OCTAVE_LENGTH *
      Math.log(
        frequencyRatio / Math.pow(2, (noteIndex - A4_INDEX) / OCTAVE_LENGTH)
      )) /
      Math.log(2)
  );

  return {
    name: noteName,
    octave,
    cents,
  };
};

export const formatNoteData = (note: Partial<NoteData>) => {
  const { name, octave, cents } = note;
  return `${name}${octave} (${cents && cents > 0 ? `+${cents}` : cents} cents)`;
};

export const sumHarmonic = (note1: number, note2: number) => {
  if (!isInFrequencyRange(note1) || !isInFrequencyRange(note2)) {
    throw new Error(
      `Frequency not in range between 27.5Hz (A0) and 14080Hz (A9).\ninput: ${note1}Hz, ${note2}Hz`
    );
  }

  const sum = note1 + note2;

  if (!isInFrequencyRange(sum)) {
    throw new Error(
      `Sum of frequencies is higher than A9 (14080Hz).\nsum: ${sum}Hz`
    );
  }
  return sum;
};

const getBaseNote = (note: BaseNote | Note) => {
  const baseNote = isBaseNoteOctave(note) ? note.slice(0, -1) : note;
  if (!isBaseNote(baseNote)) {
    throw new Error(`Invalid base note, input: ${note}`);
  }
  return baseNote;
};
const getOctave = (note: BaseNote | Note) => {
  if (isBaseNoteOctave(note)) {
    return parseInt(note.slice(-1));
  }
  return DEFAULT_OCTAVE;
};

const makeNoteData = (
  note: BaseNote | Note,
  octave?: number,
  cents?: number
) => {
  const baseNote = getBaseNote(note);
  return {
    name: baseNote,
    octave: octave || getOctave(note),
    cents: cents || 0,
  } satisfies NoteData;
};

export const noteToFrequency = (note: NoteData | BaseNote | Note) => {
  const noteData = typeof note === "string" ? makeNoteData(note) : note;
  const { name, octave, cents } = noteData;

  const noteIndex = octave * OCTAVE_LENGTH + NOTES.indexOf(name);
  const frequencyRatio =
    Math.pow(2, (noteIndex - A4_INDEX) / OCTAVE_LENGTH) *
    Math.pow(2, cents / (100 * OCTAVE_LENGTH));

  const frequency = A4 * frequencyRatio;
  return Number(frequency.toFixed(2));
};

export const noteToIndex = (note: NoteData | Note) => {
  const noteData = typeof note === "string" ? makeNoteData(note) : note;
  const { name, octave } = noteData;
  const noteIndex = octave * OCTAVE_LENGTH + NOTES.indexOf(name);
  const normalNoteIndex = noteIndex;
  return normalNoteIndex;
};

const indexToNote = (index: number) => {
  const octave = Math.floor(index / OCTAVE_LENGTH);
  const noteName = NOTES[index % OCTAVE_LENGTH];
  return noteName && octave !== undefined
    ? {
        name: noteName,
        octave,
      }
    : undefined;
};

export const notesToIndex = (notes: NoteData[]) => {
  return notes.map(noteToIndex);
};

export const findTriads = ({
  note1,
  note2,
  note3,
  type,
}: TriadWithTypeInput) => {
  const noteIndexes = notesToIndex([note1, note2, note3]);

  const lowestIndex = Math.min(...noteIndexes);
  const sortedTransposedChordString = noteIndexes
    .map((index) => index - lowestIndex)
    .sort()
    .toString();

  const foundTriads = TRIADS[type].filter(
    (triad) => triad.toString() === sortedTransposedChordString
  );
  return foundTriads;
};

export const isMajorTriad = (props: TriadInput) => {
  const foundTriads = findTriads({ ...props, type: "major" });
  return Boolean(foundTriads);
};

export const isTriad = (props: TriadWithTypeInput) => {
  const foundTriads = findTriads(props);
  return Boolean(foundTriads);
};
