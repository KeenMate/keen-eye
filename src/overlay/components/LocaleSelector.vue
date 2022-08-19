<template>
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
			@update:model-value="$emit('input', $event)"
		/>

		<SmartButton
			color="danger"
			small
			icon
			@click="$emit('remove-locale')"
		>
			<i class="las la-trash" />
		</SmartButton>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect"
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "LocaleInput",
	components: {SmartButton, Multiselect},
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
