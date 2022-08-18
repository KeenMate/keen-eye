<template>
	<div class="headers-list badge-list mb-3">
		<template v-if="headerRules?.length">
			<Badge
				v-for="header of headerRules"
				:key="header"
				color="secondary"
				class="user-select-none"
			>
				{{header}} |
				<i
					class="las la-trash"
					@click.stop="deleteHeader(header)"
				/>
			</Badge>
		</template>
		<Badge v-else pill>
			No header rules
		</Badge>
	</div>
</template>

<script>
import Badge from "@/components/ui/badge/Badge"

export default {
	name: "HeaderRulesList",
	components: {Badge},
	emits: ["update"],
	props: {
		headerRules: Array
	},
	methods: {
		deleteHeader(header) {
			this.$emit("update", this.headerRules.filter(x => x !== header))
		}
	}
}
</script>
