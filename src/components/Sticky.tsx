import { PropsWithChildren } from "react";

export const Sticky = ({
  children,
  position = "top",
}: PropsWithChildren<{ position?: "top" | "bottom" }>) => {
  return (
    <div
      className={`sticky top-0 z-50 flex w-full 
        ${position === "top" && "top-0"}
        ${position === "bottom" && "top-0"}
      `}
    >
      {children}
    </div>
  );
};
