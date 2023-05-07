import { RefObject, useEffect, useRef, useState } from "react";

export const useMouseAndTouchDown = <T extends HTMLElement>(
  ref?: RefObject<T>
) => {
  const refUseRef = useRef<T>(null);
  const refToUse = ref ?? refUseRef;
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsMouseDown(true);
  };

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsMouseDown(false);
  };

  useEffect(() => {
    const current = refToUse.current;
    if (current) {
      current.addEventListener("mousedown", handleMouseDown);
      current.addEventListener("touchstart", handleMouseDown);
      current.addEventListener("mouseup", handleMouseUp);
      current.addEventListener("touchend", handleMouseUp);
      current.addEventListener("touchcancel", handleMouseUp);
      current.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      if (current) {
        current.removeEventListener("mousedown", handleMouseDown);
        current.removeEventListener("touchstart", handleMouseDown);
        current.removeEventListener("mouseup", handleMouseUp);
        current.removeEventListener("touchend", handleMouseUp);
        current.removeEventListener("touchcancel", handleMouseUp);
        current.addEventListener("mouseleave", handleMouseUp);
      }
    };
  }, [refToUse]);

  return { isMouseDown, ref: refToUse };
};
