import {Data} from "./table";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Type extends Data, Key extends keyof Type>(
		order: Order,
		orderBy: Key,
): (
		a: { [key in Key]: number | string },
		b: { [key in Key]: number | string },
) => number {
	return order === 'desc'
			? (a, b) => descendingComparator(a, b, orderBy)
			: (a, b) => -descendingComparator(a, b, orderBy);
}

export function setSort<Type extends Data>(property: keyof Type, order: Order, orderBy: keyof Type): [Order, keyof Type] {
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