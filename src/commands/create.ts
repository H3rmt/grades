import {QueryClient} from "@tanstack/react-query";
import {createMutation, UseMutationOpts} from "../ts/commands";
import {Grade, Period, Subject, Type} from "../entity";

function useCreateGrade(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return createMutation(queryClient, "grade", options, "grades")
}

function useCreateType(queryClient: QueryClient, options: UseMutationOpts<void, Type> = {}) {
	return createMutation(queryClient, "type", options, "types")
}

function useCreateSubject(queryClient: QueryClient, options: UseMutationOpts<void, Subject> = {}) {
	return createMutation(queryClient, "subject", options, "subjects")
}

function useCreatePeriod(queryClient: QueryClient, options: UseMutationOpts<void, Period> = {}) {
	return createMutation(queryClient, "period", options, "periods")
}

export {
	useCreateGrade,
	useCreateType,
	useCreatePeriod,
	useCreateSubject
}