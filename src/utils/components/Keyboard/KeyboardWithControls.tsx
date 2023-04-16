import { useMouseDown } from "~/utils/hooks/useMouseDown";
import { useMusicNotes } from "~/utils/hooks/useMusicNotes";
import { Keyboard } from "./Keyboard";
import { KeyboardType } from "./types";
import { Controls } from "../Controls/Controls";

export const KeyboardWithControls = ({
  keyboard,
  audioContext,
}: {
  keyboard: KeyboardType;
  audioContext: AudioContext;
}) => {
  const { start, stop, set, controlValues } = useMusicNotes({ audioContext });
  const { isMouseDown, ref } = useMouseDown<HTMLDivElement>();
  console.log({ controlValues });

  return (
    <div className="w-full min-w-[320px] max-w-[1080px]">
      <div className="flex items-end justify-between">
        <Controls set={set} defaultValues={controlValues} />
      </div>
      <div className="w-full min-w-[320px] max-w-[1080px]">
        <Keyboard
          ref={ref}
          isPressed={isMouseDown}
          keys={keyboard}
          start={start}
          stop={stop}
        />
      </div>
    </div>
  );
};
