<template>
	<div class="transformations">
		<h5 title="Helps you to transform header values into links (leading to Grafana for example)">
			Custom header transformations
		</h5>

		<TransformationsList
			:transformations="transformations"
			:current-transformation-id="transformationDetail?.transformationId"
			:is-new="transformationDetailIsNew"
			class="mb-2"
			@edit-transformation="transformationDetail = $event"
			@new-transformation="onNewTransformation"
			@delete-transformation="onDeleteTransformation"
		/>

		<TransformationForm
			v-if="transformationDetail"
			:value="transformationDetail"
			:is-new="transformationDetailIsNew"
			@submit="onSubmitTransformationDetail"
		/>
	</div>
</template>

<script>
import TransformationForm from "@/popup/components/settings/advanced/transformation/TransformationForm"
import TransformationsList from "@/popup/components/settings/advanced/transformation/TransformationsList"
import {UrlTransformation} from "@/transformations/urlTransformation"
import {sortBy} from "lodash"
import {distinctAndSortArray} from "@/helpers/array-helpers"

export default {
	name: "Transformations",
	components: {TransformationsList, TransformationForm},
	props: {
		transformations: Array
	},
	emits: ["update"],
	data() {
		return {
			transformationDetail: new UrlTransformation()
		}
	},
	computed: {
		transformationDetailIsNew() {
			return !this.transformations?.some(x => x.transformationId === this.transformationDetail?.transformationId)
		}
	},
	methods: {
		onDeleteTransformation(transformation) {
			this.$emit("update", this.transformations.filter(x => x.transformationId !== transformation.transformationId))
		},
		onNewTransformation() {
			this.transformationDetail = new UrlTransformation()
		},
		onSubmitTransformationDetail(transformation) {
			const transformations = this.transformations || []
			const newTransformations = this.transformationDetailIsNew
				&& [...transformations, transformation]
				|| transformations.map(x => x.transformationId === transformation.transformationId
					&& transformation
					|| x)

			this.$emit("update", this.sanitizeTransformations(newTransformations))

			this.transformationDetail = transformation
		},
		sanitizeTransformations(transformations) {
			return distinctAndSortArray(transformations, ["headerRule"])
		}
	},
}
</script>

<style scoped>

</style>
