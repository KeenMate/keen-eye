<template>
	<button :class="classes">
		<slot />
	</button>
</template>

<script>
export default {
	name: "SmartButton",
	props: {
		color: String,
		large: Boolean,
		small: Boolean,
		xsmall: Boolean,
		icon: Boolean
	},
	computed: {
		classes() {
			return [
				"btn",
				this.color && `btn-${this.color}`,
				this.large && "btn-lg",
				this.small && "btn-sm",
				this.xsmall && "btn-xs",
				this.icon && "btn-icon"
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.btn-xs {
	--bs-btn-padding-y: .25em;
	--bs-btn-padding-x: .25em;
	--bs-btn-font-size: 1em;
}
</style>
