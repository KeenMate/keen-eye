<template>
	<div
		class="popup-app card"
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

			<div class="px-3">
				<SwitchInput
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
import SettingsManager from "@/settings/settings-manager"
import {getRequestInfo} from "@/messaging/messagingProvider"
import {getCurrentTab} from "@/providers/chromeApiProvider"
import PopupScopesTabs from "@/popup/components/scopes/PopupScopesTabs"
import Settings from "@/popup/components/settings/Settings"
import {downloadJSON} from "@/helpers/file-helpers"
import {parseTransformations} from "@/transformations/transformationHelper"
import SwitchInput from "@/components/form/SwitchInput"

export default {
	name: "PopupApp",
	components: {
		SwitchInput,
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
			return await SettingsManager.deleteSettings(this.currentScopeCode)
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
			const loadedSettings = await SettingsManager.getSettings(this.currentScopeCode)

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

			await SettingsManager.setSettings(this.currentScopeCode, settingsToSave)

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
			flex: 1;
		}
	}
}
</style>
