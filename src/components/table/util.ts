import {IRow, RowD} from "./defs";

function createData<Data extends IRow>(data: Data[]): RowD<Data>[] {
	return data.map((row) => {
		return {
			data: row,
			edit: false,
			temp: {...row},
		}
	})
}

export {
	createData
}