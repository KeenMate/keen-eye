<template>
	<TabItem :style="this.tabStyles">
		<a
			class="nav-link"
			:class="linkClasses"
			@click="$emit('click', $event)"
		>
			<slot />
		</a>
	</TabItem>
</template>

<script>
import TabItem from "@/components/tabs/TabItem"

export default {
	name: "ScopeItem",
	components: {TabItem},
	props: {
		color: String,
		isCurrent: Boolean
	},
	computed: {
		linkClasses() {
			return {
				active: this.isCurrent,
				"font-weight-bold": this.isCurrent
			}
		},
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
