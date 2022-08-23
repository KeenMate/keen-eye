<template>
	<div class="headers-list badge-list mb-3">
		<template v-if="headerRules?.length">
			<BadgeWithButtons
				v-for="header of headerRules"
				:key="header"
				badge-color="secondary"
				badge-class="user-select-none"
			>
				{{header}}

				<template #after>
					<SmartButton
						color="danger"
						small
						icon
						@click.stop="deleteHeader(header)"
					>
						<i class="las la-trash" />
					</SmartButton>
				</template>
			</BadgeWithButtons>
		</template>
		<Badge
v-else
color="secondary"
>
			No header rules
		</Badge>
	</div>
</template>

<script>
import Badge from "@/components/ui/badge/Badge"
import SmartButton from "@/components/ui/button/SmartButton"
import BadgeWithButtons from "@/components/ui/badge/BadgeWithButtons"

export default {
	name: "HeaderRulesList",
	components: {BadgeWithButtons, SmartButton, Badge},
	props: {
		headerRules: Array
	},
	emits: ["update"],
	methods: {
		deleteHeader(header) {
			this.$emit("update", this.headerRules.filter(x => x !== header))
		}
	}
}
</script>

<style lang="scss" scoped>
.header-rules {
	.input-group {
		width: auto !important;
	}
}
</style>
