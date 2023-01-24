import {useUndefinedState} from "../ts/utils";
import {errorToast, toastMessage} from "../ts/toast";
import {UseMutateFunction, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {createMutation, deleteMutation, editMutation, query, resetMutation} from "./commands";
import {Dispatch, SetStateAction} from "react";
import {Grade, Period, Subject, Type} from "../entity";
import {useSnackbar} from "notistack";

export function useEditGrades() {
	return editList<Grade>("grade", "grades", "Grades")
}

export function useEditTypes() {
	return editList<Type>("type", "types", "Types")
}

export function useEditSubjects() {
	return editList<Subject>("subject", "subjects", "Subjects")
}

export function useEditPeriods() {
	return editList<Period>("period", "periods", "Periods")
}

function editList<T>(cmd: string, key: string, name: string): [T[] | undefined, Dispatch<SetStateAction<T[] | undefined>>, UseQueryResult<T[], string | Error>, () => void, UseMutateFunction<void, string | Error, T>, (t: T) => void, (t: number) => void] {
	const queryClient = useQueryClient()
	const toast = useSnackbar()

	const [list, setList] = useUndefinedState<T[]>()

	const dataServer = query<T[]>(key, {
		onSuccess: (data) => setList(data),
		onError: (error) => {
			errorToast(`Error loading ${name}`, toast, error)
		}
	})

	const resetServer = resetMutation(queryClient, key, {
		onSuccess: () => {
			toastMessage("success", `Reset ${name}`, toast)
		},
		onError: (error) => {
			errorToast(`Error resting ${name}`, toast, error)
		}
	})

	const clear = () => {
		let old = Object.assign({}, list)
		setList([])
		resetServer.mutate()
		const undo = () => {
			setList(old)
			toastMessage("success", `Undid clear ${name}`, toast)
			closeClear()
		}
		let closeClear = toastMessage("warning", `Cleared ${name}`, toast, undo)
	}

	const add = createMutation<T>(queryClient, cmd, {
		onSuccess: () => {
			toastMessage("success", `Created ${name}`, toast)
		},
		onError: (error) => {
			errorToast(`Error creating ${name}`, toast, error)
		}
	}, key)

	const edit = editMutation<T>(queryClient, cmd, {
		onSuccess: () => {
			toastMessage("success", `Edited ${name}`, toast)
		},
		onError: (error) => {
			errorToast(`Error editing ${name}`, toast, error)
		}
	}, key)

	const remove = deleteMutation(queryClient, cmd, {
		onSuccess: () => {
			toastMessage("success", `Removed ${name}`, toast)
		},
		onError: (error) => {
			errorToast(`Error removing ${name}`, toast, error)
		}
	}, key)

	return [list, setList, dataServer, clear, add.mutate, edit.mutate, remove.mutate]
}