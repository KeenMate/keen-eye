<template>
	<TabItem
		:is-active="isCurrent"
		:style="tabStyles"
	>
		<slot />
	</TabItem>
</template>

<script>
import TabItem from "@/components/tab/TabItem"

export default {
	name: "ScopeItem",
	components: {TabItem},
	props: {
		color: String,
		isCurrent: Boolean
	},
	computed: {
		tabStyles() {
			return {
				"background-color": this.color
			}
		}
	}
}
</script>

<style scoped>

</style>
