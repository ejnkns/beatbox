import { useWindowSize } from "react-use";
import { GetKeysInput, Note } from "../../types";
import {
  TwoRowsPossibleBlackKeys,
  TwoRowsWhiteKeys,
  FourRowsPossibleBlackKeys,
  FourRowsWhiteKeys,
  FourRowsNotesLength,
} from "./Keyboard.constants";
import { useMemo } from "react";
import { getKeys } from "~/utils/pitches";

export const useKeyboardWindowSize = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isWidescreen = width > 1024;
  const initialKeyStartEnd: GetKeysInput = isMobile
    ? { start: "C3", end: "F4" }
    : isWidescreen
    ? { start: "C2", end: "C5" }
    : { start: "C3", end: "C5" };

  const keyboard = useMemo(() => getKeys(initialKeyStartEnd), []);
  return keyboard;
};

const isWhite = (note: Note) => !note.includes("#");

export const getKeyToNoteMap = (keys: Note[]) => {
  if (!keys[0]) return {};

  console.log(FourRowsNotesLength);

  const isTwoRows =
    keys.length <= TwoRowsWhiteKeys.length + TwoRowsPossibleBlackKeys.length;

  let whiteIndex = 0;
  const firstNoteIsWhite = isWhite(keys[0]);
  let blackIndex = firstNoteIsWhite ? 1 : 0;

  return keys.reduce((acc, key, index) => {
    const prevKey = index > 0 ? keys[index - 1] : undefined;
    const prevWasWhite = prevKey && isWhite(prevKey);
    if (isWhite(key)) {
      const whiteKey = isTwoRows
        ? TwoRowsWhiteKeys[whiteIndex]
        : FourRowsWhiteKeys[whiteIndex];
      if (whiteKey) {
        acc[whiteKey] = key;
        whiteIndex++;

        if (prevWasWhite) blackIndex++;
      }
    } else {
      const blackKey = isTwoRows
        ? TwoRowsPossibleBlackKeys[blackIndex]
        : FourRowsPossibleBlackKeys[
            index >= FourRowsNotesLength ? blackIndex + 1 : blackIndex
          ];
      if (blackKey) {
        acc[blackKey] = key;
        blackIndex++;
      }
    }

    return acc;
  }, {} as Record<string, Note>);
};
