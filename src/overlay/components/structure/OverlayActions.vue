<template>
	<div class="overlay-actions container d-flex gap-2 mb-3">
		<SwitchInput :model-value="useFilters" @update:model-value="$emit('update:use-filters', $event)">
			<i class="las la-filter" />
		</SwitchInput>

		<button
			class="btn btn-sm btn-icon"
			:class="saveButtonClasses"
			@click="$emit('save-settings')"
		>
			<i class="las la-save" />
		</button>
		<LocaleSelector
			:locale="currentLocale"
			:locales="locales"
			@input="$emit('save-locale', $event)"
			@remove-locale="$emit('remove-locale', $event)"
		/>
	</div>
</template>

<script>
import SwitchInput from "@/components/form/SwitchInput"
import LocaleSelector from "@/overlay/components/LocaleSelector"

export default {
	name: "OverlayActions",
	components: {SwitchInput, LocaleSelector},
	emits: [
		"save-settings",
		"save-locale",
		"remove-locale"
	],
	props: {
		useFilters: Boolean,
		unsavedChanges: Boolean,
		currentLocale: Object,
		locales: Array
	},
	computed: {
		saveButtonClasses() {
			return [
				this.unsavedChanges
					&& "btn-success"
					|| "btn-secondary"
			]
		}
	}
}
</script>
