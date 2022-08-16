<template>
	<div class="settings-actions d-flex justify-content-between">
		<div class="btn-group">
			<button
				:class="[...buttonClasses, 'btn-info']"
				title="Exports current settings"
				@click="$emit('start-download')"
			>
				<i class="las la-download" />
			</button>
			i
			<HiddenFileInput
				title="Imports settings from file"
				@import="$emit('import-settings', $event)"
			>
				<i class="las la-upload" />
			</HiddenFileInput>
		</div>

		<div class="btn-group">
			<ToggleOverlay
				:overlay-visible="currentSettings?.inject"
				@toggle="$emit('toggle-overlay')"
			/>
			<button
				:class="[...buttonClasses, 'btn-info']"
				title="Refreshes settings"
				@click="$emit('refresh-settings')"
			>
				<i class="las la-sync" />
			</button>

			<button
				:class="[...buttonClasses, 'btn-danger']"
				title="Delete custom settings"
				@click="onDeleteSettings"
			>
				<i class="las la-trash" />
			</button>
			<button
				:class="[...buttonClasses, 'btn-warning']"
				title="Resets overlay's position to default (top-left corner)"
				@click="$emit('reset-div')"
			>
				<i class="las la-redo-alt" />
			</button>
			<!--<button-->
			<!--	:class="[...buttonClasses, 'btn-info']"-->
			<!--	title="Downloads settings in JSON format"-->
			<!--	@click="$emit('start-download')"-->
			<!--&gt;-->
			<!--	<i class="las la-download" />-->
			<!--</button>-->
		</div>
	</div>
</template>

<script>
import HiddenFileInput from "../HiddenFileInput.vue"
import ToggleOverlay from "@/popup/components/ui/button/ToggleOverlay"


export default {
	name: "SettingsActions",
	components: {ToggleOverlay, HiddenFileInput},
	props: {
		currentSettings: Boolean
	},
	emits: [
		"reset-div",
		"delete",
		"refresh-settings",
		"toggle-overlay",
		"start-download",
		"import-settings"
	],
	data() {
		return {
			buttonClasses: ["btn btn-icon"]
		}
	},
	methods: {
		onDeleteSettings() {
			if (!confirm("Do you really want to delete these settings?")) return

			this.$emit("delete")
		}
	}
}
</script>

<style lang="scss" scoped>
.settings-actions {
	gap: 0.5em;
}
</style>
