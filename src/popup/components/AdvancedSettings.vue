<template>
  Url tranformation
  <div class="form-group">
    <label>Header Rule</label>

    <input
      class="form-control"
      type="text"
      name="headerName"
      v-model="headerRule"
    />
  </div>
  <div class="form-group">
    <label>Url</label>
    <input class="form-control" type="text" name="url" v-model="url" />
  </div>
  <button class="btn btn-primary" @click="update">Presave</button>
</template>
<script>
import { UrlTransformation } from "@/transformations/urlTransformation";
export default {
  name: "AdvancedSettings",
  emits: ["input", "change"],
  data() {
    return {
      headerRule: null,
      url: null,
    };
  },
  props: {
    selectedSettings: {
      type: Object,
      required: true,
    },
    requestInfo: {
      type: Object,
      required: true,
    },
  },
  watch: {
    selectedSettings(newVal) {
      console.log("selected settings changed");

      let tranformation = newVal?.transformations?.[0];
      if (tranformation) {
        this.headerRule = tranformation.headerRule;
        this.url = tranformation.url;
      }
    },
  },
  methods: {
    update() {
      let settingsCopy = { ...this.selectedSettings };
      settingsCopy.transformations = [
        new UrlTransformation(this.headerRule, this.url),
      ];
      console.log(settingsCopy);
      this.$emit("input", settingsCopy);
    },
  },
  beforeMount() {},
};
</script>
