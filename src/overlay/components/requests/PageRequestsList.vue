<template>
	<SmartTable
		class="page-requests-list"
		striped
		small
	>
		<template #head>
			<tr>
				<th>Actions</th>
				<th>Code</th>
				<th>Method</th>
				<th>Path</th>
				<th>Time</th>
				<th>Ttfb</th>
				<th>Origin</th>
			</tr>
		</template>

		<tr
			v-for="request in requests"
			:key="request.requestId"
		>
			<td class="auto-width">
				<SmartButton
					color="primary"
					icon
					xsmall
					@click="openRequestModal(request)"
				>
					<i class="las la-lightbulb" />
				</SmartButton>
				<SmartButton
					color="info"
					title="Copy request path"
					icon
					xsmall
					@click="copyValue(getPath(request.url))"
				>
					<i class="las la-copy" />
				</SmartButton>
			</td>
			<td class="auto-width">
				<StatusCodeBadge :status-code="request.statusCode" />
			</td>
			<td>
				{{request.method}}
			</td>
			<td class="text-ellipsis" style="max-width: 300px">
				<b>{{getPath(request.url)}}</b>
			</td>
			<td>
				{{request.took ? request.took.toFixed(2) + "ms" : "Unknown"}}
			</td>
			<td>
				{{request.ttfb ? request.ttfb.toFixed(2) + "ms" : "Unknown"}}
			</td>
			<td>
				{{getOrigin(request.url)}}
			</td>
		</tr>
	</SmartTable>
</template>
<script>
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import {getStatusCodeColor} from "@/helpers/helpers"
import {openModal} from "jenesius-vue-modal"
import RequestInfoModalVue from "./RequestInfoModal.vue"
import SmartTable from "@/components/ui/SmartTable"
import SmartButton from "@/components/ui/button/SmartButton"
import StatusCodeBadge from "@/overlay/components/requests/StatusCodeBadge"

export default {
	name: "PageRequestsList",
	components: {StatusCodeBadge, SmartButton, SmartTable},
	props: {
		requests: Object
	},
	data() {
		return {
			showModal: false,
			modalRequest: {},
			modalTitle: "Modal Title"
		}
	},
	methods: {
		copyValue(value) {
			copyTextToClipboard(value)
		},
		getPath(urlString) {
			return new URL(urlString).pathname
		},
		getOrigin(urlString) {
			return new URL(urlString).host
		},
		getName(urlString) {
			return (new URL(urlString).pathname ?? "").split("/").pop()
		},
		getColor(status) {
			return getStatusCodeColor(status)
		},
		openRequestModal(request) {
			if (request.took) {
				openModal(RequestInfoModalVue, {request})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.page-requests-list {
	max-height: 35vh;
	overflow-y: auto
}
</style>
