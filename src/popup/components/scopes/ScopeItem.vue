<template>
  <TabItem
	  :is-active="isCurrent"
	  :style="tabStyles"
	  @click="$emit('click', $event)"
  >
	  <slot />
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
