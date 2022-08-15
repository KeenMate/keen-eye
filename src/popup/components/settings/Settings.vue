<template>
	<div class="settings">
		<Tabs class="px-3">
			<TabItem
				v-for="tab in settingsTabs"
				:key="tab.code"
				:is-active="currentSettingsTab === tab.code"
				@click="currentSettingsTab = tab.code"
			>
				{{ tab.title }}
			</TabItem>
		</Tabs>

		<div class="container settings-content">
			<component
				:is="currentSettingsComponent"
				:settings="currentSettings"
				:request-info="requestInfo"
				@update-settings="$emit('update-settings', $event)"
			/>
		</div>
	</div>
</template>

<script>
import Tabs from "@/components/tab/Tabs"
import TabItem from "@/components/tab/TabItem"
import BasicSettings from "@/popup/components/settings/BasicSettings"
import AdvancedSettings from "@/popup/components/settings/AdvancedSettings"
import {markRaw} from "vue"
import {toRaw} from "@vue/reactivity"

export default {
	name: "Settings",
	components: {
		AdvancedSettings,
		BasicSettings,
		TabItem,
		Tabs
	},
	props: {
		currentSettings: {type: Object},
		requestInfo: {
			type: [Object, null],
			default: null
		}
	},
	emits: ["update-settings"],
	data() {
		return {
			settingsTabs: [
				{
					code: "basic",
					title: "Basic",
					component: markRaw(BasicSettings)
				},
				{
					code: "advanced",
					title: "Advanced",
					component: markRaw(AdvancedSettings)
				}
			],
			currentSettingsTab: "basic"
		}
	},
	computed: {
		currentSettingsComponent() {
			const component = this.settingsTabs.find(
				(x) => x.code === this.currentSettingsTab
			).component

			return toRaw(component)
		}
	}
}
</script>

<style lang="scss" scoped>
.settings {
	display: flex;
	flex-direction: column;
	gap: 1em;

	.settings-content {
		flex: 1;
		overflow: auto;
		//max-height: 35em;

		& > div {
			height: 0;
		}
	}
}
</style>
