<template>
	<div class="locale-input mb-3">
		<label>
			Locale
			<template v-if="isCustom">
				(Uploaded {{localesCount}})
			</template>
		</label>
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
				:max-height="500"
				open-direction="bottom"
				:multiple="false"
				@update:model-value="$emit('input', $event)"
			/>
			<SmartButton
				color="danger"
				icon
				@click="$emit('remove-locale')"
			>
				<i class="las la-trash" />
			</SmartButton>
			<SmartButton
				color="primary"
				title="Opens settings page where you can upload custom set of languages"
				icon
				@click="showOptions"
			>
				<i class="las la-edit" />
			</SmartButton>
		</div>
	</div>
</template>

<script>
import Multiselect from "vue-multiselect"
import {readTextFile} from "@/helpers/file-helpers"
import {sortLocaleCategories} from "@/helpers/locale-helpers"
import SmartButton from "@/components/ui/button/SmartButton"
import {openOptionsInNewTab} from "@/providers/chromeApiProvider"

export default {
	name: "LocaleInput",
	components: {SmartButton, Multiselect},
	props: {
		locale: Object,
		locales: {type: Array, default: () => []},
		isCustom: Boolean
	},
	emits: [
		"input",
		"remove-locale"
	],
	data() {
		return {
			error: null
		}
	},
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
	watch: {
		locale(val) {
			console.log("Current locale from LocalesInput", val)
		},
		locales(val) {
			console.log("Current locales from LocalesInput", val)
		}
	},
	methods: {
		showOptions() {
			openOptionsInNewTab()
		},
		customLabel(object) {
			return `[${object.code}] ${object.name}`
		}
	}
}
</script>
