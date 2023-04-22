import { useMusicNotes } from "~/utils/hooks/useMusicNotes";
import { Keyboard } from "./Keyboard";
import { KeyboardType } from "./types";
import { Controls } from "../Controls/Controls";
import { isNote } from "~/utils/types";
import { useMemo, useRef } from "react";
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

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      {...divProps}
      onKeyDown={(e) => {
        if (e.repeat) return;
        const note = keyToNoteMap[e.key];
        if (isNote(note)) {
          start(note);
        }
      }}
      onKeyUp={(e) => {
        const note = keyToNoteMap[e.key];
        if (isNote(note)) {
          stop(note);
        }
      }}
      className="w-full min-w-[320px]"
    >
      <div className="flex items-end justify-between">
        <Controls set={set} onClose={onClose} defaultValues={controlValues} />
      </div>
      <Keyboard
        id={id}
        keys={keyboard}
        start={start}
        stop={stop}
        playingNotes={playingNotes}
      />
    </div>
  );
};
