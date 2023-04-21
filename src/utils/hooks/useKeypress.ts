import { useCallback, useEffect, useMemo, useState } from "react";
import { Note } from "../types";
import {
  PossibleBlackKeys,
  WhiteKeys,
} from "../components/Keyboard/keyboard.constants";

const isWhite = (note: Note) => !note.includes("#");

const getKeyToNoteMap = (keys: Note[]) => {
  if (!keys[0]) return {};

  let whiteIndex = 0;
  const firstNoteIsWhite = isWhite(keys[0]);
  let blackIndex = firstNoteIsWhite ? 1 : 0;

  return keys.reduce((acc, key, index) => {
    const prevKey = index > 0 ? keys[index - 1] : undefined;
    const prevWasWhite = prevKey && isWhite(prevKey);
    if (isWhite(key)) {
      const whiteKey = WhiteKeys[whiteIndex];
      if (whiteKey) {
        acc[whiteKey] = key;
        whiteIndex++;

        if (prevWasWhite) blackIndex++;
      }
    } else {
      const blackKey = PossibleBlackKeys[blackIndex];
      if (blackKey) {
        acc[blackKey] = key;
        blackIndex++;
      }
    }

    return acc;
  }, {} as Record<string, Note>);
};

export const useMultiKeyPress = ({
  start,
  stop,
  notes,
}: {
  start: (note: Note) => void;
  stop: (note: Note) => void;
  notes: Note[];
}) => {
  const [downNotes, setDownKeys] = useState<Record<Note, boolean>>({});

  const keyToNoteMap = useMemo(() => getKeyToNoteMap(notes), [notes]);

  const downHandler = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      console.log("downHandler", { key });
      const note = keyToNoteMap[key];
      if (note && !downNotes[note]) {
        console.log("START", { key, note });
        // start(note);
        setDownKeys((prev) => ({ ...prev, [note]: true }));
      }
    },
    [downNotes, keyToNoteMap]
  );

  const upHandler = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      console.log("upHandler", { key });
      const note = keyToNoteMap[key];
      if (note) {
        console.log("STOP", { key, note });
        // stop(note);
        setDownKeys((prev) => ({ ...prev, [note]: false }));
      }
    },
    [downNotes, keyToNoteMap]
  );

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return { downNotes };
};
