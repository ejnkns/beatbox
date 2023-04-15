import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { UseMusicNotes } from "../../hooks/useMusicNotes";
import { SetOptions } from "../../types";
import { getControls } from "./getControls";

export const Popper = ({
  set,
  defaultValues,
}: {
  set: UseMusicNotes["set"];
  defaultValues?: Partial<SetOptions>;
}) => {
  const controls = getControls({ set, defaultValues });

  return (
    <Popover className="relative mb-4 mt-4 flex items-center">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-x-0"
        enterTo="opacity-100 translate-x-1"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-x-1"
        leaveTo="opacity-0 translate-x-0"
      >
        <Popover.Panel className="absolute z-10 ml-8 flex max-w-max px-4">
          <div className="flex-auto rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="flex p-4">
              {controls.map(({ name, Icon, control }) => (
                <div
                  key={name}
                  className="group relative flex w-60 items-center gap-x-6 rounded-lg p-2 hover:bg-gray-50"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
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
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
