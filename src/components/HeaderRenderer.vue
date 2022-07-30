<template>
  <h6>Headers</h6>
  <table class="table table-striped table-sm">
    <thead class="table-dark">
      <tr>
        <th v-if="filtering">
          <span :class="{ 'text-warning': starSelected }" @click="toggleAll"
            >EYE</span
          >
        </th>
        <th>Name</th>
        <th>Value</th>
        <th>Copy</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr
        v-for="(header, index) in headers"
        :key="index"
        class="autowidth-table"
      >
        <td v-if="filtering">
          <span
            :class="{ 'text-warning': headersFilterRules.exists(header.name) }"
            @click="toggleRule(header.name)"
            >eye</span
          >
        </td>
        <td class="autowidth">
          <b>{{ header.name }}</b>
        </td>
        <td class="limited-width">
          <Popper :content="header.value">
            <TransformationRenderer
              v-if="getTransformation(header.name)"
              :headerValue="header.value"
              :transformation="getTransformation(header.name)"
              :headers="headers"
            >
            </TransformationRenderer>
            <template v-else>
              {{ header.value }}
            </template>
          </Popper>
        </td>

        <td
          style="cursor: pointer; user-select: none"
          @click="copy(header.name, header.value)"
        >
          copy
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { copyTextToClipboard } from "@/helpers/clipboard-helper";
import filterRules from "@/helpers/filterRules";
import TransformationRenderer from "./TransformationRenderer.vue";
import { escapeHtml } from "@/helpers/stringHelpers";

export default {
  name: "HeaderRenderer",
  components: { TransformationRenderer },
  props: {
    headers: Object,
    filtering: {
      type: Boolean,
      default: false,
    },
    headersFilterRules: filterRules,
    transformations: Array,
  },
  computed: {
    starSelected() {
      return this.headersFilterRules?.exists("*") != undefined;
    },
  },
  methods: {
    copy(name, value) {
      copyTextToClipboard(`${name}: ${value}`);
    },
    toggleAll() {
      this.headersFilterRules.toggleAll();
    },
    toggleRule(rule) {
      this.headersFilterRules.removeWildCard();
      this.headersFilterRules.toggle(rule);
    },
    getTransformation(name) {
      return this.transformations?.find((trans) => trans.match(name));
    },
    escape(val) {
      return escapeHtml(val);
    },
  },
};
</script>

<style>
.autowidth {
  width: 1px;
}

.limited-width {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
