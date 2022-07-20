<template>
  <div style="min-width: 500px; min-height: 600px" class="card">
    <!-- Tabs navs -->
    <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="
            (selectedTab == 'global' ? ' active ' : '') +
            (loadedTab == 'global' ? '  font-weight-bold ' : '')
          "
          @click="changeTab('global')"
          >global</a
        >
      </li>
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="
            (selectedTab == 'domain' ? ' active ' : '') +
            (loadedTab == 'domain' ? '  font-weight-bold ' : '')
          "
          @click="changeTab('domain')"
          >domain</a
        >
      </li>
      <li class="nav-item" role="tab">
        <a
          class="nav-link"
          :class="
            (selectedTab == 'origin' ? ' active ' : '') +
            (loadedTab == 'origin' ? '  font-weight-bold ' : '')
          "
          @click="changeTab('origin')"
          >Origin</a
        >
      </li>
      <li>
        <a
          class="nav-link"
          role="tab"
          :class="
            (selectedTab == 'page' ? ' active ' : '') +
            (loadedTab == 'page' ? '  font-weight-bold ' : '')
          "
          @click="changeTab('page')"
          >Page</a
        >
      </li>
    </ul>
    <!-- Tabs navs -->
    <div class="container">
      <div class="row">
        <div class="col-6"><h3>SETTINGS</h3></div>
        <div class="col-6">
          <div class="mb-2">
            <div class="btn-group">
              <button
                class="btn-danger btn form-control-sm btn-sm"
                @click="deleteSetting"
              >
                Delete settings
              </button>
              <button
                class="btn-info btn form-control-sm btn-sm"
                @click="loadSelectedSettings"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-3" />
      <div class="mb-2">
        <button
          @click="toggleInjection"
          class="btn-primary btn form-control-sm btn-sm"
          :class="enabled ? 'btn-danger' : 'btn-success'"
        >
          {{ enabled ? "disable" : "enable" }}
        </button>
      </div>
      <div class="mb-2">
        <button
          class="btn-warning btn form-control-sm btn-sm"
          @click="resetDiv"
        >
          Reset overlay position
        </button>
        {{ selectedSettings?.position }}
      </div>
      <div class="mb-2">
        <multiselect
          v-model="selectedSettings.headerRules"
          :clear-on-select="false"
          :options="pageHeaders"
          :show-labels="false"
          :multiple="true"
          tag-placeholder="add"
          placeholder="Search or add a header"
          taggable
          :close-on-select="false"
          @tag="addHeaderRule"
          @input="() => (this.changed = true)"
          @remove="() => (this.changed = true)"
          @select="() => (this.changed = true)"
        >
        </multiselect>
      </div>
      <div class="mb-2">
        <multiselect
          v-model="selectedSettings.requestsRules"
          :options="[]"
          :clear-on-select="false"
          :show-labels="false"
          :multiple="true"
          tag-placeholder="add"
          placeholder="Search or add a header"
          taggable
          :close-on-select="false"
          @tag="addRequestRule"
          @input="() => (this.changed = true)"
          @remove="() => (this.changed = true)"
          @select="() => (this.changed = true)"
        >
        </multiselect>
      </div>
      <div class="mb-2">
        <button :class="'btn btn-large btn-outline-success'" @click="save">
          SAVE
        </button>
      </div>

      <div class="alert alert-danger" v-if="changed === true">
        carefull unsaved changes
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
import { EMPTY_SETTINGS } from "@/constants/settings";

export default {
  components: { Multiselect },
  name: "popupView",
  data() {
    return {
      selectedSettings: EMPTY_SETTINGS,
      allowedOrigins: [],
      selectedTab: "origin",
      activeSettings: EMPTY_SETTINGS,
      requestInfo: {},
      changed: false,
      loadedTab: "origin",
    };
  },
  computed: {
    enabled() {
      return this.selectedSettings?.inject ?? false;
    },
    pageHeaders() {
      return (
        this.requestInfo?.response?.responseHeaders?.map((o) => o.name) ?? []
      );
    },
  },
  methods: {
    toggleInjection() {
      this.selectedSettings.inject = !this.enabled;

      console.log(this.selectedSettings);
      this.changed = true;
    },
    resetDiv() {
      this.selectedSettings.position = { x: 0, y: 0 };
      this.changed = true;
      console.log(this.selectedSettings);
    },
    changeTab(changeTo) {
      this.selectedTab = changeTo;
      this.loadSelectedSettings();
    },
    async loadSettings() {
      const { settings: activeSettings, level: selectedTab } =
        await getMostSpecificSettings();
      this.activeSettings = activeSettings;
      this.selectedTab = selectedTab;
      this.loadedTab = selectedTab;
      let currentTab = await getCurrentTab();
      this.requestInfo = await getRequestInfo(currentTab.id);
      this.loadSelectedSettings();
    },
    async loadSelectedSettings() {
      let loadedSettings = await getSettings(this.selectedTab);
      //if settings arent set, use empty settings and allow saving it
      if (!loadedSettings) {
        this.selectedSettings = EMPTY_SETTINGS;
        this.changed = true;
      } else {
        this.selectedSettings = loadedSettings;
        this.changed = false;
      }
      console.debug(toRaw(this.selectedSettings));

      // console.log(await getAll());
    },
    async deleteSetting() {
      if (!confirm("Do you really want to delete this settings?")) return;
      await deleteSettings(this.selectedTab);
      console.log("Settings deleted");

      this.loadSettings();
    },
    pageRefresh() {
      if (confirm("Refresh page")) {
        console.log("refreshing page");
        refreshCurrentPage();
      }
    },
    addHeaderRule(val) {
      this.selectedSettings?.headerRules.push(val);
    },
    addRequestRule(val) {
      if (!this.selectedSettings.requestsRules)
        this.selectedSettings.requestsRules = [];
      this.selectedSettings.requestsRules.push(val);
    },
    async save() {
      //TODO add requestRules to settings
      await setSettings(
        this.selectedTab,
        this.selectedSettings.inject,
        toRaw(this.selectedSettings.headerRules),
        this.selectedSettings.position,
        toRaw(this.selectedSettings.requestsRules)
      );
      this.pageRefresh();
      this.loadSelectedSettings();
    },
  },
  mounted() {
    setTimeout(async () => {
      await this.loadSettings();
      await this.loadSelectedSettings();
    }, 25);
  },
};
</script>
