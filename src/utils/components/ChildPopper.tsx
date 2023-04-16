import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export const ChildPopper = ({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) => {
  return (
    <Popover className="relative flex p-4 ">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        <span>{label}</span>
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
          <div className="w-max flex-auto rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="flex p-4">{children}</div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
