<template>
	<div class="requests-list badge-list mb-3">
		<template v-if="requestsRules?.length">
			<Badge
				v-for="request of requestsRules"
				:key="request"
				color="secondary"
				class="user-select-none"
			>
				{{request}} |
				<i
					class="las la-trash"
					@click.stop="deleteRequest(request)"
				/>
			</Badge>
		</template>
		<Badge v-else pill>
			No request rules
		</Badge>
	</div>
</template>

<script>
import Badge from "@/components/ui/badge/Badge"

export default {
	name: "RequestsRulesList",
	components: {Badge},
	emits: ["update"],
	props: {
		requestsRules: Array
	},
	methods: {
		deleteRequest(request) {
			this.$emit("update", this.requestsRules.filter(x => x !== request))
		}
	}
}
</script>
