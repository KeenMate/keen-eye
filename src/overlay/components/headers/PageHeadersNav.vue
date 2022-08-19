<template>
	<div class="d-flex align-items-center justify-content-between px-2">
		<h6 class="mb-0">
Headers
</h6>

		<div class="actions btn-group">
			<SmartButton
				color="info"
				small
				@click="copyHeadersToClipboard(headers)"
			>
				Copy selected
			</SmartButton>
			<SmartButton
				color="primary"
				small
				@click="copyHeadersToClipboard(allHeaders)"
			>
				Copy all
			</SmartButton>
		</div>
	</div>
</template>

<script>
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "PageHeadersNav",
	components: {SmartButton},
	props: {
		headers: Array,
		allHeaders: Array
	},
	methods: {
		copyHeadersToClipboard(headers) {
			let text = headers
				.map(header => header.name + ": " + header.value)
				.join("\n")

			copyTextToClipboard(text)
		}
	}
}
</script>

<style scoped>

</style>
