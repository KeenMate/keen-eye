<template>
	<div
		class="popup-app card"
		@keydown.esc.stop.prevent
	>
		<!-- Tabs navs -->
		<PopupScopesTabs
			:selected-tab="currentTab"
			@change-tab="changeTab"
		/>
		<!-- Tabs navs -->
		<div class="mx-2 mb-2">
			<div class="row justify-content-between">
				<div class="col-auto">
					<h3>Settings</h3>
				</div>
				<div class="col-auto">
					<SettingsActions
						:current-settings="currentSettings"
						@delete="onDeleteSettings"
						@toggle-injection="toggleInjection"
						@refresh-settings="onRefreshSettings"
						@reset-div="onResetDiv"
						@start-download="startDownload"
						@import-settings="importSettings"
					/>
				</div>
			</div>

			<Settings
				:current-settings="currentSettings"
				:request-info="requestInfo"
				@update-settings="updateCurrentSettings($event, true)"
			/>
		</div>
	</div>
</template>

<script>
import { refreshCurrentPage } from "@/helpers/helpers"
import { getEmptySettings } from "@/settings/settingConstants"
import { copyTextToClipboard } from "@/helpers/clipboardHelper"
import settingsProvider from "@/settings/settings-manager"
import {
	getRequestInfo,
	sendSettingsChanged
} from "@/messaging/messagingProvider"
import { getCurrentTab } from "@/providers/chromeApiProvider"
import PopupScopesTabs from "@/popup/components/scopes/PopupScopesTabs"
import SettingsActions from "@/popup/components/settings/SettingsActions"
import Settings from "@/popup/components/settings/Settings"
import { toRaw } from "@vue/reactivity"
import { downloadJSON } from "@/helpers/file-helpers"
import { parseTransformations } from "@/transformations/transformationHelper"

export default {
	name: "PopupApp",
	components: {
		Settings,
		SettingsActions,
		PopupScopesTabs
	},
	data() {
		return {
			allowedOrigins: [],
			currentTab: "origin",
			currentSettings: getEmptySettings(),
			requestInfo: {}
		}
	},
	mounted() {
		setTimeout(async () => {
			await this.loadSettings()
		}, 25)
	},
	methods: {
		onResetDiv() {
			this.updateCurrentSettings({
				position: { x: 0, y: 0 }
			})
		},
		async onDeleteSettings() {
			await this.deleteCurrentSettings()

			// await this.loadSettings()
			this.currentSettings = getEmptySettings()
		},
		onRefreshSettings() {
			this.loadCurrentSettings()
		},
		async toggleInjection() {
			this.currentSettings.inject = !this.currentSettings.inject

			await settingsProvider.setSettings(this.currentTab, {
				inject: this.currentSettings.inject
			})
			sendSettingsChanged()
		},
		changeTab(scope) {
			this.currentTab = scope.code
			this.loadCurrentSettings()
		},
		async deleteCurrentSettings() {
			return await settingsProvider.deleteSettings(this.currentTab)
		},
		async loadSettings() {
			const { settings: currentSettings, level: selectedTab } =
				await settingsProvider.getMostSpecificSettings()

			this.currentSettings = currentSettings
			this.currentTab = selectedTab

			const currentTab = await getCurrentTab()
			this.requestInfo = (await getRequestInfo(currentTab.id)) ?? null

			await this.loadCurrentSettings()
		},
		async loadCurrentSettings() {
			console.log("Loading current settings", this.currentTab)
			const loadedSettings = await settingsProvider.getSettings(this.currentTab)

			console.log("loaded settings", loadedSettings)

			//if settings arent set, use empty settings and allow saving it
			this.currentSettings = loadedSettings || getEmptySettings()

			console.debug("Current settings", toRaw(this.currentSettings))
		},
		// async deleteSetting() {
		// 	if (!confirm("Do you really want to delete this settings?"))
		// 		return
		//
		// 	await settingsProvider.deleteSettings(this.currentTab)
		//
		// 	await this.loadSettings()
		// },
		async updateCurrentSettings(newSettings, notPartial = false) {
			const settings = (notPartial && newSettings) || {
				...this.currentSettings,
				...newSettings
			}

			console.log(newSettings)

			this.currentSettings = settings

			await this.saveSettings(settings)
		},
		async saveSettings(settings) {
			// * use toraw for all nonsimple types
			await settingsProvider.setSettings(this.currentTab, {
				inject: settings.inject,
				headerRules: toRaw(settings.headerRules),
				position: settings.position,
				requestsRules: toRaw(settings.requestsRules),
				locale: toRaw(settings.locale),
				transformations: toRaw(settings.transformations),
				localeReplace: toRaw(settings.localeReplace)
			})

			sendSettingsChanged()

			// if (settings.locale) {
			// 	refreshCurrentPage()
			// }
		},
		copySettings() {
			copyTextToClipboard(JSON.stringify(toRaw(this.currentSettings)))
		},
		startDownload() {
			downloadJSON(this.currentSettings, `(KEEN-EYE)-${this.currentTab}`)
		},
		async importSettings(settings) {
			parseTransformations(settings)

			console.log("parsed imported transformations", settings)

			await this.saveSettings(settings)

			this.currentSettings = settings
		}
	}
}
</script>

<style lang="scss">
.popup-app {
	min-width: 500px;
	min-height: 600px;
}
</style>
