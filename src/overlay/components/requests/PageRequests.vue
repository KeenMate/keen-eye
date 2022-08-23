<template>
	<div class="page-requests mb-3">
		<h6 class="px-2">
Requests
</h6>

		<div class="horizontal-scroll">
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
		requests: Array
	}
}
</script>

<style lang="scss" scoped>
.horizontal-scroll {
	overflow: auto;
}
</style>
