<template>
	<div class="requests-list badge-list mb-3">
		<template v-if="requestsRules?.length">
			<BadgeWithButtons
				v-for="request of requestsRules"
				:key="request"
				:title="request"
				badge-color="secondary"
				badge-class="user-select-none"
			>
				<span
					class="text-ellipsis"
					style="max-width: 20em"
				>
					{{request}}
				</span>
				<template #after>
					<CopyButton
						small
						@click="copyValue(request)"
					/>
					<SmartButton
						color="danger"
						small
						icon
						@click="deleteRequest(request)"
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
			No request rules
		</Badge>
	</div>
</template>

<script>
import Badge from "@/components/ui/badge/Badge"
import SmartButton from "@/components/ui/button/SmartButton"
import BadgeWithButtons from "@/components/ui/badge/BadgeWithButtons"
import {copyTextToClipboard} from "@/helpers/clipboardHelper"
import CopyButton from "@/components/ui/button/CopyButton"

export default {
	name: "RequestsRulesList",
	components: {CopyButton, BadgeWithButtons, SmartButton, Badge},
	props: {
		requestsRules: Array
	},
	emits: ["update"],
	methods: {
		copyValue(value) {
			copyTextToClipboard(value)
		},
		deleteRequest(request) {
			this.$emit("update", this.requestsRules.filter(x => x !== request))
		}
	}
}
</script>

<style lang="scss" scoped>
.requests-list {
	.input-group {
		max-width: calc(50% - (.25rem / 2));
	}
}
</style>
