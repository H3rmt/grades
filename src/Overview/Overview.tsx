import {useGrades, useNoteRange, usePeriods, useSubjects, useTypes, useWeights} from "../commands/get";
import {CTable} from "../components/table/table";
import {errorToast, toastMessage} from "../ts/toast";
import NewGradeModal from "./NewGradeModal/NewGradeModal";
import {useEditGrade} from "../commands/edit";
import {useQueryClient} from "@tanstack/react-query";
import {useDeleteGrade} from "../commands/delete";
import {Grade} from '../entity';
import {useAtom} from 'jotai'
import {selectedPeriod} from "./atoms";
import {useSnackbar} from "notistack";
import {getCols} from "./table";
import {ForwardedRef, forwardRef} from "react";
import {PageRef as Ref} from "../App";

type Props = {}

const Overview = forwardRef(function (props: Props, ref: ForwardedRef<Ref>) {
	const [period] = useAtom(selectedPeriod);

	const toast = useSnackbar()
	const queryClient = useQueryClient()

	const grades = useGrades({
		onError: (error) => {
			errorToast("Error loading Grades", toast, error)
		}
	});

	const types = useTypes({
		onError: (error) => {
			errorToast("Error loading Types", toast, error)
		}
	});

	const subjects = useSubjects({
		onError: (error) => {
			errorToast("Error loading Subjects", toast, error)
		}
	});

	const weights = useWeights({
		onError: (error) => {
			errorToast("Error loading Weights", toast, error)
		}
	});

	const noteRange = useNoteRange({
		onError: (error) => {
			errorToast("Error loading noteRange", toast, error)
		}
	});

	const periods = usePeriods({
		onError: (error) => {
			errorToast("Error loading Periods", toast, error)
		}
	});

	const deleteGrade = useDeleteGrade(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Deleted Grade", toast)
		},
		onError: (error) => {
			errorToast("Error deleting grade", toast, error)
		}
	})

	const editGrade = useEditGrade(queryClient, {
		onSuccess: () => {
			toastMessage("success", "Edited Grade", toast)
		},
		onError: (error) => {
			errorToast("Error editing grade", toast, error)
		}
	})

	return <>{grades.isSuccess && subjects.isSuccess && types.isSuccess && noteRange.isSuccess && weights.isSuccess && periods.isSuccess &&
						<CTable data={grades.data.filter(grade => grade.period === Number(period) || period === "-1" || period === null )}
								  cols={getCols(noteRange.data, subjects.data, types.data, weights.data, periods.data)}
								  delete={(id) => {
									  deleteGrade.mutate(id)
								  }}
								  edit={(grade: Grade) => {
									  editGrade.mutate(grade)
								  }}
						/>

	}
	<NewGradeModal/>
	</>
})

export default Overview