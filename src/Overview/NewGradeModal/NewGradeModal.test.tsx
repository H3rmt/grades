import {describe, expect, test} from 'vitest'
import {mockIPC} from "../../setupTests";
import {render, screen} from "../../ts/testingUtils";
import {Grade, Period, Subject, Type} from "../../entity";
import {GradeModalDefaults, NoteRange} from "../../entity/config";
import NewGradeModal from "./NewGradeModal";
import {modalOpen} from "../atoms";

describe('NewGradeModal', () => {
	test('NewGradeModal opens and renders', async () => {
		mockIPC(mockData)
		modalOpen.read = () => true

		render(<NewGradeModal/>)

		expect(await screen.findByText('Subject')).to.exist
		expect(await screen.findByText('Type')).to.exist
		expect(await screen.findByText('Period')).to.exist
		expect(await screen.findByText('Grade')).to.exist
		expect(await screen.findByText('Date')).to.exist
		expect(await screen.findByText('Confirmed Date')).to.exist
		expect(await screen.findByText('Info')).to.exist
		expect(await screen.findByText('Grade Weight')).to.exist
	})
	test("NewGradeModal is closed and doesn't render", async () => {
		mockIPC(mockData)
		modalOpen.read = () => false

		render(<NewGradeModal/>)

		expect(await screen.queryByText('Subject')).not.to.exist
		expect(await screen.queryByText('Type')).not.to.exist
		expect(await screen.queryByText('Period')).not.to.exist
		expect(await screen.queryByText('Grade')).not.to.exist
		expect(await screen.queryByText('Date')).not.to.exist
		expect(await screen.queryByText('Confirmed Date')).not.to.exist
		expect(await screen.queryByText('Info')).not.to.exist
		expect(await screen.queryByText('Grade Weight')).not.to.exist
	})
})


const mockData: {
	types: Type[],
	subjects: Subject[],
	periods: Period[],
	noteRange: NoteRange,
	gradeModalDefaults: GradeModalDefaults
} = {
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
	noteRange: {from: 1, to: 15},
	gradeModalDefaults: {grade_default: 12, type_default: 1, subject_default: 2, period_default: 1}
}