import { getBaseNote } from "~/utils/pitches";
import { Note } from "~/utils/types";
import styles from "./Keyboard.module.css";
import { forwardRef } from "react";

/* White notes with a white note on their left */
const NO_MARGIN_NOTES = ["C", "F"];

export const Keyboard = forwardRef<
  HTMLDivElement,
  {
    keys: Note[];
    start: (note: Note) => void;
    stop: (note: Note) => void;
    isPressed?: boolean;
  }
>(({ keys, start, stop, isPressed }, ref) => {
  const whiteNoteLengthPercent =
    100 / keys.filter((key) => !key.includes("#")).length;

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

  return (
    <div ref={ref} className={styles.set}>
      {keys.map((note) => {
        const isWhite = !note.includes("#");
        const baseNote = getBaseNote(note);
        return (
          <div
            id={note}
            key={note}
            className={`${styles.key} ${styles[`${!!isPressed}`]} ${
              isWhite ? `${styles.white} ${styles[baseNote]}` : styles.black
            }`}
            style={{
              ...(isWhite && whiteStyle),
              ...(!isWhite && blackStyle),
              ...(!NO_MARGIN_NOTES.includes(baseNote) && marginStyle),
            }}
            onMouseDown={() => start(note)}
            onMouseOver={() => !!isPressed && start(note)}
            onFocus={() => !!isPressed && start(note)}
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
});
