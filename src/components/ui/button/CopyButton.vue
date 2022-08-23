<template>
	<SmartButton
		color="info"
		:icon="icon"
	>
		<i class="las la-copy" />
	</SmartButton>
</template>

<script>
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "CopyButton",
	components: {SmartButton},
	props: {
		icon: {
			type: Boolean,
			default: true
		}
	}
}
</script>

<style scoped>

</style>
