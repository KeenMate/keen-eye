<template>
	<div
		class="card p-1 shadow-lg"
		style="z-index: 999999"
	>
		<h5 class="card-header d-flex align-items-center justify-content-between">
			{{ request.statusLine }}

			<button
				type="button"
				class="btn-close"
				aria-label="Close"
				@click="close"
			/>
		</h5>

		<div class="card-body">
			<div
				class="limited-width"
				style="max-width: 500px"
			>
				<Popper :content="request.url">
					{{ request.url }}
				</Popper>
			</div>
			Took: {{ request.took.toFixed(2) }}ms <br />
			TTFB: {{ request.ttfb.toFixed(2) }}ms <br />

			<PageHeadersList :headers="request.responseHeaders" />
		</div>
	</div>
</template>
<script>
import Popper from "vue3-popper"
import {closeModal} from "jenesius-vue-modal"
import PageHeadersList from "@/overlay/PageOverlay"

export default {
	name: "RequestInfoModal",
	components: {PageHeadersList, Popper},
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
