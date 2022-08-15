<template>
	<div class="btn-group">
		<!--<button-->
		<!--	class="btn-success btn form-control-sm btn-sm"-->
		<!--	@click="saveSettings"-->
		<!--&gt;-->
		<!--	Save-->
		<!--</button>-->

		<HiddenFileInput
			title="Imports settings from file"
			@import="$emit('import-settings', $event)"
		>
			<i class="las la-file-import" />
		</HiddenFileInput>
		<button
			:class="[...buttonClasses, 'btn-info']"
			title="Exports current settings"
			@click="$emit('start-download')"
		>
			<i class="las la-cloud-download-alt" />
		</button>
		<button
			:class="[...buttonClasses, 'btn-info']"
			title="Refreshes settings"
			@click="$emit('refresh-settings')"
		>
			<i class="las la-sync" />
		</button>
		<button
			:class="[...buttonClasses, 'btn-primary', overlayVisible ? 'btn-danger' : 'btn-success']"
			title="Toggles visibility of page overlay"
			@click="$emit('toggle-injection')"
		>
			<i
				v-if="overlayVisible"
				class="las la-eye-slash"
			/>
			<i
				v-else
				class="las la-eye"
			/>
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
		<button
			:class="[...buttonClasses, 'btn-info']"
			title="Downloads settings in JSON format"
			@click="$emit('start-download')"
		>
			<i class="las la-download" />
		</button>
	</div>
</template>

<script>
import HiddenFileInput from "../HiddenFileInput.vue"

export default {
	name: "SettingsActions",
	components: {HiddenFileInput},
	props: {
		overlayVisible: Boolean
	},
	emits: [
		"reset-div",
		"delete",
		"toggle-injection",
		"refresh-settings",
		"start-download",
		"import-settings"
	],
	data() {
		return {
			buttonClasses: ["btn"]
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

<style scoped></style>
