import { test, expect } from 'vitest'
import { BloxPluginMustache } from '../src/classes/BloxPluginMustache'
import { BloxContext } from 'vue-blox'

test('Mustache plugin renders simple mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()
	const context = new BloxContext()

	// When

	plugin.run({
		context: context,
		key: 'foo',
		value: '{{ message }}',
		variables: {
			message: 'Hello, world!'
		},
		buildContext: () => {
			return undefined
		}
	})

	// Then

	expect(context.props.foo).toBe('Hello, world!')

})

test('Mustache plugin renders complex mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()
	const context = new BloxContext()

	// When

	plugin.run({
		context: context,
		key: 'foo',
		value: '{{ name }} is {{ age }} years old and enjoys {{ #interests }}{{.}}, {{ /interests }}.',
		variables: {
			name: 'Adam',
			age: 32,
			interests: [
				'carpentry',
				'coding',
				'quantum physics'
			]
		},
		buildContext: () => {
			return undefined
		}
	})

	// Then

	expect(context.props.foo).toBe('Adam is 32 years old and enjoys carpentry, coding, quantum physics, .')

})

test('Mustache plugin renders self-referential mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()
	const context = new BloxContext()

	// When

	plugin.run({
		context: context,
		key: 'foo',
		value: '{{ quote }}',
		variables: {
			name: 'Adam',
			age: 32,
			summary: '{{ name }}, {{ age }}',
			message: 'Mess with the best, die like the rest.',
			quote: '{{ message }} - {{ summary }}'
		},
		buildContext: () => {
			return undefined
		}
	})

	// Then

	expect(context.props.foo).toBe('Mess with the best, die like the rest. - Adam, 32')

})

test('Mustache plugin ignores values that are not text', async () => {

	// Given

	const plugin = new BloxPluginMustache()
	const context = new BloxContext()
	context.props.foo = 1337
	
	// When

	plugin.run({
		context: context,
		key: 'foo',
		value: 'bar',
		variables: undefined,
		buildContext: () => {
			return undefined
		}
	})

	// Then

	expect(context.props.foo).toBe(1337)

})

test('Mustache plugin ignores values that do not contain double brackets', async () => {

	// Given

	const plugin = new BloxPluginMustache()
	const context = new BloxContext()
	context.props.foo = 'Welcome to the jungle'
	// When

	plugin.run({
		context: context,
		key: 'foo',
		value: 'We have fun and games',
		variables: {
			message: 'Hello, world!',
		},
		buildContext: () => {
			return undefined
		}
	})

	// Then

	expect(context.props.foo).toBe('Welcome to the jungle')

})

test('Mustache plugin throws error on invalid mustache', async () => {

	// Given

	const plugin = new BloxPluginMustache()
	const context = new BloxContext()

	// When

	let thrownError: any= undefined
	try {
		plugin.run({
			context: context,
			key: 'foo',
			value: '{{# message }}',
			variables: {
				message: '{{ foo }}',
			},
			buildContext: () => {
				return undefined
			}
		})
	} catch(error) {
		thrownError = error
	}

	// Then

	expect(thrownError?.message).toContain('The call to runMustache() for value {{# message }} threw the error:')

})
