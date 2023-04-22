import { getBaseNote } from "~/utils/pitches";
import { Note } from "~/utils/types";
import styles from "./Keyboard.module.css";
import { useMouseAndTouchDown } from "~/utils/hooks/useMouseDown";
import { NO_MARGIN_NOTES } from "./Keyboard.constants";

export const Keyboard = ({
  keys: notes,
  start,
  stop,
  id,
  playingNotes,
}: {
  keys: Note[];
  start: (note: Note) => void;
  stop: (note: Note) => void;
  id: string;
  playingNotes?: Note[];
}) => {
  const { isMouseDown, ref } = useMouseAndTouchDown<HTMLDivElement>();

  const whiteNoteLengthPercent =
    100 / notes.filter((key) => !key.includes("#")).length;

  const whiteStyle = {
    width: `${whiteNoteLengthPercent - 0.003}%`,
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
    const playing = playingNotes?.includes(note) ? "playing" : undefined;

    return `${styles.key} ${styles[`${isMouseDown}`]} ${
      styles[getBaseNote(note)]
    } ${playing && styles[playing]} ${
      isWhite ? `${styles.white} ` : styles.black
    }`;
  };

  return (
    <div ref={ref}>
      {notes.map((note) => {
        const isWhite = !note.includes("#");
        const baseNote = getBaseNote(note);
        return (
          <div key={`${note}-${id}`}>
            <div
              id={note}
              className={getClassNames(note)}
              style={{
                ...(isWhite && whiteStyle),
                ...(!isWhite && blackStyle),
                ...(!NO_MARGIN_NOTES.includes(baseNote) && marginStyle),
              }}
              onMouseDown={() => start(note)}
              onMouseOver={() => !!isMouseDown && start(note)}
              // onFocus={() => !!isMouseDown && start(note)}
              onMouseOut={() => !!isMouseDown && stop(note)}
              onBlur={() => stop(note)}
              onMouseUp={() => stop(note)}
              onTouchStart={() => start(note)}
              // onTouchMove={() => console.log("onTouchMove")}
              onTouchEnd={() => stop(note)}
              // onTouchCancel={() => console.log("onTouchCancel")}
            />
            <span />
          </div>
        );
      })}
    </div>
  );
};
