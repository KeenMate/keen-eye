<template>
	<div class="basic-settings">
		<HeaderRules
			:header-rules="settings.headerRules"
			:headers="pageHeaders"
			@update="updateSettings({headerRules: $event})"
		/>

		<RequestsRules
			:requests-rules="settings.requestsRules"
			:requests="requests"
			@update="updateSettings({requestsRules: $event})"
		/>

		<LocaleInput
			:locale="settings?.locale"
			:locales="settings?.customLocales || languages"
			:is-custom="!!settings?.customLocales"
			@input="updateSettings({locale: $event})"
			@remove-locale="onRemoveLocale"
			@set-custom-locales="onSetCustomLocales"
			@remove-custom-locales="onRemoveCustomLocales"
		/>
	</div>
</template>

<script>
import LocaleInput from "@/popup/components/settings/basic/LocaleInput"
import languages from "@/languages/languages"
import HeaderRules from "@/popup/components/settings/basic/header-rules/HeaderRules"
import RequestsRules from "@/popup/components/settings/basic/requests-rules/RequestsRules"
import {sortBy, uniq} from "lodash"

export default {
	name: "BasicSettings",
	components: {RequestsRules, HeaderRules, LocaleInput},
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
	emits: ["update-settings"],
	data() {
		return {
			languages
		}
	},
	computed: {
		pageHeaders() {
			return this.requestInfo
				?.responseHeaders
				?.map(x => x.name)
				?? []
		},
		requests() {
			if (!this.requestInfo?.requests) return []

			let requestsUrls = Object
				.values(this.requestInfo.requests)
				.map(req => req.url)
			requestsUrls = uniq(requestsUrls)
			requestsUrls = sortBy(requestsUrls)

			return requestsUrls
		}
	},
	methods: {
		async onRemoveCustomLocales() {
			this.updateSettings({customLocales: null})
		},
		async onSetCustomLocales(customLocales) {
			this.updateSettings({customLocales: customLocales})
		},
		onRemoveLocale() {
			if (!this.settings) return

			this.updateSettings({locale: null})
		},
		addHeaderRule(val) {
			let oldRules = Array.isArray(this.settings.headerRules)
				? this.settings.headerRules
				: []

			this.updateSettings({headerRules: [...oldRules, val]})
		},
		addRequestRule(val) {
			let oldRules = Array.isArray(this.settings.requestRules)
				? this.settings.requestRules
				: []

			this.updateSettings({
				requestsRules: [...oldRules, val]
			})
		},
		updateSettings(partialSettings) {
			this.$emit("update-settings", partialSettings)
		}
	}
}
</script>

<style lang="scss" scoped>
.basic-settings {
	margin-bottom: 500px;
}
</style>
