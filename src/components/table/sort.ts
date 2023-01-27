import {IRow, Column} from "./defs"

function comp<Type>(a: Type, b: Type, orderFn: (d: Type) => NonNullable<unknown>) {
	if (orderFn(b) < orderFn(a)) {
		return -1
	}
	if (orderFn(b) > orderFn(a)) {
		return 1
	}
	return 0
}

export type Order = 'asc' | 'desc';

export function getComparator<Type extends IRow>(order: Order, orderBy: keyof Type, orderFn?: (d: Type) => NonNullable<unknown>): (a: [number, Column<Type>], b: [number, Column<Type>]) => number {
	const fn = orderFn || ((d: Type) => d[orderBy]) as (d: Type) => NonNullable<unknown>
	return order === 'desc' ?
			(a, b) => comp(a[1].data, b[1].data, fn)
			:
			(a, b) => -comp(a[1].data, b[1].data, fn)
}

export function setSort<Type extends IRow>(property: keyof Type, order: Order, orderBy: keyof Type): [Order, keyof Type] {
	if (orderBy === property) {
		if (order === 'desc') {
			// "disable Sort"
			return ['asc', 'id']
		} else {
			return ['desc', property]
		}
	} else {
		return ['asc', property]

	}
}