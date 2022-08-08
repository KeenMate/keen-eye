<template>
	<UrlTranformator
		v-if="transformation.type == 'url'"
		:transformation="transformation"
		:header-value="headerValue"
		:headers="headers"
	/>
</template>

<script>
import { BaseTransformation } from "@/transformations/baseTransformation";
import UrlTranformator from "./UrlTranformator.vue";

export default {
	name: "TransformationRenderer",
	components: { UrlTranformator },
	props: {
		transformation: {
			type: BaseTransformation,
			required: true,
		},
		headerValue: String,
		headers: Array,
	},
};
</script>
