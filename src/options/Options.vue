<template>
	<div class="options-app">
		<div class="row">
			<div class="col-lg-6">
				<Settings />
			</div>
			<!--<div class="col-lg-6"></div>-->
		</div>
	</div>
</template>

<script>
import Settings from "@/options/components/Settings"

export default {
	name: "Options",
	components: {Settings}
}
</script>

<style>
.options-app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
