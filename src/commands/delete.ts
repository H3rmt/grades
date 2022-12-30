import {QueryClient} from "@tanstack/react-query";
import {deleteMutation, UseMutationOpts} from "../ts/commands";

function useDeleteGrade(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return deleteMutation(queryClient, "grade", options)
}

function useDeleteType(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return deleteMutation(queryClient, "type", options)
}

function useDeleteSubject(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return deleteMutation(queryClient, "subject", options)
}

function useDeletePeriod(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return deleteMutation(queryClient, "period", options)
}

export {
	useDeleteGrade,
	useDeleteType,
	useDeleteSubject,
	useDeletePeriod
}