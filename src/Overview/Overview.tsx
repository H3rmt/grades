import {useNoteRange, usePeriods, useSubjects, useTypes, useWeights} from "../commands/get";
import {CTable} from "../components/table/table";
import {useAtom} from 'jotai'
import {selectedPeriod} from "./atoms";
import {getCols} from "./table";
import {ForwardedRef, forwardRef} from "react";
import {PageRef as Ref} from "../App";
import {useEditGrades} from "../commands/editList";
import ReactQueryData from "../components/ReactQueryData/ReactQueryData";
import {loadingSpinner} from "../components/ReactQueryData/loadings";
import NewGradeModal from "./NewGradeModal/NewGradeModal";

type Props = {}

const Overview = forwardRef(function (props: Props, ref: ForwardedRef<Ref>) {
	const [period] = useAtom(selectedPeriod);

	const [grades, , gradesS, , addGrade, editGrade, removeGrade] = useEditGrades();

	const [types, , typesS] = useTypes();

	const [subjects, , subjectsS] = useSubjects();

	const [weights, , weightsS] = useWeights();

	const [noteRange, , noteRangeS] = useNoteRange();

	const [periods, , periodsS] = usePeriods();

	return <>
		<ReactQueryData query={gradesS} data={grades} display={(grades) =>
				<ReactQueryData query={noteRangeS} data={noteRange} display={(noteRange) =>
						<ReactQueryData query={subjectsS} data={subjects} display={(subjects) =>
								<ReactQueryData query={typesS} data={types} display={(types) =>
										<ReactQueryData query={weightsS} data={weights} display={(weights) =>
												<ReactQueryData query={periodsS} data={periods} display={(periods) =>
														<CTable
																data={grades.filter(grade => grade.period === Number(period) || period === "-1" && period !== null)}
																cols={getCols(noteRange, subjects, types, weights, periods)}
																delete={removeGrade}
																edit={editGrade}
														/>
												} loading={loadingSpinner}/>
										} loading={loadingSpinner}/>
								} loading={loadingSpinner}/>
						} loading={loadingSpinner}/>
				} loading={loadingSpinner}/>
		} loading={loadingSpinner}/>
		<NewGradeModal/>
	</>
})

export default Overview