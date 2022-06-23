<template>
  <h4 class="title">Header Explorer</h4>
  <HeaderRendererVue :headers="responseHeaders"> </HeaderRendererVue>
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";
import { getRequestInfo } from "@/helpers/scriptsComunicationHelper";

export default {
  components: {
    HeaderRendererVue,
  },
  props: {
    allowedHeaders: Array,
  },
  data() {
    return {
      requestInfo: null,
    };
  },
  computed: {
    responseHeaders() {
      if (!this.requestInfo?.response?.responseHeaders) return [];
      return this.requestInfo.response.responseHeaders.filter((h) => {
        console.log(h.name);
        return this.allowedHeaders?.includes(h.name) ?? false;
      });
    },
  },
  methods: {
    loadRequestInfo() {
      getRequestInfo().then((requestInfo) => (this.requestInfo = requestInfo));
    },
  },
  mounted() {
    this.loadRequestInfo();
  },
};
</script>
