<template>
	<div class="form-group">
		<label>Locale</label>
		<div
			class="input-group"
			@keyup.esc.stop
		>
			<multiselect
				:model-value="locale"
				:options="locales"
				track-by="code"
				label="name"
				:custom-label="customLabel"
				group-values="locales"
				group-label="category"
				class="form-control form-control-sm"
				:multiple="false"
				@update:model-value="$emit('input', $event)"
			/>
			<div class="input-group-append">
				<button
					class="btn btn-danger"
					@click="$emit('remove-locale')"
				>
					Remove
				</button>
			</div>
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
