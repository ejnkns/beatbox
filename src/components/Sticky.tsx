import { PropsWithChildren } from "react";

export const Sticky = ({
  children,
  position = "top",
  fixed = false,
}: PropsWithChildren<{ position?: "top" | "bottom"; fixed?: boolean }>) => {
  return (
    <div
      className={`z-50 flex w-full ${fixed ? "fixed" : "sticky"} ${
        position === "top" && "top-0"
      } ${position === "bottom" && "top-0"} `}
    >
      {children}
    </div>
  );
};
