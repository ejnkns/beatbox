import { ComponentProps, Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";

export const Hideable = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<{
  isOpen: boolean;
  onClose?: () => void;
}>) => (
  <Transition.Root appear show={isOpen} as={Fragment}>
    <div className="flex min-h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all ">
          {children}
        </div>
      </Transition.Child>
    </div>
  </Transition.Root>
);
