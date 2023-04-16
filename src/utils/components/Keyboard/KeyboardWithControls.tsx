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
    <>
      <Controls set={set} defaultValues={controlValues} />
      <div ref={ref} className="m-4 w-fit rounded-xl bg-white p-4">
        <div className="flex justify-between">
          <span>{keyboard[0]}</span>
          <span>{keyboard[keyboard.length - 1]}</span>
        </div>
        <Keyboard
          isPressed={isMouseDown}
          keys={keyboard}
          start={start}
          stop={stop}
        />
      </div>
    </>
  );
};
