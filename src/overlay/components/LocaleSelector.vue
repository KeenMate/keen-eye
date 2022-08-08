<template>
	<div class="form-horizontal">
		<div class="d-inline-block">
			<multiselect
				v-model="seletedLocale"
				:options="langs"
				:custom-label="customLabel"
				class="multiselect-sm overflow"
				track-by="code"
				label="name"
				placeholder="Select language"
				group-values="languages"
				group-label="type"
				:show-labels="false"
				:multiple="false"
				@keyup.esc.stop
				@remove="(val) => changeLocale(val)"
				@select="(val) => changeLocale(val)"
			/>
		</div>

		<button
			class="btn btn-sm btn-danger"
			@click="changeLocale(null)"
		>
			X
		</button>
	</div>
</template>

<script>
import languages from "@/languages/languages";
import Multiselect from "vue-multiselect";

export default {
	components: { Multiselect },
	props: {
		locale: {
			Type: Object,
		},
	},
	emits: ["change"],
	data() {
		return {
			seletedLocale: null,
		};
	},
	computed: {
		langs() {
			return languages ?? [];
		},
	},
	mounted() {
		if (!this.locale || !this.locale?.code) {
			return;
		}
		console.log(this.locale);
		this.langs.forEach((group) => {
			group.languages.forEach((lang) => {
				if (lang.code == this.locale.code) {
					this.seletedLocale = lang;
				}
			});
		});
	},
	methods: {
		changeLocale(locale) {
			console.log(locale);
			this.$emit("change", locale);
			this.seletedLocale = locale
		},
		customLabel(object) {
			return `[${object.code}] ${object.name}`;
		},
		mounted() {
			this.value = this.options.find((option) => option.id === this.id);
		},
	},
};
</script>
