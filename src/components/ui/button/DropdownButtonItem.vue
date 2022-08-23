<template>
	<li>
		<a
v-bind="$attrs"
:class="anchorClasses"
>
			<slot />
		</a>
	</li>
</template>

<script>
export default {
	name: "DropdownButtonItem",
	inheritAttrs: false,
	props: {
		size: String,
	},
	computed: {
		anchorClasses() {
			return [
				"dropdown-item",
				this.size && `btn-${this.size}`
			]
		}
	}
}
</script>

<style scoped>

</style>
