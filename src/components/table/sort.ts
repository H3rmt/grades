import {IRow, Column} from "./defs";

function comp<Type>(a: Type, b: Type, orderBy: keyof Type) {
	// debugger
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Type extends IRow>(order: Order, orderBy: keyof Type): (a: Column<Type>, b: Column<Type>) => number {
	return order === 'desc' ? (a, b) => comp(a.data, b.data, orderBy) : (a, b) => -comp(a.data, b.data, orderBy);
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