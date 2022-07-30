<template>
  <a :href="link" target="_blank">{{ headerValue }}</a>
</template>

<script>
import { UrlTransformation } from "@/types/urlTransformation";

export default {
  name: "UrlTransformator",
  props: {
    transformation: {
      type: UrlTransformation,
      required: true,
    },
    headerValue: String,
  },
  computed: {
    link() {
      return this.transformation.getTranformedUrl(this.headerValue);
    },
  },
};
</script>
