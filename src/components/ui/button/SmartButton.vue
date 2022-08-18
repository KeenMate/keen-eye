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
		icon: Boolean
	},
	computed: {
		classes() {
			return [
				"btn",
				this.color && `btn-${this.color}`,
				this.large && "btn-lg",
				this.small && "btn-sm",
				this.icon && "btn-icon"
			]
		}
	}
}
</script>

<style scoped>

</style>
