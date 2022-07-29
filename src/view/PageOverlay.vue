<template>
  <div class="container position-relative">
    <div class="row">
      <div class="col-8">
        <h5 class="title user-select-none" ref="dragg" style="cursor: pointer">
          {{ pageName }}({{ requestInfo?.response?.statusCode ?? "loading" }})
        </h5>
        <h6>{{ time ? time + "ms" : "refresh" }}</h6>
      </div>
      <div class="col-3">
        Copy
        <CopyHeadersButtonVue :headers="filteredHeaders"
          >selected</CopyHeadersButtonVue
        >
        <CopyHeadersButtonVue :headers="requestInfo?.response?.responseHeaders"
          >all</CopyHeadersButtonVue
        >
      </div>
      <div class="col-1">
        <button
          @click="closeOverlay"
          type="button"
          class="btn-close"
          aria-label="Close"
        ></button>
      </div>
    </div>
    <div class="row">
      <div class="col-3">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="useFilters"
            v-model="useFilters"
          />
          <label class="form-check-label" for="useFilters">use filters</label>
        </div>
      </div>
      <div class="col-3"></div>
      <div class="col-3"></div>
    </div>
    <div>
      <div style="max-height: 45vh; overflow-y: auto">
        <HeaderRendererVue
          v-if="settings?.headerRules"
          :headers="filteredHeaders"
        >
        </HeaderRendererVue>

        <div class="alert alert-warning" v-if="!settings?.headerRules">
          No header rules selected, you can select them in popup
        </div>
      </div>
      <div class="row" v-if="requestsRulesSet">
        <div class="col-6">
          <h4>Requests</h4>
        </div>
        <div class="col-6">
          <button class="btn btn btn-secondary btn-sm" @click="loadRequestInfo">
            Refresh
          </button>
        </div>
      </div>
      <div style="max-height: 45vh; overflow-y: auto">
        <RequestsRendererVue
          v-if="requestsRulesSet && filteredRequests"
          :requests="filteredRequests"
        >
        </RequestsRendererVue>
      </div>
    </div>
  </div>
  <widget-container-modal />
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";
import {
  changeInject,
  getRequestInfo,
  saveDivPosition,
} from "@/helpers/scriptsComunicationHelper";
import CopyHeadersButtonVue from "@/components/CopyHeadersButton.vue";
import RequestsRendererVue from "@/components/RequestsRenderer.vue";
import { matchWithStairs } from "@/helpers/stringHelpers";
import { toRaw } from "@vue/reactivity";
import { logEverything } from "@/helpers/urlHelper";
import { container } from "jenesius-vue-modal";
import AddDrag from "@/helpers/dragHelper";
export default {
  components: {
    HeaderRendererVue,
    CopyHeadersButtonVue,
    RequestsRendererVue,
    WidgetContainerModal: container,
  },
  props: {
    settings: Object,
    level: String,
  },
  data() {
    return {
      requestInfo: null,
      useFilters: true,
    };
  },
  computed: {
    requestsRulesSet() {
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
      if (!this.useFilters) return this.requestInfo.response.responseHeaders;

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
      if (!this.useFilters) return requestsArray;

      console.log(requestsArray);
      return requestsArray.filter(({ url }) => {
        return this.settings?.requestsRules?.some((allowed) => {
          return matchWithStairs(url, allowed);
        });
      });
    },
    time() {
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

    pageName() {
      if (!this.requestInfo || !this.requestInfo?.response?.url)
        return undefined;

      return new URL(this.requestInfo?.response?.url).host;
    },
  },
  methods: {
    loadRequestInfo() {
      getRequestInfo().then((requestInfo) => {
        this.requestInfo = requestInfo;
        console.log("request", requestInfo);
        logEverything(requestInfo?.response?.url);
      });
      //TODO rework this
      // setTimeout(this.loadRequestInfo, 2000);
    },
    closeOverlay() {
      changeInject(this.level, false).then((res) => {
        if (res && !res.ok) {
          console.error(res);
          //TODO maybe add real error handling
        }
      });
    },
  },
  async mounted() {
    await this.loadRequestInfo();
    AddDrag(
      this.$refs.dragg,
      "keen-eye-page-overlay-div",
      this.settings.position,
      (pos) => saveDivPosition(pos, this.level)
    );
  },
};
</script>
