<template>
  Url tranformation

  <div class="form-group">
    <label>Header Rule</label>
    <input
      @change="update"
      class="form-control"
      type="text"
      name="headerName"
      v-model="headerRule"
    />
  </div>

  <div class="form-group">
    <label>Url</label>
    <input
      @change="update"
      class="form-control"
      type="text"
      name="url"
      v-model="url"
    />
  </div>
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
      this.parse(newVal);
    },
  },
  methods: {
    update() {
      let settingsCopy = { ...this.selectedSettings };

      settingsCopy.transformations = [
        new UrlTransformation(this.headerRule ?? "", this.url ?? ""),
      ];

      this.$emit("input", settingsCopy);
      this.$emit("change");
    },
    parse(newVal) {
      let tranformation = newVal?.transformations?.[0];

      if (tranformation) {
        this.headerRule = tranformation.headerRule;
        this.url = tranformation.url;
      } else {
        this.headerRule = "";
        this.url = "";
      }
    },
  },
  mounted() {
    this.parse(this.selectedSettings);
  },
};
</script>
