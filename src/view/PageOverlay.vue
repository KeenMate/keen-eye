<template>
  <div class="container">
    <h4 class="title">Header Explorer</h4>
    Settings loaded from <b>{{ level }}</b>
    <br />
    settings: {{ settings }}
    <br />
    <CopyHeadersButtonVue :headers="responseHeaders"></CopyHeadersButtonVue>
    <HeaderRendererVue :headers="responseHeaders"> </HeaderRendererVue>
  </div>
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";
import { getRequestInfo } from "@/helpers/scriptsComunicationHelper";
import CopyHeadersButtonVue from "@/components/CopyHeadersButton.vue";
import { matchWithStairs } from "@/helpers/stringHelpers";
export default {
  components: {
    HeaderRendererVue,
    CopyHeadersButtonVue,
  },
  props: {
    settings: Array,
    level: String,
  },
  data() {
    return {
      requestInfo: null,
    };
  },
  computed: {
    responseHeaders() {
      if (
        !this.requestInfo?.response?.responseHeaders ||
        !Array.isArray(this.settings?.headerRules)
      )
        return [];

      console.log(matchWithStairs("test", "test"));
      console.log(matchWithStairs("test11", "test*"));
      console.log(matchWithStairs("11test", "*test"));
      return this.requestInfo.response.responseHeaders.filter(
        ({ name: headerName }) => {
          return this.settings?.headerRules?.some((allowed) => {
            return matchWithStairs(headerName, allowed);
          });
        }
      );
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
