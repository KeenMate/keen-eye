<template>
	<td :class="cellClasses">
		{{statusCode || "-"}}
	</td>
</template>

<script>
export default {
	name: "StatusCodeBadge",
	props: {
		statusCode: Number
	},
	computed: {
		cellClasses() {
			return [
				"auto-width text-center",
				this.statusCode >= 200 && this.statusCode < 300
					&& "text-success",
				this.statusCode >= 300 && this.statusCode < 400
					&& "text-primary",
				this.statusCode >= 400 && this.statusCode < 500
					&& "text-danger",
				this.statusCode >= 500
					&& "text-bg-danger",
			]
		}
	}
}
</script>

<style scoped>

</style>
