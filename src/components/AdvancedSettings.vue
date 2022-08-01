<template>
  Url tranformation
  <div
    class="form-group"
    v-if="settings.transformations[0].headerRule !== undefined"
  >
    <input
      class="form-control"
      type="text"
      name="headerName"
      v-model="this.settings.transformations[0].headerRule"
    />
  </div>
  <div class="form-group" v-if="settings.transformations[0].url !== undefined">
    <input
      class="form-control"
      type="text"
      name="url"
      v-model="this.settings.transformations[0].url"
    />
  </div>
</template>
<script>
import { UrlTransformation } from "@/types/urlTransformation";
export default {
  name: "AdvancedSettings",
  emits: ["input", "change"],
  data() {
    return {
      name: null,
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
    selectedSettings: {
      handler() {
        this.$emit("input", this.selectedSettings);
      },
      deep: true,
    },
  },
  computed: {
    settings: {
      get() {
        return this.selectedSettings;
      },
      set(newSettings) {
        this.$emit("input", newSettings);
      },
    },
  },
  methods: {
    update() {
      this.settings.transformations = [
        new UrlTransformation(this.name, this.url),
      ];
      this.$emit("change");
    },
  },
  beforeMount() {
    if (
      !this.settings.transformations ||
      this.settings.transformations.length == 0
    ) {
      this.settings.transformations = [{ headerRule: "", url: "" }];
    }
  },
};
</script>
