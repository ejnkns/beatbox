import { useState } from "react";

export const Range = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [value, setValue] = useState(props.value);

  return (
    <div className="flex flex-col">
      <label className="flex justify-between">
        <span className="text-base">{props.name}</span>
        <output id="output" className="text-right text-base">
          {value}
        </output>
      </label>
      <input
        {...props}
        type="range"
        className="rounded-md border border-solid border-black p-0 text-black"
        onInput={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </div>
  );
};
