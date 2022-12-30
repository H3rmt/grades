import {QueryClient} from "@tanstack/react-query";
import {createMutation, query, UseMutationOpts, UseQueryOpts} from "../ts/commands";
import {Grade, Page} from "../entity";


function useEditPageInCache(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return createMutation(queryClient, "page_in_cache", options)
}

function usePageInCache(options: UseQueryOpts<Page> = {}) {
	return query<Page>("page_in_cache")
}

export {
	usePageInCache,
	useEditPageInCache
}