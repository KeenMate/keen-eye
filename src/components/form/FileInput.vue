<template>
	<input
		ref="input"
		type="file"
		v-bind="$attrs"
		class="form-control"
		@change="$emit('change', $event.target.files[0])"
	/>
</template>

<script>
export default {
	name: "FileInput",
	props: {
		accept: String
	},
	emits: ["change"],
	methods: {
		clearInput() {
			this.$refs.input.value = ""
		}
	}
}
</script>
