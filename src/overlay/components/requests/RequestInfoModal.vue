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
			<p>
				{{request.url}}
			</p>
			<strong>Took:</strong> {{request.took.toFixed(2)}}ms <br />
			<strong>TTFB:</strong> {{request.ttfb.toFixed(2)}}ms <br />

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
	methods: {
		close() {
			closeModal()
		}
	}
}
</script>
