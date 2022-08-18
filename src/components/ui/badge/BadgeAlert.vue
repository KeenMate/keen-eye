<template>
	<span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
		<slot />
    <span class="visually-hidden">
	    <slot name="screen-reader" />
    </span>
  </span>
</template>

<script>
export default {
	name: "BadgeAlert"
}
</script>

<style scoped>

</style>
