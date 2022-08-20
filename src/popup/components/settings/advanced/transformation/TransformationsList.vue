<template>
	<div class="transformations-list badge-list mb-3">
		<template v-if="transformations?.length">
			<BadgeWithButtons
				v-for="(transformation, idx) of transformations"
				:key="transformation.transformationId"
				:badge-color="getBadgeColor(transformation, idx)"
				badge-class="user-select-none"
				@click="$emit('edit-transformation', transformation)"
			>
				{{transformation.headerRule}}
				<template #after>
					<SmartButton
						color="danger"
						small
						icon
						@click="$emit('delete-transformation', transformation)"
					>
						<i class="las la-trash" />
					</SmartButton>
				</template>
			</BadgeWithButtons>

			<SmartButton
				color="success"
				title="Add new transformation"
				small
				icon
				@click="$emit('new-transformation')"
			>
				<i class="las la-plus" />
			</SmartButton>
		</template>
		<Badge v-else>
			No header rules
		</Badge>
	</div>
</template>

<script>
import Badge from "@/components/ui/badge/Badge"
import {getBadgeColor} from "@/helpers/bootstrap-helpers"
import BadgeWithButtons from "@/components/ui/badge/BadgeWithButtons"
import SmartButton from "@/components/ui/button/SmartButton"

export default {
	name: "TransformationsList",
	components: {SmartButton, BadgeWithButtons, Badge},
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
