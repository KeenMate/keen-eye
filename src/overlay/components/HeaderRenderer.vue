<template>
	<div class="row">
		<div class="col-6">
			<h6>Headers</h6>
		</div>
		<div class="col-6">
			<CopyHeadersButtonVue :headers="headers">
				Copy selected
			</CopyHeadersButtonVue>
			<CopyHeadersButtonVue :headers="allHeaders">
				Copy all
			</CopyHeadersButtonVue>
		</div>
	</div>
	<table class="table table-striped table-sm table-condensed tab">
		<thead class="table-dark">
			<tr>
				<th
					v-if="filtering"
					class="autowidth"
				>
					<span
						:class="{'text-warning': starSelected}"
						@click="toggleAll"
					>
						<i class="lar la-eye" />
					</span>
				</th>
				<th>Name</th>
				<th>Value</th>
				<th>Copy</th>
			</tr>
		</thead>
		<tbody class="table-group-divider">
			<tr
				v-for="(header, index) in orderedHeaders"
				:key="index"
				class="autowidth-table"
			>
				<td
					v-if="filtering"
					class="autowidth"
				>
					<span
						:class="{'text-warning': headersFilterRules.exists(header.name)}"
						@click="toggleRule(header.name)"
					>
						<i class="lar la-eye" />
					</span>
				</td>
				<td class="autowidth">
					<b>{{header.name}}</b>
				</td>
				<td class="limited-width">
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

				<td
					style="cursor: pointer; user-select: none"
					@click="copy(header.name, header.value)"
				>
					copy
				</td>
			</tr>
		</tbody>
	</table>
</template>
<script>
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import FilterRules from "@/settings/filterRules"
import TransformationRenderer from "./TransformationRenderer.vue"
import {escapeHtml} from "@/helpers/stringHelpers"
import CopyHeadersButtonVue from "@/overlay/components/CopyHeadersButton.vue"
import {sortHeaders} from "@/requestInfo/requestInfoHelpers"

export default {
	name: "HeaderRenderer",
	components: {TransformationRenderer, CopyHeadersButtonVue},
	props: {
		headers: Object,
		allHeaders: Array,
		filtering: {
			type: Boolean,
			default: false
		},
		headersFilterRules: FilterRules,
		transformations: Array
	},
	computed: {
		orderedHeaders() {
			return sortHeaders(this.headers ?? [])
		},
		starSelected() {
			return this.headersFilterRules?.exists("*") != undefined
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
			return this.transformations?.find(trans => trans.match(name))
		},
		escape(val) {
			return escapeHtml(val)
		}
	}
}
</script>

<style>
.autowidth {
	width: 1px;
}

.limited-width {
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
