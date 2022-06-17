<template>
  <h4>Header Explorer</h4>
  <button @click="toggleVisibility">{{ shown ? "hide" : " show" }}</button>
  <div v-show="hidden">
    <HeaderRendererVue :headers="responseHeaders"> </HeaderRendererVue>
  </div>
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";

export default {
  components: {
    HeaderRendererVue,
  },
  props: {
    allowedHeaders: Array,
  },
  data() {
    return {
      backgroundResponse: null,
      hidden: false,
    };
  },
  computed: {
    responseHeaders() {
      if (!this.backgroundResponse?.response?.responseHeaders) return [];
      return this.backgroundResponse.response.responseHeaders.filter((h) => {
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
    chrome.runtime.sendMessage({ type: "get-headers" }, (response) => {
      console.debug(response);

      this.backgroundResponse = response;
    });
  },
};
</script>
