<template>
	<div class="d-flex align-items-center justify-content-between mb-3">
		<h6>Headers</h6>
		
		<div class="actions">
			<SmartButton
				small
				@click="copyHeadersToClipboard(headers)"
			>
				Copy selected
			</SmartButton>
			<SmartButton
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
