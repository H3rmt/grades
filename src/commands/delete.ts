import {QueryClient, useMutation} from "@tanstack/react-query";
import {del, UseMutationOpts} from "../ts/utils";

function useDeleteGrade(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return useMutation(["grades"], async (id: number) => {
				return await del("grade", id).then(async () => {
					console.log("Deleted Grade")
					await queryClient.invalidateQueries({queryKey: ["grades"]})
				})
			},
			options
	);
}

function useDeleteType(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return useMutation(["types"], async (id: number) => {
				return await del("type", id).then(async () => {
					console.log("Deleted Type")
					await queryClient.invalidateQueries({queryKey: ["types"]})
				})
			},
			options
	);
}

function useDeleteSubject(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return useMutation(["subjects"], async (id: number) => {
				return await del("subject", id).then(async () => {
					console.log("Deleted Subject")
					await queryClient.invalidateQueries({queryKey: ["subjects"]})
				})
			},
			options
	);
}

function useDeletePeriod(queryClient: QueryClient, options: UseMutationOpts<void, number> = {}) {
	return useMutation(["periods"], async (id: number) => {
				return await del("period", id).then(async () => {
					console.log("Deleted Period")
					await queryClient.invalidateQueries({queryKey: ["periods"]})
				})
			},
			options
	);
}

export {
	useDeleteGrade,
	useDeleteType,
	useDeleteSubject,
	useDeletePeriod
}