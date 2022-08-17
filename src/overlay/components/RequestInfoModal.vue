<template>
	<div
		class="card p-1 shadow-lg"
		style="z-index: 999999"
	>
		<div class="card-body">
			<div class="d-flex">
				<h5>{{ request.statusLine }}</h5>
				<div class="ms-auto">
					<button
						type="button"
						class="btn-close"
						aria-label="Close"
						@click="close"
					/>
				</div>
			</div>
			<div
				class="limited-width"
				style="max-width: 500px"
			>
				<Popper :content="request.url">
					{{ request.url }}
				</Popper>
			</div>
			Took: {{ request.took.toFixed(2) }}ms <br />
			Ttfb: {{ request.ttfb.toFixed(2) }}ms <br />
			<header-renderer :headers="request.responseHeaders" />
		</div>
	</div>
</template>
<script>
import HeaderRenderer from "./HeaderRenderer.vue"
import {closeModal} from "jenesius-vue-modal"
export default {
	components: {HeaderRenderer},
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
