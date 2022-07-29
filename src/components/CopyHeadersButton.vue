<template>
  <button class="btn btn-secondary btn-sm" @click="copy">
    <slot> </slot>
  </button>
</template>
<script>
import { copyTextToClipboard } from "@/helpers/clipboard-helper";

export default {
  props: {
    headers: Object,
  },
  methods: {
    copy() {
      let text = this.headers

        .map((header) => header.name + ": " + header.value)
        .join("\n");
      copyTextToClipboard(text);
    },
  },
};
</script>
