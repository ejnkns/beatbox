import { UseMusicNotes } from "../../hooks/useMusicNotes";
import { SetOptions } from "../../types";
import { getControls } from "./getControls";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const Controls = ({
  set,
  defaultValues,
  onClose,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<SetOptions>;
  onClose?: () => void;
}) => {
  const controls = getControls({ set, defaultValues });

  return (
    <div className="flex w-full pt-4">
      <div className="flex w-full gap-4 rounded-t-2xl bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 md:flex-col">
        <div className="flex w-full md:flex-col">
          {controls.map(({ name, Icon, control }, index) => (
            <div
              key={`${name}-${index}`}
              className="group relative flex w-full items-center gap-x-6 rounded-lg p-2 hover:bg-gray-50"
            >
              <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white lg:hidden md:flex">
                <Icon
                  className="h-6 w-6 text-gray-600 group-hover:text-blue-500"
                  aria-hidden="true"
                />
              </div>
              <div className="w-full font-semibold text-gray-900">
                {control()}
              </div>
            </div>
          ))}
        </div>
        {onClose && (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={onClose}
          >
            <span className="sr-only">Close keyboard</span>
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};
