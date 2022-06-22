<template>
  <div>
    <multiselect
      v-if="headers"
      v-model="internalValue"
      :options="headers"
      :show-labels="false"
      :multiple="true"
      tag-placeholder="add"
      placeholder="Search or add a header"
      taggable
      @tag="addTag"
    ></multiselect>
    <button @click="saveHeaders">SAVE HEADERS</button>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { setOriginSettings, getOriginSettings } from "../helpers/storageHelper";
import { toRaw } from "vue";
export default {
  components: { Multiselect },
  props: {
    headers: Array,
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
    saveHeaders() {
      setOriginSettings(null, toRaw(this.internalValue));
    },
  },
  mounted() {
    getOriginSettings().then(
      (r) => (this.internalValue = r?.allowedHeaders ?? [])
    );
  },
};
</script>
