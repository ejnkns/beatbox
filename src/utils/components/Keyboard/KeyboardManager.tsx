import { useMusicNotes } from "../../hooks/useMusicNotes";
import { Keyboard } from "./Keyboard";
import { Sticky } from "../Sticky";
import { Controls } from "../Controls/Controls";
import { getKeys } from "~/utils/pitches";
import { useMouseDown } from "~/utils/hooks/useMouseDown";
import { useState } from "react";
import { AddKeyboard } from "./AddKeyboard";
import { KeyboardType } from "./types";

export const KeyboardManager = () => {
  const { start, stop, set } = useMusicNotes();
  const { isMouseDown, ref } = useMouseDown<HTMLDivElement>();

  const keyboard = getKeys({ start: "F3", end: "C5" });
  const [keyboards, setKeyboards] = useState<KeyboardType[]>([keyboard]);

  return (
    <>
      <Sticky position="top">
        <Controls set={set} />
        <AddKeyboard
          addKeyboard={(keyboard) => setKeyboards([...keyboards, keyboard])}
        />
      </Sticky>
      <div
        ref={ref}
        className="m-4 flex w-full flex-wrap justify-center rounded-xl bg-white p-4"
      >
        {keyboards.map((keys, i) => (
          <>
            <button
              onClick={() => {
                setKeyboards((currentKeyboards) => {
                  const newKeyboards = [...currentKeyboards];
                  newKeyboards.splice(i, 1);
                  return newKeyboards;
                });
              }}
            >
              Delete
            </button>
            <Keyboard
              key={i}
              isPressed={isMouseDown}
              keys={keys}
              start={start}
              stop={stop}
            />
          </>
        ))}
      </div>
    </>
  );
};
