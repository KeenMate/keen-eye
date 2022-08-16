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
	emits: ["update:model-value"],
	props: {
		id: String,
		modelValue: Boolean
	}
}
</script>

<style scoped>

</style>
