import {describe, expect, test, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import Overview from "./Overview";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {spy, spyOn} from 'tinyspy';

describe('Overview', () => {
	test('renders Table', async () => {
		const queryClient = new QueryClient({
			defaultOptions: {queries: {retry: 1, networkMode: 'always', refetchOnWindowFocus: false}}
		});

		render(<QueryClientProvider client={queryClient}>
			<Overview/>
		</QueryClientProvider>)

		expect(await screen.findByRole('table')).toBeDefined()
		expect(await screen.findByText('Grade')).toBeDefined()
		expect(await screen.findByText('Subject')).toBeDefined()
		expect(await screen.findByText('Type')).toBeDefined()
		expect(await screen.findByText('Date')).toBeDefined()
		expect(await screen.findByText('Confirmed')).toBeDefined()
		expect(await screen.findByText('Info')).toBeDefined()

		// screen.debug()
	})
})