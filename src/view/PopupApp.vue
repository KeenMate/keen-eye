<template>
  <div
    style="min-width: 500px; min-height: 600px"
    class="card"
    @keydown.esc.stop.prevent
  >
    <!-- Tabs navs -->
    <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
      <li class="nav-item" role="tab" :style="getColor('global')">
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
      <li class="nav-item" role="tab" :style="getColor('domain')">
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
      <li class="nav-item" role="tab" :style="getColor('origin')">
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
      <li class="nav-item" role="tab" :style="getColor('page')">
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
              <button
                class="btn-muted btn form-control-sm btn-sm"
                @click="copySettings"
              >
                DEBUG
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-3" />
      <basic-settings
        :selectedSettings="selectedSettings"
        :requestInfo="requestInfo"
        @input="(newVal) => (this.selectedSettings = newVal)"
        @change="changed = true"
        @toggle-injection="toggleInjection"
      ></basic-settings>
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
import {
  getRequestInfo,
  sendSettingsChanged,
} from "../helpers/scriptsComunicationHelper";
import { refreshCurrentPage } from "@/helpers/helpers";
import { getCurrentTab } from "../helpers/urlHelper";
import { toRaw } from "vue";
import { EMPTY_SETTINGS } from "@/constants/settings";
import { getLevelColor } from "@/helpers/helpers";
import { copyTextToClipboard } from "@/helpers/clipboard-helper";
import BasicSettings from "@/components/BasicSettings.vue";
export default {
  name: "popupView",
  components: { BasicSettings },
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
  methods: {
    getColor(level) {
      return `background-color: ${getLevelColor(level)}`;
    },
    async toggleInjection() {
      console.log("TOOOGGGLLLIIING");
      this.selectedSettings.inject = !this.selectedSettings.inject;
      await setSettings(this.selectedTab, {
        inject: this.selectedSettings.inject,
      });
      sendSettingsChanged();
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
    },
    async deleteSetting() {
      if (!confirm("Do you really want to delete this settings?")) return;
      await deleteSettings(this.selectedTab);

      this.loadSettings();
    },
    pageRefresh() {
      if (confirm("Refresh page")) {
        refreshCurrentPage();
      }
    },

    async save() {
      console.log(toRaw(this.selectedSettings));

      // * use toraw for all nonsimple types
      await setSettings(this.selectedTab, {
        inject: this.selectedSettings.inject,
        headerRules: toRaw(this.selectedSettings.headerRules),
        position: this.selectedSettings.position,
        requestsRules: toRaw(this.selectedSettings.requestsRules),
        locale: toRaw(this.selectedSettings.locale),
      });
      sendSettingsChanged();
      // this.pageRefresh();
      this.loadSelectedSettings();
    },
    copySettings() {
      copyTextToClipboard(JSON.stringify(toRaw(this.selectedSettings)));
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
