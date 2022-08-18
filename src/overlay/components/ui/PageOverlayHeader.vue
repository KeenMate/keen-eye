<template>
	<h5 ref="drag" class="title user-select-none" style="cursor: grab">
		{{pageName ?? "Refresh page"}}
		<template v-if="requestInfo?.response?.statusCode && time">
			(<b>{{requestInfo?.response?.statusCode}}</b> in
			{{time ? time + "ms" : "refresh"}})
		</template>
	</h5>
</template>

<script>
export default {
	name: "PageOverlayHeader"
}
</script>

<style scoped>

</style>
