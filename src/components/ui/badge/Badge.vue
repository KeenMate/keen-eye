<template>
	<component
		:is="htmlElement"
		:class="classes"
		:href="href"
	>
		<slot />
	</component>
</template>

<script>
export default {
	name: "Badge",
	props: {
		pill: Boolean,
		href: [String, Boolean],
		color: String
	},
	computed: {
		htmlElement() {
			return this.href
				&& "a"
				|| "span"
		},
		classes() {
			return [
				"badge",
				this.pill && "rounded-pill",
				this.color && `text-bg-${this.color}`
			]
		}
	}
}
</script>

<style lang="scss" scoped>
	@import "@/assets/css/badge.scss";
</style>
