import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  onClick,
  className,
  disabled,
}: PropsWithChildren<{
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}>) => {
  return (
    <button
      className={twMerge(
        `inline-flex h-8  min-w-max items-center justify-center border-2 border-black px-4 py-2 text-xs font-semibold text-gray-900
      ${
        disabled
          ? "cursor-default bg-indigo-200 bg-opacity-20"
          : "bg-indigo-200 bg-opacity-50 transition-all hover:bg-opacity-80"
      }`,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
