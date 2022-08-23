<template>
	<div ref="root" class="dropdown">
		<SmartButton
			type="button"
			class="dropdown-toggle"
			v-bind="$attrs"
			data-bs-toggle="dropdown"
			aria-expanded="false"
			@click="onToggle"
		>
			<slot />
		</SmartButton>
		<ul :class="dropdownContentClasses">
			<slot name="dropdown" />
		</ul>
	</div>
</template>

<script>
import SmartButton from "@/components/ui/button/SmartButton"
export default {
	name: "DropdownButtons",
	components: {SmartButton},
	inheritAttrs: false,
	emits: ["click"],
	computed: {
		dropdownContentClasses() {
			return [
				"dropdown-menu",
				this.dropdownVisible && "show"
			]
		}
	},
	data() {
		return {
			dropdownVisible: false,
			windowClickHandler: null
		}
	},
	methods: {
		onToggle() {
			// the following code is just because of browser triggering and not cleaning properly create event listeners

			this.removeWindowClickEventListener()

			this.windowClickHandler = function (ev) {
				if (this.$refs.root.contains(ev.target))
					return

				this.removeWindowClickEventListener()

				this.toggleVisibility(false)

				this.windowClickHandler = null
			}.bind(this)

			this.toggleVisibility(true)

			window.requestAnimationFrame(() => {
				window.addEventListener("click", this.windowClickHandler)
			})
		},
		removeWindowClickEventListener() {
			if (this.windowClickHandler)
				window.removeEventListener("click", this.windowClickHandler)
		},
		toggleVisibility(visible = !this.dropdownVisible) {
			this.dropdownVisible = visible
		}
	}
}
</script>

<style scoped>

</style>
