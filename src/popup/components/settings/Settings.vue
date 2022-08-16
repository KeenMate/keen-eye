<template>
	<div class="settings">
		<div class="d-flex justify-content-between align-items-center px-3 mb-4">
			<h3 class="mb-0">
				Settings
			</h3>

			<SettingsActions
				:current-settings="currentSettings"
				@delete="$emit('delete', $event)"
				@toggle-overlay="$emit('update-settings', {...currentSettings, inject: !currentSettings?.inject})"
				@refresh-settings="$emit('refresh-settings', $event)"
				@reset-div="$emit('reset-div', $event)"
				@start-download="$emit('start-download', $event)"
				@import-settings="$emit('import-settings', $event)"
			/>
		</div>

		<Tabs class="px-3">
			<TabItem
				v-for="tab in settingsTabs"
				:key="tab.code"
				:is-active="currentSettingsTab === tab.code"
				@click="currentSettingsTab = tab.code"
			>
				{{tab.title}}
			</TabItem>
		</Tabs>

		<div class="settings-content px-3">
			<div>
				<component
					:is="currentSettingsComponent"
					:settings="currentSettings"
					:request-info="requestInfo"
					class="py-4"
					@update-settings="$emit('update-settings', $event)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import {markRaw} from "vue"
import {toRaw} from "@vue/reactivity"
import Tabs from "@/components/tab/Tabs"
import TabItem from "@/components/tab/TabItem"
import BasicSettings from "@/popup/components/settings/BasicSettings"
import AdvancedSettings from "@/popup/components/settings/AdvancedSettings"
import SettingsActions from "@/popup/components/settings/SettingsActions"

export default {
	name: "Settings",
	components: {
		SettingsActions,
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
	emits: [
		"update-settings",
		"refresh-settings",
		"reset-div",
		"start-download",
		"import-settings"
	],
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
	//gap: 1em;

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
