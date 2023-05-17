import {useQueryClient, UseQueryResult} from '@tanstack/react-query'
import {editMutation, query} from './commands'
import {Page} from '../entity'

function useEditPageInCache() {
	const queryClient = useQueryClient()
	return editMutation<Page>(queryClient, 'page_in_cache', {
		onError: (error) => {
			console.warn('Error saving Page from Cache', error)
		}
	})
}

function usePageInCache(): [Page | undefined, UseQueryResult<Page, string | Error>] {
	const dataServer = query<Page>('page_from_cache', {
		onError: (error) => {
			console.warn('Error loading Page from Cache', error)
		}
	})

	return [dataServer.data, dataServer]
}

export {
	usePageInCache,
	useEditPageInCache
}