<template>
	<div class="advanced-settings">
		<Transformations
			:transformations="settings.transformations"
			class="mb-4"
			@update="updateTrans"
		/>

		<hr />

		<h6>Custom language transformations</h6>
		<p>
			Helps you transform additional values in query string, url path thanks to
			Regex or in sent cookie.
		</p>
		<div class="mb-3">
			<label>Cookie Key</label>
			<input
				:value="settings.localeReplace?.cookieKey || ''"
				type="text"
				name="headerName"
				class="form-control"
				@change="updateLocaleReplaceSettings({cookieKey: $event.target.value})"
			/>
		</div>
		<div class="mb-3">
			<label>
				Url Query string key (can be multiple separated with semicolon)</label>
			<input
				:value="settings.localeReplace?.queryStringKey"
				type="text"
				name="queryStringKey"
				class="form-control"
				@change="
					updateLocaleReplaceSettings({queryStringKey: $event.target.value})
				"
			/>
		</div>
		<div class="mb-3">
			<label>Url regex</label>
			<input
				:value="settings.localeReplace?.urlRegex"
				type="text"
				name="urlRegex"
				class="form-control"
				@change="updateLocaleReplaceSettings({urlRegex: $event.target.value})"
			/>
		</div>
	</div>
</template>

<script>
import Transformations from "@/popup/components/settings/advanced/transformation/Transformations"

export default {
	name: "AdvancedSettings",
	components: {Transformations},
	props: {
		settings: {
			type: Object,
			required: true
		},
		requestInfo: {
			type: Object,
			required: true
		}
	},
	emits: ["update-settings"],
	data() {
		return {
			headerRule: null,
			url: null
		}
	},
	watch: {
		settings(val) {
			console.log("Advanced settings changed", val)
		}
	},
	mounted() {
		this.parseSettings(this.settings)
	},
	methods: {
		updateTrans(transformations) {
			this.updateSettings({transformations})
		},
		parseSettings(settings) {
			let transformation = settings?.transformations?.[0]

			if (transformation) {
				this.headerRule = transformation.headerRule
				this.url = transformation.url
			} else {
				this.headerRule = ""
				this.url = ""
			}
		},
		updateLocaleReplaceSettings(partialLocaleSettings) {
			this.updateSettings({
				localeReplace: partialLocaleSettings
			})
		},
		updateSettings(partialSettings) {
			this.$emit("update-settings", partialSettings)
		}
	}
}
</script>

<!--<style lang="scss">-->
<!--.advanced-settings {-->
<!--	height: 100%;-->
<!--	overflow: auto;-->
<!--}-->
<!--</style>-->
