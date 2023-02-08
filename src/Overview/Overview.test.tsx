import {describe, expect, test} from 'vitest'
import Component from "./Overview"
import {Grade, Period, Subject, Type} from '../entity'
import {mockIPC, render, rgbStringToHex, screen, sleep} from "../ts/testingUtils"
import {act} from "@testing-library/react"
import {selectedPeriod} from "./atoms"

describe('Overview', () => {
	test('renders Table Columns', async () => {
		mockIPC(mockData)
		render(<Component/>)

		expect(await screen.findByRole('table')).to.exist
		expect(await screen.findByRole('columnheader', {exact: false, name: 'Grade'})).to.exist
		expect(await screen.findByRole('columnheader', {exact: false, name: 'Subject'})).to.exist
		expect(await screen.findByRole('columnheader', {exact: false, name: 'Type'})).to.exist
		expect(await screen.findByRole('columnheader', {exact: false, name: 'Date'})).to.exist
		expect(await screen.findByRole('columnheader', {exact: false, name: 'Confirmed'})).to.exist
		expect(await screen.findByRole('columnheader', {exact: false, name: 'Info'})).to.exist
		// removed Header, can still be edited and viewed in edit dialog
		// expect(await screen.findByRole('columnheader', {exact: false, name: 'Weight'})).to.exist
		console.info('Table and all Table columns rendered')
	})

	test('Table renders no Grades', async () => {
		mockIPC(mockData)

		render(<Component/>, {atoms: [[selectedPeriod, null]]})
		await act(async () => {
			await sleep(500)
		})

		for (const grade of mockData.grades) {
			expect(await screen.queryAllByText(grade.id), "GradeID not found on Screen").to.be.empty
		}

		console.info('Table and all Table columns rendered')
	})
	test('Table renders Grades', async () => {
		mockIPC(mockData)

		render(<Component/>, {atoms: [[selectedPeriod, "-1"]]})
		await act(async () => {
			await sleep(500)
		})

		expect(await screen.findByTitle('OverviewTable'), "Table not rendered").to.exist

		for (const grade of mockData.grades) {
			expect(await screen.queryAllByText(grade.id), `GradeID ${grade.id} not found on Screen`).length.greaterThanOrEqual(1)

			expect(await screen.queryAllByText(grade.grade?.toString() ?? ''), "Grade not found on Screen").length.greaterThanOrEqual(1)

			const subject = mockData.subjects.find(s => s.id === grade.subject)
			expect(subject, "Subject not found").to.exist
			// @ts-ignore - subject is not null (line above)
			const subjectScreen = await screen.findAllByText(subject.name)
			expect(subjectScreen, "Subject not found on Screen").length.greaterThanOrEqual(1)
			// @ts-ignore - subject list > 0 (line above)
			expect(rgbStringToHex(getComputedStyle(subjectScreen.at(0)).color), "Subject color not found on Screen").to.equal(subject.color)

			const type = mockData.types.find(t => t.id === grade.type)
			expect(type, "Type not found").to.exist
			// @ts-ignore - type is not null (line above)
			const typeScreen = await screen.findAllByText(type.name)
			expect(typeScreen, "Type not found on Screen").length.greaterThanOrEqual(1)
			// @ts-ignore - type list > 0 (line above)
			expect(rgbStringToHex(getComputedStyle(typeScreen.at(0)).color), "Type color not found on Screen").to.equal(type.color)

			const dateScreen = await screen.findAllByText(grade.date)
			expect(dateScreen, "Date not found on Screen").length.greaterThanOrEqual(1)

			const confirmedScreen = await screen.findAllByText(grade.confirmed ?? '')
			expect(confirmedScreen, "Confirmed not found on Screen").length.greaterThanOrEqual(1)

			const infoScreen = await screen.findAllByText(grade.info)
			expect(infoScreen, "Info not found on Screen").length.greaterThanOrEqual(1)

			const weightScreen = await screen.findAllByText(grade.weight)
			expect(weightScreen, "Weight not found on Screen").length.greaterThanOrEqual(1)

			console.info(`Grade ${grade.id} rendered`)
		}
		console.info('All Grades rendered on table')
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
		period: 1,
		weight: "Half"
	}],
	types: [{
		id: 1, name: 'Type1', color: "#2f2f2f"
	}, {
		id: 2, name: 'Type2', color: "#ffffff"
	}],
	subjects: [{
		id: 1, name: 'Subject1', color: "#111111"
	}],
	periods: [{
		id: 1, name: 'Period1', from: "2021-01-01", to: "2021-01-02"
	}],
}