<template>
	<button
		type="button"
		aria-label="Close"
		class="btn btn-link p-0"
	>
		<CloseIcon />
	</button>
</template>

<script>
import CloseIcon from "@/components/ui/icon/CloseIcon"

export default {
	name: "CloseButton",
	components: {CloseIcon}
}
</script>

<style scoped>

</style>
