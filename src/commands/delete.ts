import {QueryClient} from "@tanstack/react-query";
import {deleteMutation, UseMutationOpts} from "../ts/commands";

function useDeleteGrade(queryClient: QueryClient, options: UseMutationOpts<number> = {}) {
	return deleteMutation(queryClient, "grade", options, "grades")
}

function useDeleteType(queryClient: QueryClient, options: UseMutationOpts<number> = {}) {
	return deleteMutation(queryClient, "type", options, "types")
}

function useDeleteSubject(queryClient: QueryClient, options: UseMutationOpts<number> = {}) {
	return deleteMutation(queryClient, "subject", options, "subjects")
}

function useDeletePeriod(queryClient: QueryClient, options: UseMutationOpts<number> = {}) {
	return deleteMutation(queryClient, "period", options, "periods")
}

export {
	useDeleteGrade,
	useDeleteType,
	useDeleteSubject,
	useDeletePeriod
}