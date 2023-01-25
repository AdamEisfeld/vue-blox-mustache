import * as Blox from 'vue-blox'
import * as mustache from 'mustache'

/**
 * A plugin for rendering mustache templates.
 */
class BloxPluginMustache implements Blox.BloxPluginInterface {

	run(key: string, value: any, variables: any, setProp: (key: string, value: any) => void, setSlot: (slotName: string, views: any[]) => void ): { key: string, value: any } {
		const result = this.runMustache(value, variables, 0, 10)
		setProp(key, result)
		return {
			key,
			value: result
		}
	}

	runMustache(value: any, variables: Record<string, any>, steps: number = 0, maxSteps: number = 10): any {

		if (typeof value !== 'string' || !value.includes('{{')) {
			// This definitely isn't a mustache entry, exit early
			return value
		}

		try {
			let unwrapped = mustache.render(value, variables)
			if (unwrapped.includes('{{') && steps < 10) {
				unwrapped = this.runMustache(unwrapped, variables, steps + 1)
			}
			return unwrapped
		} catch(error) {
			throw new Blox.BloxError(
				'Mustache parsing failed.',
				`The call to runMustache() for value ${value} threw the error: ${error}`,
				undefined
			)
		}

	}

}

function getPluginMustache(): BloxPluginMustache {
	return new BloxPluginMustache()
}

export {
	BloxPluginMustache,
	getPluginMustache
}
