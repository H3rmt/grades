import {cols, format} from "../components/table/table";
import {Period, Subject, Type} from "../entity";

const getTypeCols: () => cols<Type> = () => new Map<keyof Type, format<Type> | undefined>(
		[[
			"name", undefined
		], [
			"color", undefined
		]]
)

const getSubjectCols: () => cols<Subject> = () => new Map<keyof Subject, format<Subject> | undefined>(
		[[
			"name", undefined
		], [
			"color", undefined
		]]
)

const getPeriodCols: () => cols<Period> = () => new Map<keyof Period, format<Period> | undefined>(
		[[
			"name", undefined
		], [
			"from", undefined
		], [
			"to", undefined
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