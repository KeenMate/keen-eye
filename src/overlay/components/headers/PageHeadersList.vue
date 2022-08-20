<template>
	<SmartTable
		striped
		condensed
		small
	>
		<template #head>
			<tr>
				<th
					v-if="filtering"
					class="auto-width text-center"
				>
					<span
						:class="{'text-warning': everythingSelected}"
						@click="toggleAll"
					>
						<i class="lar la-eye" />
					</span>
				</th>
				<th>Name</th>
				<th>Value</th>
			</tr>
		</template>

		<tr
			v-for="(header, index) in orderedHeaders"
			:key="index"
		>
			<td
				v-if="filtering"
				class="actions auto-width"
			>
				<SmartButton
					:class="{'text-warning': headersFilterRules.includes(header.name)}"
					icon
					xsmall
					@click="toggleRule(header.name)"
				>
					<i class="lar la-eye" />
				</SmartButton>
			</td>
			<td class="auto-width text-nowrap">
				<b>{{header.name}}</b>
			</td>
			<td>
				<div class="d-flex gap-1 align-items-center">
					<SmartButton
						color="info"
						title="Copy header value"
						icon
						xsmall
						@click="copyValue(header.value)"
					>
						<i class="las la-copy" />
					</SmartButton>
					<div
						class="text-ellipsis"
						:title="header.value"
						style="max-width: 300px"
					>
						<TransformValue
							v-if="getTransformation(header.name)"
							:header-value="header.value"
							:transformation="getTransformation(header.name)"
							:headers="headers"
						/>
						<template v-else>
							{{header.value}}
						</template>
					</div>
				</div>
			</td>
		</tr>
	</SmartTable>
</template>
<script>
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import FilterRules from "@/settings/filterRules"
import TransformValue from "../TransformValue.vue"
import {escapeHtml} from "@/helpers/stringHelpers"
import SmartTable from "@/components/ui/SmartTable"
import {orderBy} from "lodash"
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "PageHeadersList",
	components: {SmartButton, SmartTable, TransformValue},
	props: {
		headers: Array,
		allHeaders: Array,
		filtering: Boolean,
		headersFilterRules: FilterRules,
		transformations: Array
	},
	computed: {
		orderedHeaders() {
			return orderBy(this.headers || [], [], "desc")
		},
		everythingSelected() {
			return this.headersFilterRules?.includes("*") ?? false
		}
	},
	methods: {
		copyValue(value) {
			copyTextToClipboard(value)
		},
		copyRow(name, value) {
			copyTextToClipboard(`${name}: ${value}`)
		},
		toggleAll() {
			this.headersFilterRules.toggleAll()
		},
		toggleRule(rule) {
			this.headersFilterRules.removeWildCard()
			this.headersFilterRules.toggle(rule)
		},
		getTransformation(name) {
			return this.transformations?.find(x => x.match(name))
		},
		escape(val) {
			return escapeHtml(val)
		}
	}
}
</script>
