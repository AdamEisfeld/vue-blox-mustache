<script lang="ts">

import { defineComponent, reactive } from 'vue'
import { BloxComponent } from 'vue-blox'
import { BloxError } from 'vue-blox'
import { BloxPluginMustache } from '../src/classes/BloxPluginMustache'

export default defineComponent({
	name: 'App',
	components: {
		BloxComponent,
	},
	props: {},
	setup() {

		// 1. Construct variables
		
		const variables: any = reactive({
			bar: 'Adam',
			foo: 'Tom',
			baz: 'Joey',
			score: 0,
		})

		// 2. Construct view

		const view: any = {
			type: 'stack',
			'slot:children': [
				{
					type: 'button',
					'bind:message': 'foo',
					'bind:count': 'score',
				},
				{
					type: 'button',
					'message': '{{ bar }} and {{ baz }}',
					'bind:count': 'score',
				}
			]
		}

		const onError = (error: any) => {
			const bloxError = BloxError.asBloxError(error)
			if (bloxError) {
				console.log(bloxError.debugMessage)
			} else {
				console.log(error)
			}
		}

		const plugins = [
			new BloxPluginMustache()
		]

		return {
			variables,
			view,
			onError,
			plugins,
		}
	},
})
</script>

<template>
	<main>
		<BloxComponent :view="view" :variables="variables" @on:error="onError" :plugins="plugins"/>
	</main>
</template>
