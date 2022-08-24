<template>
	<input
		ref="input"
		type="file"
		v-bind="$attrs"
		:class="classes"
		@change="$emit('change', $event.target.files[0])"
	/>
</template>

<script>
export default {
	name: "FileInput",
	props: {
		accept: String,
		small: Boolean
	},
	emits: ["change"],
	computed: {
		classes() {
			return [
				"form-control",
				this.small && "form-control-sm"
			]
		}
	},
	methods: {
		clearInput() {
			this.$refs.input.value = ""
		}
	}
}
</script>
