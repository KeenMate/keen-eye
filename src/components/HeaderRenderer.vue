<template>
  <div v-for="header in headers" :key="header.name">
    <b>{{ header.name }}</b>
    : {{ header.value }}
  </div>
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
