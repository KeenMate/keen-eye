<template>
	<Tabs class="mb-3">
		<ScopeItem
			v-for="scope in PopupScopes"
			:key="scope.code"
			:is-current="selectedTab === scope.code"
			@click="$emit('change-tab', scope)"
		>
			{{ scope.title }}
		</ScopeItem>
	</Tabs>
</template>

<script>
import Tabs from "@/components/tab/Tabs.vue"
import {PopupScopes} from "@/settings/settingConstants"
import ScopeItem from "@/popup/components/scopes/ScopeItem"

export default {
	name: "PopupScopesTabs",
	emits: ["change-tab"],
	components: {
		ScopeItem,
		Tabs
	},
	props: {
		selectedTab: String
	},
	data() {
		return {
			PopupScopes
		}
	}
}
</script>

<style scoped>

</style>
