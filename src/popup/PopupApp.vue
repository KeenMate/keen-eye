<template>
	<div
		class="popup-app card"
		@keydown.esc.stop.prevent
	>
		<PopupScopesTabs
			:current-scope-code="currentScopeCode"
			@change-tab="changeScope"
		/>

		<div class="popup-content">
			<Settings
				:current-settings="currentSettings"
				:request-info="requestInfo"
				class="expand-height"
				@update-settings="updateCurrentSettings($event, true)"
				@delete="onDeleteSettings"
				@refresh-settings="onRefreshSettings"
				@reset-div="onResetDiv"
				@start-download="startDownload"
				@import-settings="importSettings"
			/>
			<!--@toggle-injection="toggleInjection"-->
		</div>
	</div>
</template>

<script>
import {toRaw, isProxy} from "vue"
import {getEmptySettings} from "@/settings/settingConstants"
import settingsProvider from "@/settings/settings-manager"
import {getRequestInfo, sendSettingsChanged} from "@/messaging/messagingProvider"
import {getCurrentTab} from "@/providers/chromeApiProvider"
import PopupScopesTabs from "@/popup/components/scopes/PopupScopesTabs"
import Settings from "@/popup/components/settings/Settings"
import {downloadJSON} from "@/helpers/file-helpers"
import {parseTransformations} from "@/transformations/transformationHelper"

export default {
	name: "PopupApp",
	components: {
		Settings,
		PopupScopesTabs
	},
	data() {
		return {
			allowedOrigins: [],
			currentScopeCode: "origin",
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
				position: {x: 0, y: 0}
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

			await settingsProvider.setSettings(this.currentScopeCode, {
				inject: this.currentSettings.inject
			})
			sendSettingsChanged()
		},
		changeScope(scope) {
			this.currentScopeCode = scope.code
			this.loadCurrentSettings()
		},
		async deleteCurrentSettings() {
			return await settingsProvider.deleteSettings(this.currentScopeCode)
		},
		async loadSettings() {
			const {settings: currentSettings, level: currentScopeCode} =
				await settingsProvider.getMostSpecificSettings()

			this.currentSettings = currentSettings
			this.currentScopeCode = currentScopeCode

			const currentTab = await getCurrentTab()
			this.requestInfo = (await getRequestInfo(currentTab.id)) ?? null

			await this.loadCurrentSettings()
		},
		async loadCurrentSettings() {
			console.log("Loading current settings", this.currentScopeCode)
			const loadedSettings = await settingsProvider.getSettings(this.currentScopeCode)

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
		//},
		async updateCurrentSettings(newSettings, notPartial = false) {
			const settings = notPartial
				? newSettings
				: {
					...this.currentSettings,
					...newSettings
				}

			// console.log(newSettings)

			this.currentSettings = settings

			await this.saveSettings(settings)
		},
		async saveSettings(settings) {
			const settingsToSave = Object.keys(settings)
				.reduce((acc, key) => {
					acc[key] = isProxy(settings[key])
						? toRaw(settings[key])
						: settings[key]
					return acc
				}, {})

			await settingsProvider.setSettings(this.currentScopeCode, settingsToSave)

			await sendSettingsChanged()

			// if (settings.locale) {
			// 	refreshCurrentPage()
			//}
		},
		// copySettings() {
		// 	copyTextToClipboard(JSON.stringify(toRaw(this.currentSettings)))
		//},
		startDownload() {
			downloadJSON(this.currentSettings, `KEEN-EYE-${this.currentScopeCode}`)
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

<style lang="scss" scoped>
.popup-app {
	display: flex;
	flex-direction: column;
	height: 100%;

	.popup-content {
		flex: 1;

		display: flex;
		flex-direction: column;

		margin-top: 1em;
		//overflow: auto;

		.expand-height {
			flex: 1
		}
	}
}
</style>
