import { useAudioContext } from "~/utils/hooks/useAudioContext";
import { useMouseDown } from "~/utils/hooks/useMouseDown";
import { useMusicNotes } from "~/utils/hooks/useMusicNotes";
import { getKeys } from "~/utils/pitches";
import { Sticky } from "../Sticky";
import { Keyboard } from "./Keyboard";
import { Controls } from "../Controls/Controls";

export const TwoKeyboards = () => {
  const audioContext = useAudioContext();
  const {
    start: start1,
    stop: stop1,
    set: set1,
  } = useMusicNotes({ audioContext });
  const {
    start: start2,
    stop: stop2,
    set: set2,
  } = useMusicNotes({ audioContext });
  const { isMouseDown, ref } = useMouseDown<HTMLDivElement>();

  const keys1 = getKeys({ start: "F3", end: "C5" });
  const keys2 = getKeys({ start: "C2", end: "C4" });

  return (
    <>
      <Sticky position="top">
        <Controls set={set1} />
        <Controls set={set2} />
      </Sticky>
      <div
        ref={ref}
        className="m-4 flex w-full flex-wrap justify-center rounded-xl bg-white p-4"
      >
        <Keyboard
          isPressed={isMouseDown}
          keys={keys1}
          start={start1}
          stop={stop1}
        />
        <Keyboard
          isPressed={isMouseDown}
          keys={keys2}
          start={start2}
          stop={stop2}
        />
      </div>
    </>
  );
};
