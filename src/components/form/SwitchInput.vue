<template>
	<div class="form-check form-switch">
		<label
			class="form-check-label"
			:for="id"
		>
			<slot />
		</label>
		<input
			:id="id"
			:checked="modelValue"
			class="form-check-input"
			type="checkbox"
			role="switch"
			@change="$emit('update:model-value', !modelValue)"
		/>
	</div>
</template>

<script>
export default {
	name: "SwitchInput",
	props: {
		id: String,
		modelValue: Boolean
	},
	emits: ["update:model-value"]
}
</script>

<style scoped>

</style>
