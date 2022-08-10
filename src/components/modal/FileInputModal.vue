<template>
	<div ref="rootElement" class="modal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">
						{{title}}
					</h5>
				</div>
				<div class="modal-body">
					<FileInput @change="file = $event" />
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-primary"
						:disabled="!fileValid"
						@click="onSubmit"
					>
						Submit file
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import FileInput from "@/components/form/FileInput"
export default {
	name: "FileInputModal",
	components: {FileInput},
	props: {
		title: String,
		maxSize: Number,
		accept: String
	},
	computed: {
		fileValid() {
			return this.file
				&& (!this.maxSize || this.file.size <= this.maxSize)
		}
	},
	data() {
		return {
			file: null
		}
	},
	methods: {
		toggleModal() {
			console.log("Toggling modal", $(this.$refs.rootElement))
			$(this.$refs.rootElement).modal("toggle")
		},
		onSubmit() {
			if (!this.fileValid)
				return

			this.$emit("submit", this.file)
		}
	}
}
</script>

<style scoped>

</style>
