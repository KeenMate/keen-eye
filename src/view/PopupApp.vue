<template>
  <div
    style="min-width: 500px; min-height: 600px"
    class="card"
    @keydown.esc.stop.prevent
  >
    <!-- Tabs navs -->
    <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
      <li class="nav-item" role="tab" :style="getColor(levels.global)">
        <a
          class="nav-link"
          :class="{
            active: selectedTab == levels.global,
            'font-weight-bold': loadedTab == levels.global,
          }"
          @click="changeTab(levels.global)"
          >global</a
        >
      </li>
      <li class="nav-item" role="tab" :style="getColor(levels.domain)">
        <a
          class="nav-link"
          :class="{
            active: selectedTab == levels.domain,
            'font-weight-bold': loadedTab == levels.domain,
          }"
          @click="changeTab(levels.domain)"
          >domain</a
        >
      </li>
      <li class="nav-item" role="tab" :style="getColor(levels.origin)">
        <a
          class="nav-link"
          :class="{
            active: selectedTab == levels.origin,
            'font-weight-bold': loadedTab == levels.origin,
          }"
          @click="changeTab(levels.origin)"
          >Origin</a
        >
      </li>
      <li class="nav-item" role="tab" :style="getColor(levels.page)">
        <a
          class="nav-link"
          role="tab"
          :class="{
            active: selectedTab == levels.page,
            'font-weight-bold': loadedTab == levels.page,
          }"
          @click="changeTab(levels.page)"
          >Page</a
        >
      </li>
    </ul>
    <!-- Tabs navs -->
    <div class="mx-2 mb-2">
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
      <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
        <li class="nav-item" role="tab">
          <a
            class="nav-link"
            :class="settingsTab == 'basic' ? ' active ' : ''"
            @click="settingsTab = 'basic'"
            >basic</a
          >
        </li>
        <li class="nav-item" role="tab">
          <a
            class="nav-link"
            :class="settingsTab == 'advanced' ? ' active ' : ''"
            @click="settingsTab = 'advanced'"
            >advanced</a
          >
        </li>
      </ul>
      <BasicSettings
        v-if="settingsTab == 'basic'"
        :selectedSettings="selectedSettings"
        :requestInfo="requestInfo"
        @input="(newVal) => (this.selectedSettings = newVal)"
        @change="changed = true"
        @toggle-injection="toggleInjection"
      ></BasicSettings>
      <AdvancedSettings
        v-if="settingsTab == 'advanced'"
        :selectedSettings="selectedSettings"
        :requestInfo="requestInfo"
        @input="(newVal) => (this.selectedSettings = newVal)"
        @change="changed = true"
      >
      </AdvancedSettings>
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
import { refreshCurrentPage } from "@/helpers/helpers";
import { toRaw } from "vue";
import { EMPTY_SETTINGS } from "@/settings/settingConstants";
import { getLevelColor } from "@/helpers/helpers";
import { copyTextToClipboard } from "@/helpers/clipboardHelper";
import BasicSettings from "@/components/BasicSettings.vue";
import AdvancedSettings from "@/components/AdvancedSettings.vue";
import { levels } from "@/settings/settingConstants";
import settingsProvider from "@/settings/settingsProvider";
import {
  getRequestInfo,
  sendSettingsChanged,
} from "@/messaging/messagingProvider";
import { getCurrentTab } from "@/providers/chromeApiProvider";

export default {
  name: "popupApp",
  components: {
    BasicSettings,
    AdvancedSettings,
  },
  data() {
    return {
      selectedSettings: EMPTY_SETTINGS,
      allowedOrigins: [],
      selectedTab: "origin",
      activeSettings: EMPTY_SETTINGS,
      requestInfo: {},
      changed: false,
      loadedTab: "origin",
      settingsTab: "basic",
    };
  },
  computed: {
    levels() {
      return levels;
    },
  },
  methods: {
    getColor(level) {
      return { "background-color": getLevelColor(level) };
    },
    async toggleInjection() {
      console.log("TOOOGGGLLLIIING");
      this.selectedSettings.inject = !this.selectedSettings.inject;
      await settingsProvider.setSettings(this.selectedTab, {
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
        await settingsProvider.getMostSpecificSettings();
      this.activeSettings = activeSettings;
      this.selectedTab = selectedTab;
      this.loadedTab = selectedTab;
      let currentTab = await getCurrentTab();
      this.requestInfo = await getRequestInfo(currentTab.id);
      this.loadSelectedSettings();
    },
    async loadSelectedSettings() {
      let loadedSettings = await settingsProvider.getSettings(this.selectedTab);
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
      await settingsProvider.deleteSettings(this.selectedTab);

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
      await settingsProvider.setSettings(this.selectedTab, {
        inject: this.selectedSettings.inject,
        headerRules: toRaw(this.selectedSettings.headerRules),
        position: this.selectedSettings.position,
        requestsRules: toRaw(this.selectedSettings.requestsRules),
        locale: toRaw(this.selectedSettings.locale),
        transformations: toRaw(this.selectedSettings.transformations),
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
