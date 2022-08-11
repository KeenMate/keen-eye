<template>
	<div class="custom-file">
		<input
			ref="input"
			type="file"
			v-bind="$attrs"
			class="custom-file-input"
			@change="$emit('change', $event.target.files[0])"
		>
		<label
			class="custom-file-label"
			for="custom-file"
		>
			Select file
		</label>
	</div>
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

<style scoped>

</style>
