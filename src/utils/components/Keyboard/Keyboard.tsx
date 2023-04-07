import { useMusicNotes } from "../../hooks/useMusicNotes";
import { isOscillatorType, Note, Oscillator, OSCILLATORS } from "../../types";
import { useState } from "react";
import { useMouseDown } from "../../hooks/useMouseDown";
import { getOctaves } from "../../helpers";
import { Octave } from "./Octave";
import { DEFAULT_OSCILLATOR } from "~/utils/constants";
import { Select } from "../Select/select";
import { Sticky } from "../Sticky";

export default function Keyboard() {
  const [oscillator, setOscillator] = useState<Oscillator>(DEFAULT_OSCILLATOR);
  console.log(oscillator);
  const [smoothInInterval, setSmoothInInterval] = useState(0.05);
  const [smoothOutInterval, setSmoothOutInterval] = useState(0.01);

  const { isMouseDown, ref } = useMouseDown<HTMLDivElement>();

  const { start, stop, setAll } = useMusicNotes(
    {
      oscillator,
      smoothInInterval,
      smoothOutInterval,
    },
    [oscillator]
  );

  const handleSetOscillator = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if ("value" in e.target && isOscillatorType(e.target.value)) {
      setOscillator(e.target.value);
      setAll(e.target.value);
    }
  };

  return (
    <>
      <Sticky>
        <Select
          options={OSCILLATORS}
          value={oscillator}
          onChange={handleSetOscillator}
        />
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
}
