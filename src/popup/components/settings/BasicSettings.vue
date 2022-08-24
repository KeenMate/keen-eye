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
			:locales="settings?.customLocales || defaultLanguages"
			:is-custom="!!settings?.customLocales"
			@input="updateSettings({locale: $event})"
			@remove-locale="onRemoveLocale"
		/>
	</div>
</template>

<script>
import LocaleInput from "@/popup/components/settings/basic/LocaleInput"
import {DefaultLanguages} from "@/constants/languages"
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
			defaultLanguages: DefaultLanguages
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
