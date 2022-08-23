<template>
	<div class="overlay-actions d-flex align-items-center gap-2 px-2">
		<SwitchInput
			:model-value="useFilters"
			@update:model-value="$emit('update:use-filters', $event)"
		>
			<i class="las la-filter" />
		</SwitchInput>

		<LocaleSelector
			:locale="currentLocale"
			:locales="locales"
			@input="$emit('save-locale', $event)"
			@remove-locale="$emit('remove-locale', $event)"
		/>
		<SmartButton
			:class="saveButtonClasses"
			small
			icon
			@click="$emit('save-settings')"
		>
			<i class="las la-save" />
		</SmartButton>
	</div>
</template>

<script>
import SwitchInput from "@/components/form/SwitchInput"
import LocaleSelector from "@/overlay/components/LocaleSelector"
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "OverlayActions",
	components: {SmartButton, SwitchInput, LocaleSelector},
	props: {
		useFilters: Boolean,
		unsavedChanges: Boolean,
		currentLocale: Object,
		locales: Array
	},
	emits: [
		"save-settings",
		"save-locale",
		"remove-locale",
		"update:use-filters"
	],
	computed: {
		saveButtonClasses() {
			return [
				this.unsavedChanges
					&& "btn-primary"
					|| "btn-info"
			]
		}
	}
}
</script>
