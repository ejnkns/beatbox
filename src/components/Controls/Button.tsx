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
          ? "cursor-default bg-gray-300"
          : "bg-indigo-400 bg-opacity-50 transition-all hover:bg-opacity-80"
      } inline-flex h-8 items-center justify-center border-2 border-black px-4
       py-2 text-xs font-semibold text-gray-900
       ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
