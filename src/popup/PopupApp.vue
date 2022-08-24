<template>
	<div
		class="popup-app"
		@keydown.esc.stop.prevent
	>
		<div class="top-nav d-flex justify-content-between pt-3">
			<div>
				<PopupScopesTabs
					:current-scope-code="currentScopeCode"
					class="px-3"
					@change-tab="changeScope"
				/>
			</div>

			<div class="d-flex align-items-center pe-3">
				<CheckboxToggle
					:model-value="overlayRecording"
					title="Toggles recording of requests for KEEN-EYE"
					on-color="success"
					off-color="danger"
					@update:model-value="onUpdateOverlayRecording"
				/>
			</div>
		</div>

		<div class="popup-content">
			<Settings
				:current-settings="currentSettings"
				:request-info="requestInfo"
				class="flex-grow-1 flex-shrink-1"
				@update-settings="updateCurrentSettings($event)"
				@toggle-overlay="updateCurrentSettings({inject: $event})"
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
// import SwitchInput from "@/components/form/SwitchInput"
import PopupScopesTabs from "@/popup/components/scopes/PopupScopesTabs"
import Settings from "@/popup/components/settings/Settings"

import {getEmptySettings} from "@/constants/settings"
import SettingsManager from "@/settings/settings-manager"
import {getRequestInfo} from "@/messaging/messagingProvider"
import {getCurrentTab} from "@/providers/chromeApiProvider"
import {downloadJSON} from "@/helpers/file-helpers"
import {parseTransformations} from "@/transformations/transformationHelper"
import {refreshCurrentPage} from "@/helpers/helpers"
import CheckboxToggle from "@/components/form/CheckboxToggle"
import {cleanseObjectOfProxies} from "@/helpers/vue-helpers"

export default {
	name: "PopupApp",
	components: {
		CheckboxToggle,
		// SwitchInput,
		Settings,
		PopupScopesTabs
	},
	data() {
		return {
			allowedOrigins: [],
			currentScopeCode: "origin",
			currentSettings: getEmptySettings(),
			overlayRecording: false,
			requestInfo: {}
		}
	},
	mounted() {
		setTimeout(async () => {
			await this.loadSettings()
			await this.loadOverlayRecording()
		}, 25)
	},
	methods: {
		async onUpdateOverlayRecording(overlayRecording) {
			await SettingsManager.setOverlayRecordingAsync(overlayRecording)

			this.overlayRecording = overlayRecording
		},
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
		changeScope(scope) {
			this.currentScopeCode = scope.code

			this.loadCurrentSettings()
		},
		async deleteCurrentSettings() {
			await SettingsManager.deleteSettings(this.currentScopeCode, true)
		},
		async loadOverlayRecording() {
			this.overlayRecording = await SettingsManager.getOverlayRecordingAsync()
		},
		async loadSettings() {
			const {settings: currentSettings, level: currentScopeCode} =
				await SettingsManager.getMostSpecificSettings()

			this.currentSettings = currentSettings
			this.currentScopeCode = currentScopeCode

			const currentTab = await getCurrentTab()
			this.requestInfo = (await getRequestInfo(currentTab.id)) ?? null

			await this.loadCurrentSettings()
		},
		async loadCurrentSettings() {
			console.log("Loading current settings", this.currentScopeCode)

			const loadedSettings = await SettingsManager.getSettings(
				this.currentScopeCode
			)

			// if settings arent set, use empty settings and allow saving it
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
		async updateCurrentSettings(newPartialSettings, notPartial = false) {
			const settings = notPartial
				? newPartialSettings
				: {...this.currentSettings, ...newPartialSettings}

			await this.saveSettings(settings)

			if (settings.locale !== undefined && this.currentSettings.locale?.code !== settings.locale?.code)
				this.refreshPage()

			this.currentSettings = settings
		},
		refreshPage() {
			if (confirm("Confirm page reload")) {
				refreshCurrentPage()
			}
		},
		async saveSettings(settings) {
			const settingsToSave = cleanseObjectOfProxies(settings)

			await SettingsManager.setSettings(
				settingsToSave,
				null,
				this.currentScopeCode,
				true
			)

			// if (settings.locale) {
			// 	refreshCurrentPage()
			// }
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

			if (settings.locale)
				this.refreshPage()

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
	}
}
</style>
