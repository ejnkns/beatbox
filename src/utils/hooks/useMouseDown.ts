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
      ref.current.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mousedown", handleMouseDown);
        ref.current.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, []);

  return { isMouseDown, ref };
};
