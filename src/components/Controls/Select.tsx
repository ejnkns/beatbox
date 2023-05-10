import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { classNames, dynamicClass } from "~/utils/helpers";
import Image from "next/image";

export type SelectOptions<T extends string> = {
  id: number | string;
  name: T;
  icon?: string;
};

export const Select = <T extends string>({
  id,
  options,
  defaultValue,
  onChange,
  label,
}: {
  id?: string;
  options: SelectOptions<T>[];
  label?: string;
  defaultValue?: T;
  onChange?: (e: T) => void;
}) => {
  const [selected, setSelected] = useState(
    options.find(({ name }) => name === defaultValue) || options[0]
  );

  return (
    <Listbox
      value={selected}
      onChange={(value) => {
        if (onChange) onChange(value.name);
        setSelected(value);
      }}
    >
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
              {label}
            </Listbox.Label>
          )}
          <div className="relative mt-2">
            <Listbox.Button className="relative flex h-8 w-full cursor-default items-center border-2 border-black bg-indigo-200 bg-opacity-50 pr-10 text-left text-gray-900 focus:outline-none sm:text-sm sm:leading-6">
              <span className="flex items-center">
                {selected?.icon && (
                  <Image
                    src={selected.icon}
                    alt=""
                    className="h-5 w-5 flex-shrink-0"
                    width={5}
                    height={5}
                  />
                )}
                {selected?.name && (
                  <span className="ml-3 block truncate">{selected.name}</span>
                )}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-black"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto border-2 border-black bg-indigo-200 bg-opacity-20 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-md backdrop-filter focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-400 text-white" : "text-gray-100",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex w-fit items-center">
                          {option.icon && (
                            <Image
                              src={option.icon}
                              alt=""
                              className="h-5 w-5 flex-shrink-0"
                              width={5}
                              height={5}
                            />
                          )}
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {option.name}
                          </span>
                        </div>

                        {selected ? (
                          <div
                            className={classNames(
                              active ? "text-white" : "text-slate-600",
                              "absolute inset-y-0 right-0 mr-2 flex items-center"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </div>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
