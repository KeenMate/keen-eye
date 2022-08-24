<template>
	<div class="card">
		<h5 class="card-header">
			<slot name="header" />
		</h5>
		<div class="card-body">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: "Card"
}
</script>

<style scoped>

</style>
