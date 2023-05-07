import { useState } from "react";

export const Range = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [value, setValue] = useState(props.defaultValue);

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
        className="w-full min-w-[2rem] appearance-none rounded-md border border-solid border-black bg-gray-100
        p-0 text-black [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500

        "
        onInput={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </div>
  );
};
