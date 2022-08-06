<template>
	<div class="advanced-settings">
		<h6>Custom header rules</h6>
		<p>Helps you to format header values to links leading for example to Grafana</p>
		<div class="form-group">
			<label>Header Rule</label>
			<input
				:value="headerRule"
				type="text"
				name="headerName"
				class="form-control"
				@input="updateTrans"
			/>
		</div>

		<div class="form-group">
			<label>Url</label>
			<input
				:value="url"
				class="form-control"
				type="text"
				name="url"
				@input="updateTrans"
			/>
		</div>

		<h6>Custom language transformations</h6>
		<p>Helps you transform additional values in query string, url path thanks to Regex or in sent cookie.</p>
		<div class="form-group">
			<label>Cookie Key</label>
			<input
				:value="settings.localeReplace.cookieKey"
				type="text"
				name="headerName"
				class="form-control"
				@input="updateLocaleReplaceSettings('cookieKey', $event.target.value)"
			/>
		</div>
		<div class="form-group">
			<label>Url Query string key (can be multiple separated with semicolon)</label>
			<input
				:value="settings.localeReplace.queryStringKey"
				type="text"
				name="queryStringKey"
				class="form-control"
				@input="updateLocaleReplaceSettings('queryStringKey', $event.target.value)"
			/>
		</div>
		<div class="form-group">
			<label>Url regex</label>
			<input
				:value="settings.localeReplace.urlRegex"
				type="text"
				name="urlRegex"
				class="form-control"
				@input="updateLocaleReplaceSettings('urlRegex', $event.target.value)"
			/>
		</div>
	</div>
</template>

<script>
import {UrlTransformation} from "@/transformations/urlTransformation"

export default {
	name: "AdvancedSettings",
	emits: ["change"],
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
	watch: {
		selectedSettings(newVal) {
			this.parse(newVal)
		}
	},
	methods: {
		updateTrans() {
			let settingsCopy = {...this.settings}

			settingsCopy.transformations = [
				new UrlTransformation(this.headerRule ?? "", this.url ?? "")
			]

			this.$emit("change", settingsCopy)
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
		updateLocaleReplaceSettings(key, value) {
			const newSettings = {
				...(this.settings || {}),
				localeReplace: {
					...((this.settings || {}).localeReplace || {}),
					[key]: value
				}
			}

			this.$emit("change", newSettings)
		}
	},
	data() {
		return {
			headerRule: null,
			url: null,
		}
	},
	mounted() {
		this.parse(this.settings)
	}
}
</script>
