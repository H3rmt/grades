import {invoke} from '@tauri-apps/api'
import {UseQueryOptions} from '@tanstack/react-query/src/types'
import {QueryClient, useMutation, UseMutationOptions, useQuery} from '@tanstack/react-query'

function query<T>(cmd: string, options: UseQueryOpts<T> = {}) {
	return useQuery<T, Error | string>([cmd], async () => {
		return await invoke<string>('get_' + cmd + '_js').then((data) => {
			console.debug('get_' + cmd, 'success', data)
			return JSON.parse(data)
		}).catch((e) => {
			console.debug('get_' + cmd, 'fail', e)
			throw e as string | Error
		})
	}, options)
}

function editMutation<T>(queryClient: QueryClient, cmd: string, options: UseMutationOpts<T> = {}, key: string = cmd) {
	return useMutation([cmd], async (t: T) => {
		return await invoke<string>('edit_' + cmd + '_js', {json: JSON.stringify(t)}).then((data) => {
			console.debug('edit_' + cmd, 'success', t)
			return JSON.parse(data)
		}).catch((e) => {
			console.debug('edit_' + cmd, 'fail', e, t)
			throw e as string | Error
		}).then(async () => {
			console.log('Edited ' + cmd)
			await queryClient.invalidateQueries({queryKey: [key]})
		})
	},
	options)
}

function resetMutation(queryClient: QueryClient, cmd: string, options: UseMutationOpts<void> = {}, key: string = cmd) {
	return useMutation([cmd], async () => {
		return await invoke<string>('reset_' + cmd + '_js').then((data) => {
			console.debug('reset_' + cmd, 'success')
			return JSON.parse(data)
		}).catch((e) => {
			console.debug('reset_' + cmd, 'fail', e)
			throw e as string | Error
		}).then(async () => {
			console.log('Reset' + cmd)
			await queryClient.invalidateQueries({queryKey: [key]})
		})
	},
	options)
}

function createMutation<T>(queryClient: QueryClient, cmd: string, options: UseMutationOpts<T> = {}, key: string = cmd) {
	return useMutation([cmd], async (t: T) => {
		return await invoke<string>('create_' + cmd + '_js', {json: JSON.stringify(t)}).then((data) => {
			console.debug('create_' + cmd, 'success', t)
			return JSON.parse(data)
		}).catch((e) => {
			console.debug('create_' + cmd, 'fail', e, t)
			throw e as string | Error
		}).then(async () => {
			console.log('Created ' + cmd)
			await queryClient.invalidateQueries({queryKey: [key]})
		})
	},
	options)
}

function deleteMutation(queryClient: QueryClient, cmd: string, options: UseMutationOpts<number> = {}, key: string = cmd) {
	return useMutation([cmd], async (t: number) => {
		return await invoke('delete_' + cmd + '_js', {json: JSON.stringify({id: t})}).then(() => {
			console.debug('delete_' + cmd, 'success', t)
		}).catch((e) => {
			console.debug('delete_' + cmd, 'fail', e, t)
			throw e as string | Error
		}).then(async () => {
			console.log('Deleted ' + cmd)
			await queryClient.invalidateQueries({queryKey: [key]})
		})
	},
	options)
}

type UseQueryOpts<TData> =
		Omit<UseQueryOptions<TData, Error | string, TData>, 'queryKey' | 'initialData'>
		& { initialData?: TData | (() => TData) }

type UseMutationOpts<TVariables> = Omit<
		UseMutationOptions<void, Error | string, TVariables>, 'mutationFn' | 'mutationKey'>

export {
	query,
	editMutation,
	createMutation,
	deleteMutation,
	resetMutation
}

export type {
	UseQueryOpts,
	UseMutationOpts,
}