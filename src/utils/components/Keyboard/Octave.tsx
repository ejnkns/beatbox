import { Note } from "~/utils/types";
import styles from "./Octave.module.css";

export const Octave = ({
  octave,
  index: i,
  start,
  stop,
  isMouseDown,
}: {
  octave: Note[];
  index: number;
  start: (note: Note) => void;
  stop: (note: Note) => void;
  isMouseDown: boolean;
}) => {
  return (
    <div className={styles.text} key={`octave-${i}}`}>
      <span>{`octave ${i}`}</span>
      <div className={styles.set}>
        {octave.map((key) => (
          <div
            id={key}
            key={key}
            className={`${styles.key} ${styles[`${isMouseDown}`]} ${
              key.includes("#")
                ? styles.black
                : `${styles.white} ${
                    styles[key.replace("#", "S").replace(/[0-9]/g, "")]
                  }`
            }`}
            onMouseDown={() => start(key)}
            onMouseOver={() => isMouseDown && start(key)}
            onMouseOut={() => stop(key)}
            onMouseUp={() => stop(key)}
          />
        ))}
      </div>
    </div>
  );
};
