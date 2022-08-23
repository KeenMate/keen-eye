<template>
	<div class="request-rules">
		<h5>Requests</h5>

		<RequestsRulesList
			:requests-rules="requestsRules"
			@update="setRequestsRules"
		/>

		<div
			class="mb-3"
			@keyup.esc.stop
		>
			<label>New requests</label>
			<multiselect
				v-model="multiselectValue"
				:options="availableRequests"
				tag-placeholder="Add"
				class="form-control form-control-sm"
				placeholder="Add existing or new requests"
				open-direction="bottom"
				:max-height="500"
				:option-height="30"
				:show-labels="false"
				:close-on-select="false"
				multiple
				taggable
				@tag="addRequestRule"
				@close="addRequestsRules"
			/>
		</div>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect"
import RequestsRulesList from "@/popup/components/settings/basic/requests-rules/RequestsRulesList"
import {distinctAndSortArray} from "@/helpers/array-helpers"

export default {
	name: "RequestsRules",
	components: {RequestsRulesList, Multiselect},
	props: {
		requestsRules: Array,
		requests: Array
	},
	emits: ["update"],
	data() {
		return {
			multiselectValue: []
		}
	},
	computed: {
		availableRequests() {
			// console.log("All requests: ", this.requests, this.requestsRules)

			const result = this.requests.filter(x => !this.requestsRules.includes(x))
			console.log("Available requests", result)
			return result
		}
	},
	methods: {
		addRequestRule(val) {
			let oldRules = Array.isArray(this.requestsRules)
				? this.requestsRules
				: []

			this.setRequestsRules([...(oldRules || []), val])
		},
		addRequestsRules(newRequestsRules) {
			if (!newRequestsRules.length)
				return

			this.setRequestsRules([...this.requestsRules, ...newRequestsRules])
			this.multiselectValue = []
		},
		setRequestsRules(requestsRules) {
			this.$emit("update", this.sanitizeRequestRules(requestsRules))
		},
		sanitizeRequestRules(requestsRules) {
			return distinctAndSortArray(requestsRules)

		}
	}
}
</script>

<style scoped>

</style>
