<template>
	<div class="basic-settings">
		<div class="form-group" @keyup.esc.stop>
			<label>Headers</label>
			<multiselect
				:value="settings.headerRules"
				:options="pageHeaders"
				tag-placeholder="Add"
				class="form-control form-control-sm"
				placeholder="Search or add a header rule"
				taggable
				:clear-on-select="false"
				:show-labels="false"
				:multiple="true"
				:close-on-select="false"
				@tag="addHeaderRule"
				@input="val => updateSettings('headerRules', val)"
			/>
		</div>

		<div class="form-group" @keyup.esc.stop>
			<label>Requests</label>
			<multiselect
				:value="settings.requestsRules"
				:options="requests"
				tag-placeholder="Add"
				class="form-control form-control-sm"
				placeholder="Search or add a request rule"
				taggable
				:multiple="true"
				:clear-on-select="false"
				:show-labels="false"
				:close-on-select="false"
				@tag="addRequestRule"
				@input="val => updateSettings('requestsRules', val)"
			/>
		</div>

		<div class="form-group">
			<label>Locale</label>
			<div class="input-group">
				<multiselect
					:value="settings.locale"
					:options="languages"
					track-by="code"
					label="name"
					:custom-label="customLabel"
					group-values="languages"
					group-label="type"
					class="form-control form-control-sm"
					:multiple="false"
					@input="val => updateSettings('locale', val)"
					@keyup.esc.stop
				/>
				<div class="input-group-append">
					<button
						class="btn btn-danger"
						@click="onRemoveLocale"
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import languages from "@/languages/languages"
import Multiselect from "vue-multiselect"

export default {
	name: "BasicSettings",
	components: {Multiselect},
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
		return {}
	},
	computed: {
		pageHeaders() {
			return (
				this.requestInfo?.response?.responseHeaders?.map((o) => o.name) ?? []
			)
		},
		requests() {
			if (!this.requestInfo?.requests) return []
			return Object.values(this.requestInfo.requests).map((req) => req.url)
		},
		languages() {
			return languages
		}
	},
	methods: {
		onRemoveLocale() {
			if (!this.settings)
				return

			this.updateSettings("locale", null)
		},
		customLabel(object) {
			return `[${object.code}] ${object.name}`
		},
		addHeaderRule(val) {
			this.updateSettings("headerRules", [...(this.settings.headerRules || []), val])
		},
		addRequestRule(val) {
			this.updateSettings("requestsRules", [...(this.settings.headerRules || []), val])
		},
		updateSettings(key, value) {
			this.$emit("change", {...(this.settings || {}), [key]: value})
		}
	}
}
</script>
