export const objectKeys = <Obj extends {}>(obj: Obj): (keyof Obj)[] =>
  Object.keys(obj) as (keyof Obj)[];

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const dynamicClass = ({
  className,
  value,
}: {
  className: string;
  value: string;
}) => {
  return `${className}-[${value}]`;
};
