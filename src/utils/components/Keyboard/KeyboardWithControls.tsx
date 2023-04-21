import { useMouseAndTouchDown } from "~/utils/hooks/useMouseDown";
import { useMusicNotes } from "~/utils/hooks/useMusicNotes";
import { Keyboard } from "./Keyboard";
import { KeyboardType } from "./types";
import { Controls } from "../Controls/Controls";

export const KeyboardWithControls = ({
  keyboard,
  audioContext,
  onClose,
}: {
  keyboard: KeyboardType;
  audioContext: AudioContext;
  onClose?: () => void;
}) => {
  const { start, stop, set, controlValues } = useMusicNotes({ audioContext });

  return (
    <div className="w-full min-w-[320px] max-w-[1080px]">
      <div className="flex items-end justify-between">
        <Controls set={set} onClose={onClose} defaultValues={controlValues} />
      </div>
      <div className="w-full min-w-[320px] max-w-[1080px]">
        <Keyboard keys={keyboard} start={start} stop={stop} />
      </div>
    </div>
  );
};
