<template>
	<div class="page-requests mb-3">
		<h6>Requests</h6>

		<PageRequestsList :requests="requests" />
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
