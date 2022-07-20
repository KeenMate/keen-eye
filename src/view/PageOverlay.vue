<template>
  <div class="container">
    <div class="row">
      <div class="col-6"><h4 class="title">KEEN-EYE</h4></div>
      <div class="col-6">
        <CopyHeadersButtonVue :headers="responseHeaders"></CopyHeadersButtonVue>
      </div>
    </div>

    Settings loaded from <b>{{ level }}</b>
    <br />
    <!--   settings: {{ settings }}
    <br /> -->
    <div class="row">
      <div class="col-6">
        Status code: <b>{{ requestInfo?.response?.statusCode ?? "loading" }}</b>
      </div>
      <div class="col-6">
        Response took: <b>{{ time ? time + "ms" : "loading" }}</b>
      </div>
    </div>
    Try to refresh page if it is taking too long to load.Turn of in popup
    <HeaderRendererVue :headers="responseHeaders"> </HeaderRendererVue>
  </div>
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";
import { getRequestInfo } from "@/helpers/scriptsComunicationHelper";
import CopyHeadersButtonVue from "@/components/CopyHeadersButton.vue";
import { matchWithStairs } from "@/helpers/stringHelpers";
import { toRaw } from "@vue/reactivity";
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

      console.log(toRaw(this.requestInfo));
      return this.requestInfo.response.responseHeaders.filter(
        ({ name: headerName }) => {
          return this.settings?.headerRules?.some((allowed) => {
            return matchWithStairs(headerName, allowed);
          });
        }
      );
    },
    time() {
      console.log(this.requestInfo);
      console.log(this.requestInfo?.response?.timeStamp);
      console.log(this.requestInfo?.request?.timeStamp);
      if (
        !this.requestInfo ||
        !this.requestInfo?.response?.timeStamp ||
        !this.requestInfo?.request?.timeStamp
      )
        return undefined;
      return (
        this.requestInfo.response.timeStamp - this.requestInfo.request.timeStamp
      ).toFixed(2);
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
