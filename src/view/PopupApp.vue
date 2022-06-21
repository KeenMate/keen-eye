<template>
  <b>SETTINGS</b>
  <button @click="toggleInjection">TOGGLE</button>
  {{ JSON.stringify(originSettings) }}
</template>

<script>
import { getOriginSettings, setInjection } from "../helpers/storageHelper";

export default {
  name: "popupView",
  data() {
    return {
      originSettings: {},
    };
  },
  methods: {
    async toggleInjection() {
      await setInjection(!this.originSettings?.inject ?? true);
      this.loadSettings();
    },
    loadSettings() {
      getOriginSettings().then((r) => (this.originSettings = r));
    },
  },
  mounted() {
    this.loadSettings();
  },
};
</script>
