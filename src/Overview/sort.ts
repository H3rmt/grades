import {Grade} from "../entity/grade";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
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

function setSort(property: keyof Grade, order: Order, orderBy: keyof Grade): [Order, keyof Grade] {
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

export {
	getComparator,
	setSort
};
export type {
	Order
};
