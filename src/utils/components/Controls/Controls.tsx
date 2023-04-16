import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { UseMusicNotes } from "../../hooks/useMusicNotes";
import { SetOptions } from "../../types";
import { getControls } from "./getControls";

export const Controls = ({
  set,
  defaultValues,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<SetOptions>;
}) => {
  const controls = getControls({ set, defaultValues });

  return (
    <div className="flex w-full pt-4">
      <div className=" flex w-full gap-4 rounded-t-2xl bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 md:flex-col">
        {controls.map(({ name, Icon, control }) => (
          <div
            key={name}
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
    </div>
  );
};
