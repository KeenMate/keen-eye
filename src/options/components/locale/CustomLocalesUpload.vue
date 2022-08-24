<template>
	<div class="custom-locales-upload mb-3">
		<label for="custom-locales-file">
			Custom locales
			<template v-if="isCustom">
				(Uploaded {{localesCount}})
			</template>
		</label>
		<div class="input-group">
			<FileInput
				id="custom-locales-file"
				ref="fileInput"
				accept="application/json"
				small
				@change="onLocaleFileSelected"
			/>
			<SmartButton
				v-if="isCustom"
				color="danger"
				title="Removes custom locales"
				small
				@click="$emit('remove-custom-locales')"
			>
				<i class="las la-trash" />
			</SmartButton>
		</div>
	</div>
</template>

<script>
import {readTextFile} from "@/helpers/file-helpers"
import {sortLocaleCategories} from "@/helpers/locale-helpers"
import FileInput from "@/components/form/FileInput"
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "CustomLocalesUpload",
	components: {SmartButton, FileInput},
	emits: [
		"set-custom-locales",
		"remove-custom-locales"
	],
	props: {
		customLocales: Array
	},
	watch: {
		customLocales: {
			immediate: true,
			handler(val) {
				console.log("Custom locales changed in customlocalesupload", val)
			}
		}
	},
	computed: {
		isCustom() {
			return !!this.customLocales?.length
		},
		localesCount() {
			if (!this.customLocales)
				return 0

			if (this.customLocales[0]?.category)
				return this.customLocales.reduce((acc, locale) => {
					return acc + locale.locales.length
				}, 0)
			else
				return this.customLocales.length
		}
	},
	methods: {
		async onLocaleFileSelected(file) {
			if (file.size > 102400) return

			try {
				const content = await readTextFile(file)
				const parsedContent = JSON.parse(content)
				const locales = (parsedContent[0]?.category && parsedContent) || [
					{
						category: "Custom locales",
						locales: parsedContent
					}
				]

				this.$emit("set-custom-locales", sortLocaleCategories(locales))
			} catch (error) {
				console.error(
					"Could not read text file for locales import",
					error,
					file
				)
				this.error = error
			} finally {
				this.$refs.fileInput.clearInput()
			}
		}
	}
}
</script>

<style scoped>

</style>
