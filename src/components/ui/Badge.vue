<template>
	<component
		:is="htmlElement"
		:class="badgeClasses"
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
		badgeClasses() {
			return [
				"badge",
				this.pill && "badge-pill",
				this.color && `badge-${this.color}` || "badge-light"
			]
		}
	}
}
</script>

<style lang="scss" scoped>
	@import "@/assets/css/badge.scss";
</style>
