import {describe, expect, test} from 'vitest'
import {OverviewAppBar} from './OverviewAppBar';
import {mockIPC} from "../setupTests";
import {Period} from "../entity";
import {createMatchMedia, getByRole, render, screen} from "../ts/testingUtils";
import userEvent from "@testing-library/user-event";

describe('OverviewAppBar', () => {
	describe('Button', () => {
		mockIPC(mockData);

		test('renders 1000px Buttons', async () => {
			window.matchMedia = createMatchMedia("1000px");
			render(<OverviewAppBar/>)

			expect(await screen.findByText('New Confirmed Grade')).to.exist
			expect(await screen.findByText('New WIP Grade')).to.exist
		})
		test('renders 600px Buttons', async () => {
			window.matchMedia = createMatchMedia("600px");
			render(<OverviewAppBar/>)

			expect(await screen.findByText('New Grade')).to.exist

		})
		test('renders 300px Buttons', async () => {
			window.matchMedia = createMatchMedia("300px");
			render(<OverviewAppBar/>)

			expect(await screen.findByTestId('AddIcon')).to.exist
		})
	})
	test('Renders Periods Selector', async () => {
		mockIPC(mockData);
		render(<OverviewAppBar/>)

		expect(await screen.findAllByTitle('Periods')).to.exist
	})

	test('selects Period', async () => {
		mockIPC(mockData)
		render(<OverviewAppBar/>)

		let periodSelect = (await screen.findAllByTitle('Periods')).at(0)
		expect(periodSelect).to.exist
		periodSelect = periodSelect as HTMLSelectElement

		const periodSelectButton = getByRole(periodSelect, "button")

		for (const period of mockData.periods) {
			await userEvent.click(periodSelectButton)
			const e = await screen.findByText(`${period.name}`, {exact: false})
			await userEvent.click(e)
			expect(periodSelect?.textContent).to.contain(period.name) // sometimes &nbsp; is added
		}
	})
})


const mockData: {
	periods: Period[],
} = {
	periods: [{id: 1, name: 'Period1', from: "2021-01-01", to: "2021-01-02"}, {
		id: 2,
		name: 'Period2',
		from: "2022-01-01",
		to: "2022-01-02"
	}],
}