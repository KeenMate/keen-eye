<template>
	<div class="page-requests mb-3">
		<h6>Requests</h6>

		<div class="horizontal-scroll" :style="scrollableStyles">
			<PageRequestsList :requests="requests" />
		</div>
	</div>
</template>

<script>
import PageRequestsList from "@/overlay/components/requests/PageRequestsList"

export default {
	name: "PageRequests",
	components: {PageRequestsList},
	props: {
		requests: Array,
		maxWidth: Number
	},
	computed: {
		scrollableStyles() {
			return {
				maxWidth: this.maxWidth
					? this.maxWidth + "px"
					: "100%"
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.horizontal-scroll {
	overflow: auto;
}
</style>
