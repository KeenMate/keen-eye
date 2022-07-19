<template>
  <div class="form-group">
    <multiselect
      v-if="headers"
      v-model="internalValue"
      :clear-on-select="false"
      :options="headers"
      :show-labels="false"
      :multiple="true"
      tag-placeholder="add"
      placeholder="Search or add a header"
      taggable
      :close-on-select="false"
      @tag="addTag"
    >
    </multiselect>
    <button :class="'btn btn-outline-success'" @click="saveHeaders">
      SAVE HEADERS
    </button>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { setSettings, getSettings } from "../helpers/storageHelper";
import { toRaw } from "vue";
import { refreshCurrentPage } from "@/helpers/helpers";
export default {
  components: { Multiselect },
  props: {
    headers: Array,
    level: String,
  },
  data() {
    return {
      internalValue: null,
    };
  },
  methods: {
    addTag(val) {
      this.internalValue.push(val);
    },
    async saveHeaders() {
      await setSettings(this.level, null, toRaw(this.internalValue));
      if (confirm("Refresh page") === true) {
        console.log("refreshing page");
        refreshCurrentPage();
      }
    },
    loadHeaders() {
      getSettings(this.level).then(
        (r) => (this.internalValue = r?.allowedHeaders ?? [])
      );
    },
  },
  mounted() {
    this.loadHeaders();
  },
  watch: {
    level() {
      this.loadHeaders();
    },
  },
};
</script>
