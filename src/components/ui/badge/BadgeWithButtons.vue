<template>
	<div class="input-group d-inline-flex">
		<slot name="before" />
		<Badge
			v-bind="badgeAttrs"
			class="form-control form-control-sm"
		>
			<slot />
		</Badge>

		<slot name="after" />
	</div>
</template>

<script>
import Badge from "@/components/ui/badge/Badge"

export default {
	name: "BadgeWithButtons",
	components: {Badge},
	computed: {
		badgeAttrs() {
			const prefix = "badge-"
			return Object.keys(this.$attrs)
				.filter(x => x.startsWith(prefix))
				.reduce((acc, key) => {
					acc[key.substring(prefix.length)] = this.$attrs[key]
					return acc
				}, {})
		}
	}
}
</script>

<style lang="scss" scoped>
.input-group {
	width: auto !important;
}
</style>
