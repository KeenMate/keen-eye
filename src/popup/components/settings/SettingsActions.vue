<template>
	<div class="btn-group">
		<button
			class="btn-danger btn form-control-sm btn-sm"
			@click="deleteSetting"
		>
			Delete
		</button>
		<button
			class="btn-info btn form-control-sm btn-sm"
			@click="loadSelectedSettings"
		>
			Refresh
		</button>
		<button
			class="btn-success btn form-control-sm btn-sm"
			@click="save"
		>
			Save
		</button>
		<!--<button-->
		<!--	class="btn-muted btn form-control-sm btn-sm"-->
		<!--	@click="copySettings"-->
		<!--&gt;-->
		<!--	D-->
		<!--</button>-->
		<button
			@click="$emit('toggle-injection')"
			class="btn-primary btn form-control-sm btn-sm"
			:class="enabled ? 'btn-danger' : 'btn-success'"
		>
			{{enabled ? "Hide" : "Show"}}
		</button>
		<button
			class="btn-warning btn form-control-sm btn-sm"
			:title="selectedSettings?.position"
			@click="resetDiv"
		>
			Reset overlay position
		</button>
	</div>
</template>

<script>
import settingsProvider from "@/settings/settingsProvider"
import {EmptySettings} from "@/settings/settingConstants"
import {toRaw} from "vue/dist/vue"
import {sendSettingsChanged} from "@/messaging/messagingProvider"

export default {
	name: "SettingsActions",
	methods: {
		async deleteSetting() {
			if (!confirm("Do you really want to delete this settings?")) return
			await settingsProvider.deleteSettings(this.selectedTab)

			this.loadSettings()
		},
		async loadSelectedSettings() {
			let loadedSettings = await settingsProvider.getSettings(this.selectedTab)
			//if settings arent set, use empty settings and allow saving it
			if (!loadedSettings) {
				this.selectedSettings = EmptySettings
				this.changed = true
			} else {
				this.selectedSettings = loadedSettings
				this.changed = false
			}
			console.debug(toRaw(this.selectedSettings))
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
		}
	}
}
</script>

<style scoped>

</style>
