<template>
	<SmartTable
		class="page-requests-list mb-0"
		striped
		small
	>
		<template #head>
			<tr>
				<th class="auto-width" />
				<th>Actions</th>
				<th>Code</th>
				<th>Method</th>
				<th>Path</th>
				<th>Ttfb</th>
				<th>Time</th>
				<th>Origin</th>
			</tr>
		</template>

		<tr
			v-for="request in requests"
			:key="request.requestId"
		>
			<td />
			<td class="auto-width">
				<div class="d-inline-flex gap-1">
					<SmartButton
						color="primary"
						xsmall
						@click="openRequestModal(request)"
					>
						<i class="las la-lightbulb" />
					</SmartButton>
					<CopyButton
						title="Copy request path"
						:icon="false"
						xsmall
						@click="copyValue(getPath(request.url))"
					/>
				</div>
			</td>
			<StatusCodeCell :status-code="request.statusCode" />
			<td>
				{{request.method}}
			</td>
			<td
				class="text-ellipsis"
				style="max-width: 300px"
			>
				<b>{{getPath(request.url)}}</b>
			</td>
			<td class="text-right">
				{{request.ttfb ? request.ttfb.toFixed(2) + "ms" : "-"}}
			</td>
			<td class="text-right">
				{{request.took ? request.took.toFixed(2) + "ms" : "-"}}
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
import RequestInfoModal from "./RequestInfoModal.vue"
import SmartTable from "@/components/ui/SmartTable"
import SmartButton from "@/components/ui/button/SmartButton"
import StatusCodeCell from "@/overlay/components/requests/StatusCodeCell"
import CopyButton from "@/components/ui/button/CopyButton"

export default {
	name: "PageRequestsList",
	components: {CopyButton, StatusCodeCell, SmartButton, SmartTable},
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
				openModal(RequestInfoModal, {request})
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
