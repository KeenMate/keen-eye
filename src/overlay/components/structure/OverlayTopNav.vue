<template>
	<div class="overlay-top-header d-flex align-items-center justify-content-between px-2 pt-1">
		<PageOverlayHeader
			ref="drag"
			:page-name="pageName"
			:taken="taken"
			class="flex-grow-1 flex-shrink-1"
		/>

		<CloseButton @click="$emit('close-overlay')" />
	</div>
</template>

<script>
import PageOverlayHeader from "@/overlay/components/ui/PageOverlayHeader"
import CloseButton from "@/components/ui/button/CloseButton"

export default {
	name: "OverlayTopNav",
	components: {CloseButton, PageOverlayHeader},
	props: {
		pageName: String,
		statusCode: Number,
		taken: Number
	},
	emits: ["close-overlay"]
}
</script>

<style scoped>

</style>
