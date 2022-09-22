<template>
	<Tabs :pills="pills">
		<ScopeItem
			v-for="scope in SettingsScopes"
			:key="scope.code"
			:is-current="currentScopeCode === scope.code"
			@click="$emit('change-tab', scope)"
		>
			{{scope.title}}
		</ScopeItem>
	</Tabs>
</template>

<script>
import Tabs from "@/components/tab/Tabs.vue"
import {SettingsScopes} from "@/constants/settings"
import ScopeItem from "@/popup/components/scopes/ScopeItem"

export default {
	name: "PopupScopesTabs",
	components: {
		ScopeItem,
		Tabs
	},
	props: {
		currentScopeCode: String,
		pills: Boolean
	},
	emits: ["change-tab"],
	data() {
		return {
			SettingsScopes
		}
	}
}
</script>

<style scoped>

</style>
