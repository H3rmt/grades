import {UseQueryResult} from '@tanstack/react-query'
import {query} from './commands'
import {Page} from '../entity'
import {Version} from '../entity/cache'


function usePageInCache(): [Page | null | undefined, UseQueryResult<Page, string | Error>] {
	const dataServer = query<Page>('page_from_cache', {
		onError: (error) => {
			console.warn('Error loading Page from Cache', error)
		}
	})

	return [dataServer.data, dataServer]
}

function useSkipVersion(): [Version | null | undefined, UseQueryResult<Version, string | Error>] {
	const dataServer = query<Version>('skip_version_in_cache', {
		onError: (error) => {
			console.warn('Error loading SkipVersion from Cache', error)
		}
	})

	return [dataServer.data, dataServer]
}

export {
	usePageInCache,
	useSkipVersion
}