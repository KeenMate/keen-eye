<template>
	<a
		:href="link"
		target="_blank"
	>{{headerValue}}</a>
</template>

<script>
import {UrlTransformation} from "@/transformations/urlTransformation"

export default {
	name: "UrlTransformation",
	props: {
		transformation: {
			type: UrlTransformation,
			required: true
		},
		headerValue: String,
		headers: Array
	},
	computed: {
		link() {
			return this.transformation.getTransformedUrl(
				this.headerValue,
				this.headers
			)
		}
	}
}
</script>
