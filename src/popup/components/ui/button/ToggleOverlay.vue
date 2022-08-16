<template>
	<ToggleButton
		:state="overlayVisible"
		on-color="btn-success"
		off-color="btn-danger"
		class="btn-icon"
		:title="tooltip"
		@click="$emit('toggle')"
	>
		<template #on>
			<i class="las la-eye" />
		</template>
		<template #off>
			<i class="las la-eye-slash" />
		</template>
	</ToggleButton>
</template>

<script>
import ToggleButton from "@/components/ui/button/ToggleButton"
export default {
	name: "ToggleOverlay",
	components: {ToggleButton},
	emits: ["toggle"],
	props: {
		overlayVisible: Boolean
	},
	computed: {
		tooltip() {
			return `${this.overlayVisible && "Hides" || "Shows"} keen-eye page overlay`
		}
	}
}
</script>

<style scoped>

</style>
