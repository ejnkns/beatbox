export const Input = ({
  inputText,
  setInputText,
  isLoading,
  placeholder,
}: {
  inputText: string;
  setInputText: (input: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}) => (
  <div className="w-full">
    <input
      className="h-8 w-full border-2 border-black"
      type="text"
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
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )}
    </div>
  </div>
);
