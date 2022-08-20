<template>
	<component
		:is="transformationComponent"
		:transformation="transformation"
		:header-value="headerValue"
		:headers="headers"
	/>
</template>

<script>
import {BaseTransformation} from "@/transformations/baseTransformation"
import UrlTransformation from "./UrlTransformation.vue"

export default {
	name: "TransformationRenderer",
	components: {UrlTransformation},
	props: {
		transformation: {
			type: BaseTransformation,
			required: true
		},
		headerValue: String,
		headers: Array
	},
	computed: {
		transformationComponent() {
			switch (this.transformation.type) {
				case "url":
					return UrlTransformation
				default:
					throw new Error("Transformation is missing type specified")
			}
		}
	}
}
</script>
