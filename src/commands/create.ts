import {QueryClient, useMutation} from "@tanstack/react-query";
import {create, UseMutationOpts} from "../ts/utils";
import {Grade, Period, Subject, Type} from "../entity";

function useCreateGrade(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return useMutation(["grades"], async (grade: Grade) => {
				return await create("grade", grade).then(async () => {
					console.log("Created Grade")
					await queryClient.invalidateQueries({queryKey: ["grades"]})
				})
			},
			options
	);
}

function useCreateType(queryClient: QueryClient, options: UseMutationOpts<void, Type> = {}) {
	return useMutation(["types"], async (type: Type) => {
				return await create("type", type).then(async () => {
					console.log("Created Type")
					await queryClient.invalidateQueries({queryKey: ["types"]})
				})
			},
			options
	);
}

function useCreateSubject(queryClient: QueryClient, options: UseMutationOpts<void, Subject> = {}) {
	return useMutation(["subjects"], async (subject: Subject) => {
				return await create("subject", subject).then(async () => {
					console.log("Created Subject")
					await queryClient.invalidateQueries({queryKey: ["subjects"]})
				})
			},
			options
	);
}

function useCreatePeriod(queryClient: QueryClient, options: UseMutationOpts<void, Period> = {}) {
	return useMutation(["periods"], async (period: Period) => {
				return await create("period", period).then(async () => {
					console.log("Created Period")
					await queryClient.invalidateQueries({queryKey: ["periods"]})
				})
			},
			options
	);
}

export {
	useCreateGrade,
	useCreateType,
	useCreatePeriod,
	useCreateSubject
}