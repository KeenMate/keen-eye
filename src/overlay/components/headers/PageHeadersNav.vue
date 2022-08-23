<template>
	<div class="d-flex align-items-center gap-2 py-1 px-2">
		<h6 class="mb-0">
			Response headers
		</h6>

		<div class="actions btn-group">
			<DropdownButtons
				color="info"
				small
				icon
				@click="copyHeadersToClipboard(headers)"
			>
				<i class="las la-copy" />

				<template #dropdown>
					<DropdownButtonItem @click="copyHeadersToClipboard(allHeaders)">
						Copy All
					</DropdownButtonItem>
				</template>
			</DropdownButtons>
		</div>
	</div>
</template>

<script>
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import DropdownButtons from "@/components/ui/button/DropdownButtons"
import DropdownButtonItem from "@/components/ui/button/DropdownButtonItem"

export default {
	name: "PageHeadersNav",
	components: {DropdownButtonItem, DropdownButtons},
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
