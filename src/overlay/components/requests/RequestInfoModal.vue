<template>
	<div
		class="card shadow-lg"
		style="z-index: 999999"
	>
		<h5 class="card-header d-flex align-items-center justify-content-between">
			{{request.statusLine}}

			<CloseButton @click="close" />
		</h5>

		<div class="card-body">
			<p class="request-url">
				{{request.url}} <br />
			</p>

			<p class="request-stats">
				<strong>TTFB:</strong> {{request.ttfb.toFixed(2)}}ms <br />
				<strong>Took:</strong> {{request.took.toFixed(2)}}ms <br />
			</p>

			<h6>
				Response headers
			</h6>
			<PageHeadersList :headers="request.responseHeaders" />
		</div>
	</div>
</template>
<script>
import {closeModal} from "jenesius-vue-modal"
import PageHeadersList from "@/overlay/components/headers/PageHeadersList"
import CloseButton from "@/components/ui/button/CloseButton"

export default {
	name: "RequestInfoModal",
	components: {CloseButton, PageHeadersList},
	props: {
		request: Object
	},
	computed: {
		title() {
			return new URL(this.request.url).host
		}
	},
	watch: {
		request: {
			immediate: true,
			handler(val) {
				console.log("Request info modal request prop", val)
			}
		}
	},
	methods: {
		close() {
			closeModal()
		}
	}
}
</script>

<style lang="scss" scoped>
.request-url {
	max-width: 50vw;
}
</style>
