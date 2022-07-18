<template>
  <button class="btn btn-secondary btn-sm" @click="copy">
    copy all headers
  </button>
</template>
<script>
import { copyTextToClipboard } from "@/helpers/clipboard-helper";

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
  methods: {
    copy() {
      console.log(this.headers);
      let text = this.headers

        .map((header) => header.name + ": " + header.value)
        .join("\n");
      console.log(text);
      copyTextToClipboard(text);
    },
  },
};
</script>
