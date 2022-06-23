<template>
  <table class="table table-striped table-sm">
    <thead>
      <tr>
        <th>name</th>
        <th>value</th>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <tr v-for="header in headers" :key="header.name">
        <td>
          <b>{{ header.name }}</b>
        </td>
        <td>{{ header.value }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    headers: Object,
  },
  watch: {
    headers(newheader, oldheader) {
      console.log(newheader);
      console.log(oldheader);
    },
  },
};
</script>
