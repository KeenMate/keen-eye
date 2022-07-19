<template>
  <table class="table table-striped table-sm">
    <thead class="table-dark">
      <tr>
        <th>name</th>
        <th>value</th>
        <th>copy</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="header in headers" :key="header.name">
        <td>
          <b>{{ header.name }}</b>
        </td>
        <td>{{ header.value }}</td>
        <td>
          <button
            class="btn btn-secondary btn-sm"
            @click="copy(header.name, header.value)"
          >
            C
          </button>
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
