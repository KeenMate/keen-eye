<template>
	<form
		class="transformation-form"
		@submit.stop.prevent="onSubmit"
		@change.stop.prevent
	>
		<div class="form-group">
			<label>Header Rule</label>
			<input
				v-model="transformation.headerRule"
				type="text"
				class="form-control"
			>
		</div>

		<div class="form-group">
			<label>Url</label>
			<input
				v-model="transformation.url"
				type="text"
				class="form-control"
			>
		</div>

		<div class="d-flex justify-content-end">
			<button
				type="submit"
				class="btn btn-success btn-sm"
			>
				<template v-if="isNew">
					Add
				</template>
				<template v-else>
					Save
				</template>
			</button>
		</div>

		<p
			v-show="!formValid"
			class="help-text"
		>
			Both header and url need to be filled
		</p>
	</form>
</template>

<script>
import {UrlTransformation} from "@/transformations/urlTransformation"

export default {
	name: "TransformationForm",
	emits: ["submit"],
	props: {
		value: UrlTransformation,
		isNew: Boolean
	},
	data() {
		return {
			transformation: new UrlTransformation()
		}
	},
	computed: {
		touched() {
			return [
				"headerRule",
				"url"
			].some(key => this.transformation[key] !== this.value[key])
		},
		formValid() {
			return !this.touched
				|| (this.transformation.headerRule && this.transformation.url)
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.transformation = new UrlTransformation(val.headerRule, val.url)
				this.transformation.transformationId = val.transformationId
			}
		}
	},
	methods: {
		onSubmit() {
			if (!this.transformation.headerRule || !this.transformation.url)
				return

			this.$emit("submit", this.transformation)
		}
	}
}
</script>

<style scoped>

</style>
