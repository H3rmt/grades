import {describe, expect, test} from 'vitest'
import {Period} from "../entity";
import {createMatchMedia, getByRole, mockIPC, render, screen} from "../ts/testingUtils";
import userEvent from "@testing-library/user-event";
import OverviewAppBar from './OverviewAppBar';

describe('OverviewAppBar', () => {
	describe('Button', () => {
		mockIPC(mockData);

		test('renders 1000px Buttons', async () => {
			window.matchMedia = createMatchMedia("1000px");
			render(<OverviewAppBar/>)

			expect(await screen.findByText('New Confirmed Grade')).to.exist
			expect(await screen.findByText('New WIP Grade')).to.exist


			expect(await screen.queryByText('New Grade')).not.to.exist
			console.info('2 Buttons on 1000px rendered')
		})
		test('renders 600px Buttons', async () => {
			window.matchMedia = createMatchMedia("600px");
			render(<OverviewAppBar/>)

			expect(await screen.findByText('New Grade')).to.exist

			expect(await screen.queryByText('New Confirmed Grade')).not.to.exist
			expect(await screen.queryByText('New WIP Grade')).not.to.exist
			console.info('1 Button on 600px rendered')
		})
		test('renders 300px Buttons', async () => {
			window.matchMedia = createMatchMedia("300px");
			render(<OverviewAppBar/>)

			expect(await screen.queryByText('New Grade')).not.to.exist
			expect(await screen.queryByText('New Confirmed Grade')).not.to.exist
			expect(await screen.queryByText('New WIP Grade')).not.to.exist
			console.info('1 IconButton on 300px rendered')
		})
	})
	test('Renders Periods Selector', async () => {
		mockIPC(mockData);
		render(<OverviewAppBar/>)

		expect(await screen.findAllByTitle('Period Select')).to.exist
		console.info('Periods Selector rendered')
	})

	test('selects Period', async () => {
		mockIPC(mockData)
		render(<OverviewAppBar/>)

		let periodSelect = (await screen.findAllByTitle('Period Select')).at(0)
		expect(periodSelect).to.exist
		periodSelect = periodSelect as HTMLSelectElement

		const periodSelectButton = getByRole(periodSelect, "button")

		for (const period of mockData.periods) {
			await userEvent.click(periodSelectButton)
			const e = await screen.findByText(`${period.name}`, {exact: false})
			await userEvent.click(e)
			expect(periodSelect?.textContent).to.contain(period.name) // sometimes &nbsp; is added

			console.info(`Grade ${period.id} selected`)
		}
		console.info('All Periods selected')
	})
})


const mockData: {
	periods: Period[],
} = {
	periods: [{
		id: 1, name: 'Period1', from: "2021-01-01", to: "2021-01-02"
	}, {
		id: 2, name: 'Period2', from: "2022-01-01", to: "2022-01-02"
	}, {
		id: 3, name: 'TEST', from: "2023-01-01", to: "2023-01-02"
	}],
}