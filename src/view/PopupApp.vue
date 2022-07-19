<template>
  <div style="min-width: 500px; min-height: 600px" class="card">
    <!-- Tabs navs -->
    <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="currentTab == 'domain' ? 'active' : ''"
          @click="changeTab('domain')"
          >domain</a
        >
      </li>
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="currentTab == 'origin' ? 'active' : ''"
          @click="changeTab('origin')"
          >Origin</a
        >
      </li>
      <li>
        <a
          class="nav-link"
          role="tab"
          :class="currentTab == 'page' ? 'active' : ''"
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
      </div>
      <HeaderSelector
        v-model="allowedOrigins"
        :headers="pageHeaders"
      ></HeaderSelector>
    </div>
  </div>
</template>

<script>
import { getSettings, setSettings } from "../helpers/storageHelper";
import { getRequestInfo } from "../helpers/scriptsComunicationHelper";
import HeaderSelector from "@/components/HeaderSelector.vue";
import { refreshCurrentPage } from "@/helpers/helpers";
import { getCurrentTab } from "../helpers/urlHelper";

export default {
  components: { HeaderSelector },
  name: "popupView",
  data() {
    return {
      originSettings: {},
      allowedOrigins: [],
      pageHeaders: [],
      currentTab: "origin",
    };
  },
  computed: {
    enabled() {
      return this.originSettings?.inject ?? false;
    },
  },
  methods: {
    async toggleInjection() {
      await setSettings(!this.enabled, null);
      if (confirm("Refresh page") === true) {
        console.log("refreshing page");
        refreshCurrentPage();
      }
      this.loadSettings();
    },
    async resetDiv() {
      await setSettings(null, null, { x: 0, y: 0 });
      if (confirm("Refresh page") === true) {
        console.log("refreshing page");
        refreshCurrentPage();
      }
      this.loadSettings();
    },
    async loadSettings() {
      getSettings().then((r) => (this.originSettings = r));
      let currentTab = await getCurrentTab();
      getRequestInfo(currentTab.id).then((r) => {
        this.pageHeaders =
          r?.response?.responseHeaders?.map((o) => o.name) ?? [];
      });
    },
    changeTab(changeTo) {
      console.log(`changing tab to ${changeTo}`);
      //TODO load new settings...
      this.currentTab = changeTo;
    },
  },
  mounted() {
    setTimeout(() => this.loadSettings(), 25);
  },
};
</script>
