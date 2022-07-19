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
        <button class="btn-danger btn form-control-sm btn-sm" @click="resetDiv">
          Reset overlay position
        </button>
        <button
          class="btn-danger btn form-control-sm btn-sm"
          @click="deleteSetting"
        >
          Delete settings
        </button>
      </div>
      <HeaderSelector
        v-model="allowedOrigins"
        :headers="pageHeaders"
        :level="selectedTab"
      ></HeaderSelector>
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
import HeaderSelector from "@/components/HeaderSelector.vue";
import { refreshCurrentPage } from "@/helpers/helpers";
import { getCurrentTab } from "../helpers/urlHelper";

export default {
  components: { HeaderSelector },
  name: "popupView",
  data() {
    return {
      selectedSettings: {},
      allowedOrigins: [],
      selectedTab: "origin",
      activeSettings: {},
      requestInfo: {},
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
      this.confirmRefresh();
      this.loadSelectedSettings();
    },
    async resetDiv() {
      await setSettings(this.selectedTab, null, null, { x: 0, y: 0 });
      this.confirmRefresh();

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
    },
    async deleteSetting() {
      await deleteSettings(this.selectedTab);
      this.loadSelectedSettings();
      console.log("Settings deleted");
    },
    confirmRefresh() {
      if (confirm("Refresh page")) {
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
