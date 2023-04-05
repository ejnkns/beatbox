export const objectKeys = <Obj extends {}>(obj: Obj): (keyof Obj)[] =>
	Object.keys(obj) as (keyof Obj)[];
