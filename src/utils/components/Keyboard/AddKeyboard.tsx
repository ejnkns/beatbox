import { KeyboardType } from "./types";
import { getKeys, noteToIndex } from "~/utils/pitches";
import { GetKeysInput, isNote, Note } from "~/utils/types";
import { Select } from "../Controls/Select";
import { MAX_OCTAVE, NOTES, OCTAVE_LENGTH } from "~/utils/constants";

const validate = (input: {
  start: string;
  end: string;
}): input is GetKeysInput => {
  const { start, end } = input;
  if (!isNote(start) || !isNote(end)) {
    return false;
  }
  if (noteToIndex(start) > noteToIndex(end)) {
    return false;
  }
  return true;
};

export const AddKeyboard = ({
  addKeyboard,
}: {
  addKeyboard: (keyboard: KeyboardType) => void;
}) => {
  const octaves = [...Array(MAX_OCTAVE).keys()].map(String);
  const notes = [...NOTES];
  return (
    <div className="">
      <h1>Add Keys</h1>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="low"
        >
          Low
        </label>
        <Select id="low" options={notes} />
        <Select id="lowOctave" options={octaves} />
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="high"
        >
          High
        </label>
        <Select id="high" options={notes} />
        <Select id="highOctave" options={octaves} />
      </div>
      <button
        onClick={() => {
          const low = document.getElementById("low") as HTMLInputElement;
          const high = document.getElementById("high") as HTMLInputElement;
          const lowOctave = document.getElementById(
            "lowOctave"
          ) as HTMLInputElement;
          const highOctave = document.getElementById(
            "highOctave"
          ) as HTMLInputElement;
          const input = {
            start: `${low.value}${lowOctave.value}`,
            end: `${high.value}${highOctave.value}`,
          };
          if (validate(input)) addKeyboard(getKeys(input));
        }}
      >
        Add
      </button>
    </div>
  );
};
