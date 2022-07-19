<template>
  <div class="container">
    <h4 class="title">Header Explorer</h4>
    response headers{{ JSON.stringify(this.responseHeaders) }}<br />
    allowed headers
    {{ JSON.stringify(this.allowedHeaders) }}
    <br />
    <CopyHeadersButtonVue :headers="responseHeaders"></CopyHeadersButtonVue>
    <HeaderRendererVue :headers="responseHeaders"> </HeaderRendererVue>
  </div>
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";
import { getRequestInfo } from "@/helpers/scriptsComunicationHelper";
import CopyHeadersButtonVue from "@/components/CopyHeadersButton.vue";
// import { toRaw } from "vue";

export default {
  components: {
    HeaderRendererVue,
    CopyHeadersButtonVue,
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
      // console.log(toRaw(this.requestInfo));
      if (!this.requestInfo?.response?.responseHeaders) return [];
      return this.requestInfo.response.responseHeaders.filter((h) => {
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
