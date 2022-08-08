<template>
	<div class="settings">
		<Tabs class="mb-3">
			<TabItem
				v-for="tab in settingsTabs"
				:key="tab.code"
				:is-active="currentSettingsTab === tab.code"
				@click="currentSettingsTab = tab.code"
			>
				{{ tab.title }}
			</TabItem>
		</Tabs>

		<component
			:is="currentSettingsComponent"
			:settings="currentSettings"
			:request-info="requestInfo"
			@change="$emit('change', $event)"
		/>
	</div>
</template>

<script>
import Tabs from "@/components/tabs/Tabs"
import TabItem from "@/components/tabs/TabItem"
import BasicSettings from "@/popup/components/settings/BasicSettings"
import AdvancedSettings from "@/popup/components/settings/AdvancedSettings"

export default {
	name: "Settings",
	components: {AdvancedSettings, BasicSettings, TabItem, Tabs},
	props: {
		currentSettings: Object,
		requestInfo: Object
	},
	data() {
		return {
			settingsTabs: [
				{
					code: "basic",
					title: "Basic",
					component: BasicSettings
				},
				{
					code: "advanced",
					title: "Advanced",
					component: AdvancedSettings
				}
			],
			currentSettingsTab: "basic"
		}
	},
	computed: {
		currentSettingsComponent() {
			return this.settingsTabs
				.find(x => x.code === this.currentSettingsTab)
				.component
		}
	}
}
</script>

<style scoped>

</style>
