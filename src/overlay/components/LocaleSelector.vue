<template>
  <div class="form-horizontal">
    <div class="d-inline-block">
      <multiselect
        class="multiselect-sm overflow"
        @keyup.esc.stop
        v-model="seletedLocale"
        :options="langs"
        :multiple="false"
        track-by="code"
        label="name"
        placeholder="Select language"
        group-values="languages"
        group-label="type"
        :custom-label="customLabel"
        @remove="(val) => changeLocale(val)"
        @select="(val) => changeLocale(val)"
      ></multiselect>
    </div>

    <button class="btn btn-sm btn-danger" @click="changeLocale(null)">X</button>
  </div>
</template>

<script>
import languages from "@/languages/languages";
import Multiselect from "vue-multiselect";

export default {
  emits: ["change"],
  components: { Multiselect },
  data() {
    return {
      seletedLocale: null,
    };
  },
  props: {
    locale: {
      Type: Object,
    },
  },
  computed: {
    langs() {
      return languages ?? [];
    },
  },
  methods: {
    changeLocale(locale) {
      console.log(locale);
      this.$emit("change", locale);
    },
    customLabel(object) {
      return `[${object.code}] ${object.name}`;
    },
    mounted() {
      this.value = this.options.find((option) => option.id === this.id);
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
};
</script>
