<template>
  <table class="table table-striped table-sm">
    <thead class="table-dark">
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Copy</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="header in headers" :key="header.name">
        <td>
          <b>{{ header.name }}</b>
        </td>
        <td>{{ header.value }}</td>

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
