<template>
	<div class="advanced-settings">
		<Transformations
			:transformations="settings.transformations"
			class="mb-4"
			@change="updateTrans"
		/>

		<hr>

		<h6>Custom language transformations</h6>
		<p>Helps you transform additional values in query string, url path thanks to Regex or in sent cookie.</p>
		<div class="form-group">
			<label>Cookie Key</label>
			<input
				:value="settings.localeReplace?.cookieKey || ''"
				type="text"
				name="headerName"
				class="form-control"
				@change="updateLocaleReplaceSettings({cookieKey: $event.target.value})"
			>
		</div>
		<div class="form-group">
			<label>Url Query string key (can be multiple separated with semicolon)</label>
			<input
				:value="settings.localeReplace?.queryStringKey"
				type="text"
				name="queryStringKey"
				class="form-control"
				@change="updateLocaleReplaceSettings({queryStringKey: $event.target.value})"
			>
		</div>
		<div class="form-group">
			<label>Url regex</label>
			<input
				:value="settings.localeReplace?.urlRegex"
				type="text"
				name="urlRegex"
				class="form-control"
				@change="updateLocaleReplaceSettings({urlRegex: $event.target.value})"
			>
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
	emits: ["change"],
	data() {
		return {
			headerRule: null,
			url: null,
		}
	},
	watch: {
		settings(val) {
			console.log("Advanced settings changed", val)
		}
	},
	mounted() {
		this.parse(this.settings)
	},
	methods: {
		updateTrans(transformations) {
			this.$emit("change", {
				...this.settings,
				transformations
			})
		},
		parse(newVal) {
			let transformation = newVal?.transformations?.[0]

			if (transformation) {
				this.headerRule = transformation.headerRule
				this.url = transformation.url
			} else {
				this.headerRule = ""
				this.url = ""
			}
		},
		updateLocaleReplaceSettings(partial) {
			this.updateSettings({
				localeReplace: {
					...((this.settings || {}).localeReplace || {}),
					...partial
				}
			})
		},
		updateSettings(partial) {
			this.$emit("change", {...this.settings, ...partial})
		},
	}
}
</script>
