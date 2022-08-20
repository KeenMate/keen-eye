<template>
	<div class="header-rules">
		<h5>Headers</h5>

		<HeaderRulesList
			:header-rules="headerRules"
			@update="setHeaderRules"
		/>

		<div
			class="mb-3"
			@keyup.esc.stop
		>
			<label>New headers</label>
			<multiselect
				v-model="multiselectValue"
				:options="availableHeaders"
				tag-placeholder="Add"
				class="form-control form-control-sm"
				placeholder="Add existing or new headers"
				:show-labels="false"
				:close-on-select="false"
				multiple
				taggable
				@tag="addHeaderRule"
				@close="addHeaderRules"
			/>
		</div>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect"
import HeaderRulesList from "@/popup/components/settings/basic/header-rules/HeaderRulesList"
import {distinctAndSortArray} from "@/helpers/array-helpers"

export default {
	name: "HeaderRules",
	components: {HeaderRulesList, Multiselect},
	props: {
		headerRules: Array,
		headers: Array
	},
	emits: ["update"],
	data() {
		return {
			multiselectValue: []
		}
	},
	computed: {
		availableHeaders() {
			return this.headers.filter(x => !this.headerRules.includes(x))
		}
	},
	methods: {
		addHeaderRule(val) {
			let oldRules = Array.isArray(this.headerRules)
				? this.headerRules
				: []

			this.setHeaderRules([...(oldRules || []), val])
		},
		addHeaderRules(newHeaderRules) {
			if (!newHeaderRules.length)
				return

			this.setHeaderRules([...this.headerRules, ...newHeaderRules])
			this.multiselectValue = []
		},
		setHeaderRules(headerRules) {
			this.$emit("update", this.sanitizeHeaderRules(headerRules))
		},
		sanitizeHeaderRules(headerRules) {
			return distinctAndSortArray(headerRules)

		}
	}
}
</script>

<style scoped>

</style>
