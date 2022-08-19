<template>
	<SmartTable
class="page-requests-list"
striped
small
>
		<template #head>
			<tr>
				<th>More</th>
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
			<td
				style="cursor: pointer"
				@click="openRequestModal(request)"
			>
				more
			</td>
			<td :class="`text-${getColor(request.statusCode)}`">
				{{ request.statusCode ?? "Unknown" }}
			</td>
			<td>
				{{ request.method }}
			</td>
			<td class="limited-width">
				<Popper :content="request.url">
					<b>{{ getPath(request.url) }}</b>
				</Popper>
			</td>
			<td>
				{{ request.ttfb ? request.ttfb.toFixed(2) + "ms" : "Unknown" }}
			</td>
			<td>
				{{ request.took ? request.took.toFixed(2) + "ms" : "Unknown" }}
			</td>
			<td>
				{{ getOrigin(request.url) }}
			</td>
		</tr>
	</SmartTable>
</template>
<script>
import Popper from "vue3-popper"
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import {getStatusCodeColor} from "@/helpers/helpers"
import {openModal} from "jenesius-vue-modal"
import RequestInfoModalVue from "./RequestInfoModal.vue"
import SmartTable from "@/components/ui/SmartTable"

export default {
	name: "PageRequestsList",
	components: {SmartTable, Popper},
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
		copy(name, value) {
			copyTextToClipboard(`${name}: ${value}`)
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
