<template>
	<div class="options-app container-fluid mt-3">
		<div class="row">
			<div class="col-lg-6">
				<Settings />
			</div>
		</div>
	</div>
</template>

<script>
import Settings from "@/options/components/settings/Settings"

export default {
	name: "OptionsApp",
	components: {Settings}
}
</script>

<style>
.options-app {

}
</style>
