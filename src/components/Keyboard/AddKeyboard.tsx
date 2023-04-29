import { KeyboardType } from "./types";
import { getKeys, noteToIndex } from "~/utils/pitches";
import { GetKeysInput, isNote } from "~/utils/types";
import { Select } from "../Controls/Select";
import { MAX_OCTAVE, NOTES } from "~/utils/constants";
import { useState } from "react";

type AddKeyboardInput = Record<keyof GetKeysInput, string>;

const validate = (input: AddKeyboardInput): input is GetKeysInput => {
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
  const octaveOptions = octaves.map((octave, i) => ({
    id: i,
    name: octave,
  }));
  const noteOptions = NOTES.map((note, i) => ({
    id: i,
    name: note,
  }));

  const [input, setInput] = useState<AddKeyboardInput>({
    start: "C3",
    end: "C5",
  });

  return (
    <div className="ml-4 flex flex-col items-center justify-center gap-4 bg-white p-1">
      <div className="grid grid-cols-3 items-center gap-4">
        <Select
          defaultValue={input.start.charAt(0)}
          label="Low note"
          options={noteOptions}
          onChange={(value) =>
            setInput((prevInput) => ({
              start: `${value}${prevInput.start.charAt(1)}`,
              end: prevInput.end,
            }))
          }
        />
        <Select
          defaultValue={input.start.charAt(1)}
          options={octaveOptions}
          onChange={(value) =>
            setInput((prevInput) => ({
              start: `${prevInput.start.charAt(0)}${value}`,
              end: prevInput.end,
            }))
          }
        />
        <Select
          defaultValue={input.end.charAt(0)}
          label="High note"
          options={noteOptions}
          onChange={(value) =>
            setInput((prevInput) => ({
              start: prevInput.start,
              end: `${value}${prevInput.end.charAt(1)}`,
            }))
          }
        />
        <Select
          defaultValue={input.end.charAt(1)}
          options={octaveOptions}
          onChange={(value) =>
            setInput((prevInput) => ({
              start: prevInput.start,
              end: `${prevInput.end.charAt(0)}${value}`,
            }))
          }
        />
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => {
          if (validate(input)) addKeyboard(getKeys(input));
        }}
      >
        Add
      </button>
    </div>
  );
};
