import { getBaseNote } from "~/utils/pitches";
import { Note } from "~/utils/types";
import styles from "./Keyboard.module.css";

/* White notes with a white note on their left */
const NO_MARGIN_NOTES = ["C", "F"];

export const Keyboard = ({
  keys,
  index,
  start,
  stop,
  isPressed,
}: {
  keys: Note[];
  index?: number;
  start: (note: Note) => void;
  stop: (note: Note) => void;
  isPressed?: boolean;
}) => {
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
    <div className="w-[960px] max-w-full">
      {index && <span className={styles.text}>{`octave ${index}`}</span>}
      <div className={styles.set}>
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
              onTouchStart={(e) => start(note)}
              onTouchMove={(e) => console.log("onTouchMove")}
              onTouchEnd={(e) => stop(note)}
              onTouchCancel={(e) => console.log("onTouchCancel")}
            />
          );
        })}
      </div>
    </div>
  );
};
