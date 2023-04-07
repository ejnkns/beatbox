import {
  findTriads,
  formatNoteData,
  frequencyToNote,
  noteToFrequency,
  sumHarmonic,
} from "./pitches";
import { expect, test } from "vitest";
import { MAX_OCTAVE, NOTES, TRIADS } from "./constants";
import { Note, NoteData } from "./types";
import { objectKeys } from "./helpers";

test("frequencyToNote", () => {
  expect(formatNoteData(frequencyToNote(880))).toEqual("A5 (0 cents)");
  expect(formatNoteData(frequencyToNote(440))).toEqual("A4 (0 cents)");
  expect(formatNoteData(frequencyToNote(220))).toEqual("A3 (0 cents)");
  expect(formatNoteData(frequencyToNote(110))).toEqual("A2 (0 cents)");
  expect(formatNoteData(frequencyToNote(55))).toEqual("A1 (0 cents)");

  expect(formatNoteData(frequencyToNote(783.99))).toEqual("G5 (0 cents)");
  expect(formatNoteData(frequencyToNote(784))).toEqual("G5 (0 cents)");
  expect(formatNoteData(frequencyToNote(440.2))).toEqual("A4 (+1 cents)");
  expect(formatNoteData(frequencyToNote(452.8))).toEqual("A4 (+50 cents)");
  expect(formatNoteData(frequencyToNote(452.9))).toEqual("A#4 (-50 cents)");
});

test("testy", () => {
  const noteC4 = {
    name: "C",
    octave: 4,
    cents: 0,
  } as const;

  const frequencies = NOTES.map((note) => {
    const noteData = {
      name: note,
      octave: 4,
      cents: 0,
    } as const;
    return noteToFrequency(noteData);
  });

  frequencies.forEach((frequency) => {
    const sumNote = frequencyToNote(
      sumHarmonic(noteToFrequency(noteC4), frequency)
    ) as NoteData;

    const note = frequencyToNote(frequency) as NoteData;

    console.info({ noteC4, note, sumNote });
    objectKeys(TRIADS).forEach((triadType) => {
      const triads = findTriads({
        note1: noteC4,
        note2: note,
        note3: sumNote,
        type: triadType,
      });
      console.info(triadType, { triads });
    });
  });
});

test("noteToFrequency", () => {
  expect(noteToFrequency({ name: "A", octave: 4, cents: 0 })).toEqual(440);
  const noteC4 = {
    name: "C",
    octave: 4,
    cents: 0,
  } as const;

  expect(noteToFrequency(noteC4)).toEqual(261.63);
});
