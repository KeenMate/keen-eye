<template>
  <div class="card p-1 shadow-lg">
    <div class="card-body">
      {{ request.statusLine }} <br />
      <span class="overflox-auto">{{ request.url }} <br /></span>
      Took: {{ request.took.toFixed(2) }}ms <br />
      Ttfb: {{ request.ttfb.toFixed(2) }}ms <br />
      <header-renderer :headers="request.responseHeaders"> </header-renderer>
    </div>
  </div>
</template>
<script>
import HeaderRenderer from "./HeaderRenderer.vue";
export default {
  components: { HeaderRenderer },
  props: {
    request: Object,
  },
  computed: {
    title() {
      return new URL(this.request.url).host;
    },
  },
};
</script>
