import { RefObject, useEffect, useRef, useState } from "react";

export const useMouseDown = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("mousedown", handleMouseDown);
      ref.current.addEventListener("touchstart", handleMouseDown);
      ref.current.addEventListener("mouseup", handleMouseUp);
      ref.current.addEventListener("touchend", handleMouseUp);
      ref.current.addEventListener("touchcancel", handleMouseUp);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mousedown", handleMouseDown);
        ref.current.removeEventListener("touchstart", handleMouseDown);
        ref.current.removeEventListener("mouseup", handleMouseUp);
        ref.current.removeEventListener("touchend", handleMouseUp);
        ref.current.removeEventListener("touchcancel", handleMouseUp);
      }
    };
  }, []);

  return { isMouseDown, ref };
};
