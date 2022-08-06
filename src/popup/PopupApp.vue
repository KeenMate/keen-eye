<template>
	<div
		style="min-width: 500px; min-height: 600px"
		class="card"
		@keydown.esc.stop.prevent
	>
		<!-- Tabs navs -->
		<PopupScopesTabs
			:selected-tab="selectedTab"
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
						class="mb-2"
						@toggle-injection="toggleInjection"
					/>
				</div>
			</div>

			<Settings
				:current-settings="currentSettings"
				:request-info="requestInfo"
				@change="x => this.currentSettings = x"
			/>

			<div class="mb-2">
				<button class="btn btn-large btn-outline-success" @click="save">
					Save
				</button>
			</div>
			<div class="alert alert-danger" v-if="changed">
				Carefull unsaved changes!
			</div>
		</div>
	</div>
</template>

<script>
import {refreshCurrentPage} from "@/helpers/helpers"
import {toRaw} from "vue"
import {EmptySettings} from "@/settings/settingConstants"
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import {PopupScopes} from "@/settings/settingConstants"
import settingsProvider from "@/settings/settingsProvider"
import {
	getRequestInfo,
	sendSettingsChanged
} from "@/messaging/messagingProvider"
import {getCurrentTab} from "@/providers/chromeApiProvider"

import PopupScopesTabs from "@/popup/components/scopes/PopupScopesTabs"
import SettingsActions from "@/popup/components/settings/SettingsActions"
import Settings from "@/popup/components/settings/Settings"

export default {
	name: "PopupApp",
	components: {
		Settings,
		SettingsActions,
		PopupScopesTabs
	},
	data() {
		return {
			selectedSettings: EmptySettings,
			allowedOrigins: [],
			selectedTab: "origin",
			currentSettings: EmptySettings,
			requestInfo: {},
			changed: false,
			loadedTab: "origin",
			settingsTab: "basic"
		}
	},
	computed: {
		levels() {
			return PopupScopes
		}
	},
	methods: {
		async toggleInjection() {
			console.log("TOOOGGGLLLIIING")
			this.selectedSettings.inject = !this.selectedSettings.inject
			await settingsProvider.setSettings(this.selectedTab, {
				inject: this.selectedSettings.inject
			})
			sendSettingsChanged()
			console.log(this.selectedSettings)
		},
		changeTab(scope) {
			this.selectedTab = scope.code
			this.loadSelectedSettings()
		},
		async loadSettings() {
			const {
				settings: currentSettings,
				level: selectedTab
			} = await settingsProvider.getMostSpecificSettings()

			this.currentSettings = currentSettings
			this.selectedTab = selectedTab
			this.loadedTab = selectedTab

			let currentTab = await getCurrentTab()
			this.requestInfo = await getRequestInfo(currentTab.id)

			await this.loadSelectedSettings()
		},
		async loadSelectedSettings() {
			let loadedSettings = await settingsProvider.getSettings(this.selectedTab)

			//if settings arent set, use empty settings and allow saving it
			this.selectedSettings = loadedSettings || EmptySettings
			this.changed = loadedSettings

			console.debug(toRaw(this.selectedSettings))
		},
		async deleteSetting() {
			if (!confirm("Do you really want to delete this settings?"))
				return

			await settingsProvider.deleteSettings(this.selectedTab)

			await this.loadSettings()
		},
		pageRefresh() {
			if (!confirm("Refresh page"))
				return

			refreshCurrentPage()
		},
		async save() {
			console.log(toRaw(this.selectedSettings))

			// * use toraw for all nonsimple types
			await settingsProvider.setSettings(this.selectedTab, {
				inject: this.selectedSettings.inject,
				headerRules: toRaw(this.selectedSettings.headerRules),
				position: this.selectedSettings.position,
				requestsRules: toRaw(this.selectedSettings.requestsRules),
				locale: toRaw(this.selectedSettings.locale),
				transformations: toRaw(this.selectedSettings.transformations),
				localeReplace: toRaw(this.selectedSettings.localeReplace)
			})
			sendSettingsChanged()

			if (this.selectedSettings.locale) {
				this.pageRefresh()
			}
			// this.pageRefresh();
			await this.loadSelectedSettings()
		},
		copySettings() {
			copyTextToClipboard(JSON.stringify(toRaw(this.selectedSettings)))
		}
	},
	mounted() {
		setTimeout(async () => {
			await this.loadSettings()
			await this.loadSelectedSettings()
		}, 25)
	}
}
</script>
