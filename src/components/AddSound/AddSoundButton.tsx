import { useState } from "react";
import { Button } from "../Controls/Button";
import { Modal } from "../Modal";
import { AddSound, AddSoundProps } from "./AddSound";

export const AddSoundButton = ({ initialValues }: AddSoundProps) => {
  const [open, setOpen] = useState(false);

  const handleAddSoundOpen = () => {
    setOpen(true);
  };

  const handleAddSoundClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button className="w-[25%] min-w-[100px]" onClick={handleAddSoundOpen}>
        Add Sound
      </Button>
      <Modal isOpen={open} onClose={handleAddSoundClose}>
        <AddSound initialValues={initialValues} />
      </Modal>
    </>
  );
};
