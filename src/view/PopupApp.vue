<template>
  <div style="min-width: 500px; min-height: 400px">
    <h4>SETTINGS</h4>
    <button @click="toggleInjection">
      {{ enabled ? "disable" : "enable" }}
    </button>
    <HeaderSelector
      v-model="allowedOrigins"
      :headers="pageHeaders"
    ></HeaderSelector>
  </div>
</template>

<script>
import {
  getOriginSettings,
  setOriginSettings,
  getCurrentTab,
} from "../helpers/storageHelper";
import { getRequestInfo } from "../helpers/scriptsComunicationHelper";
import HeaderSelector from "@/components/HeaderSelector.vue";

export default {
  components: { HeaderSelector },
  name: "popupView",
  data() {
    return {
      originSettings: {},
      allowedOrigins: [],
      pageHeaders: [],
    };
  },
  computed: {
    enabled() {
      return this.originSettings?.inject ?? true;
    },
  },
  methods: {
    async toggleInjection() {
      await setOriginSettings(!this.originSettings?.inject ?? true, null);
      this.loadSettings();
    },
    async loadSettings() {
      getOriginSettings().then((r) => (this.originSettings = r));
      let currentTab = await getCurrentTab();
      getRequestInfo(currentTab.id).then((r) => {
        this.pageHeaders =
          r?.response?.responseHeaders?.map((o) => o.name) ?? [];
      });
    },
  },
  mounted() {
    this.loadSettings();
  },
};
</script>
