import {describe, test} from 'vitest'
import {act, render} from '@testing-library/react'
import Component from "./Analysis"
import {sleep} from "../ts/testingUtils"

describe('Analysis', () => {
	test('A', async () => {
		render(<Component/>)

		await act(async () => {
			await sleep(500)
		})
	})
})