<template>
	<div class="btn-group">
		<!--<button-->
		<!--	class="btn-success btn form-control-sm btn-sm"-->
		<!--	@click="saveSettings"-->
		<!--&gt;-->
		<!--	Save-->
		<!--</button>-->

		<HiddenFileInput @import="$emit('import-settings', $event)">
			import
		</HiddenFileInput>
		<button
			class="btn-info btn form-control-sm btn-sm"
			@click="$emit('start-download')"
		>
			download
		</button>
		<button
			class="btn-info btn form-control-sm btn-sm"
			@click="$emit('refresh-settings')"
		>
			Refresh
		</button>
		<button
			class="btn-primary btn form-control-sm btn-sm"
			:class="overlayVisible ? 'btn-danger' : 'btn-success'"
			@click="$emit('toggle-injection')"
		>
			{{ overlayVisible ? "Hide" : "Show" }}
		</button>
		<button
			class="btn-danger btn form-control-sm btn-sm"
			@click="onDeleteSettings"
		>
			Delete
		</button>
		<!--<button-->
		<!--	class="btn-muted btn form-control-sm btn-sm"-->
		<!--	@click="copySettings"-->
		<!--&gt;-->
		<!--	D-->
		<!--</button>-->
		<button
			class="btn-warning btn form-control-sm btn-sm"
			:title="overlayPosition"
			@click="$emit('reset-div')"
		>
			Reset overlay position
		</button>
	</div>
</template>

<script>
import HiddenFileInput from "../HiddenFileInput.vue"

export default {
	name: "SettingsActions",
	components: { HiddenFileInput },
	props: {
		overlayPosition: Object,
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
	methods: {
		onDeleteSettings() {
			if (!confirm("Do you really want to delete these settings?")) return

			this.$emit("delete")
		}
	}
}
</script>

<style scoped></style>
