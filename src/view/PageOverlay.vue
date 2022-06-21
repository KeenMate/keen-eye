<template>
  <h4>Header Explorer</h4>
  <button @click="toggleVisibility">{{ shown ? "hide" : " show" }}</button>
  <div v-show="hidden">
    <HeaderRendererVue :headers="responseHeaders"> </HeaderRendererVue>
  </div>
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
      hidden: false,
    };
  },
  computed: {
    responseHeaders() {
      if (!this.requestInfo?.response?.responseHeaders) return [];
      return this.requestInfo.response.responseHeaders.filter((h) => {
        console.log(h.name);
        return this.allowedHeaders.includes(h.name);
      });
    },
  },
  methods: {
    toggleVisibility() {
      this.hidden = !this.hidden;
    },
  },
  mounted() {
    getRequestInfo().then((requestInfo) => (this.requestInfo = requestInfo));
  },
};
</script>
