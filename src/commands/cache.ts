import {QueryClient} from '@tanstack/react-query'
import {editMutation, query, UseMutationOpts, UseQueryOpts} from './commands'
import {Page} from '../entity'


function useEditPageInCache(queryClient: QueryClient, options: UseMutationOpts<Page> = {}) {
	return editMutation(queryClient, 'page_in_cache', options)
}

function usePageInCache(options: UseQueryOpts<Page> = {}) {
	return query('page_from_cache', options)
}

export {
	usePageInCache,
	useEditPageInCache
}