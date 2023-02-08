import {describe, expect, test} from 'vitest'
import {Grade, Period, Subject, Type} from '../entity'
import {getByRole, mockIPC, render, screen} from "../ts/testingUtils"
import userEvent from "@testing-library/user-event"
import Overview from "./Overview"
import {OverviewAppBar} from "./OverviewAppBar"

describe('Overview+OverviewAppBar', () => {
	test('shows only Period Grades', async () => {
		mockIPC(mockData)
		render(<><OverviewAppBar/><Overview/></>)

		const periodSelect = await screen.findByTitle('Period Select')
		expect(periodSelect).to.exist

		const periodSelectButton = getByRole(periodSelect, "button")
		expect(periodSelectButton).to.exist

		for (const period of mockData.periods) {
			await userEvent.click(periodSelectButton)
			const e = await screen.getByRole('option', {exact: false, name: `${period.name} ${period.from} - ${period.to}`})
			await userEvent.click(e)

			// check if select has value
			expect(periodSelect?.textContent).to.contain(period.name) // sometimes &nbsp; is added
			console.info(`Period ${period.id} selected`)

			// check if grades are shown
			for (const grade of mockData.grades.filter(g => g.period === period.id)) {
				// check if grade is shown in table
				expect(screen.queryAllByText(grade.id.toString()), "Grade with same Period not found").to.have.length.greaterThanOrEqual(1)
			}
			for (const grade of mockData.grades.filter(g => g.period !== period.id)) {
				// check if grade is not shown in table
				expect(screen.queryAllByText(grade.id.toString()), "Grade with different Period found").to.have.length(0)
			}
			console.info(`Grades for Period ${period.id} rendered`)
		}
		console.info('All Periods selected and corresponding Grades rendered')

		await userEvent.click(periodSelectButton)
		const e = await screen.getByRole('option', {exact: false, name: `All`})
		await userEvent.click(e)

		// check if select has value
		expect(periodSelect?.textContent).to.contain("All") // sometimes &nbsp; is added

		// check if all grades are shown
		for (const grade of mockData.grades) {
			// check if grade is shown in table
			expect(screen.queryAllByText(grade.id.toString()), "Grade not found").to.have.length.greaterThanOrEqual(1)
		}
		console.info('All Period selected and all Grades rendered')
	})
})

const mockData: {
	grades: Grade[],
	types: Type[],
	subjects: Subject[],
	periods: Period[],
} = {
	grades: [{
		id: 1,
		grade: 1,
		subject: 1,
		type: 1,
		date: "01-01-2021",
		confirmed: "01-02-2021",
		info: 'test',
		period: 1,
		weight: "Default"
	}, {
		id: 2,
		grade: null,
		subject: 1,
		type: 2,
		date: "01-01-2021",
		confirmed: null,
		info: 'other',
		period: 2,
		weight: "Double"
	}, {
		id: 3,
		grade: 14,
		subject: 1,
		type: 1,
		date: "01-01-2021",
		confirmed: null,
		info: '',
		period: 2,
		weight: "Half"
	}],
	types: [{
		id: 1, name: 'Type1', color: "#2f2f2f"
	}, {
		id: 2, name: 'Type2', color: "#ffffff"
	}],
	subjects: [{id: 1, name: 'Subject1', color: "#111111"}],
	periods: [
		{id: 1, name: 'Period1', from: "2021-01-01", to: "2021-01-02"},
		{id: 2, name: 'Period2', from: "2022-01-01", to: "2022-01-02"}
	],
}