<template>
  <div style="min-width: 500px; min-height: 600px" class="card">
    <!-- Tabs navs -->
    <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="selectedTab == 'global' ? 'active' : ''"
          @click="changeTab('global')"
          >global</a
        >
      </li>
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="selectedTab == 'domain' ? 'active' : ''"
          @click="changeTab('domain')"
          >domain</a
        >
      </li>
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="selectedTab == 'origin' ? 'active' : ''"
          @click="changeTab('origin')"
          >Origin</a
        >
      </li>
      <li>
        <a
          class="nav-link"
          role="tab"
          :class="selectedTab == 'page' ? 'active' : ''"
          @click="changeTab('page')"
          >Page</a
        >
      </li>
    </ul>
    <!-- Tabs navs -->

    <div class="container">
      <h3>SETTINGS</h3>
      <div class="form-group">
        <button
          @click="toggleInjection"
          class="btn-primary btn form-control-sm btn-sm"
          :class="enabled ? 'btn-danger' : 'btn-success'"
        >
          {{ enabled ? "disable" : "enable" }}
        </button>
        <button
          class="btn-warning btn form-control-sm btn-sm"
          @click="resetDiv"
        >
          Reset overlay position
        </button>
        <button
          class="btn-danger btn form-control-sm btn-sm"
          @click="deleteSetting"
        >
          Delete settings
        </button>
      </div>
      <div class="form-group">
        <multiselect
          v-if="pageHeaders"
          v-model="selectedHeaders"
          :clear-on-select="false"
          :options="pageHeaders"
          :show-labels="false"
          :multiple="true"
          tag-placeholder="add"
          placeholder="Search or add a header"
          taggable
          :close-on-select="false"
          @tag="addTag"
        >
        </multiselect>
        <button :class="'btn btn-outline-success'" @click="saveHeaders">
          SAVE HEADERS
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deleteSettings,
  getMostSpecificSettings,
  getSettings,
  setSettings,
} from "../helpers/storageHelper";
import { getRequestInfo } from "../helpers/scriptsComunicationHelper";
import { refreshCurrentPage } from "@/helpers/helpers";
import { getCurrentTab } from "../helpers/urlHelper";
import Multiselect from "vue-multiselect";
import { toRaw } from "vue";

export default {
  components: { Multiselect },
  name: "popupView",
  data() {
    return {
      selectedSettings: {},
      allowedOrigins: [],
      selectedTab: "origin",
      activeSettings: {},
      requestInfo: {},
      selectedHeaders: [],
    };
  },
  computed: {
    enabled() {
      console.log("updating selected settings");
      console.log(this.selectedSettings);
      console.log(this.selectedSettings?.inject);
      return this.selectedSettings?.inject ?? false;
    },
    pageHeaders() {
      return (
        this.requestInfo?.response?.responseHeaders?.map((o) => o.name) ?? []
      );
    },
  },
  methods: {
    async toggleInjection() {
      await setSettings(this.selectedTab, !this.enabled);
      this.pageRefresh();
      this.loadSelectedSettings();
    },
    async resetDiv() {
      await setSettings(this.selectedTab, undefined, undefined, { x: 0, y: 0 });
      this.pageRefresh();
      this.loadSelectedSettings();
    },
    async loadSettings() {
      const { settings: activeSettings, level: selectedTab } =
        await getMostSpecificSettings();
      this.activeSettings = activeSettings;
      this.selectedTab = selectedTab;
      let currentTab = await getCurrentTab();
      this.requestInfo = await getRequestInfo(currentTab.id);
    },
    changeTab(changeTo) {
      this.selectedTab = changeTo;
      this.loadSelectedSettings();
    },
    async loadSelectedSettings() {
      this.selectedSettings = await getSettings(this.selectedTab);
      console.log(toRaw(this.selectedSettings));
      this.selectedHeaders = this.selectedSettings?.allowedHeaders ?? [];
      console.log(toRaw(this.selectedHeaders));
    },
    async deleteSetting() {
      await deleteSettings(this.selectedTab);
      console.log("Settings deleted");

      this.loadSelectedSettings();
      this.loadSettings();
    },
    pageRefresh() {
      if (confirm("Refresh page")) {
        console.log("refreshing page");
        refreshCurrentPage();
      }
    },
    addTag(val) {
      this.selectedHeaders.push(val);
    },
    async saveHeaders() {
      await setSettings(
        this.selectedTab,
        undefined,
        toRaw(this.selectedHeaders)
      );
      if (confirm("Refresh page") === true) {
        console.log("refreshing page");
        refreshCurrentPage();
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.loadSettings();
      this.loadSelectedSettings();
    }, 25);
  },
};
</script>
