<template>
  <h6>Headers</h6>
  <table class="table table-striped table-sm">
    <thead class="table-dark">
      <tr>
        <th>
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
      <tr v-for="header in headers" :key="header.name" class="autowidth-table">
        <td>
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
            {{ header.value }}
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
  {{ this.headersFilterRules.rules }}
</template>
<script>
import { copyTextToClipboard } from "@/helpers/clipboard-helper";
import filterRules from "@/helpers/filterRules";

export default {
  props: {
    headers: Object,
    headersFilterRules: filterRules,
  },
  computed: {
    starSelected() {
      return this.headersFilterRules.exists("*") != undefined;
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
