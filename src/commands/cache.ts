import {QueryClient} from "@tanstack/react-query";
import {editMutation, query, UseMutationOpts, UseQueryOpts} from "../ts/commands";
import {Grade, Page} from "../entity";


function useEditPageInCache(queryClient: QueryClient, options: UseMutationOpts<void, Grade> = {}) {
	return editMutation(queryClient, "page_in_cache", options)
}

function usePageInCache(options: UseQueryOpts<Page> = {}) {
	return query<Page>("page_in_cache", options)
}

export {
	usePageInCache,
	useEditPageInCache
}