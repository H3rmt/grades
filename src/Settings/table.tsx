import {cols, Column} from "../components/table/table";
import {Period, Subject, Type} from "../entity";

const getTypeCols: () => cols<Type> = () => new Map<keyof Type, Column<Type>>(
		[[
			"name", {sort: true}
		], [
			"color", {sort: true}
		]]
)

const getSubjectCols: () => cols<Subject> = () => new Map<keyof Subject, Column<Subject>>(
		[[
			"name", {sort: true}
		], [
			"color", {sort: true}
		]]
)

const getPeriodCols: () => cols<Period> = () => new Map<keyof Period, Column<Period>>(
		[[
			"name", {sort: true}
		], [
			"from", {sort: true}
		], [
			"to", {sort: true}
		]]
)


// function transform(grades: Grade[], subjects: Subject[], types: Type[]): CustomType[] {
// 	return grades.map(grade => ({
// 				id: grade.id,
// 				subject: subjects.find(sub => sub.id === grade.subject)?.name || '--notfound--',
// 				type: types.find(type => type.id === grade.type)?.name || '--notfound',
// 				info: grade.info,
// 				grade: grade.grade,
// 				extra: [grade.double, grade.not_final]
// 			})
// 	)
// }


export {
	getPeriodCols,
	getSubjectCols,
	getTypeCols
	// transform
};