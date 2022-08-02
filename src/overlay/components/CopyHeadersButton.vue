<template>
  <button class="btn btn-sm" @click="copy">
    <slot> </slot>
  </button>
</template>
<script>
import { copyTextToClipboard } from "@/helpers/clipboardHelper";

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
