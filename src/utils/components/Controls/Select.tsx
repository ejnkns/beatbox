import { SelectHTMLAttributes } from "react";

export const Select = <T extends string>({
  options,
  ...rest
}: {
  options: T[];
} & SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      {...rest}
      className="m-4 rounded-md border border-solid border-black  p-2 text-black"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
