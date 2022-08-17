<template>
	<button
		class="btn btn-icon btn-primary"
		@click="openFileDialog"
	>
		<slot />

		<input
			ref="fileInput"
			type="file"
			style="display: none"
			@change="fileSelected($event.target.files[0])"
		/>
	</button>
</template>

<script>
import {readTextFile} from "@/helpers/file-helpers"
import {getEmptySettings} from "@/settings/settingConstants"

export default {
	emits: ["import"],
	methods: {
		openFileDialog() {
			this.$refs.fileInput.click()
		},
		async fileSelected(file) {
			try {
				const content = await readTextFile(file)
				const parsedContent = JSON.parse(content)

				const validSettings = {...getEmptySettings(), ...parsedContent}

				this.$emit("import", validSettings)
			} catch (error) {
				console.error(
					"Could not read text file for settings import",
					error,
					file
				)
				this.error = error
			} finally {
				this.$refs.fileInput.value = ""
			}
		}
	}
}
</script>
