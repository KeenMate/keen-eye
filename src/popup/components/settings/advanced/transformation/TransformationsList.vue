<template>
	<div class="transformations-list">
		<template v-if="transformations?.length">
			<Badge
				v-for="(transformation, idx) of transformations"
				:key="transformation.transformationId"
				:color="getBadgeColor(idx)"
				pill
				@click="$emit('edit-transformation', transformation)"
			>
				{{transformation.headerRule}} |
				<i class="las la-trash" @click.stop="$emit('delete-transformation', transformation)"></i>
			</Badge>

			<Badge color="success" @click="$emit('new-transformation')">
				Add new
			</Badge>
		</template>
		<p v-else>
			<Badge pill>No header rules</Badge>
		</p>
	</div>
</template>

<script>
import Badge from "@/components/ui/Badge"

const BadgeColors = [
	"primary",
	"secondary",
	"success",
	"danger",
	"warning",
	"info",
	"light",
	"dark"
]

export default {
	name: "TransformationsList",
	components: {Badge},
	emits: ["edit-transformation", "new-transformation", "delete-transformation"],
	props: {
		transformations: Array,
		currentTransformationId: Symbol,
		isNew: Boolean
	},
	methods: {
		getBadgeColor(idx) {
			const color = BadgeColors[idx % BadgeColors.length]

			return this.currentTransformationId
				&& this.transformations[idx].transformationId === this.currentTransformationId
				&& `outline-${color}`
				|| color
		}
	}
}
</script>

<style lang="scss" scoped>
	.transformations-list {
		display: flex;
		gap: .25rem;
		flex-wrap: wrap;

		.badge {
			font-size: 1em;

			&:hover {
				cursor: pointer;
			}
		}
	}
</style>
