<template>
	<div class="page-headers d-flex flex-column gap-2">
		<PageHeadersNav
			:headers="filteredHeaders"
			:all-headers="allHeaders"
		/>

		<PageHeadersList
			v-if="headersFilterRules"
			:headers="filteredHeaders"
			:all-headers="allHeaders"
			:headers-filter-rules="headersFilterRules"
			:transformations="transformations"
			filtering
		/>
	</div>
</template>

<script>
import PageHeadersList from "@/overlay/components/headers/PageHeadersList"
import PageHeadersNav from "@/overlay/components/headers/PageHeadersNav"
import FilterRules from "@/settings/filterRules"

export default {
	name: "PageHeaders",
	components: {PageHeadersNav, PageHeadersList},
	props: {
		headersFilterRules: FilterRules,
		requestInfo: Object,
		transformations: Array,
		useFilters: Boolean
	},
	computed: {
		allHeaders() {
			return this.requestInfo?.responseHeaders || []
		},
		filteredHeaders() {
			if (!this.headersFilterRules)
				return []

			if (!this.useFilters)
				return this.allHeaders

			return this.headersFilterRules.filterHeaders(this.allHeaders, "name")
		}
	}
}
</script>
