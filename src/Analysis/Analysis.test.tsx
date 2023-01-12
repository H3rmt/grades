import {describe, expect, test} from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import Analysis from "./Analysis";

describe('Analysis', () => {
	test('A', async () => {
		render(<Analysis/>)
		// expect(await screen.findAllByRole("tables")).toBe(true)
	})
})