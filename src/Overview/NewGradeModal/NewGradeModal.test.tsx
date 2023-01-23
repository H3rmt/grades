import {describe, expect, test} from 'vitest'
import {mockIPC, render, screen, sleep, trimAll} from "../../ts/testingUtils";
import {Grade, Period, Subject, Type} from "../../entity";
import {GradeModalDefaults, NoteRange} from "../../entity/config";
import {NewGradeModal} from "./NewGradeModal";
import {act, findByRole, queryByDisplayValue} from "@testing-library/react";
import dayjs from "dayjs";

describe('NewGradeModal', () => {
	test('NewGradeModal opens and renders', async () => {
		mockIPC(mockData)

		render(<NewGradeModal confirmed={false}/>)
		await act(async () => {
			await sleep(500)
		})

		expect(await screen.findByText('Subject')).to.exist
		expect(await screen.findByTitle('Subject Select')).to.exist

		expect(await screen.findByText('Type')).to.exist
		expect(await screen.findByTitle('Type Select')).to.exist

		expect(await screen.findByText('Period')).to.exist
		expect(await screen.findByTitle('Period Select')).to.exist

		expect(await screen.findByText('Grade')).to.exist
		expect(await screen.findByTitle('Grade Input')).to.exist
		expect(await screen.findByTitle('Grade Slider')).to.exist

		expect(await screen.findByText('Date')).to.exist
		expect(await screen.findByTitle('Date Picker')).to.exist

		expect(await screen.findByText('Confirmed Date')).to.exist
		expect(await screen.findByTitle('Confirmed Date Picker')).to.exist

		expect(await screen.findByText('Info')).to.exist
		expect(await screen.findByTitle('Info Input')).to.exist

		expect(await screen.findByText('Grade Weight')).to.exist
		expect(await screen.findByTitle('Grade Weight Select')).to.exist

		console.info('All Inputs rendered')
	})
	describe('Not confirmed NewGradeModal renders with default values', async () => {
		test('with default values set', async () => {
			mockIPC(mockData)

			render(<NewGradeModal confirmed={false}/>)
			await act(async () => {
				await sleep(500)
			})

			let subjectSelect = await screen.findByTitle('Subject Select')
			expect(subjectSelect).to.exist
			expect(trimAll(subjectSelect.textContent)).to.equal(mockData.subjects.find(s => s.id === mockData.gradeModalDefaults.subject_default)?.name)

			let typeSelect = await screen.findByTitle('Type Select')
			expect(typeSelect).to.exist
			expect(trimAll(typeSelect.textContent)).to.equal(mockData.types.find(t => t.id === mockData.gradeModalDefaults.type_default)?.name)

			let periodSelect = await screen.findByTitle('Period Select')
			expect(periodSelect).to.exist
			let period = mockData.periods.find(p => p.id === mockData.gradeModalDefaults.period_default)
			expect(period).to.exist
			// @ts-ignore period is not null (see line above)
			expect(trimAll(periodSelect.textContent)).to.equal(`${period.name}${period.from} - ${period.to}`)

			let gradeInput = await screen.findByTitle('Grade Input')
			expect(gradeInput).to.exist
			let gradeInputInput = queryByDisplayValue(gradeInput, mockData.gradeModalDefaults.grade_default, {})
			expect(gradeInputInput).not.to.exist
			let gradeInputInput2 = queryByDisplayValue(gradeInput, '', {})
			expect(gradeInputInput2).to.exist

			let gradeSlider = await screen.findByTitle('Grade Slider')
			expect(gradeSlider).to.exist
			let gradeSliderValue = await findByRole(gradeSlider, 'slider')
			expect(gradeSliderValue).to.exist
			expect(Number(gradeSliderValue.getAttribute('value'))).to.equal(mockData.noteRange.from)
			expect(Number(gradeSliderValue.getAttribute('min'))).to.equal(mockData.noteRange.from)
			expect(Number(gradeSliderValue.getAttribute('max'))).to.equal(mockData.noteRange.to)

			let dateInput = await screen.findByTitle('Date Picker')
			expect(dateInput).to.exist
			let dateInputInput = queryByDisplayValue(dateInput, dayjs().format("DD-MM-YYYY"), {})
			expect(dateInputInput).to.exist

			let confirmedDateInput = await screen.findByTitle('Confirmed Date Picker')
			expect(confirmedDateInput).to.exist
			let confirmedDateInputInput = queryByDisplayValue(confirmedDateInput, dayjs().format("DD-MM-YYYY"), {})
			expect(confirmedDateInputInput).not.to.exist

			let infoInput = await screen.findByTitle('Info Input')
			expect(infoInput).to.exist
			let infoInputInput = queryByDisplayValue(infoInput, '', {})
			expect(infoInputInput).to.exist

			console.info('All defaults rendered correctly for mockData and not confirmed Modal')
		})
		test('with default not values set', async () => {
			mockIPC(mockData2)

			render(<NewGradeModal confirmed={false}/>)
			await act(async () => {
				await sleep(500)
			})

			let subjectSelect = await screen.findByTitle('Subject Select')
			expect(subjectSelect).to.exist
			expect(trimAll(subjectSelect.textContent)).to.be.empty

			let typeSelect = await screen.findByTitle('Type Select')
			expect(typeSelect).to.exist
			expect(trimAll(typeSelect.textContent)).to.be.empty

			let periodSelect = await screen.findByTitle('Period Select')
			expect(periodSelect).to.exist
			expect(trimAll(periodSelect.textContent)).to.be.empty

			let gradeInput = await screen.findByTitle('Grade Input')
			expect(gradeInput).to.exist
			let gradeInputInput = queryByDisplayValue(gradeInput, mockData.gradeModalDefaults.grade_default, {})
			expect(gradeInputInput).not.to.exist
			let gradeInputInput2 = queryByDisplayValue(gradeInput, '', {})
			expect(gradeInputInput2).to.exist

			let gradeSlider = await screen.findByTitle('Grade Slider')
			expect(gradeSlider).to.exist
			let gradeSliderValue = await findByRole(gradeSlider, 'slider')
			expect(gradeSliderValue).to.exist
			expect(Number(gradeSliderValue.getAttribute('value'))).to.equal(mockData2.noteRange.from)
			expect(Number(gradeSliderValue.getAttribute('min'))).to.equal(mockData2.noteRange.from)
			expect(Number(gradeSliderValue.getAttribute('max'))).to.equal(mockData2.noteRange.to)

			let dateInput = await screen.findByTitle('Date Picker')
			expect(dateInput).to.exist
			let dateInputInput = queryByDisplayValue(dateInput, dayjs().format("DD-MM-YYYY"), {})
			expect(dateInputInput).to.exist

			let confirmedDateInput = await screen.findByTitle('Confirmed Date Picker')
			expect(confirmedDateInput).to.exist
			let confirmedDateInputInput = queryByDisplayValue(confirmedDateInput, dayjs().format("DD-MM-YYYY"), {})
			expect(confirmedDateInputInput).not.to.exist
			let confirmedDateInputInput2 = queryByDisplayValue(confirmedDateInput, '', {})
			expect(confirmedDateInputInput2).to.exist

			let infoInput = await screen.findByTitle('Info Input')
			expect(infoInput).to.exist
			let infoInputInput = queryByDisplayValue(infoInput, '', {})
			expect(infoInputInput).to.exist

			console.info('All defaults rendered correctly for mockData2 and not confirmed Modal')
		})
	})
	describe('Confirmed NewGradeModal renders with default values', async () => {
		test('with default values set', async () => {
			mockIPC(mockData)

			render(<NewGradeModal confirmed={true}/>)
			await act(async () => {
				await sleep(500)
			})

			let subjectSelect = await screen.findByTitle('Subject Select')
			expect(subjectSelect).to.exist
			expect(trimAll(subjectSelect.textContent)).to.equal(mockData.subjects.find(s => s.id === mockData.gradeModalDefaults.subject_default)?.name)

			let typeSelect = await screen.findByTitle('Type Select')
			expect(typeSelect).to.exist
			expect(trimAll(typeSelect.textContent)).to.equal(mockData.types.find(t => t.id === mockData.gradeModalDefaults.type_default)?.name)

			let periodSelect = await screen.findByTitle('Period Select')
			expect(periodSelect).to.exist
			let period = mockData.periods.find(p => p.id === mockData.gradeModalDefaults.period_default)
			expect(period).to.exist
			// @ts-ignore period is not null (see line above)
			expect(trimAll(periodSelect.textContent)).to.equal(`${period.name}${period.from} - ${period.to}`)

			let gradeInput = await screen.findByTitle('Grade Input')
			expect(gradeInput).to.exist
			let gradeInputInput = queryByDisplayValue(gradeInput, mockData.gradeModalDefaults.grade_default, {})
			expect(gradeInputInput).to.exist

			let gradeSlider = await screen.findByTitle('Grade Slider')
			expect(gradeSlider).to.exist
			let gradeSliderValue = await findByRole(gradeSlider, 'slider')
			expect(gradeSliderValue).to.exist
			expect(Number(gradeSliderValue.getAttribute('value'))).to.equal(mockData.gradeModalDefaults.grade_default)
			expect(Number(gradeSliderValue.getAttribute('min'))).to.equal(mockData.noteRange.from)
			expect(Number(gradeSliderValue.getAttribute('max'))).to.equal(mockData.noteRange.to)

			let dateInput = await screen.findByTitle('Date Picker')
			expect(dateInput).to.exist
			let dateInputInput = queryByDisplayValue(dateInput, dayjs().add(-7, "day").format("DD-MM-YYYY"), {})
			expect(dateInputInput).to.exist

			let confirmedDateInput = await screen.findByTitle('Confirmed Date Picker')
			expect(confirmedDateInput).to.exist
			let confirmedDateInputInput = queryByDisplayValue(confirmedDateInput, dayjs().format("DD-MM-YYYY"), {})
			expect(confirmedDateInputInput).to.exist

			let infoInput = await screen.findByTitle('Info Input')
			expect(infoInput).to.exist
			let infoInputInput = queryByDisplayValue(infoInput, '', {})
			expect(infoInputInput).to.exist

			console.info('All defaults rendered correctly for mockData and confirmed Modal')
		})
		test('with default not values set', async () => {
			mockIPC(mockData2)

			render(<NewGradeModal confirmed={true}/>)
			await act(async () => {
				await sleep(500)
			})

			let subjectSelect = await screen.findByTitle('Subject Select')
			expect(subjectSelect).to.exist
			expect(trimAll(subjectSelect.textContent)).to.be.empty

			let typeSelect = await screen.findByTitle('Type Select')
			expect(typeSelect).to.exist
			expect(trimAll(typeSelect.textContent)).to.be.empty

			let periodSelect = await screen.findByTitle('Period Select')
			expect(periodSelect).to.exist
			expect(trimAll(periodSelect.textContent)).to.be.empty

			let gradeInput = await screen.findByTitle('Grade Input')
			expect(gradeInput).to.exist
			let gradeInputInput = queryByDisplayValue(gradeInput, mockData2.gradeModalDefaults.grade_default, {})
			expect(gradeInputInput).to.exist

			let gradeSlider = await screen.findByTitle('Grade Slider')
			expect(gradeSlider).to.exist
			let gradeSliderValue = await findByRole(gradeSlider, 'slider')
			expect(gradeSliderValue).to.exist
			expect(Number(gradeSliderValue.getAttribute('value'))).to.equal(mockData2.gradeModalDefaults.grade_default)
			expect(Number(gradeSliderValue.getAttribute('min'))).to.equal(mockData2.noteRange.from)
			expect(Number(gradeSliderValue.getAttribute('max'))).to.equal(mockData2.noteRange.to)

			let dateInput = await screen.findByTitle('Date Picker')
			expect(dateInput).to.exist
			let dateInputInput = queryByDisplayValue(dateInput, dayjs().add(-7, "day").format("DD-MM-YYYY"), {})
			expect(dateInputInput).to.exist

			let confirmedDateInput = await screen.findByTitle('Confirmed Date Picker')
			expect(confirmedDateInput).to.exist
			let confirmedDateInputInput = queryByDisplayValue(confirmedDateInput, dayjs().format("DD-MM-YYYY"), {})
			expect(confirmedDateInputInput).to.exist

			let infoInput = await screen.findByTitle('Info Input')
			expect(infoInput).to.exist
			let infoInputInput = queryByDisplayValue(infoInput, '', {})
			expect(infoInputInput).to.exist

			console.info('All defaults rendered correctly for mockData2 and confirmed Modal')
		})
	})
})


const mockData = {
	types: [{
		id: 1, name: 'Type1', color: "#2f2f2f"
	}, {
		id: 2, name: 'Type2', color: "#ffffff"
	}],
	subjects: [{
		id: 1, name: 'Subject1', color: "#111111"
	}, {
		id: 2, name: 'Subject2', color: "#222222"
	}],
	periods: [{
		id: 1, name: 'Period1', from: "2021-01-01", to: "2021-01-02"
	}, {
		id: 2, name: 'Period2', from: "2021-01-03", to: "2021-01-04"
	}],
	noteRange: {
		from: 5, to: 15
	},
	gradeModalDefaults: {
		grade_default: 12,
		type_default: 1,
		subject_default: 2,
		period_default: 1
	} satisfies GradeModalDefaults
} satisfies {
	types: Type[],
	subjects: Subject[],
	periods: Period[],
	noteRange: NoteRange,
	gradeModalDefaults: GradeModalDefaults
}

const mockData2 = {
	...mockData,
	gradeModalDefaults: {
		grade_default: 10,
		type_default: null,
		subject_default: null,
		period_default: null
	}
} satisfies {
	types: Type[],
	subjects: Subject[],
	periods: Period[],
	noteRange: NoteRange,
	gradeModalDefaults: GradeModalDefaults
}