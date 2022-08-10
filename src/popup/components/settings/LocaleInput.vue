<template>
	<div class="form-group">
		<label>Locale</label>
		<div class="input-group" @keyup.esc.stop>
			<multiselect
				:value="locale"
				:options="locales"
				track-by="code"
				label="name"
				:custom-label="customLabel"
				group-values="languages"
				group-label="type"
				class="form-control form-control-sm"
				:multiple="false"
				@select="$emit('input', $event)"
			/>
			<div class="input-group-append">
				<button
					class="btn btn-danger"
					@click="$emit('remove-locale')"
				>
					Remove
				</button>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label for="custom-locales-file">
			Custom locales
		</label>
		<div class="d-flex justify-content-between small-gaps">
			<FileInput
				ref="fileInput"
				id="custom-locales-file"
				accept="application/json, text/plain"
				@change="onLocaleFileSelected"
			/>
			<button
				class="btn btn-danger"
				title="Removes custom locales to see default ones"
				@click="$emit('remove-custom-locales')"
			>
				Remove
			</button>
		</div>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect"
import {readTextFile} from "@/helpers/file-helpers"
import FileInput from "@/components/form/FileInput"

export default {
	name: "LocaleInput",
	emits: ["input", "remove-locale", "set-custom-locales", "remove-custom-locales"],
	components: {FileInput, Multiselect},
	props: {
		locale: Object,
		locales: Array
	},
	data() {
		return {
			error: null
		}
	},
	watch: {
		locales(val) {
			console.log("LocaleInput: all locales changed", val)
		},
		locale(val) {
			console.log("LocaleInput: locale changed", val)
		}
	},
	methods: {
		async onLocaleFileSelected(file) {
			if (file.size > 102400)
				return

			try {
				const content = await readTextFile(file)
				const parsedContent = [
					{
						type: "Custom locales",
						languages: JSON.parse(content)
					}
				]

				this.$emit("set-custom-locales", parsedContent)
			} catch (error) {
				console.error("Could not read text file for locales import", error, file)
				this.error = error
			} finally {
				this.$refs.fileInput.clearInput()
			}
		},
		customLabel(object) {
			console.log("LocaleInput: custom label", object)
			return `[${object.code}] ${object.name}`
		}
	}
}
</script>

<style lang="scss" scoped>
.small-gaps {
	gap: .5rem
}
</style>
