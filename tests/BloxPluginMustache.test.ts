import { test, expect } from 'vitest'
import { BloxPluginMustache } from '../src/classes/BloxPluginMustache'
import type { BloxError } from 'vue-blox'

test('Mustache plugin renders simple mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()

	const computedProps: Record<string, any> = {}
	const computedSlots: Record<string, any[]> = {}
	
	const setProp = (propName: string, value: any) => {
		if (value) {
			computedProps[propName] = value
		} else {
			delete computedProps[propName]
		}
	}

	const setSlot = (slotName: string, views: any[]) => {
		computedSlots[slotName] = views
	}

	// When

	plugin.run('foo', '{{ message }}', {
		message: 'Hello, world!'
	}, setProp, setSlot)

	// Then

	expect(computedProps.foo).toBe('Hello, world!')

})

test('Mustache plugin renders complex mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()

	const computedProps: Record<string, any> = {}
	const computedSlots: Record<string, any[]> = {}
	
	const setProp = (propName: string, value: any) => {
		if (value) {
			computedProps[propName] = value
		} else {
			delete computedProps[propName]
		}
	}

	const setSlot = (slotName: string, views: any[]) => {
		computedSlots[slotName] = views
	}

	// When

	plugin.run('foo', '{{ name }} is {{ age }} years old and enjoys {{ #interests }}{{.}}, {{ /interests }}.', {
		name: 'Adam',
		age: 32,
		interests: [
			'carpentry',
			'coding',
			'quantum physics'
		]
	}, setProp, setSlot)

	// Then

	expect(computedProps.foo).toBe('Adam is 32 years old and enjoys carpentry, coding, quantum physics, .')

})

test('Mustache plugin renders self-referential mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()

	const computedProps: Record<string, any> = {}
	const computedSlots: Record<string, any[]> = {}
	
	const setProp = (propName: string, value: any) => {
		if (value) {
			computedProps[propName] = value
		} else {
			delete computedProps[propName]
		}
	}

	const setSlot = (slotName: string, views: any[]) => {
		computedSlots[slotName] = views
	}

	// When

	plugin.run('foo', '{{{ quote }}}', {
		name: 'Adam',
		age: 32,
		summary: '{{ name }}, {{ age }}',
		message: 'Mess with the best, die like the rest.',
		quote: '"{{ message }}" - {{ summary }}'
	}, setProp, setSlot)

	// Then

	expect(computedProps.foo).toBe('"Mess with the best, die like the rest." - Adam, 32')

})

test('Mustache plugin ignores values that are not text', async () => {

	// Given

	const plugin = new BloxPluginMustache()

	const computedProps: Record<string, any> = {}
	const computedSlots: Record<string, any[]> = {}
	
	const setProp = (propName: string, value: any) => {
		if (value) {
			computedProps[propName] = value
		} else {
			delete computedProps[propName]
		}
	}

	const setSlot = (slotName: string, views: any[]) => {
		computedSlots[slotName] = views
	}

	// When

	plugin.run('foo', 1337, {
		message: 'Hello, world!',
	}, setProp, setSlot)

	// Then

	expect(computedProps.foo).toBe(1337)

})

test('Mustache plugin ignores values that do not contain double brackets', async () => {

	// Given

	const plugin = new BloxPluginMustache()

	const computedProps: Record<string, any> = {}
	const computedSlots: Record<string, any[]> = {}
	
	const setProp = (propName: string, value: any) => {
		if (value) {
			computedProps[propName] = value
		} else {
			delete computedProps[propName]
		}
	}

	const setSlot = (slotName: string, views: any[]) => {
		computedSlots[slotName] = views
	}

	// When

	plugin.run('foo', 'Welcome to the jungle', {
		message: 'Hello, world!',
	}, setProp, setSlot)

	// Then

	expect(computedProps.foo).toBe('Welcome to the jungle')

})

test('Mustache plugin throws error on invalid mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()

	const computedProps: Record<string, any> = {}
	const computedSlots: Record<string, any[]> = {}
	
	const setProp = (propName: string, value: any) => {
		if (value) {
			computedProps[propName] = value
		} else {
			delete computedProps[propName]
		}
	}

	const setSlot = (slotName: string, views: any[]) => {
		computedSlots[slotName] = views
	}

	// When

	let thrownError: BloxError | undefined = undefined
	try {
		plugin.run('foo', '{{# message }}', {
			message: '{{ foo }}',
		}, setProp, setSlot)
	} catch(error) {
		thrownError = error as BloxError
	}

	// Then

	expect(thrownError?.message).toBe('Mustache parsing failed.')
	expect(thrownError?.debugMessage).toContain('The call to runMustache() for value {{# message }} threw the error:')

})
