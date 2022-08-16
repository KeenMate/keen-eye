<template>
	<div
		class="mb-3 flex-nowrap"
		style="min-width: 40%"
	>
		<div
			class="input-group"
			@keyup.esc.stop
		>
			<div class="form-control form-control-sm">
				<multiselect
					class="multiselect-sm"
					:model-value="locale"
					:options="locales"
					track-by="code"
					label="name"
					:custom-label="customLabel"
					group-values="locales"
					group-label="category"
					:multiple="false"
					@update:model-value="$emit('input', $event)"
				/>
			</div>

			<button
				class="btn btn-danger"
				@click="$emit('remove-locale')"
			>
				<i class="las la-trash" />
			</button>
		</div>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect"

export default {
	name: "LocaleInput",
	components: {Multiselect},
	props: {
		locale: Object,
		locales: {type: Array, default: () => []}
	},
	emits: ["input", "remove-locale"],
	data() {
		return {
			error: null
		}
	},
	methods: {
		customLabel(object) {
			return `[${object.code}] ${object.name}`
		}
	}
}
</script>
