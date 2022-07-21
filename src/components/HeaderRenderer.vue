<template>
  <table class="table table-striped table-sm">
    <thead class="table-dark">
      <tr>
        <th>name</th>
        <th>value</th>
      </tr>
    </thead>
    <tbody class="table-group-divider" style="cursor: pointer;">
      <tr
        v-for="header in headers"
        :key="header.name"
        @click="copy(header.name, header.value)"
      >
        <td>
          <b>{{ header.name }}</b>
        </td>
        <td>{{ header.value }}</td>
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
