<template>
	<Card>
		<template #header>Settings</template>

		<h5>Actions</h5>
		<SmartButton color="danger" @click="clearStorage">
			Clear storage
		</SmartButton>

		<CustomLocalesUpload />
	</Card>
</template>

<script>
import storageProvider from "@/settings/storageProvider"
import SmartButton from "@/components/ui/button/SmartButton"
import Card from "@/components/ui/card/Card"
import CustomLocalesUpload from "@/options/components/locale/CustomLocalesUpload"

export default {
	name: "Settings",
	components: {CustomLocalesUpload, Card, SmartButton},
	methods: {
		async clearStorage() {
			await storageProvider.clear()
		}
	}
}
</script>

<style scoped>

</style>
