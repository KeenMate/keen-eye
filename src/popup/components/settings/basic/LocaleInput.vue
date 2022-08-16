<template>
	<div class="form-group">
		<label>Locale</label>
		<div
			class="input-group"
			@keyup.esc.stop
		>
			<multiselect
				:model-value="locale"
				:options="locales"
				track-by="code"
				label="name"
				:custom-label="customLabel"
				group-values="locales"
				group-label="category"
				class="form-control form-control-sm"
				:multiple="false"
				@update:model-value="$emit('input', $event)"
			/>
			<div class="input-group-append">
				<button
					class="btn btn-danger"
					@click="$emit('remove-locale')"
				>
					<i class="las la-trash" />
				</button>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label for="custom-locales-file">
			Custom locales
			<template v-if="isCustom">
				(Uploaded {{localesCount}})
			</template>
		</label>
		<div class="d-flex justify-content-between small-gaps">
			<FileInput
				id="custom-locales-file"
				ref="fileInput"
				accept="application/json, text/plain"
				@change="onLocaleFileSelected"
			/>
			<button
				v-if="isCustom"
				class="btn btn-danger"
				title="Removes custom locales to see default ones"
				@click="$emit('remove-custom-locales')"
			>
				<i class="las la-trash" />
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
	components: {FileInput, Multiselect},
	props: {
		locale: Object,
		locales: {type: Array, default: () => []},
		isCustom: Boolean
	},
	emits: [
		"input",
		"remove-locale",
		"set-custom-locales",
		"remove-custom-locales"
	],
	computed: {
		localesCount() {
			if (!this.locales)
				return 0

			if (this.locales[0]?.category)
				return this.locales.reduce((acc, locale) => {
					return acc + locale.locales.length
				}, 0)
			else
				return this.locales.length
		}
	},
	data() {
		return {
			error: null
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

				this.$emit("set-custom-locales", locales)
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
		},
		customLabel(object) {
			return `[${object.code}] ${object.name}`
		}
	}
}
</script>

<style lang="scss" scoped>
.small-gaps {
	gap: 0.5rem;
}
</style>
