<template>
	<div
class="page-overlay position-relative d-flex flex-column gap-2"
dir="ltr"
>
		<OverlayTopNav
			ref="overlayTopHeader"
			:page-name="pageName"
			:status-code="requestInfo?.response?.statusCode"
			:taken="taken"
			@close-overlay="onCloseOverlay"
		/>

		<OverlayActions
			v-model:use-filters="useFilters"
			:unsaved-changes="unsavedChanges"
			:current-locale="settings?.locale"
			:locales="locales"
			@save-settings="saveSettings"
			@save-locale="saveLocale"
			@remove-locale="onRemoveLocale"
		/>

		<div class="flex-take-remaining overflow-auto d-flex flex-column gap-2">
			<PageHeaders
				:headers-filter-rules="headersFilterRules"
				:request-info="requestInfo"
				:transformations="settings.transformations"
				:use-filters="useFilters"
			/>

			<PageRequests
				v-if="requestsRulesSet || !useFilters"
				:requests="filteredRequests"
			/>
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
import {ContainerWrapperId} from "@/constants/overlay"
import {changeInject, getLocales, getRequestInfo, saveDivPosition, setSettings} from "@/messaging/messagingProvider"
import "../assets/css/vue-multiselect-overrides.scss"
import {onMessageReceived} from "@/messaging/scriptsComunicationHelper"
import OverlayTopNav from "@/overlay/components/structure/OverlayTopNav"
import OverlayActions from "@/overlay/components/structure/OverlayActions"
import PageHeaders from "@/overlay/components/headers/PageHeaders"
import PageRequests from "@/overlay/components/requests/PageRequests"

export default {
	name: "PageOverlay",
	components: {
		PageRequests,
		PageHeaders,
		OverlayActions,
		OverlayTopNav,
		WidgetContainerModal: container
	},
	props: {
		settings: Object,
		level: String
	},
	data() {
		return {
			requestInfo: null,
			useFilters: true,
			headersFilterRules: null,
			requestsFilterRules: null,
			unsavedChanges: false,
			locales: []
		}
	},
	computed: {
		requestsRulesSet() {
			return this.settings?.requestsRules?.length ?? false
		},
		filteredRequests() {
			if (this.requestsFilterRules === null || !this.requestInfo?.requests)
				return []

			const requests = Object.values(toRaw(this.requestInfo?.requests))
			return this.useFilters
				? this.requestsFilterRules.filterHeaders(requests, "url")
				: requests
		},
		taken() {
			if (!this.requestInfo)
				return null

			const requestTimeStamp = this.requestInfo.request?.timeStamp
			const responseTimeStamp = this.requestInfo.response?.timeStamp

			if (!responseTimeStamp || !requestTimeStamp)
				return undefined

			return (responseTimeStamp - requestTimeStamp).toFixed(2)
		},

		pageName() {
			if (!this.requestInfo || !this.requestInfo?.response?.url)
				return undefined

			return new URL(this.requestInfo?.response?.url).host
		}
	},
	watch: {
		settings(newVal) {
			this.createFilterObjects(newVal)
		}
	},
	async mounted() {
		this.loadLocales()
		await this.loadRequestInfo()

		this.createFilterObjects(this.settings)

		this.addNewRequestsListener()

		AddDrag(this.$refs.overlayTopHeader.$refs.drag.$refs.drag, ContainerWrapperId, this.settings.position, pos =>
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
			this.requestInfo = await getRequestInfo()
			console.log("requestInfo", this.requestInfo)
		},
		async onCloseOverlay() {
			let response = await changeInject(this.level, false)
			if (response && !response.ok) {
				console.error("Error occurred while closing overlay", response)
				//TODO maybe add real error handling
			}
		},
		async saveSettings() {
			await setSettings(
				this.level,
				{
					headerRules: toRaw(this.headersFilterRules.rules)
				},
				false
			)

			this.unsavedChanges = false
		},
		async saveLocale(locale) {
			await setSettings(
				this.level,
				{
					locale: toRaw(locale)
				}
			)

			location.reload()
		},
		createFilterObjects(settings) {
			this.unsavedChanges = false
			this.headersFilterRules = new FilterRules(
				settings.headerRules,
				() => (this.unsavedChanges = true)
			)
			this.requestsFilterRules = new FilterRules(settings.requestsRules)
		},
		async loadLocales() {
			this.locales = await getLocales()
			console.log("Loaded locales in overlay", this.locales)
		},
		onRemoveLocale() {
			this.saveLocale(null)
		}
	}
}
</script>
