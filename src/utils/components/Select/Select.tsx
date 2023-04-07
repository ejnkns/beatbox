import { SelectHTMLAttributes } from "react";

export const Select = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
} & SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      {...{ value, onChange }}
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
