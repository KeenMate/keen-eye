<template>
	<button
		:class="buttonClasses"
		@click="$emit('click', $event)"
	>
		<template v-if="state">
			<slot name="on" />
		</template>
		<template v-else>
			<slot
				name="off"
			/>
		</template>
	</button>

</template>

<script>
export default {
	name: "ToggleButton",
	props: {
		state: Boolean,
		onColor: String,
		offColor: String
	},
	computed: {
		buttonClasses() {
			return [
				"btn",
				this.state
					? this.onColor
					: this.offColor
			]
		}
	}
}
</script>

<style scoped>

</style>
