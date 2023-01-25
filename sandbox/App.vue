<script lang="ts">

import { defineComponent, reactive } from 'vue'
import { BloxComponent } from 'vue-blox'
import { BloxPluginMustache } from '../src/classes/BloxPluginMustache'

import StackComponent from './components/StackComponent.vue'
import LabelComponent from './components/LabelComponent.vue'

export default defineComponent({
	name: 'App',
	components: {
		BloxComponent,
	},
	props: {},
	setup() {

		// 1. Catalog

		const catalog = {
			'stack': StackComponent,
			'label': LabelComponent
		}
		
		// 2. Construct variables
		
		const variables = reactive({
			name: 'Adam',
			age: 32,
			message: 'This plugin was created by {{ name }}'
		})

		// 3. Construct view

		const view = {
			type: 'stack',
			'slot:children': [
				{
					type: 'label',
					'text': '{{ name }} is {{ age }} years old.',
				},
				{
					type: 'label',
					'text': '{{ message }}.',
				},
			]
		}

		// 4. Construct plugins
		
		const plugins = [
			new BloxPluginMustache()
		]

		return {
			catalog,
			variables,
			view,
			plugins,
		}
	},
})
</script>

<template>
	<main style="padding: 48px; display: flex; flex-wrap: no-wrap; flex-direction: column; align-items: center; gap: 48px;">
		<img src="/logoMustache.png" width="200"/>
		<div style="padding: 24px; border-style: solid; border-color: gray; border-radius: 12px;">
			<BloxComponent :catalog="catalog" :view="view" :variables="variables" :plugins="plugins"/>
		</div>
	</main>
</template>