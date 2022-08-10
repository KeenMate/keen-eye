<template>
	<div class="basic-settings">
		header rules {{settings.headerRules}}
		headers {{pageHeaders}}
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
				@input="updateSettings({headerRules: $event})"
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
				@select="updateSettings({requestsRules: $event})"
			/>
		</div>

		<LocaleInput
			:locale="locale"
			:locales="locales"
			@input="this.updateSettings({locale: $event})"
			@remove-locale="onRemoveLocale"
			@set-custom-locales="onSetCustomLocales"
			@remove-custom-locales="onRemoveCustomLocales"
		/>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect"
import LocaleInput from "@/popup/components/settings/basic/LocaleInput"
import LocaleStorage from "@/settings/locale-storage"

export default {
	name: "BasicSettings",
	components: {LocaleInput, Multiselect},
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
	data() {
		return {
			locale: this.settings?.locale,
			locales: []
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
		}
	},
	async mounted() {
		this.locale = this.settings?.locale
		await this.loadLocales()
	},
	methods: {
		async onRemoveCustomLocales() {
			LocaleStorage.clearCustomLocales()
			await this.loadLocales()
		},
		async onSetCustomLocales(customLocales) {
			LocaleStorage.saveCustomLocales(customLocales)

			this.locales = customLocales
		},
		onRemoveLocale() {
			if (!this.settings)
				return

			this.updateSettings({locale: null})
		},
		addHeaderRule(val) {
			this.updateSettings({headerRules: [...this.settings.headerRules, val]})
		},
		addRequestRule(val) {
			this.updateSettings({requestsRules: [...this.settings.requestRules, val]})
		},
		updateSettings(partialSettings) {
			this.$emit("change", {...(this.settings || {}), ...partialSettings})
		},
		async loadLocales() {
			this.locales = await LocaleStorage.getLocales()
		}
	}
}
</script>
