<template>
  <UrlTranformator
    v-if="transformation.type == 'url'"
    :transformation="transformation"
    :headerValue="headerValue"
    :headers="headers"
  ></UrlTranformator>
</template>

<script>
import { BaseTransformation } from "@/types/baseTransformation";
import UrlTranformator from "./UrlTranformator.vue";

export default {
  name: "TransformationRenderer",
  components: { UrlTranformator },
  props: {
    transformation: {
      type: BaseTransformation,
      required: true,
    },
    headerValue: String,
    headers: Array,
  },
};
</script>
