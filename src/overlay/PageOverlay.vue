<template>
	<div class="position-relative">
		<OverlayTopHeader
			ref="overlayTopHeader"
			@close-overlay="onCloseOverlay"
		/>

		<div class="container d-flex" style="gap: 3px">
			<SwitchInput v-model="useFilters">
				<i
					class="las la-filter"
					style="font-size: 20px"
				/>
			</SwitchInput>

			<button
				class="btn btn-sm"
				style="margin-left: auto"
				:class="{
					'btn-secondary': !changesToSave,
					'btn-success': changesToSave
				}"
				@click="saveSettings"
			>
				<i class="las la-save" />
			</button>
			<LocaleSelector
				:locale="settings?.locale"
				:locales="locales"
				@input="saveLocale"
				@remove-locale="onRemoveLocale"
			/>
		</div>
		<div class="mt-1">
			<div style="max-height: 35vh; overflow-y: auto; overflow-x: hidden">
				<HeaderRendererVue
					v-if="headersFilterRules"
					:filtering="true"
					:headers="filteredHeaders"
					:all-headers="requestInfo?.response?.responseHeaders"
					:headers-filter-rules="headersFilterRules"
					:transformations="settings.transformations"
				/>
			</div>
			<template v-if="requestsRulesSet || !useFilters">
				<div class="row">
					<div class="col-6">
						<h6>Requests</h6>
					</div>
				</div>
				<div style="max-height: 35vh; overflow-y: auto">
					<RequestsRendererVue
						v-if="filteredRequests"
						:requests="filteredRequests"
					/>
				</div>
			</template>
		</div>
	</div>
	<WidgetContainerModal />
</template>

<script>
import {toRaw} from "@vue/reactivity"
import {container} from "jenesius-vue-modal"
import AddDrag from "@/helpers/dragHelper"
import FilterRules from "@/settings/filterRules"
import {ContentScriptMessages} from "@/messaging/messages"
import {ContainerName} from "@/constants/overlay"
import {
	changeInject,
	getRequestInfo,
	saveDivPosition,
	setSettings,
	getLocales
} from "@/messaging/messagingProvider"
import HeaderRendererVue from "@/overlay/components/HeaderRenderer.vue"
import RequestsRendererVue from "@/overlay/components/RequestsRenderer.vue"
import LocaleSelector from "./components/LocaleSelector.vue"

import "../assets/css/vue-multiselect-overrides.scss"
import {onMessageReceived} from "@/messaging/scriptsComunicationHelper"
import SwitchInput from "@/components/form/SwitchInput"
import OverlayTopHeader from "@/overlay/components/structure/OverlayTopHeader"

export default {
	components: {
		OverlayTopHeader,
		SwitchInput,
		HeaderRendererVue,
		RequestsRendererVue,
		WidgetContainerModal: container,
		LocaleSelector
	},
	props: {
		settings: Object,
		level: String
	},
	watch: {
		settings(newVal) {
			this.createFilterObjects(newVal)
		}
	},
	computed: {
		requestsRulesSet() {
			if (!this.settings || !this.settings?.requestsRules) {
				return false
			}
			if (this.settings.requestsRules.length == 0) {
				return false
			}
			return true
		},
		filteredHeaders() {
			if (this.headersFilterRules === null) return []

			if (!this.useFilters) return this.requestInfo?.response?.responseHeaders

			return this.headersFilterRules.filter(
				this.requestInfo?.response?.responseHeaders,
				"name"
			)
		},
		filteredRequests() {
			if (this.requestsFilterRules === null || !this.requestInfo?.requests)
				return []
			let requestsArray = Object.values(toRaw(this.requestInfo?.requests))
			if (!this.useFilters) return requestsArray
			return this.requestsFilterRules.filter(requestsArray, "url")
		},
		time() {
			if (
				!this.requestInfo ||
				!this.requestInfo?.response?.timeStamp ||
				!this.requestInfo?.request?.timeStamp
			)
				return undefined

			return (
				this.requestInfo.response.timeStamp - this.requestInfo.request.timeStamp
			).toFixed(2)
		},

		pageName() {
			if (!this.requestInfo || !this.requestInfo?.response?.url)
				return undefined

			return new URL(this.requestInfo?.response?.url).host
		}
	},
	data() {
		return {
			requestInfo: null,
			useFilters: true,
			headersFilterRules: null,
			requestsFilterRules: null,
			changesToSave: false,
			locales: []
		}
	},
	async mounted() {
		this.loadLocales()
		await this.loadRequestInfo()

		this.createFilterObjects(this.settings)

		this.addNewRequestsListener()

		AddDrag(this.$refs.overlayTopHeader.$refs.drag.$refs.drag, ContainerName, this.settings.position, pos =>
			saveDivPosition(this.level, pos, false)
		)
	},
	methods: {
		addNewRequestsListener() {
			onMessageReceived(ContentScriptMessages.newRequests, message => {
				this.requestInfo = this.requestInfo ?? {}

				this.requestInfo.requests = message.data
			})
		},
		async loadRequestInfo() {
			let requestInfo = await getRequestInfo()

			this.requestInfo = requestInfo
			console.log("requestInfo", requestInfo)
		},
		async onCloseOverlay() {
			let response = await changeInject(this.level, false)
			if (response && !response.ok) {
				console.error(response)
				//TODO maybe add real error handling
			}
		},
		saveSettings() {
			setSettings(
				this.level,
				{
					headerRules: toRaw(this.headersFilterRules.rules)
				},
				false
			)

			this.changesToSave = false
		},
		saveLocale(locale) {
			console.log(locale)
			setSettings(
				this.level,
				{
					locale: toRaw(locale)
				},
				true
			).then(() => {
				if (locale) location.reload()
			})
		},
		createFilterObjects(settings) {
			this.changesToSave = false
			this.headersFilterRules = new FilterRules(
				settings.headerRules,
				() => (this.changesToSave = true)
			)
			this.requestsFilterRules = new FilterRules(settings.requestsRules)
		},
		async loadLocales() {
			let locales = await getLocales()
			console.log(locales)
			this.locales = locales
		},
		onRemoveLocale() {
			this.saveLocale(null)
		}
	}
}
</script>
