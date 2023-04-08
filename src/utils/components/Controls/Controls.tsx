import { UseMusicNotes } from "~/utils/hooks/useMusicNotes";
import { OSCILLATORS, SetOptions } from "~/utils/types";
import { Range } from "./Range";
import { Select } from "./Select";
import { useControls } from "./useControls";

export const Controls = ({
  set,
  defaultValues,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<SetOptions>;
}) => {
  const {
    handleSetGain,
    handleSetOscillator,
    handleSetSmoothInInterval,
    handleSetSmoothOutInterval,
  } = useControls(set);

  return (
    <div className="inline-flex w-fit items-center gap-8 overflow-scroll bg-white bg-opacity-80 p-4 shadow shadow-white/80">
      <Select
        name={"Oscillator"}
        defaultValue={defaultValues?.oscillator}
        onChange={handleSetOscillator}
        options={OSCILLATORS}
      />
      <Range
        name={"Attack"}
        defaultValue={defaultValues?.smoothInInterval}
        onChange={handleSetSmoothInInterval}
        min={0}
        max={2}
        step={0.01}
      />
      <Range
        name={"Decay"}
        defaultValue={defaultValues?.smoothOutInterval}
        onChange={handleSetSmoothOutInterval}
        min={0}
        max={2}
        step={0.01}
      />
      <Range
        name={"Gain"}
        defaultValue={defaultValues?.gain}
        min={0}
        max={1}
        step={0.05}
        onChange={handleSetGain}
      />
    </div>
  );
};
