<template>
  <div class="card p-1 shadow-lg">
    <div class="card-body">
      <div class="row">
        <div class="col-10">
          <h-5>{{ request.statusLine }}</h-5>
        </div>
        <div class="col-2">
          <button
            @click="close"
            type="button"
            class="btn-close"
            aria-label="Close"
          ></button>
        </div>
      </div>
      <span class="overflox-auto">{{ request.url }} <br /></span>
      Took: {{ request.took.toFixed(2) }}ms <br />
      Ttfb: {{ request.ttfb.toFixed(2) }}ms <br />
      <header-renderer :headers="request.responseHeaders"> </header-renderer>
    </div>
  </div>
</template>
<script>
import HeaderRenderer from "./HeaderRenderer.vue";
import { closeModal } from "jenesius-vue-modal";
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
  methods: {
    close() {
      closeModal();
    },
  },
};
</script>
