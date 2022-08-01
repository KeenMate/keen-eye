<template>
  <div class="container position-relative pt-2 pb-2">
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
      <div class="col-3">
        <button
          class="btn btn-sm"
          :class="{
            'btn-secondary': !changesToSave,
            'btn-success': changesToSave,
          }"
          @click="saveSettings"
        >
          save settings
        </button>
      </div>
      <div class="col-3"></div>
    </div>
    <div>
      <div style="max-height: 45vh; overflow-y: auto">
        <HeaderRendererVue
          v-if="headersFilterRules"
          :filtering="true"
          :headers="filteredHeaders"
          :headersFilterRules="headersFilterRules"
          :transformations="settings.transformations"
        >
        </HeaderRendererVue>
      </div>
      <template v-if="requestsRulesSet || !useFilters">
        <div class="row">
          <div class="col-6">
            <h4>Requests</h4>
          </div>
        </div>
        <div style="max-height: 45vh; overflow-y: auto">
          <RequestsRendererVue
            v-if="filteredRequests"
            :requests="filteredRequests"
          >
          </RequestsRendererVue>
        </div>
      </template>
    </div>
  </div>
  <WidgetContainerModal />
</template>

<script>
import HeaderRendererVue from "@/components/HeaderRenderer.vue";
setSettings;
import CopyHeadersButtonVue from "@/components/CopyHeadersButton.vue";
import RequestsRendererVue from "@/components/RequestsRenderer.vue";
import { toRaw } from "@vue/reactivity";
import { logEverything } from "@/helpers/urlHelper";
import { container } from "jenesius-vue-modal";
import AddDrag from "@/helpers/dragHelper";
import FilterRules from "@/helpers/filterRules";
import { newRequests } from "@/constants/messages";
import { containerName } from "@/constants/overlay";
import {
  changeInject,
  getRequestInfo,
  saveDivPosition,
  setSettings,
} from "@/providers/messagingProvider";

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
      headersFilterRules: null,
      requestsFilterRules: null,
      changesToSave: false,
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
      if (this.headersFilterRules === null) return [];

      if (!this.useFilters) return this.requestInfo?.response?.responseHeaders;

      return this.headersFilterRules.filter(
        this.requestInfo?.response?.responseHeaders,
        "name"
      );
    },
    filteredRequests() {
      if (this.requestsFilterRules === null || !this.requestInfo?.requests)
        return [];
      let requestsArray = Object.values(toRaw(this.requestInfo?.requests));
      if (!this.useFilters) return requestsArray;
      return this.requestsFilterRules.filter(requestsArray, "url");
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
    async loadRequestInfo() {
      let requestInfo = await getRequestInfo();
      this.requestInfo = requestInfo;
      console.log("request", requestInfo);
      logEverything(requestInfo?.response?.url);
    },
    async closeOverlay() {
      let response = await changeInject(this.level, false);
      if (response && !response.ok) {
        console.error(response);
        //TODO maybe add real error handling
      }
    },
    saveSettings() {
      setSettings(this.level, {
        headerRules: toRaw(this.headersFilterRules.rules),
      });
    },
    createFilterObjects(settings) {
      this.changesToSave = false;
      this.headersFilterRules = new FilterRules(
        settings.headerRules,
        () => (this.changesToSave = true)
      );
      this.requestsFilterRules = new FilterRules(settings.requestsRules);
    },
  },
  watch: {
    settings(newVal) {
      this.createFilterObjects(newVal);
    },
  },

  async mounted() {
    await this.loadRequestInfo();
    this.createFilterObjects(this.settings);

    AddDrag(this.$refs.dragg, containerName, this.settings.position, (pos) =>
      saveDivPosition(this.level, pos)
    );

    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type == newRequests) {
        this.requestInfo.requests = message.data;
      }
    });
  },
};
</script>
