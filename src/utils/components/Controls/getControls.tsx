import { UseMusicNotes } from "~/utils/hooks/useMusicNotes";
import { SetOptions, isOscillatorType } from "~/utils/types";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  SpeakerWaveIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import { Range } from "./Range";
import { Select } from "./Select";
import { displayOscillators } from "./displayControls";

const getHandlers = (set: UseMusicNotes["set"]) => {
  const handleSetOscillator = (
    e: React.ChangeEvent<HTMLSelectElement> | string
  ) => {
    if (typeof e === "string") {
      if (isOscillatorType(e)) set({ oscillator: e });
      return;
    }

    if (isOscillatorType(e.target.value)) {
      set({ oscillator: e.target.value });
    }
  };

  const handleSetAttack = (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ attack: parseFloat(e.target.value) });
  };

  const handleSetDecay = (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ decay: parseFloat(e.target.value) });
  };

  const handleSetGain = (e: React.ChangeEvent<HTMLInputElement>) => {
    set({ gain: parseFloat(e.target.value) });
  };

  return {
    gain: handleSetGain,
    oscillator: handleSetOscillator,
    attack: handleSetAttack,
    decay: handleSetDecay,
  };
};

export const getControls = ({
  set,
  defaultValues,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<SetOptions>;
}) => {
  const handlers = getHandlers(set);

  return [
    {
      key: "gain",
      control: () => (
        <Range
          name={"Gain"}
          defaultValue={defaultValues?.gain}
          min={0}
          max={1}
          step={0.05}
          onChange={handlers.gain}
        />
      ),
      Icon: SpeakerWaveIcon,
    },
    {
      name: "Attack",
      control: () => (
        <Range
          name={"Attack"}
          defaultValue={defaultValues?.attack}
          onChange={handlers.attack}
          min={0}
          max={2}
          step={0.01}
        />
      ),
      Icon: ArrowUpRightIcon,
    },
    {
      name: "Decay",
      control: () => (
        <Range
          name={"Decay"}
          defaultValue={defaultValues?.decay}
          onChange={handlers.decay}
          min={0}
          max={2}
          step={0.01}
        />
      ),
      Icon: ArrowDownRightIcon,
    },
    {
      name: "Oscillator",
      control: () => (
        <Select
          defaultValue={defaultValues?.oscillator}
          onChange={handlers.oscillator}
          options={displayOscillators}
        />
      ),
      Icon: SignalIcon,
    },
  ];
};
