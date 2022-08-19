<template>
	<div class="form-check form-switch d-flex align-items-center justify-content-between gap-2 mb-0">
		<input
			:id="id"
			:checked="modelValue"
			:class="classes"
			type="checkbox"
			role="switch"
			@input.stop.prevent
			@change.stop.prevent="onChange"
		/>
		<label
			v-if="$slots.default"
			class="form-check-label"
			:for="id"
		>
			<slot />
		</label>
	</div>
</template>

<script>
export default {
	name: "SwitchInput",
	props: {
		id: String,
		modelValue: Boolean,
		onColor: String,
		offColor: String
	},
	emits: ["update:model-value"],
	computed: {
		classes() {
			console.log("Getting classes for input", this.modelValue, this.offColor, this.onColor)
			return [
				"form-check-input",
				(this.onColor || this.offColor)
				&& this.modelValue
					? (this.onColor && `bg-${this.onColor}` || "bg-primary")
					: (this.offColor && `bg-${this.offColor}`)
			]
		}
	},
	methods: {
		onChange(event) {
			event.target.checked = !event.target.checked

			this.$emit("update:model-value", !this.modelValue)
		}
	}
}
</script>

<style lang="scss" scoped>
.form-check-input {
	&:not(:checked) {
		background-color: #fff;
	}
}
</style>
