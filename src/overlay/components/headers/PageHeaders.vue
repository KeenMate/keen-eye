<template>
	<div class="page-headers mb-3">
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
		headers: Array,
		headersFilterRules: FilterRules,
		requestInfo: Object,
		transformations: Array
	},
	computed: {
		allHeaders() {
			return this.requestInfo?.response?.responseHeaders || []
		},
		filteredHeaders() {
			if (!this.headersFilterRules)
				return []

			if (!this.useFilters)
				return this.allHeaders

			return this.headersFilterRules.filter(this.allHeaders, "name")
		}
	}
}
</script>
