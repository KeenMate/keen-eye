<template>
  <div class="mb-2">
    <button
      @click="$emit('toggle-injection')"
      class="btn-primary btn form-control-sm btn-sm"
      :class="enabled ? 'btn-danger' : 'btn-success'"
    >
      {{ enabled ? "hide" : "show" }}
    </button>
  </div>
  <div class="mb-2">
    <button class="btn-warning btn form-control-sm btn-sm" @click="resetDiv">
      Reset overlay position
    </button>
    {{ selectedSettings?.position }}
  </div>
  <label>Headers</label>

  <div class="mb-2" @keyup.esc.stop>
    <multiselect
      v-model="settings.headerRules"
      :clear-on-select="false"
      :options="pageHeaders"
      :show-labels="false"
      :multiple="true"
      tag-placeholder="add"
      placeholder="Search or add a header rule"
      taggable
      :close-on-select="false"
      @tag="addHeaderRule"
      @input="() => $emit('change')"
      @remove="() => $emit('change')"
      @select="() => $emit('change')"
    >
    </multiselect>
  </div>
  <label>Requests</label>

  <div class="mb-2" @keyup.esc.stop>
    <multiselect
      v-model="settings.requestsRules"
      :options="requests"
      :clear-on-select="false"
      :show-labels="false"
      :multiple="true"
      tag-placeholder="add"
      placeholder="Search or add a request rule"
      taggable
      :close-on-select="false"
      @tag="addRequestRule"
      @input="() => $emit('change')"
      @remove="() => $emit('change')"
      @select="() => $emit('change')"
    >
    </multiselect>
  </div>
  <label>language</label>

  <div class="row mb-2">
    <div class="col-9">
      <multiselect
        @keyup.esc.stop
        v-model="settings.locale"
        :options="langs"
        :multiple="false"
        track-by="code"
        label="name"
        group-values="languages"
        group-label="type"
        :custom-label="customLabel"
        @input="() => $emit('change')"
        @remove="() => $emit('change')"
        @select="() => $emit('change')"
      ></multiselect>
    </div>
    <div class="col-3">
      <button class="btn btn-danger" @click="settings.locale = null">
        Remove
      </button>
    </div>
  </div>
</template>
<script>
import languages from "@/constants/languages";
import Multiselect from "vue-multiselect";

export default {
  name: "BasicSettings",
  components: { Multiselect },
  emits: ["input", "change", "toggleInjection"],
  data() {
    return {};
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

    enabled() {
      return this.settings?.inject ?? false;
    },
    pageHeaders() {
      return (
        this.requestInfo?.response?.responseHeaders?.map((o) => o.name) ?? []
      );
    },
    requests() {
      if (!this.requestInfo?.requests) return [];
      return Object.values(this.requestInfo.requests).map((req) => req.url);
    },
    langs() {
      return languages;
    },
  },
  methods: {
    resetDiv() {
      this.settings.position = { x: 0, y: 0 };
      this.$emit("change");
      console.log(this.settings);
    },
    customLabel(object) {
      return `[${object.code}] ${object.name}`;
    },
    addHeaderRule(val) {
      if (!this.settings.headerRules) this.settings.headerRules = [];
      this.settings?.headerRules.push(val);
    },
    addRequestRule(val) {
      if (!this.settings.requestsRules) this.settings.requestsRules = [];
      this.settings.requestsRules.push(val);
    },
  },
};
</script>
