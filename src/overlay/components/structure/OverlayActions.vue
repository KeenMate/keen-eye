<template>
	<div class="overlay-actions d-flex align-items-center justify-content-between gap-2 px-2">
		<CheckboxToggle
			:model-value="useFilters"
			title="Show only filtered values"
			@update:model-value="$emit('update:use-filters', $event)"
		>
			<i class="las la-filter" />
		</CheckboxToggle>

		<div class="d-flex align-items-center gap-2">
			<div class="locale-selector-parent">
				<LocaleSelector
					:locale="currentLocale"
					:locales="locales"
					@input="$emit('save-locale', $event)"
					@remove-locale="$emit('remove-locale', $event)"
				/>
			</div>
			<SmartButton
				:class="saveButtonClasses"
				small
				icon
				@click="$emit('save-settings')"
			>
				<i class="las la-save" />
			</SmartButton>
		</div>
	</div>
</template>

<script>
import LocaleSelector from "@/overlay/components/LocaleSelector"
import SmartButton from "@/components/ui/button/SmartButton"
import CheckboxToggle from "@/components/form/CheckboxToggle"

export default {
	name: "OverlayActions",
	components: {CheckboxToggle, SmartButton, LocaleSelector},
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

<style lang="scss">
@import "@/assets/css/common.scss";

.overlay-actions {
	.locale-selector-parent {
		$selector-min-width: 20em;
		$selector-max-width: 40em;

		min-width: $selector-min-width;
		max-width: $selector-max-width;

		.multiselect__single {
			@extend .text-ellipsis;

			max-width: $selector-max-width;
		}
	}
}
</style>
