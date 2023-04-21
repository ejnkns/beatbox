import { getBaseNote } from "~/utils/pitches";
import { BaseNote, Note, isNote } from "~/utils/types";
import styles from "./Keyboard.module.css";
import { useMouseAndTouchDown } from "~/utils/hooks/useMouseDown";
import { useMultiKeyPress } from "~/utils/hooks/useKeypress";
import { NO_MARGIN_NOTES } from "./keyboard.constants";
import { useEffect } from "react";

export const Keyboard = ({
  keys: notes,
  start,
  stop,
}: {
  keys: Note[];
  start: (note: Note) => void;
  stop: (note: Note) => void;
}) => {
  const { isMouseDown, ref } = useMouseAndTouchDown<HTMLDivElement>();
  const { downNotes } = useMultiKeyPress({ start, stop, notes });

  useEffect(() => {
    Object.keys(downNotes).forEach((note) => {
      if (isNote(note))
        if (downNotes[note]) start(note);
        else stop(note);
    });
  });

  const whiteNoteLengthPercent =
    100 / notes.filter((key) => !key.includes("#")).length;

  const whiteStyle = {
    width: `${whiteNoteLengthPercent - 0.001}%`,
  };

  const marginStyle = {
    margin: `0 0 0 -${whiteNoteLengthPercent / 4}%`,
  };

  const blackStyle = {
    width: `${whiteNoteLengthPercent / 2}%`,
    ...marginStyle,
  };

  const getClassNames = (note: Note) => {
    const isWhite = !note.includes("#");
    const playing = downNotes[note] ? "playing" : undefined;

    return `${styles.key} ${styles[`${isMouseDown}`]} ${
      playing && styles[playing]
    } ${
      isWhite ? `${styles.white} ${styles[getBaseNote(note)]}` : styles.black
    }`;
  };

  return (
    <div ref={ref} className={styles.set}>
      {notes.map((note) => {
        const isWhite = !note.includes("#");
        const baseNote = getBaseNote(note);
        return (
          <div
            id={note}
            key={note}
            className={getClassNames(note)}
            style={{
              ...(isWhite && whiteStyle),
              ...(!isWhite && blackStyle),
              ...(!NO_MARGIN_NOTES.includes(baseNote) && marginStyle),
            }}
            onMouseDown={() => start(note)}
            onMouseOver={() => !!isMouseDown && start(note)}
            onFocus={() => !!isMouseDown && start(note)}
            onMouseOut={() => stop(note)}
            onBlur={() => stop(note)}
            onMouseUp={() => stop(note)}
            onTouchStart={() => start(note)}
            onTouchMove={() => console.log("onTouchMove")}
            onTouchEnd={() => stop(note)}
            onTouchCancel={() => console.log("onTouchCancel")}
          />
        );
      })}
    </div>
  );
};
