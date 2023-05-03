import { CategoryType } from "@prisma/client";

export const objectKeys = <Obj extends {}>(obj: Obj): (keyof Obj)[] =>
  Object.keys(obj) as (keyof Obj)[];

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const isCategory = (input: unknown): input is CategoryType =>
  typeof input === "string" && CATEGORY_TYPES.includes(input as CategoryType);

const CATEGORY_TYPES = objectKeys(CategoryType).map((key) => CategoryType[key]);

export const dynamicClass = ({
  className,
  value,
}: {
  className: string;
  value: string;
}) => {
  return `${className}-[${value}]`;
};
