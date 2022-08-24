<template>
	<ul
		:class="classes"
		role="tablist"
	>
		<slot />
	</ul>
</template>

<script>
export default {
	name: "Tabs",
	props: {
		pills: Boolean
	},
	computed: {
		classes() {
			return [
				"nav",
				this.pills
					&& "nav-pills"
					|| "nav-tabs"
			]
		}
	}
}
</script>

<style scoped>

</style>
