import { MAX_OCTAVE, NOTES } from "./constants";
import { Note } from "./types";

export const objectKeys = <Obj extends {}>(obj: Obj): (keyof Obj)[] =>
  Object.keys(obj) as (keyof Obj)[];

export const getOctaves = () => {
  return [...Array(MAX_OCTAVE).keys()].map((octave) =>
    NOTES.map((note) => `${note}${octave}` satisfies Note)
  );
};
