import type { BloxContext, BloxPluginInterface } from 'vue-blox'
import * as mustache from 'mustache'

/**
 * A plugin for rendering mustache templates.
 */
class BloxPluginMustache implements BloxPluginInterface {

	run({ context, key, value, variables, buildContext }: { context: BloxContext, key: string, value: any, variables: any, buildContext: ({ view, variables }: { view: any, variables: any }) => BloxContext | undefined }) {	
		
		if (typeof value !== 'string' || !value.includes('{{') || !value.includes('}}')) {
			return
		}
		
		const result = this.runMustache(value, variables, 0, 10)
		context.setProp({
			propName: key, 
			value: result
		})

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
			throw new Error(`The call to runMustache() for value ${value} threw the error: ${error}`)
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
