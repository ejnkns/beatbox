import { getKeys } from "~/utils/pitches";
import { useCallback, useState } from "react";
import { AddKeyboard } from "./AddKeyboard";
import { KeyboardType } from "./types";
import { KeyboardWithControls } from "./KeyboardWithControls";
import { useAudioContext } from "~/utils/hooks/useAudioContext";
import { Sticky } from "../Sticky";
import { ChildPopper } from "../ChildPopper";

export const KeyboardManager = () => {
  const audioContext = useAudioContext();
  const keyboard = getKeys({ start: "F3", end: "C5" });
  const [keyboards, setKeyboards] = useState<KeyboardType[]>([keyboard]);

  const handleAddKeyboard = useCallback((keyboard: KeyboardType) => {
    setKeyboards((currentKeyboards) => [keyboard, ...currentKeyboards]);
  }, []);

  if (!audioContext) return <>Loading...</>;
  return (
    <>
      <Sticky>
        <ChildPopper label="Add a keyboard">
          <AddKeyboard addKeyboard={handleAddKeyboard} />
        </ChildPopper>
      </Sticky>
      {keyboards.map((keyboard, index) => (
        <div
          key={index}
          className="flex w-full flex-col items-center justify-center p-4"
        >
          <KeyboardWithControls
            keyboard={keyboard}
            audioContext={audioContext}
          />
        </div>
      ))}
    </>
  );
};
