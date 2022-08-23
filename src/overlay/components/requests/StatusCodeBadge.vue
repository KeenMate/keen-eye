<template>
	<span :class="badgeClasses">
		{{statusCode}}
	</span>
	<!--<Badge :class="badgeClasses">-->
	<!--	{{statusCode}}-->
	<!--</Badge>-->
</template>

<script>
// import Badge from "@/components/ui/badge/Badge"

export default {
	name: "StatusCodeBadge",
	// components: {Badge},
	props: {
		statusCode: Number
	},
	computed: {
		badgeClasses() {
			if (this.statusCode >= 200 && this.statusCode < 300)
				return "text-success"
			if (this.statusCode >= 300 && this.statusCode < 400)
				return "text-primary"
			if (this.statusCode >= 400 && this.statusCode < 500)
				return "text-danger"
			if (this.statusCode >= 500)
				return "text-bg-danger"

			return ""
		}
	}
}
</script>

<style scoped>

</style>
