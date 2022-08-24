<template>
	<Card>
		<template #header>Settings</template>

		<div class="actions mb-3">
			<h5>Actions</h5>

			<SmartButton color="danger" small @click="clearStorage">
				Clear storage
			</SmartButton>
		</div>

		<div class="scopes d-flex flex-column align-items-center gap-2 mb-3">
			<SettingsScopesAndPageUrl
				v-model="pageUrl"
				:current-scope-code="currentScopeCode"
				@set-scope="currentScopeCode = $event"
			/>
		</div>

		<div class="row">
			<div class="col-lg-6">
				<CustomLocalesUpload
					:custom-locales="settings?.customLocales"
					@set-custom-locales="setCustomLocales"
					@remove-custom-locales="setCustomLocales(null)"
				/>
			</div>
		</div>
	</Card>
</template>

<script>
import storageProvider from "@/settings/storageProvider"
import SmartButton from "@/components/ui/button/SmartButton"
import Card from "@/components/ui/card/Card"
import CustomLocalesUpload from "@/options/components/locale/CustomLocalesUpload"
import SettingsManager from "@/settings/settings-manager"
import SettingsScopesAndPageUrl from "@/options/components/settings/SettingsScopesAndPageUrl"
import {cleanseObjectOfProxies} from "@/helpers/vue-helpers"

export default {
	name: "Settings",
	components: {SettingsScopesAndPageUrl, CustomLocalesUpload, Card, SmartButton},
	data() {
		return {
			currentScopeCode: "page",
			pageUrl: "", // "https://getbootstrap.com/docs/5.2/components/navs-tabs/#vertical",
			settings: null
		}
	},
	watch: {
		pageUrl() {
			this.loadSettings()
		},
		currentScopeCode() {
			this.loadSettings()
		}
	},
	methods: {
		async setCustomLocales(customLocales) {
			if (!this.pageUrl)
				return

			const newSettings = {
				...this.settings,
				customLocales
			}
			console.log("Saving new settings", newSettings)
			await SettingsManager.setSettings(cleanseObjectOfProxies(newSettings), this.pageUrl, this.currentScopeCode, true)

			this.settings = newSettings
		},
		async clearStorage() {
			await storageProvider.clear()
		},
		async loadSettings(initial) {
			if (!this.pageUrl)
				return

			if (initial) {
				const {settings, level} = await SettingsManager.getMostSpecificSettings(this.pageUrl)

				this.settings = settings
				this.currentScopeCode = level
			} else
				this.settings = await SettingsManager.getSettings(this.currentScopeCode, this.pageUrl)

			console.log("After load settings", this.settings)
		}
	},
	mounted() {
		this.loadSettings(true)
	}
}
</script>

<style scoped>

</style>
