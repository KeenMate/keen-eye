<template>
	<div
		class="card p-1 shadow-lg"
		style="z-index: 999999"
	>
		<div class="card-body">
			<div class="row">
				<div class="col-10">
					<h5>{{ request.statusLine }}</h5>
				</div>
				<div class="col-2">
					<button
						type="button"
						class="btn-close"
						aria-label="Close"
						@click="close"
					/>
				</div>
			</div>
			<span class="overflox-auto">{{ request.url }} <br /></span>
			Took: {{ request.took.toFixed(2) }}ms <br />
			Ttfb: {{ request.ttfb.toFixed(2) }}ms <br />
			<header-renderer :headers="request.responseHeaders" />
		</div>
	</div>
</template>
<script>
import HeaderRenderer from "./HeaderRenderer.vue";
import { closeModal } from "jenesius-vue-modal";
export default {
	components: { HeaderRenderer },
	props: {
		request: Object,
	},
	computed: {
		title() {
			return new URL(this.request.url).host;
		},
	},
	methods: {
		close() {
			closeModal();
		},
	},
};
</script>
