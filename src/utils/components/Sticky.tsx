import { PropsWithChildren } from "react";

export const Sticky = ({ children }: PropsWithChildren) => {
  return (
    <div className="sticky top-0 z-50 flex w-full justify-center">
      {children}
    </div>
  );
};
