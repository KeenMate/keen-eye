<template>
	<div class="transformations-list badge-list mb-3">
		<template v-if="transformations?.length">
			<Badge
				v-for="(transformation, idx) of transformations"
				:key="transformation.transformationId"
				:color="getBadgeColor(transformation, idx)"
				class="user-select-none"
				@click="$emit('edit-transformation', transformation)"
			>
				{{transformation.headerRule}} |
				<i
					class="las la-trash"
					@click.stop="$emit('delete-transformation', transformation)"
				/>
			</Badge>

			<button
				class="btn btn-success btn-sm"
				title="Add new transformation"
				@click="$emit('new-transformation')"
			>
				<i class="las la-plus" />
			</button>
		</template>
		<p v-else>
			<Badge pill>
				No header rules
			</Badge>
		</p>
	</div>
</template>

<script>
import Badge from "@/components/ui/badge/Badge"
import {getBadgeColor} from "@/helpers/bootstrap-helpers"

export default {
	name: "TransformationsList",
	components: {Badge},
	props: {
		transformations: Array,
		currentTransformationId: Symbol,
		isNew: Boolean
	},
	emits: ["edit-transformation", "new-transformation", "delete-transformation"],
	methods: {
		getBadgeColor(transformation, idx) {
			return transformation.transformationId === this.currentTransformationId
				&& getBadgeColor(idx)
				|| "secondary"
		}
	}
}
</script>
