<template>
	<div
		class="checkbox-toggle"
		role="checkbox"
		@keydown="onToggle"
		@click.stop="onToggle"
		tabindex="0"
		:aria-checked="modelValue?.toString()"
	>
		<div
			class="checkbox-slide bg-light"
			:class="classes"
		>
			<div
				class="checkbox-switch"
				:class="switchClasses"
			/>
		</div>
		<div
			v-if="labels"
			class="checkbox-label"
		>
			<slot v-if="!granulatedLabels" />
			<slot v-else-if="modelValue" name="checked" />
			<slot v-else name="unchecked" />
		</div>
	</div>
</template>

<script>
export default {
	name: "CheckboxToggle",
	emits: ["update:model-value"],
	props: {
		modelValue: Boolean,
		disabled: Boolean,
		onColor: {
			type: String,
			default: "primary"
		},
		offColor: {
			type: String,
			default: "secondary"
		}
	},
	computed: {
		granulatedLabels() {
			return this.$slots.checked || this.$slots.unchecked
		},
		labels() {
			return this.$slots.default || this.granulatedLabels
		},
		classes() {
			return [
				this.modelValue
					&& "checked"
					|| "unchecked",
				this.disabled && "disabled",
			]
		},
		switchClasses() {
			return [
				this.modelValue
					&& `bg-${this.onColor}`
					|| `bg-${this.offColor}`
			]
		}
	},
	methods: {
		onToggle(event) {
			if (this.disabled || event.key === "Tab") { // not if disabled or tab is pressed
				event.stopImmediatePropagation()
				event.preventDefault()
				return
			}

			this.$emit("update:model-value", !this.modelValue)
		}
	}
}
</script>

<style lang="scss" scoped>
$transition-duration: 100ms;
$total-width: 3em;
$toggle-width: $total-width / 2;
$toggle-height: $total-width / 2;

.checkbox-toggle {
	display: flex;
	align-items: center;

	.checkbox-slide {
		width: $total-width;
		padding: 0;
		margin: 0;
		border-radius: .25em;
		cursor: pointer;

		transition: all $transition-duration;

		&.checked {
			.checkbox-switch {
				transform: translateX($toggle-width);
				transition: all $transition-duration;
			}
		}

		&.disabled {
			cursor: not-allowed;
			background: #e0e0e0;

			.checkbox-switch {
				cursor: not-allowed;
				background: #8da3ba;
			}
		}

		.checkbox-switch {
			padding: 0;
			margin: 0;
			width: $toggle-width;
			height: $toggle-height;
			border-radius: 0.25em;
			background: #384a5d;
			cursor: pointer;

			transition: all $transition-duration;
		}
	}

	.checkbox-label {
		margin-left: 0.5em;
	}
}
</style>
