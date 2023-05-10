import { PropsWithChildren } from "react";

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
      className={`${
        disabled
          ? "cursor-default"
          : "bg-indigo-200 bg-opacity-50 transition-all hover:bg-opacity-80"
      } inline-flex h-8  min-w-max items-center justify-center border-2 border-black bg-indigo-200 bg-opacity-50
       px-4 py-2 text-xs font-semibold text-gray-900
       ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
