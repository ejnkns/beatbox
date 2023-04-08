import { useMusicNotes } from "../../hooks/useMusicNotes";
import { useMouseDown } from "../../hooks/useMouseDown";
import { getOctaves } from "../../helpers";
import { Octave } from "./Octave";
import { Sticky } from "../Sticky";
import { Controls } from "../Controls/Controls";

export const Keyboard = () => {
  const { isMouseDown, ref } = useMouseDown<HTMLDivElement>();

  const { start, stop, set } = useMusicNotes();

  return (
    <>
      <Sticky>
        <Controls set={set} />
      </Sticky>
      <div
        className="m-4 flex w-full flex-wrap justify-center rounded-xl bg-white p-4"
        ref={ref}
      >
        {getOctaves().map((octave, i) => (
          <Octave
            key={`octave-${i}`}
            octave={octave}
            index={i}
            start={start}
            stop={stop}
            isMouseDown={isMouseDown}
          />
        ))}
      </div>
    </>
  );
};
