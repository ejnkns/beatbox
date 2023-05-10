import { HTMLInputTypeAttribute } from "react";

export const Input = ({
  inputText,
  setInputText,
  isLoading,
  placeholder,
  type,
}: {
  inputText: string;
  setInputText: (input: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}) => (
  <div className="w-full">
    <input
      className="h-8 w-full border-2 border-black
      bg-white/10
      pl-1
      italic placeholder-gray-900 transition-all
      focus:bg-white/20
      focus:outline-[0]
      focus:outline-black
      [&::-webkit-search-cancel-button]:relative
      [&::-webkit-search-cancel-button]:h-6
      [&::-webkit-search-cancel-button]:w-8
      [&::-webkit-search-cancel-button]:cursor-pointer
      [&::-webkit-search-cancel-button]:appearance-none
      "
      type={type ?? "text"}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      placeholder={placeholder}
    />
    <div className="pointer-events-none relative bottom-7 right-2 flex justify-end">
      {isLoading && (
        <div
          className="absolute inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-indigo-200 opacity-50 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" />
        </div>
      )}
      {inputText.length > 0 && (
        <div className="absolute right-1 top-1">
          <span className="sr-only">Clear</span>
          <svg
            className="h-4 w-4 fill-indigo-200 opacity-50"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.172 5.172a1 1 0 011.415 0L10 8.585l3.414-3.414a1 1 0 111.415 1.415L11.414 10l3.415 3.414a1 1 0 01-1.415 1.415L10 11.414l-3.414 3.415a1 1 0 01-1.415-1.415L8.586 10 5.172 6.586a1 1 0 010-1.414z"
            />
          </svg>
        </div>
      )}
    </div>
  </div>
);
