<template>
  <h6>Headers</h6>
  <table class="table table-striped table-sm">
    <thead class="table-dark">
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Copy</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="header in headers" :key="header.name" class="autowidth-table">
        <td class="autowidth">
          <b>{{ header.name }}</b>
        </td>
        <td class="limited-width">{{ header.value }}</td>

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

export default {
  props: {
    headers: Object,
  },
  methods: {
    copy(name, value) {
      copyTextToClipboard(`${name}: ${value}`);
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
