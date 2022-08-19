<template>
	<h5
		ref="drag"
		class="title user-select-none mb-0"
		style="cursor: grab"
	>
		{{ pageName ?? "Refresh page" }}
		<template v-if="statusCode && taken">
			(<b>{{ statusCode }}</b> in
			{{ taken ? taken + "ms" : "refresh" }})
		</template>
	</h5>
</template>

<script>
export default {
	name: "PageOverlayHeader",
	props: {
		pageName: String,
		statusCode: Number,
		taken: Number
	}
}
</script>

<style scoped>

</style>
