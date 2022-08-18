<template>
	<SmartTable striped condensed small>
		<template #head>
			<tr>
				<th v-if="filtering" class="auto-width">
						<span
							:class="{'text-warning': everythingSelected}"
							@click="toggleAll"
						>
							<i class="lar la-eye" />
						</span>
				</th>
				<th>Actions</th>
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
					@click="toggleRule(header.name)"
				>
					<i class="lar la-eye" />
				</SmartButton>
			</td>
			<td class="auto-width">
				<SmartButton icon @click="copy(header.name, header.value)">
					<i class="las la-copy" />
				</SmartButton>
			</td>
			<td class="auto-width">
				<b>{{header.name}}</b>
			</td>
			<td class="text-ellipsis" style="max-width: 200px">
				<TransformationRenderer
					v-if="getTransformation(header.name) !== undefined"
					:header-value="header.value"
					:transformation="getTransformation(header.name)"
					:headers="headers"
				/>
				<template v-else>
					<Popper :content="header.value">
						{{header.value}}
					</Popper>
				</template>
			</td>
		</tr>
	</SmartTable>
</template>
<script>
import Popper from "vue3-popper"
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import FilterRules from "@/settings/filterRules"
import TransformationRenderer from "../TransformationRenderer.vue"
import {escapeHtml} from "@/helpers/stringHelpers"
import SmartTable from "@/components/ui/SmartTable"
import {orderBy} from "lodash"
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "PageHeadersList",
	components: {SmartButton, SmartTable, TransformationRenderer, Popper},
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
		copy(name, value) {
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
