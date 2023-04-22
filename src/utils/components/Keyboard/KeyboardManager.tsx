import { useCallback, useState } from "react";
import { AddKeyboard } from "./AddKeyboard";
import { KeyboardType } from "./types";
import { KeyboardWithControls } from "./KeyboardWithControls";
import { useAudioContext } from "~/utils/hooks/useAudioContext";
import { Sticky } from "../Sticky";
import { ChildPopper } from "../ChildPopper";
import { Modal } from "../Modal";
import { v4 as uuid } from "uuid";
import { useTimeoutFn } from "react-use";
import { useKeyboardWindowSize } from "./Keyboard.utils";

type KeyboardState = {
  keyboard: KeyboardType;
  hidden?: boolean;
  id: string;
};

export const KeyboardManager = () => {
  const audioContext = useAudioContext();

  const initialKeyboard = useKeyboardWindowSize();
  const [keyboards, setKeyboards] = useState<KeyboardState[]>([
    { keyboard: initialKeyboard, id: uuid() },
  ]);

  const handleAddKeyboard = useCallback((keyboard: KeyboardType) => {
    setKeyboards((currentKeyboards) => [
      { keyboard, id: uuid() },
      ...currentKeyboards,
    ]);
  }, []);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useTimeoutFn(() => {
    setKeyboards((currentKeyboards) =>
      currentKeyboards.filter(({ id: currId }) => currId !== deletingId)
    );
  }, 500);

  const handleClose = useCallback(
    (id: string) => {
      setKeyboards((currentKeyboards) =>
        currentKeyboards.map((keyboard) =>
          keyboard.id !== id ? keyboard : { ...keyboard, hidden: true }
        )
      );
      setDeletingId(id);
    },
    [setKeyboards]
  );

  if (!audioContext) return <>Loading...</>;
  return (
    <>
      <Sticky>
        <ChildPopper label="Add a keyboard">
          <AddKeyboard addKeyboard={handleAddKeyboard} />
        </ChildPopper>
      </Sticky>
      {keyboards.map(({ keyboard, hidden, id }, index) => (
        <div
          key={`${index}-${id}`}
          className="flex w-full flex-col items-center justify-center"
        >
          <Modal isOpen={!hidden}>
            <KeyboardWithControls
              divProps={{ tabIndex: index }}
              id={id}
              keyboard={keyboard}
              audioContext={audioContext}
              onClose={() => {
                handleClose(id);
              }}
            />
          </Modal>
        </div>
      ))}
    </>
  );
};
