<template>
	<table :class="classes">
		<thead v-if="$slots.head">
		<slot name="head" />
		</thead>
		<tbody>
		<slot />
		</tbody>
		<tfoot v-if="$slots.foot">
		<slot name="foot" />
		</tfoot>
	</table>
</template>

<script>
export default {
	name: "SmartTable",
	props: {
		condensed: Boolean,
		striped: Boolean,
		small: Boolean
	},
	computed: {
		classes() {
			return [
				"table tab",
				this.striped && "table-striped",
				this.small && "table-sm",
				this.condensed && "table-condensed"
			]
		}
	}
}
</script>

<style scoped>

</style>
