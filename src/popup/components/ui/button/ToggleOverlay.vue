<template>
	<ToggleButton
		:state="overlayVisible"
		on-color="btn-danger"
		off-color="btn-success"
		class="btn-icon"
		:title="tooltip"
		@click="$emit('toggle')"
	>
		<template #on>
			<i class="las la-eye-slash" />
		</template>
		<template #off>
			<i class="las la-eye" />
		</template>
	</ToggleButton>
</template>

<script>
import ToggleButton from "@/components/ui/button/ToggleButton"
export default {
	name: "ToggleOverlay",
	components: {ToggleButton},
	props: {
		overlayVisible: Boolean
	},
	emits: ["toggle"],
	computed: {
		tooltip() {
			return `${this.overlayVisible && "Hides" || "Shows"} keen-eye page overlay`
		}
	}
}
</script>

<style scoped>

</style>
