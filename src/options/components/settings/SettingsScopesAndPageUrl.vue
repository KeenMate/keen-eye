<template>
	<div class="settings-scopes-with-page-url">
		<label>Settings for page</label>
		<div class="input-group">
			<multiselect
				:model-value="modelValue"
				:options="availablePageUrls"
				tag-placeholder="New URL"
				class="form-control form-control-sm"
				placeholder="Select page for which below settings should apply"
				open-direction="bottom"
				:max-height="500"
				:option-height="30"
				:show-labels="false"
				taggable
				@tag="setPage"
				@select="setPage"
			/>

			<!--<input-->
			<!--	:value="modelValue"-->
			<!--	type="text"-->
			<!--	class="form-control"-->
			<!--	placeholder="Enter URL for which the settings should apply"-->
			<!--	@change="$emit('update:model-value', $event.target.value)"-->
			<!--/>-->

			<SmartButton
				v-for="scope in SettingsScopes"
				:key="scope.code"
				:color="scope.code === currentScopeCode && 'primary' || 'light'"
				small
				@click="$emit('set-scope', scope.code)"
			>
				{{scope.title}}
			</SmartButton>
		</div>
	</div>
</template>

<script>
import {SettingsScopes} from "@/constants/settings"
import SmartButton from "@/components/ui/button/SmartButton"
import SettingsManager from "@/settings/settings-manager"
import Multiselect from "vue-multiselect"
import {sortBy} from "lodash"

export default {
	name: "SettingsScopesAndPageUrl",
	components: {SmartButton, Multiselect},
	props: {
		modelValue: String,
		currentScopeCode: String
	},
	emits: ["set-scope", "update:model-value"],
	data() {
		return {
			SettingsScopes,
			availablePageUrls: []
		}
	},
	mounted() {
		this.loadAvailablePageUrls()
	},
	methods: {
		setPage(page) {
			console.log("Setting page", page)
			this.$emit("update:model-value", page)
		},
		async loadAvailablePageUrls() {
			const allSettings = await SettingsManager.getAllSettings()
			console.log("All settings", allSettings)

			this.availablePageUrls = sortBy(Object.keys(allSettings).map(x => x.toLocaleLowerCase()))
		}
	}
}
</script>

<style lang="scss" scoped>
.settings-scopes-with-page-url {
	width: 100%;
}
</style>
