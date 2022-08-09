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
				@select="val => updateSettings({headerRules: val})"
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
				@select="val => updateSettings({requestsRules: val})"
			/>
		</div>

		<div class="form-group">
			<label>Locale</label>
			<div class="input-group" @keyup.esc.stop>
				<multiselect
					v-model="locale"
					:options="languages"
					track-by="code"
					label="name"
					:custom-label="customLabel"
					group-values="languages"
					group-label="type"
					class="form-control form-control-sm"
					:multiple="false"
					@select="val => this.updateSettings({locale: val})"
				/>
				<!-- val => this.updateSettings('locale', val) -->
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
			type: [Object, null],
			required: true
		}
	},
	emits: ["change"],

	mounted() {
		this.locale = this.settings?.locale
	},
	data() {
		return {
			locale: this.settings?.locale
		}
	},
	computed: {
		pageHeaders() {
			return (
				this.requestInfo
					?.response
					?.responseHeaders
					?.map(o => o.name)
				?? []
			)
		},
		requests() {
			if (!this.requestInfo?.requests)
				return []

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

			this.updateSettings({locale: null})
		},
		customLabel(object) {
			return `[${object.code}] ${object.name}`
		},
		addHeaderRule(val) {
			this.updateSettings({headerRules: [...this.settings.headerRules, val]})
		},
		addRequestRule(val) {
			this.updateSettings({requestsRules: [...this.settings.requestRules, val]})
		},
		updateSettings(partialSettings) {
			this.$emit("change", {...(this.settings || {}), ...partialSettings})
		}
	}
}
</script>
