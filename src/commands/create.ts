import {useSnackbar} from "notistack";
import {Grade} from "../entity";
import {createMutation} from "./commands";
import {errorToast, toastMessage} from "../ts/toast";
import {useQueryClient} from "@tanstack/react-query";


export function useCreateGrade() {
	const toast = useSnackbar()
	const queryClient = useQueryClient()

	const add = createMutation<Grade>(queryClient, "grade", {
		onSuccess: () => {
			toastMessage("success", `Created Grade`, toast)
		},
		onError: (error) => {
			errorToast(`Error creating Grade`, toast, error)
		}
	}, "grades")

	return [add.mutate]
}