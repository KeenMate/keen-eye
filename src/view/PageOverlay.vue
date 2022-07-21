<template>
  <div class="container">
    <div class="row">
      <div class="col-6"><h3 class="title">KEEN-EYE</h3></div>
      <div class="col-6">
        <CopyHeadersButtonVue :headers="filteredHeaders"
          >Copy selected headers</CopyHeadersButtonVue
        >
        <CopyHeadersButtonVue :headers="requestInfo?.response?.responseHeaders"
          >Copy all headers</CopyHeadersButtonVue
        >
      </div>
    </div>

    <div @mousedown.stop>
      <!-- Settings loaded from <b>{{ level }}</b> -->
      <br />
      <!--   settings: {{ settings }}
      <br /> -->
      <div class="row">
        <div class="col-6">
          Status code:
          <b>{{ requestInfo?.response?.statusCode ?? "loading" }}</b>
        </div>
        <div class="col-6">
          Response took: <b>{{ time ? time + "ms" : "refresh" }}</b>
        </div>
      </div>
      <HeaderRendererVue
        v-if="settings?.headerRules"
        :headers="filteredHeaders"
      >
      </HeaderRendererVue>
      <div class="alert alert-warning" v-if="!settings?.headerRules">
        No header rules selected, you can select them in popup
      </div>

      <div class="row" v-if="requestsRulesSet">
        <div class="col-6"><h4>Requests</h4></div>
        <div class="col-6">
          <button class="btn btn btn-secondary btn-sm" @click="loadRequestInfo">
            Refresh
          </button>
        </div>
      </div>
      <RequestsRendererVue
        v-if="requestsRulesSet && filteredRequests"
        :requests="filteredRequests"
      ></RequestsRendererVue>
    </div>
  </div>
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";
import { getRequestInfo } from "@/helpers/scriptsComunicationHelper";
import CopyHeadersButtonVue from "@/components/CopyHeadersButton.vue";
import RequestsRendererVue from "@/components/RequestsRenderer.vue";
import { matchWithStairs } from "@/helpers/stringHelpers";
import { toRaw } from "@vue/reactivity";
export default {
  components: {
    HeaderRendererVue,
    CopyHeadersButtonVue,
    RequestsRendererVue,
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
    requestsRulesSet() {
      console.log(toRaw(this.settings?.requestsRules));

      if (!this.settings || !this.settings?.requestsRules) {
        return false;
      }
      if (this.settings.requestsRules.length == 0) {
        return false;
      }
      return true;
    },
    filteredHeaders() {
      if (
        !this.requestInfo?.response?.responseHeaders ||
        !Array.isArray(this.settings?.headerRules)
      )
        return [];

      // console.log(toRaw(this.requestInfo));
      return this.requestInfo.response.responseHeaders.filter(
        ({ name: headerName }) => {
          return this.settings?.headerRules?.some((allowed) => {
            return matchWithStairs(headerName, allowed);
          });
        }
      );
    },
    filteredRequests() {
      if (
        !this.requestInfo?.requests ||
        !Array.isArray(this.settings?.requestsRules)
      )
        return [];
      let requestsArray = Object.values(toRaw(this.requestInfo.requests));

      console.log(requestsArray);
      return requestsArray.filter(({ url }) => {
        return this.settings?.requestsRules?.some((allowed) => {
          return matchWithStairs(url, allowed);
        });
      });
    },
    time() {
      // console.log(this.requestInfo);
      // console.log(this.requestInfo?.response?.timeStamp);
      // console.log(this.requestInfo?.request?.timeStamp);
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
      //TODO rework this
      // setTimeout(this.loadRequestInfo, 2000);
    },
  },
  mounted() {
    this.loadRequestInfo();
  },
};
</script>
