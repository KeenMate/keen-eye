<template>
	<li class="nav-item" role="tab">
		<a
			class="nav-link"
			:class="linkClasses"
			@click="$emit('click', $event)"
		>
			<slot />
		</a>
	</li>
</template>

<script>
export default {
	name: "TabItem",
	props: {
		isActive: Boolean
	},
	computed: {
		linkClasses() {
			return {
				active: this.isActive
			}
		}
	}
}
</script>

<style scoped>

</style>
