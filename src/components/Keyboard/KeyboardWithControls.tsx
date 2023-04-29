import { useMusicNotes } from "~/utils/hooks/useMusicNotes";
import { Keyboard } from "./Keyboard";
import { KeyboardType } from "./types";
import { Controls } from "../Controls/Controls";
import { isNote } from "~/utils/types";
import { useCallback, useMemo, useRef, KeyboardEvent } from "react";
import { getKeyToNoteMap } from "./Keyboard.utils";

export const KeyboardWithControls = ({
  keyboard,
  audioContext,
  onClose,
  id,
  divProps,
}: {
  keyboard: KeyboardType;
  audioContext: AudioContext;
  onClose?: () => void;
  id: string;
  divProps?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  const { start, stop, set, controlValues, playingNotes } = useMusicNotes({
    audioContext,
  });

  const keyToNoteMap = useMemo(() => getKeyToNoteMap(keyboard), [keyboard]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.repeat) return;
      const note = keyToNoteMap[e.key];
      if (isNote(note)) {
        start(note);
      }
    },
    [keyToNoteMap, start]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const note = keyToNoteMap[e.key];
      if (isNote(note)) {
        stop(note);
      }
    },
    [keyToNoteMap, stop]
  );

  return (
    <div
      {...divProps}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className="w-full min-w-[320px]"
    >
      <div className="flex items-end justify-between">
        <Controls set={set} onClose={onClose} defaultValues={controlValues} />
      </div>
      <Keyboard
        id={id}
        notes={keyboard}
        start={start}
        stop={stop}
        playingNotes={playingNotes}
        keyNoteMap={keyToNoteMap}
      />
    </div>
  );
};
