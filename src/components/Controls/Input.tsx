import { HTMLInputTypeAttribute } from "react";

export const Input = ({
  inputText,
  setInputText,
  isLoading,
  placeholder,
  type
}: {
  inputText: string;
  setInputText: (input: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  type?: HTMLInputTypeAttribute
}) => (
  <div className="w-full">
    <input
      className="h-8 w-full border-2 border-black
      bg-white/10
      pl-1
      focus:outline-black focus:outline-[0] focus:bg-white/20
      [&::-webkit-search-cancel-button]:appearance-none
      [&::-webkit-search-cancel-button]:cursor-pointer
      [&::-webkit-search-cancel-button]:h-6
      [&::-webkit-search-cancel-button]:w-8
      [&::-webkit-search-cancel-button]:relative
      transition-all
      placeholder-gray-500
      "
      type={type ?? "text"}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      placeholder={placeholder}
    />
    <div className="pointer-events-none relative bottom-8 right-2 flex justify-end">
      {isLoading && (
        <div
          className="absolute inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"/>
        </div>
      )}
      {/* {inputText.length > 0 && (
        <button
          className="h-4 w-4 m-2 rounded-full bg-gray-400"
          onClick={() => setInputText("")}
        >
          <span className="sr-only">Clear</span>
          <svg
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.172 5.172a1 1 0 011.415 0L10 8.585l3.414-3.414a1 1 0 111.415 1.415L11.414 10l3.415 3.414a1 1 0 01-1.415 1.415L10 11.414l-3.414 3.415a1 1 0 01-1.415-1.415L8.586 10 5.172 6.586a1 1 0 010-1.414z"
            />
          </svg>
        </button>
       )} */}
    </div>
  </div>
);
