import {expect, test} from 'vitest'
import {capitalizeFirstLetter, map, nextFree, randColor} from './utils'

test('capitalizeFirstLetter', () => {
	expect(capitalizeFirstLetter('test')).to.equal('Test')
})

test('map', () => {
	expect(map(5, 0, 10, 0, 100)).to.equal(50)
	expect(map(5, 0, 5, 0, 100)).to.equal(100)
	expect(map(0, 0, 10, 0, 100)).to.equal(0)
})

test('nextFree', () => {
	expect(nextFree(['test', 'test 1', 'test 2'], 'test')).to.equal('test 3')
	expect(nextFree(['grade 1', 'grade 2'], 'grade')).to.equal('grade')
})

test('randColor', () => {
	expect(randColor()).to.match(/^#[0-9a-f]{6}$/)
})
