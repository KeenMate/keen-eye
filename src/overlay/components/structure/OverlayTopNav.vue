<template>
	<div class="container overlay-top-header d-flex align-items-center justify-content-between">
		<PageOverlayHeader
			ref="drag"
			class="flex-grow-1 flex-shrink-1"
		/>

		<CloseButton />
	</div>
</template>

<script>
import PageOverlayHeader from "@/overlay/components/ui/PageOverlayHeader"
import CloseButton from "@/components/ui/button/CloseButton"

export default {
	name: "OverlayTopNav",
	components: {CloseButton, PageOverlayHeader},
	methods: {

	}
}
</script>

<style scoped>

</style>
